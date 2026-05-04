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
  MagnifyingGlassPlus,
  Calculator,
  Notebook
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const MathAssessmentPracticesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1509228468518-180dd482100c?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "Math Assessment",
    italicTitle: "Practices",
    heroDesc: "Understanding, applying and documenting assessment for the Mathematics Learning Area.",
    introText: "This handout supports Mathematics teachers at Ekya Schools in understanding, applying and documenting assessment practices for the Mathematics Learning Area. It should be read alongside the Mathematics Curriculum Overview handout (Category 01) and the AY 2025-26 Assessment Pattern document.",
    philosophy: "At Ekya Schools, HOW students learn is as important as WHAT they learn. The primary purpose of assessment is to provide students with varied learning experiences using various approaches: so that a holistic understanding of where a child is and where they are headed is gained.",
    assessmentTypes: [
      { type: "Ungraded Assignments", icon: "📝", desc: "Revision exercises, bar model practice, textbook problems and reflection tasks. Build fluency: inform instruction but do not contribute to official scores." },
      { type: "Graded Assessments", icon: "📊", desc: "IAs, GAs, ATs, Reviews and TEEs: each mapped to Singapore Math or Cambridge standards. Method and working shown are both assessed." },
      { type: "Authentic Tasks & Portfolio", icon: "🎯", desc: "Real-world mathematical modelling tasks, data investigations, and financial literacy challenges. Students demonstrate transfer of understanding." }
    ],
    pattern: [
      { grade: "EY", ia: "Observation-based", at: "Performance tasks", review: "N/A", tee: "N/A" },
      { grade: "1-3", ia: "4", at: "1", review: "N/A", tee: "N/A" },
      { grade: "4", ia: "4", at: "1", review: "1", tee: "N/A" },
      { grade: "5-7", ia: "4", at: "1", review: "1", tee: "1" },
      { grade: "8 (ICSE)", ia: "3 IA + 1 GA", at: "1", review: "2", tee: "2 TEEs" },
      { grade: "9-10", ia: "Varies", at: "1 per term", review: "2", tee: "2 + PB" },
      { grade: "11-12", ia: "Varies", at: "1 (Term 1)", review: "2", tee: "2 + PB" }
    ],
    forms: [
      { type: "Written Assessment (IA)", examples: "Constructed response · Problem solving (multi-step) · Diagram/graph interpretation · Short answer · Show-your-working tasks · Applied word problems · Bar model tasks (Gr 1-6)" },
      { type: "Authentic Task (AT)", examples: "Real-world mathematical investigation · Financial literacy project · Data collection and analysis · Mathematical modelling · Cross-curricular project · Student-presented maths challenge" },
      { type: "Group Assessment (GA)", examples: "Collaborative problem-solving · Group data investigation · Maths trail · Peer teaching activity · Cooperative game-based challenge" },
      { type: "Competency-Based", examples: "MCQs · Assertion/Reason (A/R) questions · Case study · Extended problem · Data interpretation · Proof writing (Senior School)" },
      { type: "Reflection & Notebooking", examples: "Error analysis reflection · What I know/need to practise self-assessment · Worked example journal · SMART tool application log" }
    ],
    feedback: [
      { principle: "Process Over Answer", example: "Credit and comment on the method shown, not just the final answer: 'Your bar model is correct: now check the final calculation step.'" },
      { principle: "Error Analysis", example: "Ask students to classify errors: conceptual (wrong method), procedural (wrong step) or careless. Builds mathematical independence." },
      { principle: "Specific & Targeted", example: "Not 'improve your working' but 'In Question 3, your equation is set up incorrectly. Revisit ratio equations using bar models.'" },
      { principle: "Growth-Oriented", example: "Frame as a next step: 'You can now solve linear equations: let us apply this to systems of equations.'" },
      { principle: "Timely", example: "Return marked work before the next related lesson so students can apply feedback immediately. Mathematical skills are cumulative." }
    ],
    documentation: [
      { tool: "Schoology Gradebook", purpose: "Record and report all graded scores; track progress.", use: "Enter scores for IA, GA, AT, Review and TEE linked to Singapore Math or Cambridge standard code." },
      { tool: "Mark Register", purpose: "Standardised record of all student scores per class.", use: "Complete after every IA, GA and AT. Include marks for method and accuracy separately where required." },
      { tool: "Evidence of Learning", purpose: "Marked scripts and worked examples kept as records.", use: "Retain at least one graded IA script per student per term. Show-your-working scripts are primary evidence." },
      { tool: "Rubric Library", purpose: "Standardised rubrics for all Maths assessment forms.", use: "Use Authentic Task Rubric and Group Assessment Rubric from C&I Platform. Mark IAs using approved mark scheme." }
    ],
    dos: [
      { text: "Map every IA and AT to the specific Singapore Math or Cambridge standard before administering it." },
      { text: "Award marks for correct mathematical method even if the final answer is wrong: always mark for working shown." },
      { text: "Return error-analysed feedback: ask students to categorise their mistakes before resubmitting corrections." },
      { text: "Use the approved Maths rubrics and mark schemes from the C&I Platform for all ATs and GAs." },
      { text: "Enter scores in Schoology within the agreed deadline, linked to the correct standard code." },
      { text: "Vary assessment forms: include authentic tasks, group investigations and data projects." },
      { text: "Retain marked scripts as evidence of learning: mathematical working is assessment evidence." }
    ],
    donts: [
      { text: "Do not award marks for the correct answer alone: all IAs must assess reasoning and method." },
      { text: "Do not use the same IA format (e.g. textbook exercise) for every assessment." },
      { text: "Do not return marked work without feedback: a score alone does not help students identify gaps." },
      { text: "Do not mark Authentic Tasks without a rubric from the C&I Rubric Library." },
      { text: "Do not skip Group Assessments: collaborative problem-solving must be formally assessed." },
      { text: "Do not enter marks in Schoology without linking them to the correct standard and phase." }
    ],
    glossary: [
      { term: "Internal Assessment (IA)", mean: "A graded assessment administered within the school: tests, investigations, problem-solving tasks." },
      { term: "Authentic Task (AT)", mean: "A real-world mathematics task requiring transfer of learning: modelling, investigation, data project." },
      { term: "Mark Scheme", mean: "A detailed marking guide specifying which steps, methods and answers receive marks." },
      { term: "Error Analysis", mean: "A strategy where students categorise their own mistakes (conceptual, procedural or careless)." },
      { term: "Show-Your-Working", mean: "The requirement that students write out all mathematical steps in a solution." },
      { term: "SMART Tool", mean: "A structured problem-solving heuristic used to guide students through challenges systematically." }
    ],
    quickTips: [
      { text: "Share the mark scheme with students after every IA to teach them what a complete solution looks like." },
      { text: "Use error analysis as a classroom activity: project common mistakes and ask the class to identify and correct them." },
      { text: "For Authentic Tasks in Grades 1-6, anchor the task in a real bar-model scenario students can relate to." },
      { text: "Build a simple mark moderation habit: compare your marking of two or three scripts with a colleague." },
      { text: "For Cambridge students, use past papers as IAs: they are the most authentic assessment form." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_math_assessment");
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
        settingKey="page_learning_math_assessment"
        initialData={data}
        onSave={setData}
        title="Math Assessment Practices"
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
              { key: "tee", label: "TEE", type: "input" }
            ]
          },
          { 
            key: "forms", 
            label: "Assessment Forms", 
            type: "list",
            itemFields: [
              { key: "type", label: "Assessment Type", type: "input" },
              { key: "examples", label: "Examples", type: "textarea" }
            ]
          },
          { key: "section_feedback", label: "Feedback & Correction", type: "section" },
          { 
            key: "feedback", 
            label: "Feedback Principles", 
            type: "list",
            itemFields: [
              { key: "principle", label: "Principle", type: "input" },
              { key: "example", label: "What it looks like", type: "textarea" }
            ]
          },
          { 
            key: "documentation", 
            label: "Documentation Tools", 
            type: "list",
            itemFields: [
              { key: "tool", label: "Tool Name", type: "input" },
              { key: "purpose", label: "Purpose", type: "textarea" },
              { key: "use", label: "Math-Specific Use", type: "textarea" }
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
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">AY 2025-26</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">ASSESSMENT PATTERN</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Grade</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">IA (per term)</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">AT (per term)</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Review</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">TEE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.pattern.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.grade}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.ia}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.at}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.review}</td>
                      <td className="px-8 py-6 text-sm font-black text-primary uppercase tracking-tighter">{row.tee}</td>
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
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">FEEDBACK PRINCIPLES</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Feedback Principle</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">What It Looks Like in Mathematics</th>
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
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">MATH-SPECIFIC USE</span>
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

export default MathAssessmentPracticesPage;
