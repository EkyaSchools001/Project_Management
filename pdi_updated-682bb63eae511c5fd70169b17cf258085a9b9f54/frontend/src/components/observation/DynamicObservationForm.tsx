import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Check, AlertCircle, Save, Send, ChevronLeft, ChevronRight, PenTool } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface Parameter {
    id: string;
    name: string;
    description: string;
    lookFors: string;
    requiresCommentIfPartial: boolean;
}

interface Subdomain {
    id: string;
    code: string;
    title: string;
    parameters: Parameter[];
}

interface Domain {
    id: string;
    name: string;
    subdomains: Subdomain[];
}

interface Cluster {
    id: string;
    number: number;
    name: string;
    domains: Domain[];
}

interface DynamicObservationFormProps {
    clusterNumber: number;
    scheduleId?: string;
    preselectedTeacherId?: string;
    mode?: 'scheduled' | 'unscheduled' | 'quick-feedback';
    initialData?: any;
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

const RATING_OPTIONS = [
    { value: 'YES', label: 'Yes', color: 'bg-emerald-500', sublabel: 'Strong & Consistent' },
    { value: 'PARTIAL', label: 'Partial', color: 'bg-amber-500', sublabel: 'Partially Seen' },
    { value: 'NOT_SEEN', label: 'No', color: 'bg-rose-500', sublabel: 'Not Seen' },
    { value: 'NA', label: 'N/A', color: 'bg-slate-400', sublabel: 'Not Applicable' }
];

export function DynamicObservationForm({ 
    clusterNumber, 
    scheduleId, 
    preselectedTeacherId,
    mode = 'scheduled',
    initialData, 
    onCancel, 
    onSubmit 
}: DynamicObservationFormProps) {
    const [cluster, setCluster] = useState<Cluster | null>(null);
    const [responses, setResponses] = useState<Record<string, { rating: string; comment: string }>>({});
    const [metadata, setMetadata] = useState({
        observerName: initialData?.observerName || "",
        educatorName: initialData?.teacherName || "",
        grade: initialData?.grade || "",
        section: initialData?.section || "",
        learningArea: initialData?.subject || "",
        date: new Date().toISOString().split('T')[0],
        runningNotes: "",
        glows: "",
        grows: "",
        actionStep: "",
        toolsObserved: "",
        routinesProcedures: "",
        additionalComments: "",
        followUpDate: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Cluster Config
                const clusterRes = await api.get(`/observations/clusters/${clusterNumber}`);
                const clusterData = clusterRes.data.data.cluster;
                setCluster(clusterData);
                
                // Initialize responses
                const initialResponses: any = {};
                clusterData.domains.forEach((d: any) => {
                    d.subdomains.forEach((sd: any) => {
                        sd.parameters.forEach((p: any) => {
                            initialResponses[p.id] = { rating: '', comment: '' };
                        });
                    });
                });
                setResponses(initialResponses);

                // 2. Fetch Teacher Data if preselected
                if (preselectedTeacherId) {
                    const teacherRes = await api.get(`/users/${preselectedTeacherId}`);
                    const teacher = teacherRes.data.data;
                    setMetadata(prev => ({
                        ...prev,
                        educatorName: teacher.fullName,
                        grade: teacher.grade || prev.grade,
                        section: teacher.section || prev.section,
                        learningArea: teacher.department || prev.learningArea
                    }));
                }

                // 3. Fetch Schedule Data if provided
                if (scheduleId) {
                    const schedulesRes = await api.get('/observations/schedules');
                    const schedule = schedulesRes.data.data.find((s: any) => s.id === scheduleId);
                    if (schedule) {
                        setMetadata(prev => ({
                            ...prev,
                            educatorName: schedule.teacher?.fullName || prev.educatorName,
                            learningArea: schedule.subject || prev.learningArea,
                            date: schedule.scheduledDate ? new Date(schedule.scheduledDate).toISOString().split('T')[0] : prev.date
                        }));
                    }
                }
            } catch (err) {
                toast.error("Failed to load form context");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [clusterNumber, preselectedTeacherId, scheduleId]);

    const handleRatingChange = (paramId: string, rating: string) => {
        setResponses(prev => ({
            ...prev,
            [paramId]: { ...prev[paramId], rating }
        }));
    };

    const handleCommentChange = (paramId: string, comment: string) => {
        setResponses(prev => ({
            ...prev,
            [paramId]: { ...prev[paramId], comment }
        }));
    };

    const calculateStats = () => {
        const total = Object.keys(responses).length;
        if (total === 0) return { yes: 0, partial: 0, notSeen: 0 };
        
        const counts = Object.values(responses).reduce((acc: any, curr) => {
            if (curr.rating === 'YES') acc.yes++;
            if (curr.rating === 'PARTIAL') acc.partial++;
            if (curr.rating === 'NOT_SEEN') acc.notSeen++;
            return acc;
        }, { yes: 0, partial: 0, notSeen: 0 });

        return {
            yes: Math.round((counts.yes / total) * 100),
            partial: Math.round((counts.partial / total) * 100),
            notSeen: Math.round((counts.notSeen / total) * 100)
        };
    };

    const validateForm = () => {
        if (mode === 'scheduled') {
            const totalParams = Object.keys(responses).length;
            const ratedParams = Object.values(responses).filter(r => r.rating).length;

            if (ratedParams < totalParams) {
                toast.error(`Please rate all ${totalParams} parameters. (${ratedParams}/${totalParams} completed)`);
                return false;
            }

            // Check for partial comments
            const missingComments = Object.entries(responses).filter(([id, r]) => r.rating === 'PARTIAL' && !r.comment.trim());
            if (missingComments.length > 0) {
                toast.error("Comments are mandatory for all 'Partial' ratings.");
                return false;
            }
        }

        if (!metadata.actionStep || metadata.actionStep.trim().length < 5) {
            toast.error("Please provide a specific Action Step.");
            return false;
        }

        return true;
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) return;

        try {
            const payload = {
                clusterNumber,
                scheduleId,
                teacherId: preselectedTeacherId,
                metadata: {
                    ...metadata,
                    observationMode: mode
                },
                ratings: Object.entries(responses).map(([parameterId, data]) => ({
                    parameterId,
                    rating: data.rating,
                    comment: data.comment
                })),
                stats: calculateStats()
            };
            await onSubmit(payload);
        } catch (err) {
            toast.error("Submission failed");
        }
    };

    if (loading) return <div>Loading form...</div>;
    if (!cluster) return <div>Cluster configuration not found.</div>;

    const stats = calculateStats();

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header / Stats Card */}
            <Card className="border-none shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <Badge className="mb-2 bg-primary/20 text-primary-foreground border-primary/20">Cluster {cluster.number}</Badge>
                            <h1 className="text-3xl font-black tracking-tight">{cluster.name}</h1>
                            <p className="text-slate-400 mt-1">
                                {mode === 'scheduled' ? 'Scheduled Observation Form' : 
                                 mode === 'quick-feedback' ? 'Quick Feedback Form' : 'Unscheduled Observation Form'}
                            </p>
                        </div>
                        {mode === 'scheduled' && (
                            <div className="flex gap-4">
                                <div className="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-2xl font-bold text-emerald-400">{stats.yes}%</div>
                                    <div className="text-[10px] uppercase tracking-widest text-slate-400">Yes</div>
                                </div>
                                <div className="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-2xl font-bold text-amber-400">{stats.partial}%</div>
                                    <div className="text-[10px] uppercase tracking-widest text-slate-400">Partial</div>
                                </div>
                                <div className="text-center px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-2xl font-bold text-rose-400">{stats.notSeen}%</div>
                                    <div className="text-[10px] uppercase tracking-widest text-slate-400">Not Seen</div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Metadata Card */}
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" /> Session Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Educator Name</Label>
                        <Input value={metadata.educatorName} readOnly className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                        <Label>Observer Name</Label>
                        <Input value={metadata.observerName} readOnly className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={metadata.date} onChange={e => setMetadata({...metadata, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Grade / Section</Label>
                        <Input value={`${metadata.grade} ${metadata.section}`} readOnly className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                        <Label>Learning Area</Label>
                        <Input value={metadata.learningArea} readOnly className="bg-slate-50" />
                    </div>
                </CardContent>
            </Card>

            {/* Main Form Body - Only show for Scheduled */}
            {mode === 'scheduled' && cluster.domains.map(domain => (
                <Card key={domain.id} className="shadow-xl overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="text-xl font-bold">{domain.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full border-collapse">
                            <thead className="bg-slate-100/50">
                                <tr>
                                    <th className="p-4 text-left text-xs font-black uppercase tracking-widest text-slate-500 w-1/3">Parameters & Look-fors</th>
                                    <th className="p-4 text-center text-xs font-black uppercase tracking-widest text-slate-500" colSpan={4}>Performance Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {domain.subdomains.map(sd => (
                                    <React.Fragment key={sd.id}>
                                        <tr className="bg-slate-50/50">
                                            <td colSpan={5} className="p-4 font-bold text-primary flex items-center gap-2">
                                                <Badge variant="outline" className="bg-white">{sd.code}</Badge> {sd.title}
                                            </td>
                                        </tr>
                                        {sd.parameters.map(param => (
                                            <React.Fragment key={param.id}>
                                                <tr className="hover:bg-slate-50/30 transition-colors">
                                                    <td className="p-6">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-1">
                                                                <div className="font-semibold text-slate-900 flex items-center gap-2">
                                                                    {param.name}
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger>
                                                                                <Info className="w-4 h-4 text-slate-400" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="max-w-xs p-4 bg-slate-900 text-white rounded-xl shadow-2xl">
                                                                                <p className="font-bold mb-1 border-b border-white/10 pb-1">Look Fors:</p>
                                                                                <p className="text-xs leading-relaxed opacity-90">{param.lookFors}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </div>
                                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{param.description}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {RATING_OPTIONS.map(opt => (
                                                        <td key={opt.value} className="p-2 text-center w-24">
                                                            <button
                                                                onClick={() => handleRatingChange(param.id, opt.value)}
                                                                className={cn(
                                                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 mx-auto",
                                                                    responses[param.id]?.rating === opt.value
                                                                        ? `${opt.color} text-white border-transparent scale-110 shadow-lg`
                                                                        : "border-slate-200 text-slate-300 hover:border-slate-400"
                                                                )}
                                                            >
                                                                {responses[param.id]?.rating === opt.value && <Check className="w-6 h-6" />}
                                                            </button>
                                                            <span className="text-[10px] font-bold mt-2 block uppercase text-slate-400">{opt.label}</span>
                                                        </td>
                                                    ))}
                                                </tr>
                                                {responses[param.id]?.rating === 'PARTIAL' && (
                                                    <tr className="bg-amber-50/30">
                                                        <td colSpan={5} className="p-4 pt-0">
                                                            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-amber-200 shadow-sm ml-8">
                                                                <PenTool className="w-4 h-4 text-amber-500" />
                                                                <Input 
                                                                    placeholder="Mandatory: Why was this partially seen? (Max 1 line)"
                                                                    className="border-none focus-visible:ring-0 h-8 text-sm"
                                                                    value={responses[param.id]?.comment}
                                                                    onChange={e => handleCommentChange(param.id, e.target.value)}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            ))}

            {/* Running Notes Card */}
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-lg">Observation Running Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Add real-time notes here..." 
                        className="min-h-[200px] bg-slate-50"
                        value={metadata.runningNotes}
                        onChange={e => setMetadata({...metadata, runningNotes: e.target.value})}
                    />
                </CardContent>
            </Card>

            {/* Glows & Grows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-xl border-emerald-100">
                    <CardHeader className="bg-emerald-50/50">
                        <CardTitle className="text-emerald-700">What worked well (Glows)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea 
                            placeholder="Identify 3-5 key strengths..." 
                            className="min-h-[150px]"
                            value={metadata.glows}
                            onChange={e => setMetadata({...metadata, glows: e.target.value})}
                        />
                    </CardContent>
                </Card>
                <Card className="shadow-xl border-amber-100">
                    <CardHeader className="bg-amber-50/50">
                        <CardTitle className="text-amber-700">What needs strengthening (Grows)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea 
                            placeholder="Identify specific areas for growth..." 
                            className="min-h-[150px]"
                            value={metadata.grows}
                            onChange={e => setMetadata({...metadata, grows: e.target.value})}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Additional Pedagogical Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Tools Observed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            placeholder="What tools/technology were used?" 
                            className="min-h-[100px] bg-slate-50 border-none"
                            value={metadata.toolsObserved}
                            onChange={e => setMetadata({...metadata, toolsObserved: e.target.value})}
                        />
                    </CardContent>
                </Card>
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Routines & Procedures</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            placeholder="Describe classroom management routines..." 
                            className="min-h-[100px] bg-slate-50 border-none"
                            value={metadata.routinesProcedures}
                            onChange={e => setMetadata({...metadata, routinesProcedures: e.target.value})}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Additional Comments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Any other observations or context..." 
                        className="min-h-[100px] bg-slate-50 border-none"
                        value={metadata.additionalComments}
                        onChange={e => setMetadata({...metadata, additionalComments: e.target.value})}
                    />
                </CardContent>
            </Card>

            {/* Evidence Upload */}
            <Card className="shadow-xl border-dashed border-2 border-slate-200 bg-slate-50/50">
                <CardContent className="p-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                        <Send className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900">Upload Evidence</h3>
                    <p className="text-sm text-slate-500 mb-4">Attach lesson plans, photos of student work, or observation artifacts.</p>
                    <Input type="file" className="max-w-xs mx-auto" multiple />
                </CardContent>
            </Card>

            {/* Action Step & Follow up */}
            <Card className="shadow-xl border-primary/20">
                <CardHeader className="bg-primary/5">
                    <CardTitle className="text-primary font-black uppercase tracking-widest text-sm">Action Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <Label className="font-bold">Specific Action Step</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400 italic text-sm">There is scope for the teacher to work on</span>
                            <Textarea 
                                className="pl-64 pt-3 min-h-[100px] bg-white border-slate-200"
                                placeholder="____ by ____"
                                value={metadata.actionStep}
                                onChange={e => setMetadata({...metadata, actionStep: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Follow-up Date</Label>
                            <Input type="date" value={metadata.followUpDate} onChange={e => setMetadata({...metadata, followUpDate: e.target.value})} />
                        </div>
                        <div className="flex items-end gap-3">
                            <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
                            <Button className="flex-1 gap-2" onClick={handleFormSubmit}>
                                <Send className="w-4 h-4" /> Submit Observation
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
