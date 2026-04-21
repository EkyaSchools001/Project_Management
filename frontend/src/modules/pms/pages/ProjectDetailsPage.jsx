import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/ui/CardLegacy';
import { Button } from '../../../components/ui/ButtonLegacy';
import {
    Plus,
    Calendar as CalendarIcon,
    User,
    CheckCircle,
    Clock,
    MoreHorizontal,
    LayoutGrid,
    List,
    IndianRupee,
    ArrowLeft,
    TrendingUp,
    Users,
    Edit2,
    Save,
    X,
    Ticket,
    CheckCircle2,
    Circle,
    AlertCircle,
    LayoutDashboard,
    GanttChartSquare,
    Zap,
    Cpu,
    Target,
    Activity,
    ArrowUpRight,
    Sparkles,
    Shield,
    Globe
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_TASKS } from '../../../data/pmsData';
import CreateTaskModal from '../components/CreateTaskModal';

const ProjectDetailsPage = () => {
    const { id, deptId, schoolId } = useParams();
    const navigate = useNavigate();

    // In a real app, we would fetch based on ID. For now, use mock:
    const project = useMemo(() => MOCK_PROJECTS.find(p => p.id === id) || MOCK_PROJECTS[0], [id]);

    const [activeTab, setActiveTab] = useState('BOARD'); // BOARD, TASKS, TEAM
    const [tasks, setTasks] = useState(MOCK_TASKS);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const tasksByStatus = useMemo(() => ({
        TODO: tasks.filter(t => t.status === 'Todo' || t.status === 'TODO'),
        IN_PROGRESS: tasks.filter(t => t.status === 'In Progress' || t.status === 'IN_PROGRESS'),
        DONE: tasks.filter(t => t.status === 'Done' || t.status === 'DONE'),
    }), [tasks]);

    const progress = useMemo(() => {
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === 'Done' || t.status === 'DONE').length;
        return Math.round((completed / tasks.length) * 100);
    }, [tasks]);

    const getBackPath = () => {
        if (schoolId) return `/schools/${schoolId}/projects`;
        if (deptId) return `/departments/${deptId}/projects`;
        return `/pms/projects`;
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
            className="max-w-[1800px] mx-auto space-y-16 p-6 sm:p-10 lg:p-16 pb-40"
        >
            {/* Project Hero Header */}
            <section className="relative overflow-hidden p-12 sm:p-16 lg:p-24 bg-backgroundackgroundackground rounded-[5rem] text-foreground shadow-2xl group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-violet-600/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[200px] opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                
                <div className="flex flex-col xl:flex-row justify-between items-start gap-16 relative z-10">
                    <div className="flex-1 space-y-12">
                        <motion.button
                            variants={itemVariants}
                            onClick={() => navigate(getBackPath())}
                            className="group flex items-center text-[11px] font-black text-foreground/40 hover:text-indigo-400 transition-all uppercase tracking-[0.4em] active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5 mr-4 group-hover:-translate-x-3 transition-transform" /> 
                            Mission Repository Protocol
                        </motion.button>

                        <div className="space-y-8">
                            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-8">
                                <h1 className="text-5xl sm:text-8xl lg:text-9xl font-black text-foreground tracking-tighter uppercase leading-[0.85] drop-shadow-2xl">
                                    {project.name}
                                </h1>
                                <div className="px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/10 text-indigo-400 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em]">
                                    {project.status.replace('_', ' ')}
                                </div>
                            </motion.div>
                            <motion.p variants={itemVariants} className="text-foreground/40 max-w-4xl text-lg sm:text-2xl font-black uppercase tracking-widest leading-relaxed border-l-8 border-white/10 pl-10">
                                {project.description}
                            </motion.p>
                        </div>

                        <div className="flex flex-wrap gap-8 pt-10">
                            <StatBadge icon={User} label="Command Lead" value={project.manager.name} color="text-blue-400" bg="bg-backgroundackgroundlue-600/10" />
                            <StatBadge icon={CalendarIcon} label="Target Window" value={project.endDate} color="text-indigo-400" bg="bg-indigo-600/10" />
                            <StatBadge icon={IndianRupee} label="Budget Matrix" value={`₹${project.budget.toLocaleString()}`} color="text-rose-400" bg="bg-rose-600/10" />
                        </div>
                    </div>

                    <motion.div 
                        variants={itemVariants}
                        className="w-full xl:w-[450px] bg-white/5 backdrop-blur-3xl p-12 sm:p-16 rounded-[4rem] border border-white/10 shadow-2xl text-center flex flex-col items-center justify-center space-y-10 relative overflow-hidden group/velocity"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-[0.05] rotate-12 group-hover/velocity:rotate-45 transition-transform duration-1000 pointer-events-none text-indigo-400">
                            <TrendingUp size={200} />
                        </div>
                        <p className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.5em] relative z-10">Integration Velocity</p>
                        <div className="relative w-56 h-56 relative z-10">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-foreground/5" />
                                <motion.circle
                                    initial={{ strokeDashoffset: 628 }}
                                    animate={{ strokeDashoffset: 628 - (628 * progress) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    cx="112" cy="112" r="100"
                                    stroke="currentColor" strokeWidth="20" fill="transparent"
                                    className="text-indigo-500"
                                    strokeDasharray={628}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-black text-foreground tracking-tighter">{progress}%</span>
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2">Operational</span>
                            </div>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <p className="text-base font-black text-foreground uppercase tracking-widest">{tasks.length} Atomic Work Units</p>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-backgroundmerald-400 animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                                <p className="text-[10px] font-black text-emerald-400 tracking-[0.3em] uppercase">Deployment Healthy</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Navigation Tabs Protocol */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex bg-white p-3 rounded-[3rem] border border-slate-100 w-full lg:w-auto overflow-x-auto no-scrollbar shadow-xl">
                    <TabButton active={activeTab === 'BOARD'} onClick={() => setActiveTab('BOARD')} icon={LayoutGrid} label="Kanban Matrix" />
                    <TabButton active={activeTab === 'TASKS'} onClick={() => setActiveTab('TASKS')} icon={List} label="Work Breakdown" />
                    <TabButton active={activeTab === 'TEAM'} onClick={() => setActiveTab('TEAM')} icon={Users} label="Personnel" />
                </div>

                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="h-20 px-12 bg-slate-950 text-foreground rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 shrink-0 group/deploy"
                >
                    <Plus size={28} className="group-hover/deploy:rotate-90 transition-transform duration-500" /> 
                    Deploy Work Unit
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[800px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                    >
                        {activeTab === 'BOARD' && <KanbanView tasksByStatus={tasksByStatus} />}
                        {activeTab === 'TASKS' && <ListView tasks={tasks} />}
                        {activeTab === 'TEAM' && <TeamView manager={project.manager} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onAdd={(newTask) => setTasks([newTask, ...tasks])}
                projects={MOCK_PROJECTS}
            />

            {/* Neural System Index */}
            <div className="py-20 flex flex-col items-center gap-10">
                <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "94%" }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-rose-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                    />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em] animate-pulse">Neural Synchronization Score: 0.9998 // Secured Layer</p>
            </div>
        </motion.div>
    );
};

const StatBadge = ({ icon: Icon, label, value, color, bg }) => (
    <div className="flex items-center gap-6 px-10 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] hover:bg-white/10 hover:border-white/20 transition-all group/stat cursor-default">
        <div className={`p-4 ${bg} ${color} rounded-2xl group-hover/stat:rotate-12 transition-transform shadow-2xl shadow-black/20`}>
            <Icon size={28} />
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em] mb-2">{label}</span>
            <span className="text-xl font-black text-foreground tracking-tight leading-none group-hover/stat:text-indigo-400 transition-colors uppercase tracking-widest">{value}</span>
        </div>
    </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex items-center gap-4 px-10 py-5 rounded-[2.5rem] text-[11px] font-black transition-all whitespace-nowrap uppercase tracking-[0.3em] ${active
            ? "bg-slate-950 text-foreground shadow-2xl shadow-slate-950/20 translate-y-[-4px]"
            : "text-muted-foreground hover:text-slate-950"
            }`}
    >
        <Icon size={20} />
        {label}
    </motion.button>
);

const KanbanView = ({ tasksByStatus }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <div key={status} className="flex flex-col gap-10">
                <div className="flex items-center justify-between px-8">
                    <div className="flex items-center gap-6">
                        <div className={`w-4 h-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)] ${status === 'TODO' ? 'bg-slate-300' :
                            status === 'IN_PROGRESS' ? 'bg-indigo-500 animate-pulse-glow shadow-[0_0_15px_rgba(79,70,229,0.4)]' :
                                'bg-backgroundmerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                            }`}></div>
                        <h3 className="font-black text-muted-foreground text-[11px] uppercase tracking-[0.4em]">
                            {status.replace('_', ' ')}
                        </h3>
                    </div>
                    <div className="bg-slate-100 text-slate-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-inner">
                        {tasks.length} ID UNits
                    </div>
                </div>

                <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-100 space-y-8 min-h-[900px] shadow-inner group/column hover:bg-slate-100/50 transition-all duration-700 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                    
                    <AnimatePresence mode="popLayout">
                        {tasks.map((task, i) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, type: 'spring' }}
                            >
                                <Card className="p-10 hover:shadow-[0_45px_100px_rgba(0,0,0,0.1)] hover:border-indigo-500 hover:-translate-y-3 transition-all duration-700 cursor-pointer bg-white border border-slate-100 rounded-[3rem] group/card relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-xl ${task.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                            }`}>
                                            {task.priority || 'REGULAR'} P-LVL
                                        </div>
                                        <button className="text-slate-300 hover:text-indigo-600 transition-all bg-slate-50 p-2.5 rounded-2xl border border-slate-100 hover:bg-indigo-50 active:scale-90">
                                            <MoreHorizontal size={22} />
                                        </button>
                                    </div>

                                    <h4 className="font-black text-slate-950 text-2xl leading-[0.9] uppercase tracking-tighter group-hover/card:text-indigo-600 transition-colors mb-6">
                                        {task.title}
                                    </h4>
                                    
                                    <p className="text-muted-foreground text-sm font-black uppercase tracking-widest line-clamp-2 leading-relaxed mb-10 border-l-4 border-slate-50 pl-6 group-hover/card:border-indigo-200 transition-all">
                                        System optimization for mission node {task.id.slice(0, 4)} synchronicity and deployment.
                                    </p>

                                    <div className="flex items-center gap-6 mt-10 pt-10 border-t border-slate-50 group-hover/card:border-indigo-50">
                                        <div className="flex -space-x-4">
                                            <div className="w-12 h-12 rounded-[1.25rem] bg-slate-950 text-foreground border-4 border-white flex items-center justify-center text-[12px] font-black uppercase shadow-2xl group-hover/card:bg-indigo-600 group-hover/card:scale-115 transition-all">
                                                {task.assignee?.charAt(0) || 'U'}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-auto bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 group-hover/card:bg-indigo-600 group-hover/card:text-foreground transition-all">
                                            <Clock size={16} className="text-indigo-500 group-hover/card:text-foreground" />
                                            {task.dueDate}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 p-8 opacity-0 group-hover/card:opacity-10 transition-opacity pointer-events-none group-hover/card:rotate-12 duration-700">
                                        <Target size={100} className="text-indigo-600" />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <button className="w-full py-10 border-4 border-dashed border-slate-200 rounded-[3rem] text-slate-300 text-xs font-black uppercase tracking-[0.5em] hover:bg-white hover:border-indigo-400 hover:text-indigo-600 hover:shadow-2xl transition-all duration-700 flex items-center justify-center gap-6 active:scale-95 group/add">
                        <Plus size={32} className="group-hover/add:rotate-90 transition-transform duration-700" /> 
                        DEPLOY NEW NODE
                    </button>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
                </div>
            </div>
        ))}
    </div>
);

const ListView = ({ tasks }) => (
    <Card className="overflow-hidden border-none shadow-[0_45px_100px_rgba(0,0,0,0.1)] rounded-[4rem] bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-950 text-foreground border-b border-white/5">
                        <th className="px-12 py-10 text-[11px] font-black uppercase tracking-[0.5em] first:rounded-tl-[4rem]">Work Cycle Identity</th>
                        <th className="px-12 py-10 text-[11px] font-black uppercase tracking-[0.5em] text-center">Lifecycle Status</th>
                        <th className="px-12 py-10 text-[11px] font-black uppercase tracking-[0.5em] text-center">Urgency Vector</th>
                        <th className="px-12 py-10 text-[11px] font-black uppercase tracking-[0.5em] text-center last:rounded-tr-[4rem]">Target Window</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {tasks.map((task, i) => (
                        <tr key={task.id} className="hover:bg-indigo-50/50 transition-all cursor-pointer group">
                            <td className="px-12 py-10">
                                <div className="flex items-center gap-8">
                                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shadow-2xl ${task.status === 'Done' ? 'bg-backgroundmerald-50 text-emerald-500 border border-emerald-100' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-600 group-hover:text-foreground border border-slate-100 group-hover:rotate-12'}`}>
                                        {task.status === 'Done' ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                                    </div>
                                    <div>
                                        <h4 className={`font-black uppercase tracking-tighter text-2xl leading-none mb-3 transition-colors duration-700 ${task.status === 'Done' ? 'text-slate-300' : 'text-slate-950 group-hover:text-indigo-600'}`}>{task.title}</h4>
                                        <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors" />
                                            NODE_ID: {task.id.slice(0, 4)}..._VECTOR_HASH
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-12 py-10 text-center">
                                <span className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border shadow-xl transition-all duration-700 ${task.status === 'Done' ? 'bg-backgroundmerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-indigo-600 border-indigo-50 group-hover:bg-indigo-600 group-hover:text-foreground group-hover:border-indigo-600'}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="px-12 py-10 text-center">
                                <span className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all duration-700 shadow-sm ${task.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-muted-foreground border-slate-100 group-hover:bg-slate-950 group-hover:text-foreground group-hover:border-slate-950'}`}>
                                    {task.priority || 'REGULAR'} P-LVL
                                </span>
                            </td>
                            <td className="px-12 py-10 text-center font-black text-slate-950 text-xl tracking-tighter group-hover:text-indigo-600 transition-colors">
                                {task.dueDate}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const TeamView = ({ manager }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        <Card className="p-12 border-indigo-200 bg-indigo-50 lg:col-span-2 xl:col-span-1 relative overflow-hidden group/team cursor-default rounded-[4rem] shadow-2xl hover:shadow-[0_45px_100px_rgba(0,0,0,0.1)] transition-all duration-700">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/team:rotate-12 transition-transform duration-1000 pointer-events-none text-indigo-600">
                <Shield size={200} />
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10 relative z-10 text-center sm:text-left">
                <div className="relative">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-slate-950 text-foreground flex items-center justify-center text-5xl font-black shadow-[0_30px_60px_rgba(0,0,0,0.3)] group-hover/team:scale-110 group-hover/team:bg-indigo-600 transition-all duration-700 relative z-10 border-4 border-white/20">
                        {manager.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-[1.5rem] bg-indigo-500 text-foreground flex items-center justify-center border-4 border-indigo-50 shadow-2xl z-20 animate-pulse">
                        <Zap size={24} />
                    </div>
                </div>
                <div className="min-w-0 flex-1 space-y-4">
                    <h3 className="font-black text-slate-950 text-4xl uppercase tracking-tighter leading-none mb-4 truncate drop-shadow-sm">{manager.name}</h3>
                    <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/50 backdrop-blur-xl text-indigo-600 text-[11px] font-black uppercase tracking-[0.4em] rounded-full border border-indigo-100 shadow-sm">
                        Mission Architect
                    </div>
                </div>
            </div>
            <div className="mt-14 pt-10 border-t border-indigo-200/50 flex justify-between items-end relative z-10">
                <div className="space-y-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">Resource Load Score</span>
                    <p className="text-4xl font-black text-slate-950 tracking-tighter">88.4%</p>
                </div>
                <button className="w-18 h-18 bg-white text-muted-foreground hover:text-indigo-600 rounded-2xl border border-indigo-100 hover:border-indigo-500 transition-all shadow-xl active:scale-90 flex items-center justify-center">
                    <Edit2 size={24} />
                </button>
            </div>
        </Card>

        {/* Stakeholder Pool */}
        {['Indu', 'Rahul', 'Prithvi', 'Aditi'].map((name, i) => (
            <Card key={i} className="p-12 hover:shadow-[0_45px_100px_rgba(0,0,0,0.1)] hover:border-indigo-500 hover:-translate-y-4 transition-all duration-700 cursor-default group/stakeholder rounded-[4rem] border border-slate-100 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover/stakeholder:opacity-100 transition-opacity duration-700" />
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 group-hover/stakeholder:rotate-0 transition-transform duration-1000 pointer-events-none text-indigo-400">
                    <Globe size={120} />
                </div>
                <div className="flex flex-col items-center gap-8 relative z-10">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-slate-50 text-muted-foreground flex items-center justify-center text-4xl font-black border border-slate-100 shadow-inner group-hover/stakeholder:bg-slate-950 group-hover/stakeholder:text-foreground group-hover/stakeholder:scale-110 transition-all duration-700 relative">
                        {name.charAt(0)}
                        <div className="absolute inset-0 bg-indigo-500/10 blur-2xl opacity-0 group-hover/stakeholder:opacity-60 transition-opacity" />
                    </div>
                    <div className="text-center space-y-4">
                        <h3 className="font-black text-slate-950 text-3xl uppercase tracking-tighter leading-none group-hover/stakeholder:text-indigo-600 transition-colors">{name}</h3>
                        <div className="px-6 py-2 bg-slate-50 text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-slate-100 group-hover/stakeholder:bg-indigo-600 group-hover/stakeholder:text-foreground group-hover/stakeholder:border-indigo-600 transition-all duration-500 shadow-sm">
                            Work Node
                        </div>
                    </div>
                    <div className="w-full mt-8 pt-8 border-t border-slate-50 flex justify-between items-center group-hover/stakeholder:border-indigo-50">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Active Units</span>
                            <p className="text-2xl font-black text-slate-950 tracking-tighter">{Math.floor(Math.random() * 5) + 1} Missions</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-300 group-hover/stakeholder:bg-indigo-50 group-hover/stakeholder:text-indigo-600 flex items-center justify-center transition-all">
                            <ArrowUpRight size={24} />
                        </div>
                    </div>
                </div>
            </Card>
        ))}
    </div>
);

export default ProjectDetailsPage;
