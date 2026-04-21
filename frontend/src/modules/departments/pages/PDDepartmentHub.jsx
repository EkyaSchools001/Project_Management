import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../modules/auth/authContext';
import { ArrowLeft, Sparkles, GraduationCap, Users, Target, Zap, ArrowUpRight } from 'lucide-react';

// PDI Providers
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@pdi/components/ui/tooltip";
import { PermissionProvider } from "@pdi/contexts/PermissionContext";
import { AIProvider } from "@pdi/contexts/AIContext";
import ErrorBoundary from "@pdi/components/ErrorBoundary";

// PDI Integration Components
import TeacherDashboard from '@pdi/pages/TeacherDashboard';
import LeaderDashboard from '@pdi/pages/LeaderDashboard';

const queryClient = new QueryClient();

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const PDHubLanding = ({ role, navigate }) => (
    <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1800px] mx-auto space-y-16 p-6 sm:p-10 lg:p-16 pb-40"
    >
        {/* Header */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 relative overflow-hidden p-12 sm:p-16 lg:p-24 bg-zinc-900 rounded-[5rem] text-white shadow-2xl group border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-[#BAFF00]/10 via-indigo-600/10 to-transparent pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-[#BAFF00] rounded-full blur-[250px] opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />

            <div className="space-y-10 relative z-10 flex-1">
                <motion.button
                    variants={itemVariants}
                    onClick={() => navigate('/departments/pd')}
                    className="group flex items-center text-[10px] font-black text-white/40 hover:text-[#BAFF00] transition-all uppercase tracking-[0.4em]"
                >
                    <ArrowLeft className="w-5 h-5 mr-4 group-hover:-translate-x-3 transition-transform" />
                    Infrastructure Matrix Registry
                </motion.button>

                <div className="space-y-6">
                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
                        <h1 className="text-5xl sm:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase leading-[0.85] drop-shadow-2xl">
                            Teacher <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BAFF00] via-emerald-400 to-indigo-400">
                                Development
                            </span>
                        </h1>
                        <div className="px-8 py-3 bg-[#BAFF00]/10 backdrop-blur-xl border border-[#BAFF00]/20 text-[#BAFF00] rounded-full text-[10px] font-black uppercase tracking-[0.4em]">
                            PD_HUB_ACTIVE
                        </div>
                    </motion.div>
                    <motion.p variants={itemVariants} className="text-white/40 font-black text-xs sm:text-xl uppercase tracking-[0.3em] flex items-center gap-6">
                        <GraduationCap size={32} className="text-[#BAFF00]" />
                        Lead Orchestrator: <span className="text-white font-black">Sharada</span>
                    </motion.p>
                </div>
            </div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-6 w-full xl:w-auto relative z-10 pb-4">
                <HubAction
                    onClick={() => navigate('/departments/pd/teacher')}
                    icon={GraduationCap}
                    label="Teacher View"
                    color="text-[#BAFF00]"
                    bg="bg-[#BAFF00]/10"
                    border="border-[#BAFF00]/20"
                />
                <HubAction
                    onClick={() => navigate('/departments/pd/leader')}
                    icon={Users}
                    label="Leader View"
                    color="text-indigo-400"
                    bg="bg-indigo-600/10"
                    border="border-indigo-400/20"
                />
                <HubAction
                    onClick={() => navigate('/departments/pd/admin')}
                    icon={Target}
                    label="Admin View"
                    color="text-rose-400"
                    bg="bg-rose-600/10"
                    border="border-rose-400/20"
                />
            </motion.div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
                { label: 'Active Teachers', value: '120+', icon: GraduationCap, color: 'from-[#BAFF00]/20 to-emerald-600/10', text: 'text-[#BAFF00]' },
                { label: 'PD Goals Tracked', value: '340', icon: Target, color: 'from-indigo-500/20 to-violet-600/10', text: 'text-indigo-400' },
                { label: 'Completion Rate', value: '87%', icon: Zap, color: 'from-amber-400/20 to-orange-600/10', text: 'text-amber-400' },
            ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants}>
                    <div className="p-12 flex flex-col gap-10 group cursor-pointer hover:shadow-[0_45px_100px_rgba(0,0,0,0.4)] hover:border-[#BAFF00]/30 transition-all duration-700 bg-zinc-900 border border-white/5 rounded-[4rem] relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-30 group-hover:opacity-60 transition-opacity duration-700`} />
                        <div className="flex items-center justify-between relative z-10">
                            <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center bg-white/5 shadow-inner group-hover:scale-110 transition-all duration-700 ${stat.text}`}>
                                <stat.icon size={36} />
                            </div>
                            <ArrowUpRight size={28} className="text-white/10 group-hover:text-white/40 transition-colors" />
                        </div>
                        <div className="relative z-10 space-y-2">
                            <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] group-hover:text-white/60 transition-colors">{stat.label}</p>
                            <p className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none">{stat.value}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Enter Hub CTA */}
        <motion.div variants={itemVariants}>
            <div className="relative overflow-hidden bg-zinc-900 border border-white/5 rounded-[4rem] p-16 sm:p-24 flex flex-col sm:flex-row items-center justify-between gap-12 group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#BAFF00]/5 via-indigo-600/5 to-transparent pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#BAFF00] rounded-full blur-[200px] opacity-5 pointer-events-none" />
                <div className="space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-[#BAFF00]/10 text-[#BAFF00] rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-[#BAFF00]/20">
                        <div className="w-2 h-2 rounded-full bg-[#BAFF00] animate-pulse" />
                        PD System Online
                    </div>
                    <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                        Enter Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BAFF00] to-emerald-400">Dashboard</span>
                    </h2>
                    <p className="text-white/40 font-black text-xs uppercase tracking-[0.3em]">Access observations, goals, training events & more</p>
                </div>
                <button
                    onClick={() => navigate(role === 'TEACHER' ? '/departments/pd/teacher' : '/departments/pd/leader')}
                    className="relative z-10 h-24 px-16 bg-[#BAFF00] text-slate-950 font-black rounded-[2.5rem] text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#BAFF00]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-6 shrink-0 group/btn"
                >
                    <Sparkles size={24} className="group-hover/btn:rotate-12 transition-transform" />
                    Launch PD Hub
                    <ArrowUpRight size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    </motion.div>
);

const HubAction = ({ onClick, icon: Icon, label, color, bg, border }) => (
    <motion.button
        whileHover={{ y: -6, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex flex-col items-center justify-end p-8 h-40 ${bg} backdrop-blur-xl border ${border || 'border-white/10'} rounded-[2.5rem] hover:bg-white/10 transition-all group flex-1 min-w-[120px] relative overflow-hidden`}
    >
        <div className="absolute top-4 right-4 text-white/10 group-hover:text-white/30 transition-colors">
            <ArrowUpRight size={24} />
        </div>
        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${bg} ${color} transition-transform group-hover:scale-110 shadow-2xl mb-6`}>
            <Icon size={28} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${color} opacity-70 group-hover:opacity-100 transition-opacity`}>{label}</span>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </motion.button>
);

const PDDepartmentHub = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return <Navigate to="/login" replace />;

    const role = user.role?.toUpperCase() || 'TEACHER';

    const Providers = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <AIProvider>
                    <PermissionProvider>
                        <ErrorBoundary>{children}</ErrorBoundary>
                    </PermissionProvider>
                </AIProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );

    return (
        <div className="min-h-screen bg-[#18181b] text-white">
            <Routes>
                {/* Landing hub page */}
                <Route index element={<PDHubLanding role={role} navigate={navigate} />} />

                {/* Full PDI dashboards */}
                <Route path="teacher/*" element={
                    <Providers><TeacherDashboard /></Providers>
                } />
                <Route path="leader/*" element={
                    <Providers><LeaderDashboard /></Providers>
                } />
                <Route path="admin/*" element={
                    <Providers><LeaderDashboard /></Providers>
                } />
                <Route path="management/*" element={
                    <Providers><LeaderDashboard /></Providers>
                } />

                {/* Default role-based redirect */}
                <Route path="*" element={
                    <Providers>
                        {role === 'ADMIN' || role === 'SUPERADMIN' ? <LeaderDashboard /> :
                         role === 'LEADER' || role === 'SCHOOL_LEADER' ? <LeaderDashboard /> :
                         role === 'MANAGEMENT' ? <LeaderDashboard /> :
                         <TeacherDashboard />}
                    </Providers>
                } />
            </Routes>
        </div>
    );
};

export default PDDepartmentHub;
