import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHOOLS } from '../../../data/organization';
import { 
    ArrowLeft, 
    LayoutDashboard, 
    UserCheck, 
    BookOpen, 
    GraduationCap, 
    ShieldCheck, 
    MapPin, 
    Activity, 
    ChevronRight, 
    ArrowUpRight, 
    Cpu,
    Zap,
    Sparkles,
    Shield,
    Globe,
    Layers,
    Target
} from 'lucide-react';
import { Card } from '../../../components/ui/CardLegacy';

export default function SchoolDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const allSchools = useMemo(() => {
        return [
            ...SCHOOLS.progressive,
            ...SCHOOLS.icse_cbse,
            ...SCHOOLS.purpose_based
        ];
    }, []);

    const school = allSchools.find(s => s.id === id);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    if (!school) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-10 p-10 bg-slate-950 text-foreground">
            <motion.div 
                initial={{ rotate: 0, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 360, scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: 'spring' }}
                className="w-32 h-32 bg-rose-500/20 text-rose-500 rounded-[3rem] flex items-center justify-center shadow-[0_0_100px_rgba(244,63,94,0.3)] border border-rose-500/30"
            >
                <Target size={64} className="animate-pulse" />
            </motion.div>
            <div className="text-center space-y-4">
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Node Not Found</h1>
                <p className="text-foreground/40 font-black text-xs sm:text-base uppercase tracking-[0.4em]">The specified endpoint protocol has been terminated.</p>
            </div>
            <button 
                onClick={() => navigate('/schools')} 
                className="h-20 px-12 bg-white text-slate-950 font-black rounded-[2.5rem] hover:scale-110 active:scale-95 transition-all uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-white/10"
            >
                Return to Registry
            </button>
        </div>
    );

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1800px] mx-auto space-y-16 p-6 sm:p-10 lg:p-16 pb-40"
        >
            {/* High-Vibrancy Header */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 relative overflow-hidden p-12 sm:p-16 lg:p-24 bg-backgroundackground rounded-[5rem] text-foreground shadow-2xl group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-rose-600/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-rose-500 rounded-full blur-[180px] opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                
                <div className="space-y-10 relative z-10 flex-1 w-full sm:w-auto">
                    <motion.button
                        variants={itemVariants}
                        onClick={() => navigate('/schools')}
                        className="group flex items-center text-[10px] font-black text-foreground/40 hover:text-indigo-400 transition-all uppercase tracking-[0.4em]"
                    >
                        <ArrowLeft className="w-5 h-5 mr-4 group-hover:-translate-x-3 transition-transform" />
                        Global Infrastructure Network
                    </motion.button>
                    
                    <div className="space-y-6">
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
                            <h1 className="text-5xl sm:text-8xl lg:text-9xl font-black text-foreground tracking-tighter uppercase leading-[0.85] drop-shadow-2xl">{school.name}</h1>
                            <div className="px-8 py-3 bg-indigo-600 text-foreground rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-indigo-600/40 border border-white/10">
                                ACTIVE_NODE
                            </div>
                        </motion.div>
                        <motion.p variants={itemVariants} className="text-foreground/40 font-black text-xs sm:text-lg uppercase tracking-[0.2em] flex items-center gap-4">
                            <Globe size={28} className="text-indigo-400" />
                            Protocol Vector: <span className="text-indigo-400 animate-gradient-shift">EKYA_{school.id.toUpperCase()}</span>
                        </motion.p>
                    </div>
                </div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-10 bg-white/5 backdrop-blur-3xl border border-white/10 p-10 lg:p-12 rounded-[4rem] shadow-2xl shadow-black/20 w-full xl:w-auto relative z-10 group-hover:bg-white/10 transition-all duration-700">
                    <div className="flex flex-col gap-4 border-b sm:border-b-0 sm:border-r border-white/10 pb-6 sm:pb-0 sm:pr-12 w-full sm:w-auto">
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4 bg-backgroundmerald-400 rounded-full animate-pulse-glow shadow-[0_0_20px_rgba(52,211,153,0.6)]" />
                            <span className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.3em]">Network Uptime</span>
                        </div>
                        <span className="text-5xl font-black text-foreground leading-none">100.0%</span>
                    </div>
                    <div className="flex flex-col gap-4 w-full sm:w-auto">
                        <div className="flex items-center gap-4">
                            <Activity className="text-indigo-400 w-6 h-6" />
                            <span className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.3em]">Operational Vectors</span>
                        </div>
                        <span className="text-5xl font-black text-foreground leading-none">4.8k+</span>
                    </div>
                </motion.div>
            </header>

            {/* Interactive Module Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {[
                    { label: 'Control Center', icon: LayoutDashboard, desc: 'Operational Matrix', color: 'from-blue-500 to-indigo-600', text: 'text-blue-500' },
                    { label: 'Personnel', icon: UserCheck, desc: 'Identity Clusters', color: 'from-violet-500 to-purple-600', text: 'text-violet-500' },
                    { label: 'Identity Vault', icon: GraduationCap, desc: 'Credential Streams', color: 'from-rose-500 to-pink-600', text: 'text-rose-500' },
                    { label: 'Protocol Base', icon: BookOpen, desc: 'Strategic Nodes', color: 'from-emerald-400 to-teal-600', text: 'text-emerald-500' }
                ].map((item, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Card className="p-12 group cursor-pointer hover:shadow-[0_45px_100px_rgba(0,0,0,0.1)] hover:border-indigo-500 transition-all duration-700 bg-white border border-slate-100 rounded-[4rem] relative overflow-hidden flex flex-col items-center text-center space-y-10 group/card">
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700`} />
                            
                            <div className={`w-28 h-28 rounded-[2.5rem] bg-slate-50 flex items-center justify-center transition-all group-hover:scale-115 mb-4 shadow-inner group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-indigo-500/10 ${item.text}`}>
                                <item.icon size={44} className="group-hover:rotate-12 transition-transform duration-700" />
                            </div>
                            
                            <div className="space-y-4 w-full">
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors leading-none">{item.label}</h3>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-10">{item.desc}</p>
                            </div>

                            <div className="w-full pt-10 border-t border-slate-50 mt-auto flex items-center justify-between">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] opacity-0 group-hover/card:opacity-100 transition-all translate-x-6 group-hover/card:translate-x-0">Launch Module</span>
                                <ChevronRight className="text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-3 transition-all" size={28} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Neural Sync Section */}
            <motion.div variants={itemVariants}>
                <Card className="bg-slate-950 text-foreground p-16 lg:p-24 flex flex-col xl:flex-row items-center justify-between gap-20 relative overflow-hidden group border-none shadow-[0_60px_150px_rgba(0,0,0,0.3)] rounded-[5rem]">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-rose-600/5 to-transparent pointer-events-none" />
                    <div className="absolute top-0 right-0 p-12 opacity-10 scale-150 rotate-12 transition-transform duration-1000 group-hover:rotate-0 pointer-events-none text-indigo-500">
                        <Shield size={600} />
                    </div>

                    <div className="relative z-10 max-w-4xl space-y-12">
                        <div className="inline-flex items-center gap-6 px-10 py-4 bg-indigo-600/10 rounded-full border border-indigo-400/20 backdrop-blur-xl group-hover:bg-indigo-600/20 transition-all">
                            <Cpu size={28} className="text-indigo-400 animate-pulse" />
                            <span className="text-[12px] font-black tracking-[0.4em] uppercase text-indigo-300">Enterprise Integration Layer v2.0</span>
                        </div>
                        <div className="space-y-8">
                            <h3 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter leading-none">
                                Neural <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Sync Matrix</span>
                            </h3>
                            <p className="text-foreground/40 text-xl sm:text-2xl font-black uppercase tracking-widest leading-relaxed group-hover:text-foreground/60 transition-colors">
                                Initializing campus-wide synchronization: Autonomous Teacher, Leader, and Admin protocols are being mapped to the central pedagogical registry node.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8 pt-8">
                            <button className="h-22 px-14 bg-indigo-600 text-foreground font-black rounded-[2rem] hover:bg-indigo-500 shadow-2xl shadow-indigo-600/40 active:scale-95 transition-all uppercase tracking-[0.4em] text-[11px] flex items-center gap-6 group/btn">
                                Initialize Protocol
                                <Zap size={24} className="group-hover/btn:scale-125 transition-transform" />
                            </button>
                            <button className="h-22 px-12 bg-white/5 border-2 border-white/10 text-foreground font-black rounded-[2rem] hover:bg-white/10 transition-all uppercase tracking-[0.4em] text-[11px] backdrop-blur-md">
                                Manual Link
                            </button>
                        </div>
                    </div>

                    <div className="relative z-10 hidden xl:block shrink-0">
                        <div className="w-[450px] h-[450px] border-[30px] border-white/5 rounded-[4rem] flex items-center justify-center relative shadow-inner overflow-hidden">
                            <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors" />
                            <div className="w-full h-full border-4 border-dashed border-indigo-500/20 rounded-full animate-spin-slow absolute scale-150 rotate-45" />
                            <div className="w-full h-full border-2 border-rose-500/20 rounded-[3rem] animate-spin-slow absolute -rotate-12" />
                            <div className="relative z-20 flex flex-col items-center gap-6">
                                <Sparkles size={140} className="text-indigo-400 group-hover:scale-110 transition-transform duration-1000" />
                                <div className="text-[10px] font-black tracking-[1em] text-indigo-400/40 uppercase">AWAITING SYNC</div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <div className="py-20 flex flex-col items-center gap-10">
                <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-rose-600 rounded-full" 
                    />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em] animate-pulse">Global Network v9.0 // Unified Layer // Secured</p>
            </div>
        </motion.div>
    );
}

