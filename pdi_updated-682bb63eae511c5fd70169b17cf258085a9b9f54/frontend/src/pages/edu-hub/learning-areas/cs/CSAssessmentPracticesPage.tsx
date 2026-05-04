import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CaretLeft, 
  FileText, 
  ListChecks, 
  Info, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Lightbulb,
  Sparkle,
  PencilSimple,
  ChartBar,
  Exam,
  ArrowRight,
  ClipboardText,
  MagnifyingGlassPlus
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const CSAssessmentPracticesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "CS Assessment",
    italicTitle: "Practices",
    heroDesc: "Understanding, applying and documenting assessment for the Computer Science Learning Area.",
    introText: "This handout supports Computer Science teachers at Ekya Schools in understanding, applying and documenting assessment practices for the Computer Science Learning Area. It should be read alongside the Computer Science Curriculum Overview handout (Category 01) and the AY 2025–26 Assessment Pattern document.",
    philosophy: "At Ekya Schools, HOW students learn is as important as WHAT they learn. The primary purpose of assessment is to provide students with varied learning experiences using various approaches: so that a holistic understanding of where a child is and where they are headed is gained.",
    assessmentTypes: [
      { type: "Ungraded Assignments", icon: "📝", desc: "Coding practice tasks, algorithm tracing exercises, debugging worksheets and design thinking journals. Build computational fluency: inform instruction but do not contribute to official scores." },
      { type: "Graded Assessments", icon: "📊", desc: "IAs, GAs, ATs, Reviews and TEEs: each mapped to CSTA or Cambridge CS standards and assessing both computational thinking and practical programming skills." },
      { type: "Authentic Tasks & Portfolio", icon: "🎯", desc: "Functional software projects, Arduino physical computing builds, design thinking challenges and computing impacts presentations. Students demonstrate real computational artefact creation." }
    ],
    pattern: [
      { grade: "EY", ia: "Observation-based CT activities", at: "Play-based coding", review: "", tee: "", senior: "No formal graded assessments" },
      { grade: "1–3", ia: "4", at: "1", review: "", tee: "", senior: "" },
      { grade: "4", ia: "4", at: "1", review: "1", tee: "", senior: "" },
      { grade: "5–7", ia: "4", at: "1", review: "1", tee: "1", senior: "" },
      { grade: "8 (ICSE)", ia: "3 IA + 1 GA", at: "1", review: "2", tee: "2 TEEs", senior: "" },
      { grade: "9–10", ia: "Varies by board", at: "1", review: "2", tee: "2 + PB", senior: "CBSE / ICSE / IGCSE" },
      { grade: "11–12", ia: "Varies by board", at: "1", review: "2", tee: "2 + PB", senior: "CBSE / Cambridge" }
    ],
    forms: [
      { type: "Written Assessment (IA)", examples: "Algorithm trace · Flowchart design · Short answer (theory) · Data representation · Network diagram · Case study · Multiple choice · Pseudocode writing" },
      { type: "Practical / Coding (IA)", examples: "Block-based program (Gr 1–3) · Scratch project (Gr 4–6) · Python program · HTML/CSS webpage · Database query · Arduino sketch · OOP class design" },
      { type: "Authentic Task (AT)", examples: "Functional software application · Design thinking challenge (end-to-end) · Physical computing project (Arduino) · Data analysis project · Computing impacts case study" },
      { type: "Group Assessment (GA)", examples: "Collaborative coding project · Software development team task · Group design thinking challenge · Peer code review session · Technical presentation of a group build" },
      { type: "Reflection & Notebooking", examples: "Debugging log · Design thinking journal · Code annotation task · What I built/learned/would change reflection · Algorithm design sketchbook" }
    ],
    feedback: [
      { principle: "Computational Thinking First", example: "Feedback addresses the thinking behind the code: 'Your algorithm is logically correct: now think about whether you can simplify it using a function. What would change?'" },
      { principle: "Debugging as Learning", example: "Frame bugs as feedback: 'Your program has a logic error in the loop. Trace through the loop manually: what is the counter value at each iteration?' Debugging feedback builds independence." },
      { principle: "Design Thinking Aligned", example: "For AT and project feedback, use the Design Thinking stages: 'You have prototyped a solution: now test it with a real user and revise based on what you learn.'" },
      { principle: "Practical & Theory Balance", example: "Give separate feedback on theory (algorithm design, data structures, networks) and on practical code quality (logic, syntax, efficiency, documentation). Both are assessed in CS." },
      { principle: "Actionable", example: "Every feedback comment on code should prompt a specific revision: 'Add a comment to each function explaining what it does.' Vague feedback has no effect in CS." }
    ],
    documentation: [
      { tool: "Schoology Gradebook", purpose: "Record and report all graded scores; track progress.", use: "Enter scores for each IA, GA, AT, Review and TEE linked to the correct CSTA or Cambridge CS standard. Upload practical project files as evidence." },
      { tool: "Mark Register", purpose: "Standardised record of all student scores per class.", use: "Complete after every IA, GA and AT. For practical coding IAs, record functionality marks and code quality/documentation marks separately if the rubric requires." },
      { tool: "Evidence of Learning", purpose: "Marked scripts, code files, project builds: kept as assessment records.", use: "Retain screenshots or exported code files for all practical IAs and ATs. For physical computing projects, photograph the build. Code and physical artefacts are CS evidence of learning." },
      { tool: "Rubric Library", purpose: "Standardised rubrics for all CS assessment forms.", use: "Use the CS Practical Project Rubric and Authentic Task Rubric from the C&I Platform. All coding projects and design thinking challenges must be rubric-marked." }
    ],
    dos: [
      { text: "Map every IA and AT to the specific CSTA or Cambridge CS standard before administering it." },
      { text: "Give separate feedback on computational thinking (algorithm logic, abstraction, decomposition) and on practical coding (syntax, efficiency, documentation, testing)." },
      { text: "Use the Design Thinking framework explicitly in AT feedback: reference the stage the student is at and name what the next step requires." },
      { text: "Use the approved CS rubrics from the C&I Platform for all coding projects, ATs and GAs." },
      { text: "Retain screenshots, exported code files or photographs of physical builds as evidence of learning." },
      { text: "Vary assessment forms: include both written theory tasks and practical coding or design tasks in every term." }
    ],
    donts: [
      { text: "Do not assess only whether code 'works'; assess the quality of the algorithm, the logic of the design and the clarity of the documentation, not just the output." },
      { text: "Do not skip the Impacts of Computing component in assessments; ethics and societal impact must be assessed at least once per year." },
      { text: "Do not mark practical coding projects without a rubric; all CS practical assessments must use criteria from the C&I Rubric Library." },
      { text: "Do not allow students to submit code without comments or documentation; code annotation is an assessable component." },
      { text: "Do not use the same IA format (written theory test) every term; vary to include practical, design thinking and collaborative coding assessments." }
    ],
    glossary: [
      { term: "Internal Assessment (IA)", mean: "A graded CS assessment; theory test, algorithm task, practical coding task or debugging exercise; contributing to the official score." },
      { term: "Authentic Task (AT)", mean: "A real-world CS task requiring computational thinking and programming; software project, design thinking challenge, physical computing build or computing impacts case study." },
      { term: "Computational Thinking", mean: "The problem-solving approach; decomposition, pattern recognition, abstraction and algorithm design; assessed as both a thinking process and a performance skill in CS." },
      { term: "Debugging", mean: "The process of finding and fixing errors in a program. Assessed as a core CS skill." },
      { term: "Design Thinking", mean: "The human-centred process (Empathise, Define, Ideate, Prototype, Test) integrated into CS Authentic Tasks." }
    ],
    quickTips: [
      { text: "Before every practical coding IA, share the rubric and ask: 'What does a 4 out of 4 look like for code documentation?'" },
      { text: "Build a debugging session into every unit: before the IA, project a deliberately 'buggy' program and ask students to fix it." },
      { text: "For Authentic Tasks, insist on the full Design Thinking cycle: especially the Test stage." },
      { text: "Use peer code review as a regular low-stakes activity: students read and comment on a partner's code." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_cs_assessment");
        if (result && result.value) {
          setData(prev => sanitizeContent({ ...prev, ...result.value }));
        }
      } catch (error) {
        console.error("Failed to fetch content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const role = user?.role?.toUpperCase() || "";
    return ["ADMIN", "SUPERADMIN", "TESTER"].includes(role);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 rounded-b-[2.5rem] smooth-scroll overflow-x-hidden">
      <PageEditorControls 
        settingKey="page_learning_cs_assessment"
        initialData={data}
        onSave={setData}
        title="CS Assessment Practices"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroImage", label: "Hero Background Image", type: "image" },
          { key: "mainTitle", label: "Main Title", type: "input" },
          { key: "italicTitle", label: "Italic Title", type: "input" },
          { key: "heroDesc", label: "Hero Description", type: "textarea" },
          { key: "section_intro", label: "Introduction", type: "section" },
          { key: "introText", label: "Intro Paragraph", type: "textarea" },
          { key: "philosophy", label: "Assessment Philosophy", type: "textarea" },
          { 
            key: "assessmentTypes", 
            label: "Assessment Types", 
            type: "list",
            itemFields: [
              { key: "type", label: "Type Title", type: "input" },
              { key: "icon", label: "Emoji Icon", type: "input" },
              { key: "desc", label: "Description", type: "textarea" }
            ]
          },
          { key: "section_pattern", label: "Assessment Pattern", type: "section" },
          { 
            key: "pattern", 
            label: "Grade Pattern Table", 
            type: "list",
            itemFields: [
              { key: "grade", label: "Grade", type: "input" },
              { key: "ia", label: "IA", type: "input" },
              { key: "at", label: "AT", type: "input" },
              { key: "review", label: "Review", type: "input" },
              { key: "tee", label: "TEE", type: "input" },
              { key: "senior", label: "Senior Info", type: "input" }
            ]
          },
          { 
            key: "forms", 
            label: "Assessment Forms", 
            type: "list",
            itemFields: [
              { key: "type", label: "Form Type", type: "input" },
              { key: "examples", label: "Examples", type: "textarea" }
            ]
          },
          { key: "section_feedback", label: "Feedback & Documentation", type: "section" },
          { 
            key: "feedback", 
            label: "Feedback Principles", 
            type: "list",
            itemFields: [
              { key: "principle", label: "Principle", type: "input" },
              { key: "example", label: "Example/What it looks like", type: "textarea" }
            ]
          },
          { 
            key: "documentation", 
            label: "Documentation Tools", 
            type: "list",
            itemFields: [
              { key: "tool", label: "Tool Name", type: "input" },
              { key: "purpose", label: "Purpose", type: "textarea" },
              { key: "use", label: "CS-Specific Use", type: "textarea" }
            ]
          },
          { key: "section_rules", label: "Dos & Don'ts", type: "section" },
          { 
            key: "dos", 
            label: "Do's List", 
            type: "list",
            itemFields: [{ key: "text", label: "Do Text", type: "textarea" }]
          },
          { 
            key: "donts", 
            label: "Don'ts List", 
            type: "list",
            itemFields: [{ key: "text", label: "Don't Text", type: "textarea" }]
          },
          { 
            key: "glossary", 
            label: "Glossary Terms", 
            type: "list",
            itemFields: [
              { key: "term", label: "Term", type: "input" },
              { key: "mean", label: "Definition", type: "textarea" }
            ]
          },
          { 
            key: "quickTips", 
            label: "Quick Tips", 
            type: "list",
            itemFields: [{ key: "text", label: "Tip Text", type: "textarea" }]
          }
        ]}
      />

      {/* Premium Hero Banner */}
      
      <PortalBanner 
        title={data.mainTitle + " " + data.italicTitle}
        subtitle={data.heroDesc || (data.introText ? data.introText.substring(0, 100) + "..." : "")}
        icon={Sparkle}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        className="mt-6 mb-16"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">
        
        {/* Introduction */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Info className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Category 02</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">INTRODUCTION</h3>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-primary/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
             <p className="text-xl text-slate-600 font-medium leading-relaxed">
              {data.introText}
             </p>
          </div>
        </section>

        {/* Assessment Philosophy */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Lightbulb className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Philosophy</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">ASSESSMENT PHILOSOPHY</h3>
            </div>
          </div>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Lightbulb size={200} weight="fill" />
             </div>
             <div className="relative z-10 max-w-4xl">
               <p className="text-xl text-slate-300 font-medium leading-relaxed">
                 {data.philosophy}
               </p>
             </div>
          </div>
        </section>

        {/* Types of Assessment */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ChartBar className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Framework</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">TYPES OF ASSESSMENT</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.assessmentTypes.map((type, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  {type.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-4">{type.type}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Assessment Pattern Table */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Exam className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">AY 2025–26</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">ASSESSMENT PATTERN</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Grade</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">IA</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">AT</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Review</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">TEE</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Senior School</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.pattern.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.grade}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.ia}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.at}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.review}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.tee}</td>
                      <td className="px-8 py-6 text-sm font-black text-primary uppercase tracking-tighter">{row.senior}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Assessment Forms */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ListChecks className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Methodology</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">ASSESSMENT FORMS</h3>
            </div>
          </div>
          
          <div className="grid gap-6">
            {data.forms.map((form, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-6 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="md:w-1/3">
                  <h4 className="text-lg font-bold text-primary group-hover:translate-x-1 transition-transform">{form.type}</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                    {form.examples}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feedback & Correction */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkle className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Growth Mindset</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">FEEDBACK & CORRECTION</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Feedback Principle</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">What it looks like in CS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.feedback.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.principle}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-500 leading-relaxed italic">
                        {row.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Recording, Reporting & Documentation */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <MagnifyingGlassPlus className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Records</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">RECORDING & REPORTING</h3>
            </div>
          </div>

          <div className="grid gap-6">
            {data.documentation.map((row, idx) => (
              <div key={idx} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-primary/20 transition-all flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">TOOL</span>
                    <h4 className="text-xl font-black text-slate-800">{row.tool}</h4>
                 </div>
                 <div className="md:w-1/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">PURPOSE</span>
                    <p className="text-sm font-bold text-slate-600">{row.purpose}</p>
                 </div>
                 <div className="md:w-2/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">CS-SPECIFIC USE</span>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{row.use}</p>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Guidelines</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">DO'S AND DON'TS</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-xs">
                 <CheckCircle weight="fill" size={16} /> The Do's
              </h4>
              <div className="space-y-3">
                {data.dos.map((item, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex gap-3">
                    <span className="text-emerald-500 font-black">✓</span>
                    <p className="text-sm font-medium text-slate-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="flex items-center gap-2 text-rose-600 font-black uppercase tracking-widest text-xs">
                 <XCircle weight="fill" size={16} /> The Don'ts
              </h4>
              <div className="space-y-3">
                {data.donts.map((item, idx) => (
                  <div key={idx} className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex gap-3">
                    <span className="text-rose-500 font-black">✗</span>
                    <p className="text-sm font-medium text-slate-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Glossary */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Terminology</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">GLOSSARY</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.glossary.map((item, idx) => (
              <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2">
                <span className="font-bold text-slate-800">{item.term}</span>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.mean}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="animate-in fade-in zoom-in duration-700">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2.5rem] p-10 md:p-16 border border-amber-200/50 flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center flex-none">
              <Lightbulb className="w-10 h-10 text-amber-500" weight="fill" />
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-black text-amber-600 uppercase tracking-widest flex items-center gap-3">
                 QUICK TIPS
              </h4>
              <div className="space-y-3">
                {data.quickTips.map((tip, idx) => (
                  <p key={idx} className="text-lg font-medium text-slate-700 leading-relaxed italic">
                    {tip.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CSAssessmentPracticesPage;

