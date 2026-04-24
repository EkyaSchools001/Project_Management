import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    SlidersHorizontal,
    Calendar as CalendarIcon,
    Check,
    Search,
    Clock,
    Zap,
    Target,
    Activity,
    ArrowUpRight,
    Sparkles,
    Globe,
    Cpu,
    Workflow,
    Box,
    Layers,
    Shield
} from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    addDays,
    isToday
} from 'date-fns';
import { Card } from '../../../components/ui/CardLegacy';
import ScheduleMeetingModal from '../components/ScheduleMeetingModal';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('Month');
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        task: true,
        meeting: true,
        reminder: true
    });
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [events, setEvents] = useState({
        [format(addDays(new Date(), 2), 'yyyy-MM-dd')]: { title: 'NODE SYNC', type: 'task', color: 'from-red-400 to-rose-600 shadow-red-500/20' },
        [format(addDays(new Date(), 5), 'yyyy-MM-dd')]: { title: 'ORBITAL REVIEW', type: 'meeting', color: 'from-rose-400 to-rose-600 shadow-rose-500/20' },
        [format(addDays(new Date(), 10), 'yyyy-MM-dd')]: { title: 'CORE MATRIX', type: 'task', color: 'from-rose-400 to-rose-600 shadow-rose-500/20' },
        [format(addDays(new Date(), 15), 'yyyy-MM-dd')]: { title: 'UPLINK ESTABLISHED', type: 'reminder', color: 'from-amber-400 to-amber-600 shadow-amber-500/20' }
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    const days = eachDayOfInterval({ 
        start: startOfWeek(startOfMonth(currentDate)), 
        end: endOfWeek(endOfMonth(currentDate)) 
    });

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1800px] mx-auto space-y-16 p-6 sm:p-10 lg:p-16 pb-40 relative overflow-hidden"
        >
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-40 left-0 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px] -z-10" />

            {/* Vibrant Mission Matrix Header */}
            <header className="relative overflow-hidden p-12 sm:p-20 bg-slate-950 rounded-[4rem] sm:rounded-[5rem] text-foreground shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/30 via-transparent to-rose-600/10" />
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-500 rounded-full blur-[120px] opacity-20 animate-pulse pointer-events-none" />
                
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 relative z-10">
                    <div className="space-y-8 max-w-3xl">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.5em] backdrop-blur-3xl">
                            <Clock size={14} className="text-red-400" />
                            Temporal Synchronization Protocol: Active
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl sm:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-4">
                            Temporal <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-rose-400 animate-gradient-shift">Matrix</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-foreground/40 font-black text-xs sm:text-sm uppercase tracking-[0.4em] flex items-center gap-4 border-l-4 border-white/10 pl-6">
                            <Activity size={18} className="text-amber-400" />
                            Mission Flow Real-time Visualization // Layer 0
                        </motion.p>
                    </div>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto pb-4">
                        <div className="flex bg-white/5 p-2 rounded-3xl border border-white/10 backdrop-blur-3xl">
                            <NavButton onClick={() => setCurrentDate(subMonths(currentDate, 1))} icon={ChevronLeft} />
                            <button 
                                onClick={() => setCurrentDate(new Date())}
                                className="px-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground transition-colors"
                            >
                                Synchronize
                            </button>
                            <NavButton onClick={() => setCurrentDate(addMonths(currentDate, 1))} icon={ChevronRight} />
                        </div>
                        <button 
                            onClick={() => setShowScheduleModal(true)}
                            className="h-20 px-12 bg-white text-slate-950 font-black rounded-3xl text-xs uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-rose-600 hover:text-foreground hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 group/deploy"
                        >
                            <Plus size={28} className="group-hover/deploy:rotate-90 transition-transform duration-500" />
                            Deploy Node
                        </button>
                    </motion.div>
                </div>
            </header>

            {/* Matrix View Toolbar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 sm:px-4">
                <div className="flex items-center gap-8 px-8 py-4 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tighter">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <div className="h-8 w-[2px] bg-slate-100 mx-2" />
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Network Operational</span>
                    </div>
                </div>

                <div className="flex bg-white p-3 rounded-[3.5rem] border border-slate-100 shadow-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
                    {['Month', 'Week', 'Day', 'List'].map((v) => (
                        <TabButton 
                            key={v}
                            active={view === v} 
                            onClick={() => setView(v)} 
                            label={v} 
                        />
                    ))}
                </div>
            </div>

            {/* Matrix Grid Canvas */}
            <motion.div
                variants={itemVariants}
                className="bg-white border border-slate-100 rounded-[4rem] sm:rounded-[5rem] shadow-[0_60px_120px_rgba(0,0,0,0.04)] overflow-hidden relative group/canvas"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/2 via-transparent to-rose-500/2" />
                
                {/* Week Column Labels */}
                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 relative z-10">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                        <div key={day} className="py-8 text-center border-r border-slate-100 last:border-r-0">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">{day}</span>
                        </div>
                    ))}
                </div>

                {/* Computational Matrix Grid */}
                <div className="grid grid-cols-7 border-slate-100 relative z-10">
                    {days.map((day, i) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const event = events[dateKey];
                        const isTodayDate = isToday(day);

                        return (
                            <motion.div
                                key={i}
                                whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.02)" }}
                                onClick={() => { setSelectedDate(day); setShowScheduleModal(true); }}
                                className={`min-h-[160px] sm:min-h-[200px] p-6 border-b border-r border-slate-100 last:border-r-0 relative transition-all duration-500 flex flex-col group cursor-crosshair overflow-hidden ${!isCurrentMonth ? 'opacity-20 grayscale' : ''}`}
                            >
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight size={16} className="text-rose-400" />
                                </div>

                                <div className="flex justify-start mb-6">
                                    <span className={`text-sm font-black w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-700 ${isTodayDate ? 'bg-rose-600 text-foreground shadow-2xl shadow-rose-600/40 scale-115 rotate-12' : 'text-slate-900 group-hover:scale-125 group-hover:text-rose-600'}`}>
                                        {format(day, 'd')}
                                    </span>
                                </div>

                                <div className="space-y-3 flex flex-col items-stretch relative z-10">
                                    {event && (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10, scale: 0.9 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            className={`
                                                bg-gradient-to-r ${event.color} text-foreground text-[9px] font-black uppercase tracking-[0.2em]
                                                px-5 py-3 rounded-2xl shadow-2xl transition-all group-hover:scale-105 active:scale-95
                                                truncate drop-shadow-2xl border border-white/20 backdrop-blur-xl flex items-center gap-3
                                            `}
                                        >
                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-glow shadow-white/50" />
                                            {event.title}
                                        </motion.div>
                                    )}
                                </div>
                                
                                {isTodayDate && (
                                    <div className="absolute inset-0 bg-rose-600/5 pointer-events-none" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Matrix Maintenance Footer */}
            <div className="py-20 flex flex-col items-center gap-10">
                <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="h-full w-20 bg-rose-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
                    />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[1em] animate-pulse">Neural Chronometer Operational // No Latency Detected</p>
            </div>

            <ScheduleMeetingModal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                onSuccess={(newMeeting) => {
                    if (newMeeting && newMeeting.startTime) {
                        const dateKey = newMeeting.startTime.split('T')[0];
                        setEvents(prev => ({
                            ...prev,
                            [dateKey]: {
                                title: newMeeting.title.toUpperCase(),
                                type: 'meeting',
                                color: 'from-rose-400 to-rose-600 shadow-rose-500/20'
                            }
                        }));
                    }
                    setShowScheduleModal(false);
                }}
                initialDate={selectedDate}
            />
        </motion.div>
    );
};

const NavButton = ({ onClick, icon: Icon }) => (
    <button 
        onClick={onClick}
        className="w-14 h-14 flex items-center justify-center hover:bg-white/10 rounded-2xl text-foreground/40 hover:text-foreground transition-all active:scale-75"
    >
        <Icon size={24} />
    </button>
);

const TabButton = ({ active, onClick, label }) => (
    <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`px-12 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap flex items-center gap-5 ${active
            ? 'bg-slate-950 text-foreground shadow-2xl scale-105 active:scale-95 translate-y-[-4px]'
            : 'text-muted-foreground hover:text-slate-950'
            }`}
    >
        {label}
        {active && <div className="w-2 h-2 rounded-full bg-rose-400 animate-glow shadow-[0_0_10px_rgba(129,140,248,0.8)]" />}
    </motion.button>
);

export default CalendarPage;
