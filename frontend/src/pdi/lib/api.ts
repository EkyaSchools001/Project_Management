import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

// Smart API URL detection
// If accessed via tunnel (loca.lt), use tunnel backend
// If accessed via localhost, use localhost backend
const getApiUrl = () => {
    // 1. Prioritize VITE_API_URL if set
    if (import.meta.env.VITE_API_URL) {
        let url = import.meta.env.VITE_API_URL;
        if (!url.endsWith('/')) {
            url += '/';
        }
        return url;
    }

    const hostname = window.location.hostname;
    // 2. Fallback for tunneling or current origin
    if (hostname.includes('loca.lt') || hostname.includes('testsprite')) {
        return '/api/v1/';
    }

    // 3. Fallback
    return '/api/v1/';
};

const API_URL = getApiUrl();
console.log('--- DEBUG API URL ---', API_URL);
console.log('--- VITE_API_URL ---', import.meta.env.VITE_API_URL);

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Strip leading slash if present to avoid Axios replacing the path part of baseURL
        if (config.url && config.url.startsWith('/')) {
            config.url = config.url.substring(1);
        }

        const token = localStorage.getItem('school_mgmt_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            console.error('API Error: 401 Unauthorized', error.response?.data);
            // We removed the immediate clear token and window.location.href = '/login'
            // to stop unexpected session timeouts from routing bugs.
            toast.error('Authentication Error. Please check your session.');
        } else if (status === 403) {
            const message = (error.response?.data as any)?.message || 'You do not have permission to perform this action.';
            toast.error(message);
        } else if (status === 404) {
            toast.error('Resource not found.');
        } else if (status === 500) {
            toast.error('Internal server error. Please try again later.');
        } else if (!status) {
            toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

export default api;
