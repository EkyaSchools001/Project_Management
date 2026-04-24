import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

// Smart API URL detection
// If accessed via tunnel (loca.lt), use tunnel backend
// If accessed via localhost, use localhost backend
const getApiUrl = () => {
    // 1. Prioritize VITE_API_URL if set, but always append pdi/ namespace
    if (import.meta.env.VITE_API_URL) {
        let url = import.meta.env.VITE_API_URL;
        url = url.endsWith('/') ? url : `${url}/`;
        return url.includes('/pdi/') ? url : `${url}pdi/`;
    }

    const hostname = window.location.hostname;
    // 2. Fallback for tunneling or current origin
    if (hostname.includes('loca.lt') || hostname.includes('testsprite')) {
        return '/api/v1/pdi/';
    }

    // 3. Cloudflare Pages/Netlify/Production backend routing
    if (import.meta.env.PROD) {
        return '/api/v1/pdi/';
    }

    // 4. Localhost fallback - preferring direct backend connection
    return 'http://localhost:8888/api/v1/pdi/';
};

const API_URL = getApiUrl();
console.log('--- PDI API CONFIG ---', {
    baseURL: API_URL,
    origin: window.location.origin
});

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

        const token = sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            // Log masked token for debugging 401s
            if (import.meta.env.DEV) {
                const masked = token.length > 10 ? `${token.substring(0, 6)}...${token.slice(-4)}` : '***';
                console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} | Token: ${masked}`);
            }
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
            // Unauthorized - clear this tab's session
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('user_data');
            // Only redirect if we're inside a PDI route (not already on root/login)
            const isOnAuthPage = ['/', '/login'].includes(window.location.pathname);
            const isOnPdiRoute = window.location.pathname.startsWith('/departments/pd');
            if (!isOnAuthPage && isOnPdiRoute) {
                toast.error('Session expired. Please log in again.');
                // Redirect to root so SchoolOS login takes over
                window.location.href = '/';
            }
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
