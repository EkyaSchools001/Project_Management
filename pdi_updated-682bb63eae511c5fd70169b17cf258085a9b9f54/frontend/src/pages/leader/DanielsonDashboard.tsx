import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Filter, Calendar, Star, ChevronLeft, MessageSquare, Clock, MapPin, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { GrowthLayout } from "@/components/growth/GrowthLayout";

const RATING_COLORS: Record<string, string> = {
    "1": "bg-red-100 text-red-700",
    "2": "bg-yellow-100 text-yellow-700",
    "3": "bg-blue-100 text-blue-700",
    "4": "bg-green-100 text-green-700",
};

const RATING_LABELS: Record<string, string> = {
    "1": "Basic",
    "2": "Developing",
    "3": "Effective",
    "4": "Highly Effective",
};

const DanielsonDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const teacherId = searchParams.get("teacherId");
    
    // URL-based Filters
    const clusterFilter = searchParams.get("cluster") || "";
    const observationTypeFilter = searchParams.get("type") || "Scheduled Observation";
    const blockFilter = searchParams.get("block") || "";
    const gradeFilter = searchParams.get("grade") || "";
    const ratingFilter = searchParams.get("rating") || "";
    const searchText = searchParams.get("search") || "";

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all") params.set(key, value);
        else params.delete(key);
        setSearchParams(params, { replace: true });
    };

    const [observations, setObservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleData, setScheduleData] = useState({
        title: "",
        teacherId: "",
        type: "Formal Observation",
        date: "",
        time: "",
        location: ""
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const params: any = { moduleType: "DANIELSON" };
                if (teacherId) params.teacherId = teacherId;
                const res = await api.get("/growth/observations", { params });
                const all = res.data?.data?.observations || res.data?.observations || [];

                const mappedObservations = all.map((obs: any) => {
                    let formPayload = obs.formPayload;
                    if (typeof formPayload === 'string') {
                        try { formPayload = JSON.parse(formPayload); } catch (e) { formPayload = {}; }
                    }
                    return {
                        id: obs.id,
                        teacherId: obs.teacherId,
                        observationDate: obs.observationDate,
                        teacher: obs.teacher?.fullName || formPayload?.teacherName || "Unknown Teacher",
                        overallRating: obs.overallRating || formPayload?.overallRating || "",
                        block: formPayload?.block || obs.classroom?.block || "",
                        grade: formPayload?.grade || obs.classroom?.grade || "",
                        cluster: formPayload?.cluster || obs.cluster || "",
                        observationType: obs.type || formPayload?.observationType || "Scheduled Observation",
                        status: obs.status || "Pending",
                        score: obs.score ?? formPayload?.overallRating ?? null,
                        detailedReflection: (() => {
                            if (!obs.detailedReflection) return null;
                            if (typeof obs.detailedReflection !== 'string') return obs.detailedReflection;
                            try { return JSON.parse(obs.detailedReflection); } catch (e) { return null; }
                        })()
                    };
                });

                setObservations(mappedObservations.sort((a: any, b: any) => 
                    new Date(b.observationDate || 0).getTime() - new Date(a.observationDate || 0).getTime()
                ));
            } catch {
                toast.error("Failed to load observations");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [teacherId]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await api.get("/users?role=TEACHER");
                setTeachers(res.data?.data?.users || []);
            } catch (err) {
                console.error("Failed to fetch teachers:", err);
            }
        };
        fetchTeachers();
    }, []);

    const handleScheduleSubmit = async () => {
        if (!scheduleData.title || !scheduleData.teacherId || !scheduleData.date || !scheduleData.time || !scheduleData.location) {
            toast.error("Please fill all required fields");
            return;
        }
        try {
            setIsScheduling(true);
            const selectedTeacher = teachers.find(t => t.id === scheduleData.teacherId);
            await api.post("/training", {
                ...scheduleData,
                entryType: "Observation",
                topic: "Observation", 
                teacherName: selectedTeacher?.fullName,
                status: "PLANNED",
                capacity: 1
            });
            toast.success("Observation scheduled successfully!");
            setIsScheduleDialogOpen(false);
            setScheduleData({ title: "", teacherId: "", type: "Formal Observation", date: "", time: "", location: "" });
        } catch (err) {
            toast.error("Failed to schedule observation");
        } finally {
            setIsScheduling(false);
        }
    };

    if (!user) return null;

    const filtered = observations.filter(o => {
        const name = (o.teacher || "").toLowerCase();
        const rating = String(Math.round(Number(o.score) || 0));
        return (
            (!searchText || name.includes(searchText.toLowerCase())) &&
            (!blockFilter || o.block === blockFilter) &&
            (!gradeFilter || o.grade === gradeFilter) &&
            (!ratingFilter || rating === ratingFilter) &&
            (!clusterFilter || o.cluster === clusterFilter) &&
            (!observationTypeFilter || (o.observationType || "").toLowerCase().includes(observationTypeFilter.toLowerCase().split(' ')[0]))
        );
    });

    const clusterPrefix = clusterFilter ? `${clusterFilter} : ` : "";
    let modeSuffix = "Unified Observation System";
    const typeLower = (observationTypeFilter || "").toLowerCase().trim();
    
    if (typeLower.includes("unscheduled observation")) modeSuffix = "Unscheduled Observation form";
    else if (typeLower.includes("scheduled observation")) modeSuffix = "Scheduled Observation form";
    else if (typeLower.includes("quick feedback")) modeSuffix = "Quick Feedback Observation form";
    
    const pageTitle = `${clusterPrefix}${modeSuffix}`;

    const newPath = `/leader/danielson-framework/new${teacherId ? `?teacherId=${teacherId}` : ""}`;

    const clusterStats = useMemo(() => {
        const stats: Record<string, { total: number; count: number }> = {};
        observations.forEach(obs => {
            if (obs.cluster && obs.score !== null) {
                if (!stats[obs.cluster]) stats[obs.cluster] = { total: 0, count: 0 };
                stats[obs.cluster].total += Number(obs.score);
                stats[obs.cluster].count += 1;
            }
        });
        return Object.entries(stats).map(([name, data]) => ({
            name,
            avg: Math.round(data.total / data.count)
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, [observations]);

    return (
        <GrowthLayout hideBackButton={true} allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Stats & Trends Section */}
                {clusterStats.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="md:col-span-3 border-none shadow-xl bg-white overflow-hidden rounded-[2rem]">
                            <CardHeader className="py-4 border-b bg-slate-50/50">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" /> Performance Trends by Cluster
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="h-[120px] flex items-end gap-4">
                                    {clusterStats.map(stat => (
                                        <div key={stat.name} className="flex-1 flex flex-col items-center gap-2 group">
                                            <div 
                                                className="w-full bg-primary/10 rounded-t-xl group-hover:bg-primary/20 transition-all relative"
                                                style={{ height: `${stat.avg}%` }}
                                            >
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">{stat.avg}%</div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter text-center h-4 overflow-hidden">{stat.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-xl bg-primary text-white overflow-hidden rounded-[2rem]">
                            <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
                                <Star className="w-8 h-8 text-yellow-300 mb-2 animate-pulse" />
                                <div className="text-4xl font-black">{Math.round(observations.reduce((acc, o) => acc + (Number(o.score) || 0), 0) / (observations.length || 1))}%</div>
                                <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-1">Global Average</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Header Navigation */}
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="sm" className="h-auto gap-2 text-[#476682] p-0 font-medium" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-5 h-5" /> Back
                    </Button>
                    <div className="h-5 w-[1px] bg-slate-200 mx-1" />
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-[#476682] hover:underline cursor-pointer" onClick={() => navigate("/leader/growth")}>Observation Module</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-[#1F2839] font-bold">Unified Observation System</span>
                    </div>
                </div>

                {/* Title & Actions Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl text-white" style={{ background: "#1F2839" }}><Eye className="w-6 h-6" /></div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#1F2839]">{pageTitle}</h1>
                            <p className="text-sm text-muted-foreground">Unified Observation, Feedback & Improvement Form</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {observationTypeFilter === "Scheduled Observation" && (
                            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="h-12 gap-2 font-bold px-6 rounded-xl border-2 border-[#1F2839] text-[#1F2839]">
                                        <Calendar className="w-5 h-5" /> Schedule It
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none">
                                    <div className="bg-[#1F2839] p-6 text-white">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold">Schedule Observation</DialogTitle>
                                            <DialogDescription className="text-slate-300">Add a new observation session to the calendar.</DialogDescription>
                                        </DialogHeader>
                                    </div>
                                    <div className="p-6 space-y-5 bg-slate-50">
                                        <Input placeholder="Observation Title" className="rounded-xl h-11" value={scheduleData.title} onChange={e => setScheduleData({...scheduleData, title: e.target.value})} />
                                        <Select value={scheduleData.teacherId} onValueChange={v => setScheduleData({...scheduleData, teacherId: v})}>
                                            <SelectTrigger className="rounded-xl h-11 bg-white"><SelectValue placeholder="Select Teacher" /></SelectTrigger>
                                            <SelectContent className="max-h-[200px]">
                                                {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Select value={scheduleData.type} onValueChange={v => setScheduleData({...scheduleData, type: v})}>
                                                <SelectTrigger className="rounded-xl h-11 bg-white"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Formal Observation">Formal Observation</SelectItem>
                                                    <SelectItem value="Informal Observation">Informal Observation</SelectItem>
                                                    <SelectItem value="Peer Review">Peer Review</SelectItem>
                                                    <SelectItem value="Walkthrough">Walkthrough</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input type="date" className="rounded-xl h-11 bg-white" value={scheduleData.date} onChange={e => setScheduleData({...scheduleData, date: e.target.value})} />
                                        </div>
                                        <Select value={scheduleData.time} onValueChange={v => setScheduleData({...scheduleData, time: v})}>
                                            <SelectTrigger className="rounded-xl h-11 bg-white"><SelectValue placeholder="Select Time" /></SelectTrigger>
                                            <SelectContent>
                                                {["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <Input placeholder="Location (Room/Lab)" className="rounded-xl h-11 bg-white" value={scheduleData.location} onChange={e => setScheduleData({...scheduleData, location: e.target.value})} />
                                        <div className="flex gap-3 pt-2">
                                            <Button variant="ghost" onClick={() => setIsScheduleDialogOpen(false)} className="flex-1 h-11 rounded-xl">Cancel</Button>
                                            <Button className="flex-1 h-11 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white" onClick={handleScheduleSubmit} disabled={isScheduling}>
                                                {isScheduling ? "Scheduling..." : "Schedule Event"}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                        <div className="flex gap-2">
                            <Button 
                                onClick={() => {
                                    const clusterNum = clusterFilter ? clusterFilter.replace('Cluster ', '') : '1';
                                    navigate(`/leader/observations/schedule?cluster=${clusterNum}`);
                                }} 
                                className="h-12 gap-2 font-bold px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            >
                                <Calendar className="w-5 h-5" /> Schedule
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Cluster Selection Row */}
                <div className="flex flex-wrap gap-3 mb-2">
                    {["Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4", "Cluster 5"].map((c) => (
                        <Button 
                            key={c}
                            variant="outline"
                            onClick={() => updateFilter("cluster", c)}
                            className={`h-14 px-8 rounded-2xl font-bold transition-all shadow-sm ${clusterFilter === c ? "bg-[#1F2839] text-white border-[#1F2839]" : "bg-white text-[#1F2839] border-slate-200 hover:bg-slate-50"}`}
                        >
                            {c}
                        </Button>
                    ))}
                    {clusterFilter && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-400 font-bold hover:text-red-500"
                            onClick={() => updateFilter("cluster", "all")}
                        >
                            Clear Cluster Filter
                        </Button>
                    )}
                </div>

                {/* Observation Type Selection Row (Direct Navigation) */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {["Scheduled Observation"].map((t) => (
                        <Button 
                            key={t}
                            variant="outline"
                            onClick={() => updateFilter("type", t)}
                            className={`h-12 px-6 rounded-xl font-bold transition-all shadow-sm ${observationTypeFilter === t ? "bg-[#B69D74] text-white border-[#B69D74]" : "bg-white text-[#476682] border-slate-200 hover:bg-slate-50"}`}
                        >
                            {t}
                        </Button>
                    ))}
                </div>

                {/* Secondary Search & Refinement */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search teacher..." className="pl-9 h-11 rounded-xl bg-white border-slate-200 shadow-sm" value={searchText} onChange={e => updateFilter("search", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 flex-[1.5]">
                        <Select value={blockFilter || "all"} onValueChange={v => updateFilter("block", v)}>
                            <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200"><SelectValue placeholder="All Blocks" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Blocks</SelectItem>
                                {["Early Years", "Primary", "Middle", "Senior"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={gradeFilter || "all"} onValueChange={v => updateFilter("grade", v)}>
                            <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200"><SelectValue placeholder="All Grades" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Grades</SelectItem>
                                {["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={ratingFilter || "all"} onValueChange={v => updateFilter("rating", v)}>
                            <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200"><SelectValue placeholder="All Ratings" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Ratings</SelectItem>
                                <SelectItem value="1">1 – Basic</SelectItem>
                                <SelectItem value="2">2 – Developing</SelectItem>
                                <SelectItem value="3">3 – Effective</SelectItem>
                                <SelectItem value="4">4 – Highly Effective</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Observation History Table */}
                <Card className="shadow-sm overflow-hidden border-none rounded-[2rem]">
                    <CardHeader className="py-5 px-8 border-b bg-[#1F2839]">
                        <div className="grid grid-cols-11 gap-2 text-xs font-bold text-white uppercase tracking-widest">
                            <span>Sr.</span>
                            <span>Date</span>
                            <span className="col-span-2">Teacher</span>
                            <span>Block</span>
                            <span>Grade</span>
                            <span>Rating</span>
                            <span className="col-span-2 text-right">Action</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-20 text-muted-foreground bg-white">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F2839] mr-3" />
                                Loading observations...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground bg-white">
                                <Eye className="w-16 h-16 opacity-10" />
                                <p className="text-xl font-bold text-slate-800">No observations found</p>
                                <Button onClick={() => navigate(newPath)} className="bg-[#B69D74] text-white font-bold rounded-xl px-8 h-12 shadow-lg">
                                    <Plus className="w-5 h-5 mr-2" /> Start First Observation
                                </Button>
                            </div>
                        ) : (
                            filtered.map((obs, idx) => (
                                <div key={obs.id} className={`grid grid-cols-11 gap-2 px-8 py-5 items-center hover:bg-slate-50 cursor-pointer border-b last:border-0 text-sm ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`} onClick={() => navigate(`/leader/danielson-framework/new?teacherId=${obs.teacherId}&id=${obs.id}`)}>
                                    <span className="font-bold text-slate-400">{(idx + 1).toString().padStart(2, '0')}</span>
                                    <span className="text-slate-600 font-medium">
                                        {obs.observationDate ? new Date(obs.observationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "—"}
                                    </span>
                                    <span className="col-span-2 font-bold text-[#1F2839]">{obs.teacher}</span>
                                    <span className="text-slate-600 font-medium">{obs.block}</span>
                                    <span className="text-slate-600 font-medium">{obs.grade}</span>
                                    <span>
                                        {obs.score ? (
                                            <Badge className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${RATING_COLORS[String(Math.round(obs.score))] || "bg-slate-100"}`}>
                                                {RATING_LABELS[String(Math.round(obs.score))] || obs.score}
                                            </Badge>
                                        ) : <Badge variant="outline" className="text-[10px] text-slate-400">PENDING</Badge>}
                                    </span>
                                    <span className="col-span-2 text-right">
                                        <Button variant="ghost" size="sm" className="h-9 px-4 text-xs font-black rounded-xl border hover:bg-slate-100" onClick={e => { e.stopPropagation(); navigate(`/leader/observations/review/${obs.id}`); }}>
                                            VIEW DETAILS <Eye className="w-4 h-4 ml-2" />
                                        </Button>
                                    </span>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
                {filtered.length > 0 && (
                    <p className="text-xs text-muted-foreground text-right mt-4 font-medium">
                        Showing <span className="text-[#1F2839] font-bold">{filtered.length}</span> recorded observation{filtered.length !== 1 ? "s" : ""}
                    </p>
                )}
            </div>
        </GrowthLayout>
    );
};

export default DanielsonDashboard;
