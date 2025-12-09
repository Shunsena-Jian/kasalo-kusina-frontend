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
    }
};
