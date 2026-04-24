import React, { useState, useEffect, useRef } from "react";
import { GrowthLayout } from "@pdi/components/growth/GrowthLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { FileText, Plus, Play, Square, Timer, Send, Trash2, User as UserIcon, History, TrendingUp, Loader2, Clock, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Button } from "@pdi/components/ui/button";
import { Input } from "@pdi/components/ui/input";
import { userService, User } from "@pdi/services/userService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@pdi/components/ui/badge";
import { ScrollArea } from "@pdi/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@pdi/components/ui/select"
import { cn } from "@pdi/lib/utils";
import api from "@pdi/lib/api";

interface Note {
    id: string;
    timestamp: string;
    text: string;
}

const NotesPage = () => {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState<User[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
    const [savedObservations, setSavedObservations] = useState<any[]>([]);
    const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
    const [isObserving, setIsObserving] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNote, setCurrentNote] = useState("");
    const [draftId, setDraftId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingDrafts(true);
            const [teachersData, observationsData] = await Promise.all([
                userService.getTeachers(),
                api.get('/growth/observations', { params: { moduleType: 'NOTES', status: 'DRAFT' } })
            ]);
            setTeachers(teachersData);
            if (observationsData.data?.status === 'success') {
                setSavedObservations(observationsData.data.data.observations || []);
            }
            setIsLoadingDrafts(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (isObserving) {
            timerRef.current = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - (startTime || Date.now())) / 1000));
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isObserving, startTime]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [notes]);

    const saveObservationAsDraft = async (currentNotes: Note[]) => {
        if (!selectedTeacherId) return;
        setIsSaving(true);
        try {
            const payload = {
                teacherId: selectedTeacherId,
                moduleType: "NOTES", // Temporary type or generic
                academicYear: "AY 25-26",
                formPayload: {
                    observationNotes: currentNotes,
                    timestampedNotes: true
                },
                status: "DRAFT"
            };

            if (draftId) {
                await api.patch(`/growth/observations/${draftId}`, payload);
            } else {
                const res = await api.post('/growth/observations', payload);
                if (res.data?.status === 'success') {
                    setDraftId(res.data.data.observation.id);
                }
            }
        } catch (error) {
            console.error("Failed to save draft:", error);
            toast.error("Failed to sync notes to cloud");
        } finally {
            setIsSaving(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startObservation = () => {
        if (!selectedTeacherId) {
            toast.error("Please select a teacher first");
            return;
        }
        setIsObserving(true);
        setIsReviewing(false);
        setStartTime(Date.now());
        setElapsedTime(0);
        setNotes([]);
        setDraftId(null);
        toast.success("Observation started");
    };

    const stopObservation = async () => {
        setIsObserving(false);
        await saveObservationAsDraft(notes);
        toast.info("Observation ended and saved as draft");
    };

    const addNote = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!currentNote.trim()) return;

        const newNote: Note = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: formatTime(elapsedTime),
            text: currentNote.trim()
        };

        setNotes(prev => [...prev, newNote]);
        setCurrentNote("");
    };

    const deleteNote = (id: string) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    const finalizeObservation = (type: 'QUICK_FEEDBACK' | 'DANIELSON') => {
        const teacher = teachers.find(t => t.id === selectedTeacherId);
        let path = type === 'QUICK_FEEDBACK' 
            ? `/leader/quick-feedback?teacherId=${selectedTeacherId}` 
            : `/leader/danielson-framework?teacherId=${selectedTeacherId}`;
        
        if (draftId) {
            path += `&id=${draftId}`;
        }
        
        navigate(path, { 
            state: { 
                observationNotes: notes,
                teacherName: teacher?.fullName,
                timestampedNotes: true
            } 
        });
    };

    const reviewObservation = (obs: any) => {
        const payload = typeof obs.formPayload === 'string' ? JSON.parse(obs.formPayload) : obs.formPayload;
        setSelectedTeacherId(obs.teacherId);
        setNotes(payload?.observationNotes || []);
        setDraftId(obs.id);
        setIsReviewing(true);
        setIsObserving(true);
        toast.info(`Reviewing notes for ${obs.teacher?.fullName}`);
    };

    const resumeObservation = (obs: any) => {
        const payload = typeof obs.formPayload === 'string' ? JSON.parse(obs.formPayload) : obs.formPayload;
        setSelectedTeacherId(obs.teacherId);
        setNotes(payload?.observationNotes || []);
        setDraftId(obs.id);
        setIsReviewing(false);
        setIsObserving(true);
        setStartTime(Date.now()); 
        setElapsedTime(0);
        toast.success(`Resumed session for ${obs.teacher?.fullName}`);
    };

    const deleteDraft = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            // Assuming there is a delete endpoint, if not we might need to implement it.
            // For now, let's just use the update status to 'DELETED' or similar if available, 
            // but usually dedicated delete is better. 
            // Let's check growthObservationController for delete.
            await api.patch(`/growth/observations/${id}`, { status: 'DELETED' }); // Soft delete
            setSavedObservations(prev => prev.filter(o => o.id !== id));
            toast.success("Draft removed");
        } catch (error) {
            toast.error("Failed to delete draft");
        }
    };

    const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

    return (
        <GrowthLayout allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Observation Notes</h1>
                        <p className="text-muted-foreground italic">Capture timestamped evidence during live sessions.</p>
                    </div>
                </div>

                {!isObserving ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                        <Card className="border-2 border-primary/10 shadow-lg">
                            <CardHeader className="bg-primary/5">
                                <CardTitle className="flex items-center gap-2">
                                    <Play className="w-5 h-5 text-primary" />
                                    Start New Session
                                </CardTitle>
                                <CardDescription>Select a teacher to begin a live timestamped session.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Teacher</label>
                                    <Select 
                                        value={selectedTeacherId} 
                                        onValueChange={setSelectedTeacherId}
                                    >
                                        <SelectTrigger className="h-12 border-primary/20 bg-background/50">
                                            <SelectValue placeholder="Select Teacher" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teachers.map(t => (
                                                <SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button 
                                    className="w-full h-12 text-lg font-bold gap-2 shadow-lg shadow-primary/20"
                                    onClick={startObservation}
                                    disabled={!selectedTeacherId}
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Begin Observation
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <History className="w-16 h-16 text-amber-900" />
                                </div>
                                <h3 className="text-lg font-black text-amber-900 mb-2">How it works</h3>
                                <ul className="space-y-3 text-sm text-amber-800/80 font-medium">
                                    <li className="flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <span>Select a teacher and start the timer when the lesson begins.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <span>Type your observations; they'll be automatically timestamped.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <span>When done, carry your notes into the formal observation forms for easy reference.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Recent Drafts Section */}
                        <div className="md:col-span-2 mt-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <History className="w-5 h-5 text-primary" />
                                    Recent Saved Sessions
                                </h2>
                                <Badge variant="secondary">{savedObservations.length} Drafts</Badge>
                            </div>
                            
                            {isLoadingDrafts ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-32 bg-muted animate-pulse rounded-3xl" />
                                    ))}
                                </div>
                            ) : savedObservations.length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl bg-muted/20 text-muted-foreground italic">
                                    <FileText className="w-8 h-8 opacity-20 mb-2" />
                                    <p className="text-sm">No saved observation drafts found.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {savedObservations.map((obs) => (
                                        <Card 
                                            key={obs.id} 
                                            className="group border-primary/5 hover:border-primary/20 hover:shadow-xl transition-all rounded-[2rem] overflow-hidden"
                                        >
                                            <CardHeader className="p-4 pb-2 bg-gradient-to-br from-primary/[0.03] to-transparent">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                                            <UserIcon className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <CardTitle className="text-sm font-bold truncate">{obs.teacher?.fullName}</CardTitle>
                                                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(obs.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 rounded-lg"
                                                        onClick={(e) => deleteDraft(obs.id, e)}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Badge variant="outline" className="text-[9px] font-bold border-primary/10 bg-primary/[0.02]">
                                                        {(typeof obs.formPayload === 'string' ? JSON.parse(obs.formPayload || '{}') : obs.formPayload)?.observationNotes?.length || 0} Notes Captured
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-primary/5">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="flex-1 text-[10px] font-black uppercase tracking-tighter text-primary hover:bg-primary/5 rounded-xl h-8"
                                                        onClick={() => reviewObservation(obs)}
                                                    >
                                                        Review Notes
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        className="flex-1 text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl h-8"
                                                        onClick={() => resumeObservation(obs)}
                                                    >
                                                        Resume
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Live Controls */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className={cn(
                                "border-2 shadow-2xl relative overflow-hidden",
                                isReviewing ? "border-indigo-500/20" : "border-red-500/20"
                            )}>
                                {isObserving && <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />}
                                <CardHeader className={cn(
                                    "flex flex-row items-center justify-between",
                                    isReviewing ? "bg-indigo-50/50" : "bg-red-50/50"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                                            isReviewing ? "bg-indigo-100" : "bg-red-100 animate-pulse"
                                        )}>
                                            {isReviewing ? (
                                                <FileText className="w-6 h-6 text-indigo-600" />
                                            ) : (
                                                <div className="w-3 h-3 rounded-full bg-red-600" />
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold">{selectedTeacher?.fullName}</CardTitle>
                                            <CardDescription>
                                                {isReviewing ? "Reviewing Saved Evidence" : "Live Observation Session"}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        {!isReviewing ? (
                                            <>
                                                <div className="flex items-center gap-2 text-2xl font-mono font-black text-red-600">
                                                    {isSaving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mr-2" />}
                                                    <Timer className="w-6 h-6" />
                                                    {formatTime(elapsedTime)}
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {isSaving && <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Saving Draft...</span>}
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="text-red-600 border-red-200 hover:bg-red-50 gap-2 h-8"
                                                        onClick={stopObservation}
                                                        disabled={isSaving}
                                                    >
                                                        <Square className="w-3 h-3 fill-current" />
                                                        End Session
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-10 px-4 rounded-xl gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                                onClick={() => setIsReviewing(false)}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Back to Dashboard
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {!isReviewing && (
                                        <form onSubmit={addNote} className="flex gap-2 mb-6">
                                            <Input 
                                                autoFocus
                                                placeholder="Type observation and press Enter..."
                                                value={currentNote}
                                                onChange={(e) => setCurrentNote(e.target.value)}
                                                className="h-14 text-lg border-primary/20 focus-visible:ring-primary shadow-inner bg-primary/[0.02]"
                                            />
                                            <Button type="submit" className="h-14 px-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                                <Send className="w-5 h-5" />
                                            </Button>
                                        </form>
                                    )}

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                                {isReviewing ? "Captured Evidence" : "Recent Evidence"}
                                            </h3>
                                            <Badge variant="outline" className="text-[10px] font-bold border-primary/20">{notes.length} Notes</Badge>
                                        </div>
                                        <ScrollArea className="h-[400px] pr-4">
                                            <div className="space-y-4 pt-2">
                                                {notes.length === 0 ? (
                                                    <div className="h-32 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-2xl">
                                                        <FileText className="w-8 h-8 mb-2 opacity-20" />
                                                        <p className="text-xs font-medium">No professional notes captured yet.</p>
                                                    </div>
                                                ) : (
                                                    notes.map((note) => (
                                                        <div key={note.id} className="group flex gap-4 bg-background border p-4 rounded-[1.5rem] shadow-sm hover:shadow-md hover:border-primary/20 transition-all animate-in slide-in-from-left-2 duration-300">
                                                            <div className="flex flex-col items-center gap-1 shrink-0">
                                                                <div className="px-2 py-1 rounded-lg bg-primary/5 text-primary text-[11px] font-mono font-black border border-primary/10">
                                                                    {note.timestamp}
                                                                </div>
                                                                <div className="w-px h-full bg-primary/10" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium leading-relaxed">{note.text}</p>
                                                            </div>
                                                            {!isReviewing && (
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="opacity-0 group-hover:opacity-100 h-8 w-8 text-neutral-400 hover:text-red-500 transition-all rounded-full"
                                                                    onClick={() => deleteNote(note.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                                <div ref={scrollRef} />
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Finishing Options */}
                        <div className="space-y-6">
                            <Card className="border shadow-lg bg-gradient-to-b from-primary/[0.03] to-background">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {isReviewing ? "Finalize Evidence" : "Finish Observation"}
                                    </CardTitle>
                                    <CardDescription>
                                        {isReviewing ? "Carry these notes into a formal report." : "Select a form to carry your notes into."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button 
                                        className="w-full h-16 justify-start px-6 rounded-2xl border-primary/10 hover:border-primary/40 bg-white hover:bg-primary/[0.02] text-primary shadow-sm group"
                                        variant="outline"
                                        onClick={() => finalizeObservation('QUICK_FEEDBACK')}
                                    >
                                        <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 mr-4 transition-colors">
                                            <Send className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="font-bold text-sm">Quick Feedback</span>
                                            <span className="text-[10px] text-muted-foreground">Actionable subject-based loop</span>
                                        </div>
                                    </Button>

                                    <Button 
                                        className="w-full h-16 justify-start px-6 rounded-2xl border-indigo-200 hover:border-indigo-400 bg-white hover:bg-indigo-50 text-indigo-700 shadow-sm group"
                                        variant="outline"
                                        onClick={() => finalizeObservation('DANIELSON')}
                                    >
                                        <div className="p-2 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 mr-4 transition-colors">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col items-start text-indigo-900">
                                            <span className="font-bold text-sm">Danielson Framework</span>
                                            <span className="text-[10px] text-indigo-600/70">Unified formal observation</span>
                                        </div>
                                    </Button>
                                    
                                    {!isReviewing ? (
                                        <p className="text-[10px] text-muted-foreground text-center px-4 italic leading-tight">
                                            Carrying over {notes.length} timestamped notes for reference.
                                        </p>
                                    ) : (
                                        <Button 
                                            variant="ghost"
                                            className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                            onClick={() => {
                                                const obs = savedObservations.find(o => o.id === draftId);
                                                if (obs) resumeObservation(obs);
                                            }}
                                        >
                                            Actually, I want to add more notes
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </GrowthLayout>
    );
};

export default NotesPage;
