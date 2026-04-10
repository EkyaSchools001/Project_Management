import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authContext';
import { Card } from '../../../components/ui/CardLegacy';
import { Shield, ArrowRight, Lock, AlertCircle, Fingerprint, Loader2, CheckCircle, KeyRound, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const { user, login, verify2FA, requires2FA } = useAuth();
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [twoFactorError, setTwoFactorError] = useState('');
    const [verifying2FA, setVerifying2FA] = useState(false);

    if (user) return <Navigate to="/" replace />;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(credentials.email, credentials.password, rememberMe);
            if (!result.requires2FA) navigate('/');
        } catch (err) {
            setError('Invalid credentials. Please check your email and password.');
        } finally {
            setIsLoading(false);
        }
    };

    const handle2FAVerify = async (e) => {
        e.preventDefault();
        setTwoFactorError('');
        setVerifying2FA(true);

        try {
            await verify2FA(twoFactorCode);
            navigate('/');
        } catch (err) {
            setTwoFactorError('Invalid code. Please check your email.');
        } finally {
            setVerifying2FA(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    if (requires2FA) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md relative z-10"
                >
                    <Card className="p-8 sm:p-10 bg-card border-border shadow-xl rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                            <KeyRound size={32} className="text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground text-center mb-2">Two-Factor Authentication</h1>
                        <p className="text-muted-foreground text-sm text-center mb-8">Enter the 6-digit code sent to your email</p>
                        
                        <form onSubmit={handle2FAVerify} className="space-y-6">
                            <AnimatePresence>
                                {twoFactorError && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-destructive/10 text-destructive p-3 rounded-xl border border-destructive/20 flex items-center gap-2 text-sm font-medium">
                                        <AlertCircle size={18} /> {twoFactorError}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <input
                                type="text"
                                value={twoFactorCode}
                                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-6 h-14 bg-background rounded-xl border border-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground text-center text-2xl tracking-[0.5em] font-bold"
                                placeholder="000000"
                                maxLength={6}
                                autoFocus
                                required
                            />
                            <button disabled={verifying2FA || twoFactorCode.length !== 6} type="submit" className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
                                {verifying2FA ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle size={18} /> Verify Code</>}
                            </button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden font-sans">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-[440px] relative z-10">
                <Card className="p-8 sm:p-12 bg-card border-border rounded-3xl sm:rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
                    
                    <div className="flex flex-col items-center mb-10">
                        <div className="mb-6 w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <LayoutDashboard flex="1" size={40} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">SchoolOS</h1>
                        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase mt-2">Central Dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-destructive/10 text-destructive p-3.5 rounded-xl border border-destructive/20 flex items-center gap-3 text-sm font-semibold">
                                    <AlertCircle size={18} /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block ml-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                    className="w-full pl-12 pr-4 h-14 bg-background rounded-xl border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground text-sm font-medium"
                                    placeholder="user@school.edu"
                                    disabled={isLoading}
                                />
                                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Password</label>
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full pl-12 pr-4 h-14 bg-background rounded-xl border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground text-sm font-medium"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-sm">Sign In</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border flex items-center justify-center">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Shield size={14} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Secure Access</span>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
