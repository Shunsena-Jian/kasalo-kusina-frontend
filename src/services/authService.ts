import { apiFetch } from './api';

export interface User {
    id: string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    user_type: string;
    user_status: string;
    created_at: string;
    updated_at: string;
}

interface AuthResponse {
    data: User;
}

export const authService = {
    login: async (email: string, password: string): Promise<User> => {
        const response = await apiFetch<AuthResponse>(`/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        localStorage.setItem('session', JSON.stringify(response.data));
        return response.data;
    },

    register: async (username: string, email: string, password: string, first_name: string, last_name: string, user_type: string = 'kasalo'): Promise<User> => {
        const response = await apiFetch<AuthResponse>(`/auth/register`, {
            method: 'POST',
            body: JSON.stringify({ username, email, password, first_name, last_name, user_type }),
        });

        localStorage.setItem('session', JSON.stringify(response.data));
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('session');
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiFetch<AuthResponse>(`/auth/me`);
        return response.data;
    },
};
