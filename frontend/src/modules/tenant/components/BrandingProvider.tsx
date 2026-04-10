import { useState, useEffect, ReactNode } from 'react';
import { useTenantContext } from './TenantProvider';

interface BrandingProviderProps {
    children: ReactNode;
}

export const BrandingProvider = ({ children }: BrandingProviderProps) => {
    const { branding } = useTenantContext();
    const [cssVariables, setCssVariables] = useState<Record<string, string>>({});

    useEffect(() => {
        if (branding) {
            const vars = {
                '--tenant-primary': branding.primaryColor,
                '--tenant-secondary': branding.secondaryColor,
                '--tenant-accent': branding.accentColor,
                '--tenant-background': branding.backgroundColor,
            };
            setCssVariables(vars);

            const root = document.documentElement;
            Object.entries(vars).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });

            return () => {
                Object.keys(vars).forEach((key) => {
                    root.style.removeProperty(key);
                });
            };
        }
    }, [branding]);

    return <>{children}</>;
};

export default BrandingProvider;