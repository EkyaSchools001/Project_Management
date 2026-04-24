import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, BookOpen, Users, TrendingUp, Award, ShieldCheck, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn, formatRole } from "@/lib/utils";

const FeaturePill = ({ icon: Icon, text, delay }: { icon: React.ElementType; text: string; delay: string }) => (
    <div
        className={`flex items-center gap-2.5 bg-[#EA104A]/10 backdrop-blur-sm border border-[#EA104A]/20 rounded-full px-4 py-2 text-sm text-[#EA104A] font-bold animate-fade-in`}
        style={{ animationDelay: delay }}
    >
        <Icon className="w-4 h-4 text-[#EA104A]/70" />
        {text}
    </div>
);

const FloatingShape = ({ className, style }: { className: string; style?: React.CSSProperties }) => (
    <div className={`absolute rounded-full blur-3xl opacity-20 animate-float ${className}`} style={style} />
);

import { useGoogleLogin } from "@react-oauth/google";

export default function Auth() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Password validation: >6 chars (min 7), 1 uppercase, 1 lowercase, 1 number, 1 special symbol
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{7,}$/;
        if (!passwordRegex.test(password)) {
            toast.error("Password must be more than 6 characters and include: an uppercase letter, a lowercase letter, a number, and a special symbol.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, data } = response.data;
            toast.success(`Welcome back, ${data.user.fullName}! 👋`);
            login(token, data.user);
            navigate("/dashboard");
        } catch (error: any) {
            const message = error.response?.data?.message || "Login failed. Please check your credentials.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                // Since useGoogleLogin gives access_token, we pass it to backend
                // or we could use the GoogleLogin component for id_token
                // Let's use the access_token and update backend to fetch userinfo
                const response = await api.post("/auth/google-login", {
                    accessToken: tokenResponse.access_token
                });
                const { token, data } = response.data;
                toast.success(`Logged in with Google as ${data.user.fullName}!`);
                login(token, data.user);
                navigate("/dashboard");
            } catch (error: any) {
                const message = error.response?.data?.message || "Google login failed.";
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            toast.error("Google login failed.");
        }
    });

    const portalContent = {
        title: "Teacher Platform",
        desc: "Access your development goals, reflections, and insights",
        heroTitle: "Empower every educator's growth",
        heroDesc: "Track goals, observations, and Teacher Development - all in one beautiful platform.",
        icon: Sparkles
    };

    return (
        <div className="min-h-screen flex bg-background overflow-hidden relative">
            {/* Ambient Background Glow for mobile */}
            <div className="lg:hidden absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

            {/* -- LEFT PANEL - Deep Indigo Illustrated -- */}
            <div className={cn(
                "hidden lg:flex lg:w-[42%] relative flex-col justify-between p-10 auth-split-left overflow-hidden transition-all duration-700",
                "bg-red-50"
            )}>
                {/* Ambient floating shapes */}
                <FloatingShape className="w-80 h-80 bg-[#EA104A]/20 -top-16 -left-16" />
                <FloatingShape className="w-64 h-64 bg-red-200 bottom-20 -right-10" style={{ animationDelay: "1s" }} />
                <FloatingShape className="w-48 h-48 bg-red-300/40 top-1/2 -left-8" style={{ animationDelay: "2s" }} />

                <div className="relative z-10 animate-fade-in">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-[#EA104A]/10 backdrop-blur-sm border border-[#EA104A]/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <img src="/EKYA__1_-removebg-preview.png" alt="EKYA TEACHER PLATFORM" className="w-8 h-8 object-contain opacity-90 drop-shadow-sm" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-black text-xl tracking-tighter uppercase leading-none">EKYA <span className="text-[#EA104A]">TEACHER</span></span>
                            <span className="text-[8px] font-bold text-white/50 tracking-widest uppercase mt-0.5">PLATFORM</span>
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="space-y-3 animate-slide-up">
                        <div className="inline-flex items-center gap-2 bg-[#EA104A]/10 border border-[#EA104A]/20 rounded-full px-3 py-1 text-xs text-[#EA104A] font-bold">
                            {React.createElement(portalContent.icon, { className: "w-3.5 h-3.5" })}
                            Teacher Portal
                        </div>
                        <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                            {portalContent.heroTitle.split(' ').map((word, i) => (
                                <span key={i} className={i >= portalContent.heroTitle.split(' ').length - 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-[#EA104A] to-red-400" : ""}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h1>
                        <p className="text-white/70 text-lg leading-relaxed max-w-sm font-medium">
                            {portalContent.heroDesc}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 animate-fade-in delay-300">
                        <FeaturePill icon={TrendingUp} text="Growth Index" delay="350ms" />
                        <FeaturePill icon={BookOpen} text="Live Feed" delay="450ms" />
                        <FeaturePill icon={Users} text="Collaborate" delay="550ms" />
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-white/50 text-[10px] font-bold tracking-widest">
                        © 2026 Ekya Schools • Teacher Development Ecosystem
                    </p>
                </div>
            </div>

            {/* -- RIGHT PANEL - Clean Login Form -- */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
                <div className="w-full max-w-[440px] space-y-8">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex justify-center mb-4">
                        <Link to="/" className="group flex items-center gap-3">
                            <img src="/EKYA.png" alt="EKYA TEACHER PLATFORM" className="h-10 w-auto object-contain" />
                            <div className="flex flex-col">
                                <span className="font-black text-2xl tracking-tighter uppercase leading-none text-slate-900">EKYA <span className="text-primary">TEACHER</span></span>
                                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">PLATFORM</span>
                            </div>
                        </Link>
                    </div>

                    <div className="space-y-1 animate-slide-down">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Teacher Platform
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {portalContent.desc}
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden group">
                        <div className="p-8 md:p-10 space-y-6">
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-black tracking-widest text-slate-400 ml-1">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@ekyaschools.com"
                                            className="pl-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-base font-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <Label htmlFor="password" className="text-xs font-black tracking-widest text-slate-400">
                                            Password
                                        </Label>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-12 pr-12 h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-base font-medium"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-14 text-base font-black rounded-2xl bg-primary hover:bg-slate-900 text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Validating Account..." : "Enter Portal"}
                                    {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-100" />
                                </div>
                                <div className="relative flex justify-center text-[10px] font-black tracking-[0.2em] text-slate-400">
                                    <span className="bg-white px-4">Single Sign-On</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                disabled={isLoading}
                                className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white text-sm font-bold text-slate-700 transition-all hover:shadow-xl hover:border-slate-300 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Authenticate with Google Workspace
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-400 font-medium">
                        Having trouble? <Link to="#" className="font-bold text-primary hover:underline">Support Center</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
