const API_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export class ApiError extends Error {
    public data: any;

    constructor(message: string, data: any) {
        super(message);
        this.name = 'ApiError';
        this.data = data;
    }
}

export const apiFetch = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    const token = localStorage.getItem('token');

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        const errorMessage = errorData.message ||
            (Array.isArray(errorData.errors) ? errorData.errors.map((e: any) => e.msg).join(', ') : errorData.errors) ||
            errorData.error ||
            `Error: ${response.status} ${response.statusText}`;

        throw new ApiError(errorMessage, errorData);
    }

    return response.json();
};
