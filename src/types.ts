export interface Recipe {
    dishName: string;
    ingredients: string[];
    directions: string[];
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
