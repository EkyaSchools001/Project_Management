import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Calendar,
    IndianRupee,
    TrendingUp,
    Search,
    Briefcase,
    LayoutGrid,
    LayoutList,
    Zap,
    Shield,
    Sparkles,
    ArrowUpRight,
    Activity,
    Layers,
    Target,
    Globe,
    Cpu,
    Workflow,
    Box,
    Kanban,
    GanttChart as GanttIcon
} from 'lucide-react';
import { Card } from '../../../components/ui/CardLegacy';
import { pmsService } from '../../../services/pms.service';
import CreateProjectModal from '../components/CreateProjectModal';
import { GanttChart } from '../components/GanttChart';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskDetailModal } from '../components/TaskDetailModal';

// Module-level animation variants — defined here so TelemetryCard and other
// sub-components defined at module scope can reference them.
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};


const ProjectsPage = () => {
    const { id: deptId, schoolId } = useParams();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStatus, setActiveStatus] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [projectView, setProjectView] = useState('grid');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await pmsService.getProjects();
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    useEffect(() => {
        setTasks([
            { id: '1', title: 'Project Kickoff', description: 'Initial project setup and planning', status: 'DONE', priority: 'HIGH', startDate: '2026-01-01', endDate: '2026-01-15', assignee: { name: 'Avni' }, progress: 100 },
            { id: '2', title: 'Requirements Analysis', description: 'Gather and document requirements', status: 'DONE', priority: 'HIGH', startDate: '2026-01-10', endDate: '2026-01-25', assignee: { name: 'Indu' }, progress: 100 },
            { id: '3', title: 'Design Phase', description: 'Create system architecture and design', status: 'IN_PROGRESS', priority: 'MEDIUM', startDate: '2026-01-20', endDate: '2026-02-15', assignee: { name: 'Sharada' }, progress: 60 },
            { id: '4', title: 'Development Sprint 1', description: 'Implement core features', status: 'IN_PROGRESS', priority: 'MEDIUM', startDate: '2026-02-01', endDate: '2026-02-28', assignee: { name: 'Rahul' }, progress: 30 },
            { id: '5', title: 'Testing Phase', description: 'Run QA tests and fixes', status: 'TODO', priority: 'HIGH', startDate: '2026-03-01', endDate: '2026-03-15', assignee: { name: 'Diana' }, progress: 0 },
            { id: '6', title: 'Deployment', description: 'Deploy to production', status: 'TODO', priority: 'CRITICAL', startDate: '2026-03-15', endDate: '2026-03-20', assignee: { name: 'Indu' }, progress: 0, milestone: true },
            { id: '7', title: 'User Training', description: 'Train users on new system', status: 'TODO', priority: 'LOW', startDate: '2026-03-20', endDate: '2026-03-31', assignee: { name: 'Avni' }, progress: 0 },
            { id: '8', title: 'Documentation', description: 'Complete project documentation', status: 'IN_REVIEW', priority: 'MEDIUM', startDate: '2026-02-10', endDate: '2026-02-20', assignee: { name: 'Sharada' }, progress: 80, dependencies: ['3'] }
        ]);
    }, []);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const handleTaskDrag = (taskId, newStartDate, newEndDate) => {
        setTasks(prev => prev.map(t => 
            t.id === taskId ? { ...t, startDate: newStartDate.toISOString().split('T')[0], endDate: newEndDate.toISOString().split('T')[0] } : t
        ));
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

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const matchesStatus = activeStatus === 'ALL' || p.status === activeStatus;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [projects, searchQuery, activeStatus]);

    const stats = useMemo(() => ({
        total: projects.length,
        active: projects.filter(p => p.status === 'Active').length,
        budget: projects.length * 525000 
    }), [projects]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-backgroundmerald-500 text-foreground border-transparent shadow-emerald-500/20';
            case 'Active': return 'bg-indigo-600 text-foreground border-transparent shadow-indigo-500/20';
            case 'Archived': return 'bg-slate-500 text-foreground border-transparent shadow-slate-500/10';
            default: return 'bg-slate-500 text-foreground border-transparent';
        }
    };

    const handleAddProject = async (newProjectData) => {
        try {
            const created = await pmsService.createProject(newProjectData);
            setProjects([created, ...projects]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to create project', error);
        }
    };

    const getContextPath = (projectId) => {
        if (schoolId) return `/schools/${schoolId}/projects/${projectId}`;
        if (deptId) return `/departments/${deptId}/projects/${projectId}`;
        return `/pms/projects/${projectId}`;
    };

    // containerVariants and itemVariants are defined at module level above

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1800px] mx-auto space-y-16 p-6 sm:p-10 lg:p-16 pb-40 relative overflow-hidden"
        >
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[200px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[150px] -z-10" />

            {/* Vibrant Mission Matrix Header */}
            <header className="relative overflow-hidden p-12 sm:p-20 bg-slate-950 rounded-[4rem] sm:rounded-[5rem] text-foreground shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-rose-600/10" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-violet-600 rounded-full blur-[120px] opacity-20 animate-pulse pointer-events-none" />
                
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 relative z-10">
                    <div className="space-y-8 max-w-3xl">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full border border-white/10 text-sm sm:text-sm font-bold uppercase tracking-[0.5em] backdrop-blur-3xl">
                            <Globe size={14} className="text-indigo-400" />
                            Global Resource Mesh: Operational
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tighter uppercase leading-[0.8] mb-4">
                            Mission <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400 animate-gradient-shift">Clusters</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-foreground/40 font-bold text-xs sm:text-sm uppercase tracking-[0.4em] flex items-center gap-4">
                            <Activity size={18} className="text-amber-400" />
                            Secure Orchestration Terminal // Layer 0
                        </motion.p>
                    </div>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto pb-4">
                        <div className="relative group/search flex-1 sm:w-96">
                            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-foreground/20 w-6 h-6 group-focus-within/search:text-indigo-400" />
                            <input
                                type="text"
                                placeholder="QUERY MISSION CORE..."
                                className="w-full pl-18 pr-8 h-20 bg-white/5 border border-white/10 rounded-3xl text-sm font-bold uppercase tracking-[0.2em] focus:border-rose-500 focus:bg-white/10 outline-none transition-all backdrop-blur-3xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="h-20 px-12 bg-white text-slate-950 font-bold rounded-3xl text-xs uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-rose-600 hover:text-foreground hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 group/deploy"
                        >
                            <Plus size={28} className="group-hover/deploy:rotate-90 transition-transform duration-500" />
                            Initialize
                        </button>
                    </motion.div>
                </div>
            </header>

            {/* Global Telemetry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                <TelemetryCard 
                    title="Active Workstreams" 
                    value={stats.active} 
                    icon={TrendingUp} 
                    color="from-indigo-500 to-indigo-700 shadow-indigo-500/20" 
                    iconColor="text-indigo-400"
                />
                <TelemetryCard 
                    title="Total Deployed" 
                    value={stats.total} 
                    icon={Box} 
                    color="from-rose-400 to-rose-600 shadow-rose-500/20" 
                    iconColor="text-rose-400"
                />
                <TelemetryCard 
                    title="Capital Pool" 
                    value={`₹${(stats.budget / 100000).toFixed(1)}L`} 
                    icon={IndianRupee} 
                    color="from-amber-400 to-amber-600 shadow-amber-500/20" 
                    iconColor="text-amber-400"
                />
            </div>

            {/* Matrix Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 sm:px-4">
                <div className="flex bg-white p-3 rounded-[3.5rem] border border-slate-100 w-full lg:w-auto overflow-x-auto no-scrollbar shadow-xl shadow-slate-100/50">
                    <TabButton active={activeStatus === 'ALL'} onClick={() => setActiveStatus('ALL')} label="Global Registry" />
                    {['Active', 'Completed', 'Archived'].map(status => (
                        <TabButton 
                            key={status}
                            active={activeStatus === status} 
                            onClick={() => setActiveStatus(status)} 
                            label={status} 
                        />
                    ))}
                </div>

                <div className="flex sm:flex items-center gap-4 bg-white p-3 rounded-3xl border border-slate-100 shadow-xl">
                    <ViewButton active={projectView === 'gantt'} onClick={() => setProjectView('gantt')} icon={GanttIcon} />
                    <ViewButton active={projectView === 'kanban'} onClick={() => setProjectView('kanban')} icon={Kanban} />
                    <ViewButton active={projectView === 'list'} onClick={() => setProjectView('list')} icon={LayoutList} />
                    <ViewButton active={projectView === 'grid'} onClick={() => setProjectView('grid')} icon={LayoutGrid} />
                </div>
            </div>

            {projectView === 'gantt' && (
                <div className="mt-8">
                    <GanttChart
                        tasks={tasks}
                        onTaskClick={handleTaskClick}
                        onTaskUpdate={handleTaskUpdate}
                        onTaskDrag={handleTaskDrag}
                        showDependencies={true}
                        showCriticalPath={true}
                        projectStartDate={new Date('2026-01-01')}
                    />
                </div>
            )}

            {projectView === 'kanban' && (
                <div className="mt-8">
                    <KanbanBoard
                        tasks={tasks}
                        onTaskClick={handleTaskClick}
                        onTaskMove={handleTaskMove}
                        onAddTask={(t) => setTasks(prev => [...prev, { ...t, id: `temp-${Date.now()}` }])}
                        onArchive={handleArchive}
                        showWipLimits={true}
                    />
                </div>
            )}

            {/* Mission Deck */}
            <div className="relative min-h-[600px]">
                <AnimatePresence mode="popLayout" initial={false}>
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-8 py-40"
                        >
                            <div className="w-24 h-24 border-[8px] border-slate-100 border-t-indigo-600 rounded-full animate-spin shadow-2xl" />
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.8em] animate-pulse">Syncing Mission Mesh...</p>
                        </motion.div>
                    ) : (projectView === 'grid' || projectView === 'list') ? (
                        <motion.div 
                            key={viewMode}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12' : 'space-y-8'}
                        >
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    variants={itemVariants}
                                >
                                    <Card
                                        onClick={() => navigate(getContextPath(project.id))}
                                        className={`group relative bg-white border border-slate-100 hover:border-indigo-500 hover:shadow-[0_60px_100px_rgba(79,70,229,0.1)] hover:-translate-y-4 transition-all duration-700 cursor-pointer rounded-[4rem] overflow-hidden ${viewMode === 'grid' ? 'p-12 sm:p-16 aspect-[4/5] flex flex-col' : 'p-10 flex flex-col lg:flex-row lg:items-center gap-12'}`}
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rotate-45 transform translate-x-20 -translate-y-20 pointer-events-none" />
                                        
                                        <div className={`flex justify-between items-start relative z-10 ${viewMode === 'grid' ? 'mb-14' : 'min-w-max'}`}>
                                            <div className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-[0.3em] border shadow-2xl ${getStatusStyle(project.status || 'Active')}`}>
                                                {(project.status || 'Active').replace('_', ' ')}
                                            </div>
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all group-hover:shadow-xl border border-slate-100">
                                                <Target size={28} className="group-hover:rotate-12 transition-transform" />
                                            </div>
                                        </div>

                                        <div className="flex-1 relative z-10">
                                            <h3 className={`font-bold uppercase tracking-tighter leading-none group-hover:text-indigo-600 transition-all mb-6 ${viewMode === 'grid' ? 'text-2xl sm:text-3xl line-clamp-2' : 'text-3xl lg:text-4xl'}`}>
                                                {project.name}
                                            </h3>
                                            {(viewMode === 'grid' || window.innerWidth > 1024) && (
                                                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs leading-relaxed border-l-4 border-slate-50 pl-6 group-hover:border-indigo-400 transition-all line-clamp-3">
                                                    {project.description || 'Global infrastructure node executing prioritized mission protocols with nested resource clustering.'}
                                                </p>
                                            )}
                                        </div>

                                        <div className={`relative z-10 ${viewMode === 'grid' ? 'mt-12 space-y-10' : 'flex items-center gap-12'}`}>
                                            <div className={`grid grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all duration-700 ${viewMode === 'list' ? 'hidden sm:grid min-w-80' : ''}`}>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.2em]">Deployment</p>
                                                    <div className="flex items-center gap-3">
                                                        <Calendar size={18} className="text-indigo-500" />
                                                        <span className="text-sm font-bold text-slate-950 uppercase">{new Date(project.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-right">
                                                    <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.2em]">Allocation</p>
                                                    <div className="flex items-center justify-end gap-3">
                                                        <IndianRupee size={18} className="text-emerald-500" />
                                                        <span className="text-sm font-bold text-slate-950 uppercase">{(project.budget || 0).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`flex justify-between items-center ${viewMode === 'list' ? 'ml-auto' : ''}`}>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-slate-950 text-foreground rounded-2xl flex items-center justify-center text-2xl font-bold border-4 border-white shadow-2xl group-hover:scale-115 group-hover:bg-indigo-600 transition-all duration-700">
                                                        {project.manager?.name?.charAt(0) || 'P'}
                                                    </div>
                                                    <div className="hidden sm:flex flex-col">
                                                        <span className="text-sm font-bold text-slate-950 leading-none uppercase tracking-tighter mb-2">{project.manager?.name || 'Inertia Core'}</span>
                                                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Architect</span>
                                                    </div>
                                                </div>
                                                <button className="h-16 px-10 bg-slate-950 text-foreground font-bold rounded-3xl text-sm uppercase tracking-[0.4em] group-hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 flex items-center gap-4">
                                                    Access
                                                    <ArrowUpRight size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddProject}
            />

            <TaskDetailModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                task={selectedTask}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
            />
            
            {/* Neural System Log */}
            <div className="py-20 flex flex-col items-center gap-10">
                <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full w-20 bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
                    />
                </div>
                <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.6em]">System Uplink Protocol Active // Node Registry Sync 100%</p>
            </div>
        </motion.div>
    );
};

const TelemetryCard = ({ title, value, icon: Icon, color, iconColor }) => (
    <motion.div variants={itemVariants}>
        <Card className="flex items-center gap-10 p-12 bg-white border border-slate-100 rounded-[4rem] group hover:border-indigo-200 transition-all duration-700 relative overflow-hidden shadow-xl shadow-slate-100/50">
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700`} />
            <div className={`h-22 w-22 flex items-center justify-center bg-slate-50 rounded-[2.5rem] shrink-0 border border-slate-100 group-hover:scale-115 group-hover:bg-white group-hover:shadow-2xl transition-all duration-700`}>
                <div className={`${iconColor} transition-transform duration-700`}>
                    <Icon size={40} />
                </div>
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.5em] mb-3 group-hover:text-slate-950 transition-colors">{title}</p>
                <div className="flex items-baseline gap-4">
                    <p className="text-2xl sm:text-4xl font-bold text-slate-950 tracking-tighter group-hover:scale-105 transition-all duration-700 origin-left">{value}</p>
                    <ArrowUpRight size={24} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0" />
                </div>
            </div>
        </Card>
    </motion.div>
);

const TabButton = ({ active, onClick, label }) => (
    <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`px-10 py-5 rounded-[2.5rem] text-sm font-bold uppercase tracking-[0.3em] transition-all whitespace-nowrap flex items-center gap-5 ${active
            ? 'bg-slate-950 text-foreground shadow-2xl scale-105 active:scale-95'
            : 'text-muted-foreground hover:text-slate-950'
            }`}
    >
        {label}
        {active && <div className="w-2 h-2 rounded-full bg-indigo-400 animate-glow shadow-[0_0_10px_rgba(129,140,248,0.8)]" />}
    </motion.button>
);

const ViewButton = ({ active, onClick, icon: Icon }) => (
    <button
        onClick={onClick}
        className={`p-5 rounded-2xl transition-all active:scale-75 ${active 
            ? 'bg-slate-950 text-foreground shadow-2xl' 
            : 'text-slate-300 hover:text-slate-600'}`}
    >
        <Icon size={24} />
    </button>
);

export default ProjectsPage;

