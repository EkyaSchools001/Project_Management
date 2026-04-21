// @ts-nocheck
import { useState, useEffect } from 'react';
import { Plus, Clock, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';
import TimerWidget from '../components/TimerWidget';
import TimeEntryList from '../components/TimeEntryList';
import TimeReport from '../components/TimeReport';
import ManualEntryModal from '../components/ManualEntryModal';
import { useTimeTracking } from '../../../hooks/useTimeTracking';
import taskService from '../../../services/task.service';

export function TimeTrackingPage() {
    const { getReport, formatDuration } = useTimeTracking();

    const [tasks, setTasks] = useState([]);
    const [showManualModal, setShowManualModal] = useState(false);
    const [todaySummary, setTodaySummary] = useState(null);
    const [weeklySummary, setWeeklySummary] = useState(null);
    const [activeView, setActiveView] = useState('entries');

    useEffect(() => {
        loadTasks();
        loadSummaries();
    }, []);

    const loadTasks = async () => {
        try {
            const allTasks = await taskService.getTasks({ status: 'InProgress' });
            setTasks(allTasks.data || []);
        } catch (err) {
            console.error('Failed to load tasks:', err);
        }
    };

    const loadSummaries = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekStartStr = weekStart.toISOString().split('T')[0];

            const [todayData, weeklyData] = await Promise.all([
                getReport(null, { startDate: today, endDate: today }),
                getReport(null, { startDate: weekStartStr, endDate: today })
            ]);

            setTodaySummary(todayData);
            setWeeklySummary(weeklyData);
        } catch (err) {
            console.error('Failed to load summaries:', err);
        }
    };

    const summaryCards = [
        {
            title: 'Today',
            hours: todaySummary?.totalHours || 0,
            icon: Clock,
            color: 'text-[#BAFF00]',
            bgColor: 'bg-[#BAFF00]/10'
        },
        {
            title: 'This Week',
            hours: weeklySummary?.totalHours || 0,
            icon: Calendar,
            color: 'text-blue-400',
            bgColor: 'bg-backgroundlue-500/10'
        },
        {
            title: 'Billable',
            hours: weeklySummary?.billableHours || 0,
            icon: BarChart3,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10'
        }
    ];

    return (
        <div className="min-h-screen bg-[#18181b] p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-foreground">Time Tracking</h1>
                        <p className="text-foreground/40 mt-1">Track your time on tasks</p>
                    </div>
                    <Button
                        onClick={() => setShowManualModal(true)}
                        className="bg-[#BAFF00] hover:bg-[#BAFF00]/90 text-black font-bold"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Manual Entry
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {summaryCards.map((card, idx) => (
                        <Card key={idx} className="bg-[#18181b] border-white/5">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-foreground/40">
                                            {card.title}
                                        </p>
                                        <p className={cn("text-3xl font-black mt-1", card.color)}>
                                            {card.hours}h
                                        </p>
                                    </div>
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", card.bgColor)}>
                                        <card.icon className={cn("w-6 h-6", card.color)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex items-center gap-2 border-b border-white/10">
                    <button
                        onClick={() => setActiveView('entries')}
                        className={cn(
                            "px-4 py-3 text-sm font-bold border-b-2 transition-colors",
                            activeView === 'entries'
                                ? "border-[#BAFF00] text-[#BAFF00]"
                                : "border-transparent text-foreground/40 hover:text-foreground"
                        )}
                    >
                        Today's Entries
                    </button>
                    <button
                        onClick={() => setActiveView('report')}
                        className={cn(
                            "px-4 py-3 text-sm font-bold border-b-2 transition-colors",
                            activeView === 'report'
                                ? "border-[#BAFF00] text-[#BAFF00]"
                                : "border-transparent text-foreground/40 hover:text-foreground"
                        )}
                    >
                        Report
                    </button>
                </div>

                {activeView === 'entries' && (
                    <TimeEntryList />
                )}

                {activeView === 'report' && (
                    <TimeReport />
                )}

                <TimerWidget tasks={tasks} />
            </div>

            <ManualEntryModal
                isOpen={showManualModal}
                onClose={() => setShowManualModal(false)}
                tasks={tasks}
                onSuccess={() => {
                    loadSummaries();
                }}
            />
        </div>
    );
}

export default TimeTrackingPage;