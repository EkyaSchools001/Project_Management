import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DEPARTMENTS } from '../../../data/organization';
import {
    Users,
    ChevronRight,
    Search,
    Layers,
    Shield,
    Activity,
    ArrowUpRight,
    Plus,
    Filter,
    Zap,
    Sparkles,
    Globe,
    Cpu
} from 'lucide-react';
import { Card } from '../../../components/ui/CardLegacy';

export default function Departments() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDepts = useMemo(() => {
        return DEPARTMENTS.filter(d =>
            (d.name && d.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (d.head && d.head.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1800px] mx-auto space-y-12 sm:space-y-16 p-4 sm:p-10 lg:p-16 pb-32"
        >
            {/* Vibrant Header Section */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 relative overflow-hidden p-10 sm:p-16 lg:p-20 bg-backgroundackground rounded-[4rem] sm:rounded-[5rem] text-foreground shadow-2xl group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-violet-600/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500 rounded-full blur-[140px] opacity-20 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                
                <div className="space-y-8 relative z-10 max-w-2xl">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] backdrop-blur-md">
                        <div className="w-2.5 h-2.5 rounded-full bg-backgroundmerald-400 animate-pulse-glow shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
                        Infrastructure Matrix: Nominal
                    </motion.div>
                    <motion.h1 variants={itemVariants} className="text-4xl sm:text-7xl lg:text-9xl font-black text-foreground tracking-tighter uppercase leading-[0.85]">
                        System <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400 animate-gradient-shift">Nodes</span>
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-foreground/40 font-black text-xs sm:text-base uppercase tracking-widest flex items-center gap-4">
                        <Globe size={24} className="text-indigo-400" />
                        Global Logistical Unit & Cluster Orchestration
                    </motion.p>
                </div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto relative z-10 lg:pb-6">
                    <div className="relative flex-1 sm:w-[450px] group/search">
                        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-foreground/40 w-6 h-6 group-focus-within/search:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="QUERY INFRASTRUCTURE..."
                            className="w-full pl-18 pr-8 h-20 bg-white/5 border border-white/10 rounded-[2.5rem] text-xs font-black uppercase tracking-[0.2em] focus:border-indigo-500 focus:bg-white/10 outline-none transition-all backdrop-blur-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button className="h-20 px-12 bg-gradient-to-r from-indigo-600 to-violet-600 text-foreground font-black rounded-[2.5rem] text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 shrink-0 group/deploy">
                        <Plus size={24} className="group-hover/deploy:rotate-90 transition-transform" />
                        Deploy Unit
                    </button>
                </motion.div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {[
                    { label: 'Active Clusters', value: DEPARTMENTS.length, icon: Layers, color: 'from-blue-500 to-indigo-600', iconColor: 'text-blue-500' },
                    { label: 'Verified Nodes', value: '11', icon: Shield, color: 'from-emerald-400 to-teal-600', iconColor: 'text-emerald-500' },
                    { label: 'Network Integrity', value: '99.9%', icon: Activity, color: 'from-amber-400 to-orange-600', iconColor: 'text-amber-500' }
                ].map((stat, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Card className="flex items-center gap-10 p-12 bg-white border border-slate-100 rounded-[4rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] group hover:border-indigo-200 transition-all duration-700 relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700`} />
                            <div className={`h-22 w-22 flex items-center justify-center bg-slate-50 rounded-[2.5rem] shrink-0 shadow-inner group-hover:scale-115 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-indigo-500/10 transition-all duration-700`}>
                                <div className={`${stat.iconColor} transition-transform duration-700`}>
                                    <stat.icon size={40} />
                                </div>
                            </div>
                            <div className="min-w-0 space-y-2">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2 truncate group-hover:text-slate-950 transition-colors">{stat.label}</p>
                                <div className="flex items-baseline gap-4">
                                    <p className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter truncate group-hover:scale-105 transition-transform duration-700 origin-left">{stat.value}</p>
                                    <ArrowUpRight size={24} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                <AnimatePresence>
                    {filteredDepts.map((dept, index) => (
                        <motion.div
                            key={dept.id}
                            layout
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <Card
                                onClick={() => navigate(`/departments/${dept.id}`)}
                                className="h-full group relative overflow-hidden cursor-pointer hover:shadow-[0_60px_100px_rgba(0,0,0,0.08)] hover:border-indigo-500 hover:-translate-y-4 transition-all duration-1000 border border-slate-100 bg-white rounded-[4rem] p-12 flex flex-col items-center text-center space-y-10"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none rounded-bl-full transition-opacity opacity-0 group-hover:opacity-100" />
                                
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 scale-150" />
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-950 text-foreground rounded-[2.5rem] flex items-center justify-center font-black text-3xl sm:text-4xl shadow-2xl relative z-10 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-700 border-4 border-white">
                                        {index + 1}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-backgroundmerald-500 text-[9px] font-black p-2 rounded-xl text-foreground border-4 border-white shadow-xl z-20 group-hover:animate-bounce">
                                        SYNC
                                    </div>
                                </div>

                                <div className="space-y-4 w-full">
                                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 leading-none tracking-tighter group-hover:text-indigo-600 transition-colors uppercase animate-gradient-shift px-2">
                                        {dept.name}
                                    </h3>
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex items-center gap-3 px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 transition-colors group-hover:border-indigo-100">
                                            <Cpu size={16} className="text-indigo-400" />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Core Lead: {dept.head}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full pt-10 border-t border-slate-50 mt-auto">
                                    <button className="w-full h-18 bg-slate-950 group-hover:bg-indigo-600 text-foreground text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.75rem] transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-4 active:scale-95 group-hover:shadow-indigo-600/30">
                                        ACCESS NODE
                                        <ArrowUpRight size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

