import { useState, useEffect } from 'react';
import { useTenantContext } from './TenantProvider';
import { Upload, Palette, Eye, Save, RotateCcw } from 'lucide-react';

interface BrandingData {
    logo?: string;
    favicon?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
}

interface BrandingEditorProps {
    onSave?: (data: BrandingData) => void;
}

export const BrandingEditor = ({ onSave }: BrandingEditorProps) => {
    const { tenant, setTenant } = useTenantContext();
    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [colors, setColors] = useState<BrandingData>({
        primaryColor: tenant?.primaryColor || '#3B82F6',
        secondaryColor: tenant?.secondaryColor || '#10B981',
        accentColor: tenant?.accentColor || '#F59E0B',
        backgroundColor: tenant?.backgroundColor || '#FFFFFF',
    });

    useEffect(() => {
        if (tenant) {
            setColors({
                primaryColor: tenant.primaryColor || '#3B82F6',
                secondaryColor: tenant.secondaryColor || '#10B981',
                accentColor: tenant.accentColor || '#F59E0B',
                backgroundColor: tenant.backgroundColor || '#FFFFFF',
            });
        }
    }, [tenant]);

    const handleColorChange = (key: keyof BrandingData, value: string) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('/api/v1/files/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setColors(prev => ({ ...prev, [field]: data.url }));
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`/api/v1/tenants/${tenant?.id}/branding`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(colors)
            });

            if (response.ok) {
                const updatedTenant = await response.json();
                setTenant(updatedTenant);
                onSave?.(colors);
            }
        } catch (error) {
            console.error('Failed to save branding:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setColors({
            primaryColor: '#3B82F6',
            secondaryColor: '#10B981',
            accentColor: '#F59E0B',
            backgroundColor: '#FFFFFF',
        });
    };

    const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/70">{label}</label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-[#BAFF00]" />
                            Logo
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                                {colors.logo ? (
                                    <img src={colors.logo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <Upload className="w-8 h-8 text-white/30" />
                                )}
                            </div>
                            <label className="px-4 py-2 bg-[#BAFF00]/10 border border-[#BAFF00]/20 text-[#BAFF00] rounded-lg cursor-pointer hover:bg-[#BAFF00]/20 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleLogoUpload(e, 'logo')}
                                    className="hidden"
                                />
                                Upload
                            </label>
                        </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-[#BAFF00]" />
                            Favicon
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                                {colors.favicon ? (
                                    <img src={colors.favicon} alt="Favicon" className="w-full h-full object-contain" />
                                ) : (
                                    <Upload className="w-5 h-5 text-white/30" />
                                )}
                            </div>
                            <label className="px-4 py-2 bg-[#BAFF00]/10 border border-[#BAFF00]/20 text-[#BAFF00] rounded-lg cursor-pointer hover:bg-[#BAFF00]/20 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleLogoUpload(e, 'favicon')}
                                    className="hidden"
                                />
                                Upload
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-[#BAFF00]" />
                            Colors
                        </h3>
                        <div className="space-y-4">
                            <ColorInput
                                label="Primary Color"
                                value={colors.primaryColor}
                                onChange={(v) => handleColorChange('primaryColor', v)}
                            />
                            <ColorInput
                                label="Secondary Color"
                                value={colors.secondaryColor}
                                onChange={(v) => handleColorChange('secondaryColor', v)}
                            />
                            <ColorInput
                                label="Accent Color"
                                value={colors.accentColor}
                                onChange={(v) => handleColorChange('accentColor', v)}
                            />
                            <ColorInput
                                label="Background Color"
                                value={colors.backgroundColor}
                                onChange={(v) => handleColorChange('backgroundColor', v)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isPreview && (
                <div className="p-6 bg-white rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Preview
                    </h3>
                    <div
                        className="p-8 rounded-lg"
                        style={{ backgroundColor: colors.backgroundColor }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-12 h-12 rounded-lg"
                                style={{ backgroundColor: colors.primaryColor }}
                            />
                            <div
                                className="text-2xl font-bold"
                                style={{ color: colors.primaryColor }}
                            >
                                Brand Name
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                className="px-4 py-2 rounded-lg text-white"
                                style={{ backgroundColor: colors.primaryColor }}
                            >
                                Primary Button
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg border-2"
                                style={{ borderColor: colors.secondaryColor, color: colors.secondaryColor }}
                            >
                                Secondary
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg"
                                style={{ backgroundColor: colors.accentColor }}
                            >
                                Accent
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        {isPreview ? 'Hide' : 'Preview'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-[#BAFF00] text-black rounded-lg hover:bg-[#a8ed00] transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrandingEditor;