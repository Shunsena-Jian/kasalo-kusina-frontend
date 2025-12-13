import { apiFetch } from './api';
import { Category } from '../types';

interface CategoriesResponse {
    data: Category[];
}

export const categoryService = {
    getCategories: async (): Promise<Category[]> => {
        const response = await apiFetch<CategoriesResponse>('/categories');
        return response.data;
    },
};
