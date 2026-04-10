import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../../components/ui/CardLegacy';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../../services/auth.service';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);

    const validatePassword = (pwd) => {
        const errors = {};
        if (pwd.length < 8) errors.length = 'At least 8 characters';
        if (!/[A-Z]/.test(pwd)) errors.upper = 'One uppercase letter';
        if (!/[a-z]/.test(pwd)) errors.lower = 'One lowercase letter';
        if (!/[0-9]/.test(pwd)) errors.number = 'One number';
        if (!/[^A-Za-z0-9]/.test(pwd)) errors.special = 'One special character';
        return errors;
    };

    const calculateStrength = (pwd) => {
        if (!pwd) return 0;
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (pwd.length >= 12) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;
        return Math.min(5, strength);
    };

    useEffect(() => {
        setPasswordStrength(calculateStrength(password));
        setValidationErrors(validatePassword(password));
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const errors = validatePassword(password);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token) {
            setError('Invalid or expired reset token');
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = (strength) => {
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        return 'bg-[#BAFF00]';
    };

    const getStrengthLabel = (strength) => {
        if (strength === 0) return '';
        if (strength <= 2) return 'Weak';
        if (strength <= 3) return 'Fair';
        return 'Strong';
    };

    if (!token) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0E14] p-4">
                <Card className="p-10 max-w-md text-center bg-[#161B22] border-white/5 rounded-3xl">
                    <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Invalid Link</h2>
                    <p className="text-white/60 mb-6">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="w-full h-12 bg-[#BAFF00] text-black font-bold rounded-xl"
                    >
                        Request New Link
                    </button>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0E14] p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[480px] relative z-10"
                >
                    <Card className="p-10 sm:p-14 bg-[#161B22] border-white/5 rounded-[3rem] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#BAFF00] shadow-[0_0_20px_rgba(186,255,0,0.5)]" />

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            className="w-20 h-20 mx-auto mb-8 bg-[#BAFF00]/20 rounded-full flex items-center justify-center"
                        >
                            <CheckCircle size={40} className="text-[#BAFF00]" />
                        </motion.div>

                        <h1 className="text-3xl sm:text-4xl font-black text-white text-center mb-4">
                            Password Reset!
                        </h1>

                        <p className="text-white/60 text-center mb-8">
                            Your password has been successfully reset. You can now sign in with your new password.
                        </p>

                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-14 bg-[#BAFF00] text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(186,255,0,0.3)]"
                        >
                            Go to Login
                        </button>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0E14] p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03] pointer-events-none" />
            <div className="absolute -top-1/4 -left-1/4 w-[100%] h-[100%] bg-[#BAFF00]/5 rounded-full blur-[150px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] relative z-10"
            >
                <Card className="p-10 sm:p-14 bg-[#161B22] border-white/5 rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#BAFF00] shadow-[0_0_20px_rgba(186,255,0,0.5)]" />

                    <button
                        onClick={() => navigate('/login')}
                        className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all"
                    >
                        <ArrowLeft size={18} className="text-white/60" />
                    </button>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-16 h-16 mx-auto mb-6 bg-[#0B0E14] border border-white/10 rounded-2xl flex items-center justify-center"
                    >
                        <Lock size={28} className="text-[#BAFF00]" />
                    </motion.div>

                    <h1 className="text-3xl sm:text-4xl font-black text-white text-center mb-3">
                        New Password
                    </h1>

                    <p className="text-white/60 text-center mb-8">
                        Create a strong password for your account
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 flex items-center gap-3"
                                >
                                    <AlertCircle size={20} className="shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider block pl-2">
                                New Password
                            </label>
                            <div className="relative group/input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 h-14 bg-[#0B0E14] rounded-xl border border-white/5 focus:border-[#BAFF00]/50 outline-none transition-all text-white font-medium pr-12"
                                    placeholder="Enter new password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {password && (
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all ${
                                                    i <= passwordStrength ? getStrengthColor(passwordStrength) : 'bg-white/10'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-white/40">
                                        Password strength: <span className={passwordStrength > 3 ? 'text-[#BAFF00]' : 'text-white/60'}>{getStrengthLabel(passwordStrength)}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider block pl-2">
                                Confirm Password
                            </label>
                            <div className="relative group/input">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full px-6 h-14 bg-[#0B0E14] rounded-xl border ${
                                        confirmPassword && password !== confirmPassword ? 'border-red-500/50' : 'border-white/5 focus:border-[#BAFF00]/50'
                                    } outline-none transition-all text-white font-medium pr-12`}
                                    placeholder="Confirm new password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-400 text-xs pl-2">Passwords do not match</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                            className="w-full h-14 bg-[#BAFF00] text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(186,255,0,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
