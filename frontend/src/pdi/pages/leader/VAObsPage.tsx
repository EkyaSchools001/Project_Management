import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@pdi/components/ui/button";
import { Input } from "@pdi/components/ui/input";
import { Label } from "@pdi/components/ui/label";
import { Textarea } from "@pdi/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@pdi/components/ui/radio-group";
import { Checkbox } from "@pdi/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { Palette, ChevronLeft, ChevronRight, Save, Users, BookOpen, ClipboardCheck, MessageSquare } from "lucide-react";
import { useAuth } from "@pdi/hooks/useAuth";
import api from "@pdi/lib/api";
import { toast } from "sonner";
import { cn } from "@pdi/lib/utils";
import { GrowthLayout } from "@pdi/components/growth/GrowthLayout";
import { ObservationReport } from "@pdi/components/growth/ObservationReport";

const RATING_MAP: Record<string, number> = {
    'Highly Effective': 4,
    'Effective': 3,
    'Developing': 2,
    'Basic': 1,
    'Needs Improvement': 1,
    'Not Observed': 0
};

const GRADES = ["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

// Section rows
const SEC_A = [
    "Teacher displays extensive knowledge of important concepts in discipline.",
    "Teacher understands and teaches mental tools and processes.",
    "Teacher demonstrates knowledge of physical and digital resources.",
    "Lesson plan aligned with Master Plan.",
];
const SEC_B1 = [
    "Respectful teacher-student interactions.",
    "Culture of peer respect.",
    "Respect for artwork.",
    "Respect for resources.",
    "Culture of learning.",
    "Effective classroom routine management.",
];
const SEC_B2 = [
    "Communicates goals clearly.",
    "Clear directions and procedures.",
    "Integrates technology effectively.",
    "Uses appropriate questioning tools.",
    "Engages students actively.",
    "Demonstrates flexibility and responsiveness.",
];
const SEC_B3 = ["Uses student assessment results to plan instruction."];
const SEC_B4 = [
    "Studio organised and clutter-free.",
    "Resources used skillfully.",
    "Pin-up boards maintained (info wall, wall of questions, wall of images).",
    "Student work displayed during crit.",
];
const SEC_C = [
    "Maintains accurate records.",
    "Participates in professional community.",
    "Seeks Teacher Development.",
    "Communicates professionally.",
];

const CULTURE_TOOLS = [
    "Academic Integrity Checklist", "Affirmations", "All Eyes on Me", "Brain Breaks", "Carousel",
    "Catch a Bubble (EY-2)", "Centering", "Check-In", "Circulate", "Controlled Dialogue",
    "Circle Time (EY-2)", "Countdown", "Find Somebody Who", "Good Things", "Grounding",
    "Hand Signals", "Help Now Strategies", "Joy Factor", "Mingle", "Morning Meetings",
    "No Opt Out", "Normalise Error", "Parking Lot", "Positive Framing", "Post the Plan",
    "Precise Praise", "Prioritisation Dots", "Resourcing", "Shift & Stay", "Social Contract",
    "Spectrum Lines", "Timeout", "Tracking", "No Tools Observed", "Other",
];
const ROUTINES = [
    "Arrival Routine", "Attendance Routine", "Class Cleaning Routines", "Collection Routine",
    "Departure Routine", "Grouping Routine", "Lining Up Strategies", "No Routines Observed", "Other",
];
const STUDIO_HABITS = [
    "Stretch and Explore", "Envision", "Engage and Persist", "Reflect",
    "Develop Craft", "Observe", "Understand Art Worlds", "Express",
];
const INSTRUCTIONAL_TOOLS = [
    "321", "+1 Routine", "Brainstorming", "Choral Call", "Cold Call", "Concept Map", "Do Now",
    "Entry Ticket", "Exit Ticket", "Go-round", "I Used to Think / Now I Know", "Imagine If", "KWL",
    "Options Diamonds", "Parts & Perspectives", "Put on Your Thinking Cap", "Quick Draw - Quick Write",
    "Reading Jigsaw", "Round Table Discussion", "See-Think-Wonder", "Show Call", "T-Chart",
    "Talking Sticks", "Think-Pair-Share", "Turn & Talk", "Venn Diagram", "Wait Time",
    "No Tools Observed", "Other",
];
const META_TAGS = [
    "Knowledge of Content and Pedagogy", "Knowledge of Students", "Knowledge of Resources",
    "Designing A Microplan", "Using Student Assessments",
    "Creating an Environment of Respect and Rapport", "Establishing a Culture for Learning",
    "Managing Classroom Procedures", "Managing Student Behaviour", "Communicating with Students",
    "Using Questioning and Discussion Techniques", "Using Assessment in Instruction",
    "Organizing Physical Space", "Cleanliness", "Use of Boards", "Reflecting on Teaching",
    "Maintaining Accurate Records", "Communicating with Families",
    "Participating in a Professional Community", "Growing and Developing Professionally",
];

type MatrixVal = "Yes" | "No" | "NA" | "";
type MatrixState = Record<string, MatrixVal>;
const initMatrix = (rows: string[]): MatrixState => Object.fromEntries(rows.map(r => [r, ""]));

const ACCENT = "#B69D74";
const DARK = "#1F2839";

// Reusable sub-components
const MatrixSection = ({
    rows, field, evidenceField, evidenceVal, sectionLabel, bgColor, headerText, form, setMatrix, set, DARK, ACCENT, readOnly
}: {
    rows: string[]; field: string; evidenceField: string; evidenceVal: string;
    sectionLabel: string; bgColor: string; headerText: string;
    form: any; setMatrix: any; set: any; DARK: string; ACCENT: string;
    readOnly?: boolean;
}) => (
    <Card className="  shadow-md">
        <CardHeader className="rounded-t-xl py-3 px-5" style={{ background: bgColor }}>
            <h3 className="font-bold text-sm">{headerText}</h3>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
            <div className="grid grid-cols-[1fr_70px_70px_100px] gap-1 text-xs font-bold capitalize tracking-wide px-3 py-2 rounded-lg mb-1" style={{ background: DARK, color: "white" }}>
                <span>Statement</span><span className="text-center">Yes</span><span className="text-center">No</span><span className="text-center">N/A</span>
            </div>
            {rows.map((row, i) => {
                const val = (form[field] as MatrixState)[row];
                return (
                    <div key={row} className={`grid grid-cols-[1fr_70px_70px_100px] gap-1 items-center px-3 py-2.5 rounded-lg border ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                        <span className="text-sm leading-snug">{row}</span>
                        {(["Yes", "No", "NA"] as MatrixVal[]).map(v => (
                            <div key={v} className="flex justify-center">
                                <button type="button" onClick={() => !readOnly && setMatrix(field, row, v)}
                                    disabled={readOnly}
                                    className={cn("w-8 h-8 rounded-full border-2 text-xs font-bold transition-all",
                                        val === v ? "text-white border-transparent scale-110" : "border-slate-200 text-slate-400 hover:border-slate-400", readOnly && "cursor-default")}
                                    style={val === v ? { background: ACCENT } : {}}>
                                    {v === "NA" ? "NA" : v[0]}
                                </button>
                            </div>
                        ))}
                    </div>
                );
            })}
            <div className="pt-2 space-y-1">
                <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Evidence for {sectionLabel} *</Label>
                <Textarea className="min-h-[80px]" placeholder="Share specific evidence..."
                    value={evidenceVal} onChange={e => set(evidenceField, e.target.value)} readOnly={readOnly} />
            </div>
        </CardContent>
    </Card>
);

const CheckGroup = ({ items, field, label, form, toggleList, readOnly }: { items: string[]; field: string; label: string; form: any; toggleList: any; readOnly?: boolean }) => (
    <div className="space-y-2">
        {label && <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">{label}</Label>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
            {items.map(item => {
                const checked = (form[field] as string[]).includes(item);
                return (
                    <div key={item} onClick={() => !readOnly && toggleList(field, item)}
                        className={cn("flex items-center gap-2 p-2 rounded-lg border transition-all text-xs", checked ? "border-amber-300 bg-amber-50" : "border-slate-200 hover:bg-slate-50", readOnly ? "cursor-default" : "cursor-pointer")}>
                        <Checkbox checked={checked} onCheckedChange={() => !readOnly && toggleList(field, item)} disabled={readOnly} />
                        <span className="leading-tight">{item}</span>
                    </div>
                );
            })}
        </div>
    </div>
);

const VAObsPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isViewMode = searchParams.get("mode") === "view";
    const [step, setStep] = useState(1);
    const [fetching, setFetching] = useState(false);
    const TOTAL = 4;

    const [form, setForm] = useState({
        teacherId: searchParams.get("teacherId") || "",
        observerEmail: user?.email || "",
        teacherName: searchParams.get("teacherName") || "",
        teacherEmail: searchParams.get("teacherEmail") || "",
        observerName: user?.fullName || "",
        observerRole: "",
        observerRoleOther: "",
        observationDate: new Date().toISOString().split("T")[0],
        block: "",
        grade: "",
        section: "",
        sectionA: initMatrix(SEC_A),
        sectionAEvidence: "",
        sectionB1: initMatrix(SEC_B1),
        sectionB1Evidence: "",
        sectionB2: initMatrix(SEC_B2),
        sectionB2Evidence: "",
        sectionB3: initMatrix(SEC_B3),
        sectionB3Evidence: "",
        sectionB4: initMatrix(SEC_B4),
        sectionB4Evidence: "",
        sectionC: initMatrix(SEC_C),
        sectionCEvidence: "",
        overallRating: "",
        cultureTools: [] as string[],
        routinesObserved: [] as string[],
        studioHabits: [] as string[],
        instructionalTools: [] as string[],
        feedback: "",
        teacherReflection: "",
        actionStep: "",
        metaTags: [] as string[],
        moduleType: "VISUAL_ARTS",
        academicYear: "AY 25-26",
    });

    useEffect(() => {
        const obsId = searchParams.get("id");
        if (obsId) {
            const fetchObs = async () => {
                try {
                    setFetching(true);
                    const res = await api.get(`/growth/observations/${obsId}`);
                    const obs = res.data?.data?.observation;
                    if (obs) {
                        const payload = typeof obs.formPayload === 'string' ? JSON.parse(obs.formPayload) : obs.formPayload;
                        setForm(p => ({
                            ...p,
                            ...(payload || obs),
                            teacherId: obs.teacherId,
                            teacherName: obs.teacher?.fullName || payload?.teacherName || obs.teacherName || "",
                            teacherEmail: obs.teacher?.email || payload?.teacherEmail || obs.teacherEmail || "",
                            observationDate: obs.observationDate ? new Date(obs.observationDate).toISOString().split("T")[0] : p.observationDate,
                            overallRating: obs.overallRating ? (Object.keys(RATING_MAP).find(k => RATING_MAP[k] === obs.overallRating) || payload?.overallRating || obs.overallRating) : (payload?.overallRating || obs.overallRating)
                        }));
                    }
                } catch (e) {
                    toast.error("Failed to load observation data");
                } finally {
                    setFetching(false);
                }
            };
            fetchObs();
        }
    }, [searchParams]);

    const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
    const setMatrix = (field: keyof typeof form, row: string, val: MatrixVal) =>
        setForm(p => ({ ...p, [field]: { ...(p[field] as MatrixState), [row]: val } }));
    const toggleList = (field: "cultureTools" | "routinesObserved" | "studioHabits" | "instructionalTools" | "metaTags", item: string) =>
        setForm(p => {
            const arr = p[field] as string[];
            return { ...p, [field]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item] };
        });

    const validateStep = () => {
        if (step === 1) {
            if (!form.teacherId) {
                toast.error("Teacher ID is missing. Please select a teacher again."); return false;
            }
            if (!form.teacherName.trim() || !form.teacherEmail.trim() || !form.observerName.trim() || !form.observerRole) {
                toast.error("Please fill in all required fields"); return false;
            }
        }
        if (step === 2) {
            if (!form.block || !form.grade || !form.section.trim()) {
                toast.error("Please fill in all classroom details"); return false;
            }
        }
        if (step === 3) {
            const checks: { m: MatrixState; rows: string[]; label: string }[] = [
                { m: form.sectionA, rows: SEC_A, label: "Section A" },
                { m: form.sectionB1, rows: SEC_B1, label: "Section B1" },
                { m: form.sectionB2, rows: SEC_B2, label: "Section B2" },
                { m: form.sectionB3, rows: SEC_B3, label: "Section B3" },
                { m: form.sectionB4, rows: SEC_B4, label: "Section B4" },
                { m: form.sectionC, rows: SEC_C, label: "Section C" },
            ];
            for (const { m, rows, label } of checks) {
                if (rows.some(r => !m[r])) { toast.error(`Complete all rows in ${label}`); return false; }
            }
            if (!form.sectionAEvidence.trim() || !form.sectionB1Evidence.trim() || !form.sectionB2Evidence.trim() ||
                !form.sectionB3Evidence.trim() || !form.sectionB4Evidence.trim() || !form.sectionCEvidence.trim()) {
                toast.error("Please provide evidence for all sections"); return false;
            }
        }
        if (step === 4) {
            if (!form.overallRating) { toast.error("Please select an overall rating"); return false; }
            if (!form.feedback.trim() || !form.teacherReflection.trim() || !form.actionStep.trim()) {
                toast.error("Please complete all feedback fields"); return false;
            }
            if (form.metaTags.length === 0) { toast.error("Select at least one meta tag"); return false; }
        }
        return true;
    };

    const handleNext = () => { if (validateStep()) { setStep(p => p + 1); window.scrollTo(0, 0); } };
    const handleBack = () => { setStep(p => p - 1); window.scrollTo(0, 0); };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        const obsId = searchParams.get("id");

        // Map string ratings to numbers
        const ratingMap: Record<string, number> = {
            "Highly Effective": 4,
            "Effective": 3,
            "Developing": 2,
            "Needs Improvement": 1
        };
        const numericRating = ratingMap[form.overallRating] || 0;

        try {
            if (obsId) {
                await api.patch(`/growth/observations/${obsId}`, {
                    ...form,
                    overallRating: numericRating,
                    formPayload: { ...form },
                    status: "SUBMITTED"
                });
                toast.success("Observation updated successfully!");
            } else {
                await api.post("/growth/observations", {
                    ...form,
                    overallRating: numericRating,
                    formPayload: { ...form },
                    status: "SUBMITTED"
                });
                toast.success("Visual Arts Observation submitted successfully!");
            }
            navigate(`/leader/growth/${form.teacherId}`);
        } catch {
            toast.error("Failed to save observation. Please try again.");
        }
    };

    if (!user) return null;

    const stepIcons = [Users, BookOpen, ClipboardCheck, MessageSquare];
    const StepIcon = stepIcons[step - 1];

    if (isViewMode && !fetching) {
        const reportData = {
            ...form,
            campus: (user as any)?.campus || (user as any)?.campusId || "N/A",
            strengths: form.feedback,
            areasOfGrowth: form.actionStep
        };

        return (

            <GrowthLayout allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                <div className="pt-8 px-4">
                    <ObservationReport data={reportData} onBack={() => navigate(`/leader/growth/${form.teacherId}`)} />
                </div>
            </GrowthLayout>

        );
    }

    return (

        <GrowthLayout allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
            <div style={{ background: "#F5F5EF", minHeight: "100vh", paddingBottom: 60 }}>
                {fetching && (
                    <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            <p className="font-bold text-amber-900">Loading observation data...</p>
                        </div>
                    </div>
                )}
                {/* Sticky header */}
                <div className="sticky top-0 z-20 border-b mb-6 px-4 pt-4 pb-3" style={{ background: "#F5F5EF" }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-lg font-bold" style={{ color: DARK }}>AY 25–26 Visual Arts Observation_Master</h1>
                                <p className="text-xs text-muted-foreground">Step {step} of {TOTAL}</p>
                            </div>
                        </div>
                        <div className="flex gap-1.5 items-center">
                            {Array.from({ length: TOTAL }).map((_, i) => (
                                <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i < step ? "w-10 opacity-100" : "w-6 opacity-25")} style={{ background: ACCENT }} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 space-y-5">
                    {/* PAGE 1 – Observer Details */}
                    {step === 1 && (
                        <Card className="  shadow-lg animate-in fade-in slide-in-from-bottom-4">
                            <CardHeader className="rounded-t-xl" style={{ background: DARK }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/10"><Users className="w-5 h-5 text-white" /></div>
                                    <div><CardTitle className="text-white">Observer Details</CardTitle><CardDescription className="text-white/70">Page 1 of 4</CardDescription></div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                                    📧 Your email (<strong>{form.observerEmail}</strong>) will be recorded when you submit this form. A copy of your responses will be sent to this address.
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Observer Email (Auto-captured)</Label>
                                    <Input value={form.observerEmail} readOnly className="bg-slate-50 text-muted-foreground" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Name of Teacher *</Label>
                                        <Input value={form.teacherName} onChange={e => set("teacherName", e.target.value)} placeholder="Full name" readOnly={isViewMode || !!searchParams.get("teacherName")} className={cn((isViewMode || !!searchParams.get("teacherName")) && "bg-slate-50 text-muted-foreground")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Teacher Email ID *</Label>
                                        <Input type="email" value={form.teacherEmail} onChange={e => set("teacherEmail", e.target.value)} placeholder="teacher@ekya.in" readOnly={isViewMode || !!searchParams.get("teacherEmail")} className={cn((isViewMode || !!searchParams.get("teacherEmail")) && "bg-slate-50 text-muted-foreground")} />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Observer's Name *</Label>
                                        <Input value={form.observerName} onChange={e => set("observerName", e.target.value)} readOnly={isViewMode} className={cn(isViewMode && "bg-slate-50 text-muted-foreground")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Date of Observation *</Label>
                                        <Input type="date" value={form.observationDate} onChange={e => set("observationDate", e.target.value)} readOnly={isViewMode} className={cn(isViewMode && "bg-slate-50 text-muted-foreground")} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Observer's Role *</Label>
                                    <RadioGroup value={form.observerRole} onValueChange={v => !isViewMode && set("observerRole", v)} disabled={isViewMode} className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {["Academic Coordinator", "CCA Coordinator", "Head of School", "ELC Team Member", "PDI Team Member", "Other"].map(r => (
                                            <div key={r} className={cn("flex items-center gap-2 border p-3 rounded-xl transition-all", isViewMode ? "cursor-default" : "hover:bg-muted/50 cursor-pointer")}>
                                                <RadioGroupItem value={r} id={`role-${r}`} disabled={isViewMode} />
                                                <Label htmlFor={`role-${r}`} className={cn("text-sm", !isViewMode && "cursor-pointer")}>{r}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {form.observerRole === "Other" && <Input placeholder="Specify your role..." value={form.observerRoleOther} onChange={e => set("observerRoleOther", e.target.value)} readOnly={isViewMode} />}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* PAGE 2 – Classroom Details */}
                    {step === 2 && (
                        <Card className="  shadow-lg animate-in fade-in slide-in-from-bottom-4">
                            <CardHeader className="rounded-t-xl" style={{ background: DARK }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/10"><BookOpen className="w-5 h-5 text-white" /></div>
                                    <div><CardTitle className="text-white">Classroom Details</CardTitle><CardDescription className="text-white/70">Page 2 of 4</CardDescription></div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Block *</Label>
                                    <div className="flex flex-wrap gap-3">{["Early Years", "Primary", "Middle", "Senior"].map(b => (
                                        <button key={b} type="button" onClick={() => !isViewMode && set("block", b)}
                                            disabled={isViewMode}
                                            className={cn("px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all", form.block === b ? "text-white" : "border-slate-200 hover:border-amber-300", isViewMode && "cursor-default")}
                                            style={form.block === b ? { background: ACCENT, borderColor: ACCENT } : {}}>{b}</button>
                                    ))}</div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Grade *</Label>
                                        <Select value={form.grade} onValueChange={v => set("grade", v)} disabled={isViewMode}>
                                            <SelectTrigger className={cn(isViewMode && "bg-slate-50 text-muted-foreground")}><SelectValue placeholder="Select grade" /></SelectTrigger>
                                            <SelectContent>{GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Section *</Label>
                                        <Input maxLength={5} placeholder="e.g. A, Blue" value={form.section} onChange={e => set("section", e.target.value)} readOnly={isViewMode} className={cn(isViewMode && "bg-slate-50 text-muted-foreground")} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* PAGE 3 – Observation Matrices */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="p-4 rounded-2xl" style={{ background: DARK }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/10"><ClipboardCheck className="w-5 h-5 text-white" /></div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Visual Arts Observation Matrix</h2>
                                        <p className="text-white/60 text-sm">Page 3 of 4 — Rate each indicator Yes / No / N/A</p>
                                    </div>
                                </div>
                            </div>
                            <MatrixSection rows={SEC_A} field="sectionA" evidenceField="sectionAEvidence" evidenceVal={form.sectionAEvidence} sectionLabel="Section A" bgColor="#EEF2FF" headerText="📘 Section A – Planning & Preparation (Live the Lesson)" form={form} setMatrix={setMatrix} set={set} DARK={DARK} ACCENT={ACCENT} readOnly={isViewMode} />
                            <MatrixSection rows={SEC_B1} field="sectionB1" evidenceField="sectionB1Evidence" evidenceVal={form.sectionB1Evidence} sectionLabel="Section B1" bgColor="#FFF7ED" headerText="🎨 Section B1 – Classroom Practice: Care about Culture" form={form} setMatrix={setMatrix} set={set} DARK={DARK} ACCENT={ACCENT} readOnly={isViewMode} />
                            <MatrixSection rows={SEC_B2} field="sectionB2" evidenceField="sectionB2Evidence" evidenceVal={form.sectionB2Evidence} sectionLabel="Section B2" bgColor="#F0FDF4" headerText="💡 Section B2 – Classroom Practice: Instruct to Inspire" form={form} setMatrix={setMatrix} set={set} DARK={DARK} ACCENT={ACCENT} readOnly={isViewMode} />
                            <MatrixSection rows={SEC_B3} field="sectionB3" evidenceField="sectionB3Evidence" evidenceVal={form.sectionB3Evidence} sectionLabel="Section B3" bgColor="#FDF4FF" headerText="📊 Section B3 – Authentic Assessments" form={form} setMatrix={setMatrix} set={set} DARK={DARK} ACCENT={ACCENT} readOnly={isViewMode} />
                            <MatrixSection rows={SEC_B4} field="sectionB4" evidenceField="sectionB4Evidence" evidenceVal={form.sectionB4Evidence} sectionLabel="Section B4" bgColor="#FFFBEB" headerText="🏛 Section B4 – Engaging Environment" form={form} setMatrix={setMatrix} set={set} DARK={DARK} ACCENT={ACCENT} readOnly={isViewMode} />
                            <MatrixSection rows={SEC_C} field="sectionC" evidenceField="sectionCEvidence" evidenceVal={form.sectionCEvidence} sectionLabel="Section C" bgColor="#F1F5F9" headerText="🏆 Section C – Professional Practice" form={form} setMatrix={setMatrix} set={set} DARK={DARK} ACCENT={ACCENT} readOnly={isViewMode} />
                        </div>
                    )}

                    {/* PAGE 4 – Summary, Tools & Feedback */}
                    {step === 4 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                            <div className="p-4 rounded-2xl" style={{ background: DARK }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/10"><MessageSquare className="w-5 h-5 text-white" /></div>
                                    <div><h2 className="text-lg font-bold text-white">Summary & Feedback</h2><p className="text-white/60 text-sm">Page 4 of 4</p></div>
                                </div>
                            </div>

                            {/* Overall Rating */}
                            <Card className="  shadow-sm">
                                <CardContent className="p-5 space-y-3">
                                    <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Overall Rating *</Label>
                                    <Select value={form.overallRating} onValueChange={v => set("overallRating", v)} disabled={isViewMode}>
                                        <SelectTrigger className={cn("h-11", isViewMode && "bg-slate-50 text-muted-foreground")}><SelectValue placeholder="Select overall rating" /></SelectTrigger>
                                        <SelectContent>
                                            {["Highly Effective", "Effective", "Developing", "Needs Improvement"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>

                            {/* Multi-selects */}
                            <Card className="  shadow-sm">
                                <CardContent className="p-5 space-y-8">
                                    <CheckGroup items={CULTURE_TOOLS} field="cultureTools" label="Culture Tools Observed" form={form} toggleList={toggleList} readOnly={isViewMode} />
                                    <CheckGroup items={ROUTINES} field="routinesObserved" label="Routines Observed" form={form} toggleList={toggleList} readOnly={isViewMode} />
                                    <CheckGroup items={STUDIO_HABITS} field="studioHabits" label="Studio Habits Observed" form={form} toggleList={toggleList} readOnly={isViewMode} />
                                    <CheckGroup items={INSTRUCTIONAL_TOOLS} field="instructionalTools" label="Instructional Tools Observed" form={form} toggleList={toggleList} readOnly={isViewMode} />
                                </CardContent>
                            </Card>

                            {/* Feedback fields */}
                            <Card className="  shadow-sm">
                                <CardHeader style={{ background: DARK }} className="rounded-t-xl"><CardTitle className="text-white text-base">Feedback Section</CardTitle></CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Your Feedback to the Teacher *</Label>
                                        <Textarea className="min-h-[100px]" placeholder="Share your observation feedback..." value={form.feedback} onChange={e => set("feedback", e.target.value)} readOnly={isViewMode} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">One Reflection Shared by Teacher *</Label>
                                        <Textarea className="min-h-[90px]" placeholder="Teacher's reflection..." value={form.teacherReflection} onChange={e => set("teacherReflection", e.target.value)} readOnly={isViewMode} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wide text-muted-foreground">Action Step *</Label>
                                        <Textarea className="min-h-[90px]" placeholder="Agreed action step..." value={form.actionStep} onChange={e => set("actionStep", e.target.value)} readOnly={isViewMode} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Meta Tags */}
                            <Card className="  shadow-sm">
                                <CardHeader style={{ background: DARK }} className="rounded-t-xl"><CardTitle className="text-white text-base">Meta Tags (select at least 1) *</CardTitle></CardHeader>
                                <CardContent className="p-5">
                                    <CheckGroup items={META_TAGS} field="metaTags" label="" form={form} toggleList={toggleList} readOnly={isViewMode} />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between pt-2 pb-10">
                        {step > 1 ? (
                            <Button variant="outline" onClick={handleBack} className="gap-2"><ChevronLeft className="w-4 h-4" /> Back</Button>
                        ) : (
                            <Button variant="ghost" onClick={() => navigate("/leader/va-obs")} className="gap-2"><ChevronLeft className="w-4 h-4" /> Cancel</Button>
                        )}
                        {step < TOTAL ? (
                            <Button onClick={handleNext} className="gap-2 text-white" style={{ background: ACCENT }}>Next <ChevronRight className="w-4 h-4" /></Button>
                        ) : isViewMode ? (
                            <Button onClick={() => navigate(`/leader/growth/${form.teacherId}`)} className="gap-2 text-white" style={{ background: DARK }}>
                                <ChevronLeft className="w-4 h-4" /> Back to Growth
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} className="gap-2 text-white" style={{ background: DARK }}>
                                <Save className="w-4 h-4" /> {searchParams.get("id") ? "Update Observation" : "Submit Observation"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </GrowthLayout>

    );
};

export default VAObsPage;
