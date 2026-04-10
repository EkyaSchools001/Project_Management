import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/CardLegacy';
import { useAuth } from '../../auth/authContext';
import { analyticsService } from '../../../services/analytics.service';
import AIInsights from '../../ai/components/AIInsights';
import GamificationWidget from '../../gamification/components/GamificationWidget';
import {
    Activity,
    Users,
    Briefcase,
    CheckCircle,
    TrendingUp,
    Zap,
    ArrowUpRight
} from 'lucide-react';
import { RECENT_ACTIVITY } from '../../../data/activity';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        projects: 0,
        tasks: 0,
        users: 0,
        systemHealth: '100%',
        loading: true
    });

    useEffect(() => {
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
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
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
            className="space-y-10 p-4 sm:p-8 lg:p-10 min-h-screen w-full mx-auto pb-20 animate-fade-in"
        >
            {/* Nifty-inspired Light Header Section */}
            <header className="flex flex-col xl:flex-row justify-between items-center gap-12 relative overflow-hidden p-12 sm:p-20 bg-card rounded-[1.5rem] text-foreground border border-border shadow-sm group w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                
                <div className="space-y-6 relative z-10 flex-1">
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
                        <Activity size={14} className="animate-pulse" />
                        System Status: Optimal
                    </motion.div>
                    <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl lg:text-8xl font-black text-foreground tracking-tight leading-tight">
                        Project <span className="text-primary">Control</span> <br />Center
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-muted-foreground font-semibold text-sm sm:text-lg max-w-2xl leading-relaxed">
                        Manage your ecosystem with precision. Track performance, allocate resources, and <span className="text-foreground">maintain system integrity</span> across all nodes.
                    </motion.p>
                </div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto relative z-10">
                    <button className="h-16 px-10 bg-secondary border border-border text-foreground font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-accent transition-all">
                        Analytics Hub
                    </button>
                    <button className="h-16 px-10 bg-primary text-white font-extrabold rounded-xl text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all">
                        Execute New Task
                    </button>
                </motion.div>
            </header>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Compact Stats Grid - Nifty Style */}
                <div className="xl:w-[320px] shrink-0 space-y-4">
                    <StatCard 
                        title="Active Hubs" 
                        value={stats.projects} 
                        icon={Briefcase} 
                        iconColor="text-blue-500"
                        loading={stats.loading} 
                    />
                    <StatCard 
                        title="Processing Tasks" 
                        value={stats.tasks} 
                        icon={CheckCircle} 
                        iconColor="text-green-500"
                        loading={stats.loading} 
                    />
                    <StatCard 
                        title="Identity Groups" 
                        value={stats.users} 
                        icon={Users} 
                        iconColor="text-purple-500"
                        loading={stats.loading} 
                    />
                    <StatCard 
                        title="Core Integrity" 
                        value={stats.systemHealth} 
                        icon={Activity} 
                        iconColor="text-amber-500"
                        loading={stats.loading} 
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 space-y-8">
                    {/* Performance Matrix */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-card border border-border p-10 rounded-[1.5rem] relative overflow-hidden h-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <TrendingUp size={20} className="text-primary" />
                                        </div>
                                        Performance Matrix
                                    </h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 ml-14">System Analytics Output</p>
                                </div>
                                <div className="flex bg-muted p-1 rounded-xl">
                                    <button className="px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg transition-all">REAL-TIME</button>
                                    <button className="px-4 py-1.5 text-muted-foreground text-[10px] font-bold hover:text-foreground transition-all">HST_LOGS</button>
                                </div>
                            </div>

                            <div className="h-[450px] bg-secondary/50 rounded-[1rem] border border-border flex items-center justify-center relative overflow-hidden group/chart">
                                <div className="absolute inset-0 bg-primary opacity-[0.02] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-white" />
                                <Activity size={64} className="text-primary/10 mx-auto group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute bottom-8 left-8 right-8 flex justify-between">
                                    <div className="h-2 w-1/3 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full w-[80%] bg-primary" />
                                    </div>
                                    <span className="text-[10px] font-bold text-primary italic">OPERATIONAL</span>
                                </div>
                            </div>

                            <div className="mt-10 grid grid-cols-3 gap-8 pt-10 border-t border-border">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency</p>
                                    <p className="text-4xl font-black text-primary">94.2%</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Load Index</p>
                                    <p className="text-4xl font-black text-foreground">NOMINAL</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Integrity</p>
                                    <p className="text-4xl font-black text-green-600">SECURE</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Secondary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Feed */}
                        <Card className="bg-card border border-border p-10 rounded-[1.5rem]">
                             <h2 className="text-xl font-bold text-foreground tracking-tight mb-8">System Feed</h2>
                             <div className="space-y-6">
                                {RECENT_ACTIVITY.slice(0, 4).map(act => (
                                    <div key={act.id} className="flex gap-4 items-center group/item cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border group-hover:border-primary/30 transition-all">
                                            <Activity size={16} className="text-primary/40 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-foreground font-bold truncate">{act.user}</p>
                                            <p className="text-[10px] text-muted-foreground font-semibold truncate tracking-tight">{act.action}</p>
                                        </div>
                                        <ArrowUpRight size={14} className="text-muted-foreground/30 group-hover:text-primary transition-all" />
                                    </div>
                                ))}
                             </div>
                             <button className="w-full mt-8 py-4 border border-border text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-muted transition-all">Access Terminal</button>
                        </Card>

                        {/* Guardian - Custom Nifty Surface */}
                        <Card className="bg-primary text-white p-10 rounded-[1.5rem] shadow-xl relative overflow-hidden group">
                           <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-2xl font-black uppercase tracking-tight">Guardian <br />Protocol</h3>
                                <p className="text-white/80 text-xs font-bold leading-relaxed max-w-[200px]">System-wide threat assessment meeting 99.9% availability index.</p>
                                <button className="px-8 h-12 bg-white text-primary font-bold rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Verify Node</button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>


            {/* AI Insights Widget */}
            <motion.div variants={itemVariants}>
                <AIInsights />
            </motion.div>

            {/* Gamification Widget */}
            <motion.div variants={itemVariants}>
                <GamificationWidget />
            </motion.div>
        </motion.div>
    );
}

const StatCard = ({ title, value, icon: Icon, iconColor, loading }) => (
    <motion.div variants={{hidden: {opacity: 0, x: -20}, visible: {opacity: 1, x: 0}}}>
        <Card className="flex flex-row items-center gap-6 p-6 bg-card border border-border rounded-[1rem] hover:border-primary/30 transition-all duration-300 cursor-default group relative overflow-hidden h-full">
            <div className={`w-12 h-12 flex items-center justify-center bg-muted text-foreground rounded-full shadow-sm border border-border transition-all duration-500 group-hover:bg-primary/10 shrink-0`}>
                <div className={`${iconColor} group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                </div>
            </div>
            
            <div className="space-y-1 flex-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">{title}</p>
                <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-black text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
                        {loading ? '---' : value}
                    </p>
                </div>
            </div>
        </Card>
    </motion.div>
);
