import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Users, TrendingUp, CheckCircle2, Award, ArrowUp, ArrowDown, Search, Filter, Layers, Target, Eye, ChevronRight, ChevronDown, Sparkles, BookOpen, Palette } from "lucide-react";
import api from "@pdi/lib/api";
import { getSocket } from "@pdi/lib/socket";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { Badge } from "@pdi/components/ui/badge";
import { Progress } from "@pdi/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@pdi/components/ui/table";
import { Button } from "@pdi/components/ui/button";
import { Input } from "@pdi/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { ScrollArea } from "@pdi/components/ui/scroll-area";
import { CAMPUS_OPTIONS } from "@pdi/lib/constants";

type TeacherEntry = {
    id: string;
    name: string;
    email: string;
    campusId: string;
    academics: string;
    observationCount: number;
    avgScore: number;
};

const TeacherTable = ({
    teachers,
    campusFilter,
    searchQuery,
    label,
    color,
}: {
    teachers: TeacherEntry[];
    campusFilter: string;
    searchQuery: string;
    label: string;
    color: string;
}) => {
    const filtered = useMemo(() => {
        return teachers.filter(t => {
            const matchesCampus = campusFilter === "all" || t.campusId === campusFilter;
            const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCampus && matchesSearch;
        });
    }, [teachers, campusFilter, searchQuery]);

    return (
        <div className="rounded-xl border border-zinc-100 overflow-hidden">
            <ScrollArea className="h-[400px] w-full">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/80 hover:bg-zinc-50/80 border-zinc-100">
                            <TableHead className="font-bold text-zinc-700 w-[60px] text-center">S.No.</TableHead>
                            <TableHead className="font-bold text-zinc-700">Teacher</TableHead>
                            <TableHead className="font-bold text-zinc-700">Campus</TableHead>
                            <TableHead className="font-bold text-zinc-700">Type</TableHead>
                            <TableHead className="font-bold text-zinc-700 text-center">Observations</TableHead>
                            <TableHead className="font-bold text-zinc-700 text-center">Avg Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-medium">
                                    No {label} teachers found.
                                </TableCell>
                            </TableRow>
                        ) : filtered.map((t, i) => (
                            <TableRow key={t.id} className="hover:bg-zinc-50 transition-colors border-zinc-50 group">
                                <TableCell className="text-center font-medium text-muted-foreground">{i + 1}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-zinc-800">{t.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{t.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-zinc-600 text-sm">{t.campusId}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={t.academics === 'CORE'
                                            ? 'bg-backgroundackgroundlue-50 text-blue-700 border-none font-bold text-[10px]'
                                            : 'bg-purple-50 text-purple-700 border-none font-bold text-[10px]'}
                                    >
                                        {t.academics === 'CORE' ? 'Core' : 'Non-Core'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center font-mono font-bold text-zinc-700">{t.observationCount}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${t.avgScore >= 4 ? 'bg-backgroundmerald-500' : t.avgScore >= 3 ? 'bg-amber-500' : t.avgScore > 0 ? 'bg-rose-500' : 'bg-zinc-200'}`} />
                                        <span className="font-mono font-bold text-zinc-700">{t.avgScore > 0 ? t.avgScore : '--'}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
};

const GrowthAnalyticsView = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedCampus, setExpandedCampus] = useState<string | null>(null);
    const [selectedCampusFilter, setSelectedCampusFilter] = useState<string>("all");
    const [teacherSearch, setTeacherSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "core" | "noncore">("all");

    const fetchAnalytics = async () => {
        try {
            const response = await api.get("/growth/analytics");
            setData(response.data.data.analytics);
        } catch (err) {
            console.error("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();

        const socket = getSocket();
        socket.on('observation:created', fetchAnalytics);
        socket.on('observation:updated', fetchAnalytics);
        socket.on('observation:deleted', fetchAnalytics);

        return () => {
            socket.off('observation:created', fetchAnalytics);
            socket.off('observation:updated', fetchAnalytics);
            socket.off('observation:deleted', fetchAnalytics);
        };
    }, []);

    if (loading || !data) {
        return <div className="p-12 text-center animate-pulse text-muted-foreground font-medium">Crunching growth data insights...</div>;
    }

    const toolData = data.toolUsage ? [
        { name: "Instructional", value: data.toolUsage.instructional, color: "#3B82F6" },
        { name: "LA", value: data.toolUsage.la, color: "#10B981" },
        { name: "Cultural", value: data.toolUsage.cultural, color: "#F59E0B" },
    ] : [];

    const allTeachers: TeacherEntry[] = data.allTeachersList || [];
    const coreTeachers = allTeachers.filter(t => t.academics === 'CORE');
    const nonCoreTeachers = allTeachers.filter(t => t.academics === 'NON_CORE');

    const stats = [
        { title: "Total Teachers", value: data.totalTeachers || allTeachers.length, icon: Users, color: "text-blue-600", bg: "bg-backgroundackgroundlue-100", trend: "All Staff" },
        { title: "Core Teachers", value: data.totalCore || coreTeachers.length, icon: BookOpen, color: "text-emerald-600", bg: "bg-backgroundmerald-100", trend: "Academic Core" },
        { title: "Non-Core Teachers", value: data.totalNonCore || nonCoreTeachers.length, icon: Palette, color: "text-purple-600", bg: "bg-purple-100", trend: "Non-Core" },
        { title: "Target Completion", value: `${Math.round(data.observationCompletionRate)}%`, icon: Target, color: "text-amber-600", bg: "bg-amber-100", trend: "Annual Goal" },
    ];

    const uniqueCampuses = CAMPUS_OPTIONS;
    const filteredCampusMetrics = data.campusMetrics?.filter((c: any) =>
        selectedCampusFilter === "all" || c.campusId === selectedCampusFilter
    );

    const tabs = [
        { key: "all", label: "All Teachers", count: allTeachers.length, color: "text-zinc-700" },
        { key: "core", label: "Core", count: coreTeachers.length, color: "text-blue-600" },
        { key: "noncore", label: "Non-Core", count: nonCoreTeachers.length, color: "text-purple-600" },
    ];

    const activeTeachers = activeTab === "all" ? allTeachers : activeTab === "core" ? coreTeachers : nonCoreTeachers;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Top Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="shadow-premium bg-white overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <Badge variant="secondary" className="bg-zinc-50 text-zinc-500 font-bold border-none text-[10px]">
                                    {stat.trend}
                                </Badge>
                            </div>
                            <h3 className="text-sm font-bold text-muted-foreground tracking-wider">{stat.title}</h3>
                            <p className="text-3xl font-black text-zinc-900 mt-1">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tool Usage Distribution */}
                <Card className="shadow-premium bg-white overflow-hidden group">
                    <CardHeader className="bg-zinc-50/30 border-b border-zinc-100/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black tracking-tight">Tool Usage Distribution</CardTitle>
                                <CardDescription className="font-medium text-[10px]">Instructional vs LA vs Cultural</CardDescription>
                            </div>
                            <Sparkles className="w-6 h-6 text-amber-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="h-[280px] p-4">
                        {data.toolUsage?.total > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={toolData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {toolData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-medium">No tool usage data available</div>
                        )}
                        {data.toolUsage?.percentages && (
                            <div className="grid grid-cols-3 gap-1 pt-2">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-blue-600">{data.toolUsage.percentages.instructional}%</p>
                                    <p className="text-[8px] font-bold text-muted-foreground">Inst.</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-emerald-600">{data.toolUsage.percentages.la}%</p>
                                    <p className="text-[8px] font-bold text-muted-foreground">LA</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-amber-600">{data.toolUsage.percentages.cultural}%</p>
                                    <p className="text-[8px] font-bold text-muted-foreground">Cult.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Growth Trends Chart */}
                <Card className="lg:col-span-2 shadow-premium bg-white overflow-hidden">
                    <CardHeader className="bg-zinc-50/30 border-b border-zinc-100/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black">Performance Trajectory</CardTitle>
                                <CardDescription className="font-medium italic text-xs">Core vs Non-Core engagement trends</CardDescription>
                            </div>
                            <Layers className="w-6 h-6 text-zinc-300" />
                        </div>
                    </CardHeader>
                    <CardContent className="h-[280px] p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.growthTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }} />
                                <RechartsTooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="core" name="Core" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
                                <Bar dataKey="nonCore" name="Non-Core" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* ── All / Core / Non-Core Teacher Tables ── */}
            <Card className="shadow-premium bg-white">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-black">Teacher Directory</CardTitle>
                            <CardDescription className="font-medium">Browse all, core, or non-core teachers with growth stats</CardDescription>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <Select value={selectedCampusFilter} onValueChange={setSelectedCampusFilter}>
                                <SelectTrigger className="w-[170px]">
                                    <SelectValue placeholder="All Campuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Campuses</SelectItem>
                                    {uniqueCampuses.map((campus: any) => (
                                        <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search teacher..."
                                    className="pl-9 h-9 rounded-xl w-[180px]"
                                    value={teacherSearch}
                                    onChange={e => setTeacherSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-4 bg-zinc-100 p-1 rounded-xl w-fit">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${activeTab === tab.key
                                    ? 'bg-white shadow-sm text-zinc-800'
                                    : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                            >
                                {tab.label}
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? `${tab.color} bg-zinc-50` : 'text-muted-foreground'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <TeacherTable
                        teachers={activeTeachers}
                        campusFilter={selectedCampusFilter}
                        searchQuery={teacherSearch}
                        label={activeTab === "all" ? "All" : activeTab === "core" ? "Core" : "Non-Core"}
                        color={activeTab === "core" ? "blue" : activeTab === "noncore" ? "purple" : "zinc"}
                    />
                </CardContent>
            </Card>

            {/* Campus Benchmarking Table with Drill-down */}
            <Card className="shadow-premium bg-white">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black">Campus Growth Benchmarking</CardTitle>
                            <CardDescription className="font-medium">Compare professional growth metrics across institutions</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <Select value={selectedCampusFilter} onValueChange={setSelectedCampusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Campuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Campuses</SelectItem>
                                    {uniqueCampuses.map((campus: any) => (
                                        <SelectItem key={campus} value={campus}>{campus}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Badge variant="outline" className="border-zinc-100 text-zinc-500 font-bold">
                                Total {filteredCampusMetrics?.length} Campuses
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50 border-zinc-100">
                                <TableHead className="font-bold text-zinc-900 w-[60px] text-center">S.No.</TableHead>
                                <TableHead className="font-bold text-zinc-900 w-[180px]">Campus</TableHead>
                                <TableHead className="font-bold text-zinc-900 text-center">Core</TableHead>
                                <TableHead className="font-bold text-zinc-900 text-center">Non-Core</TableHead>
                                <TableHead className="font-bold text-zinc-900">Avg Score</TableHead>
                                <TableHead className="font-bold text-zinc-900">Obs / Teacher</TableHead>
                                <TableHead className="font-bold text-zinc-900">Target Completion</TableHead>
                                <TableHead className="font-bold text-zinc-900 text-right">Activity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCampusMetrics?.map((campus: any, index: number) => (
                                <React.Fragment key={campus.campusId}>
                                    <TableRow
                                        className="cursor-pointer hover:bg-zinc-50 transition-colors border-zinc-100 group"
                                        onClick={() => setExpandedCampus(expandedCampus === campus.campusId ? null : campus.campusId)}
                                    >
                                        <TableCell className="font-medium text-slate-500 text-center">{index + 1}</TableCell>
                                        <TableCell className="font-black text-zinc-800">
                                            <div className="flex items-center gap-2">
                                                {expandedCampus === campus.campusId ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                                                {campus.campusId}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-backgroundackgroundlue-50 text-blue-700 border-none font-bold">
                                                {campus.coreCount} Core
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-none font-bold">
                                                {campus.nonCoreCount} Non-Core
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono font-bold text-zinc-700">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${campus.avgScore >= 4 ? 'bg-backgroundmerald-500' : campus.avgScore >= 3 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                                {campus.avgScore}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-zinc-600">{campus.avgObsPerTeacher}</TableCell>
                                        <TableCell className="w-[200px]">
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                                                    <span>{campus.targetCompletion}%</span>
                                                </div>
                                                <Progress value={campus.targetCompletion} className="h-2 rounded-full bg-zinc-100" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="secondary" className="bg-backgroundackgroundlue-50 text-blue-600 border-none font-bold">
                                                {campus.observationCount} Obs
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    {expandedCampus === campus.campusId && (
                                        <TableRow className="bg-zinc-50/30 border-none hover:bg-zinc-50/30">
                                            <TableCell colSpan={8} className="p-0">
                                                <div className="px-12 py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    {/* Core sub-section */}
                                                    {campus.coreTeachers?.length > 0 && (
                                                        <div>
                                                            <h4 className="text-[10px] font-black tracking-widest text-blue-500 mb-2 flex items-center gap-2">
                                                                <BookOpen className="w-3 h-3" /> Core Teachers ({campus.coreTeachers.length})
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                {campus.coreTeachers.map((teacher: any) => (
                                                                    <div key={teacher.id} className="p-3 bg-white rounded-xl border border-blue-50 shadow-sm flex items-center justify-between">
                                                                        <div>
                                                                            <p className="font-bold text-zinc-800 text-sm">{teacher.name}</p>
                                                                            <p className="text-[10px] text-muted-foreground font-bold">{teacher.observationCount} Obs</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-lg font-black text-zinc-900 leading-none">{teacher.avgScore || '--'}</p>
                                                                            <p className="text-[9px] text-muted-foreground font-bold">Avg</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* Non-Core sub-section */}
                                                    {campus.nonCoreTeachers?.length > 0 && (
                                                        <div>
                                                            <h4 className="text-[10px] font-black tracking-widest text-purple-500 mb-2 flex items-center gap-2">
                                                                <Palette className="w-3 h-3" /> Non-Core Teachers ({campus.nonCoreTeachers.length})
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                {campus.nonCoreTeachers.map((teacher: any) => (
                                                                    <div key={teacher.id} className="p-3 bg-white rounded-xl border border-purple-50 shadow-sm flex items-center justify-between">
                                                                        <div>
                                                                            <p className="font-bold text-zinc-800 text-sm">{teacher.name}</p>
                                                                            <p className="text-[10px] text-muted-foreground font-bold">{teacher.observationCount} Obs</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-lg font-black text-zinc-900 leading-none">{teacher.avgScore || '--'}</p>
                                                                            <p className="text-[9px] text-muted-foreground font-bold">Avg</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(!campus.coreTeachers?.length && !campus.nonCoreTeachers?.length) && (
                                                        <p className="text-xs text-muted-foreground font-medium">No teacher data available for this campus.</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Observer Engagement Table */}
            <Card className="shadow-premium bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-black">Observer Efficacy</CardTitle>
                    <CardDescription className="font-medium">Strategic distribution of Teacher Development guidance</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                    {data.observerMetrics?.map((observer: any) => (
                        <div key={observer.id} className="p-4 rounded-2xl bg-zinc-50 hover:bg-white border border-transparent hover:border-zinc-100 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-blue-600 shadow-sm">
                                        {observer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-zinc-900 text-sm leading-none">{observer.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground mt-1">{observer.observationCount} Observations</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-zinc-900 leading-none">{observer.avgScore}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground">Avg Score</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-black text-muted-foreground">
                                    <span>Workload Completion</span>
                                    <span>{observer.targetCompletion}%</span>
                                </div>
                                <Progress value={observer.targetCompletion} className="h-1.5 rounded-full bg-white" />
                            </div>
                        </div>
                    ))}
                    {(!data.observerMetrics || data.observerMetrics.length === 0) && (
                        <p className="text-sm text-muted-foreground font-medium col-span-full text-center py-8">No observer data available yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default GrowthAnalyticsView;
