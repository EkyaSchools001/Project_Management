import React, { useState } from 'react';
import { Card } from '../../../components/ui/CardLegacy';
import { Mail, Phone, MoreHorizontal, UserPlus, Filter, Search, X, Shield, Activity, Globe, Zap, Cpu, Sparkles, Target, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/authContext';
import { DEPARTMENTS, ROLES } from '../../../data/organization';

const TeamMembersPage = () => {
    const { user } = useAuth();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteData, setInviteData] = useState({
        name: '',
        email: '',
        role: '',
        departmentId: ''
    });

    // Mock initial data
    const [team, setTeam] = useState([
        { id: '1', name: 'John Doe', role: 'Project Lead', status: 'Active', avatar: 'JD', departmentId: 'tech', email: 'john.doe@school.edu', phone: '+1 (555) 123-4567', color: 'from-red-500 to-rose-600' },
        { id: '2', name: 'Jane Smith', role: 'Coordinator', status: 'In Meeting', avatar: 'JS', departmentId: 'ops', email: 'jane.smith@school.edu', phone: '+1 (555) 234-5678', color: 'from-red-500 to-red-600' },
        { id: '3', name: 'Robert Brown', role: 'Support Staff', status: 'Offline', avatar: 'RB', departmentId: 'hr', email: 'robert.b@school.edu', phone: '+1 (555) 345-6789', color: 'from-red-400 to-rose-600' },
        { id: '4', name: 'Emily Davis', role: 'Designer', status: 'Active', avatar: 'ED', departmentId: 'tech', email: 'emily.d@school.edu', phone: '+1 (555) 456-7890', color: 'from-rose-500 to-pink-600' }
    ]);

    const [activeInfoId, setActiveInfoId] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-red-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] animate-pulse-glow';
            case 'In Meeting': return 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse';
            default: return 'bg-slate-400 opacity-50';
        }
    };

    const isPrivileged = ['Super Admin', 'SuperAdmin', 'Management Admin', 'ManagementAdmin', 'Management'].includes(user?.role);

    const handleOpenInvite = () => {
        setInviteData({
            name: '',
            email: '',
            role: '',
            departmentId: isPrivileged ? '' : user?.departmentId || ''
        });
        setIsInviteModalOpen(true);
    };

    const handleInviteSubmit = (e) => {
        e.preventDefault();
        const newMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: inviteData.name,
            role: inviteData.role || 'Member',
            status: 'Active',
            avatar: inviteData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
            departmentId: inviteData.departmentId,
            email: inviteData.email,
            phone: '+1 (555) 000-0000',
            color: 'from-rose-500 to-red-600'
        };
        setTeam([...team, newMember]);
        setIsInviteModalOpen(false);
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
            className="max-w-[1800px] mx-auto space-y-16 p-6 sm:p-10 lg:p-16 pb-40"
        >
            {/* High-Vibrancy Header */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 relative overflow-hidden p-12 sm:p-16 lg:p-24 bg-background rounded-[5rem] text-foreground shadow-2xl group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/30 via-red-600/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-rose-500 rounded-full blur-[200px] opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                
                <div className="space-y-10 relative z-10 flex-1 w-full sm:w-auto">
                    <div className="inline-flex items-center gap-6 px-10 py-4 bg-white/5 rounded-full border border-white/10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] backdrop-blur-md">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse-glow shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
                        Team Synchronization Protocol: Operational
                    </div>
                    <h1 className="text-5xl sm:text-8xl lg:text-9xl font-black text-foreground tracking-tighter uppercase leading-[0.85]">
                        Team <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-400 to-amber-400 animate-gradient-shift">Intelligence</span>
                    </h1>
                    <p className="text-foreground/40 font-black text-xs sm:text-base uppercase tracking-widest flex items-center gap-6">
                        <Globe size={32} className="text-rose-400 animate-spin-slow" />
                        Collaborative Deployment Matrix // Unified Identity Synchronization
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-8 w-full xl:w-auto relative z-10 pb-4">
                    <div className="relative group flex-1 sm:flex-none">
                        <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-rose-400 transition-colors" size={24} />
                        <input
                            type="text"
                            placeholder="IDENTIFY NODE UNIT..."
                            className="w-full xl:w-80 h-20 pl-18 pr-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-xs font-black uppercase tracking-[0.2em] text-foreground placeholder:text-foreground/20 focus:ring-8 focus:ring-rose-600/5 focus:border-rose-400 transition-all outline-none backdrop-blur-xl"
                        />
                    </div>
                    <button
                        onClick={handleOpenInvite}
                        className="flex items-center justify-center gap-6 h-20 px-12 bg-white text-slate-950 rounded-[2.5rem] text-xs font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-rose-600/10 group/btn"
                    >
                        <UserPlus size={24} className="group-hover/btn:rotate-12 transition-transform" />
                        Invite Node
                    </button>
                </div>
            </header>

            {/* Team Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {team.map((member, i) => (
                    <motion.div
                        key={member.id}
                        variants={itemVariants}
                        whileHover={{ y: -12 }}
                    >
                        <Card className="p-12 relative overflow-hidden group hover:shadow-[0_45px_100px_rgba(0,0,0,0.1)] hover:border-rose-500 transition-all duration-700 bg-white border border-slate-100 rounded-[4rem] group/card h-full flex flex-col items-center text-center space-y-10">
                            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-[0.03] rotate-45 -mr-24 -mt-24 transition-opacity duration-1000`} />
                            
                            <div className="relative pt-4">
                                <div className={`w-32 h-32 rounded-[3.5rem] bg-gradient-to-tr from-slate-50 to-white border-4 border-white shadow-inner flex items-center justify-center text-4xl font-black text-slate-950 group-hover:scale-115 transition-all duration-700 relative z-10 group-hover:shadow-2xl group-hover:shadow-rose-500/10`}>
                                    {member.avatar}
                                </div>
                                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white z-20 ${getStatusColor(member.status)}`} />
                                <div className="absolute inset-0 bg-rose-600/20 blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-1000 scale-150" />
                            </div>

                            <div className="space-y-4 w-full flex-1">
                                <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tighter leading-[0.85] group-hover:text-rose-600 transition-colors animate-gradient-shift">
                                    {member.name}
                                </h3>
                                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-4">{member.role}</p>
                                <div className="pt-6 flex justify-center">
                                    <span className="text-[10px] font-black text-rose-600 bg-rose-50/50 px-6 py-2.5 rounded-full border border-rose-100 uppercase tracking-widest shadow-inner group-hover:bg-rose-600 group-hover:text-foreground transition-all duration-500">
                                        {DEPARTMENTS.find(d => d.id === member.departmentId)?.name || 'General Context'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-6 w-full pt-10 border-t border-slate-50 mt-auto">
                                <a
                                    href={`mailto:${member.email}`}
                                    className="flex-1 h-18 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl text-muted-foreground hover:bg-rose-600 hover:text-foreground hover:border-rose-500 hover:shadow-2xl transition-all active:scale-90"
                                    title="Communication Stream"
                                >
                                    <Mail size={22} />
                                </a>
                                <a
                                    href={`tel:${member.phone}`}
                                    className="flex-1 h-18 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl text-muted-foreground hover:bg-rose-600 hover:text-foreground hover:border-rose-500 hover:shadow-2xl transition-all active:scale-90"
                                    title="Audio Uplink"
                                >
                                    <Phone size={22} />
                                </a>
                                <button
                                    onClick={() => setActiveInfoId(activeInfoId === member.id ? null : member.id)}
                                    className={`w-18 h-18 flex items-center justify-center rounded-2xl border transition-all active:scale-90 ${activeInfoId === member.id ? 'bg-slate-950 text-foreground border-slate-950' : 'bg-slate-50 border-slate-100 text-muted-foreground hover:bg-slate-950 hover:text-foreground hover:border-slate-950'}`}
                                >
                                    <MoreHorizontal size={28} />
                                </button>
                            </div>

                            {/* Detached Popover Protocol */}
                            <AnimatePresence>
                                {activeInfoId === member.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-0 mb-10 w-96 bg-white rounded-[3rem] shadow-[0_50px_150px_rgba(0,0,0,0.2)] border border-slate-100 p-12 z-50 text-left overflow-hidden group/pop"
                                    >
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 text-rose-600">
                                            <Shield size={200} />
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-8 mb-8">
                                            <div className="space-y-2">
                                                <h4 className="font-black text-slate-950 text-xl uppercase tracking-tighter">Identity Protocol</h4>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated heuristical stream</p>
                                            </div>
                                            <button onClick={() => setActiveInfoId(null)} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-muted-foreground hover:text-rose-600 transition-all active:scale-90"><X size={24} /></button>
                                        </div>
                                        <div className="space-y-8 relative z-10">
                                            <div className="space-y-2">
                                                <p className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.4em]">Operational Vector</p>
                                                <p className="font-black text-slate-950 break-all text-base">{member.email}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.4em]">Audio Identifier</p>
                                                <p className="font-black text-slate-950 text-base">{member.phone}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.4em]">Deployment Cluster</p>
                                                <p className="font-black text-slate-950 text-base">{DEPARTMENTS.find(d => d.id === member.departmentId)?.name || 'General'}</p>
                                            </div>
                                            <div className="pt-4">
                                                <p className="text-[11px] uppercase font-black text-muted-foreground tracking-[0.4em] mb-4">Sync Reliability</p>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} className="h-full bg-red-500 rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Invite Modal Protocol */}
            <AnimatePresence>
                {isInviteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsInviteModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 40, opacity: 0 }}
                            className="bg-white rounded-[5rem] shadow-[0_60px_150px_rgba(0,0,0,0.4)] w-full max-w-2xl overflow-hidden border border-white/20 relative z-10"
                        >
                            <div className="flex items-center justify-between p-12 sm:p-16 bg-slate-950 text-foreground relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 via-rose-600/10 to-transparent pointer-events-none" />
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-rose-400">
                                            <UserPlus size={36} />
                                        </div>
                                        <h2 className="text-4xl font-black uppercase tracking-tighter">Invite Node</h2>
                                    </div>
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/40">Register new identity in collective deployment</p>
                                </div>
                                <button onClick={() => setIsInviteModalOpen(false)} className="w-20 h-20 flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl text-foreground/40 hover:text-foreground hover:bg-white/10 transition-all active:scale-90 relative z-10">
                                    <X size={40} />
                                </button>
                            </div>

                            <form onSubmit={handleInviteSubmit} className="p-12 sm:p-16 space-y-12">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] px-4">Operational Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={inviteData.name}
                                            onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                                            className="w-full h-20 px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black uppercase tracking-widest text-slate-950 placeholder:text-slate-300 focus:bg-white focus:ring-8 focus:ring-rose-600/5 focus:border-rose-600 outline-none transition-all"
                                            placeholder="IDENTITY_NAME..."
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] px-4">Identity Vector (Email)</label>
                                        <input
                                            type="email"
                                            required
                                            value={inviteData.email}
                                            onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                            className="w-full h-20 px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black uppercase tracking-widest text-slate-950 placeholder:text-slate-300 focus:bg-white focus:ring-8 focus:ring-rose-600/5 focus:border-rose-600 outline-none transition-all"
                                            placeholder="NODE@SYSTEM.HUB"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] px-4">Permission Layer</label>
                                        <select
                                            value={inviteData.role}
                                            onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                                            className="w-full h-20 px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black uppercase tracking-widest text-slate-950 focus:bg-white focus:ring-8 focus:ring-rose-600/5 focus:border-rose-600 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">SELECT ROLE</option>
                                            {(isPrivileged
                                                ? Object.values(ROLES)
                                                : Object.values(ROLES).filter(r => r !== ROLES.SUPER_ADMIN && r !== ROLES.MANAGEMENT_ADMIN)
                                            ).map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] px-4">Sector Cluster</label>
                                        <select
                                            value={inviteData.departmentId}
                                            onChange={(e) => setInviteData({ ...inviteData, departmentId: e.target.value })}
                                            disabled={!isPrivileged}
                                            className="w-full h-20 px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black uppercase tracking-widest text-slate-950 focus:bg-white focus:ring-8 focus:ring-rose-600/5 focus:border-rose-600 outline-none transition-all disabled:opacity-50 appearance-none cursor-pointer"
                                        >
                                            <option value="">SELECT SECTOR</option>
                                            {DEPARTMENTS.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-12 flex flex-col sm:flex-row gap-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsInviteModalOpen(false)}
                                        className="h-22 px-12 bg-slate-50 border border-slate-100 text-muted-foreground font-black uppercase tracking-[0.4em] rounded-[2rem] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95 text-[11px] flex-1"
                                    >
                                        Terminate Protocol
                                    </button>
                                    <button
                                        type="submit"
                                        className="h-22 px-16 bg-slate-950 text-foreground font-black uppercase tracking-[0.4em] rounded-[2rem] hover:bg-rose-600 shadow-2xl shadow-rose-600/20 transition-all active:scale-95 text-[11px] flex-[2] flex items-center justify-center gap-6 group/btn"
                                    >
                                        Execute Deployment
                                        <Zap size={22} className="group-hover/btn:scale-125 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Neural Footer Protocol */}
            <div className="py-20 flex flex-col items-center gap-10">
                <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
                        className="h-full bg-gradient-to-r from-rose-600 to-rose-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                    />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em] animate-pulse">Team Synchronicity Index: 0.9997 // Secured Layer</p>
            </div>
        </motion.div>
    );
};

export default TeamMembersPage;

