import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Role } from "@/components/RoleBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Calendar, Plus, MessageSquare, Search, FileText,
    Loader2, User, Clock, ChevronRight, ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/api";

const TYPE_CONFIG = {
    scheduled: {
        label: "Scheduled Observation",
        icon: Calendar,
        color: "emerald",
        description: "Planned classroom observations with prior scheduling.",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        headerClass: "from-emerald-600 to-emerald-800",
        buttonClass: "bg-emerald-600 hover:bg-emerald-700",
    },
    unscheduled: {
        label: "Unscheduled Observation",
        icon: Plus,
        color: "blue",
        description: "Drop-in classroom observations recorded immediately.",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
        headerClass: "from-blue-600 to-blue-800",
        buttonClass: "bg-blue-600 hover:bg-blue-700",
    },
    "quick-feedback": {
        label: "Quick Feedback",
        icon: MessageSquare,
        color: "amber",
        description: "Short professional feedback notes for teachers.",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
        headerClass: "from-amber-500 to-amber-700",
        buttonClass: "bg-amber-500 hover:bg-amber-600",
    },
} as const;

type ObsType = keyof typeof TYPE_CONFIG;

const ClusterObservationPage: React.FC = () => {
    const { clusterId, type } = useParams<{ clusterId: string; type: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [observations, setObservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const config = TYPE_CONFIG[(type as ObsType) ?? "scheduled"] ?? TYPE_CONFIG.scheduled;
    const Icon = config.icon;
    const clusterNum = parseInt(clusterId || "1");

    useEffect(() => {
        const fetchObservations = async () => {
            try {
                const res = await api.get(`/observations`, {
                    params: { clusterNumber: clusterNum, type: type }
                });
                const all = res.data?.data?.observations ?? [];
                // Filter by type on frontend as fallback
                const filtered = all.filter((o: any) => {
                    if (type === 'scheduled') return o.type === 'scheduled' || o.domain?.toLowerCase().includes(`cluster ${clusterNum}`);
                    if (type === 'unscheduled') return o.type === 'unscheduled';
                    if (type === 'quick-feedback') return o.type === 'quick-feedback';
                    return true;
                });
                setObservations(all);
            } catch (err) {
                console.error("Failed to load observations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchObservations();
    }, [clusterId, type]);

    const filtered = observations.filter((o: any) => {
        const name = o.teacher?.fullName?.toLowerCase() ?? "";
        const subject = o.learningArea?.toLowerCase() ?? "";
        const q = search.toLowerCase();
        return name.includes(q) || subject.includes(q);
    });

    return (
        <DashboardLayout role={(user?.role?.toLowerCase() || "leader") as Role} userName={user?.fullName || ""}>
            <div className="min-h-screen bg-slate-50/50">
                {/* Top Navigation Bar with Actions */}
                <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between flex-wrap gap-4">
                    <Button className="rounded-full bg-[#EA104A] text-white hover:bg-[#d00e42] hover:text-white gap-2 px-6 font-black text-[10px] uppercase tracking-widest" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Button>
                    <div className="flex gap-3 flex-wrap">
                        {type !== 'unscheduled' && type !== 'quick-feedback' && (
                            <Button
                                className="bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold gap-2 px-6 py-5 rounded-xl shadow-sm"
                                onClick={() => navigate(`/leader/observations/schedule?cluster=${clusterNum}&type=${type}`)}
                            >
                                <Calendar className="w-5 h-5" />
                                Schedule Observation
                            </Button>
                        )}
                        <Button
                            className="bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold gap-2 px-6 py-5 rounded-xl shadow-sm"
                            onClick={() => {
                                if (clusterId === '1' && type === 'quick-feedback') {
                                    navigate(`/leader/cluster-1/quick-feedback/select`);
                                } else if (clusterId === '2' && type === 'quick-feedback') {
                                    navigate(`/leader/cluster-2/quick-feedback/select`);
                                } else if (clusterId === '3' && type === 'quick-feedback') {
                                    navigate(`/leader/cluster-3/quick-feedback/select`);
                                } else if (clusterId === '4' && type === 'quick-feedback') {
                                    navigate(`/leader/cluster-4/quick-feedback/select`);
                                } else {
                                    navigate(`/leader/observations/form/${clusterNum}/select/${type}`);
                                }
                            }}
                        >
                            <FileText className="w-5 h-5" />
                            {type === 'quick-feedback' ? 'QF Form' : 'Fill Form'}
                        </Button>
                        {type === 'quick-feedback' && ['1', '2', '3', '4'].includes(clusterId) && (
                            <Button
                                className="bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold gap-2 px-6 py-5 rounded-xl shadow-sm"
                                onClick={() => {
                                    navigate(`/leader/cluster-${clusterNum}/quick-feedback-specialist/select`);
                                }}
                            >
                                <FileText className="w-5 h-5" />
                                QF Form for Specialist
                            </Button>
                        )}
                    </div>
                </div>

                {/* Banner */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 mb-8">
                    <div className="relative h-[200px] md:h-[240px] overflow-hidden rounded-[2.5rem] shadow-2xl bg-[#EA104A]">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px] mix-blend-overlay" />
                        <div className="absolute right-0 bottom-[-40px] opacity-[0.08] pointer-events-none select-none z-0">
                            <span className="text-[160px] md:text-[260px] font-black tracking-tighter leading-none text-white">EKYA</span>
                        </div>
                        <div className="absolute inset-0 flex flex-col justify-center pl-10 md:pl-16">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Observation Registry</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-[0.9] uppercase drop-shadow-2xl">Cluster {clusterId} · {config.label}</h1>
                            <p className="text-white/80 font-medium text-sm mt-2">{config.desc}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-8 py-8 max-w-7xl mx-auto space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Total", value: observations.length },
                            { label: "Submitted", value: observations.filter(o => o.status === "SUBMITTED").length },
                            { label: "Draft", value: observations.filter(o => o.status === "DRAFT").length },
                            { label: "Reviewed", value: observations.filter(o => o.status === "REVIEWED").length },
                        ].map((stat) => (
                            <Card key={stat.label} className="border-none shadow-md rounded-2xl bg-white">
                                <CardContent className="p-6">
                                    <div className="text-3xl font-black text-[#1F2839]">{stat.value}</div>
                                    <div className="text-sm font-semibold text-slate-500 mt-1">{stat.label}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Registry Table */}
                    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
                        <CardHeader className="p-6 border-b bg-slate-50/50">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="text-xl font-bold text-[#1F2839]">
                                    Observation Registry
                                </CardTitle>
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Search teacher or subject..."
                                        className="pl-9 h-10 rounded-xl bg-white border-slate-200"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/80 border-b">
                                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Teacher</th>
                                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Grade</th>
                                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Subject</th>
                                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Observer</th>
                                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map((obs: any) => (
                                                <tr key={obs.id} className="border-b last:border-0 hover:bg-slate-50/60 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <User className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <span className="font-bold text-[#1F2839]">{obs.teacher?.fullName ?? "—"}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {obs.date ? format(new Date(obs.date), "MMM d, yyyy") : "—"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 font-medium">{obs.grade || "—"}</td>
                                                    <td className="px-6 py-4 text-slate-600 font-medium">{obs.learningArea || "—"}</td>
                                                    <td className="px-6 py-4 text-slate-600 font-medium">{obs.observer?.fullName ?? "—"}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge className={
                                                            obs.status === "SUBMITTED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                            obs.status === "DRAFT" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                            obs.status === "REVIEWED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                            "bg-slate-50 text-slate-600 border-slate-200"
                                                        }>
                                                            {obs.status ?? "—"}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity font-bold gap-1"
                                                            onClick={() => navigate(`/leader/observations/review/${obs.id}`)}
                                                        >
                                                            View <ChevronRight className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filtered.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-16 text-center text-slate-400 font-medium italic">
                                                        No observations found for this cluster and type.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ClusterObservationPage;
