import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MoreHorizontal,
    Edit2,
    Trash2,
    Clock,
    Calendar,
    User,
    Flag,
    CheckCircle2,
    MessageSquare,
    Paperclip,
    ChevronRight
} from 'lucide-react';

const PRIORITY_CONFIG = {
    'LOW': { color: '#ef4444', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', label: 'Low' },
    'MEDIUM': { color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', label: 'Medium' },
    'HIGH': { color: '#f97316', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', label: 'High' },
    'CRITICAL': { color: '#ef4444', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', label: 'Critical' }
};

const STATUS_CONFIG = {
    'TODO': { label: 'To Do', color: '#94a3b8', icon: 'circle' },
    'IN_PROGRESS': { label: 'In Progress', color: '#ef4444', icon: 'clock' },
    'IN_REVIEW': { label: 'In Review', color: '#f59e0b', icon: 'alert' },
    'DONE': { label: 'Done', color: '#ef4444', icon: 'check' }
};

export const TaskCard = ({
    task,
    onClick,
    onEdit,
    onDelete,
    isDragging = false,
    isSelected = false,
    onToggleSelection,
    showActions = true,
    compact = false
}) => {
    const [showQuickActions, setShowQuickActions] = useState(false);
    const priorityConfig = PRIORITY_CONFIG[task.priority?.toUpperCase()] || PRIORITY_CONFIG['MEDIUM'];
    const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG['TODO'];
    const progress = task.progress || 0;
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    const handleAction = (action, e) => {
        e.stopPropagation();
        if (action === 'edit') onEdit?.(task);
        else if (action === 'delete') onDelete?.(task);
    };

    if (compact) {
        return (
            <div
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors ${
                    isSelected ? 'bg-rose-50' : ''
                }`}
                onClick={onClick}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleSelection?.(); }}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'bg-rose-600 border-rose-600' : 'border-slate-300'
                    }`}
                >
                    {isSelected && <CheckCircle2 size={10} className="text-foreground" />}
                </button>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityConfig.color }} />
                <span className="text-sm text-slate-700 truncate flex-1">{task.title}</span>
                {task.assignee && (
                    <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[8px] font-bold">
                        {task.assignee.name.charAt(0)}
                    </div>
                )}
            </div>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`group relative bg-white rounded-xl border ${
                isDragging 
                    ? 'shadow-2xl ring-2 ring-rose-500 scale-105' 
                    : 'border-slate-200 hover:border-rose-300 shadow-sm hover:shadow-md'
            } ${isSelected ? 'ring-2 ring-rose-500' : ''} p-4 cursor-pointer transition-all duration-200 ${
                task.status === 'DONE' ? 'opacity-75' : ''
            }`}
            onClick={onClick}
            onMouseEnter={() => setShowQuickActions(true)}
            onMouseLeave={() => setShowQuickActions(false)}
        >
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleSelection?.(); }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                            isSelected 
                                ? 'bg-rose-600 border-rose-600' 
                                : 'border-slate-300 hover:border-rose-400'
                        }`}
                    >
                        {isSelected && <CheckCircle2 size={12} className="text-foreground" />}
                    </button>
                    <span className={`text-sm font-semibold truncate ${
                        task.status === 'DONE' ? 'text-muted-foreground line-through' : 'text-slate-800'
                    }`}>
                        {task.title}
                    </span>
                </div>

                {showActions && (
                    <div className={`relative ${showQuickActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded hover:bg-slate-100 transition-colors"
                        >
                            <MoreHorizontal size={16} className="text-muted-foreground" />
                        </button>
                        <AnimatePresence>
                            {showQuickActions && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[120px]"
                                >
                                    <button
                                        onClick={(e) => handleAction('edit', e)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                                    >
                                        <Edit2 size={14} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => handleAction('delete', e)}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {task.description && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                    {task.description}
                </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-3">
                <span 
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityConfig.bg} ${priorityConfig.border} border`}
                >
                    {priorityConfig.label}
                </span>
                <span 
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-1"
                >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConfig.color }} />
                    {statusConfig.label}
                </span>
                {task.tags?.map((tag, idx) => (
                    <span 
                        key={idx} 
                        className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {progress > 0 && progress < 100 && (
                <div className="mb-3">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{progress}% complete</span>
                </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    {task.dueDate && (
                        <div className={`flex items-center gap-1 text-[10px] ${
                            isOverdue ? 'text-rose-500 font-medium' : 'text-muted-foreground'
                        }`}>
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    )}
                    {task.estimatedHours && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock size={12} />
                            {task.estimatedHours}h
                        </div>
                    )}
                    {task.comments?.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <MessageSquare size={12} />
                            {task.comments.length}
                        </div>
                    )}
                    {task.attachments?.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Paperclip size={12} />
                            {task.attachments.length}
                        </div>
                    )}
                </div>

                {task.assignee ? (
                    <div 
                        className="flex items-center gap-2 group/assignee"
                        title={task.assignee.name}
                    >
                        {task.assignee.avatar ? (
                            <img 
                                src={task.assignee.avatar} 
                                alt={task.assignee.name}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">
                                {task.assignee.name.charAt(0)}
                            </div>
                        )}
                        <span className="text-[10px] text-slate-500 opacity-0 group-hover/assignee:opacity-100 transition-opacity">
                            {task.assignee.name}
                        </span>
                    </div>
                ) : (
                    <button className="text-[10px] text-muted-foreground hover:text-rose-600 flex items-center gap-1">
                        <User size={12} />
                        Assign
                    </button>
                )}
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            Subtasks
                        </span>
                        <span>
                            {task.subtasks.filter(st => st.done).length}/{task.subtasks.length}
                        </span>
                    </div>
                    <div className="space-y-1">
                        {task.subtasks.slice(0, 3).map((subtask, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                                <div className={`w-3 h-3 rounded border ${subtask.done ? 'bg-red-500 border-red-500' : 'border-slate-300'}`}>
                                    {subtask.done && <CheckCircle2 size={8} className="text-foreground" />}
                                </div>
                                <span className={subtask.done ? 'text-muted-foreground line-through' : 'text-slate-600'}>
                                    {subtask.title}
                                </span>
                            </div>
                        ))}
                        {task.subtasks.length > 3 && (
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <ChevronRight size={10} />
                                +{task.subtasks.length - 3} more
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TaskCard;