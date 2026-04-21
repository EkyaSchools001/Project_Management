// @ts-nocheck
import { useState, useEffect } from 'react';
import { Play, Pause, Square, ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useTimeTracking } from '../../../hooks/useTimeTracking';
import { cn } from '../../../lib/utils';

export function TimerWidget({ tasks = [], onTaskSelect, className }) {
    const {
        activeTimer,
        elapsed,
        startTimer,
        stopTimer,
        loading,
        formatElapsed
    } = useTimeTracking();

    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (activeTimer?.taskId) {
            setSelectedTaskId(activeTimer.taskId);
        }
    }, [activeTimer]);

    const handleStart = async () => {
        if (!selectedTaskId) return;
        try {
            await startTimer(selectedTaskId, description);
        } catch (err) {
            console.error('Failed to start timer:', err);
        }
    };

    const handleStop = async () => {
        try {
            await stopTimer();
            setDescription('');
        } catch (err) {
            console.error('Failed to stop timer:', err);
        }
    };

    const handleTaskChange = (e) => {
        const taskId = e.target.value;
        setSelectedTaskId(taskId);
        if (onTaskSelect) {
            onTaskChange(taskId);
        }
    };

    if (!isExpanded) {
        return (
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50 bg-[#18181b] border border-[#8b5cf6]/20 rounded-2xl shadow-2xl",
                    className
                )}
            >
                <div className="flex items-center gap-3 px-4 py-3">
                    {activeTimer ? (
                        <>
                            <div className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
                            <span className="text-[#8b5cf6] font-mono font-bold">
                                {formatElapsed(elapsed)}
                            </span>
                        </>
                    ) : (
                        <Clock className="w-4 h-4 text-foreground/40" />
                    )}
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <ChevronUp className="w-4 h-4 text-foreground/60" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl w-80 overflow-hidden",
                className
            )}
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8b5cf6]" />
                    <span className="text-foreground font-bold text-sm">Time Tracker</span>
                </div>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <ChevronDown className="w-4 h-4 text-foreground/40" />
                </button>
            </div>

            <div className="p-4 space-y-4">
                {!activeTimer && (
                    <>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block">
                                Select Task
                            </label>
                            <select
                                value={selectedTaskId}
                                onChange={handleTaskChange}
                                className="w-full bg-[#1a1d24] border border-white/10 rounded-xl px-3 py-2.5 text-foreground text-sm focus:border [#8b5cf6] focus:outline-none"
                            >
                                <option value="">Choose a task...</option>
                                {tasks.map(task => (
                                    <option key={task.id} value={task.id}>
                                        {task.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block">
                                Description (optional)
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What are you working on?"
                                className="w-full bg-[#1a1d24] border border-white/10 rounded-xl px-3 py-2.5 text-foreground text-sm placeholder:text-foreground/30 focus:border [#8b5cf6] focus:outline-none"
                            />
                        </div>
                    </>
                )}

                {activeTimer && (
                    <div className="bg-[#1a1d24] rounded-xl p-4">
                        <div className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">
                            Currently Tracking
                        </div>
                        <div className="text-foreground font-medium text-sm mb-2">
                            {activeTimer.task?.title || 'Task'}
                        </div>
                        {activeTimer.description && (
                            <div className="text-foreground/60 text-xs">
                                {activeTimer.description}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-center gap-3">
                    {!activeTimer ? (
                        <Button
                            onClick={handleStart}
                            disabled={!selectedTaskId || loading}
                            className="flex-1 bg-[#8b5cf6] hover:bg-[#8b5cf6]/90 text-black font-bold h-12 rounded-xl"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Start
                        </Button>
                    ) : (
                        <Button
                            onClick={handleStop}
                            disabled={loading}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-foreground font-bold h-12 rounded-xl"
                        >
                            <Square className="w-4 h-4 mr-2" />
                            Stop
                        </Button>
                    )}
                </div>

                {activeTimer && (
                    <div className="text-center">
                        <div className="text-4xl font-mono font-black text-[#8b5cf6]">
                            {formatElapsed(elapsed)}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-foreground/40 mt-1">
                            Elapsed Time
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TimerWidget;