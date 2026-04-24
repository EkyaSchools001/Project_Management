import { useState, useEffect, useCallback } from 'react';
import { useTenantContext } from '../components/TenantProvider';

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
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/v1/tenants/${tenantId}/settings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }

            const data = await response.json();
            setSettings(data);
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
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`/api/v1/tenants/${tenantId}/settings`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [key]: value })
        });

        if (!response.ok) {
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
            const token = localStorage.getItem('accessToken');
            const params = new URLSearchParams();
            if (options?.status) params.append('status', options.status);
            if (options?.search) params.append('search', options.search);
            if (options?.page) params.append('page', String(options.page));
            if (options?.limit) params.append('limit', String(options.limit));

            const response = await fetch(`/api/v1/tenants?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tenants');
            }

            const data = await response.json();
            setTenants(data.tenants || []);
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