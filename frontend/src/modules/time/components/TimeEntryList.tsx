// @ts-nocheck
import { useState, useEffect } from 'react';
import { Edit2, Trash2, Clock, Calendar, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { useTimeTracking } from '../../../hooks/useTimeTracking';
import { cn } from '../../../lib/utils';

export function TimeEntryList({ filters = {}, onEdit, onDelete, className }) {
    const {
        entries,
        loading,
        loadEntries,
        deleteEntry,
        formatDuration
    } = useTimeTracking();

    const [localFilters, setLocalFilters] = useState(filters);
    const [showFilters, setShowFilters] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadEntries(localFilters);
    }, [localFilters, loadEntries]);

    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteEntry(id);
        } catch (err) {
            console.error('Failed to delete entry:', err);
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            Running: 'bg-red-500/20 text-red-400 border-red-500/30',
            Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            Approved: 'bg-red-500/20 text-red-400 border-red-500/30',
            Rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
        
        const icons = {
            Running: <Clock className="w-3 h-3" />,
            Pending: <Clock className="w-3 h-3" />,
            Approved: <CheckCircle className="w-3 h-3" />,
            Rejected: <XCircle className="w-3 h-3" />
        };

        return (
            <Badge className={cn("flex items-center gap-1", styles[status] || styles.Pending)}>
                {icons[status]}
                {status}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalMinutes = entries.reduce((sum, e) => sum + (e.duration || 0), 0);

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Time Entries</h3>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                        showFilters ? "bg-[#ef4444]/20 text-[#ef4444]" : "bg-white/5 text-foreground/60 hover:bg-white/10"
                    )}
                >
                    <Filter className="w-3 h-3" />
                    Filters
                </button>
            </div>

            {showFilters && (
                <div className="grid grid-cols-2 gap-3 p-4 bg-[#18181b] rounded-xl border border-white/5">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 block">
                            Start Date
                        </label>
                        <Input
                            type="date"
                            value={localFilters.startDate || ''}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            className="bg-[#1a1d24] border-white/10 text-foreground"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 block">
                            End Date
                        </label>
                        <Input
                            type="date"
                            value={localFilters.endDate || ''}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            className="bg-[#1a1d24] border-white/10 text-foreground"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1 block">
                            Status
                        </label>
                        <select
                            value={localFilters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full bg-[#1a1d24] border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm"
                        >
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            )}

            <div className="bg-[#18181b] rounded-xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-foreground/60 text-sm">
                        {entries.length} entries
                    </span>
                    <span className="text-[#ef4444] font-bold">
                        {formatDuration(totalMinutes)} total
                    </span>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="w-6 h-6 border-2 border-[#ef4444] border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : entries.length === 0 ? (
                    <div className="p-8 text-center text-foreground/40">
                        No time entries found
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {entries.map((entry) => (
                            <div
                                key={entry.id}
                                className="p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-foreground font-medium truncate">
                                                {entry.task?.title || 'Task'}
                                            </span>
                                            {entry.billable === false && (
                                                <Badge className="bg-white/10 text-foreground/60 text-[10px]">
                                                    Non-billable
                                                </Badge>
                                            )}
                                        </div>
                                        {entry.description && (
                                            <p className="text-foreground/60 text-sm mb-2 truncate">
                                                {entry.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-foreground/40">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(entry.startTime)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDuration(entry.duration || 0)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(entry.status)}
                                        <button
                                            onClick={() => onEdit?.(entry)}
                                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-3.5 h-3.5 text-foreground/40" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            disabled={deletingId === entry.id}
                                            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                                        >
                                            {deletingId === entry.id ? (
                                                <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3.5 h-3.5 text-red-500/60" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TimeEntryList;