import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Info, Save, Send, Upload } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────
type Rating = "yes" | "partial" | "not_seen" | "na" | "";
interface ParamState { rating: Rating; comment: string; }
type Responses = Record<string, ParamState>;

// ── Specialist Rubric Definition ───────────────────────────────────────────────
const SUBDOMAINS = [
  {
    code: "1a", title: "Applying Knowledge of Content & Pedagogy",
    params: [
      { id: "1a_1", name: "Content Knowledge", desc: "", lookFor: "Content is accurate & relevant\nActivities build skills/sportsmanship\nSafety instructions included" },
      { id: "1a_2", name: "Relevant Usage of Tools", desc: "", lookFor: "" },
    ],
  },
  {
    code: "1b", title: "Knowing & Valuing Students",
    params: [
      { id: "1b_1", name: "Differentiated Plan", desc: "", lookFor: "" },
    ],
  },
  {
    code: "1c", title: "Setting Instructional Outcomes",
    params: [
      { id: "1c_1", name: "Well-Defined Learning Outcomes", desc: "Focus area + subtopics clearly listed", lookFor: "" },
      { id: "1c_2", name: "Alignment of Tasks", desc: "Activities aligned to focus area\nGrade appropriate", lookFor: "" },
    ],
  },
  {
    code: "1d", title: "Using Resources Effectively",
    params: [
      { id: "1d_1", name: "Purposeful Use of Resources", desc: "", lookFor: "PE: cones, hurdles, ropes, mats\nPA: instruments, AV tools\nVA: art materials" },
    ],
  },
  {
    code: "1e", title: "Planning Coherent Instruction",
    params: [
      { id: "1e_1", name: "Clear Lesson Flow", desc: "Warm-up, cool-down, closure", lookFor: "" },
    ],
  },
];

const TOOLS = [
  "Affirmations", "All Eyes on Me", "Brain Break", "Brainstorming", "Choral Call",
  "Circulate", "Cold Call", "Concept Map", "Do Now", "Entry Ticket", "Exit Ticket",
  "Think-Pair-Share", "Turn & Talk", "Wait Time", "Other"
];

const ROUTINES = [
  "Arrival Routine", "Attendance Routine", "Class Cleaning", "Material Passing",
  "Departure Routine", "Grouping Routine", "Lining Up", "Other"
];

// ── Rating Component ───────────────────────────────────────────────────────────
const RatingRow: React.FC<{
  param: { id: string; name: string; desc: string; lookFor: string };
  value: ParamState;
  onChange: (id: string, val: ParamState) => void;
}> = ({ param, value, onChange }) => (
  <div className="py-5 border-b last:border-0">
    <div className="flex items-start gap-2 mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1F2839]">{param.name}</span>
          {param.lookFor && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><Info className="w-4 h-4 text-slate-400" /></TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs whitespace-pre-wrap">{param.lookFor}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {param.desc && <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-wrap">{param.desc}</p>}
      </div>
    </div>
    <RadioGroup
      value={value.rating}
      onValueChange={(v) => onChange(param.id, { ...value, rating: v as Rating })}
      className="flex flex-wrap gap-4"
    >
      {[
        { v: "yes", label: "Yes", cls: "text-emerald-600 border-emerald-300" },
        { v: "partial", label: "Partially Seen", cls: "text-amber-600 border-amber-300" },
        { v: "not_seen", label: "Not Seen", cls: "text-rose-600 border-rose-300" },
        { v: "na", label: "Not Applicable", cls: "text-slate-500 border-slate-300" },
      ].map(({ v, label, cls }) => (
        <label key={v} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer font-semibold text-sm transition-all ${value.rating === v ? cls + " bg-opacity-10 bg-current" : "border-slate-200 text-slate-500"}`}>
          <RadioGroupItem value={v} id={`${param.id}_${v}`} />
          {label}
        </label>
      ))}
    </RadioGroup>
    {value.rating === "partial" && (
      <Input
        className="mt-3 rounded-xl bg-amber-50 border-amber-200"
        placeholder="What needs strengthening (1 line)"
        value={value.comment}
        onChange={(e) => onChange(param.id, { ...value, comment: e.target.value })}
      />
    )}
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────
const Cluster1SpecialistQFForm: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [teacherName, setTeacherName] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [learningArea, setLearningArea] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [runningNotes, setRunningNotes] = useState("");
  const [responses, setResponses] = useState<Responses>(() => {
    const init: Responses = {};
    SUBDOMAINS.forEach(sd => sd.params.forEach(p => { init[p.id] = { rating: "", comment: "" }; }));
    return init;
  });
  const [glows, setGlows] = useState("");
  const [grows, setGrows] = useState("");
  const [actionStep, setActionStep] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [routines, setRoutines] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (teacherId && teacherId !== "select") {
      api.get(`/users/${teacherId}`).then(r => {
        const t = r.data?.data?.user || r.data?.data;
        if (t) setTeacherName(t.fullName || "");
      }).catch(() => {});
    }
  }, [teacherId]);

  const updateResponse = (id: string, val: ParamState) => setResponses(prev => ({ ...prev, [id]: val }));

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  };

  const validate = () => {
    for (const sd of SUBDOMAINS) {
      for (const p of sd.params) {
        if (responses[p.id].rating === "partial" && !responses[p.id].comment.trim()) {
          toast.error(`Comment required for "Partially Seen": ${p.name}`); return false;
        }
      }
    }
    if (!actionStep.trim()) { toast.error("Action Step is required."); return false; }
    return true;
  };

  const buildPayload = (status: "DRAFT" | "SUBMITTED") => ({
    teacherId,
    observerId: user?.id,
    date,
    domain: "Cluster 1 - Planning & Preparation (Specialist)",
    type: "specialist-qf",
    status,
    grade, section, learningArea,
    notes: runningNotes,
    strengths: glows,
    areasOfGrowth: grows,
    actionStep,
    followUpDate,
    tools: JSON.stringify(tools),
    routines: JSON.stringify(routines),
    detailedReflection: JSON.stringify(responses),
  });

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post("/observations", buildPayload("SUBMITTED"));
      toast.success("Cluster 1 Specialist Observation submitted!");
      navigate(-1);
    } catch { toast.error("Submission failed."); } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 -m-4 md:-m-6 lg:-m-8 xl:-m-10 2xl:-m-12">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between">
          <Button className="rounded-full bg-[#EA104A] text-white hover:bg-[#d00e42] hover:text-white gap-2 px-6 font-black text-[10px] uppercase tracking-widest" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
          <div className="relative h-[200px] md:h-[240px] overflow-hidden rounded-[2.5rem] shadow-2xl mb-8 bg-[#EA104A]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px] mix-blend-overlay" />
            <div className="absolute right-0 bottom-[-40px] opacity-[0.08] pointer-events-none select-none z-0">
              <span className="text-[160px] md:text-[260px] font-black tracking-tighter leading-none text-white">EKYA</span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center pl-10 md:pl-16">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Observation Module</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-[0.9] uppercase drop-shadow-2xl">Cluster 1 – Planning &amp; Preparation (Specialist)</h1>
              <p className="text-white/80 font-medium text-sm mt-2">Specialist Quick Feedback</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Details */}
            <Card className="border-none shadow-lg rounded-2xl">
              <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-600" /> Session Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Name of Observer</Label>
                  <Input value={user?.fullName || ""} readOnly className="bg-slate-50 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>Name of Educator</Label>
                  <Input value={teacherName} onChange={e => setTeacherName(e.target.value)} className="rounded-xl" placeholder="Educator name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>Grade</Label>
                  <Input value={grade} onChange={e => setGrade(e.target.value)} className="rounded-xl" placeholder="e.g. Grade 5" />
                </div>
                <div className="space-y-1.5">
                  <Label>Section</Label>
                  <Input value={section} onChange={e => setSection(e.target.value)} className="rounded-xl" placeholder="e.g. A" />
                </div>
                <div className="space-y-1.5">
                  <Label>Learning Area</Label>
                  <Input value={learningArea} onChange={e => setLearningArea(e.target.value)} className="rounded-xl" placeholder="e.g. Mathematics" />
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <Label>Observation Running Notes</Label>
                  <Textarea rows={3} value={runningNotes} onChange={e => setRunningNotes(e.target.value)} className="rounded-xl resize-none" placeholder="Live notes during observation..." />
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <Label>File Upload</Label>
                  <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-emerald-400 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-500 text-sm font-medium">Click to upload supporting files</span>
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Rubric Subdomains */}
            {SUBDOMAINS.map(sd => (
              <Card key={sd.code} className="border-none shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-[#1F2839] text-white py-4 px-6">
                  <CardTitle className="font-black text-lg text-white">
                    <span className="text-emerald-400 mr-2">{sd.code.toUpperCase()}</span>{sd.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 divide-y divide-slate-100">
                  {sd.params.map(p => (
                    <RatingRow key={p.id} param={p} value={responses[p.id]} onChange={updateResponse} />
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Glows & Grows */}
            <Card className="border-none shadow-lg rounded-2xl">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg font-bold">Glows & Grows</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-emerald-700 font-bold">What Worked Well</Label>
                  <Textarea rows={4} value={glows} onChange={e => setGlows(e.target.value)} className="rounded-xl resize-none border-emerald-200 focus:ring-emerald-400" placeholder="Strengths observed..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-amber-700 font-bold">What Needs Strengthening</Label>
                  <Textarea rows={4} value={grows} onChange={e => setGrows(e.target.value)} className="rounded-xl resize-none border-amber-200 focus:ring-amber-400" placeholder="Areas for improvement..." />
                </div>
              </CardContent>
            </Card>

            {/* Action Step */}
            <Card className="border-none shadow-lg rounded-2xl">
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="text-lg font-bold">Action Step <span className="text-rose-500 text-sm font-medium ml-1">(Required)</span></CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-slate-500 text-sm italic">"There is scope for the teacher to work on ______ by ______"</p>
                <Textarea rows={3} value={actionStep} onChange={e => setActionStep(e.target.value)} className="rounded-xl resize-none" placeholder="There is scope for the teacher to work on..." />
                <div className="space-y-1.5">
                  <Label>Follow-up Date</Label>
                  <Input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="rounded-xl max-w-xs" />
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
              <Button
                className="w-full sm:w-64 h-12 rounded-xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                onClick={handleSubmit}
                disabled={submitting}
              >
                <Send className="w-4 h-4" /> Submit Observation
              </Button>
            </div>
          </div>

          {/* RIGHT: Side Panel */}
          <div className="space-y-6">
            {/* Tools Observed */}
            <Card className="border-none shadow-lg rounded-2xl">
              <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl">
                <CardTitle className="text-base font-bold">Tools Observed</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {TOOLS.map(tool => (
                  <label key={tool} className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={tools.includes(tool)}
                      onCheckedChange={() => toggleItem(tools, setTools, tool)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{tool}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Routines */}
            <Card className="border-none shadow-lg rounded-2xl">
              <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl">
                <CardTitle className="text-base font-bold">Routines</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {ROUTINES.map(r => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={routines.includes(r)}
                      onCheckedChange={() => toggleItem(routines, setRoutines, r)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{r}</span>
                  </label>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default Cluster1SpecialistQFForm;
