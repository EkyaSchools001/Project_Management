import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Terminal, Cpu, ShieldAlert, Zap, Layers } from "lucide-react";
import { Button } from "@pdi/components/ui/button";
import { Input } from "@pdi/components/ui/input";
import { Label } from "@pdi/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@pdi/hooks/useAuth";
import api from "@pdi/lib/api";
import { useGoogleLogin } from "@react-oauth/google";

const MetaBadge = ({ text }: { text: string }) => (
    <div className="font-mono text-[8px] tracking-[0.2em] border border-white/20 px-2 py-1 uppercase text-white/40">
        [ {text} ]
    </div>
);

export default function Auth() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{7,}$/;
        if (!passwordRegex.test(password)) {
            toast.error("Security mismatch: Password must be >7 chars with Upper, Lower, Num, Special.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, data } = response.data;
            toast.success(`Access Granted: ${data.user.fullName}`);
            login(token, data.user);
        } catch (error: any) {
            const message = error.response?.data?.message || "Authentication Error: Access Denied.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                const response = await api.post("/auth/google-login", {
                    accessToken: tokenResponse.access_token
                });
                const { token, data } = response.data;
                toast.success(`Google Auth Protocol Success: ${data.user.fullName}`);
                login(token, data.user);
            } catch (error: any) {
                toast.error("Identity Verification Failed.");
            } finally {
                setIsLoading(false);
            }
        }
    });

    return (
        <div className="min-h-screen flex bg-black overflow-hidden relative industrial-grid scanlines">
            <div className="neon-frame" />

            {/* Technical Background Elements */}
            <div className="absolute top-12 left-12 opacity-10 font-mono text-xs hidden lg:block">
                SYS_VER: 2.0.4<br/>
                LOC: ADMIN_PORTAL<br/>
                SEC: HIGH_ENCRYPTION
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-[480px]">
                    
                    {/* Brand Header */}
                    <div className="mb-12 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-[#00f0ff] flex items-center justify-center">
                                <Terminal className="w-6 h-6 text-black" />
                            </div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter glitch" data-text="VEIDENCE CORE">
                                VEIDENCE CORE
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <MetaBadge text="Security v.2" />
                            <MetaBadge text="Neural Auth" />
                        </div>
                    </div>

                    {/* Industrial Login Panel */}
                    <div className="bg-[#0f0f0f] border border-white/10 p-1 bg-opacity-80">
                        <div className="border border-white/5 p-8 md:p-12">
                            <h2 className="font-mono text-xs uppercase tracking-[0.4em] text-[#00f0ff] mb-8 border-b border-[#00f0ff]/20 pb-4 flex items-center gap-3">
                                <Zap className="w-4 h-4" /> [ IDENTITY_CHALLENGE ]
                            </h2>

                            <form onSubmit={handleLogin} className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="font-mono text-[10px] uppercase tracking-widest text-white/40 flex justify-between">
                                        <span>User_Identifier</span>
                                        <span className="text-[#00f0ff]/40">PROTOCOL_SMTP</span>
                                    </Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#00f0ff] transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="USER@SYSTEM.LOG"
                                            className="bg-black/50 border-white/10 rounded-none h-14 pl-12 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/20 text-white font-mono placeholder:text-white/10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="font-mono text-[10px] uppercase tracking-widest text-white/40 flex justify-between">
                                        <span>Crypt_Token</span>
                                        <ShieldAlert className="w-3 h-3 text-[#ff0055]" />
                                    </Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#00f0ff] transition-colors" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="bg-black/50 border-white/10 rounded-none h-14 pl-12 pr-12 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/20 text-white font-mono placeholder:text-white/10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#00f0ff] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 h-4" /> : <Eye className="h-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-16 bg-white hover:bg-[#00f0ff] text-black font-black uppercase tracking-[0.2em] rounded-none transition-all relative group overflow-hidden"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isLoading ? "Validating_Sequence..." : "Execute_Login"}
                                        {!isLoading && <ArrowRight className="w-5 h-5" />}
                                    </span>
                                    <div className="absolute inset-0 bg-[#00f0ff] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                </Button>
                            </form>

                            <div className="my-10 flex items-center gap-4">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.3em]">EXT_MODULES</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                disabled={isLoading}
                                className="w-full h-14 flex items-center justify-center gap-4 border border-white/10 hover:border-[#00f0ff]/50 hover:bg-white/5 transition-all group"
                            >
                                <Cpu className="w-5 h-5 text-white/40 group-hover:text-[#00f0ff]" />
                                <span className="font-mono text-[10px] uppercase tracking-widest">Federated_Identity_Protocol</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center font-mono text-[9px] text-white/20 uppercase tracking-widest">
                        <Link to="#" className="hover:text-white transition-colors underline decoration-white/10 underline-offset-4">Reset_Access</Link>
                        <span>[ STATUS: ACTIVE ]</span>
                        <Link to="#" className="hover:text-white transition-colors underline decoration-white/10 underline-offset-4">Tech_Support</Link>
                    </div>
                </div>
            </div>

            {/* Decorative Side Panel */}
            <div className="hidden lg:flex w-1/3 border-l border-white/5 bg-[#050505] flex-col justify-between p-12">
                <div>
                    <div className="p-4 border border-[#00f0ff]/20 bg-[#00f0ff]/5 mb-12">
                        <Layers className="text-[#00f0ff] w-8 h-8 mb-4" />
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Technical Core</h3>
                        <p className="text-[10px] font-mono text-white/40 leading-relaxed uppercase tracking-widest">
                            Distributed architecture for educational data handling. Neural processing enabled.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between font-mono text-[8px] uppercase tracking-widest border-b border-white/5 pb-2">
                        <span>Cluster_ID</span>
                        <span className="text-white/60">0x-PD4-META</span>
                    </div>
                    <div className="flex justify-between font-mono text-[8px] uppercase tracking-widest border-b border-white/5 pb-2">
                        <span>Node_Status</span>
                        <span className="text-[#00f0ff]">ONLINE</span>
                    </div>
                    <div className="flex justify-between font-mono text-[8px] uppercase tracking-widest border-b border-white/5 pb-2">
                        <span>Latency</span>
                        <span className="text-white/60">4.2MS</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

