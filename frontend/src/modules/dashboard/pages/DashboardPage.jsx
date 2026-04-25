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
            className="space-y-10 p-6 sm:p-10 lg:p-12 min-h-screen w-full mx-auto pb-24 bg-background text-foreground"
        >
            {/* Top Navigation / Status Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                            <GraduationCap size={20} className="text-primary" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">Teacher Development Hub</h2>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-xs font-bold mt-2">
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span>{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-card p-1.5 rounded-2xl border border-border shadow-sm">
                    <button className="p-3 hover:bg-muted rounded-xl transition-all relative group">
                        <Bell size={20} className="text-muted-foreground group-hover:text-primary" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
                    </button>
                    <div className="w-[1px] h-6 bg-border" />
                    <div className="flex items-center gap-3 pl-2 pr-4 py-2 hover:bg-muted rounded-xl transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                            {(user?.fullName || user?.name || 'U').charAt(0)}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-black text-foreground">{user?.fullName || user?.name || 'User'}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user?.role || 'Educator'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section - The Wow Factor */}
            <header className="relative group overflow-hidden rounded-[3rem] bg-white border border-border shadow-2xl">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/5 rounded-full blur-[100px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.01] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col xl:flex-row items-center gap-16 p-12 sm:p-20">
                    <div className="space-y-8 flex-1">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-success/10 rounded-full border border-success/20 text-[10px] font-black uppercase tracking-widest text-success">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                            </span>
                            Learning Journey: Active
                        </motion.div>
                        
                        <div className="space-y-4">
                            <motion.h1 variants={itemVariants} className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
                                Teaching <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">Excellence.</span>
                            </motion.h1>
                            <motion.p variants={itemVariants} className="text-muted-foreground font-bold text-lg max-w-xl leading-relaxed">
                                Welcome back, <span className="text-primary">{(user?.fullName || user?.name || 'User').split(' ')[0]}</span>. Your professional growth is at <span className="text-success underline decoration-2 underline-offset-4">Top 10% in Campus</span>. Ready for your next session?
                            </motion.p>
                        </div>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 pt-4">
                            <button className="h-16 px-10 bg-primary text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(225,29,72,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                                Start Development <ArrowRight size={18} />
                            </button>
                            <button className="h-16 px-10 bg-white border border-border text-foreground font-bold rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-muted transition-all flex items-center justify-center gap-3">
                                Resource Library
                            </button>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="w-full xl:w-[450px] aspect-square relative hidden lg:block">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-rose-400 rounded-[3rem] opacity-10 blur-3xl" />
                        <div className="relative h-full w-full bg-white/80 backdrop-blur-3xl rounded-[3rem] border border-border p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
                             <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-foreground">Growth Sync</h3>
                                    <Sparkles size={24} className="text-primary fill-primary/10" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                        <span>Pedagogy Skills</span>
                                        <span className="text-success">85%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 2, delay: 1 }} className="h-full bg-success shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                        <span>Student Engagement</span>
                                        <span className="text-primary">62%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ duration: 2, delay: 1.2 }} className="h-full bg-primary shadow-[0_0_10px_rgba(225,29,72,0.3)]" />
                                    </div>
                                </div>
                             </div>
                             
                             <div className="bg-muted/50 p-6 rounded-3xl border border-border mt-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <ShieldCheck size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-foreground">Certification Status</p>
                                        <p className="text-[10px] font-bold text-success uppercase tracking-widest">Verified 2026</p>
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
                    title="PD Portfolio" 
                    subtitle="Growth Tracker"
                    icon={LayoutDashboard}
                    color="from-rose-500 to-red-600"
                    count="12"
                    label="Points"
                    delay={0.1}
                />
                <ModuleCard 
                    title="Observation" 
                    subtitle="Feedback Hub"
                    icon={Users}
                    color="from-rose-400 to-red-500"
                    count="4"
                    label="Upcoming"
                    delay={0.2}
                />
                <ModuleCard 
                    title="Lesson Bank" 
                    subtitle="Resource Sharing"
                    icon={Layers}
                    color="from-orange-500 to-rose-600"
                    count="128"
                    label="Shared"
                    delay={0.3}
                />
                <ModuleCard 
                    title="Peer Network" 
                    subtitle="Collaboration"
                    icon={Briefcase}
                    color="from-red-500 to-rose-700"
                    count="15"
                    label="Active"
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Main Content Area - System Analytics */}
                <div className="xl:col-span-2 space-y-10">
                    <motion.div variants={itemVariants}>
                        <Card className="bg-card border border-border p-10 rounded-[2.5rem] relative overflow-hidden h-full shadow-xl">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <TrendingUp size={24} className="text-primary" />
                                        </div>
                                        Professional Growth Matrix
                                    </h2>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-2 ml-16">Teacher Development Feed / 2026</p>
                                </div>
                                <div className="flex bg-muted p-1.5 rounded-2xl border border-border shadow-sm">
                                    <button className="px-5 py-2 bg-primary text-white text-[10px] font-black rounded-xl transition-all shadow-lg shadow-primary/20 uppercase tracking-widest">Growth</button>
                                    <button className="px-5 py-2 text-muted-foreground text-[10px] font-black hover:text-primary transition-all uppercase tracking-widest">Archive</button>
                                </div>
                            </div>

                            <div className="h-[400px] bg-muted/30 rounded-[2rem] border border-border flex flex-col items-center justify-center relative overflow-hidden group/chart cursor-crosshair shadow-inner">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(225,29,72,0.03)_0%,_transparent_70%)]" />
                                
                                {/* Simulated Graph Visualization */}
                                <div className="w-full h-full p-12 flex items-end gap-3 justify-between relative z-10">
                                    {[40, 65, 45, 90, 55, 75, 85, 40, 95, 60, 80, 70].map((h, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                                            className={`w-full rounded-t-xl relative group/bar transition-all duration-500 ${i === 8 ? 'bg-primary shadow-[0_0_20px_rgba(225,29,72,0.3)]' : 'bg-muted-foreground/10 hover:bg-primary/40'}`}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">
                                                {h}%
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground tracking-widest border-t border-border pt-6">
                                    <span>TERM 1</span>
                                    <span>TERM 2</span>
                                    <span>TERM 3</span>
                                    <span>TERM 4</span>
                                </div>
                            </div>

                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-10 pt-10 border-t border-border">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Capability</p>
                                    </div>
                                    <p className="text-4xl font-black text-foreground tracking-tighter">94.2%</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Participation</p>
                                    </div>
                                    <p className="text-4xl font-black text-foreground tracking-tighter">ACTIVE</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-success" />
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Compliance</p>
                                    </div>
                                    <p className="text-4xl font-black text-success tracking-tighter">VERIFIED</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-10">
                    {/* Activity Feed */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl">
                             <div className="flex items-center justify-between mb-10">
                                <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Community Pulse</h2>
                                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Feed</button>
                             </div>
                             <div className="space-y-8">
                                <ActivityItem 
                                    user="Harshitha K." 
                                    action="completed Grade 5 Math LAC" 
                                    time="2m ago" 
                                    icon={CheckCircle}
                                    iconColor="text-emerald-500"
                                />
                                <ActivityItem 
                                    user="System Protocol" 
                                    action="updated campus PDI benchmarks" 
                                    time="15m ago" 
                                    icon={ShieldCheck}
                                    iconColor="text-indigo-500"
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
                                    iconColor="text-orange-500"
                                />
                             </div>
                             <button className="w-full mt-10 py-5 bg-muted border border-border text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/5 transition-all text-primary">
                                 Access Social Terminal
                              </button>
                        </Card>
                    </motion.div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <QuickAction icon={Calendar} label="Schedule" color="bg-rose-500" />
                        <QuickAction icon={Briefcase} label="Planning" color="bg-primary" />
                        <QuickAction icon={Users} label="Peer Support" color="bg-success" />
                        <QuickAction icon={Zap} label="Quick Links" color="bg-warning" />
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
        <Card className="bg-card border border-border p-8 rounded-[2.5rem] relative overflow-hidden hover:border-primary/30 transition-all duration-500 cursor-pointer shadow-xl h-full">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.08] blur-2xl transition-opacity duration-700`} />
            
            <div className="space-y-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={28} />
                </div>
                
                <div>
                    <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{subtitle}</p>
                </div>
                
                <div className="flex items-baseline gap-3 pt-2">
                    <span className="text-4xl font-black text-foreground">{count}</span>
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">{label}</span>
                </div>
            </div>
        </Card>
    </motion.div>
);

const ActivityItem = ({ user, action, time, icon: Icon, iconColor }) => (
    <div className="flex gap-4 items-start group/item cursor-pointer">
        <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0 group-hover/item:border-primary/30 transition-all">
            <Icon size={20} className={`${iconColor} transition-all group-hover/item:scale-110`} />
        </div>
        <div className="flex-1 min-w-0 pt-1">
            <p className="text-xs text-foreground font-black flex items-center gap-2">
                {user}
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{time}</span>
            </p>
            <p className="text-[11px] text-muted-foreground font-bold truncate tracking-tight mt-1 group-hover/item:text-foreground transition-colors">
                {action}
            </p>
        </div>
        <ArrowUpRight size={14} className="text-muted-foreground mt-2 group-hover/item:text-primary group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 transition-all" />
    </div>
);

const QuickAction = ({ icon: Icon, label, color }) => (
    <button className="group relative w-full aspect-square rounded-[2rem] bg-card border border-border p-6 flex flex-col items-center justify-center gap-4 hover:border-primary/30 transition-all shadow-lg overflow-hidden">
        <div className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />
        <div className={`w-14 h-14 rounded-2xl ${color}/10 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-500`}>
            <Icon size={28} className="group-hover:text-primary text-muted-foreground transition-colors" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">{label}</span>
    </button>
);
