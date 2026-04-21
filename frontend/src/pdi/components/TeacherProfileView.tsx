import React from "react";
import {
    Users, Eye, TrendingUp, Calendar, FileText, Target,
    Award, CheckCircle, Clock, Mail, Phone, MapPin,
    ChevronLeft, Sparkles, Star, Rocket, ArrowUpRight,
    Shield, BookOpen, GraduationCap, Microscope, Plus, Brain,
    Download, Printer
} from "lucide-react";
import { Button } from "@pdi/components/ui/button";
import { Progress } from "@pdi/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Badge } from "@pdi/components/ui/badge";
import { Observation } from "@pdi/types/observation";
import { cn } from "@pdi/lib/utils";
import { useNavigate } from "react-router-dom";
import { AIAnalysisModal } from "@pdi/components/AIAnalysisModal";
import { useState } from "react";
import { ScrollToTop } from "@pdi/components/ui/ScrollToTop";

export interface TeacherProfileViewProps {
    teacher: {
        id: string;
        name: string;
        role: string;
        observations: number;
        lastObserved: string;
        avgScore: number;
        pdHours: number;
        completionRate: number;
        email?: string;
        campus?: string;
        academics?: 'CORE' | 'NON_CORE';
        pdTarget?: number;
    };
    observations: Observation[];
    goals: any[];
    onBack?: () => void;
    userRole?: "teacher" | "leader" | "admin";
}

export function TeacherProfileView({ teacher, observations, goals, onBack, userRole = "teacher" }: TeacherProfileViewProps) {
    const navigate = useNavigate();
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const isReadOnly = true; // explicitly non-editable as requested

    // Filter observations for this specific teacher
    const teacherObservations = observations.filter(obs =>
        obs.teacherId === teacher.id ||
        obs.teacher?.toLowerCase() === teacher.name.toLowerCase() ||
        obs.teacherEmail?.toLowerCase() === teacher.email?.toLowerCase()
    );

    const DOMAIN_MAPPING: Record<string, string[]> = {
        "Planning & Preparation": ["3A", "Planning & Preparation", "Planning"],
        "Classroom Environment": ["3B1", "3B4", "Classroom Practice", "Classroom Environment", "Environment"],
        "Instructional Delivery": ["3B2", "Instructional Delivery", "Instruction"],
        "Assessment & Feedback": ["3B3", "Assessment", "Assessment & Feedback"],
        "Professional Responsibilities": ["3C", "Professional Practice", "Professional Responsibilities", "Professionalism"]
    };

    const calculateDomainScore = (domainLabel: string) => {
        const mappedIds = DOMAIN_MAPPING[domainLabel] || [domainLabel];
        const domainObs = teacherObservations.filter(o =>
            mappedIds.includes(o.domain || "") ||
            (Array.isArray(o.metaTags) && o.metaTags.some(tag => mappedIds.some(id => tag.includes(id))))
        );

        if (domainObs.length === 0) return 0;
        const sum = domainObs.reduce((acc, o) => acc + (o.score || 0), 0);
        return Number((sum / domainObs.length).toFixed(1));
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    const handleExportCSV = () => {
        const headers = ["Date", "Focus Domain", "Score", "Observer", "Observer Role"];
        const rows = teacherObservations.map(o => [
            o.date,
            o.domain || "N/A",
            o.score || "N/A",
            o.observerName || "N/A",
            o.observerRole || "N/A"
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${teacher.name.replace(/\s+/g, '_')}_observation_trail.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-muted-foreground/10">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-muted">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    )}
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20 overflow-hidden relative">
                            <Users className="w-10 h-10 text-primary" />
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-success w-5 h-5 rounded-full border-4 border-background" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-foreground tracking-tight">{teacher.name}</h1>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-3 py-1 flex gap-1.5 items-center">
                                <GraduationCap className="w-3.5 h-3.5" />
                                {teacher.role}
                            </Badge>
                            {teacher.role === "Teacher" && (
                                <Badge variant="secondary" className={cn(
                                    "border-none font-bold px-3 py-1 flex gap-1.5 items-center",
                                    teacher.academics === 'NON_CORE' ? "bg-purple-100 text-purple-700" : "bg-violet-100 text-blue-700"
                                )}>
                                    {teacher.academics === 'NON_CORE' ? 'Specialist' : 'Core'}
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 pt-1">
                            <span className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground border-l border-muted-foreground/20 pl-4">
                                <Mail className="w-4 h-4" />
                                {teacher.email || `${teacher.name.toLowerCase().replace(" ", ".")}@ekyaschools.com`}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground border-l border-muted-foreground/20 pl-4">
                                <MapPin className="w-4 h-4" />
                                {teacher.campus || "Main Campus"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <AIAnalysisModal
                        isOpen={isAIModalOpen}
                        onClose={() => setIsAIModalOpen(false)}
                        data={{ teacher, observations: teacherObservations, goals }}
                        type={userRole === 'teacher' ? 'teacher' : 'admin'}
                        title={`Performance Analysis: ${teacher.name}`}
                    />
                    <Button
                        onClick={() => setIsAIModalOpen(true)}
                        variant="outline"
                        className="rounded-full font-bold border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 flex gap-2 px-5"
                    >
                        <Sparkles className="w-4 h-4 text-violet-600" />
                        AI Insights
                    </Button>
                    {/* Redacting Schedule Review and New Observation buttons as requested */}
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCardCompact
                    title="Performance Avg"
                    value={teacher.avgScore.toFixed(1)}
                    subtitle="Danielson Framework"
                    icon={TrendingUp}
                    color="bg-primary"
                    trend={teacher.avgScore > 0 ? "+0.0 this term" : undefined}
                    onClick={() => navigate(userRole === 'admin' ? "/admin/growth-analytics" : "/leader/performance")}
                />
                <StatCardCompact
                    title="Observations"
                    value={teacher.observations}
                    subtitle="Completed sessions"
                    icon={Eye}
                    color="bg-indigo-500"
                    progress={(teacher.observations / 10) * 100}
                    onClick={() => navigate(userRole === 'admin' ? "/admin/growth-analytics" : "/leader/reports")}
                />
                <StatCardCompact
                    title="Training Hours"
                    value={teacher.pdHours}
                    subtitle="Professional Growth"
                    icon={Clock}
                    color="bg-amber-500"
                    progress={(teacher.pdHours / (teacher.pdTarget || 20)) * 100}
                    onClick={() => navigate(userRole === 'admin' ? "/admin/courses" : "/leader/participation")}
                />
                <StatCardCompact
                    title="Goal Completion"
                    value={`${teacher.completionRate}%`}
                    subtitle="Strategic Objectives"
                    icon={Target}
                    color="bg-violet-500"
                    progress={teacher.completionRate}
                    onClick={() => navigate("/okr")}
                />
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column - Performance & History */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Performance Heatmap / Domains */}
                    <Card className="  shadow-premium bg-background/50 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-muted/5 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Microscope className="w-5 h-5 text-primary" />
                                        Instructional Quality Breakdown
                                    </CardTitle>
                                    <CardDescription>Domain-wise performance based on Danielson indicators</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="font-bold text-primary">View Full Analytics</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <DomainProgress title="Planning & Preparation" score={calculateDomainScore("Planning & Preparation")} color="bg-violet-500" />
                                    <DomainProgress title="Classroom Environment" score={calculateDomainScore("Classroom Environment")} color="bg-violet-500" />
                                    <DomainProgress title="Instructional Delivery" score={calculateDomainScore("Instructional Delivery")} color="bg-indigo-500" />
                                    <DomainProgress title="Assessment & Feedback" score={calculateDomainScore("Assessment & Feedback")} color="bg-amber-500" />
                                    <DomainProgress title="Professional Responsibilities" score={calculateDomainScore("Professional Responsibilities")} color="bg-violet-500" />
                                </div>
                                <div className="bg-muted/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-32 h-32 rounded-full border-8 border-success/20 border-t-success flex items-center justify-center relative">
                                        <span className="text-4xl font-black text-foreground">{teacher.avgScore}</span>
                                        <div className="absolute -bottom-2 bg-success text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">Pillar Score</div>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold">Proficient Tier</h4>
                                        <p className="text-xs text-muted-foreground">Consistently demonstrates high-quality practice with significant student impact.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Observation Registry */}
                    <Card className="  shadow-premium bg-background/50 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-muted/5 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <HistoryIcon className="w-5 h-5 text-indigo-500" />
                                    Observation Trail
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="rounded-lg h-8 gap-2" onClick={handleExportCSV}>
                                        <Download className="w-4 h-4" />
                                        Export CSV
                                    </Button>
                                    <Button variant="outline" size="sm" className="rounded-lg h-8 gap-2" onClick={handleDownloadPDF}>
                                        <Printer className="w-4 h-4" />
                                        Print Portfolio
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-muted/20 border-b">
                                            <th className="text-left p-4 text-xs font-bold capitalize tracking-wider text-muted-foreground pl-6">Date</th>
                                            <th className="text-left p-4 text-xs font-bold capitalize tracking-wider text-muted-foreground">Focus Domain</th>
                                            <th className="text-left p-4 text-xs font-bold capitalize tracking-wider text-muted-foreground">Score</th>
                                            <th className="text-left p-4 text-xs font-bold capitalize tracking-wider text-muted-foreground">Observer</th>
                                            <th className="text-right p-4 text-xs font-bold capitalize tracking-wider text-muted-foreground pr-6">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-muted-foreground/10">
                                        {teacherObservations.map((obs) => (
                                            <tr key={obs.id} className="hover:bg-primary/5 transition-colors group">
                                                <td className="p-4 pl-6">
                                                    <p className="font-bold text-sm tracking-tight">{obs.date}</p>
                                                    <p className="text-[10px] text-muted-foreground capitalize">Announced</p>
                                                </td>
                                                <td className="p-4 text-sm font-medium">
                                                    <span className="bg-primary/5 text-primary px-2.5 py-1 rounded-lg border border-primary/10">
                                                        {obs.domain}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className={cn(
                                                        "w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border shadow-sm",
                                                        obs.score >= 4 ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                                                    )}>
                                                        {obs.score}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-sm font-bold text-foreground">{obs.observerName || "Rohit"}</p>
                                                    <p className="text-[10px] text-muted-foreground">{obs.observerRole || "Head of School"}</p>
                                                </td>
                                                <td className="p-4 text-right pr-6">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 rounded-lg hover:bg-primary/10 hover:text-primary font-bold text-xs"
                                                        onClick={() => navigate(userRole === 'teacher' ? `/observations/${obs.id}` : `/leader/observations/${obs.id}`)}
                                                    >
                                                        Details
                                                        <ArrowUpRight className="w-3 h-3 ml-1" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Goals & Growth */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Development Goals section removed as requested */}

                    {/* Skill Radar / Strengths */}
                    <Card className="  shadow-premium bg-violet-50 border-2 border-violet-100 text-violet-900 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/20 rounded-full blur-3xl -translate-y-10 translate-x-10" />
                        <CardHeader className="pb-2 border-b border-violet-100">
                            <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                                <Star className="w-5 h-5 text-violet-500" />
                                Insight Engine
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 relative z-10">
                            <div className="p-4 rounded-xl bg-white border border-violet-100 shadow-sm">
                                <h5 className="text-xs font-black capitalize tracking-widest text-violet-600/70 mb-2 flex items-center gap-1.5">
                                    <Brain className="w-3.5 h-3.5" />
                                    Key Strength
                                </h5>
                                <p className="text-sm font-bold leading-snug italic text-violet-800">"Exceptional ability to design scaffolded instructional sequences that support complex cognitive tasks."</p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <h5 className="text-xs font-black capitalize tracking-widest text-violet-600/70 mb-3">Core Competencies</h5>
                                <div className="flex flex-wrap gap-2">
                                    {["Pacing", "Questioning", "Engagement", "Assessment"].map(skill => (
                                        <span key={skill} className="px-3 py-1 rounded-full bg-white text-[10px] font-bold border border-violet-100 text-violet-700 shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full bg-violet-600 text-foreground hover:bg-violet-700 font-bold rounded-xl mt-2 border-none shadow-lg shadow-violet-200">
                                Download Full Performance Report
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <ScrollToTop />
        </div>
    );
}

function StatCardCompact({ title, value, subtitle, icon: Icon, color, progress, trend, onClick }: any) {
    return (
        <Card
            className={cn(
                "shadow-premium overflow-hidden group transition-all duration-300",
                onClick && "cursor-pointer hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]"
            )}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-2xl text-foreground shadow-lg", color)}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <div className="h-6 px-2 rounded-full bg-success/10 text-success text-[10px] font-black flex items-center justify-center capitalize tracking-tighter">
                            {trend}
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <h3 className="text-4xl font-black text-foreground tracking-tighter">{value}</h3>
                    <p className="text-xs font-bold text-muted-foreground capitalize tracking-widest">{title}</p>
                </div>
                {progress !== undefined ? (
                    <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-black capitalize">
                            <span className="text-muted-foreground">Utilization</span>
                            <span className="text-foreground">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1 bg-muted shadow-inner [&>div]:bg-success" />
                    </div>
                ) : (
                    <p className="text-[10px] font-bold text-muted-foreground/60 mt-4 italic capitalize tracking-wider">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
}

function DomainProgress({ title, score, color }: { title: string, score: number, color: string }) {
    const percentage = (score / 5) * 100;
    return (
        <div className="space-y-2 group">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground/80 group-hover:text-primary transition-colors tracking-tight">{title}</span>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-foreground">{score}</span>
                    <span className="text-[10px] font-black text-muted-foreground/40">/ 5.0</span>
                </div>
            </div>
            <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden shadow-inner flex">
                <div
                    className={cn("h-full rounded-r-full transition-all duration-1000 ease-out", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

const HistoryIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
    </svg>
);
