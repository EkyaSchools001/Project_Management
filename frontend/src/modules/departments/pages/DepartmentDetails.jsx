import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DEPARTMENTS } from '../../../data/organization';
import { MOCK_PROJECTS, MOCK_TASKS } from '../../../data/pmsData';
import {
    ArrowLeft,
    Layout,
    ListTodo,
    FileText,
    Users,
    TrendingUp,
    Clock,
    AlertCircle,
    ChevronRight,
    Target,
    Zap,
    Briefcase,
    Activity,
    Calendar,
    ArrowUpRight,
    Search,
    Filter,
    MoreVertical,
    Shield,
    Sparkles,
    Globe,
    Cpu,
    Layers
} from 'lucide-react';
import { Card } from '../../../components/ui/CardLegacy';

export default function DepartmentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    
    const dept = useMemo(() => DEPARTMENTS.find(d => d.id === id), [id]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    if (!dept) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-10 p-10 bg-slate-950 text-foreground">
            <motion.div 
                initial={{ rotate: 0, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 360, scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: 'spring' }}
                className="w-32 h-32 bg-rose-500/20 text-rose-500 rounded-[3rem] flex items-center justify-center shadow-[0_0_100px_rgba(244,63,94,0.3)] border border-rose-500/30"
            >
                <AlertCircle size={64} className="animate-pulse" />
            </motion.div>
            <div className="text-center space-y-4">
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Unit Offline</h1>
                <p className="text-foreground/40 font-black text-xs sm:text-base uppercase tracking-[0.4em]">The departmental node identification protocol failed.</p>
            </div>
            <button 
                onClick={() => navigate('/departments')} 
                className="h-20 px-12 bg-white text-slate-950 font-black rounded-[2.5rem] hover:scale-110 active:scale-95 transition-all uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-white/10"
            >
                Return to Command Hub
            </button>
        </div>
    );

    const activeProjects = MOCK_PROJECTS.filter(p => p.status === 'IN_PROGRESS').length;
    const completedTasks = MOCK_TASKS.filter(t => t.status === 'Done' || t.status === 'DONE').length;
    const pendingTasks = MOCK_TASKS.length - completedTasks;

    const stats = [
        { label: 'Live Projects', value: activeProjects, icon: Briefcase, color: 'from-red-500 to-rose-600', text: 'text-red-500', link: `/departments/${id}/projects` },
        { label: 'Pending Operations', value: pendingTasks, icon: ListTodo, color: 'from-red-500 to-red-600', text: 'text-red-500', link: `/departments/${id}/tasks` },
        { label: 'Success Index', value: '94%', icon: Target, color: 'from-red-400 to-rose-600', text: 'text-red-500', link: `/departments/${id}/reports` },
        { label: 'Core Velocity', value: '4.2', icon: Zap, color: 'from-amber-400 to-orange-600', text: 'text-amber-500', link: `/departments/${id}/reports` },
    ];

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1800px] mx-auto space-y-16 p-6 sm:p-10 lg:p-16 pb-40"
        >
            {/* High-Vibrancy Header */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 relative overflow-hidden p-12 sm:p-16 lg:p-24 bg-background rounded-[5rem] text-foreground shadow-2xl group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/30 via-red-600/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-rose-500 rounded-full blur-[200px] opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                
                <div className="space-y-10 relative z-10 flex-1 w-full sm:w-auto">
                    <motion.button
                        variants={itemVariants}
                        onClick={() => navigate('/departments')}
                        className="group flex items-center text-[10px] font-black text-foreground/40 hover:text-rose-400 transition-all uppercase tracking-[0.4em]"
                    >
                        <ArrowLeft className="w-5 h-5 mr-4 group-hover:-translate-x-3 transition-transform" />
                        Infrastructure Matrix Registry
                    </motion.button>
                    
                    <div className="space-y-6">
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
                            <h1 className="text-5xl sm:text-8xl lg:text-9xl font-black text-foreground tracking-tighter uppercase leading-[0.85] drop-shadow-2xl">{dept.name}</h1>
                            <div className="px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/10 text-rose-400 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">
                                FUNCTIONAL_CLUSTER
                            </div>
                        </motion.div>
                        <motion.p variants={itemVariants} className="text-foreground/40 font-black text-xs sm:text-xl uppercase tracking-[0.3em] flex items-center gap-6">
                            <Cpu size={32} className="text-rose-400 animate-gradient-shift" />
                            Lead Orchestrator: <span className="text-foreground font-black">{dept.head}</span>
                        </motion.p>
                    </div>
                </div>

                <motion.div variants={itemVariants} className="flex flex-wrap gap-6 w-full xl:w-auto relative z-10 group/nav pb-4">
                    {id === 'pd' && (
                        <motion.button
                            whileHover={{ y: -6, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/departments/pd')}
                            className="flex flex-col items-center justify-end p-8 h-40 bg-[#ef4444]/10 backdrop-blur-xl border border-[#ef4444]/30 rounded-[2.5rem] hover:bg-[#ef4444]/20 hover:border-[#ef4444]/60 transition-all group flex-1 min-w-[160px] relative overflow-hidden"
                        >
                            <div className="absolute top-4 right-4 text-[#ef4444]/30 group-hover:text-[#ef4444]/60 transition-colors">
                                <ArrowUpRight size={24} />
                            </div>
                            <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-[#ef4444]/20 text-[#ef4444] transition-transform group-hover:scale-115 shadow-2xl mb-6">
                                <Sparkles size={28} />
                            </div>
                            <span className="text-[10px] font-black text-[#ef4444]/70 uppercase tracking-[0.3em] group-hover:text-[#ef4444] transition-colors">PD Hub</span>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ef4444]/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                        </motion.button>
                    )}
                    <NavAction onClick={() => navigate(`/departments/${id}/projects`)} icon={Layout} label="Portfolio" color="text-red-400" bg="bg-red-600/10" />
                    <NavAction onClick={() => navigate(`/departments/${id}/tasks`)} icon={ListTodo} label="Operations" color="text-rose-400" bg="bg-rose-600/10" />
                    <NavAction onClick={() => navigate(`/departments/${id}/reports`)} icon={FileText} label="Analytics" color="text-rose-400" bg="bg-rose-600/10" />
                    <NavAction onClick={() => navigate(`/departments/${id}/team`)} icon={Users} label="Personnel" color="text-amber-400" bg="bg-amber-600/10" />
                </motion.div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {stats.map((stat, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Card
                            className="p-12 flex flex-col gap-10 group cursor-pointer hover:shadow-[0_45px_100px_rgba(0,0,0,0.1)] hover:border-rose-500 transition-all duration-700 bg-white border border-slate-100 rounded-[4rem] relative overflow-hidden group/card"
                            onClick={() => navigate(stat.link)}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700`} />
                            
                            <div className="flex items-center justify-between relative z-10">
                                <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center bg-slate-50 shadow-inner group-hover:scale-115 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-rose-500/10 transition-all duration-700 ${stat.text}`}>
                                    <stat.icon size={36} className="group-hover:rotate-12 transition-transform duration-700" />
                                </div>
                                <div className="w-14 h-14 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-rose-600 group-hover:bg-rose-50 transition-all duration-500 group-hover:rotate-45">
                                    <ArrowUpRight size={28} />
                                </div>
                            </div>
                            
                            <div className="relative z-10 space-y-2">
                                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-4 group-hover:text-slate-900 transition-colors uppercase">{stat.label}</p>
                                <p className="text-5xl sm:text-7xl font-black text-slate-950 tracking-tighter leading-none group-hover:scale-105 transition-transform origin-left duration-700">{stat.value}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-20">
                {/* Active Workstreams Section */}
                <div className="xl:col-span-2 space-y-12">
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">
                        <div className="space-y-3">
                            <h2 className="text-4xl sm:text-5xl font-black text-slate-950 uppercase tracking-tighter flex items-center gap-6 leading-none">
                                <div className="p-4 bg-rose-600 text-foreground rounded-[1.5rem] shadow-xl shadow-rose-600/30">
                                    <Activity size={32} />
                                </div>
                                Active Clusters
                            </h2>
                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] pl-20">Monitoring cluster velocity and synchronicity</p>
                        </div>
                        <div className="relative group w-full sm:w-auto">
                            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-rose-600 transition-colors" size={24} />
                            <input 
                                type="text" 
                                placeholder="QUERY PORTFOLIO..." 
                                className="pl-18 pr-8 h-18 bg-white border border-slate-100 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] focus:ring-8 focus:ring-rose-600/5 focus:border-rose-600 outline-none transition-all w-full sm:w-80 shadow-sm"
                            />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        {MOCK_PROJECTS.map((project, i) => (
                            <motion.div 
                                key={project.id}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card
                                    className="p-12 cursor-pointer group hover:shadow-[0_45px_100px_rgba(0,0,0,0.1)] hover:border-rose-500 overflow-hidden relative bg-white border border-slate-100 rounded-[4rem] transition-all duration-700"
                                    onClick={() => navigate(`/departments/${id}/projects/${project.id}`)}
                                >
                                    <div className="absolute top-0 right-0 p-10">
                                        <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-pulse-glow" />
                                    </div>

                                    <div className="mb-10">
                                        <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border shadow-xl ${i === 0 ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <h3 className="font-black text-slate-950 text-3xl mb-14 line-clamp-2 uppercase tracking-tighter group-hover:text-rose-600 transition-colors duration-500 leading-[0.95]">
                                        {project.name}
                                    </h3>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-10 border-t border-slate-50">
                                        <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            <Calendar size={20} className="text-rose-400 group-hover:scale-110 transition-transform" />
                                            Cycle: {project.endDate}
                                        </div>
                                        <div className="flex -space-x-4">
                                            {[1, 2, 3].map(u => (
                                                <div key={u} className="w-12 h-12 rounded-[1.25rem] border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                                                    VO
                                                </div>
                                            ))}
                                            <div className="w-12 h-12 rounded-[1.25rem] border-4 border-white bg-rose-600 text-foreground flex items-center justify-center text-[10px] font-black shadow-2xl z-20 group-hover:translate-x-4 transition-transform">
                                                +4
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Operations Section */}
                <div className="space-y-16 flex flex-col">
                    <motion.section variants={itemVariants} className="space-y-12 flex-1">
                        <div className="flex items-center justify-between group">
                            <div className="space-y-3">
                                <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tighter flex items-center gap-6 leading-none">
                                    <div className="p-4 bg-rose-600 text-foreground rounded-[1.5rem] shadow-xl shadow-rose-600/30 group-hover:rotate-12 transition-transform">
                                        <Clock size={32} />
                                    </div>
                                    System SLAs
                                </h2>
                                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] pl-20">Immediate operational priority</p>
                            </div>
                            <button className="w-16 h-16 flex items-center justify-center text-slate-300 hover:text-rose-600 bg-slate-50 rounded-[1.75rem] transition-all hover:bg-white hover:shadow-2xl border border-transparent hover:border-slate-100"><MoreVertical size={28} /></button>
                        </div>
                        
                        <div className="space-y-8 bg-slate-50/30 p-10 rounded-[4rem] border border-slate-100 backdrop-blur-md relative overflow-hidden group/list">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />
                            
                            <AnimatePresence>
                                {MOCK_TASKS.slice(0, 4).map((task, i) => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Card
                                            className="p-8 bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] flex items-center gap-8 hover:border-rose-500 hover:shadow-2xl hover:shadow-rose-600/10 transition-all duration-700 cursor-pointer group/item hover:-translate-x-4"
                                            onClick={() => navigate(`/departments/${id}/tasks`)}
                                        >
                                            <div className={`w-18 h-18 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shadow-2xl shadow-slate-200/50 ${i % 2 === 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-rose-50 text-rose-600 border border-rose-100'} group-hover/item:scale-110 group-hover/item:rotate-12 group-hover/item:bg-rose-600 group-hover/item:text-foreground`}>
                                                <AlertCircle size={32} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-black text-slate-950 truncate uppercase tracking-tighter group-hover/item:text-rose-600 transition-colors duration-500">
                                                    {task.title}
                                                </p>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <div className="px-3 py-1 bg-rose-500/10 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-200/20 animate-pulse">EXPIRES</div>
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{task.dueDate}</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={32} className="text-slate-200 group-hover/item:text-rose-600 group-hover/item:translate-x-3 transition-all" />
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.section>

                    {/* Operational Signal Section */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-slate-950 text-foreground p-14 space-y-12 overflow-hidden relative group border-none shadow-[0_45px_100px_rgba(0,0,0,0.3)] rounded-[4rem]">
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-rose-600/5 to-transparent pointer-events-none" />
                            <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none text-rose-400">
                                <TrendingUp size={300} />
                            </div>
                            
                            <div className="relative z-10 space-y-10">
                                <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-rose-600/20 text-rose-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-rose-400/20 backdrop-blur-xl">System Intelligence</div>
                                <div className="space-y-6">
                                    <h3 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none text-foreground drop-shadow-2xl">Neural Signal</h3>
                                    <p className="text-foreground/40 text-lg font-black uppercase tracking-widest leading-relaxed group-hover:text-foreground/70 transition-colors">Neural telemetry identifies a 12.4% operational surge across node workstreams.</p>
                                </div>
                                <button onClick={() => navigate(`/departments/${id}/reports`)} className="w-full h-20 bg-white text-slate-950 text-[11px] font-black rounded-[1.75rem] hover:bg-rose-50 shadow-2xl shadow-black/20 active:scale-95 transition-all uppercase tracking-[0.4em] flex items-center justify-center gap-6 group/btn relative z-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-rose-600/5 group-hover/btn:translate-x-full transition-transform duration-700" />
                                    Launch Analytics 
                                    <Sparkles size={24} className="text-rose-600 group-hover/btn:scale-125 group-hover/btn:rotate-12 transition-all" />
                                </button>
                            </div>
                            
                            <div className="absolute bottom-[-20%] left-[-20%] group-hover:left-[-15%] transition-all duration-1000">
                                <Activity size={300} className="text-foreground/5" />
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

const NavAction = ({ onClick, icon: Icon, label, color, bg }) => (
    <motion.button
        whileHover={{ y: -6, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex flex-col items-center justify-end p-8 h-40 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-white/20 transition-all group flex-1 min-w-[120px] relative overflow-hidden"
    >
        <div className="absolute top-4 right-4 text-foreground/10 group-hover:text-foreground/20 transition-colors">
            <ArrowUpRight size={24} />
        </div>
        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${bg} ${color} transition-transform group-hover:scale-115 shadow-2xl mb-6`}>
            <Icon size={28} />
        </div>
        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] group-hover:text-foreground transition-colors">{label}</span>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </motion.button>
);

