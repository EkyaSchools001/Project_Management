import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import { Card } from '../../../components/ui/CardLegacy';
import { Shield, Key, Smartphone, Monitor, LogOut, AlertTriangle, Check, Loader2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../../services/auth.service';
import { useSession } from '../../../hooks/useSession';
import { toast } from 'sonner';

export default function SettingsPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { sessions, loading: sessionsLoading, revokeSession, logoutAllSessions } = useSession();

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [show2FADisable, setShow2FADisable] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [twoFactorError, setTwoFactorError] = useState('');
    const [isProcessing2FA, setIsProcessing2FA] = useState(false);

    const [currentPassword2FA, setCurrentPassword2FA] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }

        setIsChangingPassword(true);

        try {
            await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmNewPassword: passwordData.confirmPassword
            });
            setPasswordSuccess(true);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setShowPasswordForm(false);
                setPasswordSuccess(false);
            }, 2000);
        } catch (err) {
            setPasswordError(err.response?.data?.error || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handle2FASetup = async (e) => {
        e.preventDefault();
        setTwoFactorError('');

        if (twoFactorCode.length !== 6) {
            setTwoFactorError('Please enter a 6-digit code');
            return;
        }

        setIsProcessing2FA(true);

        try {
            await authService.verifySetup2FA(twoFactorCode);
            toast.success('Two-factor authentication enabled successfully');
            setShow2FASetup(false);
            setTwoFactorCode('');
        } catch (err) {
            setTwoFactorError(err.response?.data?.error || 'Invalid verification code');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const handleInitiate2FASetup = async () => {
        setIsProcessing2FA(true);
        try {
            await authService.setup2FA();
            setShow2FASetup(true);
            toast.success('Verification code sent to your email');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send verification code');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const handle2FADisable = async (e) => {
        e.preventDefault();
        setTwoFactorError('');

        if (twoFactorCode.length !== 6) {
            setTwoFactorError('Please enter a 6-digit code');
            return;
        }

        setIsProcessing2FA(true);

        try {
            await authService.confirmDisable2FA(twoFactorCode);
            toast.success('Two-factor authentication disabled');
            setShow2FADisable(false);
            setShow2FASetup(false);
            setTwoFactorCode('');
            setCurrentPassword2FA('');
        } catch (err) {
            setTwoFactorError(err.response?.data?.error || 'Invalid verification code');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const handleInitiate2FADisable = async () => {
        setIsProcessing2FA(true);
        try {
            await authService.disable2FA();
            setShow2FADisable(true);
            toast.success('Verification code sent to your email');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to send verification code');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const handleLogoutAll = async () => {
        const success = await logoutAllSessions();
        if (success) {
            toast.success('Logged out from all other sessions');
            setShowLogoutConfirm(false);
        }
    };

    const handleRevokeSession = async (sessionId) => {
        const success = await revokeSession(sessionId);
        if (success) {
            toast.success('Session revoked');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Security Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-[#161B22] border-white/5 rounded-2xl">
                    <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                        <Key size={20} className="text-[#BAFF00]" />
                        Change Password
                    </h2>

                    <AnimatePresence mode="wait">
                        {passwordSuccess && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3"
                            >
                                <Check size={20} className="text-green-400" />
                                <span className="text-green-400 text-sm">Password changed successfully</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {passwordError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
                            >
                                <AlertTriangle size={20} className="text-red-400" />
                                <span className="text-red-400 text-sm">{passwordError}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!showPasswordForm ? (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="w-full h-12 bg-white/5 hover:bg-white/10 text-foreground font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <Key size={18} />
                            Change Password
                        </button>
                    ) : (
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#BAFF00]/50 outline-none pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40"
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#BAFF00]/50 outline-none pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground focus:border-[#BAFF00]/50 outline-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                        setPasswordError('');
                                    }}
                                    className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-foreground font-medium rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="flex-1 h-12 bg-[#BAFF00] text-black font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isChangingPassword ? <Loader2 size={18} className="animate-spin" /> : 'Update'}
                                </button>
                            </div>
                        </form>
                    )}
                </Card>

                <Card className="p-6 bg-[#161B22] border-white/5 rounded-2xl">
                    <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                        <Smartphone size={20} className="text-[#BAFF00]" />
                        Two-Factor Authentication
                    </h2>

                    <p className="text-sm text-foreground/60 mb-6">
                        Add an extra layer of security to your account by requiring a verification code in addition to your password.
                    </p>

                    <AnimatePresence>
                        {twoFactorError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
                            >
                                <AlertTriangle size={20} className="text-red-400" />
                                <span className="text-red-400 text-sm">{twoFactorError}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {user?.profile?.twoFactorEnabled ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl">
                                <Check size={24} className="text-green-400" />
                                <div>
                                    <p className="text-green-400 font-medium">2FA is enabled</p>
                                    <p className="text-foreground/60 text-sm">Your account is protected with two-factor authentication</p>
                                </div>
                            </div>

                            {!show2FADisable ? (
                                <button
                                    onClick={handleInitiate2FADisable}
                                    disabled={isProcessing2FA}
                                    className="w-full h-12 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isProcessing2FA ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                                    Disable 2FA
                                </button>
                            ) : (
                                <form onSubmit={handle2FADisable} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                            Enter Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            value={twoFactorCode}
                                            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground text-center text-xl tracking-widest focus:border-[#BAFF00]/50 outline-none"
                                            placeholder="000000"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShow2FADisable(false);
                                                setTwoFactorCode('');
                                                setTwoFactorError('');
                                            }}
                                            className="flex-1 h-12 bg-white/5 text-foreground font-medium rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isProcessing2FA || twoFactorCode.length !== 6}
                                            className="flex-1 h-12 bg-red-500 text-foreground font-bold rounded-xl disabled:opacity-50"
                                        >
                                            {isProcessing2FA ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Disable 2FA'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-xl">
                                <AlertTriangle size={24} className="text-yellow-400" />
                                <div>
                                    <p className="text-yellow-400 font-medium">2FA is not enabled</p>
                                    <p className="text-foreground/60 text-sm">Enable 2FA for better security</p>
                                </div>
                            </div>

                            {!show2FASetup ? (
                                <button
                                    onClick={handleInitiate2FASetup}
                                    disabled={isProcessing2FA}
                                    className="w-full h-12 bg-[#BAFF00] text-black font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isProcessing2FA ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                                    Enable 2FA
                                </button>
                            ) : (
                                <form onSubmit={handle2FASetup} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
                                            Enter Verification Code from Email
                                        </label>
                                        <input
                                            type="text"
                                            value={twoFactorCode}
                                            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="w-full px-4 h-12 bg-[#18181b] border border-white/5 rounded-xl text-foreground text-center text-xl tracking-widest focus:border-[#BAFF00]/50 outline-none"
                                            placeholder="000000"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShow2FASetup(false);
                                                setTwoFactorCode('');
                                                setTwoFactorError('');
                                            }}
                                            className="flex-1 h-12 bg-white/5 text-foreground font-medium rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isProcessing2FA || twoFactorCode.length !== 6}
                                            className="flex-1 h-12 bg-[#BAFF00] text-black font-bold rounded-xl disabled:opacity-50"
                                        >
                                            {isProcessing2FA ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Verify & Enable'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </Card>

                <Card className="p-6 bg-[#161B22] border-white/5 rounded-2xl lg:col-span-2">
                    <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                        <Monitor size={20} className="text-[#BAFF00]" />
                        Active Sessions
                    </h2>

                    <p className="text-sm text-foreground/60 mb-6">
                        Manage devices that are logged into your account. You can revoke any session you don't recognize.
                    </p>

                    {sessionsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 size={24} className="animate-spin text-foreground/40" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <p className="text-foreground/40 text-center py-4">No active sessions</p>
                    ) : (
                        <div className="space-y-3">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-4 bg-[#18181b] rounded-xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                                            <Monitor size={20} className="text-foreground/40" />
                                        </div>
                                        <div>
                                            <p className="text-foreground font-medium">
                                                {session.deviceInfo || 'Unknown Device'}
                                            </p>
                                            <p className="text-foreground/40 text-sm">
                                                {session.ipAddress} • Last active {formatDate(session.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    {!session.isCurrent && (
                                        <button
                                            onClick={() => handleRevokeSession(session.id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Revoke session"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                    {session.isCurrent && (
                                        <span className="px-3 py-1 bg-[#BAFF00]/20 text-[#BAFF00] text-xs font-medium rounded-full">
                                            Current
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/5">
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full h-12 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
                        >
                            <LogOut size={18} />
                            Logout from All Other Sessions
                        </button>
                    </div>
                </Card>
            </div>

            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-backgroundackgroundlack/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#161B22] rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                    <AlertTriangle size={24} className="text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Logout All Sessions?</h3>
                            </div>
                            <p className="text-foreground/60 mb-6">
                                This will log you out from all devices except the current one. You'll need to sign in again on other devices.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 h-12 bg-white/5 text-foreground font-medium rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogoutAll}
                                    className="flex-1 h-12 bg-red-500 text-foreground font-bold rounded-xl"
                                >
                                    Logout All
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
