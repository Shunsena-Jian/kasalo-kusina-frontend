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
