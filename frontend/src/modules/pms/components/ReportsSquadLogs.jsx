import React, { useState } from 'react';
import { Card } from '../../../components/ui/CardLegacy';
import { User, Clock, Search, Plus, X, Activity, Sparkles, Shield, Zap, Layers, Calendar, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LogWorkModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        project: 'Website Redesign',
        task: '',
        duration: '1h 0m',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            id: Date.now(),
            name: 'Vector Operator', 
            avatar: `https://ui-avatars.com/api/?name=VO&background=6366f1&color=fff`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl flex items-center justify-center z-[200] p-4 sm:p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="bg-white/90 border border-white/20 rounded-[4rem] shadow-[0_60px_150px_rgba(0,0,0,0.2)] w-full max-w-2xl overflow-hidden backdrop-blur-2xl"
                    >
                        <div className="bg-background p-10 sm:p-14 text-foreground relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent pointer-events-none" />
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />
                            
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-500/20 rounded-2xl border border-white/10">
                                            <Zap size={28} className="text-indigo-400" />
                                        </div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Time Log <br /><span className="text-indigo-400">Protocol</span></h2>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">Synchronize operational units with central node</p>
                                </div>
                                <button onClick={onClose} className="w-16 h-16 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-3xl transition-all active:scale-90 border border-white/10 group">
                                    <X size={32} className="group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 sm:p-14 space-y-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <FormGroup label="Cluster Target">
                                    <select
                                        className="w-full h-18 px-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                                        value={formData.project}
                                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                    >
                                        <option>Website Redesign</option>
                                        <option>Q1 Annual Review</option>
                                        <option>Staff Training</option>
                                    </select>
                                </FormGroup>

                                <FormGroup label="Operational Task">
                                    <input
                                        type="text"
                                        required
                                        placeholder="INPUT TASK VECTOR..."
                                        className="w-full h-18 px-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black text-slate-950 uppercase tracking-widest placeholder:text-slate-300 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none"
                                        value={formData.task}
                                        onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                                    />
                                </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <FormGroup label="Duration Delta">
                                    <div className="relative">
                                        <Clock className="absolute right-8 top-1/2 -translate-y-1/2 text-indigo-400/40" size={20} />
                                        <input
                                            type="text"
                                            placeholder="e.g. 2h 45m"
                                            className="w-full h-18 px-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black text-slate-950 uppercase tracking-widest placeholder:text-slate-300 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        />
                                    </div>
                                </FormGroup>
                                <FormGroup label="Deployment Mode">
                                    <select className="w-full h-18 px-8 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black text-slate-950 uppercase tracking-widest focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none appearance-none cursor-pointer">
                                        <option>Development</option>
                                        <option>Design</option>
                                        <option>Meeting</option>
                                        <option>Heuristic Research</option>
                                    </select>
                                </FormGroup>
                            </div>

                            <FormGroup label="Heuristic Context (Optional)">
                                <textarea
                                    placeholder="APPEND CONTEXTUAL DATA..."
                                    className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none resize-none h-40"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </FormGroup>

                            <div className="flex flex-col sm:flex-row gap-6 pt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 h-20 bg-slate-50 border border-slate-100 text-muted-foreground rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-slate-100 hover:text-slate-950 transition-all active:scale-95"
                                >
                                    Abort Cycle
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 h-20 bg-indigo-600 text-foreground rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-4"
                                >
                                    Commit Log Unit
                                    <Sparkles size={20} className="animate-pulse" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const FormGroup = ({ label, children }) => (
    <div className="space-y-4">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] px-2">{label}</label>
        {children}
    </div>
);

const ReportsSquadLogs = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [logs, setLogs] = useState([
        { id: 1, name: 'Alice Smith', avatar: 'https://ui-avatars.com/api/?name=Alice+Smith&background=6366f1&color=fff', project: 'Website Redesign', task: 'Homepage Architecture', duration: '4h 30m', date: 'FEB 09, 2026', notes: 'Finalized core structural layout and navigation tree.' },
        { id: 2, name: 'Bob Johnson', avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=f43f5e&color=fff', project: 'Q1 Annual Review', task: 'Metrics Compilation', duration: '2h 15m', date: 'FEB 09, 2026', notes: 'Assembled Q4 performance clusters for global review.' },
        { id: 3, name: 'Charlie Brown', avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown&background=10b981&color=fff', project: 'Staff Training', task: 'Infrastructure Config', duration: '6h 00m', date: 'FEB 08, 2026', notes: 'Configured mobile development cluster for seminar.' },
        { id: 4, name: 'Diana Prince', avatar: 'https://ui-avatars.com/api/?name=Diana+Prince&background=8b5cf6&color=fff', project: 'Website Redesign', task: 'Auth Matrix Fix', duration: '3h 45m', date: 'FEB 08, 2026', notes: 'Patched identity verification latency in login router.' },
    ]);

    const handleAddLog = (newLog) => {
        setLogs([newLog, ...logs]);
    };

    return (
        <Card className="p-0 bg-white border border-slate-100 rounded-[4rem] shadow-[0_45px_100px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="p-10 sm:p-14 lg:p-20 bg-slate-50/50 border-b border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[600px] h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center text-foreground shadow-2xl shadow-slate-900/40 relative">
                                <Activity size={36} className="text-indigo-400" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-violet-500 rounded-full border-4 border-slate-50 shadow-sm animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl sm:text-5xl font-black text-slate-950 uppercase tracking-tighter leading-none">Squad Audit <br />Infrastructure</h2>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Autonomous performance monitoring across global deployment</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group w-full sm:w-auto">
                            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" size={24} />
                            <input
                                type="text"
                                placeholder="QUERY AUDIT LOGS..."
                                className="w-full sm:w-[400px] h-20 pl-18 pr-8 bg-white border border-slate-200 rounded-3xl text-sm font-black uppercase tracking-widest placeholder:text-slate-300 focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 h-20 bg-indigo-600 text-foreground rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40 hover:bg-slate-950 transition-all active:scale-95"
                        >
                            <Plus size={24} />
                            Register Unit
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                    <thead>
                        <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] border-b border-slate-100 bg-slate-50/30">
                            <th className="px-12 py-10">Operational Identity</th>
                            <th className="px-12 py-10">Cluster Target</th>
                            <th className="px-12 py-10 text-center">Time Delta</th>
                            <th className="px-12 py-10 text-center">Cycle Date</th>
                            <th className="px-12 py-10">Heuristic Context</th>
                            <th className="px-12 py-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        <AnimatePresence mode="popLayout">
                            {logs.map((log, index) => (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.05 }}
                                    className="group hover:bg-slate-50/50 transition-all duration-700 cursor-default"
                                >
                                    <td className="px-12 py-10">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-indigo-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <img src={log.avatar} alt={log.name} className="w-16 h-16 rounded-[1.25rem] border-4 border-white shadow-2xl relative z-10 group-hover:scale-115 transition-transform duration-700" />
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-500 rounded-full border-4 border-slate-50 shadow-sm z-20" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-base font-black text-slate-950 uppercase tracking-tighter leading-none">{log.name}</span>
                                                <span className="text-[9px] font-black text-muted-foreground mt-2 uppercase tracking-widest">Active Operator</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="flex flex-col gap-2">
                                            <span className="inline-flex text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-1 rounded-full border border-indigo-100 w-max group-hover:bg-indigo-600 group-hover:text-foreground transition-all">{log.project}</span>
                                            <span className="text-sm font-bold text-slate-500 tracking-tight">{log.task}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10 text-center">
                                        <span className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black bg-slate-950 text-foreground shadow-xl shadow-slate-950/10 group-hover:bg-indigo-600 transition-all tabular-nums">
                                            <Clock size={16} className="text-indigo-400 group-hover:text-foreground" />
                                            {log.duration}
                                        </span>
                                    </td>
                                    <td className="px-12 py-10 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <Calendar size={18} className="text-slate-300" />
                                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest mt-1">{log.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <p className="text-sm text-muted-foreground font-bold max-w-sm line-clamp-2 italic leading-relaxed group-hover:text-slate-950 transition-colors" title={log.notes}>
                                            "{log.notes || 'No contextual output available for this unit.'}"
                                        </p>
                                    </td>
                                    <td className="px-12 py-10 text-right">
                                        <button className="p-4 bg-slate-50 text-slate-300 rounded-[1.25rem] hover:bg-slate-950 hover:text-foreground transition-all group/btn border border-slate-100 hover:border-slate-950 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0">
                                            <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            <div className="p-12 sm:p-14 lg:p-20 bg-slate-50/50 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="flex -space-x-4">
                        {logs.slice(0, 3).map((l, i) => (
                            <img key={i} src={l.avatar} className="w-12 h-12 rounded-2xl border-4 border-slate-50 shadow-xl" alt="" />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Infrastructure Scan: <span className="text-slate-950 bg-white px-4 py-2 rounded-xl shadow-inner border border-slate-100 ml-2">{logs.length} Units Deployed</span></span>
                </div>
                
                <div className="flex gap-4">
                    <button className="h-16 px-8 rounded-2xl border border-slate-200 text-[10px] font-black uppercase text-muted-foreground hover:bg-white hover:text-slate-950 transition-all disabled:opacity-30 active:scale-95 shadow-sm" disabled>Back</button>
                    <button className="h-16 px-10 rounded-2xl bg-slate-950 text-foreground text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-950/20 active:scale-95 flex items-center gap-3">
                        Next Cycle
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <LogWorkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddLog}
            />
        </Card>
    );
};

export default ReportsSquadLogs;
