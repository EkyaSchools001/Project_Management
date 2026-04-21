// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable,
    useDroppable
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Plus,
    MoreHorizontal,
    Filter,
    ArrowUpDown,
    User,
    Calendar,
    Flag,
    Clock,
    CheckCircle2,
    Circle,
    AlertCircle,
    X,
    Edit2,
    Trash2,
    Archive,
    ChevronDown,
    ChevronRight,
    Users,
    LayoutGrid,
    BarChart2
} from 'lucide-react';

const STATUS_COLUMNS = [
    { id: 'TODO', title: 'To Do', color: 'slate', icon: Circle },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'indigo', icon: Clock },
    { id: 'IN_REVIEW', title: 'In Review', color: 'amber', icon: AlertCircle },
    { id: 'DONE', title: 'Done', color: 'emerald', icon: CheckCircle2 }
];

const PRIORITY_CONFIG = {
    'LOW': { color: '#8b5cf6', bg: 'bg-violet-50', border: 'border-violet-200', label: 'Low' },
    'MEDIUM': { color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Medium' },
    'HIGH': { color: '#f97316', bg: 'bg-orange-50', border: 'border-orange-200', label: 'High' },
    'CRITICAL': { color: '#ef4444', bg: 'bg-rose-50', border: 'border-rose-200', label: 'Critical' }
};

const WIP_LIMITS = {
    'TODO': null,
    'IN_PROGRESS': 5,
    'IN_REVIEW': 3,
    'DONE': null
};

export const KanbanBoard = ({
    tasks = [],
    onTaskClick,
    onTaskUpdate,
    onTaskMove,
    swimlaneBy = null,
    showWipLimits = true,
    onAddTask,
    onArchive,
    allowAdd = true
}) => {
    const [activeId, setActiveId] = useState(null);
    const [collapsedColumns, setCollapsedColumns] = useState(new Set());
    const [columnWipExceeded, setColumnWipExceeded] = useState({});
    const [filterPriority, setFilterPriority] = useState(null);
    const [sortBy, setSortBy] = useState('priority');
    const [selectedTasks, setSelectedTasks] = useState(new Set());
    const [quickAddColumn, setQuickAddColumn] = useState(null);
    const [quickAddTitle, setQuickAddTitle] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const tasksByStatus = useMemo(() => {
        const grouped = {};
        STATUS_COLUMNS.forEach(col => { grouped[col.id] = []; });
        
        tasks.forEach(task => {
            const status = task.status || 'TODO';
            if (!grouped[status]) grouped[status] = [];
            
            let passesFilter = true;
            if (filterPriority && task.priority?.toUpperCase() !== filterPriority) {
                passesFilter = false;
            }
            
            if (passesFilter) {
                grouped[status].push(task);
            }
        });

        Object.keys(grouped).forEach(status => {
            const sorted = [...grouped[status]];
            if (sortBy === 'priority') {
                const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                sorted.sort((a, b) => (priorityOrder[a.priority?.toUpperCase()] ?? 3) - (priorityOrder[b.priority?.toUpperCase()] ?? 3));
            } else if (sortBy === 'dueDate') {
                sorted.sort((a, b) => new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999'));
            } else if (sortBy === 'title') {
                sorted.sort((a, b) => a.title.localeCompare(b.title));
            }
            grouped[status] = sorted;
        });

        return grouped;
    }, [tasks, filterPriority, sortBy]);

    const swimlanes = useMemo(() => {
        if (!swimlaneBy) return null;
        
        const lanes = {};
        if (swimlaneBy === 'assignee') {
            tasks.forEach(task => {
                const key = task.assignee?.name || 'Unassigned';
                if (!lanes[key]) lanes[key] = [];
                lanes[key].push(task);
            });
        } else if (swimlaneBy === 'priority') {
            ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].forEach(p => { lanes[p] = []; });
            tasks.forEach(task => {
                const key = task.priority?.toUpperCase() || 'MEDIUM';
                if (lanes[key]) lanes[key].push(task);
            });
        }
        return lanes;
    }, [tasks, swimlaneBy]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeTask = tasks.find(t => t.id === active.id);
        if (!activeTask) return;

        const overColumn = over.id;
        const newStatus = STATUS_COLUMNS.find(c => c.id === overColumn) ? overColumn : activeTask.status;

        if (activeTask.status !== newStatus && onTaskMove) {
            onTaskMove(activeTask.id, newStatus);
        }
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeTask = tasks.find(t => t.id === active.id);
        if (!activeTask) return;

        const overColumn = over.id;
        if (STATUS_COLUMNS.find(c => c.id === overColumn)) {
            const limit = WIP_LIMITS[overColumn];
            const currentCount = tasksByStatus[overColumn]?.length || 0;
            
            if (limit && currentCount >= limit && activeTask.status !== overColumn) {
                setColumnWipExceeded(prev => ({ ...prev, [overColumn]: true }));
                setTimeout(() => setColumnWipExceeded(prev => ({ ...prev, [overColumn]: false })), 1000);
            }
        }
    };

    const toggleColumnCollapse = (columnId) => {
        setCollapsedColumns(prev => {
            const next = new Set(prev);
            if (next.has(columnId)) next.delete(columnId);
            else next.add(columnId);
            return next;
        });
    };

    const handleQuickAdd = (columnId) => {
        if (!quickAddTitle.trim()) return;
        
        const newTask = {
            id: `temp-${Date.now()}`,
            title: quickAddTitle,
            status: columnId,
            priority: 'MEDIUM',
            createdAt: new Date().toISOString()
        };

        onAddTask?.(newTask);
        setQuickAddTitle('');
        setQuickAddColumn(null);
    };

    const toggleTaskSelection = (taskId) => {
        setSelectedTasks(prev => {
            const next = new Set(prev);
            if (next.has(taskId)) next.delete(taskId);
            else next.add(taskId);
            return next;
        });
    };

    const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl">
            <KanbanToolbar
                filterPriority={filterPriority}
                onFilterChange={setFilterPriority}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedCount={selectedTasks.size}
                onArchive={() => {
                    onArchive?.([...selectedTasks]);
                    setSelectedTasks(new Set());
                }}
                swimlaneBy={swimlaneBy}
                onSwimlaneChange={(val) => {}}
            />

            <div className="p-6 overflow-x-auto">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                >
                    <div className="flex gap-6 min-w-max">
                        {STATUS_COLUMNS.map(column => {
                            const isCollapsed = collapsedColumns.has(column.id);
                            const columnTasks = tasksByStatus[column.id] || [];
                            const isWipExceeded = columnWipExceeded[column.id];

                            return (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    tasks={columnTasks}
                                    isCollapsed={isCollapsed}
                                    onToggleCollapse={() => toggleColumnCollapse(column.id)}
                                    showWipLimit={showWipLimits}
                                    currentCount={columnTasks.length}
                                    limit={WIP_LIMITS[column.id]}
                                    isWipExceeded={isWipExceeded}
                                    onTaskClick={onTaskClick}
                                    onTaskMove={onTaskMove}
                                    allowAdd={allowAdd}
                                    onQuickAdd={() => setQuickAddColumn(column.id)}
                                    quickAddActive={quickAddColumn === column.id}
                                    quickAddTitle={quickAddTitle}
                                    onQuickAddTitleChange={setQuickAddTitle}
                                    onQuickAddSubmit={() => handleQuickAdd(column.id)}
                                    selectedTasks={selectedTasks}
                                    onToggleSelection={toggleTaskSelection}
                                />
                            );
                        })}
                    </div>

                    <DragOverlay>
                        {activeTask && (
                            <TaskCard task={activeTask} isDragging />
                        )}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
};

const KanbanColumn = ({
    column,
    tasks,
    isCollapsed,
    onToggleCollapse,
    showWipLimit,
    currentCount,
    limit,
    isWipExceeded,
    onTaskClick,
    onTaskMove,
    allowAdd,
    onQuickAdd,
    quickAddActive,
    quickAddTitle,
    onQuickAddTitleChange,
    onQuickAddSubmit,
    selectedTasks,
    onToggleSelection
}) => {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });

    const columnColors = {
        slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', ring: 'ring-slate-200' },
        indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', ring: 'ring-indigo-200' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', ring: 'ring-amber-200' },
        emerald: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600', ring: 'ring-violet-200' }
    };

    const colors = columnColors[column.color] || columnColors.slate;

    return (
        <div className={`w-80 shrink-0 transition-all duration-300 ${isCollapsed ? 'w-16' : ''}`}>
            <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-4 transition-all ${isOver ? 'ring-2 ring-indigo-400 scale-[1.02]' : ''} ${isWipExceeded ? 'ring-2 ring-rose-500 animate-pulse' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={onToggleCollapse}
                        className="flex items-center gap-2"
                    >
                        {isCollapsed ? <ChevronRight size={16} className={colors.text} /> : <ChevronDown size={16} className={colors.text} />}
                        {!isCollapsed && (
                            <>
                                <column.icon size={16} className={colors.text} />
                                <span className="font-bold text-sm text-slate-700">{column.title}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} font-semibold`}>
                                    {currentCount}
                                </span>
                            </>
                        )}
                    </button>

                    {showWipLimit && limit && !isCollapsed && (
                        <div className={`text-xs font-medium ${currentCount >= limit ? 'text-rose-600' : 'text-muted-foreground'}`}>
                            {currentCount}/{limit}
                        </div>
                    )}
                </div>

                {!isCollapsed && (
                    <>
                        <div
                            ref={setNodeRef}
                            className="space-y-3 min-h-[200px] max-h-[500px] overflow-y-auto pr-1"
                        >
                            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                {tasks.map(task => (
                                    <SortableTaskCard
                                        key={task.id}
                                        task={task}
                                        onClick={() => onTaskClick?.(task)}
                                        isSelected={selectedTasks.has(task.id)}
                                        onToggleSelection={() => onToggleSelection(task.id)}
                                    />
                                ))}
                            </SortableContext>

                            {tasks.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No tasks
                                </div>
                            )}
                        </div>

                        {allowAdd && (
                            <div className="mt-4">
                                {quickAddActive ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={quickAddTitle}
                                            onChange={(e) => onQuickAddTitleChange(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && onQuickAddSubmit()}
                                            placeholder="Task title..."
                                            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            autoFocus
                                        />
                                        <button
                                            onClick={onQuickAddSubmit}
                                            className="p-2 bg-indigo-600 text-foreground rounded-lg hover:bg-indigo-700"
                                        >
                                            <Plus size={16} />
                                        </button>
                                        <button
                                            onClick={onQuickAdd}
                                            className="p-2 text-muted-foreground hover:text-slate-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={onQuickAdd}
                                        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <Plus size={16} />
                                        Add task
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const SortableTaskCard = ({ task, onClick, isSelected, onToggleSelection }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard
                task={task}
                onClick={onClick}
                isDragging={isDragging}
                isSelected={isSelected}
                onToggleSelection={onToggleSelection}
            />
        </div>
    );
};

export const TaskCard = ({
    task,
    onClick,
    isDragging = false,
    isSelected = false,
    onToggleSelection,
    showActions = true
}) => {
    const [showQuickActions, setShowQuickActions] = useState(false);
    const priorityConfig = PRIORITY_CONFIG[task.priority?.toUpperCase()] || PRIORITY_CONFIG['MEDIUM'];
    const progress = task.progress || 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`group relative bg-white rounded-xl border ${
                isDragging ? 'shadow-2xl ring-2 ring-indigo-500 scale-105' : 'border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md'
            } ${isSelected ? 'ring-2 ring-indigo-500' : ''} p-4 cursor-pointer transition-all duration-200`}
            onClick={onClick}
            onMouseEnter={() => setShowQuickActions(true)}
            onMouseLeave={() => setShowQuickActions(false)}
        >
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleSelection?.(); }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 hover:border-indigo-400'
                        }`}
                    >
                        {isSelected && <CheckCircle2 size={12} className="text-foreground" />}
                    </button>
                    <span className="text-sm font-semibold text-slate-800 truncate">
                        {task.title}
                    </span>
                </div>

                {showActions && (
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-100 transition-all ${showQuickActions ? 'opacity-100' : ''}`}
                    >
                        <MoreHorizontal size={16} className="text-muted-foreground" />
                    </button>
                )}
            </div>

            {task.description && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                    {task.description}
                </p>
            )}

            <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityConfig.bg} ${priorityConfig.border} border`}>
                    {priorityConfig.label}
                </span>
                {task.tags?.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>

            {progress > 0 && (
                <div className="mb-3">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
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
                            new Date(task.dueDate) < new Date() ? 'text-rose-500' : 'text-muted-foreground'
                        }`}>
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {task.assignee && (
                    <div
                        className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold"
                        title={task.assignee.name}
                    >
                        {task.assignee.name.charAt(0)}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const KanbanToolbar = ({
    filterPriority,
    onFilterChange,
    sortBy,
    onSortChange,
    selectedCount,
    onArchive,
    swimlaneBy,
    onSwimlaneChange
}) => {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1">
                    <button
                        onClick={() => onFilterChange(null)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                            !filterPriority ? 'bg-indigo-600 text-foreground' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        All
                    </button>
                    {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => onFilterChange(key)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                filterPriority === key ? 'bg-indigo-600 text-foreground' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            style={filterPriority === key ? {} : { color: config.color }}
                        >
                            {config.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1">
                    <button
                        onClick={() => onSortChange('priority')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                            sortBy === 'priority' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Flag size={12} />
                        Priority
                    </button>
                    <button
                        onClick={() => onSortChange('dueDate')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                            sortBy === 'dueDate' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Calendar size={12} />
                        Due Date
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {selectedCount > 0 && (
                    <button
                        onClick={onArchive}
                        className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
                    >
                        <Archive size={14} />
                        Archive ({selectedCount})
                    </button>
                )}

                <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1">
                    <button
                        onClick={() => onSwimlaneChange(null)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                            !swimlaneBy ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <LayoutGrid size={12} />
                        None
                    </button>
                    <button
                        onClick={() => onSwimlaneChange('assignee')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                            swimlaneBy === 'assignee' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <Users size={12} />
                        Assignee
                    </button>
                    <button
                        onClick={() => onSwimlaneChange('priority')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                            swimlaneBy === 'priority' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <BarChart2 size={12} />
                        Priority
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;