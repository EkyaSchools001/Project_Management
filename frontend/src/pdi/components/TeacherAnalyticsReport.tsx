import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@pdi/components/ui/card";
import { Badge } from "@pdi/components/ui/badge";
import { Progress } from "@pdi/components/ui/progress";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Book, CheckCircle, Clock, Star, TrendingUp, Award, Target, Zap, Sparkles, Printer } from "lucide-react";
import { Button } from "@pdi/components/ui/button";
import { AIAnalysisModal } from "./AIAnalysisModal";

interface TeacherAnalyticsReportProps {
    teacher: {
        id: string;
        name: string;
        fullName?: string;
        role: string;
        avgScore: number;
        pdHours: number;
        pdTarget?: number;
        completionRate: number;
        lastObserved: string;
    };
    observations?: any[];
}



export function TeacherAnalyticsReport({ teacher, observations = [] }: TeacherAnalyticsReportProps) {
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    // Calculate dynamic performance trend
    const teacherObservations = observations.filter(o => o.teacher === teacher.name || o.teacherId === teacher.id);

    let performanceTrend: any[] = [];
    if (teacherObservations.length > 0) {
        const sortedObs = [...teacherObservations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        performanceTrend = sortedObs.map(o => ({
            month: new Date(o.date).toLocaleDateString('en-US', { month: 'short' }),
            score: o.score || 0
        }));
    } else {
        performanceTrend = [
            { month: "Aug", score: 0 },
            { month: "Sep", score: 0 },
            { month: "Oct", score: 0 }
        ];
    }

    // Calculate dynamic domain scores
    const domainMap = new Map<string, { total: number; count: number }>();
    teacherObservations.forEach(obs => {
        if (obs.domain) {
            const current = domainMap.get(obs.domain) || { total: 0, count: 0 };
            domainMap.set(obs.domain, { total: current.total + (obs.score || 0), count: current.count + 1 });
        }
    });

    let domainScores: any[] = [];
    if (domainMap.size > 0) {
        domainMap.forEach((data, domain) => {
            domainScores.push({ domain, score: Number((data.total / data.count).toFixed(1)), fullMark: 5 });
        });
    } else {
        domainScores = [
            { domain: "Planning", score: 0, fullMark: 5 },
            { domain: "Instruction", score: 0, fullMark: 5 },
            { domain: "Environment", score: 0, fullMark: 5 },
            { domain: "Professionalism", score: 0, fullMark: 5 }
        ];
    }

    const competencies = [
        { name: "Student Engagement", value: teacher.avgScore > 0 ? Math.round(teacher.avgScore * 20) : 0 },
        { name: "Differentiation", value: teacher.avgScore > 0 ? Math.max(Math.round(teacher.avgScore * 18), 0) : 0 },
        { name: "Tech Integration", value: teacher.avgScore > 0 ? Math.min(Math.round(teacher.avgScore * 22), 100) : 0 },
        { name: "Formative Assessment", value: teacher.avgScore > 0 ? Math.round(teacher.avgScore * 19) : 0 },
    ];

    const analysisData = {
        teacher,
        performanceTrend,
        domainScores,
        competencies
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <AIAnalysisModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                data={analysisData}
                type="teacher"
                title={`${teacher.name} - Professional Analysis`}
            />
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-6 bg-muted/20 rounded-2xl border-2">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary/20">
                        {(teacher.name || teacher.fullName || "Teacher").split(" ").map((n: any) => n[0]).join("")}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{teacher.name}</h2>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Badge variant="outline" className="bg-background">
                                {teacher.role}
                            </Badge>
                            <span className="text-sm">•</span>
                            <span className="text-sm flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Last observed: {teacher.lastObserved}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-9"
                            onClick={() => window.print()}
                        >
                            <Printer className="w-4 h-4" />
                            Print/PDF
                        </Button>
                        <Button
                            onClick={() => setIsAIModalOpen(true)}
                            className="gap-2 h-9 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md font-bold border-none"
                        >
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            AI Analysis
                        </Button>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground font-medium capitalize tracking-wider">Overall Performance</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                            <span className="text-3xl font-black text-foreground">{teacher.avgScore}</span>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[10px] text-muted-foreground">OUT OF</span>
                                <span className="text-xs font-bold text-muted-foreground">5.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-primary capitalize tracking-wider">Growth</p>
                            <p className="text-2xl font-bold mt-1">+12%</p>
                            <p className="text-[10px] text-muted-foreground">vs Last Semester</p>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-success/5 border-success/10">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-success capitalize tracking-wider">Training Hours</p>
                            <p className="text-2xl font-bold mt-1">{teacher.pdHours}h</p>
                            <p className="text-[10px] text-muted-foreground">Target: {teacher.pdTarget || 20}h</p>
                        </div>
                        <div className="p-2 bg-success/10 rounded-lg text-success">
                            <Book className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/5 border-amber-500/10">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-amber-600 capitalize tracking-wider">Observations</p>
                            <p className="text-2xl font-bold mt-1">{teacherObservations.length}</p>
                            <p className="text-[10px] text-muted-foreground">Completed Cycles</p>
                        </div>
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-info/5 border-info/10">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-info capitalize tracking-wider">Impact</p>
                            <p className="text-2xl font-bold mt-1">High</p>
                            <p className="text-[10px] text-muted-foreground">Student Outcomes</p>
                        </div>
                        <div className="p-2 bg-info/10 rounded-lg text-info">
                            <Award className="w-5 h-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Performance Trend (AY 25-26)
                        </CardTitle>
                        <CardDescription>Instructional score progression over the academic year</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        domain={[0, 5]}
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: "hsl(var(--primary) / 0.2)", strokeWidth: 2 }}
                                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Domain Analysis - Radar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-600" />
                            Domain Proficiency
                        </CardTitle>
                        <CardDescription>Strength analysis across 5 instructional domains</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={domainScores}>
                                    <PolarGrid stroke="hsl(var(--muted-foreground) / 0.2)" />
                                    <PolarAngleAxis dataKey="domain" fontSize={12} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Score"
                                        dataKey="score"
                                        stroke="hsl(var(--primary))"
                                        fill="hsl(var(--primary))"
                                        fillOpacity={0.3}
                                    />
                                    <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Teacher Development Progress */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Book className="w-5 h-5 text-success" />
                            PD Engagement
                        </CardTitle>
                        <CardDescription>Completion of assigned modules</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full relative flex flex-col items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: "Completed", value: teacher.completionRate },
                                            { name: "Remaining", value: 100 - teacher.completionRate }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell key="cell-0" fill="hsl(var(--primary))" />
                                        <Cell key="cell-1" fill="hsl(var(--muted) / 0.5)" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-3xl font-bold">{teacher.completionRate}%</span>
                                <span className="text-xs text-muted-foreground capitalize">Completed</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Competency Bars */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Competency Breakdown
                        </CardTitle>
                        <CardDescription>Specific skill mastery levels</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {competencies.map((comp, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{comp.name}</span>
                                    <span className="text-muted-foreground">{comp.value}%</span>
                                </div>
                                <Progress value={comp.value} className="h-2" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-muted/10 border-dashed">
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        Leadership Comment
                    </h3>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                        "{teacher.name} has shown remarkable improvement in student engagement strategies. The recent implementation of PBL units has significantly boosted classroom participation. Recommended focus for next quarter: Differentiated assessment techniques."
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
