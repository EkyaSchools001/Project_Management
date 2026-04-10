// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, userService } from "@pdi/services/userService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import {
    ChevronLeft, Loader2, Users, History as HistoryIcon,
    Target, Wrench, BarChart3, ChevronDown, ChevronUp, X, Plus, Calendar as CalendarIcon, FileText
} from "lucide-react";
import TeacherSelection from "@pdi/components/growth/TeacherSelection";
import CoreModules from "@pdi/components/growth/CoreModules";
import NonCoreModules from "@pdi/components/growth/NonCoreModules";
import { toast } from "sonner";
import { Progress } from "@pdi/components/ui/progress";
import { Badge } from "@pdi/components/ui/badge";
import { DashboardLayout } from "@pdi/components/layout/DashboardLayout";
import { GrowthLayout } from "@pdi/components/growth/GrowthLayout";
import { useAuth } from "@pdi/hooks/useAuth";
import api from "@pdi/lib/api";
import { format } from "date-fns";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@pdi/components/ui/dialog";
import { Label } from "@pdi/components/ui/label";
import { Input } from "@pdi/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@pdi/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@pdi/components/ui/popover";
import { Calendar as CalendarComponent } from "@pdi/components/ui/calendar";
import { cn } from "@pdi/lib/utils";
import { TIME_SLOTS } from "@pdi/lib/constants";

const OBSERVATION_TARGET = 10; // configurable target per leader

const LeaderGrowthPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { teacherId } = useParams();
    const [teachers, setTeachers] = useState<User[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // School-wide analytics state
    const [schoolObs, setSchoolObs] = useState<any[]>([]);
    const [loadingSchoolObs, setLoadingSchoolObs] = useState(false);
    const [showIndividualScores, setShowIndividualScores] = useState(false);
    const [showTargetAnalytics, setShowTargetAnalytics] = useState(false);
    const [showToolAnalytics, setShowToolAnalytics] = useState(false);

    // Schedule Event state
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        type: "Pedagogy",
        entryType: "Training Event",
        date: undefined as Date | undefined,
        time: "",
        location: "",
        capacity: 30,
        teacherId: "",
        teacherName: "",
    });

    const handleScheduleEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.date) {
            toast.error("Please fill in required fields (Title, Date).");
            return;
        }
        try {
            const payload = {
                title: newEvent.title,
                topic: newEvent.type,
                type: newEvent.type,
                date: newEvent.date ? format(newEvent.date, "MMM d, yyyy") : "",
                time: newEvent.time,
                location: newEvent.location,
                capacity: newEvent.capacity,
                entryType: newEvent.entryType,
                ...(newEvent.entryType === 'Observation' && {
                    teacherId: newEvent.teacherId,
                    teacherName: newEvent.teacherName,
                }),
            };
            await api.post('/training', payload);
            toast.success("Event scheduled successfully!");
            setIsScheduleOpen(false);
            setNewEvent({ title: "", type: "Pedagogy", entryType: "Training Event", date: undefined, time: "", location: "", capacity: 30, teacherId: "", teacherName: "" });
        } catch (err) {
            toast.error("Failed to schedule event.");
        }
    };

    const closeAnalytics = () => {
        setShowIndividualScores(false);
        setShowTargetAnalytics(false);
        setShowToolAnalytics(false);
    };

    // Per-teacher observation history state
    const [observations, setObservations] = useState<any[]>([]);
    const [loadingObs, setLoadingObs] = useState(false);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const data = await userService.getTeachers();
                setTeachers(data);
                const teacher = teacherId ? data.find((t: User) => t.id === teacherId) : null;
                setSelectedTeacher(teacher || null);
            } catch (err) {
                toast.error("Failed to load teachers");
            } finally {
                setLoading(false);
            }
        };
        fetchTeachers();
    }, [teacherId]);

    // Fetch school-wide observations for analytics (landing view only)
    useEffect(() => {
        if (!teacherId) {
            const fetchSchoolObs = async () => {
                setLoadingSchoolObs(true);
                try {
                    const response = await api.get('/growth/observations');
                    if (response.data?.status === 'success') {
                        setSchoolObs(response.data.data.observations || []);
                    }
                } catch (err) {
                    console.error("Failed to load school observations", err);
                } finally {
                    setLoadingSchoolObs(false);
                }
            };
            fetchSchoolObs();
        }
    }, [teacherId]);

    useEffect(() => {
        if (selectedTeacher) {
            const fetchObservations = async () => {
                setLoadingObs(true);
                try {
                    const response = await api.get('/growth/observations', {
                        params: { teacherId: selectedTeacher.id }
                    });
                    if (response.data?.status === 'success') {
                        setObservations(response.data.data.observations || []);
                    }
                } catch (err) {
                    console.error("Failed to load observations", err);
                } finally {
                    setLoadingObs(false);
                }
            };
            fetchObservations();
        } else {
            setObservations([]);
        }
    }, [selectedTeacher]);

    const handleTeacherSelect = (teacher: User) => {
        navigate(`/leader/growth/${teacher.id}`);
    };

    if (!user) return null;

    // ── Analytics computations ─────────────────────────────────────────────────

    // 1. Observation target: count observations created by this leader
    const myObsCount = schoolObs.filter(
        (o: any) => o.observerId === user.id || o.observer?.id === user.id
    ).length;
    const targetPct = Math.min(100, Math.round((myObsCount / OBSERVATION_TARGET) * 100));

    // 2. Average tool usage per observation
    const extractToolCount = (obs: any): { instructional: number; learning: number; cultural: number } => {
        const tryArr = (val: any): any[] => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            try { return JSON.parse(val); } catch { return []; }
        };

        let d = obs.data || obs.formData;
        if (!d && obs.formPayload) {
            try {
                d = typeof obs.formPayload === 'string' ? JSON.parse(obs.formPayload) : obs.formPayload;
            } catch { d = {}; }
        }
        d = d || {};

        const instructionalTools = tryArr(d.instructionalTools || d.instructional_tools || obs.instructionalTools);
        const genericTools = tryArr(d.tools || obs.tools);

        return {
            instructional: instructionalTools.length + genericTools.length,
            learning: tryArr(d.learningTools || d.learning_tools || obs.learningTools).length,
            cultural: tryArr(d.culturalTools || d.cultural_tools || obs.culturalTools).length,
        };
    };

    const toolTotals = schoolObs.reduce(
        (acc: any, obs: any) => {
            const t = extractToolCount(obs);
            return { instructional: acc.instructional + t.instructional, learning: acc.learning + t.learning, cultural: acc.cultural + t.cultural };
        },
        { instructional: 0, learning: 0, cultural: 0 }
    );
    const totalObs = schoolObs.length || 1;
    const avgInstructional = (toolTotals.instructional / totalObs).toFixed(1);
    const avgLearning = (toolTotals.learning / totalObs).toFixed(1);
    const avgCultural = (toolTotals.cultural / totalObs).toFixed(1);

    // 3. Average school score (ED + Specialist)
    const scoredObs = schoolObs.filter((o: any) => (o.overallRating ?? o.score) != null);
    const avgScore = scoredObs.length > 0
        ? (scoredObs.reduce((sum: number, o: any) => sum + (parseFloat(o.overallRating) || parseFloat(o.score) || 0), 0) / scoredObs.length).toFixed(2)
        : "—";

    // Per-teacher breakdown for drill-down
    const perTeacher = teachers
        .map((t: User) => {
            const tObs = scoredObs.filter((o: any) => o.teacherId === t.id || o.teacher?.id === t.id);
            const avg = tObs.length > 0
                ? (tObs.reduce((s: number, o: any) => s + (parseFloat(o.overallRating) || parseFloat(o.score) || 0), 0) / tObs.length).toFixed(2)
                : null;
            return { teacher: t, avg, count: tObs.length };
        })
        .filter((x: any) => x.avg !== null);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <GrowthLayout allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
            <div className="space-y-8 animate-in fade-in duration-500">
                {!selectedTeacher ? (
                    <>
                        {/* Header */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Observation Module</h1>
                                <p className="text-muted-foreground">Select a teacher to view their professional observation modules.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate("/leader/meetings")}
                                    className="gap-2 border-[#c2cca6] bg-[#f4efe6] hover:bg-[#e9e3d8] text-[#3b522d] shadow-sm font-medium"
                                >
                                    <Users className="w-4 h-4" />
                                    Meetings
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate("/leader/notes")}
                                    className="gap-2 border-[#c2cca6] bg-[#f4efe6] hover:bg-[#e9e3d8] text-[#3b522d] shadow-sm font-medium"
                                >
                                    <FileText className="w-4 h-4" />
                                    Notes
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsScheduleOpen(true)}
                                    className="gap-2 border-[#c2cca6] bg-[#f4efe6] hover:bg-[#e9e3d8] text-[#3b522d] shadow-sm font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    Schedule Event/Observations
                                </Button>
                            </div>
                        </div>

                        {/* ── 3 Analytics Cards ──────────────────────────────────────── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                            {/* Card 1 – Observation Targets (clickable → target analytics) */}
                            <Card
                                className="border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                                onClick={() => { closeAnalytics(); setShowTargetAnalytics(true); }}
                            >
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <Target className="w-4 h-4 text-primary" />
                                        </div>
                                        Observation Targets
                                        <span className="ml-auto text-[10px] text-primary font-normal hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity">View Analytics →</span>
                                    </CardTitle>
                                    <CardDescription className="text-xs">Your observations this cycle</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loadingSchoolObs ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-end justify-between">
                                                <span className="text-4xl font-black text-primary group-hover:scale-110 transition-transform origin-left">{myObsCount}</span>
                                                <span className="text-sm text-muted-foreground mb-1">/ {OBSERVATION_TARGET} target</span>
                                            </div>
                                            <Progress value={targetPct} className="h-2" />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{targetPct}% complete</span>
                                                <span>{Math.max(0, OBSERVATION_TARGET - myObsCount)} remaining</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-1">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        targetPct >= 100
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : targetPct >= 50
                                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                : "bg-red-50 text-red-700 border-red-200"
                                                    }
                                                >
                                                    {targetPct >= 100 ? "✓ Target Met" : targetPct >= 50 ? "In Progress" : "Needs Attention"}
                                                </Badge>
                                                <Button
                                                    variant="link"
                                                    className="p-0 h-auto text-[10px] text-emerald-600 font-bold group-hover:translate-x-1 transition-transform"
                                                    onClick={(e) => { e.stopPropagation(); closeAnalytics(); setShowTargetAnalytics(true); }}
                                                >
                                                    View Full Analytical View →
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Card 2 – Average Tool Usage (clickable → analytics dashboard) */}
                            <Card
                                className="border shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                                onClick={() => { closeAnalytics(); setShowToolAnalytics(true); }}
                            >
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <div className="p-1.5 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                            <Wrench className="w-4 h-4 text-blue-600" />
                                        </div>
                                        Avg Tool Usage
                                        <span className="ml-auto text-[10px] text-emerald-600 font-normal hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity">View Analytics →</span>
                                    </CardTitle>
                                    <CardDescription className="text-xs">Tools per observation (school-wide)</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loadingSchoolObs ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                    ) : (
                                        <div className="space-y-3 pt-1">
                                            {[
                                                { label: "Instructional", value: avgInstructional, color: "bg-blue-500" },
                                                { label: "Learning", value: avgLearning, color: "bg-purple-500" },
                                                { label: "Cultural", value: avgCultural, color: "bg-amber-500" },
                                            ].map(({ label, value, color }) => (
                                                <div key={label} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${color}`} />
                                                        <span className="text-sm text-muted-foreground">{label}</span>
                                                    </div>
                                                    <span className="text-lg font-bold tabular-nums">{value}</span>
                                                </div>
                                            ))}
                                            <p className="text-[10px] text-muted-foreground pt-1 border-t">
                                                Based on {schoolObs.length} total observation{schoolObs.length !== 1 ? 's' : ''}
                                            </p>
                                            <div className="pt-1">
                                                <Button
                                                    variant="link"
                                                    className="p-0 h-auto text-xs text-emerald-600 font-semibold group-hover:underline"
                                                    onClick={(e) => { e.stopPropagation(); closeAnalytics(); setShowToolAnalytics(true); }}
                                                >
                                                    View Full Analytics →
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>


                            {/* Card 3 – Avg School Observation Score (double-click → drill-down) */}
                            <Card
                                className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer select-none"
                                onClick={() => { closeAnalytics(); setShowIndividualScores(true); }}
                                title="Click to view individual scores"
                            >
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                            <BarChart3 className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        Avg Obs Score
                                    </CardTitle>
                                    <CardDescription className="text-xs">School-wide average (ED + Specialist)</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loadingSchoolObs ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-end gap-2">
                                                <span className="text-5xl font-black text-emerald-600 leading-none">{avgScore}</span>
                                                {avgScore !== "—" && <span className="text-muted-foreground text-sm mb-1">/4</span>}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {scoredObs.length} scored observation{scoredObs.length !== 1 ? 's' : ''}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full text-xs gap-1 border border-dashed"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (showIndividualScores) {
                                                        setShowIndividualScores(false);
                                                    } else {
                                                        closeAnalytics();
                                                        setShowIndividualScores(true);
                                                    }
                                                }}
                                            >
                                                {showIndividualScores ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                {showIndividualScores ? "Hide" : "View"} Individual Scores
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Target Analytics Drill-down ───────────────────────────────── */}
                        {showTargetAnalytics && (
                            <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
                                <Card className="border shadow-md bg-white">
                                    <CardHeader className="pb-3 border-b bg-primary/5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                                    <Target className="w-5 h-5 text-primary" />
                                                    Observer Target Progress
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    Professional cycle progress tracking for all observers
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => setShowTargetAnalytics(false)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="grid gap-6">
                                            {(() => {
                                                // Group by observer
                                                const observerMap: Record<string, { name: string; count: number }> = {};
                                                schoolObs.forEach(obs => {
                                                    const id = obs.observerId || obs.observer?.id;
                                                    const name = obs.observer?.fullName || obs.observerName || "Unknown Observer";
                                                    if (!id) return;
                                                    if (!observerMap[id]) observerMap[id] = { name, count: 0 };
                                                    observerMap[id].count++;
                                                });

                                                const observers = Object.entries(observerMap)
                                                    .map(([id, data]) => ({ id, ...data }))
                                                    .sort((a, b) => b.count - a.count);

                                                if (observers.length === 0) return <p className="text-center text-muted-foreground py-10">No observation data available to track targets.</p>;

                                                return observers.map(obs => {
                                                    const pct = Math.min(100, Math.round((obs.count / OBSERVATION_TARGET) * 100));
                                                    return (
                                                        <div key={obs.id} className="space-y-2">
                                                            <div className="flex items-center justify-between font-bold">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                                                                        {obs.name.charAt(0)}
                                                                    </div>
                                                                    <span className="text-sm">{obs.name}</span>
                                                                </div>
                                                                <span className="text-xs">{obs.count} / {OBSERVATION_TARGET}</span>
                                                            </div>
                                                            <Progress value={pct} className="h-2" />
                                                            <div className="flex justify-between text-[10px] font-bold capitalize tracking-wider text-muted-foreground">
                                                                <span>{pct}% Target Completion</span>
                                                                <span className={pct >= 100 ? "text-emerald-600" : "text-amber-600"}>
                                                                    {pct >= 100 ? "Met" : `${OBSERVATION_TARGET - obs.count} remaining`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* ── Tool Analytics Drill-down ───────────────────────────────── */}
                        {showToolAnalytics && (
                            <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
                                <Card className="border shadow-md bg-white">
                                    <CardHeader className="pb-3 border-b bg-blue-50/50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                                    <Wrench className="w-5 h-5 text-blue-600" />
                                                    Detailed Tool Insights
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    Breakdown of resource utilization across all observations
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => setShowToolAnalytics(false)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-8">
                                            {/* Tool Distribution Summary */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[
                                                    { label: "Instructional Tools", value: avgInstructional, total: toolTotals.instructional, color: "text-blue-600", bg: "bg-blue-50" },
                                                    { label: "Learning Tools", value: avgLearning, total: toolTotals.learning, color: "text-purple-600", bg: "bg-purple-50" },
                                                    { label: "Cultural Tools", value: avgCultural, total: toolTotals.cultural, color: "text-amber-600", bg: "bg-amber-50" },
                                                ].map(tool => (
                                                    <div key={tool.label} className={`${tool.bg} rounded-2xl p-4 border border-transparent hover:border-zinc-200 transition-all`}>
                                                        <p className="text-[10px] font-black capitalize text-muted-foreground mb-1">{tool.label}</p>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className={`text-3xl font-black ${tool.color}`}>{tool.value}</span>
                                                            <span className="text-[10px] font-bold text-muted-foreground">avg / obs</span>
                                                        </div>
                                                        <p className="text-xs font-medium text-muted-foreground mt-2">
                                                            Total used: <strong>{tool.total}</strong> times
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Tool Usage Over Observations List */}
                                            <div className="bg-zinc-50 rounded-2xl p-6">
                                                <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                                                    <BarChart3 className="w-4 h-4 text-zinc-400" />
                                                    Observation Tool Breakdown
                                                </h4>
                                                <div className="space-y-3">
                                                    {schoolObs.slice(0, 10).map((obs, i) => {
                                                        const tools = extractToolCount(obs);
                                                        const total = tools.instructional + tools.learning + tools.cultural;
                                                        return (
                                                            <div key={obs.id || i} className="bg-white p-3 rounded-xl border flex items-center justify-between text-xs">
                                                                <div className="space-y-0.5">
                                                                    <p className="font-bold">{obs.moduleType?.replace(/_/g, ' ') || 'Observation'}</p>
                                                                    <p className="text-[10px] text-muted-foreground">{format(new Date(obs.observationDate || obs.createdAt), "MMM d, yyyy")}</p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Badge variant="outline" className="text-[9px] bg-blue-50 border-blue-100">{tools.instructional} Inst</Badge>
                                                                    <Badge variant="outline" className="text-[9px] bg-purple-50 border-purple-100">{tools.learning} Learn</Badge>
                                                                    <Badge variant="outline" className="text-[9px] bg-amber-50 border-amber-100">{tools.cultural} Cult</Badge>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {schoolObs.length > 10 && (
                                                        <p className="text-center text-[10px] text-muted-foreground font-bold capitalize pt-2">
                                                            + {schoolObs.length - 10} more observations
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* ── Individual Scores Drill-down ───────────────────────────────── */}
                        {showIndividualScores && (
                            <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
                                <Card className="border shadow-sm">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                                <BarChart3 className="w-4 h-4 text-primary" />
                                                Individual Observation Scores
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => setShowIndividualScores(false)}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {perTeacher.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-4">No scored observations yet.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {[...perTeacher]
                                                    .sort((a: any, b: any) => parseFloat(b.avg!) - parseFloat(a.avg!))
                                                    .map(({ teacher, avg, count }: any) => {
                                                        const score = parseFloat(avg!);
                                                        const pct = Math.min(100, (score / 4) * 100);
                                                        return (
                                                            <div key={teacher.id} className="flex items-center gap-3">
                                                                <div className="w-36 shrink-0">
                                                                    <p className="text-xs font-semibold truncate">{teacher.fullName}</p>
                                                                    <p className="text-[10px] text-muted-foreground">{count} obs</p>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full transition-all duration-500 ${score >= 3 ? 'bg-emerald-500' : score >= 2 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                                            style={{ width: `${pct}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <span className={`text-sm font-bold w-10 text-right tabular-nums ${score >= 3 ? 'text-emerald-600' : score >= 2 ? 'text-amber-600' : 'text-red-600'}`}>
                                                                    {avg}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* ── Teachers Registry ──────────────────────────────────────────── */}
                        <Card className="  shadow-none bg-transparent">
                            <CardHeader className="px-0">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    Teachers Registry
                                </CardTitle>
                                <CardDescription>Select a teacher from your campus.</CardDescription>
                            </CardHeader>
                            <CardContent className="px-0">
                                <TeacherSelection teachers={teachers} onSelect={handleTeacherSelect} />
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <div className="animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{selectedTeacher.fullName}</h1>
                                <p className="text-muted-foreground font-medium">
                                    {selectedTeacher.department} • {selectedTeacher.academics === 'CORE' ? 'Core Academic' : 'Non-Core Academic'}
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${selectedTeacher.academics === 'CORE'
                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                : 'bg-purple-100 text-purple-700 border border-purple-200'
                                }`}>
                                {selectedTeacher.academics === 'CORE' ? 'Ekya ED Track' : 'Specialist Track'}
                            </div>
                        </div>

                        {/* ── Observation Progression Chart ─────────────────────────────── */}
                        {loadingObs ? (
                            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                        ) : (
                            <div className="mb-8 space-y-4">
                                {/* Teacher stat row */}
                                {(() => {
                                    const scored = observations.filter((o: any) => (o.overallRating ?? o.score) != null);
                                    const avg = scored.length > 0
                                        ? (scored.reduce((s: number, o: any) => s + (parseFloat(o.overallRating) || parseFloat(o.score) || 0), 0) / scored.length).toFixed(2)
                                        : "—";
                                    const modules = [...new Set(observations.map((o: any) => o.moduleType).filter(Boolean))];
                                    const latest = observations.length > 0
                                        ? format(new Date(observations[observations.length - 1].observationDate || observations[observations.length - 1].createdAt), "MMM d, yyyy")
                                        : "—";
                                    return (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { label: "Total Observations", value: observations.length, color: "text-primary" },
                                                { label: "Avg Score", value: `${avg}${avg !== "—" ? " /4" : ""}`, color: "text-emerald-600" },
                                                { label: "Modules Observed", value: modules.length, color: "text-blue-600" },
                                                { label: "Latest Observation", value: latest, color: "text-muted-foreground" },
                                            ].map(({ label, value, color }) => (
                                                <div key={label} className="bg-muted/30 rounded-xl p-3 border">
                                                    <p className="text-[10px] text-muted-foreground capitalize tracking-wide font-semibold mb-1">{label}</p>
                                                    <p className={`text-lg font-black leading-tight ${color}`}>{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}

                                {/* Progression chart */}
                                <Card className="border shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-primary" />
                                            Observation Score Progression
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Score trend across all modules — chronological order
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {observations.length === 0 ? (
                                            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm border border-dashed rounded-xl">
                                                No observations recorded yet for this teacher.
                                            </div>
                                        ) : (() => {
                                            // Build chart data: one point per observation, coloured by module
                                            const sorted = [...observations].sort((a: any, b: any) =>
                                                new Date(a.observationDate || a.createdAt).getTime() -
                                                new Date(b.observationDate || b.createdAt).getTime()
                                            );
                                            const modules = [...new Set(sorted.map((o: any) => o.moduleType || 'General').filter(Boolean))];
                                            const MODULE_COLORS: Record<string, string> = {
                                                'DANIELSON': '#3b82f6',
                                                'QUICK_FEEDBACK': '#8b5cf6',
                                                'PERFORMING_ARTS': '#ec4899',
                                                'LIFE_SKILLS': '#f59e0b',
                                                'PE': '#10b981',
                                                'VISUAL_ARTS': '#f97316',
                                                'General': '#6b7280',
                                            };
                                            // Per-module lines: each module gets its own line
                                            // x-axis = observation index, y-axis = score
                                            const perModule: Record<string, { idx: number; score: number; date: string; subject: string }[]> = {};
                                            modules.forEach(m => perModule[m] = []);
                                            sorted.forEach((o: any, idx: number) => {
                                                const m = o.moduleType || 'General';
                                                perModule[m].push({
                                                    idx: idx + 1,
                                                    score: parseFloat(o.overallRating) || parseFloat(o.score) || 0,
                                                    date: format(new Date(o.observationDate || o.createdAt), 'MMM d'),
                                                    subject: o.subject || o.learningArea || 'General',
                                                });
                                            });
                                            // Merge into a flat chart data array with one entry per obs index
                                            const chartData = sorted.map((o: any, idx: number) => {
                                                const m = o.moduleType || 'General';
                                                const label = format(new Date(o.observationDate || o.createdAt), 'MMM d');
                                                const entry: any = { name: label, subject: o.subject || o.learningArea || '' };
                                                entry[m] = parseFloat(o.overallRating) || parseFloat(o.score) || 0;
                                                return entry;
                                            });
                                            return (
                                                <ResponsiveContainer width="100%" height={260}>
                                                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                                        <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 11 }} />
                                                        <Tooltip
                                                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                                                            formatter={(value: any, name: string) => [
                                                                `${value} / 4`,
                                                                name.replace(/_/g, ' ')
                                                            ]}
                                                        />
                                                        <Legend
                                                            formatter={(value) => value.replace(/_/g, ' ')}
                                                            wrapperStyle={{ fontSize: 11 }}
                                                        />
                                                        {modules.map((m: string) => (
                                                            <Line
                                                                key={m}
                                                                type="monotone"
                                                                dataKey={m}
                                                                name={m}
                                                                stroke={MODULE_COLORS[m] || '#94a3b8'}
                                                                strokeWidth={2.5}
                                                                dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                                                                activeDot={{ r: 7 }}
                                                                connectNulls={false}
                                                            />
                                                        ))}
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            );
                                        })()}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        <section className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b">
                                <h2 className="text-xl font-semibold">Focused Observation Modules</h2>
                            </div>
                            {selectedTeacher.academics === 'CORE'
                                ? <CoreModules
                                    teacherId={selectedTeacher.id}
                                    teacherName={selectedTeacher.fullName}
                                    teacherEmail={selectedTeacher.email}
                                />
                                : <NonCoreModules
                                    teacherId={selectedTeacher.id}
                                    teacherName={selectedTeacher.fullName}
                                    teacherEmail={selectedTeacher.email}
                                />
                            }
                        </section>

                        {/* Unified Observation History */}
                        <section className="mt-12 space-y-6 pt-8 border-t border-dashed">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <HistoryIcon className="w-5 h-5 text-primary" />
                                    Observation History
                                </h2>
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    {observations.length} Records
                                </Badge>
                            </div>

                            {loadingObs ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : observations.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                                    No observation history found for this teacher.
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {observations.map((obs: any) => (
                                        <Card key={obs.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-semibold tracking-wide">
                                                            {obs.moduleType?.replace('_', ' ') || 'Observation'}
                                                        </Badge>
                                                        <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                                            {format(new Date(obs.observationDate || obs.createdAt), "MMM d, yyyy")}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-lg text-foreground">
                                                        {obs.subject || obs.learningArea || 'General Subject'}
                                                    </h3>
                                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                                                        Observer: <span className="text-foreground">{obs.observer?.fullName || obs.observerName || 'Leader'}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[10px] capitalize tracking-widest text-muted-foreground font-black mb-1">Overall Score</p>
                                                    <div className="flex items-baseline justify-end gap-1">
                                                        <span className="text-3xl font-black text-primary leading-none">{obs.overallRating || obs.score || 0}</span>
                                                        <span className="text-sm font-bold text-muted-foreground/60">/4</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>

            {/* Schedule Event Dialog */}
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Schedule Training Event/Observations</DialogTitle>
                        <DialogDescription>Add a new session to the training calendar for your campus.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleScheduleEvent} className="space-y-4">
                        <div className="space-y-3">
                            <Label>Entry Type</Label>
                            <RadioGroup
                                value={newEvent.entryType}
                                onValueChange={(val) => setNewEvent({
                                    ...newEvent,
                                    entryType: val,
                                    type: val === 'Observation' ? 'Scheduled Observations' : 'Pedagogy'
                                })}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Training Event" id="g-type-event" />
                                    <Label htmlFor="g-type-event" className="cursor-pointer">Training Event</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Observation" id="g-type-obs" />
                                    <Label htmlFor="g-type-obs" className="cursor-pointer">Observation</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="g-event-title">{newEvent.entryType === 'Observation' ? 'Observation Title' : 'Event Title'}</Label>
                            <Input
                                id="g-event-title"
                                placeholder={newEvent.entryType === 'Observation' ? 'e.g. Peer Observation' : 'Workshop Name'}
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                required
                            />
                        </div>

                        {newEvent.entryType === 'Observation' && (
                            <div className="space-y-2">
                                <Label>Select Teacher</Label>
                                <Select
                                    value={newEvent.teacherId}
                                    onValueChange={(val) => {
                                        const teacher = teachers.find(t => t.id === val);
                                        setNewEvent({ ...newEvent, teacherId: val, teacherName: teacher?.fullName || "" });
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a teacher to observe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((teacher) => (
                                            <SelectItem key={teacher.id} value={teacher.id}>
                                                {teacher.fullName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="g-event-type">Type</Label>
                                <Select
                                    value={newEvent.type}
                                    onValueChange={(val) => setNewEvent({ ...newEvent, type: val })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {newEvent.entryType === 'Observation' ? (
                                            <SelectItem value="Scheduled Observations">Scheduled Observations</SelectItem>
                                        ) : (
                                            <>
                                                <SelectItem value="Pedagogy">Pedagogy</SelectItem>
                                                <SelectItem value="Technology">Technology</SelectItem>
                                                <SelectItem value="Assessment">Assessment</SelectItem>
                                                <SelectItem value="Culture">Culture</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !newEvent.date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={newEvent.date}
                                            onSelect={(d) => d && setNewEvent({ ...newEvent, date: d })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="g-event-time">Time</Label>
                            <Select
                                value={newEvent.time}
                                onValueChange={(val) => setNewEvent({ ...newEvent, time: val })}
                            >
                                <SelectTrigger id="g-event-time">
                                    <SelectValue placeholder="Select Time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_SLOTS.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                            {slot}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="g-event-location">Location</Label>
                            <Input
                                id="g-event-location"
                                placeholder="Room/Lab Name"
                                value={newEvent.location}
                                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
                            <Button type="submit">Schedule Event</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </GrowthLayout>
    );
};

export default LeaderGrowthPage;
