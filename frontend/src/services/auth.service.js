import api from './api';
import { tokenService } from './token.service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api';

export const authService = {
    register: async (data) => {
        const response = await api.post('/v1/auth/register', data);
        const { token, refreshToken, user } = response.data;
        
        tokenService.setToken(token, data.rememberMe);
        tokenService.setRefreshToken(refreshToken, data.rememberMe);
        tokenService.setUser(user);
        
        return response.data;
    },

    login: async (email, password, rememberMe = false) => {
        const response = await api.post('/v1/auth/login', { email, password, rememberMe });
        
        if (response.data.requires2FA) {
            return {
                requires2FA: true,
                tempToken: response.data.tempToken,
                message: response.data.message
            };
        }
        
        const { token, refreshToken, user, expiresAt } = response.data;
        
        tokenService.setToken(token, rememberMe);
        tokenService.setRefreshToken(refreshToken, rememberMe);
        tokenService.setUser(user);
        tokenService.setTokenExpiry(expiresAt);
        
        return { user, requires2FA: false };
    },

    verify2FA: async (code, tempToken) => {
        const response = await api.post('/v1/auth/verify-2fa', { code, tempToken });
        const { token, refreshToken, user, expiresAt } = response.data;
        
        tokenService.setToken(token, false);
        tokenService.setRefreshToken(refreshToken, false);
        tokenService.setUser(user);
        tokenService.setTokenExpiry(expiresAt);
        
        return { user };
    },

    logout: async () => {
        try {
            await api.post('/v1/auth/logout');
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            tokenService.clearAuth();
        }
    },

    logoutAll: async () => {
        try {
            const response = await api.post('/v1/auth/logout-all');
            tokenService.clearAuth();
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getMe: async () => {
        const response = await api.get('/v1/auth/me');
        return response.data;
    },

    updateMe: async (data) => {
        const response = await api.put('/v1/auth/me', data);
        tokenService.setUser(response.data);
        return response.data;
    },

    changePassword: async (data) => {
        const response = await api.post('/v1/auth/change-password', data);
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/v1/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token, password) => {
        const response = await api.post('/v1/auth/reset-password', { token, password, confirmPassword: password });
        return response.data;
    },

    refreshToken: async () => {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token');
        }

        const response = await api.post('/v1/auth/refresh', { refreshToken });
        const { token, refreshToken: newRefreshToken, expiresAt } = response.data;
        
        const rememberMe = !!localStorage.getItem('auth_refresh_token');
        tokenService.setToken(token, rememberMe);
        tokenService.setRefreshToken(newRefreshToken, rememberMe);
        tokenService.setTokenExpiry(expiresAt);
        
        return response.data;
    },

    setup2FA: async () => {
        const response = await api.post('/v1/auth/2fa/setup');
        return response.data;
    },

    verifySetup2FA: async (code) => {
        const response = await api.post('/v1/auth/2fa/verify-setup', { code });
        return response.data;
    },

    disable2FA: async () => {
        const response = await api.post('/v1/auth/2fa/disable');
        return response.data;
    },

    confirmDisable2FA: async (code) => {
        const response = await api.post('/v1/auth/2fa/confirm-disable', { code });
        return response.data;
    },

    getSessions: async () => {
        const response = await api.get('/v1/auth/sessions');
        return response.data;
    },

    revokeSession: async (sessionId) => {
        const response = await api.delete(`/v1/auth/sessions/${sessionId}`);
        return response.data;
    },

    googleAuth: async (code, redirectUri) => {
        const response = await api.post('/v1/auth/google', { code, redirectUri });
        const { token, refreshToken, user, expiresAt } = response.data;
        
        tokenService.setToken(token, false);
        tokenService.setRefreshToken(refreshToken, false);
        tokenService.setUser(user);
        tokenService.setTokenExpiry(expiresAt);
        
        return { user };
    },

    microsoftAuth: async (code, redirectUri) => {
        const response = await api.post('/v1/auth/microsoft', { code, redirectUri });
        const { token, refreshToken, user, expiresAt } = response.data;
        
        tokenService.setToken(token, false);
        tokenService.setRefreshToken(refreshToken, false);
        tokenService.setUser(user);
        tokenService.setTokenExpiry(expiresAt);
        
        return { user };
    },

    mockLogin: async (email, password) => {
        const { MOCK_USERS } = await import('../data/users');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = MOCK_USERS.find(u => u.email === email && u.password === password);
        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            tokenService.setToken('mock-token-' + user.id, false);
            tokenService.setUser(userWithoutPassword);
            return userWithoutPassword;
        }
        throw new Error('Invalid credentials');
    }
};
