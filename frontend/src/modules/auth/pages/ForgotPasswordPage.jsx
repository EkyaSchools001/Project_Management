import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/CardLegacy';
import { Mail, ArrowLeft, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../../services/auth.service';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validationError, setValidationError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setValidationError('Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            setValidationError('Please enter a valid email address');
            return false;
        }
        setValidationError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            return;
        }

        setIsLoading(true);

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#18181b] p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03] pointer-events-none" />
                <div className="absolute -top-1/4 -left-1/4 w-[100%] h-[100%] bg-[#8b5cf6]/5 rounded-full blur-[150px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[480px] relative z-10"
                >
                    <Card className="p-10 sm:p-14 bg-[#161B22] border-white/5 rounded-[3rem] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8b5cf6] shadow-[0_0_20px_rgba(186,255,0,0.5)]" />

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            className="w-20 h-20 mx-auto mb-8 bg-[#8b5cf6]/20 rounded-full flex items-center justify-center"
                        >
                            <CheckCircle size={40} className="text-[#8b5cf6]" />
                        </motion.div>

                        <h1 className="text-3xl sm:text-4xl font-black text-foreground text-center mb-4">
                            Check Your Email
                        </h1>

                        <p className="text-foreground/60 text-center mb-8 leading-relaxed">
                            We've sent a password reset link to <span className="text-foreground font-semibold">{email}</span>.
                            Please check your inbox and spam folder.
                        </p>

                        <p className="text-foreground/40 text-center text-sm mb-8">
                            The link will expire in 1 hour.
                        </p>

                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-14 bg-white/5 hover:bg-white/10 text-foreground font-bold rounded-2xl flex items-center justify-center gap-3 transition-all"
                        >
                            <ArrowLeft size={20} />
                            Back to Login
                        </button>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#18181b] p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03] pointer-events-none" />
            <div className="absolute -top-1/4 -left-1/4 w-[100%] h-[100%] bg-[#8b5cf6]/5 rounded-full blur-[150px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] relative z-10"
            >
                <Card className="p-10 sm:p-14 bg-[#161B22] border-white/5 rounded-[3rem] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8b5cf6] shadow-[0_0_20px_rgba(186,255,0,0.5)]" />

                    <button
                        onClick={() => navigate('/login')}
                        className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all"
                    >
                        <ArrowLeft size={18} className="text-foreground/60" />
                    </button>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-16 h-16 mx-auto mb-6 bg-[#18181b] border border-white/10 rounded-2xl flex items-center justify-center"
                    >
                        <Lock size={28} className="text-[#8b5cf6]" />
                    </motion.div>

                    <h1 className="text-3xl sm:text-4xl font-black text-foreground text-center mb-3">
                        Reset Password
                    </h1>

                    <p className="text-foreground/60 text-center mb-8">
                        Enter your email and we'll send you a reset link
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
                            <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider block pl-2">
                                Email Address
                            </label>
                            <div className="relative group/input">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (validationError) validateEmail(e.target.value);
                                    }}
                                    onBlur={() => validateEmail(email)}
                                    className={`w-full px-6 h-14 bg-[#18181b] rounded-xl border ${
                                        validationError ? 'border-red-500/50' : 'border-white/5 focus:border-[#8b5cf6]/50'
                                    } outline-none transition-all text-foreground font-medium placeholder:text-foreground/20`}
                                    placeholder="you@example.com"
                                    disabled={isLoading}
                                />
                                <Mail size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within/input:text-[#8b5cf6] transition-colors" />
                            </div>
                            <AnimatePresence>
                                {validationError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-400 text-xs pl-2"
                                    >
                                        {validationError}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full h-14 bg-[#8b5cf6] text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(186,255,0,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <p className="text-foreground/40 text-center text-sm mt-8">
                        Remember your password?{' '}
                        <Link to="/login" className="text-[#8b5cf6] hover:underline font-semibold">
                            Sign in
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}
