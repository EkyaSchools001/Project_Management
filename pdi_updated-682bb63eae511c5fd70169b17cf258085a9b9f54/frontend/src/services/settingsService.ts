import api from '@/lib/api';
import { sanitizeContent } from '@/utils/contentSanitizer';

export interface SystemSetting {
    id: string;
    key: string;
    value: string;
    createdAt: string;
    updatedAt: string;
}

export const settingsService = {
    // Get all settings
    getAllSettings: async () => {
        const response = await api.get('/settings');
        return response.data.data.settings.map((s: any) => {
            const parsedValue = JSON.parse(s.value);
            return {
                ...s,
                value: sanitizeContent(parsedValue)
            };
        });
    },

    // Get a single setting by key
    getSetting: async (key: string) => {
        const response = await api.get(`/settings/${key}`);
        const parsedValue = JSON.parse(response.data.data.setting.value);
        return {
            ...response.data.data.setting,
            value: sanitizeContent(parsedValue)
        };
    },

    // Upsert a setting
    upsertSetting: async (key: string, value: any) => {
        const sanitizedValue = sanitizeContent(value);
        const response = await api.post('/settings/upsert', { key, value: sanitizedValue });
        return response.data.data.setting;
    },

    // Delete a setting
    deleteSetting: async (key: string) => {
        await api.delete(`/settings/${key}`);
    }
};
