import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@pdi/components/ui/button";
import { Input } from "@pdi/components/ui/input";
import { Label } from "@pdi/components/ui/label";
import { Textarea } from "@pdi/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@pdi/components/ui/card";
import { Badge } from "@pdi/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@pdi/components/ui/radio-group";
import { Checkbox } from "@pdi/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { Heart, ChevronLeft, ChevronRight, Save, Users, BookOpen, ClipboardCheck, MessageSquare } from "lucide-react";
import { useAuth } from "@pdi/hooks/useAuth";
import api from "@pdi/lib/api";
import { toast } from "sonner";
import { cn } from "@pdi/lib/utils";
import { GrowthLayout } from "@pdi/components/growth/GrowthLayout";
import { ObservationReport } from "@pdi/components/growth/ObservationReport";

// ─── Constants ─────────────────────────────────────────────────────────────

const RATING_MAP: Record<string, number> = {
    'Highly Effective': 4,
    'Effective': 3,
    'Developing': 2,
    'Basic': 1,
    'Needs Improvement': 1,
    'Not Observed': 0
};

const GRADES = ["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

const SECTION_A_ROWS = [
    "Teacher states Life Skills learning objectives (self-awareness, empathy, digital citizenship etc.)",
    "Connects activities to real-life contexts",
    "Clear step-by-step instructions given",
    "Reflection/journaling/discussion opportunities provided",
    "Uses questioning, role-play, scenarios",
    "Feedback emphasizes growth and respect",
];

const SECTION_B_ROWS = [
    "Safe and respectful environment fostered",
    "50%+ student engagement",
    "Teacher models empathy & inclusivity",
    "Behavior guided constructively",
    "Norms & confidentiality reinforced",
    "Culture tools used (Circulate, Countdown, Social Contract, Post the Plan)",
];

const SECTION_C_ROWS = [
    "Uses centering/grounding activity",
    "Experiential learning participation",
    "Reflection time allocated",
    "Closure summarizing key learnings",
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
    "Designing a Microplan", "Using Student Assessments",
    "Creating an Environment of Respect and Rapport", "Establishing a Culture for Learning",
    "Managing Classroom Procedures", "Managing Student Behaviour", "Communicating with Students",
    "Using Questioning and Discussion Techniques", "Using Assessment in Instruction",
    "Organizing Physical Space", "Cleanliness", "Use of Boards", "Reflecting on Teaching",
    "Maintaining Accurate Records", "Communicating with Families",
    "Participating in a Professional Community", "Growing and Developing Professionally",
];

type MatrixVal = "Yes" | "No" | "NA" | "";

// ─── Component ─────────────────────────────────────────────────────────────

const MatrixTable = ({
    rows, field, label, form, setMatrix, set, DARK, ACCENT, readOnly
}: {
    rows: string[];
    field: "sectionAResponses" | "sectionBResponses" | "sectionCResponses";
    label: string;
    form: any;
    setMatrix: any;
    set: any;
    DARK: string;
    ACCENT: string;
    readOnly?: boolean;
}) => (
    <div className="space-y-3">
        {/* Header */}
        <div className="grid grid-cols-[1fr_80px_80px_120px] gap-2 text-xs font-bold capitalize tracking-wider px-3 py-2 rounded-lg" style={{ background: DARK, color: "white" }}>
            <span>Statement</span>
            <span className="text-center">Yes</span>
            <span className="text-center">No</span>
            <span className="text-center">Not Applicable</span>
        </div>
        {rows.map((row, i) => (
            <div key={row} className={`grid grid-cols-[1fr_80px_80px_120px] gap-2 items-center px-3 py-3 rounded-lg border ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                <span className="text-sm leading-snug">{row}</span>
                {(["Yes", "No", "NA"] as MatrixVal[]).map(val => (
                    <div key={val} className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => !readOnly && setMatrix(field, row, val)}
                            disabled={readOnly}
                            className={cn(
                                "w-8 h-8 rounded-full border-2 text-xs font-bold transition-all",
                                (form[field] as Record<string, MatrixVal>)[row] === val
                                    ? "text-foreground border-transparent scale-110"
                                    : "border-slate-200 text-muted-foreground hover:border-slate-400",
                                readOnly && "cursor-default"
                            )}
                            style={(form[field] as Record<string, MatrixVal>)[row] === val ? { background: ACCENT } : {}}
                        >
                            {val === "NA" ? "NA" : val[0]}
                        </button>
                    </div>
                ))}
            </div>
        ))}
        <div className="space-y-2 pt-2">
            <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">
                Share evidences for your rating ({label}) *
            </Label>
            <Textarea
                placeholder="Provide specific evidence for your ratings above..."
                className="min-h-[90px]"
                value={(form as any)[`section${label}Evidence`]}
                onChange={e => set(`section${label}Evidence`, e.target.value)}
                readOnly={readOnly}
            />
        </div>
    </div>
);

const CheckboxGroup = ({
    items, field, label, form, toggleList, readOnly
}: {
    items: string[];
    field: "cultureTools" | "routinesObserved" | "instructionalTools" | "metaTags";
    label: string;
    form: any;
    toggleList: any;
    readOnly?: boolean;
}) => (
    <div className="space-y-3">
        <Label className="text-sm font-bold capitalize tracking-wider text-muted-foreground">{label}</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {items.map(item => {
                const checked = (form[field] as string[]).includes(item);
                return (
                    <div
                        key={item}
                        className={cn("flex items-center gap-2 p-2 rounded-lg border transition-all text-sm", checked ? "border-amber-300 bg-amber-50" : "border-slate-200 hover:bg-slate-50", readOnly ? "cursor-default" : "cursor-pointer")}
                        onClick={() => !readOnly && toggleList(field, item)}
                    >
                        <Checkbox checked={checked} onCheckedChange={() => !readOnly && toggleList(field, item)} disabled={readOnly} />
                        <span className="leading-tight">{item}</span>
                    </div>
                );
            })}
        </div>
    </div>
);

const LifeSkillsObsPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isViewMode = searchParams.get("mode") === "view";
    const [step, setStep] = useState(1);
    const [fetching, setFetching] = useState(false);
    const TOTAL_STEPS = 4;

    const ACCENT = "#B69D74";
    const DARK = "#1F2839";

    const initMatrix = (rows: string[]): Record<string, MatrixVal> =>
        Object.fromEntries(rows.map(r => [r, ""]));

    const [form, setForm] = useState({
        // Page 1
        teacherId: searchParams.get("teacherId") || "",
        observerEmail: user?.email || "",
        teacherName: searchParams.get("teacherName") || "",
        teacherEmail: searchParams.get("teacherEmail") || "",
        observerName: user?.fullName || "",
        observerRole: "",
        observerRoleOther: "",
        observationDate: new Date().toISOString().split("T")[0],
        // Page 2
        block: "",
        grade: "",
        section: "",
        // Page 3 – matrices
        sectionAResponses: initMatrix(SECTION_A_ROWS),
        sectionAEvidence: "",
        sectionBResponses: initMatrix(SECTION_B_ROWS),
        sectionBEvidence: "",
        sectionCResponses: initMatrix(SECTION_C_ROWS),
        sectionCEvidence: "",
        overallRating: "",
        cultureTools: [] as string[],
        routinesObserved: [] as string[],
        instructionalTools: [] as string[],
        // Page 4
        discussedWithTeacher: "",
        feedback: "",
        teacherReflection: "",
        actionStep: "",
        metaTags: [] as string[],
        moduleType: "LIFE_SKILLS",
        academicYear: "AY 25-26",
    });

    const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

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
                        const data = payload || obs;

                        // Helper to merge legacy detailedReflection if it exists
                        const getSecData = (currentResponses: any, sectionRows: string[]) => {
                            const result = { ...currentResponses };
                            if (data.detailedReflection) {
                                sectionRows.forEach(row => {
                                    if (data.detailedReflection[row]) {
                                        result[row] = data.detailedReflection[row];
                                    }
                                });
                            }
                            return result;
                        };

                        setForm(p => ({
                            ...p,
                            ...(payload || obs),
                            teacherId: obs.teacherId,
                            teacherName: obs.teacher?.fullName || payload?.teacherName || obs.teacherName || "",
                            teacherEmail: obs.teacher?.email || payload?.teacherEmail || obs.teacherEmail || "",
                            observationDate: obs.observationDate ? new Date(obs.observationDate).toISOString().split("T")[0] : p.observationDate,
                            sectionAResponses: getSecData(data.sectionAResponses || p.sectionAResponses, SECTION_A_ROWS),
                            sectionBResponses: getSecData(data.sectionBResponses || p.sectionBResponses, SECTION_B_ROWS),
                            sectionCResponses: getSecData(data.sectionCResponses || p.sectionCResponses, SECTION_C_ROWS),
                            overallRating: obs.overallRating ? (Object.keys(ratingMapping).find(k => ratingMapping[k] === obs.overallRating) || payload?.overallRating || obs.overallRating) : (payload?.overallRating || obs.overallRating),
                            discussedWithTeacher: (payload?.discussedWithTeacher || obs.discussionMet) ? (payload?.discussedWithTeacher === true || payload?.discussedWithTeacher === 'Yes' || obs.discussionMet === true ? "Yes" : "No") : ""
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const ratingMapping: Record<string, number> = {
        "1": 1, // Basic
        "2": 2, // Developing
        "3": 3, // Effective
        "4": 4  // Highly Effective
    };

    const setMatrix = (field: "sectionAResponses" | "sectionBResponses" | "sectionCResponses", row: string, val: MatrixVal) =>
        setForm(p => ({ ...p, [field]: { ...(p[field] as any), [row]: val } }));

    const toggleList = (field: "cultureTools" | "routinesObserved" | "instructionalTools" | "metaTags", item: string) =>
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
            const matrices = [
                { m: form.sectionAResponses, rows: SECTION_A_ROWS, label: "Section A" },
                { m: form.sectionBResponses, rows: SECTION_B_ROWS, label: "Section B" },
                { m: form.sectionCResponses, rows: SECTION_C_ROWS, label: "Section C" },
            ];
            for (const { m, rows, label } of matrices) {
                if (rows.some(r => !m[r])) { toast.error(`Please complete all rows in ${label}`); return false; }
            }
            if (!form.sectionAEvidence.trim() || !form.sectionBEvidence.trim() || !form.sectionCEvidence.trim()) {
                toast.error("Please provide evidence for all sections"); return false;
            }
            if (!form.overallRating) { toast.error("Please select an overall rating"); return false; }
        }
        if (step === 4) {
            if (!form.discussedWithTeacher || !form.feedback.trim() || !form.teacherReflection.trim() || !form.actionStep.trim()) {
                toast.error("Please complete all feedback fields"); return false;
            }
            if (form.metaTags.length === 0) { toast.error("Please select at least one meta tag"); return false; }
        }
        return true;
    };

    const handleNext = () => { if (validateStep()) { setStep(p => p + 1); window.scrollTo(0, 0); } };
    const handleBack = () => { setStep(p => p - 1); window.scrollTo(0, 0); };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        const obsId = searchParams.get("id");

        const numericRating = ratingMapping[form.overallRating] || 0;

        try {
            const payload = {
                ...form,
                discussedWithTeacher: form.discussedWithTeacher === "Yes",
                overallRating: numericRating,
                formPayload: { ...form },
                status: "SUBMITTED"
            };

            if (obsId) {
                await api.patch(`/growth/observations/${obsId}`, payload);
                toast.success("Observation updated successfully!");
            } else {
                await api.post("/growth/observations", payload);
                toast.success("Life Skills Observation saved successfully!");
            }
            navigate(`/leader/growth/${form.teacherId}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to save observation");
        }
    };

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
                {/* Top bar */}
                <div className="sticky top-0 z-20 border-b mb-6 px-4 pt-4 pb-4" style={{ background: "#F5F5EF" }}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-xl font-bold" style={{ color: DARK }}>AY 25-26 Life Skills Observation_Master</h1>
                                <p className="text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS}</p>
                            </div>
                        </div>
                        <div className="flex gap-1.5">
                            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                                <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i < step ? "w-10" : "w-6", i < step ? "opacity-100" : "opacity-30")} style={{ background: ACCENT }} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 space-y-6">

                    {/* ── PAGE 1: Observer Details ─── */}
                    {step === 1 && (
                        <Card className="  shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardHeader className="rounded-t-xl pb-4" style={{ background: DARK }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/10"><Users className="w-5 h-5 text-foreground" /></div>
                                    <div>
                                        <CardTitle className="text-foreground">Observer Details</CardTitle>
                                        <CardDescription className="text-foreground/70">Page 1 of 4</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">Observer Email (Auto-captured)</Label>
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
                                        <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">Observer's Name *</Label>
                                        <Input value={form.observerName} onChange={e => set("observerName", e.target.value)} readOnly={isViewMode} className={cn(isViewMode && "bg-slate-50 text-muted-foreground")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">Date of Observation *</Label>
                                        <Input type="date" value={form.observationDate} onChange={e => set("observationDate", e.target.value)} readOnly={isViewMode} className={cn(isViewMode && "bg-slate-50 text-muted-foreground")} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">Observer's Role *</Label>
                                    <RadioGroup value={form.observerRole} onValueChange={v => !isViewMode && set("observerRole", v)} disabled={isViewMode} className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {["Academic Coordinator", "CCA Coordinator", "Head of School", "ELC Team Member", "PDI Team Member", "Other"].map(r => (
                                            <div key={r} className={cn("flex items-center gap-2 border p-3 rounded-xl transition-all", isViewMode ? "cursor-default" : "hover:bg-muted/50 cursor-pointer")}>
                                                <RadioGroupItem value={r} id={`role-${r}`} disabled={isViewMode} />
                                                <Label htmlFor={`role-${r}`} className={cn("text-sm", !isViewMode && "cursor-pointer")}>{r}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {form.observerRole === "Other" && (
                                        <Input placeholder="Specify role..." value={form.observerRoleOther} onChange={e => set("observerRoleOther", e.target.value)} readOnly={isViewMode} />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ── PAGE 2: Classroom Details ─── */}
                    {step === 2 && (
                        <Card className="  shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardHeader className="rounded-t-xl pb-4" style={{ background: DARK }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/10"><BookOpen className="w-5 h-5 text-foreground" /></div>
                                    <div>
                                        <CardTitle className="text-foreground">Classroom Details</CardTitle>
                                        <CardDescription className="text-foreground/70">Page 2 of 4</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">Block *</Label>
                                    <div className="flex flex-wrap gap-3">
                                        {["Early Years", "Primary", "Middle", "Senior"].map(b => (
                                            <button key={b} type="button" onClick={() => !isViewMode && set("block", b)}
                                                disabled={isViewMode}
                                                className={cn("px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all", form.block === b ? "text-foreground border-transparent" : "border-slate-200 hover:border-amber-300", isViewMode && "cursor-default")}
                                                style={form.block === b ? { background: ACCENT } : {}}>
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">Grade *</Label>
                                        <Select value={form.grade} onValueChange={v => set("grade", v)} disabled={isViewMode}>
                                            <SelectTrigger className={cn("h-11", isViewMode && "bg-slate-50 text-muted-foreground")}><SelectValue placeholder="Select grade" /></SelectTrigger>
                                            <SelectContent>{GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">Section *</Label>
                                        <Input maxLength={5} placeholder="e.g. A, Emerald" value={form.section} onChange={e => set("section", e.target.value)} className="h-11" readOnly={isViewMode} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ── PAGE 3: Observation Matrix ─── */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-5 rounded-2xl border" style={{ background: DARK }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/10"><ClipboardCheck className="w-5 h-5 text-foreground" /></div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Life Skills Observation Matrix</h2>
                                        <p className="text-foreground/60 text-sm">Page 3 of 4 — Rate each indicator</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section A */}
                            <Card className="  shadow-md">
                                <CardHeader className="rounded-t-xl py-4 px-5" style={{ background: "#EEF2FF" }}>
                                    <h3 className="font-bold text-indigo-800">🟦 Section A – Curriculum and Instruction</h3>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <MatrixTable rows={SECTION_A_ROWS} field="sectionAResponses" label="A" form={form} setMatrix={setMatrix} set={set} DARK={DARK} ACCENT={ACCENT} readOnly={isViewMode} />
                                </CardContent>
                            </Card>

                            {/* Section B */}
                            <Card className="  shadow-md">
                                <CardHeader className="rounded-t-xl py-4 px-5" style={{ background: "#F0FDF4" }}>
                                    <h3 className="font-bold text-green-800">🟦 Section B – Culture and Environment</h3>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <MatrixTable rows={SECTION_B_ROWS} field="sectionBResponses" label="B" form={form} setMatrix={setMatrix} set={set} DARK={DARK} ACCENT={ACCENT} readOnly={isViewMode} />
                                </CardContent>
                            </Card>

                            {/* Section C */}
                            <Card className="  shadow-md">
                                <CardHeader className="rounded-t-xl py-4 px-5" style={{ background: "#FFF7ED" }}>
                                    <h3 className="font-bold text-orange-800">🟦 Section C – Life Skills Classroom Procedures</h3>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <MatrixTable rows={SECTION_C_ROWS} field="sectionCResponses" label="C" form={form} setMatrix={setMatrix} set={set} DARK={DARK} ACCENT={ACCENT} readOnly={isViewMode} />
                                </CardContent>
                            </Card>

                            {/* Overall Rating */}
                            <Card className="  shadow-md">
                                <CardHeader className="rounded-t-xl py-4 px-5" style={{ background: "#FDF4FF" }}>
                                    <h3 className="font-bold text-purple-800">Overall Rating *</h3>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <RadioGroup value={form.overallRating} onValueChange={v => !isViewMode && set("overallRating", v)} disabled={isViewMode} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[["1", "Basic"], ["2", "Developing"], ["3", "Effective"], ["4", "Highly Effective"]].map(([val, label]) => (
                                            <div key={val} className={cn("flex flex-col items-center gap-1 p-4 border-2 rounded-2xl transition-all", form.overallRating === val ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:border-amber-200", isViewMode ? "cursor-default" : "cursor-pointer")}>
                                                <RadioGroupItem value={val} id={`rating-${val}`} disabled={isViewMode} />
                                                <Label htmlFor={`rating-${val}`} className={cn("font-bold text-lg", !isViewMode && "cursor-pointer")}>{val}</Label>
                                                <span className="text-xs text-muted-foreground text-center">{label}</span>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* Multi-selects */}
                            <Card className="  shadow-md">
                                <CardContent className="p-5 space-y-8">
                                    <CheckboxGroup items={CULTURE_TOOLS} field="cultureTools" label="Culture Tools Observed" form={form} toggleList={toggleList} readOnly={isViewMode} />
                                    <CheckboxGroup items={ROUTINES} field="routinesObserved" label="Routines Observed" form={form} toggleList={toggleList} readOnly={isViewMode} />
                                    <CheckboxGroup items={INSTRUCTIONAL_TOOLS} field="instructionalTools" label="Instructional Tools Observed" form={form} toggleList={toggleList} readOnly={isViewMode} />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* ── PAGE 4: Feedback ─── */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-5 rounded-2xl border" style={{ background: DARK }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-white/10"><MessageSquare className="w-5 h-5 text-foreground" /></div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Feedback Section</h2>
                                        <p className="text-foreground/60 text-sm">Page 4 of 4</p>
                                    </div>
                                </div>
                            </div>

                            <Card className="  shadow-md">
                                <CardContent className="p-6 space-y-5">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">Have you met and discussed the observation? *</Label>
                                        <RadioGroup value={form.discussedWithTeacher} onValueChange={v => !isViewMode && set("discussedWithTeacher", v)} disabled={isViewMode} className="flex gap-6">
                                            {["Yes", "No"].map(v => (
                                                <div key={v} className={cn("flex items-center gap-2 border p-3 rounded-xl transition-all pr-6", isViewMode ? "cursor-default" : "cursor-pointer hover:bg-muted/50")}>
                                                    <RadioGroupItem value={v} id={`disc-${v}`} disabled={isViewMode} />
                                                    <Label htmlFor={`disc-${v}`} className={cn("font-semibold", !isViewMode && "cursor-pointer")}>{v}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">Your Feedback to the Teacher *</Label>
                                        <Textarea className="min-h-[100px]" placeholder="Share your feedback..." value={form.feedback} onChange={e => set("feedback", e.target.value)} readOnly={isViewMode} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">One Reflection Shared by Teacher *</Label>
                                        <Textarea className="min-h-[90px]" placeholder="Teacher's reflection..." value={form.teacherReflection} onChange={e => set("teacherReflection", e.target.value)} readOnly={isViewMode} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold capitalize tracking-wider text-muted-foreground">Action Step *</Label>
                                        <Textarea className="min-h-[90px]" placeholder="Agreed action step..." value={form.actionStep} onChange={e => set("actionStep", e.target.value)} readOnly={isViewMode} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="  shadow-md">
                                <CardHeader className="rounded-t-xl py-4 px-5" style={{ background: DARK }}>
                                    <h3 className="font-bold text-foreground">Meta Tags (select at least 1) *</h3>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <CheckboxGroup items={META_TAGS} field="metaTags" label="" form={form} toggleList={toggleList} readOnly={isViewMode} />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4 pb-10">
                        {step > 1 ? (
                            <Button variant="outline" onClick={handleBack} className="gap-2">
                                <ChevronLeft className="w-4 h-4" /> Back
                            </Button>
                        ) : (
                            <Button variant="ghost" onClick={() => navigate("/leader/life-skills-obs")} className="gap-2">
                                <ChevronLeft className="w-4 h-4" /> Cancel
                            </Button>
                        )}
                        {step < TOTAL_STEPS ? (
                            <Button onClick={handleNext} className="gap-2" style={{ background: ACCENT, color: "white" }}>
                                Next <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : isViewMode ? (
                            <Button onClick={() => navigate(`/leader/growth/${form.teacherId}`)} className="gap-2 text-foreground" style={{ background: DARK }}>
                                <ChevronLeft className="w-4 h-4" /> Back to Growth
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} className="gap-2" style={{ background: DARK, color: "white" }}>
                                <Save className="w-4 h-4" /> {searchParams.get("id") ? "Update Observation" : "Submit Observation"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </GrowthLayout>

    );
};

export default LifeSkillsObsPage;
