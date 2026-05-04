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
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-primary/5 relative">
                <div className="absolute -left-20 top-0 w-64 h-64 bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />
                <div className="flex items-center gap-6 relative z-10">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl hover:bg-primary/5 h-12 w-12 transition-all">
                            <ChevronLeft className="w-6 h-6 text-primary" />
                        </Button>
                    )}
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-[2rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center justify-center border border-primary/5 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent" />
                            <Users className="w-12 h-12 text-primary relative z-10" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white shadow-lg" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-4xl font-black text-foreground tracking-tight">{teacher.name}</h1>
                            <Badge className="bg-primary text-white border-none font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl shadow-lg shadow-primary/20">
                                {teacher.role}
                            </Badge>
                            {teacher.role === "Teacher" && (
                                <Badge className={cn(
                                    "border-none font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl",
                                    teacher.academics === 'NON_CORE' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                )}>
                                    {teacher.academics === 'NON_CORE' ? 'Specialist' : 'Core Faculty'}
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-6">
                            <span className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-primary/[0.02] px-3 py-1 rounded-lg border border-primary/5">
                                <Mail className="w-3.5 h-3.5 text-primary" />
                                {teacher.email || `${teacher.name.toLowerCase().replace(" ", ".")}@ekyaschools.com`}
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-primary/[0.02] px-3 py-1 rounded-lg border border-primary/5">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                {teacher.campus || "Main Campus"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
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
                        className="rounded-2xl h-14 font-black text-[11px] uppercase tracking-[0.2em] border-primary/10 text-primary bg-primary/[0.02] hover:bg-primary hover:text-white flex gap-3 px-8 shadow-xl shadow-primary/5 transition-all active:scale-95 group"
                    >
                        <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                        AI Insights
                    </Button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    color="bg-primary"
                    progress={(teacher.observations / 10) * 100}
                    onClick={() => navigate(userRole === 'admin' ? "/admin/growth-analytics" : "/leader/reports")}
                />
                <StatCardCompact
                    title="Training Hours"
                    value={teacher.pdHours}
                    subtitle="Professional Growth"
                    icon={Clock}
                    color="bg-primary"
                    progress={(teacher.pdHours / (teacher.pdTarget || 20)) * 100}
                    onClick={() => navigate(userRole === 'admin' ? "/admin/courses" : "/leader/participation")}
                />
                <StatCardCompact
                    title="Goal Completion"
                    value={`${teacher.completionRate}%`}
                    subtitle="Strategic Objectives"
                    icon={Target}
                    color="bg-primary"
                    progress={teacher.completionRate}
                    onClick={() => navigate("/okr")}
                />
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column - Performance & History */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Performance Heatmap / Domains */}
                    <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-8 border-b border-primary/5 bg-primary/[0.01]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/5 border border-primary/10">
                                            <Microscope className="w-5 h-5 text-primary" />
                                        </div>
                                        Instructional Quality Breakdown
                                    </CardTitle>
                                    <CardDescription className="font-medium mt-1">Domain-wise performance based on Danielson indicators</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl">View Full Analytics</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <DomainProgress title="Planning & Preparation" score={calculateDomainScore("Planning & Preparation")} color="bg-primary" />
                                    <DomainProgress title="Classroom Environment" score={calculateDomainScore("Classroom Environment")} color="bg-primary" />
                                    <DomainProgress title="Instructional Delivery" score={calculateDomainScore("Instructional Delivery")} color="bg-primary" />
                                    <DomainProgress title="Assessment & Feedback" score={calculateDomainScore("Assessment & Feedback")} color="bg-primary" />
                                    <DomainProgress title="Professional Responsibilities" score={calculateDomainScore("Professional Responsibilities")} color="bg-primary" />
                                </div>
                                <div className="bg-primary/[0.02] rounded-[2rem] p-10 flex flex-col items-center justify-center text-center space-y-6 border border-primary/5 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/[0.01] group-hover:bg-primary/[0.03] transition-colors" />
                                    <div className="w-40 h-40 rounded-full border-[12px] border-primary/[0.05] border-t-primary flex items-center justify-center relative z-10 shadow-xl shadow-primary/5">
                                        <span className="text-5xl font-black text-foreground tracking-tighter">{teacher.avgScore}</span>
                                        <div className="absolute -bottom-4 bg-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/30">Pillar Score</div>
                                    </div>
                                    <div className="space-y-2 relative z-10">
                                        <h4 className="font-black text-lg uppercase tracking-tight">Proficient Tier</h4>
                                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed px-4">Consistently demonstrates high-quality practice with significant student impact.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Observation Registry */}
                    <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="p-8 border-b border-primary/5 bg-primary/[0.01]">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-primary/5 border border-primary/10">
                                        <HistoryIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    Observation Trail
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 gap-2 font-black text-[10px] uppercase tracking-widest border-primary/10 hover:bg-primary/5 transition-all" onClick={handleExportCSV}>
                                        <Download className="w-4 h-4 text-primary" />
                                        Export CSV
                                    </Button>
                                    <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 gap-2 font-black text-[10px] uppercase tracking-widest border-primary/10 hover:bg-primary/5 transition-all" onClick={handleDownloadPDF}>
                                        <Printer className="w-4 h-4 text-primary" />
                                        Print Portfolio
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-primary/[0.01] border-b border-primary/5">
                                            <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-10">Date</th>
                                            <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Focus Domain</th>
                                            <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Score</th>
                                            <th className="text-left p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Observer</th>
                                            <th className="text-right p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pr-10">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-primary/5">
                                        {teacherObservations.map((obs) => (
                                            <tr key={obs.id} className="hover:bg-primary/[0.01] transition-all group">
                                                <td className="p-6 pl-10">
                                                    <p className="font-black text-sm tracking-tight text-foreground">{obs.date}</p>
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Announced Review</p>
                                                </td>
                                                <td className="p-6">
                                                    <span className="bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/10 text-[10px] font-black uppercase tracking-widest">
                                                        {obs.domain}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-lg border shadow-sm group-hover:scale-110 transition-transform",
                                                        obs.score >= 4 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                                    )}>
                                                        {obs.score}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-sm font-black text-foreground">{obs.observerName || "Rohit"}</p>
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">{obs.observerRole || "Head of School"}</p>
                                                </td>
                                                <td className="p-6 text-right pr-10">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 rounded-xl hover:bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest px-4 transition-all"
                                                        onClick={() => navigate(userRole === 'teacher' ? `/observations/${obs.id}` : `/leader/observations/${obs.id}`)}
                                                    >
                                                        Details
                                                        <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
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

                    {/* Skill Radar / Strengths */}
                    <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 rounded-[2.5rem] overflow-hidden bg-white relative group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.02] rounded-full blur-[60px] -translate-y-20 translate-x-20 group-hover:bg-primary/[0.05] transition-colors" />
                        <CardHeader className="p-8 border-b border-primary/5 bg-primary/[0.01]">
                            <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
                                <div className="p-2 rounded-xl bg-primary/5 border border-primary/10">
                                    <Star className="w-5 h-5 text-primary" />
                                </div>
                                Insight Engine
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8 relative z-10">
                            <div className="p-6 rounded-[1.5rem] bg-primary/[0.02] border border-primary/5 shadow-sm group/card hover:bg-primary/[0.04] transition-all">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 mb-4 flex items-center gap-2">
                                    <Brain className="w-4 h-4" />
                                    Key Strength
                                </h5>
                                <p className="text-sm font-bold leading-relaxed italic text-foreground border-l-4 border-primary/20 pl-4 py-1">
                                    "Exceptional ability to design scaffolded instructional sequences that support complex cognitive tasks."
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Core Competencies</h5>
                                <div className="flex flex-wrap gap-2">
                                    {["Pacing", "Questioning", "Engagement", "Assessment"].map(skill => (
                                        <span key={skill} className="px-4 py-2 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest border border-primary/5 text-primary shadow-sm hover:scale-105 transition-transform cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full h-14 bg-primary text-white hover:bg-primary/90 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl mt-4 border-none shadow-2xl shadow-primary/20 transition-all active:scale-95 flex gap-3">
                                <Download className="w-5 h-5" />
                                Download Performance Portfolio
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
                "shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-primary/5 overflow-hidden group transition-all duration-500 rounded-[2.5rem] bg-white",
                onClick && "cursor-pointer hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:-translate-y-1 active:scale-[0.98]"
            )}
            onClick={onClick}
        >
            <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className={cn("p-4 rounded-2xl text-white shadow-xl shadow-primary/10 transition-transform group-hover:scale-110 duration-500", color)}>
                        <Icon className="w-7 h-7" />
                    </div>
                    {trend && (
                        <div className="h-8 px-4 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center justify-center uppercase tracking-widest border border-emerald-100">
                            {trend}
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <h3 className="text-5xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">{value}</h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">{title}</p>
                </div>
                {progress !== undefined ? (
                    <div className="mt-8 space-y-3">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                            <span className="text-muted-foreground">Progress Velocity</span>
                            <span className="text-primary">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-primary/[0.05] shadow-none [&>div]:bg-primary rounded-full" />
                    </div>
                ) : (
                    <p className="text-[10px] font-black text-muted-foreground/40 mt-8 italic uppercase tracking-widest">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
}

function DomainProgress({ title, score, color }: { title: string, score: number, color: string }) {
    const percentage = (score / 5) * 100;
    return (
        <div className="space-y-3 group/item">
            <div className="flex justify-between items-end">
                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest group-hover/item:text-primary transition-colors">{title}</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-foreground tracking-tighter">{score}</span>
                    <span className="text-[10px] font-black text-muted-foreground/30">/ 5.0</span>
                </div>
            </div>
            <div className="h-3 w-full bg-primary/[0.03] rounded-full overflow-hidden border border-primary/[0.05] flex shadow-inner">
                <div
                    className={cn("h-full rounded-r-full transition-all duration-1000 ease-out shadow-sm", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

