import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@pdi/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Badge } from "@pdi/components/ui/badge";
import { Input } from "@pdi/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { Music, Plus, Search, Filter, Calendar, Star, Eye } from "lucide-react";
import { useAuth } from "@pdi/hooks/useAuth";
import api from "@pdi/lib/api";
import { toast } from "sonner";
import { GrowthLayout } from "@pdi/components/growth/GrowthLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@pdi/components/ui/dialog";
import { MessageSquare } from "lucide-react";

interface PAObs {
    id: string;
    teacherId: string;
    observationDate: string;
    teacherName: string;
    block: string;
    grade: string;
    overallRating: number;
    observerName: string;
    hasReflection: boolean;
    teacherReflection: string;
    detailedReflection: any;
}

const RATING_LABELS: Record<number, { label: string; color: string }> = {
    1: { label: "Basic", color: "bg-red-100 text-red-700" },
    2: { label: "Developing", color: "bg-yellow-100 text-yellow-700" },
    3: { label: "Effective", color: "bg-blue-100 text-blue-700" },
    4: { label: "Highly Effective", color: "bg-green-100 text-green-700" },
};

const PerformingArtsObsDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const teacherId = searchParams.get("teacherId");
    const [observations, setObservations] = useState<PAObs[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState(searchParams.get("q") || "");
    const [blockFilter, setBlockFilter] = useState(searchParams.get("block") || "");
    const [gradeFilter, setGradeFilter] = useState(searchParams.get("grade") || "");
    const [ratingFilter, setRatingFilter] = useState(searchParams.get("rating") || "");

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (searchText) params.set("q", searchText); else params.delete("q");
        if (blockFilter) params.set("block", blockFilter); else params.delete("block");
        if (gradeFilter) params.set("grade", gradeFilter); else params.delete("grade");
        if (ratingFilter) params.set("rating", ratingFilter); else params.delete("rating");
        setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, blockFilter, gradeFilter, ratingFilter]);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const params: any = { moduleType: 'PERFORMING_ARTS' };
                if (teacherId) params.teacherId = teacherId;
                if (blockFilter) params.block = blockFilter;
                if (gradeFilter) params.grade = gradeFilter;
                if (ratingFilter) params.rating = ratingFilter;
                const res = await api.get("/growth/observations", { params });

                // Map the unified observation format to the old PAObs interface
                const mappedObservations = (res.data?.data?.observations || []).map((obs: any) => {
                    let formPayload = obs.formPayload;
                    if (typeof formPayload === 'string') {
                        try { formPayload = JSON.parse(formPayload); } catch (e) { formPayload = {}; }
                    }
                    return {
                        id: obs.id,
                        teacherId: obs.teacherId,
                        observationDate: obs.observationDate,
                        teacherName: obs.teacher?.fullName || obs.teacherEmail || formPayload?.teacherName || "Unknown Teacher",
                        block: formPayload?.block || "",
                        grade: formPayload?.grade || "",
                        overallRating: obs.overallRating || formPayload?.overallRating || 0,
                        observerName: obs.observer?.fullName || formPayload?.observer || formPayload?.observerName || "Unknown Observer",
                        hasReflection: obs.hasReflection || false,
                        teacherReflection: obs.teacherReflection || "",
                        detailedReflection: (() => {
                            if (!obs.detailedReflection) return null;
                            if (typeof obs.detailedReflection !== 'string') return obs.detailedReflection;
                            try { return JSON.parse(obs.detailedReflection); } catch (e) { return null; }
                        })()
                    };
                });

                setObservations(mappedObservations);
            } catch (e) {
                toast.error("Failed to load observations");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockFilter, gradeFilter, ratingFilter]);

    if (!user) return null;

    const filtered = observations.filter(o =>
        (!searchText ||
            o.teacherName.toLowerCase().includes(searchText.toLowerCase()) ||
            o.observerName.toLowerCase().includes(searchText.toLowerCase())) &&
        (!teacherId || o.teacherId === teacherId)
    );

    const teacherName = searchParams.get("teacherName");
    const teacherEmail = searchParams.get("teacherEmail");

    let newFormPath = "/leader/performing-arts-obs/new";
    if (teacherId) {
        const params = new URLSearchParams();
        params.set("teacherId", teacherId);
        if (teacherName) params.set("teacherName", teacherName);
        if (teacherEmail) params.set("teacherEmail", teacherEmail);
        newFormPath += `?${params.toString()}`;
    }

    return (

        <GrowthLayout allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
            <div className="animate-in fade-in duration-500 min-h-screen" style={{ background: "#F5F5EF", paddingBottom: "40px" }}>
                <div className="rounded-3xl border-2 overflow-hidden mt-4" style={{ borderColor: "#B69D74" }}>
                    <div className="p-6 md:p-8 lg:p-10 space-y-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl text-white shadow-md" style={{ background: "#B69D74" }}>
                                    <Music className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold" style={{ color: "#1F2839" }}>Performing Arts Observations</h1>
                                    <p className="text-sm text-muted-foreground font-medium italic">AY 25-26 · Music, Dance & Drama</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate(newFormPath)}
                                style={{ background: "#B69D74", color: "white" }}
                                className="hover:opacity-90 flex items-center gap-2 font-bold shadow-sm hover:shadow-md transition-all duration-300 px-6 h-11"
                            >
                                <Plus className="w-4 h-4" /> New Observation
                            </Button>
                        </div>

                        {/* Filters */}
                        <Card className="mb-6   shadow-sm" style={{ background: "white" }}>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search teacher / observer..."
                                            className="pl-9"
                                            value={searchText}
                                            onChange={e => setSearchText(e.target.value)}
                                        />
                                    </div>
                                    <Select value={blockFilter} onValueChange={v => setBlockFilter(v === "all" ? "" : v)}>
                                        <SelectTrigger><SelectValue placeholder="All Blocks" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Blocks</SelectItem>
                                            {["Early Years", "Primary", "Middle", "Senior"].map(b => (
                                                <SelectItem key={b} value={b}>{b}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={gradeFilter} onValueChange={v => setGradeFilter(v === "all" ? "" : v)}>
                                        <SelectTrigger><SelectValue placeholder="All Grades" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Grades</SelectItem>
                                            {["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
                                                "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map(g => (
                                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={ratingFilter} onValueChange={v => setRatingFilter(v === "all" ? "" : v)}>
                                        <SelectTrigger><SelectValue placeholder="All Ratings" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Ratings</SelectItem>
                                            <SelectItem value="1">1 – Basic</SelectItem>
                                            <SelectItem value="2">2 – Developing</SelectItem>
                                            <SelectItem value="3">3 – Effective</SelectItem>
                                            <SelectItem value="4">4 – Highly Effective</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Table */}
                        <Card className="  shadow-sm overflow-hidden">
                            <CardHeader className="border-b py-3 px-4" style={{ background: "#1F2839" }}>
                                <div className="grid grid-cols-11 gap-2 text-xs font-semibold text-white capitalize tracking-wider">
                                    <span>Sr.</span>
                                    <span className="col-span-1">Date</span>
                                    <span className="col-span-2">Teacher</span>
                                    <span>Block</span>
                                    <span>Grade</span>
                                    <span>Rating</span>
                                    <span className="col-span-2">Comments</span>
                                    <span className="col-span-2 px-2">View Observation</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="flex items-center justify-center py-16 text-muted-foreground">
                                        Loading observations...
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                                        <Music className="w-12 h-12 opacity-20" />
                                        <p className="font-medium">No observations yet</p>
                                        <Button variant="outline" onClick={() => navigate(newFormPath)}>
                                            <Plus className="w-4 h-4 mr-2" /> Start First Observation
                                        </Button>
                                    </div>
                                ) : (
                                    filtered.map((obs, idx) => {
                                        const rating = RATING_LABELS[obs.overallRating];
                                        return (
                                            <div
                                                key={obs.id}
                                                className={`grid grid-cols-11 gap-2 px-4 py-3 items-center hover:bg-amber-50 cursor-pointer border-b transition-colors text-sm ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                                                onClick={() => navigate(`/leader/performing-arts-obs/new?teacherId=${obs.teacherId}&id=${obs.id}`)}
                                            >
                                                <span className="font-medium text-slate-500">{idx + 1}</span>
                                                <span className="col-span-1 text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />{obs.observationDate ? obs.observationDate.slice(0, 19) : "—"}
                                                </span>
                                                <span className="col-span-2 font-medium text-slate-800">{obs.teacherName}</span>
                                                <span>{obs.block}</span>
                                                <span>{obs.grade}</span>
                                                <span>
                                                    {rating ? (
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${rating.color}`}>
                                                            <Star className="w-3 h-3" />{rating.label}
                                                        </span>
                                                    ) : obs.overallRating}
                                                </span>
                                                <span className="col-span-2" onClick={(e) => e.stopPropagation()}>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:text-blue-800">
                                                                <MessageSquare className="w-3 h-3" /> View Comment
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[500px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Teacher Comment</DialogTitle>
                                                                <DialogDescription>
                                                                    Insights and comments from the teacher.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                {obs.detailedReflection?.strengths && (
                                                                    <div>
                                                                        <h4 className="font-semibold text-sm mb-1">Identified Strengths</h4>
                                                                        <p className="text-sm text-muted-foreground">{obs.detailedReflection.strengths}</p>
                                                                    </div>
                                                                )}
                                                                {obs.detailedReflection?.improvements && (
                                                                    <div>
                                                                        <h4 className="font-semibold text-sm mb-1">Areas for Growth</h4>
                                                                        <p className="text-sm text-muted-foreground">{obs.detailedReflection.improvements}</p>
                                                                    </div>
                                                                )}
                                                                {obs.detailedReflection?.goal && (
                                                                    <div>
                                                                        <h4 className="font-semibold text-sm mb-1">Action Goal</h4>
                                                                        <p className="text-sm text-muted-foreground">{obs.detailedReflection.goal}</p>
                                                                    </div>
                                                                )}
                                                                {obs.teacherReflection && !obs.detailedReflection?.strengths && (
                                                                    <div>
                                                                        <h4 className="font-semibold text-sm mb-1">General Comments</h4>
                                                                        <p className="text-sm text-muted-foreground">{obs.teacherReflection}</p>
                                                                    </div>
                                                                )}
                                                                {!obs.teacherReflection && !obs.detailedReflection?.strengths && (
                                                                    <div className="text-center py-6 text-muted-foreground">
                                                                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                                        <p className="text-sm">No comments provided by the teacher yet.</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </span>
                                                <span className="col-span-2" onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 text-xs gap-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
                                                        onClick={() => navigate(`/leader/performing-arts-obs/new?teacherId=${obs.teacherId}&id=${obs.id}&mode=view`)}
                                                    >
                                                        <Eye className="w-3 h-3" /> VIEW
                                                    </Button>
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        {filtered.length > 0 && (
                            <p className="text-xs text-muted-foreground text-right mt-2 font-medium">
                                {filtered.length} observation{filtered.length !== 1 ? "s" : ""} found
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </GrowthLayout>

    );
};

export default PerformingArtsObsDashboard;
