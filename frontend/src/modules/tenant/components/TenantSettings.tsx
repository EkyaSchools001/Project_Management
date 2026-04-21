import { useState, useEffect } from 'react';
import { useTenantContext } from './TenantProvider';
import { Settings, Palette, Layout, Plug, CreditCard, Users } from 'lucide-react';
import { BrandingEditor } from './BrandingEditor';
import { DomainSettings } from './DomainSettings';

interface TenantSettingsProps {
    activeTab?: string;
}

export const TenantSettingsPage = ({ activeTab: initialTab }: TenantSettingsProps) => {
    const { tenant } = useTenantContext();
    const [activeTab, setActiveTab] = useState(initialTab || 'general');
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (tenant?.id) {
            fetchSettings();
        }
    }, [tenant?.id]);

    const fetchSettings = async () => {
        if (!tenant?.id) return;
        
        setIsLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/v1/tenants/${tenant.id}/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSetting = async (key: string, value: string) => {
        if (!tenant?.id) return;

        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`/api/v1/tenants/${tenant.id}/settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [key]: value })
            });

            setSettings(prev => ({ ...prev, [key]: value }));
        } catch (error) {
            console.error('Failed to update setting:', error);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'branding', label: 'Branding', icon: Palette },
        { id: 'domains', label: 'Domains', icon: Layout },
        { id: 'integrations', label: 'Integrations', icon: Plug },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'users', label: 'Users', icon: Users },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Tenant Settings</h1>
                    <p className="text-foreground/60">Manage your organization settings and branding</p>
                </div>
            </div>

            <div className="flex gap-4 border-b border-white/10">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-[#8b5cf6] text-[#8b5cf6]'
                                    : 'border-transparent text-foreground/60 hover:text-foreground'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="py-4">
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Organization Name</h3>
                                <input
                                    type="text"
                                    defaultValue={tenant?.name}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground"
                                    readOnly
                                />
                            </div>

                            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Slug</h3>
                                <input
                                    type="text"
                                    defaultValue={tenant?.slug}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Status</h3>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    tenant?.status === 'Active'
                                        ? 'bg-violet-500/20 text-violet-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                    {tenant?.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'branding' && <BrandingEditor />}

                {activeTab === 'domains' && <DomainSettings />}

                {activeTab === 'integrations' && (
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Integrations</h3>
                        <p className="text-foreground/60">Configure third-party integrations</p>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Billing</h3>
                        <p className="text-foreground/60">Manage your subscription and billing</p>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Users</h3>
                        <p className="text-foreground/60">Manage tenant users and roles</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenantSettingsPage;