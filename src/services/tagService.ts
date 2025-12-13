import { apiFetch } from './api';
import { Tag } from '../types';

interface TagsResponse {
    data: Tag[];
}

export const tagService = {
    getTags: async (): Promise<Tag[]> => {
        const response = await apiFetch<TagsResponse>('/tags');
        return response.data;
    },
};
