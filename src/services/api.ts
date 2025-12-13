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
    const defaultHeaders: Record<string, string> = {};

    if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: 'include',
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            window.dispatchEvent(new Event('auth:unauthorized'));
        }

        const errorData = await response.json().catch(() => ({}));

        const errorMessage = errorData.message ||
            (Array.isArray(errorData.errors) ? errorData.errors.map((e: any) => typeof e === 'string' ? e : e.msg).join(', ') : errorData.errors) ||
            errorData.error ||
            `Error: ${response.status} ${response.statusText}`;

        throw new ApiError(errorMessage, errorData);
    }

    return response.json();
};
