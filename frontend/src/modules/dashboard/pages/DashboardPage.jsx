import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Briefcase, 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  ArrowUpRight,
  Search,
  Bell,
  Calendar,
  Layers,
  GraduationCap,
  ShieldCheck,
  LayoutDashboard,
  Clock,
  Sparkles,
  Command,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../auth/authContext';
import { analyticsService } from '../../../services/analytics.service';
import { Card } from '../../../components/ui/CardLegacy';
import AIInsights from '../../ai/components/AIInsights';
import GamificationWidget from '../../gamification/components/GamificationWidget';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        projects: 0,
        tasks: 0,
        users: 0,
        systemHealth: '100%',
        loading: true
    });
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        const fetchStats = async () => {
            try {
                const data = await analyticsService.getSystemSummary();
                setStats(prev => ({ ...prev, ...data, loading: false }));
            } catch (error) {
                console.error('Failed to load dashboard stats', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };
        fetchStats();
        return () => clearInterval(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1, 
            transition: { type: 'spring', stiffness: 100, damping: 15 } 
        }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10 p-6 sm:p-10 lg:p-12 min-h-screen w-full mx-auto pb-24 bg-[#0a0c10] text-slate-100"
        >
            {/* Top Navigation / Status Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Command size={20} className="text-primary animate-pulse" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">SchoolOS / Command Center</h2>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-xs font-bold mt-2">
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span>{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-xl">
                    <button className="p-3 hover:bg-slate-800 rounded-xl transition-all relative group">
                        <Bell size={20} className="text-slate-400 group-hover:text-primary" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0a0c10]" />
                    </button>
                    <div className="w-[1px] h-6 bg-slate-800" />
                    <div className="flex items-center gap-3 pl-2 pr-4 py-2 hover:bg-slate-800 rounded-xl transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            {(user?.fullName || user?.name || 'U').charAt(0)}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-black text-slate-200">{user?.fullName || user?.name || 'User'}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user?.role || 'Guest'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section - The Wow Factor */}
            <header className="relative group overflow-hidden rounded-[3rem] bg-[#0f1115] border border-slate-800/50 shadow-2xl">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-indigo-500/5 pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col xl:flex-row items-center gap-16 p-12 sm:p-20">
                    <div className="space-y-8 flex-1">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Campus Identity: Live
                        </motion.div>
                        
                        <div className="space-y-4">
                            <motion.h1 variants={itemVariants} className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                                Master <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500">Excellence.</span>
                            </motion.h1>
                            <motion.p variants={itemVariants} className="text-slate-400 font-bold text-lg max-w-xl leading-relaxed">
                                Welcome back, <span className="text-white">{(user?.fullName || user?.name || 'User').split(' ')[0]}</span>. Your institution is performing at <span className="text-emerald-400 underline decoration-2 underline-offset-4">98.4% efficiency</span>. Ready for the next directive?
                            </motion.p>
                        </div>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 pt-4">
                            <button className="h-16 px-10 bg-white text-[#0a0c10] font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                                Initialize LAC <ArrowRight size={18} />
                            </button>
                            <button className="h-16 px-10 bg-slate-900 border border-slate-700 text-white font-bold rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                                Analytics Hub
                            </button>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="w-full xl:w-[450px] aspect-square relative hidden lg:block">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-600 rounded-[3rem] opacity-20 blur-3xl" />
                        <div className="relative h-full w-full bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
                             <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-white">LAC Sync</h3>
                                    <Zap size={24} className="text-primary fill-primary/20" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                        <span>English Literacy</span>
                                        <span className="text-emerald-400">85%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 2, delay: 1 }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                        <span>Numeracy Skills</span>
                                        <span className="text-primary">62%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ duration: 2, delay: 1.2 }} className="h-full bg-primary shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                                    </div>
                                </div>
                             </div>
                             
                             <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 mt-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                        <Activity size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white">System Integrity</p>
                                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Optimized 100%</p>
                                    </div>
                                </div>
                             </div>
                             
                             {/* Floating Decorative Elements */}
                             <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md" />
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md" />
                             </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Core Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ModuleCard 
                    title="Learning Hub" 
                    subtitle="Course Management"
                    icon={GraduationCap}
                    color="from-blue-500 to-indigo-600"
                    count="24"
                    label="Active"
                    delay={0.1}
                />
                <ModuleCard 
                    title="PDI System" 
                    subtitle="Growth & Dev"
                    icon={ShieldCheck}
                    color="from-primary to-rose-600"
                    count="12"
                    label="Ongoing"
                    delay={0.2}
                />
                <ModuleCard 
                    title="Faculty Net" 
                    subtitle="Resource Allocation"
                    icon={Users}
                    color="from-amber-500 to-orange-600"
                    count="156"
                    label="Connected"
                    delay={0.3}
                />
                <ModuleCard 
                    title="Insight Engine" 
                    subtitle="Predictive Analysis"
                    icon={Sparkles}
                    color="from-emerald-500 to-teal-600"
                    count="99%"
                    label="Accuracy"
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Main Content Area - System Analytics */}
                <div className="xl:col-span-2 space-y-10">
                    <motion.div variants={itemVariants}>
                        <Card className="bg-[#0f1115] border border-slate-800 p-10 rounded-[2.5rem] relative overflow-hidden h-full shadow-xl">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                            <TrendingUp size={24} className="text-indigo-400" />
                                        </div>
                                        Performance Matrix
                                    </h2>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 ml-16">Institutional Data Feed / 2026</p>
                                </div>
                                <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                                    <button className="px-5 py-2 bg-primary text-white text-[10px] font-black rounded-xl transition-all shadow-lg shadow-primary/20 uppercase tracking-widest">Real-Time</button>
                                    <button className="px-5 py-2 text-slate-500 text-[10px] font-black hover:text-white transition-all uppercase tracking-widest">Logs</button>
                                </div>
                            </div>

                            <div className="h-[400px] bg-[#0a0c10] rounded-[2rem] border border-slate-800/50 flex flex-col items-center justify-center relative overflow-hidden group/chart cursor-crosshair">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.05)_0%,_transparent_70%)]" />
                                
                                {/* Simulated Graph Visualization */}
                                <div className="w-full h-full p-12 flex items-end gap-3 justify-between relative z-10">
                                    {[40, 65, 45, 90, 55, 75, 85, 40, 95, 60, 80, 70].map((h, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                                            className={`w-full rounded-t-xl relative group/bar transition-all duration-300 ${i === 8 ? 'bg-primary shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-slate-800 hover:bg-indigo-500/50'}`}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded-lg">
                                                {h}%
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-[10px] font-black uppercase text-slate-600 tracking-widest border-t border-slate-800 pt-6">
                                    <span>JAN</span>
                                    <span>MAR</span>
                                    <span>MAY</span>
                                    <span>JUL</span>
                                    <span>SEP</span>
                                    <span>NOV</span>
                                </div>
                            </div>

                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-10 pt-10 border-t border-slate-800">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</p>
                                    </div>
                                    <p className="text-4xl font-black text-white">94.2%</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Load Index</p>
                                    </div>
                                    <p className="text-4xl font-black text-white">NOMINAL</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Integrity</p>
                                    </div>
                                    <p className="text-4xl font-black text-emerald-500">SECURE</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-10">
                    {/* Activity Feed */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-[#0f1115] border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
                             <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-white tracking-tight uppercase tracking-widest text-xs">Campus Pulse</h2>
                                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
                             </div>
                             <div className="space-y-8">
                                <ActivityItem 
                                    user="Harshitha K." 
                                    action="completed Grade 5 Math LAC" 
                                    time="2m ago" 
                                    icon={CheckCircle}
                                    iconColor="text-emerald-400"
                                />
                                <ActivityItem 
                                    user="System Protocol" 
                                    action="updated campus PDI benchmarks" 
                                    time="15m ago" 
                                    icon={ShieldCheck}
                                    iconColor="text-indigo-400"
                                />
                                <ActivityItem 
                                    user="Vikram S." 
                                    action="initiated teacher observation" 
                                    time="1h ago" 
                                    icon={Activity}
                                    iconColor="text-primary"
                                />
                                <ActivityItem 
                                    user="Library Bot" 
                                    action="indexed 45 new resources" 
                                    time="3h ago" 
                                    icon={Layers}
                                    iconColor="text-amber-400"
                                />
                             </div>
                             <button className="w-full mt-10 py-5 bg-slate-900 border border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all text-slate-300">
                                Access Full Terminal
                             </button>
                        </Card>
                    </motion.div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <QuickAction icon={Calendar} label="Schedule" color="bg-indigo-500" />
                        <QuickAction icon={Briefcase} label="Planning" color="bg-primary" />
                        <QuickAction icon={Users} label="Faculty" color="bg-emerald-500" />
                        <QuickAction icon={Zap} label="Fast-Track" color="bg-amber-500" />
                    </div>
                </div>
            </div>

            {/* AI & Gamification Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
                <motion.div variants={itemVariants}>
                    <AIInsights />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <GamificationWidget />
                </motion.div>
            </div>
        </motion.div>
    );
}

const ModuleCard = ({ title, subtitle, icon: Icon, color, count, label, delay }) => (
    <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, type: 'spring', stiffness: 100 }}
        className="group"
    >
        <Card className="bg-[#0f1115] border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden hover:border-slate-700 transition-all duration-500 cursor-pointer shadow-xl h-full">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.08] blur-2xl transition-opacity duration-700`} />
            
            <div className="space-y-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={28} />
                </div>
                
                <div>
                    <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{subtitle}</p>
                </div>
                
                <div className="flex items-baseline gap-3 pt-2">
                    <span className="text-4xl font-black text-white">{count}</span>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{label}</span>
                </div>
            </div>
        </Card>
    </motion.div>
);

const ActivityItem = ({ user, action, time, icon: Icon, iconColor }) => (
    <div className="flex gap-4 items-start group/item cursor-pointer">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover/item:border-slate-700 transition-all">
            <Icon size={20} className={`${iconColor} transition-all group-hover/item:scale-110`} />
        </div>
        <div className="flex-1 min-w-0 pt-1">
            <p className="text-xs text-slate-200 font-black flex items-center gap-2">
                {user}
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{time}</span>
            </p>
            <p className="text-[11px] text-slate-500 font-bold truncate tracking-tight mt-1 group-hover/item:text-slate-300 transition-colors">
                {action}
            </p>
        </div>
        <ArrowUpRight size={14} className="text-slate-700 mt-2 group-hover/item:text-primary group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 transition-all" />
    </div>
);

const QuickAction = ({ icon: Icon, label, color }) => (
    <button className="group relative w-full aspect-square rounded-[2rem] bg-[#0f1115] border border-slate-800 p-6 flex flex-col items-center justify-center gap-4 hover:border-slate-700 transition-all shadow-lg overflow-hidden">
        <div className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
        <div className={`w-14 h-14 rounded-2xl ${color}/10 flex items-center justify-center text-white group-hover:scale-110 transition-all duration-500`}>
            <Icon size={28} className="group-hover:text-white text-slate-400 transition-colors" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">{label}</span>
    </button>
);
