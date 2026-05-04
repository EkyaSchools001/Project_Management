import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@pdi/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Button } from "@pdi/components/ui/button";
import { cn } from "@pdi/lib/utils";
import { Loader2, Eye, TrendingUp, Info, BookOpen, MessageSquare, ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@pdi/components/layout/DashboardLayout";
import { GrowthLayout } from "@pdi/components/growth/GrowthLayout";
import { ObservationCard } from "@pdi/components/ObservationCard";
import { ReflectionForm } from "@pdi/components/ReflectionForm";
import api from "@pdi/lib/api";
import { Observation, DetailedReflection } from "@pdi/types/observation";
import { toast } from "sonner";
import { Badge } from "@pdi/components/ui/badge";
import { Input } from "@pdi/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { Search, X } from "lucide-react";

const GrowthPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [observations, setObservations] = useState<Observation[]>([]);
    const [selectedReflectObs, setSelectedReflectObs] = useState<Observation | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedDomain, setSelectedDomain] = useState(searchParams.get("domain") || "all");
    const [filterType, setFilterType] = useState<'all' | 'quick'>((searchParams.get("type") as any) || 'all');

    // Sync state to URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (searchQuery) params.set("q", searchQuery);
        else params.delete("q");

        if (selectedDomain !== 'all') params.set("domain", selectedDomain);
        else params.delete("domain");

        if (filterType !== 'all') params.set("type", filterType);
        else params.delete("type");

        setSearchParams(params, { replace: true });
    }, [searchQuery, selectedDomain, filterType, searchParams, setSearchParams]);

    useEffect(() => {
        const fetchObservations = async () => {
            try {
                const response = await api.get('/observations');
                if (response.data?.status === 'success') {
                    const apiObservations = (response.data?.data?.observations || []).map((obs: any) => ({
                        ...obs,
                        teacher: obs.teacher?.fullName || obs.teacherEmail || 'Unknown Teacher'
                    }));

                    const teacherObservations = apiObservations.filter(
                        (obs: Observation) => obs.teacherId === user?.id || obs.teacherEmail === user?.email || obs.teacher === user?.fullName
                    );
                    setObservations(teacherObservations);
                }
            } catch (err) {
                console.error("Failed to fetch observations:", err);
                toast.error("Failed to load observations");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            if (user.role === 'TEACHER') {
                fetchObservations();
            } else if (user.role === 'LEADER' || user.role === 'SCHOOL_LEADER') {
                navigate("/leader/growth");
            } else if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
                navigate("/admin/growth-analytics");
            } else if (user.role === 'MANAGEMENT') {
                navigate("/management/growth-analytics");
            } else {
                setLoading(false);
            }
        }
    }, [user, navigate]);

    const handleReflectionSubmit = async (reflection: DetailedReflection) => {
        if (!selectedReflectObs) return;
        try {
            await api.patch(`/observations/${selectedReflectObs.id}`, {
                hasReflection: true,
                teacherReflection: reflection.comments,
                detailedReflection: reflection,
                status: "SUBMITTED"
            });

            setObservations(prev => prev.map(obs =>
                obs.id === selectedReflectObs.id
                    ? { ...obs, hasReflection: true, teacherReflection: reflection.comments, detailedReflection: reflection, status: "SUBMITTED" }
                    : obs
            ));
            setSelectedReflectObs(null);
            toast.success("Reflection submitted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit reflection");
        }
    };

    const domains = useMemo(() => {
        const uniqueDomains = new Set(observations.map(obs => obs.domain));
        return Array.from(uniqueDomains).sort();
    }, [observations]);

    const filteredObservations = useMemo(() => {
        return observations.filter(obs => {
            const matchesType = filterType === 'quick' ? (obs.type === 'Quick Feedback' || obs.domain === 'Quick Feedback') : true;
            const matchesDomain = selectedDomain === 'all' ? true : obs.domain === selectedDomain;
            const searchTerm = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                obs.domain?.toLowerCase().includes(searchTerm) ||
                obs.observerName?.toLowerCase().includes(searchTerm) ||
                (obs.learningArea || "").toLowerCase().includes(searchTerm) ||
                (obs.notes || "").toLowerCase().includes(searchTerm);

            return matchesType && matchesDomain && matchesSearch;
        });
    }, [observations, filterType, selectedDomain, searchQuery]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedDomain("all");
        setFilterType("all");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || user.role !== 'TEACHER') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold">Observation Module</h1>
                <p className="text-muted-foreground">Redirecting to appropriate dashboard...</p>
            </div>
        );
    }

    return (
        <GrowthLayout allowedRoles={['TEACHER', 'ADMIN', 'SUPERADMIN']}>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-1 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">My Observations</h1>
                    <p className="text-muted-foreground">
                        Manage and reflect on your classroom observations
                    </p>
                </div>

                <div className="grid gap-8">
                    {/* Information Card about the Framework */}
                    <Card className="shadow-sm bg-primary/[0.03] border border-primary/10">
                        <CardContent className="p-8">
                            <div className="flex gap-6">
                                <div className="p-3 rounded-2xl bg-primary/10 h-fit border border-primary/20 shadow-sm">
                                    <Info className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Ekya Danielson Framework</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                        This dashboard utilizes the <strong className="text-primary">Unified Observation, Feedback & Improvement Form</strong>.
                                        It is a standard Danielson-based academic observation framework designed to support your professional growth through structured feedback and collaborative reflection.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <section className="space-y-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                <Eye className="w-6 h-6 text-primary" />
                                My Submissions
                            </h2>
                            <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search subject, observer..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-12 rounded-2xl border-border bg-card text-[10px] font-bold uppercase tracking-widest focus-visible:ring-primary/20"
                                    />
                                </div>
                                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                                    <SelectTrigger className="w-full md:w-64 h-12 rounded-2xl border-border bg-card text-[10px] font-black uppercase tracking-widest focus:ring-primary/20 transition-all">
                                        <SelectValue placeholder="Domain" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border shadow-xl">
                                        <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest py-3">All Domains</SelectItem>
                                        {domains.map(d => (
                                            <SelectItem key={d} value={d} className="text-[10px] font-black uppercase tracking-widest py-3">{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-3 bg-muted/50 p-1 rounded-2xl border border-border">
                                    <Button
                                        variant={filterType === 'all' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setFilterType('all')}
                                        className={`rounded-xl h-10 px-6 text-[9px] font-black uppercase tracking-widest transition-all ${filterType === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-background'}`}
                                    >
                                        All
                                    </Button>
                                    <Button
                                        variant={filterType === 'quick' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setFilterType('quick')}
                                        className={`rounded-xl h-10 px-6 text-[9px] font-black uppercase tracking-widest transition-all gap-2 ${filterType === 'quick' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-background'}`}
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        Quick
                                    </Button>
                                </div>
                                {(searchQuery || selectedDomain !== "all" || filterType !== "all") && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-10 px-4 gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                        Reset
                                    </Button>
                                )}
                                <div className="px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                                        {filteredObservations.length} Results
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {filteredObservations.length > 0 ? (
                                filteredObservations.map((obs) => (
                                    <ObservationCard
                                        key={obs.id}
                                        observation={obs}
                                        onReflect={() => setSelectedReflectObs(obs)}
                                        onView={() => navigate(`/teacher/observations/${obs.id}`)}
                                    />
                                ))
                            ) : (
                                <Card className="border-dashed py-12">
                                    <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
                                        <div className="p-4 rounded-full bg-muted/50">
                                            <BookOpen className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium text-foreground">No observations yet</p>
                                            <p className="text-sm text-muted-foreground max-w-xs">
                                                Your classroom observations will appear here once they are recorded by your school leader.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Reflection Dialog */}
            {selectedReflectObs && (
                <ReflectionForm
                    isOpen={!!selectedReflectObs}
                    onClose={() => setSelectedReflectObs(null)}
                    onSubmit={handleReflectionSubmit}
                    observation={selectedReflectObs}
                    teacherName={user.fullName}
                    teacherEmail={user.email || ""}
                />
            )}
        </GrowthLayout>
    );
};

export default GrowthPage;
