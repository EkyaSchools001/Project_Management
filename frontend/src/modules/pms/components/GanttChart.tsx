// @ts-nocheck
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
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
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ChevronDown,
    ChevronRight,
    Calendar,
    User,
    AlertCircle,
    ArrowRight,
    ZoomIn,
    ZoomOut,
    Download,
    FileSpreadsheet,
    FileText,
    Filter,
    List,
    Clock,
    Flag,
    CheckCircle2,
    Circle,
    MoreHorizontal,
    Plus,
    X,
    Edit2,
    Trash2,
    Paperclip,
    MessageSquare,
    Activity
} from 'lucide-react';
import { format, differenceInDays, addDays, startOfDay, endOfDay, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachWeekOfInterval, eachMonthOfInterval, parseISO, isSameDay, isToday, isWeekend } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Card } from '../../../components/ui/CardLegacy';

const ZOOM_LEVELS = {
    day: { label: 'Day', unit: 'day', format: 'EEE d' },
    week: { label: 'Week', unit: 'week', format: 'MMM d' },
    month: { label: 'Month', unit: 'month', format: 'MMMM yyyy' },
    quarter: { label: 'Quarter', unit: 'quarter', format: 'QQQ yyyy' }
};

const STATUS_COLORS = {
    'TODO': { bg: 'bg-slate-200', fill: '#cbd5e1', text: 'text-slate-600', border: 'border-slate-300' },
    'IN_PROGRESS': { bg: 'bg-indigo-100', fill: '#c7d2fe', text: 'text-indigo-600', border: 'border-indigo-300' },
    'IN_REVIEW': { bg: 'bg-amber-100', fill: '#fde68a', text: 'text-amber-600', border: 'border-amber-300' },
    'DONE': { bg: 'bg-backgroundmerald-100', fill: '#a7f3d0', text: 'text-emerald-600', border: 'border-emerald-300' }
};

const PRIORITY_COLORS = {
    'LOW': { color: '#10b981', label: 'Low' },
    'MEDIUM': { color: '#f59e0b', label: 'Medium' },
    'HIGH': { color: '#f97316', label: 'High' },
    'CRITICAL': { color: '#ef4444', label: 'Critical' }
};

export const GanttChart = ({
    tasks = [],
    onTaskClick,
    onTaskUpdate,
    onTaskDrag,
    showDependencies = true,
    showCriticalPath = false,
    projectStartDate,
    projectEndDate
}) => {
    const [zoomLevel, setZoomLevel] = useState('week');
    const [viewStartDate, setViewStartDate] = useState(projectStartDate || new Date());
    const [expandedTasks, setExpandedTasks] = useState(new Set());
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [hoveredTask, setHoveredTask] = useState(null);
    const containerRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const timelineConfig = useMemo(() => {
        const config = ZOOM_LEVELS[zoomLevel];
        let dates = [];
        let start = startOfWeek(viewStartDate);
        const end = addDays(start, zoomLevel === 'day' ? 14 : zoomLevel === 'week' ? 56 : zoomLevel === 'month' ? 180 : 365);

        if (config.unit === 'day') {
            dates = eachDayOfInterval({ start, end });
        } else if (config.unit === 'week') {
            dates = eachWeekOfInterval({ start, end });
        } else if (config.unit === 'month') {
            dates = eachMonthOfInterval({ start, end });
        }

        return { ...config, dates };
    }, [zoomLevel, viewStartDate]);

    const columnWidth = zoomLevel === 'day' ? 60 : zoomLevel === 'week' ? 120 : zoomLevel === 'month' ? 200 : 300;
    const rowHeight = 56;
    const headerHeight = 60;
    const sidebarWidth = 300;

    const taskPositions = useMemo(() => {
        const positions = {};
        tasks.forEach(task => {
            const start = task.startDate ? parseISO(task.startDate) : new Date();
            const end = task.endDate ? parseISO(task.endDate) : addDays(start, 7);
            positions[task.id] = {
                start,
                end,
                left: differenceInDays(start, timelineConfig.dates[0]) * columnWidth,
                width: Math.max(differenceInDays(end, start) * columnWidth, columnWidth)
            };
        });
        return positions;
    }, [tasks, timelineConfig.dates, columnWidth]);

    const criticalPath = useMemo(() => {
        if (!showCriticalPath) return new Set();
        const critical = new Set();
        const deps = {};
        tasks.forEach(t => { if (t.dependencies) deps[t.id] = t.dependencies; });
        const findCritical = (taskId) => {
            critical.add(taskId);
            const depList = deps[taskId] || [];
            depList.forEach(d => findCritical(d));
        };
        tasks.filter(t => t.status === 'IN_PROGRESS').forEach(t => findCritical(t.id));
        return critical;
    }, [tasks, showCriticalPath]);

    const handleZoomIn = () => {
        const levels = Object.keys(ZOOM_LEVELS);
        const current = levels.indexOf(zoomLevel);
        if (current > 0) setZoomLevel(levels[current - 1]);
    };

    const handleZoomOut = () => {
        const levels = Object.keys(ZOOM_LEVELS);
        const current = levels.indexOf(zoomLevel);
        if (current < levels.length - 1) setZoomLevel(levels[current + 1]);
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        setIsDragging(true);
    };

    const handleDragEnd = (event) => {
        const { active, delta } = event;
        setIsDragging(false);
        setActiveId(null);

        if (active.id && delta.x !== 0) {
            const task = tasks.find(t => t.id === active.id);
            if (task && onTaskDrag) {
                const daysMoved = Math.round(delta.x / columnWidth);
                const newStartDate = addDays(parseISO(task.startDate), daysMoved);
                const newEndDate = addDays(parseISO(task.endDate), daysMoved);
                onTaskDrag(task.id, newStartDate, newEndDate);
            }
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Project Gantt Chart', 14, 20);
        
        const tableData = tasks.map(task => [
            task.title,
            task.status,
            task.priority || 'Medium',
            task.startDate ? format(parseISO(task.startDate), 'MMM d, yyyy') : '-',
            task.endDate ? format(parseISO(task.endDate), 'MMM d, yyyy') : '-'
        ]);

        autoTable(doc, {
            head: [['Task', 'Status', 'Priority', 'Start Date', 'End Date']],
            body: tableData,
            startY: 30
        });

        doc.save('gantt-chart.pdf');
    };

    const exportToExcel = () => {
        const data = tasks.map(task => ({
            Task: task.title,
            Status: task.status,
            Priority: task.priority,
            Start: task.startDate,
            End: task.endDate,
            Assignee: task.assignee?.name || ''
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
        XLSX.writeFile(wb, 'gantt-chart.xlsx');
    };

    const todayPosition = useMemo(() => {
        const today = new Date();
        return differenceInDays(today, timelineConfig.dates[0]) * columnWidth;
    }, [timelineConfig.dates, columnWidth]);

    return (
        <div ref={containerRef} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl">
            <GanttToolbar
                zoomLevel={zoomLevel}
                onZoomChange={setZoomLevel}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onExportPDF={exportToPDF}
                onExportExcel={exportToExcel}
                viewStartDate={viewStartDate}
                onDateChange={setViewStartDate}
            />

            <div className="flex">
                <div className="shrink-0 bg-slate-50 border-r border-slate-100" style={{ width: sidebarWidth }}>
                    <div className="h-[60px] flex items-center px-6 border-b border-slate-200">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Task Name</span>
                    </div>
                    <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                        {tasks.map((task, index) => (
                            <GanttTaskRow
                                key={task.id}
                                task={task}
                                index={index}
                                rowHeight={rowHeight}
                                isExpanded={expandedTasks.has(task.id)}
                                onToggle={() => setExpandedTasks(prev => {
                                    const next = new Set(prev);
                                    if (next.has(task.id)) next.delete(task.id);
                                    else next.add(task.id);
                                    return next;
                                })}
                                onClick={() => onTaskClick?.(task)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div style={{ minWidth: timelineConfig.dates.length * columnWidth }}>
                            <div
                                className="flex border-b border-slate-200"
                                style={{ height: headerHeight }}
                            >
                                {timelineConfig.dates.map((date, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-center border-r border-slate-100 text-xs font-medium ${
                                            isWeekend(date) ? 'bg-slate-50 text-muted-foreground' : 'text-slate-600'
                                        }`}
                                        style={{ width: columnWidth }}
                                    >
                                        {format(date, timelineConfig.format)}
                                    </div>
                                ))}
                            </div>

                            <div className="relative" style={{ height: tasks.length * rowHeight }}>
                                <div className="absolute inset-0 flex">
                                    {timelineConfig.dates.map((date, idx) => (
                                        <div
                                            key={idx}
                                            className={`border-r border-slate-50 ${isWeekend(date) ? 'bg-slate-50/50' : ''}`}
                                            style={{ width: columnWidth, height: '100%' }}
                                        />
                                    ))}
                                </div>

                                {isToday(todayPosition + columnWidth / 2) && (
                                    <div
                                        className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-20"
                                        style={{ left: todayPosition }}
                                    >
                                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-rose-500 rounded-full" />
                                    </div>
                                )}

                                <div className="relative z-10">
                                    {tasks.map((task, index) => {
                                        const pos = taskPositions[task.id];
                                        if (!pos) return null;

                                        return (
                                            <GanttBar
                                                key={task.id}
                                                task={task}
                                                index={index}
                                                position={pos}
                                                rowHeight={rowHeight}
                                                columnWidth={columnWidth}
                                                isCritical={criticalPath.has(task.id)}
                                                showDependencies={showDependencies}
                                                tasks={tasks}
                                                onClick={() => onTaskClick?.(task)}
                                                onHover={setHoveredTask}
                                                isDragging={activeId === task.id}
                                                isActive={isDragging}
                                            />
                                        );
                                    })}
                                </div>

                                {showDependencies && tasks.map(task => {
                                    const pos = taskPositions[task.id];
                                    if (!pos || !task.dependencies) return null;
                                    return task.dependencies.map(depId => {
                                        const depPos = taskPositions[depId];
                                        if (!depPos) return null;
                                        return (
                                            <DependencyArrow
                                                key={`${depId}-${task.id}`}
                                                fromPos={{ x: depPos.left + depPos.width, y: indexOfTask(tasks, depId) * rowHeight + rowHeight / 2 }}
                                                toPos={{ x: pos.left, y: indexOfTask(tasks, task.id) * rowHeight + rowHeight / 2 }}
                                            />
                                        );
                                    });
                                })}
                            </div>
                        </div>
                    </DndContext>
                </div>
            </div>

            <AnimatePresence>
                {hoveredTask && (
                    <TaskTooltip
                        task={hoveredTask}
                        position={taskPositions[hoveredTask.id]}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const indexOfTask = (tasks, taskId) => tasks.findIndex(t => t.id === taskId);

const GanttTaskRow = ({ task, index, rowHeight, isExpanded, onToggle, onClick }) => {
    const statusStyle = STATUS_COLORS[task.status] || STATUS_COLORS['TODO'];
    const priorityColor = PRIORITY_COLORS[task.priority?.toUpperCase()] || PRIORITY_COLORS['MEDIUM'];

    return (
        <div
            className="flex items-center px-6 border-b border-slate-100 hover:bg-indigo-50/50 cursor-pointer transition-colors group"
            style={{ height: rowHeight }}
            onClick={onClick}
        >
            {task.subtasks?.length > 0 && (
                <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="mr-2 text-muted-foreground hover:text-indigo-600">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
            )}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-3 h-3 rounded-full ${statusStyle.bg}`} />
                <span className="text-sm font-semibold text-slate-700 truncate">
                    {task.title}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColor.color }} />
            </div>
        </div>
    );
};

const GanttBar = ({ task, index, position, rowHeight, columnWidth, isCritical, showDependencies, tasks, onClick, onHover, isDragging, isActive }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });
    const statusStyle = STATUS_COLORS[task.status] || STATUS_COLORS['TODO'];
    const priorityColor = PRIORITY_COLORS[task.priority?.toUpperCase()] || PRIORITY_COLORS['MEDIUM'];

    const style = {
        position: 'absolute',
        left: position.left,
        top: index * rowHeight + 8,
        width: position.width,
        height: rowHeight - 16,
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 100 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`rounded-xl cursor-move transition-all duration-200 ${
                isDragging ? 'shadow-2xl scale-105 opacity-90' : 'hover:shadow-lg'
            } ${isCritical ? 'ring-2 ring-rose-500 ring-offset-2' : ''}`}
            onClick={onClick}
            onMouseEnter={() => onHover(task)}
            onMouseLeave={() => onHover(null)}
            {...attributes}
            {...listeners}
        >
            <div className={`h-full rounded-xl flex items-center px-3 gap-2 ${statusStyle.bg} border ${statusStyle.border}`}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColor.color }} />
                <span className="text-xs font-semibold text-slate-700 truncate flex-1">
                    {task.title}
                </span>
                {task.milestone && (
                    <Flag size={14} className="text-amber-500" />
                )}
            </div>
        </div>
    );
};

const DependencyArrow = ({ fromPos, toPos }) => (
    <svg className="absolute top-0 left-0 pointer-events-none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
            </marker>
        </defs>
        <path
            d={`M ${fromPos.x} ${fromPos.y} C ${fromPos.x + 30} ${fromPos.y}, ${toPos.x - 30} ${toPos.y}, ${toPos.x} ${toPos.y}`}
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
        />
    </svg>
);

const TaskTooltip = ({ task, position }) => {
    if (!position) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 bg-backgroundackground text-foreground p-4 rounded-2xl shadow-2xl w-72 pointer-events-none"
            style={{
                left: position.left + position.width / 2,
                top: 80
            }}
        >
            <div className="font-bold text-sm mb-2">{task.title}</div>
            <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                    <Circle size={12} className="text-muted-foreground" />
                    <span className="text-slate-300">{task.status}</span>
                </div>
                {task.startDate && (
                    <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-muted-foreground" />
                        <span className="text-slate-300">
                            {format(parseISO(task.startDate), 'MMM d')} - {format(parseISO(task.endDate), 'MMM d, yyyy')}
                        </span>
                    </div>
                )}
                {task.assignee && (
                    <div className="flex items-center gap-2">
                        <User size={12} className="text-muted-foreground" />
                        <span className="text-slate-300">{task.assignee.name}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export const GanttToolbar = ({
    zoomLevel,
    onZoomChange,
    onZoomIn,
    onZoomOut,
    onExportPDF,
    onExportExcel,
    viewStartDate,
    onDateChange
}) => {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-2xl border border-slate-200 p-1">
                    {Object.entries(ZOOM_LEVELS).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => onZoomChange(key)}
                            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                                zoomLevel === key
                                    ? 'bg-indigo-600 text-foreground shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {config.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={onZoomOut} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-100">
                        <ZoomOut size={18} className="text-slate-600" />
                    </button>
                    <button onClick={onZoomIn} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-100">
                        <ZoomIn size={18} className="text-slate-600" />
                    </button>
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-xl border transition-all ${
                        showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <Filter size={18} />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-2xl border border-slate-200 p-1">
                    <button
                        onClick={onExportPDF}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                        <FileText size={16} />
                        PDF
                    </button>
                    <button
                        onClick={onExportExcel}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                        <FileSpreadsheet size={16} />
                        Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;