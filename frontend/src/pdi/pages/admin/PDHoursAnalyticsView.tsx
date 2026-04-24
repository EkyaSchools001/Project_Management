import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { Button } from "@pdi/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import {
    Clock,
    Users,
    CheckCircle2,
    ChevronRight,
    Download,
    Filter,
    BarChart3,
    PieChart as PieChartIcon,
    ArrowLeft,
    TrendingUp,
    MessageSquare,
    ClipboardCheck,
    Mail,
    Send,
    RefreshCw
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { toast } from "sonner";
import api from "@pdi/lib/api";
import { Skeleton } from "@pdi/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@pdi/components/ui/table";
import { Badge } from "@pdi/components/ui/badge";
import { Input } from "@pdi/components/ui/input";
import { StatCard } from "@pdi/components/StatCard";

import { CAMPUS_OPTIONS } from "@pdi/lib/constants";
import { getSocket } from "@pdi/lib/socket";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function PDHoursAnalyticsView() {
    const [loading, setLoading] = useState(true);
    const [avgHoursData, setAvgHoursData] = useState<any[]>([]);
    const [cutoffStats, setCutoffStats] = useState<any[]>([]);
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [feedbackData, setFeedbackData] = useState<any>({ events: [], globalAverage: 0 });
    const [engagementData, setEngagementData] = useState<any>({ summary: {}, teachers: [] });
    const [campusAttendanceData, setCampusAttendanceData] = useState<any[]>([]);

    const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
    const [globalSchool, setGlobalSchool] = useState<string>("all");
    const [campusTeachers, setCampusTeachers] = useState<any[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(false);

    const [cutoff, setCutoff] = useState(20);
    const [viewMode, setViewMode] = useState<'overview' | 'drilldown'>('overview');

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cutoff]);

    // Live-sync Analytics Updates
    useEffect(() => {
        const socket = getSocket();
        
        const handleUpdate = (data: any) => {
            console.log('[LIVE-SYNC] Analytics update triggered by:', data.type);
            fetchData();
            toast.info(`Analytics updated: ${data.type.replace('_', ' ')} data changed`, {
                description: 'Dashboard has been refreshed with the latest data.',
                duration: 3000
            });
        };

        socket.on('ANALYTICS_UPDATED', handleUpdate);

        return () => {
            socket.off('ANALYTICS_UPDATED', handleUpdate);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [avgRes, cutoffRes, attendRes, feedbackRes, engageRes, campusAttendRes] = await Promise.all([
                api.get('/analytics/avg-hours-school'),
                api.get(`/analytics/cutoff-stats?cutoff=${cutoff}`),
                api.get('/analytics/attendance'),
                api.get('/analytics/feedback'),
                api.get('/analytics/engagement'),
                api.get('/analytics/attendance/campuses')
            ]);

            setAvgHoursData(avgRes.data.data.results);
            setCutoffStats(cutoffRes.data.data.results);
            setAttendanceData(attendRes.data.data.events);
            setFeedbackData(feedbackRes.data.data);
            setEngagementData(engageRes.data.data);
            setCampusAttendanceData(campusAttendRes.data.data.results);
        } catch (error) {
            console.error("Failed to fetch PD analytics:", error);
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    const handleCampusClick = async (campus: string) => {
        setSelectedCampus(campus);
        setViewMode('drilldown');
        setLoadingTeachers(true);
        try {
            const res = await api.get(`/analytics/teacher-hours/${campus}`);
            setCampusTeachers(res.data.data.teachers);
        } catch (error) {
            toast.error("Failed to load teacher details");
        } finally {
            setLoadingTeachers(false);
        }
    };

    const handleSendSnapshot = async (teacherId: string, teacherName: string) => {
        try {
            await api.post('/pd/snapshot', { teacherId });
            toast.success(`PD Snapshot email sent to ${teacherName}`);
        } catch (error: any) {
            console.error("Failed to send snapshot:", error);
            const msg = error.response?.data?.message || "Failed to send snapshot email";
            toast.error(msg);
        }
    };

    const filteredAvgHours = useMemo(() => {
        return avgHoursData.filter(d => globalSchool === "all" || d.campus === globalSchool);
    }, [avgHoursData, globalSchool]);

    const filteredCutoffStats = useMemo(() => {
        return cutoffStats.filter(d => globalSchool === "all" || d.campus === globalSchool);
    }, [cutoffStats, globalSchool]);

    const stats = useMemo(() => {
        const dataToUse = globalSchool === "all" ? avgHoursData : filteredAvgHours;
        const totalAvg = dataToUse.length > 0
            ? (dataToUse.reduce((acc, curr) => acc + curr.avgHours, 0) / dataToUse.length).toFixed(1)
            : "0";

        const cutoffDataToUse = globalSchool === "all" ? cutoffStats : filteredCutoffStats;
        const totalAbove = cutoffDataToUse.reduce((acc, curr) => acc + (curr.abovePercent * curr.total / 100), 0);
        const totalTeachers = cutoffDataToUse.reduce((acc, curr) => acc + curr.total, 0);
        const percentMeetingGoal = totalTeachers > 0 ? ((totalAbove / totalTeachers) * 100).toFixed(1) : "0";

        const avgAttend = attendanceData.length > 0
            ? (attendanceData.reduce((acc, curr) => acc + curr.attendanceRate, 0) / attendanceData.length).toFixed(1)
            : "0";

        return {
            avgHours: totalAvg,
            percentMeetingGoal,
            avgAttendance: avgAttend,
            globalFeedback: feedbackData.globalAverage || 0
        };
    }, [avgHoursData, cutoffStats, attendanceData, feedbackData, globalSchool, filteredAvgHours, filteredCutoffStats]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-80 rounded-xl" />
                    <Skeleton className="h-80 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="Teacher Development Analytics"
                    subtitle="Comprehensive insights into teacher training and growth"
                />
                <div className="flex items-center gap-3">
                    <Select value={globalSchool} onValueChange={setGlobalSchool}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Schools" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Schools</SelectItem>
                            {CAMPUS_OPTIONS.map(school => (
                                <SelectItem key={school} value={school}>{school}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
                        <span className="text-xs font-medium px-2">Goal Cutoff (Hrs):</span>
                        <Input
                            type="number"
                            value={cutoff}
                            onChange={(e) => setCutoff(parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-xs bg-background"
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchData}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button size="sm" className="bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20">
                        <Download className="w-4 h-4 mr-2" />
                        Data Export
                    </Button>
                </div>
            </div>

            {viewMode === 'overview' ? (
                <>
                    {/* Top Row Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Avg. Training Hours"
                            value={`${stats.avgHours}h`}
                            subtitle={globalSchool === "all" ? "Global average per teacher" : `${globalSchool} average`}
                            icon={Clock}
                        />
                        <StatCard
                            title="Goal Achievement"
                            value={`${stats.percentMeetingGoal}%`}
                            subtitle={`Teachers meeting ${cutoff}h goal`}
                            icon={CheckCircle2}
                        />
                        <StatCard
                            title="Avg. Attendance"
                            value={`${stats.avgAttendance}%`}
                            subtitle="Participation in live training"
                            icon={Users}
                        />
                        <StatCard
                            title="Feedback Score"
                            value={`${stats.globalFeedback}/5`}
                            subtitle="Global event rating average"
                            icon={MessageSquare}
                        />
                    </div>

                    {/* Main Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-premium bg-white overflow-hidden border-none">
                            <CardHeader className="bg-zinc-50/30 border-b border-zinc-100/50 flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-xl font-black tracking-tight">Average Training Hours by Campus</CardTitle>
                                    <CardDescription className="font-medium text-xs">Click a bar to view individual teacher hours</CardDescription>
                                </div>
                                <BarChart3 className="w-6 h-6 text-zinc-300" />
                            </CardHeader>
                            <CardContent className="h-[350px] min-w-0">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <BarChart data={avgHoursData} onClick={(data) => data && data.activeLabel && handleCampusClick(data.activeLabel.toString())}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="campus" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        />
                                        <Legend verticalAlign="top" height={36} />
                                        <Bar dataKey="Workshop" stackId="a" fill="#3B82F6" name="Workshops" />
                                        <Bar dataKey="MOOC" stackId="a" fill="#10B981" name="MOOCs" />
                                        <Bar dataKey="In-house Training" stackId="a" fill="#F59E0B" name="In-house" />
                                        <Bar dataKey="Self-study" stackId="a" fill="#8B5CF6" name="Self-study" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Other" stackId="a" fill="#EC4899" name="Other" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="shadow-premium bg-white overflow-hidden border-none">
                            <CardHeader className="bg-zinc-50/30 border-b border-zinc-100/50 flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-xl font-black tracking-tight">Goal Compliance ( {cutoff}h )</CardTitle>
                                    <CardDescription className="font-medium text-xs">Teachers meeting mandatory PD hour requirements</CardDescription>
                                </div>
                                <TrendingUp className="w-6 h-6 text-zinc-300" />
                            </CardHeader>
                            <CardContent className="h-[350px] min-w-0">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <BarChart data={cutoffStats} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="campus" type="category" axisLine={false} tickLine={false} width={100} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="abovePercent" name="Meeting Goal" stackId="a" fill="#22c55e" radius={[0, 4, 4, 0]} />
                                        <Bar dataKey="belowPercent" name="Needs Hours" stackId="a" fill="#eab308" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Secondary Metrics Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 shadow-premium bg-white overflow-hidden border-none">
                            <CardHeader className="bg-zinc-50/30 border-b border-zinc-100/50 flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-xl font-black tracking-tight">Training Event Performance</CardTitle>
                                    <CardDescription className="font-medium text-xs">Attendance rates for recent PD sessions</CardDescription>
                                </div>
                                <ClipboardCheck className="w-6 h-6 text-zinc-300" />
                            </CardHeader>
                            <CardContent className="h-[300px] min-w-0">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <AreaChart data={attendanceData}>
                                        <defs>
                                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="title" hide />
                                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="attendanceRate" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRate)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="shadow-premium bg-white overflow-hidden border-none">
                            <CardHeader className="bg-zinc-50/30 border-b border-zinc-100/50">
                                <CardTitle className="text-xl font-black tracking-tight">Event Feedback</CardTitle>
                                <CardDescription className="font-medium text-xs">Top rated sessions this semester</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {feedbackData.events.slice(0, 5).sort((a: any, b: any) => b.avgRating - a.avgRating).map((event: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 transition-all hover:bg-muted/60">
                                        <div className="truncate pr-4">
                                            <p className="text-sm font-medium truncate">{event.title}</p>
                                            <p className="text-xs text-muted-foreground">{event.feedbackCount} responses</p>
                                        </div>
                                        <Badge variant={event.avgRating >= 4 ? "secondary" : "outline"} className="shrink-0 bg-primary/10 text-primary border-none">
                                            {event.avgRating} ★
                                        </Badge>
                                    </div>
                                ))}
                                {feedbackData.events.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">No feedback data yet</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tertiary Metrics Row */}
                    <div className="grid grid-cols-1 mt-6">
                        <Card className="shadow-premium bg-white overflow-hidden border-none">
                            <CardHeader className="bg-zinc-50/30 border-b border-zinc-100/50 flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-xl font-black tracking-tight">Attendance Rate by Campus</CardTitle>
                                    <CardDescription className="font-medium text-xs">Average Event Participation %</CardDescription>
                                </div>
                                <Users className="w-6 h-6 text-zinc-300" />
                            </CardHeader>
                            <CardContent className="h-[300px] min-w-0">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <BarChart data={campusAttendanceData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="campus" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        />
                                        <Legend verticalAlign="top" height={36} />
                                        <Bar dataKey="attended" name="Attended" stackId="attendance" fill="#22c55e" />
                                        <Bar dataKey="unattended" name="Not Attended" stackId="attendance" fill="#eab308" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </>
            ) : (
                /* Drill Down View */
                <div className="animate-in slide-in-from-right-5 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => setViewMode('overview')} className="rounded-full hover:bg-slate-100">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h2 className="text-3xl font-black text-zinc-900 tracking-tight uppercase">{selectedCampus}</h2>
                                <p className="text-sm font-medium text-zinc-500">Detailed Educator PD Registry</p>
                            </div>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-none px-4 py-2 font-black text-sm">
                            Mandatory Goal: {cutoff}h
                        </Badge>
                    </div>

                    <Card className="shadow-premium bg-white overflow-hidden border-none">
                        <CardHeader className="bg-zinc-50/30 border-b border-zinc-100/50">
                            <CardTitle className="text-lg font-black">Professional Development Registry</CardTitle>
                            <CardDescription className="font-medium text-xs text-slate-400">Reviewing training hours for {campusTeachers.length} educators</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50 border-zinc-100">
                                        <TableHead className="font-black text-zinc-900 w-[80px] text-center">S.No.</TableHead>
                                        <TableHead className="font-black text-zinc-900">Educator Name</TableHead>
                                        <TableHead className="font-black text-zinc-900">Email Address</TableHead>
                                        <TableHead className="font-black text-zinc-900 text-right">Total PD Hours</TableHead>
                                        <TableHead className="font-black text-zinc-900 text-right w-[180px]">Status</TableHead>
                                        <TableHead className="w-[80px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingTeachers ? (
                                        [1, 2, 3, 4, 5].map(i => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto rounded-full" /></TableCell>
                                                <TableCell><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        campusTeachers.map((teacher: any, index: number) => (
                                            <TableRow key={teacher.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium text-slate-400 text-center">{index + 1}</TableCell>
                                                <TableCell className="font-bold text-zinc-800">{teacher.fullName}</TableCell>
                                                <TableCell className="text-zinc-500 font-medium text-sm">{teacher.email}</TableCell>
                                                <TableCell className="text-right font-black text-lg text-zinc-900">{teacher.totalHours}h</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge className={teacher.totalHours >= cutoff 
                                                        ? "bg-emerald-50 text-emerald-700 border-none px-4 py-1 font-black text-[10px] uppercase tracking-wider" 
                                                        : "bg-amber-50 text-amber-700 border-none px-4 py-1 font-black text-[10px] uppercase tracking-wider"}>
                                                        {teacher.totalHours >= cutoff ? "Requirement Met" : "Hours Pending"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSendSnapshot(teacher.id, teacher.fullName);
                                                            }}
                                                            title="Send PD Snapshot Email"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
