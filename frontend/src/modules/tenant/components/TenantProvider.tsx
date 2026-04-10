import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    domain?: string;
    logo?: string;
    favicon?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    status: string;
}

interface TenantContextType {
    tenant: Tenant | null;
    setTenant: (tenant: Tenant | null) => void;
    isLoading: boolean;
    branding: TenantBranding | null;
}

interface TenantBranding {
    logo?: string;
    favicon?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedTenant = localStorage.getItem('currentTenant');
        if (storedTenant) {
            try {
                setTenant(JSON.parse(storedTenant));
            } catch (e) {
                console.error('Failed to parse tenant from storage', e);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (tenant) {
            localStorage.setItem('currentTenant', JSON.stringify(tenant));
        } else {
            localStorage.removeItem('currentTenant');
        }
    }, [tenant]);

    const branding: TenantBranding | null = tenant ? {
        logo: tenant.logo,
        favicon: tenant.favicon,
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
        accentColor: tenant.accentColor,
        backgroundColor: tenant.backgroundColor
    } : null;

    return (
        <TenantContext.Provider value={{ tenant, setTenant, isLoading, branding }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenantContext = () => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenantContext must be used within a TenantProvider');
    }
    return context;
};

export default TenantProvider;