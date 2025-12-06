import { GoogleGenAI, Type, Modality } from '@google/genai';
import type { Recipe, ChatMessage } from '../types';

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const RECIPE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        dishName: {
            type: Type.STRING,
            description: 'The name of the Filipino dish.',
        },
        ingredients: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
                description: 'An ingredient for the recipe, including quantity.',
            },
            description: 'A list of all ingredients required for the dish.',
        },
        directions: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
                description: 'A single step in the cooking instructions.',
            },
            description: 'The step-by-step cooking directions.',
        },
    },
    required: ['dishName', 'ingredients', 'directions'],
};

export const analyzeDish = async (imageFile: File | null, description: string): Promise<Recipe> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    // Fix: The prompt parts for a multipart request should be an array of Part objects (e.g. {text: string} or {inlineData: ...}), not a mix of objects and strings.
    const promptParts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] =
        [];

    let promptText = `
        Analyze the user's request to identify a Filipino dish.
        User's text description: "${description || 'No description provided.'}"
        
        1. Identify the specific name of the dish from the image and/or text.
        2. Provide a comprehensive list of ingredients with quantities.
        3. Provide the detailed step-by-step cooking directions.

        Return the response in JSON format. If you cannot confidently identify the dish as Filipino cuisine, return a JSON object with a "dishName" of "Unknown Dish" and empty arrays for ingredients and directions.
    `;

    if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        promptParts.push(imagePart);
    }

    promptParts.push({ text: promptText });

    const recipeResult = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts: promptParts },
        config: {
            responseMimeType: 'application/json',
            responseSchema: RECIPE_SCHEMA,
        },
    });

    const recipeResponseText = recipeResult.text.trim();
    const recipeData: Omit<Recipe, 'imageUrl'> = JSON.parse(recipeResponseText);

    if (recipeData.dishName.toLowerCase() === 'unknown dish') {
        return { ...recipeData, imageUrl: undefined };
    }

    // Generate an image for the identified dish, whether from text or image
    const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    text: `A delicious-looking, professionally photographed plate of Filipino ${recipeData.dishName}`,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    let imageUrl: string | undefined = imageFile ? URL.createObjectURL(imageFile) : undefined;

    if (!imageFile) {
        for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                break;
            }
        }
    }

    return { ...recipeData, imageUrl };
};

const CHAT_RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        responseText: {
            type: Type.STRING,
            description: "A conversational, helpful response to the user's message.",
        },
        recipeUpdated: {
            type: Type.BOOLEAN,
            description:
                "Set to true only if the user's request resulted in a change to the recipe's ingredients or directions.",
        },
        updatedRecipe: {
            type: Type.OBJECT,
            description:
                'The complete, updated recipe object. Provide this field ONLY if recipeUpdated is true.',
            properties: RECIPE_SCHEMA.properties,
            required: RECIPE_SCHEMA.required,
        },
    },
    required: ['responseText', 'recipeUpdated'],
};

export const continueRecipeConversation = async (
    currentRecipe: Recipe,
    chatHistory: ChatMessage[],
    newUserMessage: string
): Promise<{ responseText: string; updatedRecipe: Recipe | null }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const historyForPrompt = chatHistory
        .map((msg) => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
        .join('\n');

    const prompt = `
      You are "Kusina Assistant", an expert Filipino chef AI. You are having a conversation with a user about a recipe for "${currentRecipe.dishName}".

      Current Recipe:
      - Ingredients: ${JSON.stringify(currentRecipe.ingredients)}
      - Directions: ${JSON.stringify(currentRecipe.directions)}

      Conversation History:
      ${historyForPrompt}

      User's new message: "${newUserMessage}"

      Your tasks:
      1. Analyze the user's message to understand their intent (e.g., asking a question, requesting a modification like adding/removing an ingredient, asking for suggestions).
      2. Formulate a helpful, conversational \`responseText\`.
      3. If the user's request requires changing the recipe:
          a. Determine if the change is feasible and makes sense for the dish.
          b. If it is, create a complete, updated version of the recipe. Integrate the change naturally into the ingredients and directions.
          c. Set \`recipeUpdated\` to true and provide the full \`updatedRecipe\` object.
      4. If the user is just asking a question or the request doesn't change the recipe, set \`recipeUpdated\` to false and do not provide the \`updatedRecipe\` object.

      Respond STRICTLY in the JSON format defined by the schema.
    `;

    const result = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: CHAT_RESPONSE_SCHEMA,
        },
    });

    const responseText = result.text.trim();
    const responseData = JSON.parse(responseText);

    const updatedRecipe =
        responseData.recipeUpdated && responseData.updatedRecipe
            ? { ...responseData.updatedRecipe, imageUrl: currentRecipe.imageUrl }
            : null;

    return {
        responseText: responseData.responseText,
        updatedRecipe: updatedRecipe,
    };
};
