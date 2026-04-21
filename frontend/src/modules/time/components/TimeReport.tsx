// @ts-nocheck
import { useState, useEffect } from 'react';
import { BarChart3, Clock, DollarSign, TrendingUp, Download, Filter, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useTimeTracking } from '../../../hooks/useTimeTracking';
import { cn } from '../../../lib/utils';

export function TimeReport({ className }) {
    const { getReport, loading } = useTimeTracking();

    const [report, setReport] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [groupBy, setGroupBy] = useState('date');

    useEffect(() => {
        loadReport();
    }, [dateRange]);

    const loadReport = async () => {
        try {
            const data = await getReport(null, {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });
            setReport(data);
        } catch (err) {
            console.error('Failed to load report:', err);
        }
    };

    const handleExport = () => {
        const csv = generateCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `time-report-${dateRange.startDate}-${dateRange.endDate}.csv`;
        link.click();
    };

    const generateCSV = () => {
        if (!report?.byTask) return '';
        
        let csv = 'Date,Task,Hours\n';
        Object.entries(report.byTask).forEach(([taskId, data]) => {
            csv += `${dateRange.startDate},${data.taskTitle},${(data.minutes / 60).toFixed(2)}\n`;
        });
        return csv;
    };

    const statCards = [
        {
            title: 'Total Hours',
            value: report?.totalHours || 0,
            icon: Clock,
            color: 'text-[#BAFF00]',
            bgColor: 'bg-[#BAFF00]/10'
        },
        {
            title: 'Billable Hours',
            value: report?.billableHours || 0,
            icon: DollarSign,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10'
        },
        {
            title: 'Non-Billable Hours',
            value: report?.nonBillableHours || 0,
            icon: TrendingUp,
            color: 'text-blue-400',
            bgColor: 'bg-backgroundackgroundlue-500/10'
        },
        {
            title: 'Avg Hours/Day',
            value: report?.averageHoursPerDay || 0,
            icon: BarChart3,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10'
        }
    ];

    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Time Report</h2>
                <Button
                    onClick={handleExport}
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-foreground hover:bg-white/10"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <Card key={idx} className="bg-[#18181b] border-white/5">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-foreground/40">
                                        {stat.title}
                                    </p>
                                    <p className={cn("text-2xl font-black mt-1", stat.color)}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bgColor)}>
                                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-[#18181b] border-white/5">
                <CardHeader className="border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-foreground text-sm">Filter by Date Range</CardTitle>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-foreground/40" />
                            <Input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                className="bg-[#1a1d24] border-white/10 text-foreground text-sm w-36"
                            />
                            <span className="text-foreground/40">to</span>
                            <Input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                className="bg-[#1a1d24] border-white/10 text-foreground text-sm w-36"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-4 h-4 text-foreground/40" />
                        <span className="text-[10px] uppercase tracking-widest text-foreground/40">
                            Group By
                        </span>
                        <select
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                            className="bg-[#1a1d24] border border-white/10 rounded-lg px-3 py-1.5 text-foreground text-sm"
                        >
                            <option value="date">Date</option>
                            <option value="task">Task</option>
                            <option value="project">Project</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-[#BAFF00] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {groupBy === 'task' && report?.byTask && (
                                Object.entries(report.byTask).map(([taskId, data]) => (
                                    <div
                                        key={taskId}
                                        className="flex items-center justify-between p-3 bg-[#1a1d24] rounded-xl"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-foreground font-medium truncate">{data.taskTitle}</p>
                                            <p className="text-foreground/40 text-xs">{data.count} entries</p>
                                        </div>
                                        <div className="text-[#BAFF00] font-bold">
                                            {(data.minutes / 60).toFixed(1)}h
                                        </div>
                                    </div>
                                ))
                            )}

                            {groupBy === 'date' && report?.byDate && (
                                Object.entries(report.byDate)
                                    .sort(([a], [b]) => b.localeCompare(a))
                                    .map(([date, minutes]) => (
                                        <div
                                            key={date}
                                            className="flex items-center justify-between p-3 bg-[#1a1d24] rounded-xl"
                                        >
                                            <div className="flex-1">
                                                <p className="text-foreground font-medium">
                                                    {new Date(date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-[#BAFF00] font-bold">
                                                {(minutes / 60).toFixed(1)}h
                                            </div>
                                        </div>
                                    ))
                            )}

                            {(!report?.byTask && !report?.byDate) && (
                                <div className="text-center text-foreground/40 py-8">
                                    No data available for this period
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-[#18181b] border-white/5">
                <CardHeader className="border-b border-white/5">
                    <CardTitle className="text-foreground text-sm">Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-yellow-500/10 rounded-xl">
                            <div className="text-yellow-400 text-xs uppercase tracking-widest mb-1">
                                Pending Approval
                            </div>
                            <div className="text-2xl font-black text-yellow-400">
                                {report?.pendingCount || 0}
                            </div>
                            <div className="text-foreground/40 text-xs">entries</div>
                        </div>
                        <div className="p-4 bg-green-500/10 rounded-xl">
                            <div className="text-green-400 text-xs uppercase tracking-widest mb-1">
                                Approved
                            </div>
                            <div className="text-2xl font-black text-green-400">
                                {report?.approvedCount || 0}
                            </div>
                            <div className="text-foreground/40 text-xs">entries</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default TimeReport;