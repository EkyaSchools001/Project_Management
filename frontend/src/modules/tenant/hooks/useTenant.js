import { useState, useEffect, useCallback } from 'react';
import { useTenantContext } from '../components/TenantProvider';
import api from '../../../services/api';

export const useCurrentTenant = () => {
    const { tenant, setTenant, isLoading } = useTenantContext();
    return { tenant, setTenant, isLoading };
};

export const useTenantSettings = (tenantId) => {
    const [settings, setSettings] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSettings = useCallback(async () => {
        if (!tenantId) return;
        
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(`/tenants/${tenantId}/settings`);

            if (response.data?.status !== 'success' && !response.data) {
                throw new Error('Failed to fetch settings');
            }

            setSettings(response.data.data || response.data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [tenantId]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSetting = async (key, value) => {
        const response = await api.put(`/tenants/${tenantId}/settings`, { [key]: value });

        if (response.data?.status !== 'success' && !response.data) {
            throw new Error('Failed to update setting');
        }

        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return { settings, isLoading, error, updateSetting, refetch: fetchSettings };
};

export const useTenantTheme = () => {
    const { tenant } = useTenantContext();

    return {
        '--primary-color': tenant?.primaryColor || '#ef4444',
        '--secondary-color': tenant?.secondaryColor || '#10B981',
        '--accent-color': tenant?.accentColor || '#F59E0B',
        '--background-color': tenant?.backgroundColor || '#FFFFFF',
    };
};

export const useTenantList = () => {
    const [tenants, setTenants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTenants = useCallback(async (options) => {
        setIsLoading(true);
        setError(null);

        try {
            const params = {};
            if (options?.status) params.status = options.status;
            if (options?.search) params.search = options.search;
            if (options?.page) params.page = options.page;
            if (options?.limit) params.limit = options.limit;

            const response = await api.get(`/tenants`, { params });

            if (response.data?.status !== 'success' && !response.data) {
                throw new Error('Failed to fetch tenants');
            }

            const data = response.data.data || response.data;
            setTenants(data.tenants || data || []);
            return data;
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTenants();
    }, [fetchTenants]);

    return { tenants, isLoading, error, fetchTenants };
};

export default { useCurrentTenant, useTenantSettings, useTenantTheme, useTenantList };