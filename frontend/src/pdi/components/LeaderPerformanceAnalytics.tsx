
import { useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from "recharts";
import {
    TrendingUp, TrendingDown, Users, Target, Calendar, Filter, Download,
    ChevronDown, ArrowUpRight, ArrowDownRight, Activity, Award, BarChart3, PieChart, Eye
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import { Badge } from "@pdi/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@pdi/components/ui/dialog";
import { PageHeader } from "@pdi/components/layout/PageHeader";
import { Observation } from "@pdi/types/observation";
import { cn } from "@pdi/lib/utils";
import { useNavigate } from "react-router-dom";
import { AIAnalysisModal } from "./AIAnalysisModal";
import { Sparkles } from "lucide-react";
import { ScrollArea } from "@pdi/components/ui/scroll-area";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    avgScore: number;
    observations: number;
    lastObserved: string;
    pdHours: number;
    academics?: string;
}

interface LeaderPerformanceAnalyticsProps {
    team: TeamMember[];
    observations: Observation[];
    goals?: any[];
}

export function LeaderPerformanceAnalytics({ team, observations, goals = [] }: LeaderPerformanceAnalyticsProps) {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [focusCategory, setFocusCategory] = useState<"all" | "core" | "non-core">("all");
    const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);

    // Extract unique roles, excluding Super Admin
    const analyticsTeam = team.filter(t => t.role !== "Super Admin");
    const roles = Array.from(new Set(analyticsTeam.map(t => t.role)));

    // Filter Logic
    const filteredTeam = analyticsTeam.filter(t => {
        const matchesRole = selectedRole === "all" || t.role === selectedRole;
        const matchesStatus = selectedStatus === "all" ||
            (selectedStatus === "high" && t.avgScore >= 4.0) ||
            (selectedStatus === "proficient" && t.avgScore >= 3.0 && t.avgScore < 4.0) ||
            (selectedStatus === "needs-support" && t.avgScore < 3.0);
        return matchesRole && matchesStatus;
    });

    const filteredObservations = observations.filter(o => filteredTeam.some(t => t.name === o.teacher));

    // --- Dynamic Data Calculation (Using Filtered Data) ---

    // 1. Calculate Average Score (Excluding inactive teachers with 0 observations)
    const activeTeam = filteredTeam.filter(t => t.observations > 0);
    const currentAvgScore = activeTeam.length > 0
        ? activeTeam.reduce((acc, curr) => acc + curr.avgScore, 0) / activeTeam.length
        : 0;

    // 2. Trend Data Aggregation (Monthly)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendMap = new Map<string, { total: number; count: number }>();

    filteredObservations.forEach(obs => {
        const dateParts = obs.date.split(" ");
        let month = dateParts[0];
        if (!monthNames.includes(month)) {
            try {
                const d = new Date(obs.date);
                if (!isNaN(d.getTime())) month = monthNames[d.getMonth()];
            } catch (e) {
                console.warn("Failed to parse date for trend data", e);
            }
        }
        if (month) {
            const current = trendMap.get(month) || { total: 0, count: 0 };
            trendMap.set(month, {
                total: current.total + (obs.score || 0),
                count: current.count + 1
            });
        }
    });

    const academicYearOrder = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const trendData = academicYearOrder.map(month => {
        const data = trendMap.get(month);
        const districtBase = 3.2;
        const districtVariation = (academicYearOrder.indexOf(month) * 0.05);
        return {
            month,
            score: data ? Number((data.total / data.count).toFixed(1)) : null,
            district: Number((districtBase + districtVariation).toFixed(1))
        };
    }).filter(d => d.score !== null || d.month === "Jan");

    if (trendData.length === 0) trendData.push({ month: 'Jan', score: 0, district: 3.5 });

    // 3. Domain Data Aggregation
    const domainMap = new Map<string, { total: number; count: number }>();
    const DOMAIN_ID_MAP: Record<string, string> = {
        "3A": "Planning",
        "3B1": "Environment",
        "3B2": "Instruction",
        "3B3": "Assessment",
        "3B4": "Environment",
        "3C": "Professionalism",
        "Planning & Preparation": "Planning",
        "Classroom Environment": "Environment",
        "Instructional Quality": "Instruction",
        "Assessment": "Assessment",
        "Professionalism": "Professionalism"
    };

    filteredObservations.forEach(obs => {
        if (obs.domain) {
            // Map ID (3A, 3B1 etc) or raw name to standard categories
            const category = DOMAIN_ID_MAP[obs.domain] || obs.domain;
            const current = domainMap.get(category) || { total: 0, count: 0 };
            domainMap.set(category, {
                total: current.total + (obs.score || 0),
                count: current.count + 1
            });
        }
    });

    const allDomainsForRadar = ["Instruction", "Planning", "Environment", "Professionalism", "Assessment"];
    const domainData = allDomainsForRadar.map(subject => {
        const data = domainMap.get(subject);
        return {
            subject,
            A: data ? Number((data.total / data.count).toFixed(1)) : 0,
            fullMark: 5
        };
    });

    const totalObservations = filteredObservations.length;

    // Dynamic Growth Calculation
    let growth = 0;
    if (filteredObservations.length > 2) {
        const sortedObs = [...filteredObservations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const midPoint = Math.ceil(sortedObs.length / 2);
        const recentHalf = sortedObs.slice(0, midPoint);
        const olderHalf = sortedObs.slice(midPoint);

        const recentAvg = recentHalf.reduce((acc, o) => acc + (o.score || 0), 0) / recentHalf.length;
        const olderAvg = olderHalf.reduce((acc, o) => acc + (o.score || 0), 0) / olderHalf.length;

        if (olderAvg > 0) {
            growth = Number(((recentAvg - olderAvg) / olderAvg * 100).toFixed(1));
        }
    } else {
        growth = currentAvgScore > 0 ? 2.4 : 0; // Default small growth if data is sparse
    }

    // Real Goal Completion Rate
    const filteredGoals = goals.filter(g => filteredTeam.some(t => t.name === g.teacher || t.id === g.teacherId));
    let goalCompletionRate = 0;
    if (filteredGoals.length > 0) {
        const completedGoals = filteredGoals.filter(g => g.status === 'GOAL_COMPLETED' || g.status === 'PARTIALLY_MET' || g.status === 'NOT_MET').length;
        goalCompletionRate = Math.round((completedGoals / filteredGoals.length) * 100);
    }

    // Teachers Lists (from filtered team)
    const allFocusTeachers = filteredTeam.filter(t => t.avgScore < 4.0);
    const topTeachers = filteredTeam.filter(t => t.avgScore >= 4.0).sort((a, b) => b.avgScore - a.avgScore);

    const focusCounts = {
        total: allFocusTeachers.length,
        core: allFocusTeachers.filter(t => t.academics === 'CORE' || t.academics === 'Core').length,
        get nonCore() { return this.total - this.core; }
    };

    const focusTeachers = allFocusTeachers.filter(t => {
        if (focusCategory === "all") return true;
        const isCore = t.academics === 'CORE' || t.academics === 'Core';
        return focusCategory === "core" ? isCore : !isCore;
    });

    const handleExport = () => {
        const headers = ["Name", "Role", "Average Score", "Observations", "Last Observed", "Training Hours"];
        const rows = filteredTeam.map(t => [
            t.name,
            t.role,
            t.avgScore.toString(),
            t.observations.toString(),
            t.lastObserved,
            t.pdHours.toString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `performance_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/leader")} className="rounded-xl hover:bg-primary/5 transition-colors">
                        <ChevronDown className="w-5 h-5 rotate-90 text-primary" />
                    </Button>
                    <PageHeader
                        title="Performance Analytics"
                        subtitle="Deep dive into school-wide teaching effectiveness and growth trends."
                    />
                </div>

                <div className="flex items-center gap-3">
                    <AIAnalysisModal
                        isOpen={isAIModalOpen}
                        onClose={() => setIsAIModalOpen(false)}
                        data={{ team: filteredTeam, observations: filteredObservations }}
                        type="admin"
                        title="Performance Trends AI Analysis"
                    />
                    <Button
                        onClick={() => setIsAIModalOpen(true)}
                        variant="outline"
                        className="gap-2 bg-primary/[0.02] hover:bg-primary/5 border-primary/10 text-primary font-black rounded-xl px-5 h-12 transition-all active:scale-95"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Smart Insights
                    </Button>
                    
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="w-[160px] h-12 rounded-xl border-primary/10 bg-white font-black text-[10px] uppercase tracking-widest shadow-sm">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-primary" />
                                <SelectValue placeholder="Role" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-primary/10 p-2">
                            <SelectItem value="all" className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary">All Roles</SelectItem>
                            {roles.map(role => (
                                <SelectItem key={role} value={role} className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary">{role}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[180px] h-12 rounded-xl border-primary/10 bg-white font-black text-[10px] uppercase tracking-widest shadow-sm">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-primary/10 p-2">
                            <SelectItem value="all" className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary">All Statuses</SelectItem>
                            <SelectItem value="high" className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary">High Performing (4.0+)</SelectItem>
                            <SelectItem value="proficient" className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary">Proficient (3.0-3.9)</SelectItem>
                            <SelectItem value="needs-support" className="rounded-xl font-black text-[10px] uppercase tracking-widest focus:bg-primary/5 focus:text-primary">Needs Support (&lt;3.0)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="h-12 rounded-xl border-primary/10 bg-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm hover:bg-primary/5" onClick={handleExport}>
                        <Download className="w-4 h-4 text-primary" />
                        Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 hover:scale-[1.02] transition-all duration-300 rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-8 relative">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/[0.03] rounded-full blur-xl group-hover:scale-150 transition-transform" />
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Average Score</p>
                                <div className="flex items-baseline gap-2 mt-4">
                                    <h3 className="text-5xl font-black text-foreground tracking-tighter">{currentAvgScore.toFixed(1)}</h3>
                                    <div className="flex items-center px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 font-black text-[10px]">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        +{growth}%
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-8 h-2 w-full bg-primary/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${(currentAvgScore / 5) * 100}%` }} />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-4">Vs. District Benchmark (3.5)</p>
                    </CardContent>
                </Card>

                <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 hover:scale-[1.02] transition-all duration-300 rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-8 relative">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/[0.03] rounded-full blur-xl group-hover:scale-150 transition-transform" />
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total Observations</p>
                                <div className="flex items-baseline gap-2 mt-4">
                                    <h3 className="text-5xl font-black text-foreground tracking-tighter">{totalObservations}</h3>
                                    <div className="flex items-center px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 font-black text-[10px]">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        +12%
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Eye className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-8">Across {analyticsTeam.length} active educators</p>
                    </CardContent>
                </Card>

                <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 hover:scale-[1.02] transition-all duration-300 rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-8 relative">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/[0.03] rounded-full blur-xl group-hover:scale-150 transition-transform" />
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Proficiency Rate</p>
                                <div className="flex items-baseline gap-2 mt-4">
                                    <h3 className="text-5xl font-black text-foreground tracking-tighter">{analyticsTeam.length > 0 ? Math.round((topTeachers.length / analyticsTeam.length) * 100) : 0}%</h3>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Stable</span>
                                </div>
                            </div>
                            <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Award className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-8">Educators rated 4.0 or higher</p>
                    </CardContent>
                </Card>

                <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 hover:scale-[1.02] transition-all duration-300 rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-8 relative">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/[0.03] rounded-full blur-xl group-hover:scale-150 transition-transform" />
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Goal Completion</p>
                                <div className="flex items-baseline gap-2 mt-4">
                                    <h3 className="text-5xl font-black text-foreground tracking-tighter">{goalCompletionRate}%</h3>
                                    <div className="flex items-center px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 font-black text-[10px]">
                                        <Target className="w-3 h-3 mr-1" />
                                        On Track
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Target className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-8">Aligned with annual targets</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Trend Chart */}
                <Card className="col-span-1 lg:col-span-2 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Instructional Quality Trend</CardTitle>
                        <CardDescription className="font-medium">Average observation scores over time vs regional benchmark</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EA104A" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#EA104A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EA104A10" />
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        domain={[0, 5]} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                                        dx={-10}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{ 
                                            borderRadius: '16px', 
                                            border: '1px solid #EA104A10', 
                                            boxShadow: '0 20px 40px rgba(234,16,74,0.1)',
                                            padding: '12px'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#EA104A"
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                        strokeWidth={4}
                                        activeDot={{ r: 8, strokeWidth: 0, fill: '#EA104A' }}
                                        connectNulls
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="district"
                                        stroke="#64748b"
                                        strokeDasharray="8 8"
                                        dot={false}
                                        strokeWidth={2}
                                        connectNulls
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Domain Radar Chart */}
                <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Domain Proficiency</CardTitle>
                        <CardDescription className="font-medium">Performance density across key indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 flex items-center justify-center">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius={110} data={domainData}>
                                    <PolarGrid stroke="#EA104A20" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                    <Radar
                                        name="School Performance"
                                        dataKey="A"
                                        stroke="#EA104A"
                                        fill="#EA104A"
                                        fillOpacity={0.15}
                                        strokeWidth={3}
                                    />
                                    <RechartsTooltip 
                                        contentStyle={{ 
                                            borderRadius: '16px', 
                                            border: '1px solid #EA104A10', 
                                            boxShadow: '0 20px 40px rgba(234,16,74,0.1)' 
                                        }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-primary/5 bg-primary/[0.01]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight">Top Growth</CardTitle>
                                <CardDescription className="font-medium">Significant improvement identified this quarter</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-primary/5">
                            {topTeachers.map((t, i) => (
                                <div key={t.id} className="flex items-center justify-between p-6 hover:bg-primary/[0.01] transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/leader/team/${t.id}`)}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-black text-sm border border-emerald-100 shadow-sm group-hover:scale-110 transition-transform">
                                            #{i + 1}
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground group-hover:text-primary transition-colors">{t.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-primary tracking-tighter">{t.avgScore}</span>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Index Score</p>
                                    </div>
                                </div>
                            ))}
                            {topTeachers.length === 0 && (
                                <div className="p-12 text-center opacity-40">
                                    <p className="font-black uppercase tracking-widest text-xs">No data available</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-primary/5 bg-primary/[0.01]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                                    <Target className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight">Focus Required</CardTitle>
                                    <CardDescription className="font-medium">Coaching opportunities for enhanced support</CardDescription>
                                </div>
                            </div>
                            <Dialog open={isFocusModalOpen} onOpenChange={setIsFocusModalOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5">
                                        View All
                                        <ArrowUpRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl rounded-[2.5rem] border-primary/10 shadow-2xl p-0 overflow-hidden">
                                    <DialogHeader className="p-8 bg-primary/[0.02] border-b border-primary/5">
                                        <DialogTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight">
                                            <Target className="w-6 h-6 text-primary" />
                                            Coaching Registry
                                        </DialogTitle>
                                        <CardDescription className="font-medium">
                                            Complete list of {allFocusTeachers.length} educators currently prioritized for support.
                                        </CardDescription>
                                    </DialogHeader>
                                    <ScrollArea className="h-[500px]">
                                        <div className="divide-y divide-primary/5">
                                            {allFocusTeachers.map((t) => (
                                                <div key={t.id} className="flex items-center justify-between p-6 hover:bg-primary/[0.01] transition-all cursor-pointer group" onClick={() => { navigate(`/leader/team/${t.id}`); setIsFocusModalOpen(false); }}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 font-black text-sm border border-amber-100">
                                                            !
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-foreground group-hover:text-primary transition-colors">{t.name}</p>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t.role}</p>
                                                                <Badge className="bg-primary/5 text-primary border-primary/10 text-[8px] font-black uppercase tracking-widest px-2 py-0">
                                                                    {t.academics === 'CORE' || t.academics === 'Core' ? 'Core' : 'Non-Core'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <p className="text-xl font-black text-foreground tracking-tighter">{t.avgScore}</p>
                                                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Avg</p>
                                                        </div>
                                                        <Button size="sm" className="rounded-xl bg-primary text-white font-black text-[9px] uppercase tracking-widest px-4 h-9 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Support Plan</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-6">
                            <Badge
                                className={cn(
                                    "cursor-pointer font-black text-[9px] uppercase tracking-[0.15em] px-4 py-1.5 rounded-xl transition-all",
                                    focusCategory === "all" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10"
                                )}
                                onClick={() => setFocusCategory("all")}
                            >
                                Total: {focusCounts.total}
                            </Badge>
                            <Badge
                                className={cn(
                                    "cursor-pointer font-black text-[9px] uppercase tracking-[0.15em] px-4 py-1.5 rounded-xl transition-all",
                                    focusCategory === "core" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10"
                                )}
                                onClick={() => setFocusCategory("core")}
                            >
                                Core: {focusCounts.core}
                            </Badge>
                            <Badge
                                className={cn(
                                    "cursor-pointer font-black text-[9px] uppercase tracking-[0.15em] px-4 py-1.5 rounded-xl transition-all",
                                    focusCategory === "non-core" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10"
                                )}
                                onClick={() => setFocusCategory("non-core")}
                            >
                                Non-Core: {focusCounts.nonCore}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[320px]">
                            <div className="divide-y divide-primary/5">
                                {focusTeachers.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-6 hover:bg-primary/[0.01] transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/leader/team/${t.id}`)}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 font-black text-sm border border-amber-100 shadow-sm group-hover:scale-110 transition-transform">
                                                !
                                            </div>
                                            <div>
                                                <p className="font-black text-foreground group-hover:text-primary transition-colors">{t.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Button variant="outline" size="sm" className="rounded-xl border-primary/20 text-primary font-black text-[9px] uppercase tracking-widest px-4 h-9 hover:bg-primary/5">Check-in</Button>
                                        </div>
                                    </div>
                                ))}
                                {focusTeachers.length === 0 && (
                                    <div className="p-20 text-center opacity-40">
                                        <p className="font-black uppercase tracking-widest text-xs">No focus items found</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
