export interface Ingredient {
    name: string;
    quantity: string;
    unit: string;
}

export interface Recipe {
    dishName: string;
    ingredients: Ingredient[];
    directions: string[];
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    difficulty?: string;
    imageUrl?: string;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface APIRecipe {
    user_name: string;
    title: string;
    description: string;
    image: string | null;
    prep_time_min: number;
    cook_time_min: number;
    difficulty: string;
    categories: string[];
    tags: string[];
    average_rating: number;
}

export interface RecipeListResponse {
    data: APIRecipe[];
}

export interface Ingredient {
    name: string;
    quantity: string;
    unit: string;
}

export interface Instruction {
    step: number;
    text: string;
}

export interface CreateRecipeResponse {
    data: APIRecipe;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    _id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}
