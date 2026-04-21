// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import {
    X,
    Calendar,
    User,
    Flag,
    Clock,
    CheckCircle2,
    MessageSquare,
    Paperclip,
    Activity,
    ChevronDown,
    ChevronRight,
    Plus,
    Trash2,
    Send,
    Clock3,
    AlertCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const PRIORITY_OPTIONS = [
    { value: 'LOW', label: 'Low', color: '#8b5cf6' },
    { value: 'MEDIUM', label: 'Medium', color: '#f59e0b' },
    { value: 'HIGH', label: 'High', color: '#f97316' },
    { value: 'CRITICAL', label: 'Critical', color: '#ef4444' }
];

const STATUS_OPTIONS = [
    { value: 'TODO', label: 'To Do', color: '#94a3b8' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: '#8b5cf6' },
    { value: 'IN_REVIEW', label: 'In Review', color: '#f59e0b' },
    { value: 'DONE', label: 'Done', color: '#8b5cf6' }
];

export const TaskDetailModal = ({
    isOpen,
    onClose,
    task,
    onSave,
    onDelete,
    users = []
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        startDate: '',
        endDate: '',
        assigneeId: '',
        estimatedHours: '',
        tags: [],
        subtasks: [],
        comments: [],
        attachments: [],
        activity: []
    });
    const [newTag, setNewTag] = useState('');
    const [newComment, setNewComment] = useState('');
    const [newSubtask, setNewSubtask] = useState('');
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'TODO',
                priority: task.priority || 'MEDIUM',
                startDate: task.startDate || '',
                endDate: task.endDate || '',
                assigneeId: task.assignee?.id || '',
                estimatedHours: task.estimatedHours || '',
                tags: task.tags || [],
                subtasks: task.subtasks || [],
                comments: task.comments || [],
                attachments: task.attachments || [],
                activity: task.activity || []
            });
        }
    }, [task]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTag = () => {
        if (newTag.trim()) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (index) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
    };

    const handleAddSubtask = () => {
        if (newSubtask.trim()) {
            setFormData(prev => ({
                ...prev,
                subtasks: [...prev.subtasks, { id: `temp-${Date.now()}`, title: newSubtask.trim(), done: false }]
            }));
            setNewSubtask('');
        }
    };

    const handleToggleSubtask = (index) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.map((st, i) => i === index ? { ...st, done: !st.done } : st)
        }));
    };

    const handleDeleteSubtask = (index) => {
        setFormData(prev => ({ ...prev, subtasks: prev.subtasks.filter((_, i) => i !== index) }));
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            const comment = {
                id: `comment-${Date.now()}`,
                content: newComment.trim(),
                author: { name: 'Current User', id: 'current' },
                createdAt: new Date().toISOString()
            };
            setFormData(prev => ({ ...prev, comments: [...prev.comments, comment] }));
            setNewComment('');
        }
    };

    const handleSave = () => {
        const updatedTask = {
            ...task,
            ...formData,
            assignee: users.find(u => u.id === formData.assigneeId)
        };
        onSave?.(updatedTask);
        onClose();
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            onDelete?.(task.id);
            onClose();
        }
    };

    const completedSubtasks = formData.subtasks.filter(st => st.done).length;
    const totalSubtasks = formData.subtasks.length;

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-backgroundlack/50 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden">
                    <div className="flex flex-col h-full max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    Task Details
                                </div>
                                {task?.id && (
                                    <span className="text-xs text-muted-foreground font-mono">
                                        #{task.id}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <Dialog.Close asChild>
                                    <button className="p-2 text-muted-foreground hover:bg-slate-100 rounded-xl transition-colors">
                                        <X size={18} />
                                    </button>
                                </Dialog.Close>
                            </div>
                        </div>

                        <div className="flex border-b border-slate-100">
                            {['details', 'subtasks', 'time', 'comments'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 text-sm font-semibold capitalize transition-colors ${
                                        activeTab === tab
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {tab}
                                    {tab === 'subtasks' && totalSubtasks > 0 && (
                                        <span className="ml-2 px-2 py-0.5 text-xs bg-slate-100 rounded-full">
                                            {completedSubtasks}/{totalSubtasks}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            className="w-full px-4 py-3 text-lg font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="Task title..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                                            placeholder="Add a description..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => handleChange('status', e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                                Priority
                                            </label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => handleChange('priority', e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            >
                                                {PRIORITY_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => handleChange('startDate', e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => handleChange('endDate', e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                                Assignee
                                            </label>
                                            <select
                                                value={formData.assigneeId}
                                                onChange={(e) => handleChange('assigneeId', e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            >
                                                <option value="">Unassigned</option>
                                                {users.map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                                Estimated Hours
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.estimatedHours}
                                                onChange={(e) => handleChange('estimatedHours', e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                            Tags
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {formData.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm"
                                                >
                                                    {tag}
                                                    <button
                                                        onClick={() => handleRemoveTag(idx)}
                                                        className="text-muted-foreground hover:text-rose-500"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                                placeholder="Add tag..."
                                            />
                                            <button
                                                onClick={handleAddTag}
                                                className="px-4 py-2 bg-indigo-600 text-foreground rounded-xl text-sm font-semibold hover:bg-indigo-700"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'subtasks' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 transition-all duration-300"
                                                    style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-500">
                                            {completedSubtasks} of {totalSubtasks} completed
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {formData.subtasks.map((subtask, idx) => (
                                            <div
                                                key={subtask.id}
                                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                                            >
                                                <button
                                                    onClick={() => handleToggleSubtask(idx)}
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                        subtask.done
                                                            ? 'bg-violet-500 border-violet-500'
                                                            : 'border-slate-300 hover:border-indigo-400'
                                                    }`}
                                                >
                                                    {subtask.done && <CheckCircle2 size={12} className="text-foreground" />}
                                                </button>
                                                <span className={`flex-1 text-sm ${subtask.done ? 'text-muted-foreground line-through' : 'text-slate-700'}`}>
                                                    {subtask.title}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteSubtask(idx)}
                                                    className="text-muted-foreground hover:text-rose-500"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <input
                                            type="text"
                                            value={newSubtask}
                                            onChange={(e) => setNewSubtask(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="Add a subtask..."
                                        />
                                        <button
                                            onClick={handleAddSubtask}
                                            className="px-6 py-3 bg-indigo-600 text-foreground rounded-xl font-semibold hover:bg-indigo-700"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'time' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                <Clock3 size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Estimated</span>
                                            </div>
                                            <div className="text-2xl font-bold text-slate-800">
                                                {formData.estimatedHours || 0}h
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                <Clock size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Logged</span>
                                            </div>
                                            <div className="text-2xl font-bold text-slate-800">
                                                {task?.loggedHours || 0}h
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-700 mb-4">Time Entries</h4>
                                        {formData.timeEntries?.length > 0 ? (
                                            <div className="space-y-2">
                                                {formData.timeEntries.map((entry, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-700">{entry.description}</div>
                                                            <div className="text-xs text-muted-foreground">{entry.date}</div>
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-700">{entry.hours}h</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground text-sm">
                                                No time entries yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'comments' && (
                                <div className="space-y-4">
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                        {formData.comments.length > 0 ? (
                                            formData.comments.map(comment => (
                                                <div key={comment.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                                                        {comment.author?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-semibold text-slate-700">{comment.author?.name || 'User'}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {comment.createdAt ? format(parseISO(comment.createdAt), 'MMM d, h:mm a') : ''}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-600">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground text-sm">
                                                No comments yet
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="Write a comment..."
                                        />
                                        <button
                                            onClick={handleAddComment}
                                            className="px-4 py-3 bg-indigo-600 text-foreground rounded-xl hover:bg-indigo-700"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50">
                            <div className="text-sm text-muted-foreground">
                                Created {task?.createdAt ? format(parseISO(task.createdAt), 'MMM d, yyyy') : 'recently'}
                            </div>
                            <div className="flex gap-3">
                                <Dialog.Close asChild>
                                    <button className="px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                                        Cancel
                                    </button>
                                </Dialog.Close>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-3 bg-indigo-600 text-foreground text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default TaskDetailModal;