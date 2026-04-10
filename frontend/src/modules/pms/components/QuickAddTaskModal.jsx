import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    Calendar, 
    ClipboardList, 
    Clock, 
    Info,
    Zap,
    Activity,
    Globe,
    Cpu,
    Sparkles,
    Target,
    Shield,
    Workflow,
    Layers,
    ArrowUpRight
} from 'lucide-react';

const QuickAddTaskModal = ({ isOpen, onClose, onAdd, projects }) => {
    const [formData, setFormData] = useState(() => ({
        name: '',
        projectId: projects[0]?.id || '',
        start: new Date().toISOString().split('T')[0],
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending'
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            id: Math.random(), // Mock ID
            type: 'task'
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-3xl"
                    />
                    
                    <motion.div
                        initial={{ scale: 0.9, y: 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 40, opacity: 0 }}
                        className="bg-white rounded-[4rem] shadow-[0_60px_150px_rgba(0,0,0,0.4)] w-full max-w-2xl overflow-hidden border border-white/20 relative z-10"
                    >
                        {/* Header Strategy */}
                        <div className="bg-slate-950 p-12 flex items-center justify-between relative overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-rose-600/10" />
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-indigo-400">
                                        <Zap size={32} />
                                    </div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Fast Ingestion</h2>
                                </div>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.5em]">Deploying rapid operational units // Node Alpha</p>
                            </div>
                            <button onClick={onClose} className="w-16 h-16 flex items-center justify-center bg-white/5 hover:bg-white text-white/40 hover:text-slate-950 rounded-3xl transition-all active:scale-90 relative z-10">
                                <X size={32} className="stroke-[3]" />
                            </button>
                        </div>

                        {/* Formation Protocol */}
                        <form onSubmit={handleSubmit} className="p-12 sm:p-16 space-y-12 bg-white">
                            <div className="space-y-6">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-4">Designation Identifier</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        required
                                        autoFocus
                                        placeholder="UNIT_NAME_PROTOCOL..."
                                        className="w-full h-20 px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black uppercase tracking-widest text-slate-950 placeholder:text-slate-300 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-4">Parent Cluster</label>
                                <select
                                    className="w-full h-20 px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black uppercase tracking-widest text-slate-950 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all appearance-none cursor-pointer"
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: parseInt(e.target.value) })}
                                >
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-4">Initial Cycle</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full h-20 px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black uppercase tracking-widest text-slate-950 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all"
                                        value={formData.start}
                                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-6">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] px-4">Termination Cycle</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full h-20 px-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black uppercase tracking-widest text-slate-950 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none transition-all"
                                        value={formData.end}
                                        onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-12 flex flex-col sm:flex-row gap-8">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="h-22 bg-slate-50 border border-slate-100 text-slate-400 font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95 text-[11px] flex-1"
                                >
                                    Terminate Protocol
                                </button>
                                <button
                                    type="submit"
                                    className="h-22 bg-slate-950 text-white font-black uppercase tracking-[0.4em] rounded-[2rem] hover:bg-indigo-600 shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 text-[11px] flex-[2] flex items-center justify-center gap-6 group/btn"
                                >
                                    Deploy to Matrix
                                    <ArrowUpRight size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickAddTaskModal;
