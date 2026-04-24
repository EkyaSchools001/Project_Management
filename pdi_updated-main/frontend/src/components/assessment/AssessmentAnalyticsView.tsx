import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BarChart3, PieChart as PieChartIcon,
    Target, Award, CheckCircle2,
    ListChecks, Users, ChevronRight,
    ChevronDown, Sparkles, TrendingUp,
    FileText, Activity
} from "lucide-react";
import api from "@/lib/api";
import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AssessmentAnalyticsView = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedAssessment, setExpandedAssessment] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get("/assessments/analytics");
                setData(response.data.data.analytics);
            } catch (err) {
                console.error("Failed to load assessment analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading || !data) {
        return <div className="p-12 text-center animate-pulse text-zinc-400 font-medium">Analyzing assessment data...</div>;
    }

    const { campusPostOrientation, detailedStats } = data;

    // Summary Stats
    const totalAttempts = data.attempts?.length || 0;
    const avgGlobalScore = detailedStats?.length > 0
        ? detailedStats.reduce((acc: number, s: any) => acc + s.avgScore, 0) / detailedStats.length
        : 0;
    const completionRate = detailedStats?.length > 0
        ? (detailedStats.reduce((acc: number, s: any) => acc + s.submittedCount, 0) /
            Math.max(1, detailedStats.reduce((acc: number, s: any) => acc + s.totalAssigned, 0))) * 100
        : 0;

    const stats = [
        { title: "Avg Assessment Score", value: `${Math.round(avgGlobalScore)}%`, icon: Award, color: "text-blue-600", bg: "bg-blue-50", trend: "System-wide" },
        { title: "Overall Completion", value: `${Math.round(completionRate)}%`, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50", trend: "All Assessments" },
        { title: "Total Attempts", value: totalAttempts, icon: Activity, color: "text-amber-600", bg: "bg-amber-50", trend: "Submitted" },
        { title: "Active Assessments", value: detailedStats?.length || 0, icon: FileText, color: "text-rose-600", bg: "bg-rose-50", trend: "Live Templates" },
    ];

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
                            <h3 className="text-sm font-bold text-zinc-400 capitalize tracking-wider">{stat.title}</h3>
                            <p className="text-3xl font-black text-zinc-900 mt-1">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Post-Orientation Benchmarking */}
                <Card className="lg:col-span-2 shadow-premium   bg-white overflow-hidden">
                    <CardHeader className="bg-zinc-50/30 border-b border-zinc-100/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black italic">Campus Post-Orientation Benchmark</CardTitle>
                                <CardDescription className="font-medium text-xs">Average scores across all campuses and batches</CardDescription>
                            </div>
                            <TrendingUp className="w-6 h-6 text-zinc-300" />
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={campusPostOrientation} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="campusId"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                                    domain={[0, 100]}
                                />
                                <RechartsTooltip
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="avgScore" name="Avg Score %" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={32}>
                                    {campusPostOrientation.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.avgScore > 80 ? '#10B981' : entry.avgScore > 60 ? '#3B82F6' : '#F59E0B'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Score Distribution Breakdown */}
                <Card className="shadow-premium   bg-white overflow-hidden flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl font-black">Performance Tiers</CardTitle>
                        <CardDescription className="font-medium">Global score distribution for all assessments</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center space-y-6">
                        {detailedStats?.slice(0, 4).map((stat: any) => (
                            <div key={stat.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-zinc-700 truncate max-w-[150px]">{stat.title}</span>
                                    <span className="text-sm font-black text-blue-600">{stat.avgScore}%</span>
                                </div>
                                <Progress value={stat.avgScore} className="h-2 bg-zinc-100" />
                            </div>
                        ))}
                        {(!detailedStats || detailedStats.length === 0) && (
                            <div className="text-center py-12 text-zinc-400 font-medium">No assessment data available</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Assessment Analytics Table */}
            <Card className="shadow-premium   bg-white overflow-hidden text-sm capitalize">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black italic">Detailed Assessment Insights</CardTitle>
                            <CardDescription className="font-medium italic">Engagement and performance metrics per template</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-zinc-200 text-zinc-500 font-black">
                            {detailedStats?.length || 0} Templates
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-zinc-50 border-zinc-100">
                                <TableHead className="font-black text-zinc-900 w-[60px]">S.No.</TableHead>
                                <TableHead className="font-black text-zinc-900">Assessment Title</TableHead>
                                <TableHead className="font-black text-zinc-900">Avg Score</TableHead>
                                <TableHead className="font-black text-zinc-900">Submitted</TableHead>
                                <TableHead className="font-black text-zinc-900">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detailedStats?.map((stat: any, index: number) => (
                                <TableRow key={stat.id} className="hover:bg-zinc-50/50 border-zinc-100 transition-colors">
                                    <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                                    <TableCell className="font-bold text-zinc-800">{stat.title}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${stat.avgScore >= 80 ? 'bg-emerald-500' : stat.avgScore >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`} />
                                            <span className="font-black text-zinc-700">{stat.avgScore}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-zinc-600">
                                        {stat.submittedCount} Attempts
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`border-none ${stat.submittedCount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'} font-black text-[10px]`}>
                                            {stat.submittedCount > 0 ? "RECORDED" : "NO DATA"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AssessmentAnalyticsView;
