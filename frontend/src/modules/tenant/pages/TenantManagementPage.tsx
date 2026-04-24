import { useState, useEffect } from 'react';
import { useTenantList } from '../hooks/useTenant';
import { Plus, Search, MoreVertical, Edit, Trash2, Building } from 'lucide-react';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    domain?: string;
    logo?: string;
    primaryColor: string;
    status: string;
    userCount?: number;
}

export const TenantManagementPage = () => {
    const { tenants, fetchTenants, isLoading } = useTenantList();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchTenants({ search, status: statusFilter });
    }, [search, statusFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tenant?')) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/v1/tenants/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchTenants({ search, status: statusFilter });
            }
        } catch (error) {
            console.error('Failed to delete tenant:', error);
        }
    };

    if (isLoading && tenants.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#ef4444]/20 border-t-[#ef4444] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Tenant Management</h1>
                    <p className="text-foreground/60">Manage multi-tenant organizations</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#ef4444] text-black rounded-lg hover:bg-[#e11d48] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Tenant
                </button>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tenants..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground"
                >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tenants.map((tenant: Tenant) => (
                    <div
                        key={tenant.id}
                        className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                                {tenant.logo ? (
                                    <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-contain" />
                                ) : (
                                    <Building className="w-6 h-6 text-[#ef4444]" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground truncate">{tenant.name}</h3>
                                <p className="text-sm text-foreground/60 truncate">{tenant.slug}</p>
                            </div>
                            <button className="p-1 text-foreground/40 hover:text-foreground">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    tenant.status === 'Active' ? 'bg-red-400' : 'bg-yellow-400'
                                }`}></span>
                                <span className="text-sm text-foreground/60">{tenant.status}</span>
                            </div>
                            <span className="text-sm text-foreground/40">{tenant.userCount || 0} users</span>
                        </div>

                        {tenant.domain && (
                            <div className="mt-2 text-sm text-foreground/40 truncate">
                                {tenant.domain}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {tenants.length === 0 && (
                <div className="text-center py-12">
                    <Building className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                    <p className="text-foreground/60">No tenants found</p>
                </div>
            )}
        </div>
    );
};

export default TenantManagementPage;