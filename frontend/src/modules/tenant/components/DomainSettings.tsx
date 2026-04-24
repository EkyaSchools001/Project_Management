import { useState, useEffect } from 'react';
import { useTenantContext } from './TenantProvider';
import { Globe, Shield, AlertCircle, Check, Copy } from 'lucide-react';

export const DomainSettings = () => {
    const { tenant } = useTenantContext();
    const [domain, setDomain] = useState(tenant?.domain || '');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed' | null>(null);

    useEffect(() => {
        setDomain(tenant?.domain || '');
    }, [tenant?.domain]);

    const handleSaveDomain = async () => {
        if (!tenant?.id || !domain) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/v1/tenants/${tenant.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ domain })
            });

            if (response.ok) {
                setVerificationStatus('pending');
            }
        } catch (error) {
            console.error('Failed to save domain:', error);
        }
    };

    const verifyDomain = async () => {
        if (!tenant?.id) return;

        setIsVerifying(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/v1/tenants/${tenant.id}/verify-domain`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            setVerificationStatus(data.verified ? 'verified' : 'failed');
        } catch (error) {
            setVerificationStatus('failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#ef4444]" />
                    Custom Domain
                </h3>
                <p className="text-foreground/60 mb-4">
                    Connect a custom domain to your tenant for white-labeling
                </p>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="example.com"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-foreground"
                    />
                    <button
                        onClick={handleSaveDomain}
                        className="px-6 py-3 bg-[#ef4444] text-black rounded-lg hover:bg-[#e11d48] transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>

            {domain && (
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#ef4444]" />
                        DNS Configuration
                    </h3>
                    <p className="text-foreground/60 mb-4">
                        Add the following DNS records to your domain provider to verify ownership
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-foreground/60">Type</span>
                                <span className="text-sm font-mono text-foreground">TXT</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-foreground/60">Host/Name</span>
                                <span className="text-sm font-mono text-foreground">@</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground/60">Value</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono text-[#ef4444]">
                                        schoolos-verification={tenant?.id}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(`schoolos-verification=${tenant?.id}`)}
                                        className="p-1 text-foreground/40 hover:text-foreground"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-foreground/60">Type</span>
                                <span className="text-sm font-mono text-foreground">CNAME</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-foreground/60">Host/Name</span>
                                <span className="text-sm font-mono text-foreground">www</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-foreground/60">Value</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono text-[#ef4444]">
                                        {tenant?.slug}.schoolos.app
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(`${tenant?.slug}.schoolos.app`)}
                                        className="p-1 text-foreground/40 hover:text-foreground"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={verifyDomain}
                        disabled={isVerifying}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-foreground rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        {isVerifying ? 'Verifying...' : 'Verify Domain'}
                    </button>

                    {verificationStatus === 'verified' && (
                        <div className="mt-4 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <Check className="w-5 h-5 text-red-400" />
                            <span className="text-sm text-red-400">Domain verified successfully</span>
                        </div>
                    )}

                    {verificationStatus === 'failed' && (
                        <div className="mt-4 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-sm text-red-400">Verification failed. Please check your DNS records.</span>
                        </div>
                    )}
                </div>
            )}

            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-foreground mb-4">SSL Status</h3>
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">SSL Certificate Active</span>
                    <span className="text-foreground/60 text-sm">
                        (Automatically provisioned via Let's Encrypt)
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DomainSettings;