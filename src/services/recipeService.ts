import { RecipeListResponse } from '../types';
import { apiFetch } from './api';

export const recipeService = {
    async getFeaturedRecipes(): Promise<RecipeListResponse> {
        return apiFetch<RecipeListResponse>('/recipes/featured');
    },

    async getNewRecipes(): Promise<RecipeListResponse> {
        return apiFetch<RecipeListResponse>('/recipes/new');
    },

    async getHighRatedRecipes(): Promise<RecipeListResponse> {
        return apiFetch<RecipeListResponse>('/recipes/high-rated');
    },

    async createRecipe(formData: FormData): Promise<RecipeListResponse> { // Using RecipeListResponse format or specific response
        return apiFetch<RecipeListResponse>('/recipes', {
            method: 'POST',
            body: formData,
        });

    },

    async searchRecipes(query: string): Promise<RecipeListResponse> {
        return apiFetch<RecipeListResponse>(`/recipes?q=${encodeURIComponent(query)}`);
    }
};
