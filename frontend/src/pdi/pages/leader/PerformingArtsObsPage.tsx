import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@pdi/components/ui/button";
import { Input } from "@pdi/components/ui/input";
import { Textarea } from "@pdi/components/ui/textarea";
import { Label } from "@pdi/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@pdi/components/ui/select";
import { ChevronLeft, ChevronRight, CheckCircle, Music, Loader2 } from "lucide-react";
import { useAuth } from "@pdi/hooks/useAuth";
import { userService } from "@pdi/services/userService";
import api from "@pdi/lib/api";
import { toast } from "sonner";
import { cn } from "@pdi/lib/utils";
import { GrowthLayout } from "@pdi/components/growth/GrowthLayout";
import { ObservationReport } from "@pdi/components/growth/ObservationReport";

// ─── Constants ───────────────────────────────────────────────────────────────
const RATING_MAP: Record<string, number> = {
    'Highly Effective': 4,
    'Effective': 3,
    'Developing': 2,
    'Basic': 1,
    'Needs Improvement': 1,
    'Not Observed': 0
};

const GRADES = ["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4",
    "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

const SECTION_A_STATEMENTS = [
    "Teacher states student learning objectives",
    "Gives clear directions",
    "Demonstrates relevant examples",
    "Provides practice time",
    "Offers skill correction & feedback",
    "States safety procedures",
];
const SECTION_B_STATEMENTS = [
    "Appropriate class pace",
    "Maintains engagement",
    "50%+ student participation",
    "Monitors behavior",
    "Treats students with respect",
    "Rules posted & expectations clear",
];
const SECTION_C_STATEMENTS = [
    "Instant warm-up activity",
    "Grouping for performance",
    "Cool-down activity",
    "Organized dismissal routine",
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
    "Entry Ticket", "Exit Ticket", "Go-round", "I Used to Think / Now I Know", "Imagine If",
    "KWL", "Options Diamonds", "Parts & Perspectives", "Put on Your Thinking Cap",
    "Quick Draw - Quick Write", "Reading Jigsaw", "Round Table Discussion", "See-Think-Wonder",
    "Show Call", "T-Chart", "Talking Sticks", "Think-Pair-Share", "Turn & Talk",
    "Venn Diagram", "Wait Time", "No Tools Observed", "Other",
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

const OBSERVER_ROLES = [
    "Academic Coordinator", "CCA Coordinator", "Head of School", "ELC Team Member", "PDI Team Member", "Other",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
type TriOption = "Yes" | "No" | "NA" | "";
type MatrixState = Record<string, TriOption>;

const initMatrix = (statements: string[]): MatrixState =>
    Object.fromEntries(statements.map(s => [s, ""]));

const toggleMulti = (arr: string[], val: string): string[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

// ─── Sub-components ───────────────────────────────────────────────────────────
const TriMatrix: React.FC<{
    statements: string[];
    values: MatrixState;
    onChange: (s: string, v: TriOption) => void;
    readOnly?: boolean;
}> = ({ statements, values, onChange, readOnly }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
            <thead>
                <tr style={{ background: "#1F2839", color: "white" }}>
                    <th className="text-left px-4 py-2 rounded-tl font-medium">Statement</th>
                    {(["Yes", "No", "NA"] as TriOption[]).filter(Boolean).map(opt => (
                        <th key={opt} className="px-4 py-2 text-center font-medium w-20">{opt === "NA" ? "N/A" : opt}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {statements.map((s, i) => (
                    <tr key={s} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="px-4 py-2 border-b text-slate-700">{s}</td>
                        {(["Yes", "No", "NA"] as TriOption[]).filter(Boolean).map(opt => (
                            <td key={opt} className="text-center border-b px-4 py-2">
                                <input
                                    type="radio"
                                    name={`matrix-${i}`}
                                    checked={values[s] === opt}
                                    onChange={() => onChange(s, opt)}
                                    disabled={readOnly}
                                    className={cn("w-4 h-4 cursor-pointer accent-amber-600", readOnly && "cursor-not-allowed opacity-60")}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const MultiCheckGrid: React.FC<{
    options: string[];
    selected: string[];
    onToggle: (v: string) => void;
    readOnly?: boolean;
}> = ({ options, selected, onToggle, readOnly }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map(opt => (
            <label key={opt} className={`flex items-center gap-2 p-2 rounded-lg border text-sm transition-all ${selected.includes(opt) ? "border-amber-500 bg-amber-50 font-medium" : "border-slate-200 hover:border-amber-300"} ${readOnly ? "cursor-default" : "cursor-pointer"}`}>
                <input
                    type="checkbox"
                    checked={selected.includes(opt)}
                    onChange={() => !readOnly && onToggle(opt)}
                    disabled={readOnly}
                    className={cn("accent-amber-600 w-4 h-4", !readOnly && "cursor-pointer", readOnly && "opacity-60")}
                />
                {opt}
            </label>
        ))}
    </div>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar: React.FC<{ step: number; total: number }> = ({ step, total }) => (
    <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: total }, (_, i) => (
            <React.Fragment key={i}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${i < step ? "text-white" : i === step ? "text-white" : "bg-slate-200 text-slate-500"}`}
                    style={i <= step ? { background: i < step ? "#B69D74" : "#1F2839" } : {}}>
                    {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                {i < total - 1 && <div className={`flex-1 h-1 rounded transition-all ${i < step ? "opacity-100" : "bg-slate-200"}`}
                    style={i < step ? { background: "#B69D74" } : {}} />}
            </React.Fragment>
        ))}
    </div>
);

const STEP_LABELS = ["Observer Details", "Classroom Details", "Observation", "Feedback"];

// ─── Main Page ────────────────────────────────────────────────────────────────
const PerformingArtsObsPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const teacherId = searchParams.get("teacherId");
    const isViewMode = searchParams.get("mode") === "view";

    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [loadingTeacher, setLoadingTeacher] = useState(!!teacherId);

    // Page 1
    const [observerEmail, setObserverEmail] = useState(user?.email || "");
    const [teacherName, setTeacherName] = useState(searchParams.get("teacherName") || "");
    const [teacherEmail, setTeacherEmail] = useState(searchParams.get("teacherEmail") || "");
    const [observerName, setObserverName] = useState(user?.fullName || "");
    const [observerRole, setObserverRole] = useState("");
    const [observerRoleOther, setObserverRoleOther] = useState("");
    const [observationDate, setObservationDate] = useState(new Date().toISOString().split("T")[0]);

    // Page 2
    const [block, setBlock] = useState("");
    const [grade, setGrade] = useState("");
    const [section, setSection] = useState("");

    // Page 3
    const [secA, setSecA] = useState<MatrixState>(initMatrix(SECTION_A_STATEMENTS));
    const [secAEvidence, setSecAEvidence] = useState("");
    const [secB, setSecB] = useState<MatrixState>(initMatrix(SECTION_B_STATEMENTS));
    const [secBEvidence, setSecBEvidence] = useState("");
    const [secC, setSecC] = useState<MatrixState>(initMatrix(SECTION_C_STATEMENTS));
    const [secCEvidence, setSecCEvidence] = useState("");
    const [overallRating, setOverallRating] = useState<number>(0);
    const [cultureTools, setCultureTools] = useState<string[]>([]);
    const [routinesObserved, setRoutinesObserved] = useState<string[]>([]);
    const [instructionalTools, setInstructionalTools] = useState<string[]>([]);

    // Page 4
    const [discussedWithTeacher, setDiscussedWithTeacher] = useState<boolean | null>(null);
    const [feedback, setFeedback] = useState("");
    const [teacherReflection, setTeacherReflection] = useState("");
    const [actionStep, setActionStep] = useState("");
    const [metaTags, setMetaTags] = useState<string[]>([]);

    useEffect(() => {
        if (!user) return;
        setObserverEmail(user.email);
        setObserverName(user.fullName);
        if (teacherId) {
            userService.getTeachers().then(teachers => {
                const found = teachers.find(t => t.id === teacherId);
                if (found) {
                    setTeacherName(found.fullName);
                    setTeacherEmail(found.email);
                }
                setLoadingTeacher(false);
            }).catch(() => setLoadingTeacher(false));
        }
        const obsId = searchParams.get("id");
        if (obsId) {
            const fetchObs = async () => {
                try {
                    setFetching(true);
                    const res = await api.get(`/growth/observations/${obsId}`);
                    const obs = res.data?.data?.observation;
                    if (obs) {
                        const payload = typeof obs.formPayload === 'string' ? JSON.parse(obs.formPayload) : obs.formPayload;

                        // Populate state
                        const data = payload || obs;

                        // Helper to merge legacy detailedReflection if it exists
                        const getSecData = (currentResponses: any, sectionRows: string[]) => {
                            const result = { ...currentResponses };
                            if (data.detailedReflection) {
                                // Try to map legacy data
                                sectionRows.forEach(row => {
                                    if (data.detailedReflection[row]) {
                                        result[row] = data.detailedReflection[row];
                                    }
                                });
                            }
                            return result;
                        };

                        setTeacherName(obs.teacher?.fullName || data.teacherName || "");
                        setTeacherEmail(obs.teacher?.email || data.teacherEmail || "");
                        setObserverName(obs.observer?.fullName || data.observerName || "");
                        setObservationDate(obs.observationDate ? new Date(obs.observationDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
                        setObserverRole(data.observerRole || "");
                        setBlock(data.block || "");
                        setGrade(data.grade || "");
                        setSection(data.section || "");

                        // Robust loading for sections A, B, C
                        const loadedSecA = data.sectionAResponses || data.secA || {};
                        setSecA(prev => ({ ...prev, ...getSecData(loadedSecA, SECTION_A_STATEMENTS) }));
                        setSecAEvidence(data.sectionAEvidence || data.secAEvidence || "");

                        const loadedSecB = data.sectionBResponses || data.secB || {};
                        setSecB(prev => ({ ...prev, ...getSecData(loadedSecB, SECTION_B_STATEMENTS) }));
                        setSecBEvidence(data.sectionBEvidence || data.secBEvidence || "");

                        const loadedSecC = data.sectionCResponses || data.secC || {};
                        setSecC(prev => ({ ...prev, ...getSecData(loadedSecC, SECTION_C_STATEMENTS) }));
                        setSecCEvidence(data.sectionCEvidence || data.secCEvidence || "");

                        // Rating mapping
                        let ratingVal = 0;
                        if (typeof data.overallRating === 'number') {
                            ratingVal = data.overallRating;
                        } else if (typeof data.overallRating === 'string') {
                            ratingVal = RATING_MAP[data.overallRating] || 0;
                        }

                        if (obs.overallRating && typeof obs.overallRating === 'number') {
                            ratingVal = obs.overallRating;
                        }
                        setOverallRating(ratingVal);

                        setFeedback(data.feedback || data.notes || "");
                        setTeacherReflection(data.teacherReflection || "");
                        setActionStep(data.actionStep || "");

                        // Tools and Tags
                        setCultureTools(data.cultureTools || data.tools || []);
                        setRoutinesObserved(data.routinesObserved || data.routines || []);
                        setInstructionalTools(data.instructionalTools || []);
                        setMetaTags(data.metaTags || (typeof obs.metaTags === 'string' ? JSON.parse(obs.metaTags || '[]') : obs.metaTags) || []);

                        if (data.discussedWithTeacher !== undefined || data.discussionMet !== undefined) {
                            const met = data.discussedWithTeacher === true || data.discussedWithTeacher === 'Yes' || data.discussionMet === true;
                            setDiscussedWithTeacher(met);
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch observation", e);
                    toast.error("Failed to load observation data");
                } finally {
                    setFetching(false);
                }
            };
            fetchObs();
        }
    }, [searchParams, user, teacherId]); // Added user and teacherId to dependencies

    if (!user || loadingTeacher) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    const validate = (): boolean => {
        if (step === 0) {
            if (!teacherName || !teacherEmail || !observerRole || !observationDate) {
                toast.error("Please fill in all required fields"); return false;
            }
            if (observerRole === "Other" && !observerRoleOther) {
                toast.error("Please specify your role"); return false;
            }
        }
        if (step === 1) {
            if (!block || !grade || !section) { toast.error("Please fill in all required fields"); return false; }
        }
        if (step === 2) {
            if (!secAEvidence || !secBEvidence || !secCEvidence) {
                toast.error("Please fill in all evidence fields"); return false;
            }
            if (overallRating === 0) { toast.error("Please select an overall rating"); return false; }
        }
        if (step === 3) {
            if (discussedWithTeacher === null) { toast.error("Please indicate if you discussed the observation"); return false; }
            if (!feedback || !teacherReflection || !actionStep) { toast.error("Please fill all feedback fields"); return false; }
            if (metaTags.length === 0) { toast.error("Please select at least one meta tag"); return false; }
        }
        return true;
    };

    const handleNext = () => { if (validate()) setStep(s => s + 1); };
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        const obsId = searchParams.get("id");

        const fullForm = {
            teacherId,
            observerEmail, teacherName, teacherEmail, observerName,
            observerRole, observerRoleOther, observationDate,
            block, grade, section,
            sectionAResponses: secA, sectionAEvidence: secAEvidence,
            sectionBResponses: secB, sectionBEvidence: secBEvidence,
            sectionCResponses: secC, sectionCEvidence: secCEvidence,
            overallRating, cultureTools, routinesObserved, instructionalTools,
            discussedWithTeacher, feedback, teacherReflection, actionStep, metaTags,
            moduleType: "PERFORMING_ARTS",
            academicYear: "AY 25-26",
            formPayload: {
                observerEmail, teacherName, teacherEmail, observerName,
                observerRole, observerRoleOther, observationDate,
                block, grade, section,
                sectionAResponses: secA, sectionAEvidence: secAEvidence,
                sectionBResponses: secB, sectionBEvidence: secBEvidence,
                sectionCResponses: secC, sectionCEvidence: secCEvidence,
                overallRating, cultureTools, routinesObserved, instructionalTools,
                discussedWithTeacher, feedback, teacherReflection, actionStep, metaTags,
            },
            status: "SUBMITTED"
        };

        try {
            if (obsId) {
                await api.patch(`/growth/observations/${obsId}`, fullForm);
                toast.success("Observation updated successfully!");
            } else {
                await api.post("/growth/observations", fullForm);
                toast.success("Observation submitted successfully!");
            }
            navigate(`/leader/growth/${teacherId}`);
        } catch (e) {
            toast.error("Failed to save observation");
        } finally {
            setSubmitting(false);
        }
    };

    const sectionClass = "mb-6";
    const labelClass = "text-sm font-semibold mb-1.5 block";
    const requiredStar = <span className="text-red-500 ml-1">*</span>;
    const accentColor = "#B69D74";
    const darkColor = "#1F2839";

    if (isViewMode && !fetching) {
        const reportData = {
            teacherName, teacherEmail, observerName, observerEmail,
            observationDate, campus: (user as any)?.campus || (user as any)?.campusId || "N/A",
            grade, section, block,
            sectionA: secA, sectionAEvidence: secAEvidence,
            sectionB: secB, sectionBEvidence: secBEvidence,
            sectionC: secC, sectionCEvidence: secCEvidence,
            overallRating,
            cultureTools, routinesObserved, instructionalTools,
            feedback,
            strengths: feedback,
            actionStep,
            areasOfGrowth: actionStep,
            metaTags
        };

        return (

            <GrowthLayout allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
                <div className="pt-8 px-4">
                    <ObservationReport data={reportData} onBack={() => navigate(`/leader/growth/${teacherId}`)} />
                </div>
            </GrowthLayout>

        );
    }

    return (

        <GrowthLayout allowedRoles={['LEADER', 'SCHOOL_LEADER', 'ADMIN', 'SUPERADMIN']}>
            <div className="max-w-4xl mx-auto pb-16 animate-in fade-in duration-500 relative">
                {fetching && (
                    <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            <p className="font-bold text-amber-900">Loading observation data...</p>
                        </div>
                    </div>
                )}
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl text-white" style={{ background: accentColor }}>
                            <Music className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: darkColor }}>AY 25-26 Performing Arts Observation_Master</h1>
                            <p className="text-xs text-muted-foreground">{STEP_LABELS[step]}</p>
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <ProgressBar step={step} total={4} />
                <div className="flex justify-between text-xs text-muted-foreground mb-6 -mt-4">
                    {STEP_LABELS.map((l, i) => (
                        <span key={l} className={`${i === step ? "font-bold" : ""}`} style={i === step ? { color: darkColor } : {}}>{l}</span>
                    ))}
                </div>

                <Card className="  shadow-md" style={{ background: "white" }}>
                    <CardContent className="p-6 md:p-8">

                        {/* ─── STEP 0: Observer Details ─── */}
                        {step === 0 && (
                            <div className="space-y-5">
                                <CardTitle className="text-lg mb-4" style={{ color: darkColor }}>Page 1 — Observer Details</CardTitle>

                                <div className={sectionClass}>
                                    <Label className={labelClass}>Observer Email (auto-filled){requiredStar}</Label>
                                    <Input value={observerEmail} readOnly className="bg-slate-50 text-muted-foreground" />
                                </div>
                                <div className={sectionClass}>
                                    <Label className={labelClass}>Name of the Teacher{requiredStar}</Label>
                                    <Input value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="Enter teacher's full name" readOnly={isViewMode || !!searchParams.get("teacherName")} className={cn((isViewMode || !!searchParams.get("teacherName")) && "bg-slate-50 text-muted-foreground")} />
                                </div>
                                <div className={sectionClass}>
                                    <Label className={labelClass}>Teacher Email ID{requiredStar}</Label>
                                    <Input type="email" value={teacherEmail} onChange={e => setTeacherEmail(e.target.value)} placeholder="teacher@school.edu" readOnly={isViewMode || !!searchParams.get("teacherEmail")} className={cn((isViewMode || !!searchParams.get("teacherEmail")) && "bg-slate-50 text-muted-foreground")} />
                                </div>
                                <div className={sectionClass}>
                                    <Label className={labelClass}>Observer's Name{requiredStar}</Label>
                                    <Input value={observerName} onChange={e => setObserverName(e.target.value)} placeholder="Your name" readOnly={isViewMode} className={cn(isViewMode && "bg-slate-50 text-muted-foreground")} />
                                </div>
                                <div className={sectionClass}>
                                    <Label className={labelClass}>Observer's Role{requiredStar}</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {OBSERVER_ROLES.map(role => (
                                            <label key={role} className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${observerRole === role ? "border-amber-500 bg-amber-50 font-semibold" : "border-slate-200 hover:border-amber-300"} ${isViewMode ? "cursor-default" : "cursor-pointer"}`}>
                                                <input type="radio" name="observerRole" checked={observerRole === role} onChange={() => !isViewMode && setObserverRole(role)} disabled={isViewMode} className={cn("accent-amber-600 w-4 h-4", !isViewMode && "cursor-pointer")} />
                                                {role}
                                            </label>
                                        ))}
                                    </div>
                                    {observerRole === "Other" && (
                                        <Input className="mt-3" value={observerRoleOther} onChange={e => setObserverRoleOther(e.target.value)} placeholder="Please specify your role" readOnly={isViewMode} />
                                    )}
                                </div>
                                <div className={sectionClass}>
                                    <Label className={labelClass}>Date of Observation{requiredStar}</Label>
                                    <Input type="date" value={observationDate} onChange={e => setObservationDate(e.target.value)} readOnly={isViewMode} className={cn(isViewMode && "bg-slate-50 text-muted-foreground")} />
                                </div>
                            </div>
                        )}

                        {/* ─── STEP 1: Classroom Details ─── */}
                        {step === 1 && (
                            <div className="space-y-5">
                                <CardTitle className="text-lg mb-4" style={{ color: darkColor }}>Page 2 — Classroom Details</CardTitle>

                                <div className={sectionClass}>
                                    <Label className={labelClass}>Block{requiredStar}</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["Early Years", "Primary", "Middle", "Senior"].map(b => (
                                            <label key={b} className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${block === b ? "border-amber-500 bg-amber-50 font-semibold" : "border-slate-200 hover:border-amber-300"} ${isViewMode ? "cursor-default" : "cursor-pointer"}`}>
                                                <input type="radio" name="block" checked={block === b} onChange={() => !isViewMode && setBlock(b)} disabled={isViewMode} className={cn("accent-amber-600 w-4 h-4", !isViewMode && "cursor-pointer")} />
                                                {b}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className={sectionClass}>
                                    <Label className={labelClass}>Grade{requiredStar}</Label>
                                    <Select value={grade} onValueChange={setGrade} disabled={isViewMode}>
                                        <SelectTrigger className={cn(isViewMode && "bg-slate-50 text-muted-foreground")}><SelectValue placeholder="Select grade" /></SelectTrigger>
                                        <SelectContent>
                                            {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={sectionClass}>
                                    <Label className={labelClass}>Section{requiredStar}</Label>
                                    <Input value={section} onChange={e => setSection(e.target.value.slice(0, 5))} placeholder="e.g. A" maxLength={5} readOnly={isViewMode} className={cn(isViewMode && "bg-slate-50 text-muted-foreground")} />
                                </div>
                            </div>
                        )}

                        {/* ─── STEP 2: Observation ─── */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <CardTitle className="text-lg mb-2" style={{ color: darkColor }}>Page 3 — Performing Arts Observation</CardTitle>

                                {/* Section A */}
                                <div>
                                    <h3 className="font-bold text-base mb-3 pb-1 border-b" style={{ color: darkColor }}>Section A: Curriculum and Instruction</h3>
                                    <TriMatrix statements={SECTION_A_STATEMENTS} values={secA} onChange={(s, v) => setSecA(p => ({ ...p, [s]: v }))} readOnly={isViewMode} />
                                    <div className="mt-4">
                                        <Label className={labelClass}>Share evidences for your rating (A){requiredStar}</Label>
                                        <Textarea value={secAEvidence} onChange={e => setSecAEvidence(e.target.value)} rows={3} placeholder="Describe what you observed..." readOnly={isViewMode} />
                                    </div>
                                </div>

                                {/* Section B */}
                                <div>
                                    <h3 className="font-bold text-base mb-3 pb-1 border-b" style={{ color: darkColor }}>Section B: Culture and Environment</h3>
                                    <TriMatrix statements={SECTION_B_STATEMENTS} values={secB} onChange={(s, v) => setSecB(p => ({ ...p, [s]: v }))} readOnly={isViewMode} />
                                    <div className="mt-4">
                                        <Label className={labelClass}>Share evidences for your rating (B){requiredStar}</Label>
                                        <Textarea value={secBEvidence} onChange={e => setSecBEvidence(e.target.value)} rows={3} placeholder="Describe what you observed..." readOnly={isViewMode} />
                                    </div>
                                </div>

                                {/* Section C */}
                                <div>
                                    <h3 className="font-bold text-base mb-3 pb-1 border-b" style={{ color: darkColor }}>Section C: PA Classroom Procedures</h3>
                                    <TriMatrix statements={SECTION_C_STATEMENTS} values={secC} onChange={(s, v) => setSecC(p => ({ ...p, [s]: v }))} readOnly={isViewMode} />
                                    <div className="mt-4">
                                        <Label className={labelClass}>Share evidences for your rating (C){requiredStar}</Label>
                                        <Textarea value={secCEvidence} onChange={e => setSecCEvidence(e.target.value)} rows={3} placeholder="Describe what you observed..." readOnly={isViewMode} />
                                    </div>
                                </div>

                                {/* Overall Rating */}
                                <div>
                                    <h3 className="font-bold text-base mb-3 pb-1 border-b" style={{ color: darkColor }}>Overall Classroom Rating{requiredStar}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[{ val: 1, label: "Basic", desc: "Basic (1)" }, { val: 2, label: "Developing", desc: "Developing (2)" }, { val: 3, label: "Effective", desc: "Effective (3)" }, { val: 4, label: "Highly Effective", desc: "Highly Effective (4)" }].map(r => (
                                            <label key={r.val} className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 text-sm transition-all text-center ${overallRating === r.val ? "border-amber-500 bg-amber-50 font-bold" : "border-slate-200 hover:border-amber-300"} ${isViewMode ? "cursor-default" : "cursor-pointer"}`}>
                                                <input type="radio" name="overallRating" checked={overallRating === r.val} onChange={() => !isViewMode && setOverallRating(r.val)} disabled={isViewMode} className={cn("accent-amber-600", !isViewMode && "cursor-pointer")} />
                                                <span className="text-2xl font-black" style={{ color: overallRating === r.val ? accentColor : "#94a3b8" }}>{r.val}</span>
                                                <span>{r.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Culture Tools */}
                                <div>
                                    <h3 className="font-bold text-base mb-3 pb-1 border-b" style={{ color: darkColor }}>Culture Tools Observed</h3>
                                    <MultiCheckGrid options={CULTURE_TOOLS} selected={cultureTools} onToggle={v => setCultureTools(t => toggleMulti(t, v))} readOnly={isViewMode} />
                                </div>

                                {/* Routines */}
                                <div>
                                    <h3 className="font-bold text-base mb-3 pb-1 border-b" style={{ color: darkColor }}>Routines Observed</h3>
                                    <MultiCheckGrid options={ROUTINES} selected={routinesObserved} onToggle={v => setRoutinesObserved(t => toggleMulti(t, v))} readOnly={isViewMode} />
                                </div>

                                {/* Instructional Tools */}
                                <div>
                                    <h3 className="font-bold text-base mb-3 pb-1 border-b" style={{ color: darkColor }}>Instructional Tools Observed</h3>
                                    <MultiCheckGrid options={INSTRUCTIONAL_TOOLS} selected={instructionalTools} onToggle={v => setInstructionalTools(t => toggleMulti(t, v))} readOnly={isViewMode} />
                                </div>
                            </div>
                        )}

                        {/* ─── STEP 3: Feedback ─── */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <CardTitle className="text-lg mb-4" style={{ color: darkColor }}>Page 4 — Feedback</CardTitle>

                                <div className={sectionClass}>
                                    <Label className={labelClass}>Have you met and discussed the observation?{requiredStar}</Label>
                                    <div className="flex gap-4">
                                        {["Yes", "No"].map(opt => (
                                            <label key={opt} className={`flex items-center gap-2 px-5 py-3 rounded-lg border text-sm font-medium transition-all ${(discussedWithTeacher === true && opt === "Yes") || (discussedWithTeacher === false && opt === "No") ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-amber-300"} ${isViewMode ? "cursor-default" : "cursor-pointer"}`}>
                                                <input type="radio" name="discussed" checked={opt === "Yes" ? discussedWithTeacher === true : discussedWithTeacher === false} onChange={() => !isViewMode && setDiscussedWithTeacher(opt === "Yes")} disabled={isViewMode} className={cn("accent-amber-600", !isViewMode && "cursor-pointer")} />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className={sectionClass}>
                                    <Label className={labelClass}>Your feedback to the teacher{requiredStar}</Label>
                                    <Textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} placeholder="Provide detailed feedback..." readOnly={isViewMode} />
                                </div>
                                <div className={sectionClass}>
                                    <Label className={labelClass}>One reflection shared by teacher{requiredStar}</Label>
                                    <Textarea value={teacherReflection} onChange={e => setTeacherReflection(e.target.value)} rows={4} placeholder="Teacher's reflection..." readOnly={isViewMode} />
                                </div>
                                <div className={sectionClass}>
                                    <Label className={labelClass}>Action Step{requiredStar}</Label>
                                    <Textarea value={actionStep} onChange={e => setActionStep(e.target.value)} rows={3} placeholder="Agreed action step..." readOnly={isViewMode} />
                                </div>

                                {/* Meta Tags */}
                                <div>
                                    <Label className={labelClass}>Meta Tags{requiredStar} <span className="text-muted-foreground font-normal text-xs">(select at least 1)</span></Label>
                                    <MultiCheckGrid options={META_TAGS} selected={metaTags} onToggle={v => setMetaTags(t => toggleMulti(t, v))} readOnly={isViewMode} />
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-4 border-t">
                            <Button variant="outline" onClick={handleBack} disabled={step === 0} className="flex items-center gap-2">
                                <ChevronLeft className="w-4 h-4" /> Back
                            </Button>
                            {step < 3 ? (
                                <Button onClick={handleNext} className="flex items-center gap-2 font-semibold" style={{ background: darkColor, color: "white" }}>
                                    Next <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : isViewMode ? (
                                <Button onClick={() => navigate(`/leader/growth/${teacherId}`)} className="flex items-center gap-2 font-semibold text-white" style={{ background: darkColor }}>
                                    <ChevronLeft className="w-4 h-4" /> Back to Growth
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 font-semibold text-white" style={{ background: accentColor }}>
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    {submitting ? "Saving..." : (searchParams.get("id") ? "Update Observation" : "Submit Observation")}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </GrowthLayout>

    );
};

export default PerformingArtsObsPage;
