import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/CardLegacy';
import { Calendar, ChevronDown, ChevronRight, ChevronUp, Plus } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import QuickAddTaskModal from './QuickAddTaskModal';

const ReportsGantt = () => {
    // Mock Data for Gantt
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: 'Q1 Annual Review',
            start: '2026-02-01',
            end: '2026-02-15',
            status: 'completed',
            type: 'project',
            tasks: [
                { id: 11, name: 'Data Collection', start: '2026-02-01', end: '2026-02-05', status: 'completed', type: 'task' },
                { id: 12, name: 'Analysis', start: '2026-02-06', end: '2026-02-10', status: 'completed', type: 'task' },
                { id: 13, name: 'Report Drafting', start: '2026-02-11', end: '2026-02-15', status: 'completed', type: 'task' }
            ]
        },
        {
            id: 2,
            name: 'Website Redesign',
            start: '2026-02-10',
            end: '2026-03-05',
            status: 'ongoing',
            type: 'project',
            tasks: [
                { id: 21, name: 'Wireframing', start: '2026-02-10', end: '2026-02-15', status: 'completed', type: 'task' },
                { id: 22, name: 'UI Development', start: '2026-02-16', end: '2026-02-28', status: 'ongoing', type: 'task' },
                { id: 23, name: 'Backend Integration', start: '2026-03-01', end: '2026-03-05', status: 'pending', type: 'task' }
            ]
        },
        {
            id: 3,
            name: 'Staff Training',
            start: '2026-02-20',
            end: '2026-03-01',
            status: 'pending',
            type: 'project',
            tasks: []
        },
    ]);

    const [expandedProjects, setExpandedProjects] = useState([1, 2]); // Default expanded
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleProject = (projectId) => {
        setExpandedProjects(prev =>
            prev.includes(projectId)
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        );
    };

    const handleAddTask = (taskData) => {
        setProjects(prevProjects => {
            return prevProjects.map(p => {
                if (p.id === taskData.projectId) {
                    return {
                        ...p,
                        tasks: [...(p.tasks || []), taskData]
                    };
                }
                return p;
            });
        });
        // Auto expand if adding to a project
        if (!expandedProjects.includes(taskData.projectId)) {
            setExpandedProjects([...expandedProjects, taskData.projectId]);
        }
    };

    const today = new Date('2026-02-09'); // Using mocked date for consistency
    const startDate = startOfWeek(today);
    const daysToShow = 21; // Three weeks view
    const dates = Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i));

    const getPosition = (start, end) => {
        const startD = new Date(start);
        const endD = new Date(end);

        let startDiff = Math.ceil((startD - startDate) / (1000 * 60 * 60 * 24));
        let duration = Math.ceil((endD - startD) / (1000 * 60 * 60 * 24)) + 1;

        if (startDiff < 0) {
            duration += startDiff; // Adjust duration for cut-off start
            startDiff = 0;
        }

        if (duration <= 0) return null; // Out of view

        return {
            left: `${(startDiff / daysToShow) * 100}%`,
            width: `${(duration / daysToShow) * 100}%`
        };
    };

    const GanttRow = ({ item, isTask = false }) => {
        const pos = getPosition(item.start, item.end);

        return (
            <div className={`flex group hover:bg-slate-50 transition-colors ${isTask ? 'bg-white' : 'bg-white'}`}>
                <div className={`w-72 p-4 text-[11px] flex items-center gap-3 border-r border-slate-100 sticky left-0 z-10 truncate ${isTask ? 'pl-10 text-muted-foreground bg-white group-hover:bg-slate-50' : 'font-black text-slate-900 bg-white group-hover:bg-slate-50 uppercase tracking-tighter'}`}>
                    {!isTask && (
                        <button onClick={() => toggleProject(item.id)} className="text-slate-300 hover:text-blue-600 transition-colors active:scale-90">
                            {expandedProjects.includes(item.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    )}
                    {isTask && <div className="w-4 border-l border-slate-100 h-full -ml-4 mr-2" />}
                    <span className="truncate">{item.name}</span>
                </div>
                <div className="flex-1 relative h-14">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                        {dates.map((_, i) => (
                            <div key={i} className={`flex-1 border-r border-slate-50 ${isSameDay(dates[i], today) ? 'bg-backgroundlue-50/20' : ''}`}></div>
                        ))}
                    </div>

                    {/* Bar */}
                    {pos && (
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            className={`absolute top-3.5 h-7 rounded-xl shadow-sm transition-all hover:scale-y-110 cursor-pointer origin-left flex items-center px-3
                            ${item.status === 'completed' ? 'bg-backgroundmerald-600 shadow-emerald-600/10' :
                                     item.status === 'ongoing' ? 'bg-backgroundlue-600 shadow-blue-600/10' : 'bg-slate-200'}
                            ${isTask ? 'h-5 top-4.5 opacity-80' : ''}`}
                            style={{ left: pos.left, width: pos.width }}
                            title={`${item.name}: ${item.start} - ${item.end}`}
                        >
                            <span className="text-[8px] font-black uppercase text-foreground truncate drop-shadow-sm">{item.name}</span>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Card className="p-10 sm:p-12 bg-white border border-slate-100 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tighter">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        Project Timeline Vector
                    </h2>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-12">Visualize project scopes and task dependencies across the timeline.</p>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-backgroundmerald-600"></span> Executed</span>
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-backgroundlue-600"></span> Active</span>
                        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Backlog</span>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 h-14 px-8 bg-backgroundackground text-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-backgroundlack transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        <Plus size={18} />
                        Inject Task Unit
                    </button>
                </div>
            </div>

            <div className="relative border border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-inner">
                <div className="overflow-x-auto no-scrollbar">
                    <div className="min-w-[1200px]">
                        {/* Header */}
                        <div className="flex border-b border-slate-100 bg-slate-50 sticky top-0 z-30">
                            <div className="w-72 p-5 font-black text-[10px] text-muted-foreground uppercase tracking-widest border-r border-slate-100 sticky left-0 bg-slate-50 z-20">Deployment Cluster / Node</div>
                            <div className="flex-1 flex">
                                {dates.map((date, i) => (
                                    <div key={i} className={`flex-1 min-w-[3.5rem] text-center py-4 border-r border-slate-100/50 ${isSameDay(date, today) ? 'bg-backgroundlue-600 text-foreground shadow-xl' : 'text-muted-foreground'}`}>
                                        <span className="text-xs font-black block leading-none">{format(date, 'dd')}</span>
                                        <span className={`text-[8px] font-black uppercase tracking-wider mt-1 block opacity-60 ${isSameDay(date, today) ? 'text-foreground' : ''}`}>{format(date, 'EEE')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="divide-y divide-slate-50">
                            {projects.map((project) => (
                                <div key={project.id}>
                                    <GanttRow item={project} />
                                    {expandedProjects.includes(project.id) && project.tasks && project.tasks.map(task => (
                                        <GanttRow key={task.id} item={task} isTask={true} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 flex justify-end">
                <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-3 uppercase tracking-widest group bg-backgroundlue-50 px-6 py-3 rounded-xl border border-blue-100 transition-all active:scale-95">
                    View Full Roadmap Protocol <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <QuickAddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddTask}
                projects={projects}
            />
        </Card>
    );
};


export default ReportsGantt;
