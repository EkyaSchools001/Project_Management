import React, { useState } from 'react';
import { X, ClipboardList, Info, AlertCircle, Calendar, User, Flag, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateTaskModal = ({ isOpen, onClose, onAdd, projects }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        projectId: projects[0]?.id || '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
        assignee: 'Alice Smith' // Mocked default
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...formData,
            id: Date.now(),
        });
        onClose();
        // Reset form
        setFormData({
            title: '',
            description: '',
            projectId: projects[0]?.id || '',
            status: 'TODO',
            priority: 'MEDIUM',
            dueDate: '',
            assignee: 'Alice Smith'
        });
    };

    return (
        <div className="fixed inset-0 bg-backgroundackgroundlack/40 backdrop-blur-[2px] flex items-center justify-center z-[110] p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[#111c2a] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-neutral-800 p-6 text-foreground flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#111c2a]/20 rounded-xl">
                            <CheckSquare size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Create New Task</h2>
                            <p className="text-foreground/70 text-sm">Define a new unit of work</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#111c2a]/20 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-4">
                        <input
                            type="text"
                            required
                            placeholder="Task Title (e.g., Finalize Curriculum)"
                            className="w-full text-xl font-bold border-none focus:ring-0 placeholder:text-gray-300 p-0"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Describe the requirements or technical details..."
                            className="w-full text-sm text-gray-300 border-none focus:ring-0 placeholder:text-gray-400 p-0 resize-none h-24"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Info size={12} /> Project
                            </label>
                            <select
                                className="w-full p-3 bg-[#0f172a] border border-neutral-800 rounded-xl text-sm focus:bg-[#111c2a] focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                                value={formData.projectId}
                                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            >
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Flag size={12} /> Priority
                            </label>
                            <select
                                className="w-full p-3 bg-[#0f172a] border border-neutral-800 rounded-xl text-sm focus:bg-[#111c2a] focus:ring-2 focus:ring-brand-600/20 transition-all outline-none font-bold"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="LOW">LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HIGH">HIGH</option>
                                <option value="CRITICAL">CRITICAL</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={12} /> Due Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full p-3 bg-[#0f172a] border border-neutral-800 rounded-xl text-sm focus:bg-[#111c2a] focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={12} /> Assignee
                            </label>
                            <select
                                className="w-full p-3 bg-[#0f172a] border border-neutral-800 rounded-xl text-sm focus:bg-[#111c2a] focus:ring-2 focus:ring-brand-600/20 transition-all outline-none"
                                value={formData.assignee}
                                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                            >
                                <option>Alice Smith</option>
                                <option>Bob Johnson</option>
                                <option>Charlie Brown</option>
                                <option>Diana Prince</option>
                            </select>
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
                            className="flex-[2] px-6 py-3 bg-neutral-800 text-foreground rounded-2xl font-bold shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30 transition-all"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateTaskModal;
