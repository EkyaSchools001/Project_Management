import React, { useState } from 'react';
import { Card } from '../../../components/ui/CardLegacy';
import { 
    BarChart3, 
    FileText, 
    Download, 
    TrendingUp, 
    Filter, 
    Sparkles, 
    LayoutDashboard, 
    GanttChartSquare, 
    Clock,
    Activity,
    Zap,
    Cpu,
    ArrowUpRight,
    Globe,
    Shield,
    Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReportsDashboard from '../components/ReportsDashboard';
import ReportsGantt from '../components/ReportsGantt';
import ReportsSquadLogs from '../components/ReportsSquadLogs';

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiInsights, setAiInsights] = useState(null);

    const handleAIAnalyze = () => {
        setIsAnalyzing(true);
        // Simulate API call
        setTimeout(() => {
            setAiInsights(`Based on the current project velocity, the "Website Redesign" project is at risk of slipping by 3 days due to backend integration delays. Recommend reallocating 2 junior developers from "Staff Training" to clear the backlog.`);
            setIsAnalyzing(false);
        }, 2000);
    };

    const handleExport = () => {
        alert("Exporting report... (Mock functionality)");
    };

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
            className="space-y-16 p-6 sm:p-10 lg:p-16 max-w-[1700px] mx-auto pb-40"
        >
            {/* Header Section */}
            <header className="relative overflow-hidden p-12 sm:p-20 bg-zinc-900 rounded-[5rem] text-white shadow-2xl group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-violet-600/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[200px] opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-16 relative z-10">
                    <div className="space-y-10 flex-1">
                        <motion.div variants={itemVariants} className="flex items-center gap-6">
                            <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse-glow shadow-[0_0_20px_rgba(79,70,229,0.8)]" />
                            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em]">Core Velocity Analytics Protocol</span>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl sm:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] drop-shadow-2xl">
                            Intelligence Matrix
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-white/40 max-w-2xl text-lg sm:text-xl font-black uppercase tracking-widest leading-relaxed border-l-8 border-white/10 pl-10">
                            Heuristic analysis of system velocity and resource allocation across the deployment cloud.
                        </motion.p>
                    </div>
                    
                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-8 w-full xl:w-auto">
                        <button
                            onClick={handleAIAnalyze}
                            disabled={isAnalyzing}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-6 h-24 px-16 bg-white/5 backdrop-blur-2xl border border-white/10 text-white rounded-[2.5rem] text-xs font-black uppercase tracking-widest hover:bg-indigo-600/20 hover:border-indigo-500 hover:scale-105 shadow-2xl active:scale-95 transition-all disabled:opacity-70 group/ai"
                        >
                            <Sparkles size={28} className={isAnalyzing ? "animate-spin text-indigo-400" : "group-hover:rotate-12 transition-transform text-indigo-400"} />
                            {isAnalyzing ? 'SYNCHRONIZING...' : 'GENERATE NEURAL INSIGHTS'}
                        </button>

                        <button
                            onClick={handleExport}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-6 h-24 px-16 bg-white text-slate-900 rounded-[2.5rem] text-xs font-black uppercase tracking-widest hover:bg-slate-200 hover:scale-105 shadow-2xl transition-all active:scale-95 group/export"
                        >
                            <Download size={28} className="group-hover:translate-y-1 transition-transform" />
                            EXPORT DATA MATRIX
                        </button>
                    </motion.div>
                </div>
            </header>

            {/* AI Insights Section */}
            <AnimatePresence>
                {aiInsights && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white border border-indigo-100 p-10 sm:p-20 rounded-[4rem] sm:rounded-[6rem] relative overflow-hidden shadow-[0_50px_150px_rgba(79,70,229,0.12)]"
                    >
                        <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none rotate-12 text-indigo-600">
                            <Sparkles size={400} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-12 sm:gap-20 relative z-10 w-full items-start">
                            <div className="w-28 h-28 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center shrink-0 border border-indigo-100 shadow-2xl group relative">
                                <Sparkles size={56} className="group-hover:rotate-12 transition-transform" />
                                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-125" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10">
                                    <div className="space-y-4">
                                        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-slate-950 leading-none">Neural Strategy Recommended</h3>
                                        <div className="flex items-center gap-6">
                                            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                                            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-600">Autonomous Heuristic Analysis v4.0.2 // Secured</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setAiInsights(null)}
                                        className="text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 py-4 px-10 rounded-[1.5rem] border border-slate-100 hover:border-rose-100 transition-all active:scale-95 shadow-sm"
                                    >
                                        DISMISS PROTOCOL
                                    </button>
                                </div>
                                <div className="text-slate-950 font-black uppercase tracking-widest leading-[1.8] text-xl sm:text-2xl border-l-[12px] border-indigo-600 pl-12 py-10 italic bg-indigo-50/50 rounded-r-[3rem] shadow-inner">
                                    "{aiInsights}"
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                    <InsightMetric label="Confidence" value="98.4%" icon={Shield} color="text-emerald-500" />
                                    <InsightMetric label="Impact Score" value="High" icon={Zap} color="text-amber-500" />
                                    <InsightMetric label="Neural Nodes" value="1,024" icon={Cpu} color="text-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View Mode Tabs Protocol */}
            <div className="flex flex-wrap bg-white p-3 rounded-[3rem] border border-slate-100 shadow-xl w-full sm:w-max mx-auto mb-16 overflow-hidden">
                {[
                    { id: 'dashboard', label: 'Overview Matrix', icon: LayoutDashboard },
                    { id: 'gantt', label: 'Timeline Vector', icon: GanttChartSquare },
                    { id: 'logs', label: 'Personnel Audit', icon: Clock }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-5 px-12 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id
                            ? 'bg-slate-950 text-white shadow-2xl shadow-indigo-600/20 translate-y-[-4px]'
                            : 'text-zinc-400 hover:text-slate-950'
                            }`}
                    >
                        <tab.icon size={24} className={activeTab === tab.id ? 'text-indigo-400' : 'text-slate-300'} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <main className="min-h-[700px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                    >
                        {activeTab === 'dashboard' && <ReportsDashboard />}
                        {activeTab === 'gantt' && <ReportsGantt />}
                        {activeTab === 'logs' && <ReportsSquadLogs />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Neural System Footer */}
            <div className="py-20 flex flex-col items-center gap-10 opacity-40">
                <div className="w-60 h-1 bg-slate-100 rounded-full overflow-hidden p-0">
                    <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="h-full w-40 bg-gradient-to-r from-transparent via-indigo-600 to-transparent relative" 
                    />
                </div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[1em]">Secure End-to-End Encryption // Analytics Node 0x77-A</p>
            </div>
        </motion.div>
    );
};

const InsightMetric = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-6 p-6 sm:p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group/metric transition-all hover:bg-white hover:shadow-xl hover:border-indigo-200">
        <div className={`p-4 bg-white rounded-2xl shadow-sm ${color} group-hover/metric:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black text-slate-950 uppercase tracking-tighter">{value}</p>
        </div>
    </div>
);

export default ReportsPage;

