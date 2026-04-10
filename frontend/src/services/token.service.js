const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

export const tokenService = {
    getToken: () => {
        return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    },

    setToken: (token, rememberMe = false) => {
        if (rememberMe) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            sessionStorage.setItem(TOKEN_KEY, token);
        }
    },

    getRefreshToken: () => {
        return sessionStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    setRefreshToken: (token, rememberMe = false) => {
        if (rememberMe) {
            localStorage.setItem(REFRESH_TOKEN_KEY, token);
        } else {
            sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
        }
    },

    getUser: () => {
        const userJson = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
        if (userJson) {
            return JSON.parse(userJson);
        }
        return null;
    },

    setUser: (user) => {
        const existingUser = tokenService.getUser();
        localStorage.setItem(USER_KEY, JSON.stringify({ ...existingUser, ...user }));
        sessionStorage.setItem(USER_KEY, JSON.stringify({ ...existingUser, ...user }));
    },

    getTokenExpiry: () => {
        const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY) || localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (expiry) {
            return new Date(expiry);
        }
        return null;
    },

    setTokenExpiry: (expiry) => {
        sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiry);
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiry);
    },

    isTokenExpired: () => {
        const expiry = tokenService.getTokenExpiry();
        if (!expiry) {
            return true;
        }
        return new Date() >= new Date(expiry);
    },

    getTimeUntilExpiry: () => {
        const expiry = tokenService.getTokenExpiry();
        if (!expiry) {
            return 0;
        }
        const now = new Date();
        const expiryDate = new Date(expiry);
        return Math.max(0, expiryDate.getTime() - now.getTime());
    },

    clearAuth: () => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
    },

    clearAll: () => {
        sessionStorage.clear();
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
    },

    hasValidToken: () => {
        return !!tokenService.getToken();
    },

    hasValidSession: () => {
        return !!tokenService.getToken() && !!tokenService.getUser();
    }
};

export default tokenService;
