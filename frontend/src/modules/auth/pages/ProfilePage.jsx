import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { Card } from '../../../components/ui/CardLegacy';
import { User, Mail, Phone, MapPin, Calendar, Globe, Bell, Shield, Save, Loader2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../../services/auth.service';
import { toast } from 'sonner';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: user?.profile?.firstName || user?.name?.split(' ')[0] || '',
        lastName: user?.profile?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        phone: user?.profile?.phone || '',
        bio: user?.profile?.bio || '',
        address: user?.profile?.address || '',
        city: user?.profile?.city || '',
        country: user?.profile?.country || '',
        postalCode: user?.profile?.postalCode || '',
        timezone: user?.profile?.timezone || 'UTC',
        language: user?.profile?.language || 'en',
        emailNotifications: user?.profile?.emailNotifications ?? true,
        pushNotifications: user?.profile?.pushNotifications ?? true,
    });

    const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatar || user?.avatar || null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        try {
            const updatedUser = await authService.updateMe({
                ...formData,
                avatar: avatarUrl
            });
            updateUser(updatedUser);
            toast.success('Profile updated successfully');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const timezones = [
        { value: 'UTC', label: 'UTC' },
        { value: 'America/New_York', label: 'Eastern Time (ET)' },
        { value: 'America/Chicago', label: 'Central Time (CT)' },
        { value: 'America/Denver', label: 'Mountain Time (MT)' },
        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
        { value: 'Europe/London', label: 'London (GMT)' },
        { value: 'Europe/Paris', label: 'Central European Time (CET)' },
        { value: 'Asia/Kolkata', label: 'India (IST)' },
        { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
        { value: 'Asia/Tokyo', label: 'Japan (JST)' },
        { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
    ];

    const languages = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'zh', label: 'Chinese' },
        { value: 'ja', label: 'Japanese' },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6 bg-[#161B22] border-white/5 rounded-2xl">
                            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                <User size={20} className="text-[#ef4444]" />
                                Personal Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#ef4444]/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#ef4444]/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        <Mail size={14} className="inline mr-1" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 h-12 bg-white/5 border border-white/5 rounded-xl text-foreground/40 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-foreground/30">Email cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        <Phone size={14} className="inline mr-1" />
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#ef4444]/50 outline-none transition-all"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#ef4444]/50 outline-none transition-all resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-[#161B22] border-white/5 rounded-2xl">
                            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                <MapPin size={20} className="text-[#ef4444]" />
                                Location
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#ef4444]/50 outline-none transition-all"
                                        placeholder="123 Main Street"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#ef4444]/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#ef4444]/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#ef4444]/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-[#161B22] border-white/5 rounded-2xl">
                            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                <Globe size={20} className="text-[#ef4444]" />
                                Preferences
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        Timezone
                                    </label>
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleChange}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#ef4444]/50 outline-none transition-all"
                                    >
                                        {timezones.map(tz => (
                                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                        Language
                                    </label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#ef4444]/50 outline-none transition-all"
                                    >
                                        {languages.map(lang => (
                                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 bg-[#161B22] border-white/5 rounded-2xl">
                            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                <Bell size={20} className="text-[#ef4444]" />
                                Notifications
                            </h2>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-foreground/80">Email Notifications</span>
                                    <input
                                        type="checkbox"
                                        name="emailNotifications"
                                        checked={formData.emailNotifications}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded bg-[#18181b] border border-white/10 text-[#ef4444] focus:ring-[#ef4444] focus:ring-offset-0 cursor-pointer"
                                    />
                                </label>

                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-foreground/80">Push Notifications</span>
                                    <input
                                        type="checkbox"
                                        name="pushNotifications"
                                        checked={formData.pushNotifications}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded bg-[#18181b] border border-white/10 text-[#ef4444] focus:ring-[#ef4444] focus:ring-offset-0 cursor-pointer"
                                    />
                                </label>
                            </div>
                        </Card>

                        <Card className="p-6 bg-[#161B22] border-white/5 rounded-2xl">
                            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-[#ef4444]" />
                                Account
                            </h2>

                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    <div className="w-24 h-24 rounded-full bg-[#18181b] border-2 border-[#ef4444]/20 overflow-hidden flex items-center justify-center">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={40} className="text-foreground/20" />
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#ef4444] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ef4444]/90 transition-colors">
                                        <Camera size={16} className="text-black" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <p className="text-sm text-foreground/60 mb-4">{user?.email}</p>

                                <div className="px-4 py-2 bg-white/5 rounded-lg inline-block">
                                    <span className="text-xs text-foreground/40 uppercase tracking-wider">Role</span>
                                    <p className="text-foreground font-semibold">{user?.role}</p>
                                </div>
                            </div>
                        </Card>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full h-12 bg-[#ef4444] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(186,255,0,0.3)] disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
