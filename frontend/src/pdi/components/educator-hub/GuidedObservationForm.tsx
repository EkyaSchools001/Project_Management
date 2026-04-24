import React, { useState, useEffect } from "react";
import { Button } from "@pdi/components/ui/button";
import { Input } from "@pdi/components/ui/input";
import { Label } from "@pdi/components/ui/label";
import { Textarea } from "@pdi/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { Loader2, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Star } from "lucide-react";
import api from "@pdi/lib/api";
import { toast } from "sonner";
import { cn } from "@pdi/lib/utils";

const GRADE_OPTIONS = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const SUBJECT_OPTIONS = ["Mathematics", "Science", "English", "Social Science", "Hindi", "Kannada", "Biology", "Physics", "Chemistry", "Computer Science", "Visual Arts", "Music", "Physical Education"];

interface GuidedObservationFormProps {
    initialData?: {
        teacher?: string;
        subject?: string;
    };
    onComplete: (data: any) => void;
    onCancel: () => void;
}

export function GuidedObservationForm({ initialData, onComplete, onCancel }: GuidedObservationFormProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teachers, setTeachers] = useState<{ id: string; fullName: string; email: string }[]>([]);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
    const [polishingFields, setPolishingFields] = useState<Record<string, boolean>>({});

    const [formData, setFormData] = useState({
        teacherId: "",
        teacherName: initialData?.teacher || "",
        subject: initialData?.subject || "",
        grade: "",
        notes: "",
        strengths: "",
        improvements: "",
        rating: 3,
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchTeachers = async () => {
            setIsLoadingTeachers(true);
            try {
                const res = await api.get('/users?role=TEACHER');
                if (res.data.status === 'success') {
                    setTeachers(res.data.data.users || []);
                }
            } catch (err) {
                console.error("Failed to fetch teachers", err);
            } finally {
                setIsLoadingTeachers(false);
            }
        };
        fetchTeachers();
    }, []);

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePolish = async (fieldName: string) => {
        const text = (formData as any)[fieldName];
        if (!text || text.trim().length < 5) {
            toast.error("Please type at least a few words first.");
            return;
        }

        setPolishingFields(prev => ({ ...prev, [fieldName]: true }));
        try {
            const res = await api.post('/ai/polish-text', { text, fieldName });
            if (res.data.status === 'success') {
                updateField(fieldName, res.data.data.polishedText);
                toast.success("AI suggests an improvement!");
            }
        } catch (err) {
            console.error("Polish error", err);
            toast.error("AI couldn't refine the text.");
        } finally {
            setPolishingFields(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleSubmit = async () => {
        if (!formData.teacherId || !formData.subject || !formData.grade || !formData.notes) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                teacherId: formData.teacherId,
                teacherEmail: teachers.find(t => t.id === formData.teacherId)?.email,
                teacher: formData.teacherName,
                learningArea: formData.subject,
                grade: formData.grade,
                notes: formData.notes,
                strengths: formData.strengths,
                areasOfGrowth: formData.improvements,
                score: formData.rating,
                date: formData.date,
                status: 'SUBMITTED',
                domain: 'General'
            };

            const res = await api.post('/observations/create', payload);
            if (res.data.status === 'success') {
                onComplete(res.data.data.observation);
            }
        } catch (err) {
            console.error("Submission error", err);
            toast.error("Unable to submit observation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border border-primary/20 rounded-2xl p-0 shadow-2xl shadow-primary/5 animate-in slide-in-from-bottom-2 duration-500 flex flex-col min-h-[300px]">
            {/* Header / Progress bar */}
            <div className="bg-primary/5 p-4 rounded-t-2xl flex items-center justify-between border-b border-primary/10">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg text-white">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Observation Assistant</p>
                        <p className="text-sm font-bold text-foreground">
                            {step === 1 ? "Step 1: Context" : step === 2 ? "Step 2: Analysis" : "Step 3: Rating"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={cn("w-6 h-1 rounded-full", step >= s ? "bg-primary" : "bg-primary/10")} />
                    ))}
                </div>
            </div>

            <div className="p-4 flex-1">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Teacher *</Label>
                            <Select 
                                value={formData.teacherId} 
                                onValueChange={(val) => {
                                    const t = teachers.find(x => x.id === val);
                                    if(t) {
                                        updateField("teacherId", val);
                                        updateField("teacherName", t.fullName);
                                    }
                                }}
                            >
                                <SelectTrigger className="rounded-xl border-slate-200">
                                    <SelectValue placeholder={isLoadingTeachers ? "Loading teachers..." : "Pick a teacher"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {teachers.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject *</Label>
                                <Select value={formData.subject} onValueChange={(val) => updateField("subject", val)}>
                                    <SelectTrigger className="rounded-xl border-slate-200">
                                        <SelectValue placeholder="Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SUBJECT_OPTIONS.map(s => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Grade *</Label>
                                <Select value={formData.grade} onValueChange={(val) => updateField("grade", val)}>
                                    <SelectTrigger className="rounded-xl border-slate-200">
                                        <SelectValue placeholder="Grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {GRADE_OPTIONS.map(g => (
                                            <SelectItem key={g} value={g}>{g}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2 relative">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">Observation Notes *</Label>
                            <Textarea 
                                placeholder="What happened in class?" 
                                value={formData.notes}
                                onChange={(e) => updateField("notes", e.target.value)}
                                className="rounded-xl border-slate-200 min-h-[80px] text-sm"
                            />
                            <button 
                                onClick={() => handlePolish('notes')}
                                disabled={polishingFields.notes}
                                className="absolute right-2 bottom-2 p-1.5 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                title="Improve with AI"
                            >
                                {polishingFields.notes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2 relative">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Strengths (Glow)</Label>
                                <Textarea 
                                    placeholder="Glows" 
                                    value={formData.strengths}
                                    onChange={(e) => updateField("strengths", e.target.value)}
                                    className="rounded-xl border-slate-200 min-h-[60px] text-sm pr-8"
                                />
                                <button 
                                    onClick={() => handlePolish('strengths')}
                                    disabled={polishingFields.strengths}
                                    className="absolute right-2 bottom-2 p-1 bg-primary/5 text-primary rounded-md"
                                >
                                    {polishingFields.strengths ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                </button>
                            </div>
                            <div className="space-y-2 relative">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Improvements (Grow)</Label>
                                <Textarea 
                                    placeholder="Grows" 
                                    value={formData.improvements}
                                    onChange={(e) => updateField("improvements", e.target.value)}
                                    className="rounded-xl border-slate-200 min-h-[60px] text-sm pr-8"
                                />
                                <button 
                                    onClick={() => handlePolish('improvements')}
                                    disabled={polishingFields.improvements}
                                    className="absolute right-2 bottom-2 p-1 bg-primary/5 text-primary rounded-md"
                                >
                                    {polishingFields.improvements ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                        <Label className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Final Instructional Rating</Label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map(v => (
                                <button
                                    key={v}
                                    onClick={() => updateField("rating", v)}
                                    className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                        formData.rating >= v 
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" 
                                            : "bg-primary/5 text-primary hover:bg-primary/10"
                                    )}
                                >
                                    <Star className={cn("w-6 h-6", formData.rating >= v ? "fill-current" : "fill-none")} />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-muted-foreground">
                            {formData.rating === 1 && "Critical Support Required"}
                            {formData.rating === 2 && "Developmental Gap Identified"}
                            {formData.rating === 3 && "Instructionally Sound"}
                            {formData.rating === 4 && "Highly Effective Practice"}
                            {formData.rating === 5 && "Exemplary Leadership Practice"}
                        </p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50/50 rounded-b-2xl flex items-center justify-between border-t border-primary/5">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={step === 1 ? onCancel : () => setStep(prev => prev - 1)}
                    className="text-muted-foreground rounded-xl"
                >
                    {step === 1 ? "Cancel" : <><ChevronLeft className="w-4 h-4 mr-1" /> Back</>}
                </Button>
                
                {step < 3 ? (
                    <Button 
                        size="sm" 
                        onClick={() => setStep(prev => prev + 1)}
                        disabled={step === 1 && (!formData.teacherId || !formData.subject || !formData.grade)}
                        className="bg-primary hover:bg-primary-dark text-white rounded-xl px-6"
                    >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                ) : (
                    <Button 
                        size="sm" 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || !formData.notes}
                        className="bg-primary hover:bg-primary-dark text-white rounded-xl px-6 shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting</> : "Submit Observation"}
                    </Button>
                )}
            </div>
        </div>
    );
}
