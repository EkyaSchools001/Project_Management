import React, { useState } from 'react';
import { X, Layout, Info, Calendar, User, IndianRupee, Briefcase, Building2, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEPARTMENTS } from '../../../data/organization';
import { aiService } from '../../../services/ai.service';

const CreateProjectModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'IN_PROGRESS',
        startDate: '',
        endDate: '',
        budget: '',
        manager: 'Indu', // Mocked default
        departmentId: DEPARTMENTS[0]?.id || ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiTasks, setAiTasks] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const department = DEPARTMENTS.find(d => d.id === formData.departmentId);
        onAdd({
            ...formData,
            id: Date.now().toString(),
            budget: parseInt(formData.budget) || 0,
            manager: { name: formData.manager, role: 'Lead' },
            departmentName: department ? department.name : '',
            suggestedTasks: aiTasks
        });
        onClose();
        // Reset form
        setFormData({
            name: '',
            description: '',
            status: 'IN_PROGRESS',
            startDate: '',
            endDate: '',
            budget: '',
            manager: 'Indu',
            departmentId: DEPARTMENTS[0]?.id || ''
        });
        setAiTasks(null);
    };

    const handleGenerateAI = async () => {
        if (!formData.name) return;
        setIsGenerating(true);
        try {
            const plan = await aiService.generatePlan(formData.name, formData.description);
            setAiTasks(plan.suggestedTasks);
            
            if (plan.suggestedTasks?.[0]) {
                const lastTask = plan.suggestedTasks[plan.suggestedTasks.length - 1];
                setFormData(prev => ({
                    ...prev,
                    startDate: plan.suggestedTasks[0].startDate,
                    endDate: lastTask.endDate
                }));
            }
        } catch (error) {
            console.error('AI generation failed', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[110] p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[#111c2a] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-neutral-800 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#111c2a]/20 rounded-xl">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Launch New Project</h2>
                            <p className="text-white/70 text-sm">Initiate a strategic work stream</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#111c2a]/20 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[75vh]">
                    <div className="space-y-4">
                        <input
                            type="text"
                            required
                            placeholder="Project Name"
                            className="w-full text-2xl font-bold border-none focus:ring-0 placeholder:text-gray-300 p-0"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <textarea
                            placeholder="Describe project goals, outcomes, and context..."
                            className="w-full text-sm text-gray-300 border-none focus:ring-0 placeholder:text-gray-400 p-0 resize-none h-24"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        
                        <div className="flex justify-between items-center bg-[#0f172a] p-4 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <Sparkles size={18} className="text-amber-400 shrink-0" />
                                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Generate milestones with AI?</span>
                            </div>
                            <button
                                type="button"
                                disabled={!formData.name || isGenerating}
                                onClick={handleGenerateAI}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                                    isGenerating 
                                    ? 'bg-amber-500/20 text-amber-500 opacity-50' 
                                    : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-slate-950'
                                }`}
                            >
                                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                {aiTasks ? 'Regenerate' : 'Augment'}
                            </button>
                        </div>
                        
                        {aiTasks && (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-2">AI Blueprint Generated</p>
                                <p className="text-xs text-emerald-300/60 leading-relaxed italic">
                                    "{aiTasks.length} task milestones have been optimized for this roadmap based on industry benchmarks."
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Building2 size={12} /> Assign Department
                            </label>
                            <select
                                className="w-full p-3 bg-[#0f172a] border border-neutral-800 rounded-xl text-sm focus:bg-[#111c2a] focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                required
                            >
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={12} /> Project Lead
                            </label>
                            <select
                                className="w-full p-3 bg-[#0f172a] border border-neutral-800 rounded-xl text-sm focus:bg-[#111c2a] focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                                value={formData.manager}
                                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                            >
                                <option>Indu</option>
                                <option>Avni</option>
                                <option>Rahul</option>
                                <option>Ketan</option>
                                <option>Poornima</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={12} /> Start Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full p-3 bg-[#0f172a] border border-neutral-800 rounded-xl text-sm focus:bg-[#111c2a] focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={12} className="text-brand-600" /> Project Due Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full p-3 bg-[#0f172a] border border-neutral-800 rounded-xl text-sm focus:bg-[#111c2a] focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <IndianRupee size={12} /> Budget Allocation (₹)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 500000"
                                className="w-full p-3 bg-[#0f172a] border border-neutral-800 rounded-xl text-sm focus:bg-[#111c2a] focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Layout size={12} /> Initial Status
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['PLANNING', 'IN_PROGRESS'].map(status => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status })}
                                        className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all ${formData.status === status
                                                ? 'bg-neutral-800 text-white border-brand-600 shadow-md shadow-brand-500/20'
                                                : 'bg-[#0f172a] text-gray-400 border-neutral-800 hover:bg-[#1e293b]'
                                            }`}
                                    >
                                        {status.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-neutral-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-neutral-700 text-gray-300 rounded-2xl font-bold hover:bg-[#0f172a] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] px-6 py-3 bg-neutral-800 text-white rounded-2xl font-bold shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30 transition-all"
                        >
                            Initiate Project
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateProjectModal;
