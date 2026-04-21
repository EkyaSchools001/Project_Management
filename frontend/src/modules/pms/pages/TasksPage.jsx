import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Search, 
    CheckCircle2, 
    Circle, 
    Clock, 
    AlertCircle, 
    LayoutList, 
    LayoutGrid, 
    MoreVertical, 
    Calendar,
    Activity,
    Target,
    Sparkles,
    Workflow,
    Layers,
    Kanban
} from 'lucide-react';
import { Card } from '../../../components/ui/CardLegacy';
import CreateTaskModal from '../components/CreateTaskModal';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskDetailModal } from '../components/TaskDetailModal';

const statusConfig = {
    'TODO': { color: 'text-zinc-400', bg: 'bg-slate-100', glow: 'shadow-slate-500/10', label: 'Queued', icon: Circle },
    'IN_PROGRESS': { color: 'text-indigo-400', bg: 'bg-indigo-500/10', glow: 'shadow-indigo-500/20', label: 'Active', icon: Clock },
    'IN_REVIEW': { color: 'text-violet-400', bg: 'bg-violet-500/10', glow: 'shadow-violet-500/20', label: 'Audit', icon: AlertCircle },
    'DONE': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20', label: 'Resolved', icon: CheckCircle2 }
};

const priorityConfig = {
    'LOW': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'MEDIUM': 'bg-amber-50 text-amber-600 border-amber-100',
    'HIGH': 'bg-orange-50 text-orange-600 border-orange-100',
    'CRITICAL': 'bg-rose-50 text-rose-600 border-rose-100'
};

const TasksPage = () => {
    const [tasks, setTasks] = useState([
        { id: '1', title: 'Draft Science Syllabus', description: 'Complete the initial draft for Grade 12 physics curriculum update.', status: 'DONE', priority: 'HIGH', dueDate: '2026-02-15', assignee: { name: 'Alice Smith' }, project: 'Curriculum Revamp', progress: 100 },
        { id: '2', title: 'Vendor Selection', description: 'Evaluate workstation vendors for Lab A infrastructure.', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: '2026-02-28', assignee: { name: 'Bob Johnson' }, project: 'Lab Infrastructure', progress: 60 },
        { id: '3', title: 'Feedback Collection', description: 'Commence parent feedback collection for new student portal.', status: 'TODO', priority: 'LOW', dueDate: '2026-03-05', assignee: { name: 'Charlie Brown' }, project: 'Portal Launch', progress: 0 },
        { id: '4', title: 'Server Migration', description: 'Execution of critical legacy data to new AWS instance.', status: 'IN_REVIEW', priority: 'CRITICAL', dueDate: '2026-02-12', assignee: { name: 'Diana Prince' }, project: 'Lab Infrastructure', progress: 90 },
    ]);

    const [viewMode, setViewMode] = useState('list');
    const [activeStatus, setActiveStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesStatus = activeStatus === 'ALL' || task.status === activeStatus;
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.project.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [tasks, activeStatus, searchQuery]);

    const stats = useMemo(() => ({
        total: tasks.length,
        pending: tasks.filter(t => t.status !== 'DONE').length,
        done: tasks.filter(t => t.status === 'DONE').length
    }), [tasks]);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const handleTaskMove = (taskId, newStatus) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const handleArchive = (taskIds) => {
        setTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
    };

    const handleSaveTask = (task) => {
        if (task.id?.toString().startsWith('temp-')) {
            const newTask = { ...task, id: Date.now().toString() };
            setTasks(prev => [...prev, newTask]);
        } else {
            handleTaskUpdate(task);
        }
        setIsTaskModalOpen(false);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
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
            className="max-w-[1800px] mx-auto space-y-16 p-6 sm:p-10 lg:p-16 pb-40 relative"
        >
            {/* Orbital Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-40 left-0 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px] -z-10" />

            {/* Vibrant Terminal Header */}
            <header className="relative overflow-hidden p-12 sm:p-20 bg-slate-950 rounded-[4rem] sm:rounded-[5rem] text-white shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-rose-600/10" />
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-20 animate-pulse pointer-events-none" />
                
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 relative z-10">
                    <div className="space-y-8 max-w-3xl">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.5em] backdrop-blur-3xl">
                            <Activity size={14} className="text-emerald-400" />
                            Work-Stream Synchronization: Nominal
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-4">
                            Atomic <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400">Work Units</span>
                        </motion.h1>
                        <div className="flex flex-wrap gap-6">
                            <MetricPill label="Inventory" value={stats.total} color="text-indigo-400" bg="bg-indigo-400/10" />
                            <MetricPill label="Operational" value={stats.pending} color="text-amber-400" bg="bg-amber-400/10" />
                            <MetricPill label="Synchronized" value={stats.done} color="text-emerald-400" bg="bg-emerald-400/10" />
                        </div>
                    </div>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto pb-4">
                        <div className="relative group/search flex-1 sm:w-96">
                            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-white/20 w-6 h-6 group-focus-within/search:text-indigo-400" />
                            <input
                                type="text"
                                placeholder="QUERY NODE CLUSTER..."
                                className="w-full pl-18 pr-8 h-20 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] focus:border-indigo-500 focus:bg-white/10 outline-none transition-all backdrop-blur-3xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="h-20 px-12 bg-white text-slate-950 font-black rounded-3xl text-xs uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-indigo-600 hover:text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 group/deploy"
                        >
                            <Plus size={28} className="group-hover/deploy:rotate-90 transition-transform duration-500" />
                            Deploy Node
                        </button>
                    </motion.div>
                </div>
            </header>

            {/* Matrix Toolbar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 sm:px-4">
                <div className="flex bg-white p-3 rounded-[3.5rem] border border-slate-100 w-full lg:w-auto overflow-x-auto no-scrollbar shadow-xl shadow-slate-100/50">
                    <TabButton active={activeStatus === 'ALL'} onClick={() => setActiveStatus('ALL')} icon={Layers} label="Global Network" />
                    {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map(status => (
                        <TabButton 
                            key={status}
                            active={activeStatus === status} 
                            onClick={() => setActiveStatus(status)} 
                            icon={statusConfig[status].icon} 
                            label={statusConfig[status].label} 
                        />
                    ))}
                </div>

                <div className="flex sm:flex items-center gap-4 bg-white p-3 rounded-3xl border border-slate-100 shadow-xl">
                    <ViewButton active={viewMode === 'kanban'} onClick={() => setViewMode('kanban')} icon={Kanban} />
                    <ViewButton active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={LayoutList} />
                    <ViewButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')} icon={LayoutGrid} />
                </div>
            </div>

            {viewMode === 'kanban' && (
                <div className="mt-8">
                    <KanbanBoard
                        tasks={filteredTasks}
                        onTaskClick={handleTaskClick}
                        onTaskMove={handleTaskMove}
                        onAddTask={(t) => setTasks(prev => [...prev, { ...t, id: `temp-${Date.now()}` }])}
                        onArchive={handleArchive}
                        showWipLimits={true}
                    />
                </div>
            )}

            {/* Node Repository */}
            <div className={viewMode === 'list' ? 'space-y-8 sm:space-y-12' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12'}>
                <AnimatePresence mode="popLayout" initial={false}>
                    {filteredTasks.length > 0 ? filteredTasks.map((task, idx) => (
                        <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                            transition={{ duration: 0.6, delay: idx * 0.05, type: 'spring' }}
                        >
                            <Card className={`group relative bg-white border border-slate-100 hover:border-indigo-500 hover:shadow-[0_60px_100px_rgba(79,70,229,0.1)] hover:-translate-y-4 transition-all duration-700 cursor-default rounded-[4rem] overflow-hidden ${viewMode === 'list' ? 'p-12 sm:p-16' : 'p-12 flex flex-col h-full'}`}>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/5 via-transparent to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rotate-45 transform translate-x-20 -translate-y-20" />
                                
                                <div className="flex justify-between items-start mb-10 sm:mb-14 relative z-10">
                                    <div className="flex items-center gap-8">
                                        <div className={`w-18 h-18 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-2xl ${task.status === 'DONE' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                            {task.status === 'DONE' ? <CheckCircle2 size={36} /> : <Circle size={36} className="group-hover:rotate-12 transition-transform" />}
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-5 py-2 rounded-full uppercase tracking-widest flex items-center gap-2 border border-indigo-100 backdrop-blur-xl">
                                                    <Workflow size={14} />
                                                    {task.project}
                                                </span>
                                                <span className={`text-[9px] font-black px-4 py-1.5 rounded-lg border uppercase tracking-[0.3em] shadow-sm ${priorityConfig[task.priority]}`}>
                                                    {task.priority}-LVL
                                                </span>
                                            </div>
                                            <h3 className={`font-black uppercase tracking-tighter leading-none transition-all ${viewMode === 'list' ? 'text-4xl sm:text-5xl' : 'text-3xl'} ${task.status === 'DONE' ? 'text-slate-300 line-through' : 'text-slate-950 group-hover:text-indigo-600'}`}>
                                                {task.title}
                                            </h3>
                                        </div>
                                    </div>
                                    <button className="text-slate-300 hover:text-indigo-600 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 transition-all hover:rotate-90">
                                        <MoreVertical size={28} />
                                    </button>
                                </div>

                                <div className={`${viewMode === 'list' && window.innerWidth > 1024 ? 'ml-28' : ''} relative z-10`}>
                                    <p className={`text-base sm:text-lg text-zinc-400 font-black uppercase tracking-widest leading-relaxed mb-12 border-l-4 border-slate-100 pl-8 group-hover:border-indigo-400 transition-all ${viewMode === 'list' ? 'max-w-5xl' : 'line-clamp-3'}`}>
                                        Node synchronization status: {task.description}. All systems initialized and operating within standard deviation.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-10 pt-12 border-t border-slate-50">
                                        <div className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <Calendar size={20} className="text-indigo-500 group-hover:text-white" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{task.dueDate}</span>
                                        </div>

                                        <div className="flex items-center gap-5 ml-auto bg-white border border-slate-100 px-8 py-4 rounded-3xl shadow-xl shadow-slate-100 group-hover:border-indigo-100 transition-all">
                                            <div className="text-right">
                                                <p className="text-[11px] font-black text-slate-950 leading-none truncate uppercase tracking-tighter mb-2">{task.assignee?.name || task.assignee}</p>
                                                <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest opacity-60">Authorized Operator</p>
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-lg font-black border-4 border-white shadow-2xl group-hover:bg-indigo-600 group-hover:scale-115 transition-all duration-700">
                                                {(task.assignee?.name || task.assignee || 'U').charAt(0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-4 right-4 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none group-hover:rotate-12 duration-1000">
                                    <Target size={150} />
                                </div>
                            </Card>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-60 flex flex-col items-center">
                            <div className="w-48 h-48 bg-slate-50 rounded-[4rem] shadow-2xl flex items-center justify-center mb-12 text-slate-200 border-4 border-dashed border-slate-100 animate-float">
                                <Sparkles size={80} className="text-indigo-200" />
                            </div>
                            <h3 className="text-5xl font-black text-slate-950 uppercase tracking-tighter">Queue Empty</h3>
                            <p className="text-zinc-400 font-black mt-6 text-xs uppercase tracking-[0.8em] animate-pulse">All mission-critical nodes successfully synchronized.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onAdd={(t) => setTasks([{ ...t, id: `temp-${Date.now()}`, progress: 0, assignee: { name: t.assignee || 'Unassigned' } }, ...tasks])}
                projects={[
                    { id: 'p1', name: 'Curriculum Revamp' },
                    { id: 'p2', name: 'Lab Infrastructure' },
                    { id: 'p3', name: 'Portal Launch' }
                ]}
            />

            <TaskDetailModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                task={selectedTask}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
            />
        </motion.div>
    );
};

const MetricPill = ({ label, value, color, bg }) => (
    <div className={`flex items-center gap-4 px-8 py-3.5 rounded-2xl border border-white/5 ${bg} ${color} shadow-2xl backdrop-blur-3xl group/metric cursor-default transition-all hover:scale-105 hover:bg-white/10`}>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 group-hover:opacity-80 transition-opacity">{label}</span>
        <span className="text-2xl font-black tracking-tighter leading-none">{value}</span>
    </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`px-10 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap flex items-center gap-5 ${active
            ? 'bg-slate-950 text-white shadow-2xl shadow-slate-950/30 scale-105 active:scale-95'
            : 'text-zinc-400 hover:text-slate-950'
            }`}
    >
        <Icon size={18} />
        {label}
    </motion.button>
);

const ViewButton = ({ active, onClick, icon: Icon }) => (
    <button
        onClick={onClick}
        className={`p-5 rounded-2xl transition-all active:scale-75 ${active 
            ? 'bg-slate-950 text-white shadow-2xl scale-110' 
            : 'text-slate-300 hover:text-slate-600'}`}
    >
        <Icon size={24} />
    </button>
);

export default TasksPage;
