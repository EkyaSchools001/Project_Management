// @ts-nocheck
import { useState, useEffect } from 'react';
import { useTenantContext } from './TenantProvider';
import { useTenantList } from '../hooks/useTenant';
import { ChevronDown, Building, Check } from 'lucide-react';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    primaryColor?: string;
}

interface TenantSelectorProps {
    onTenantChange?: (tenant: Tenant) => void;
}

export const TenantSelector = ({ onTenantChange }: TenantSelectorProps) => {
    const { tenant, setTenant } = useTenantContext();
    const { tenants, fetchTenants } = useTenantList();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTenants().then(() => setIsLoading(false));
    }, []);

    const handleSelectTenant = (selectedTenant: Tenant) => {
        setTenant(selectedTenant);
        onTenantChange?.(selectedTenant);
        setIsOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg animate-pulse">
                <div className="w-5 h-5 bg-white/10 rounded"></div>
                <div className="w-24 h-4 bg-white/10 rounded"></div>
            </div>
        );
    }

    if (!tenant && tenants.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
            >
                {tenant?.logo ? (
                    <img src={tenant.logo} alt={tenant.name} className="w-5 h-5 rounded object-cover" />
                ) : (
                    <Building className="w-4 h-4 text-[#BAFF00]" />
                )}
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                    {tenant?.name || 'Select Tenant'}
                </span>
                <ChevronDown className={`w-4 h-4 text-foreground/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#161B22] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                        {tenants.map((t: Tenant) => (
                            <button
                                key={t.id}
                                onClick={() => handleSelectTenant(t)}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                                    tenant?.id === t.id ? 'bg-white/10' : ''
                                }`}
                            >
                                {t.logo ? (
                                    <img src={t.logo} alt={t.name} className="w-6 h-6 rounded object-cover" />
                                ) : (
                                    <Building className="w-5 h-5 text-[#BAFF00]" />
                                )}
                                <span className="flex-1 text-left text-sm text-foreground truncate">
                                    {t.name}
                                </span>
                                {tenant?.id === t.id && (
                                    <Check className="w-4 h-4 text-[#BAFF00]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantSelector;