import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHOOLS } from '../../../data/organization';
import {
    School,
    MapPin,
    ChevronRight,
    GraduationCap,
    LayoutGrid,
    Sparkles,
    ShieldCheck,
    Trophy,
    Activity,
    Globe,
    Zap,
    Layers,
    ArrowUpRight
} from 'lucide-react';
import { Card } from '../../../components/ui/CardLegacy';

const CATEGORIES = [
    { id: 'all', name: 'All Schools', icon: LayoutGrid, color: 'text-foreground', bg: 'bg-backgroundackground', activeBg: 'bg-indigo-600', activeText: 'text-foreground', count: (s) => Object.values(s).flat().length },
    { id: 'progressive', name: 'Progressive', icon: Sparkles, color: 'text-blue-500', bg: 'bg-backgroundlue-50', activeBg: 'bg-backgroundlue-600', activeText: 'text-foreground', count: (s) => s.progressive.length },
    { id: 'icse_cbse', name: 'Regulatory', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-50', activeBg: 'bg-indigo-600', activeText: 'text-foreground', count: (s) => s.icse_cbse.length },
    { id: 'purpose_based', name: 'Specialized', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-50', activeBg: 'bg-purple-600', activeText: 'text-foreground', count: (s) => s.purpose_based.length }
];

export default function Schools() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
    };

    const renderSection = (title, schoolsList) => (
        <motion.div 
            variants={sectionVariants}
            className="space-y-12"
        >
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 group">
                <div className="flex items-center gap-6">
                    <div className="w-2 h-16 bg-slate-950 group-hover:bg-indigo-600 transition-all duration-700 rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-[0.4em] whitespace-nowrap">{title}</h2>
                </div>
                <div className="flex-1 h-[2px] bg-slate-100 group-hover:bg-indigo-50 transition-colors hidden sm:block" />
                <div className="px-8 py-3 bg-white border border-slate-100 rounded-[1.5rem] text-[11px] font-black text-muted-foreground uppercase tracking-widest shadow-sm group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all">
                    {schoolsList.length} Network Nodes
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {schoolsList.map((school, index) => (
                    <motion.div
                        key={school.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
                        whileHover={{ y: -12, transition: { duration: 0.4 } }}
                    >
                        <Card
                            className="h-full group relative overflow-hidden cursor-pointer hover:shadow-[0_45px_100px_rgba(0,0,0,0.1)] hover:border-indigo-500 transition-all duration-700 border border-slate-100 bg-white rounded-[3.5rem] p-10 flex flex-col items-center text-center space-y-10"
                            onClick={() => navigate(`/schools/${school.id}`)}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none rounded-bl-full transition-opacity opacity-0 group-hover:opacity-100" />
                            
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 scale-150" />
                                <div className="w-22 h-22 bg-slate-50 text-indigo-600 rounded-[2rem] flex items-center justify-center shadow-inner relative z-10 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-foreground transition-all duration-700 border border-slate-100 group-hover:border-indigo-500 group-hover:shadow-2xl group-hover:shadow-indigo-600/30">
                                    <School size={36} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-backgroundmerald-500 p-2 rounded-xl text-foreground border-4 border-white shadow-xl z-20 group-hover:animate-bounce">
                                    <Activity size={12} />
                                </div>
                            </div>

                            <div className="space-y-4 w-full">
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 leading-none tracking-tighter group-hover:text-indigo-600 transition-colors uppercase animate-gradient-shift line-clamp-2 min-h-[4.5rem] px-2 flex items-center justify-center">
                                    {school.name}
                                </h3>
                                <div className="flex items-center justify-center gap-3 px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 transition-colors group-hover:border-indigo-100">
                                    <MapPin size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Regional Node</span>
                                </div>
                            </div>

                            <div className="w-full pt-10 border-t border-slate-50 mt-auto">
                                <button className="w-full h-18 bg-slate-950 group-hover:bg-indigo-600 text-foreground text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.75rem] transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-4 active:scale-95 group-hover:shadow-indigo-600/30">
                                    SYSTEM ACCESS
                                    <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1800px] mx-auto space-y-16 p-6 sm:p-10 lg:p-20 pb-40"
        >
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 relative overflow-hidden p-12 sm:p-16 lg:p-24 bg-backgroundackground rounded-[5rem] text-foreground shadow-2xl group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-violet-600/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500 rounded-full blur-[140px] opacity-20 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                
                <div className="space-y-10 relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] backdrop-blur-md">
                        <div className="w-2.5 h-2.5 rounded-full bg-backgroundmerald-400 animate-pulse-glow shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
                        Infrastructure Matrix: Nominal
                    </div>
                    <h1 className="text-5xl sm:text-8xl lg:text-9xl font-black text-foreground tracking-tighter uppercase leading-[0.85]">
                        Network <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400 animate-gradient-shift">Nodes</span>
                    </h1>
                    <p className="text-foreground/40 font-black text-xs sm:text-base uppercase tracking-widest flex items-center gap-6">
                        <Globe size={32} className="text-indigo-400 animate-spin-slow" />
                        Global Infrastructure Protocol v9.0 // Systemic Node Orchestration
                    </p>
                </div>

                <div className="flex items-center gap-10 bg-white/5 backdrop-blur-3xl border border-white/10 px-12 h-28 py-10 rounded-[3rem] shadow-2xl shadow-black/20 w-full xl:w-auto relative z-10 group-hover:bg-white/10 transition-all duration-700">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em]">Integrated Nodes</p>
                        <div className="flex items-baseline gap-4">
                            <span className="text-6xl font-black text-indigo-400 tracking-tighter">{Object.values(SCHOOLS).flat().length}</span>
                            <span className="text-xl font-black text-foreground/20 uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                    <div className="w-px h-16 bg-white/10 mx-4" />
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 animate-pulse">
                        <Zap size={32} className="text-amber-400" />
                    </div>
                </div>
            </header>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-6 overflow-x-auto no-scrollbar pb-8 pt-4">
                {CATEGORIES.map((cat, i) => (
                    <motion.button
                        key={cat.id}
                        layout
                        onClick={() => setFilter(cat.id)}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "group flex items-center gap-5 px-10 h-20 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all border shadow-2xl whitespace-nowrap",
                            filter === cat.id
                                ? `bg-slate-950 text-foreground border-transparent shadow-slate-900/30 scale-105`
                                : `bg-white border-slate-100 text-muted-foreground hover:border-indigo-400 hover:text-slate-950 shadow-slate-200/50`
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                            filter === cat.id ? "bg-indigo-500 text-foreground rotate-12" : "bg-slate-50 text-muted-foreground group-hover:bg-indigo-50 group-hover:text-indigo-600"
                        )}>
                            <cat.icon size={20} />
                        </div>
                        {cat.name}
                        <div className={cn(
                            "ml-4 px-4 py-1.5 rounded-xl text-[10px] font-black transition-all",
                            filter === cat.id ? "bg-white/10 text-indigo-100" : "bg-slate-50 text-muted-foreground group-hover:bg-indigo-100 group-hover:text-indigo-600"
                        )}>
                            {cat.count(SCHOOLS)}
                        </div>
                    </motion.button>
                ))}
            </div>

            <div className="space-y-40">
                <AnimatePresence mode="wait">
                    {(filter === 'all' || filter === 'progressive') && (
                        <motion.div key="progressive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {renderSection('Strategic Cluster Alpha', SCHOOLS.progressive)}
                        </motion.div>
                    )}
                    {(filter === 'all' || filter === 'icse_cbse') && (
                        <motion.div key="icse_cbse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={filter === 'all' ? 'pt-40' : ''}>
                            {renderSection('Regulatory Control Node', SCHOOLS.icse_cbse)}
                        </motion.div>
                    )}
                    {(filter === 'all' || filter === 'purpose_based') && (
                        <motion.div key="purpose_based" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={filter === 'all' ? 'pt-40' : ''}>
                            {renderSection('Specialized Operational Node', SCHOOLS.purpose_based)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

