// @ts-nocheck
import { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Switch } from '../../../components/ui/switch';
import { useTimeTracking } from '../../../hooks/useTimeTracking';

export function ManualEntryModal({ isOpen, onClose, tasks = [], existingEntry, onSuccess }) {
    const { createEntry, updateEntry, loading } = useTimeTracking();

    const [formData, setFormData] = useState({
        taskId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        duration: 60,
        description: '',
        billable: true,
        useDuration: false
    });

    useEffect(() => {
        if (existingEntry) {
            setFormData({
                taskId: existingEntry.taskId || '',
                date: new Date(existingEntry.startTime).toISOString().split('T')[0],
                startTime: new Date(existingEntry.startTime).toTimeString().slice(0, 5),
                endTime: existingEntry.endTime ? new Date(existingEntry.endTime).toTimeString().slice(0, 5) : '10:00',
                duration: existingEntry.duration || 60,
                description: existingEntry.description || '',
                billable: existingEntry.billable !== false,
                useDuration: !!existingEntry.duration
            });
        } else {
            setFormData({
                taskId: '',
                date: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '10:00',
                duration: 60,
                description: '',
                billable: true,
                useDuration: false
            });
        }
    }, [existingEntry, isOpen]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const calculateDuration = () => {
        if (formData.useDuration) return formData.duration;
        
        const [startH, startM] = formData.startTime.split(':').map(Number);
        const [endH, endM] = formData.endTime.split(':').map(Number);
        
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        
        return Math.max(0, endMinutes - startMinutes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.taskId) return;

        const startTime = new Date(`${formData.date}T${formData.startTime}`);
        const endTime = formData.useDuration 
            ? undefined 
            : new Date(`${formData.date}T${formData.endTime}`);

        try {
            if (existingEntry) {
                await updateEntry(existingEntry.id, {
                    taskId: formData.taskId,
                    description: formData.description,
                    startTime: startTime.toISOString(),
                    endTime: endTime?.toISOString(),
                    duration: calculateDuration(),
                    billable: formData.billable
                });
            } else {
                await createEntry({
                    taskId: formData.taskId,
                    description: formData.description,
                    startTime: startTime.toISOString(),
                    endTime: endTime?.toISOString(),
                    duration: calculateDuration(),
                    billable: formData.billable
                });
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Failed to save entry:', err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#18181b] border border-white/10 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {existingEntry ? 'Edit Time Entry' : 'Add Manual Entry'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block">
                            Task
                        </label>
                        <select
                            value={formData.taskId}
                            onChange={(e) => handleChange('taskId', e.target.value)}
                            required
                            className="w-full bg-[#1a1d24] border border-white/10 rounded-xl px-3 py-2.5 text-foreground text-sm focus:border-[#ef4444] focus:outline-none"
                        >
                            <option value="">Select a task...</option>
                            {tasks.map(task => (
                                <option key={task.id} value={task.id}>
                                    {task.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block">
                            Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                                required
                                className="pl-10 bg-[#1a1d24] border-white/10 text-foreground"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block">
                            Time Mode
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => handleChange('useDuration', false)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                                    !formData.useDuration 
                                        ? 'bg-[#ef4444]/20 text-[#ef4444]' 
                                        : 'bg-white/5 text-foreground/60'
                                }`}
                            >
                                Start/End
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChange('useDuration', true)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                                    formData.useDuration 
                                        ? 'bg-[#ef4444]/20 text-[#ef4444]' 
                                        : 'bg-white/5 text-foreground/60'
                                }`}
                            >
                                Duration
                            </button>
                        </div>
                    </div>

                    {formData.useDuration ? (
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block">
                                Duration (minutes)
                            </label>
                            <Input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                                min={1}
                                className="bg-[#1a1d24] border-white/10 text-foreground"
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block">
                                    Start
                                </label>
                                <Input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => handleChange('startTime', e.target.value)}
                                    className="bg-[#1a1d24] border-white/10 text-foreground"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block">
                                    End
                                </label>
                                <Input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => handleChange('endTime', e.target.value)}
                                    className="bg-[#1a1d24] border-white/10 text-foreground"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2 block">
                            Description
                        </label>
                        <Input
                            type="text"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="What did you work on?"
                            className="bg-[#1a1d24] border-white/10 text-foreground"
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#1a1d24] rounded-xl">
                        <div className="flex items-center gap-2">
                            <DollarSign className={`w-4 h-4 ${formData.billable ? 'text-red-400' : 'text-foreground/40'}`} />
                            <span className="text-foreground text-sm">Billable</span>
                        </div>
                        <Switch
                            checked={formData.billable}
                            onCheckedChange={(checked) => handleChange('billable', checked)}
                        />
                    </div>

                    <div className="text-center text-foreground/40 text-sm">
                        Duration: {calculateDuration()} minutes
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 border-white/10 text-foreground hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.taskId}
                            className="flex-1 bg-[#ef4444] hover:bg-[#ef4444]/90 text-black font-bold"
                        >
                            {loading ? 'Saving...' : existingEntry ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ManualEntryModal;