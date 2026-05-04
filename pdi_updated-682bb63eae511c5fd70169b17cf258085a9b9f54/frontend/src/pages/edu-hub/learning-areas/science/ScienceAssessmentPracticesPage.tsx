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
  Flask,
  Notebook,
  Microscope,
  Eyeglasses
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";

const ScienceAssessmentPracticesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "Science Assessment",
    italicTitle: "Practices",
    heroDesc: "Understanding, applying and documenting assessment for the Science Learning Area based on NGSS.",
    introText: "This handout supports Science teachers at Ekya Schools in understanding, applying and documenting assessment practices for the Science Learning Area. It should be read alongside the Science Curriculum Overview handout (Category 01) and the AY 2025–26 Assessment Pattern document.",
    philosophy: "At Ekya Schools, HOW students learn is as important as WHAT they learn. For Science, this means every assessment focuses on the application of learning in purposeful, meaningful contexts. Assessment evidence connects to what students know, understand and can do in this learning area, mapped to NGSS standards.",
    assessmentTypes: [
      { type: "Ungraded Assignments", icon: "📝", desc: "Lab observation notes, reflection journals, revision exercises and scientific sketching. Inform instruction but do not contribute to official scores." },
      { type: "Graded Assessments", icon: "📊", desc: "IAs, GAs, ATs, Reviews and TEEs: each mapped to NGSS Performance Expectations and recorded in Schoology Gradebook." },
      { type: "Authentic Tasks & Portfolio", icon: "🎯", desc: "Engineering design challenges, science exhibitions, research reports and field investigations. Students demonstrate transfer to real-world contexts." }
    ],
    pattern: [
      { grade: "EY", ia: "Observation-based", at: "Performance tasks", review: "-", tee: "-" },
      { grade: "1-3", ia: "4", at: "1", review: "-", tee: "-" },
      { grade: "4", ia: "4", at: "1", review: "1", tee: "-" },
      { grade: "5–7", ia: "4", at: "1", review: "1", tee: "1" },
      { grade: "8 (ICSE)", ia: "3 IA + 1 GA", at: "1", review: "2", tee: "2 TEEs" },
      { grade: "9–10", ia: "Varies by board", at: "1 per term", review: "2", tee: "2 + PB" },
      { grade: "11–12", ia: "Varies by board", at: "1 (Term 1)", review: "2", tee: "2 + PB" }
    ],
    forms: [
      { type: "Investigation / Lab Work", examples: "Structured scientific investigation · Lab report · Observation journal · Data collection and analysis · Controlled experiment design · Scientific sketching" },
      { type: "Written Assessment (IA)", examples: "Short answer · Constructed response · Diagram labelling · Data interpretation · Multiple choice (Middle/Senior) · Case study · CER (Claim–Evidence–Reasoning) response" },
      { type: "Authentic Task (AT)", examples: "Engineering design challenge · Science exhibition · Research report · Environmental audit · Scientific poster · Multimedia science presentation · Field investigation" },
      { type: "Group Assessment (GA)", examples: "Collaborative experiment · Group inquiry project · Peer-reviewed report · Panel discussion on a scientific issue · Shared data analysis" },
      { type: "Skill Demonstration", examples: "Lab technique observation · Scientific sketching · Safe equipment use · Data recording accuracy" },
      { type: "Reflection & Notebooking", examples: "Science journal entry · KWL chart · Exit ticket · Three-dimensional thinking journal · Self-assessment against success criteria" }
    ],
    feedback: [
      { principle: "Criteria-Referenced", example: "Feedback links explicitly to rubric and NGSS PE: 'Your data table is accurate: now write a conclusion that links evidence to claim.'" },
      { principle: "Claim–Evidence–Reasoning", example: "Use CER in feedback: 'You have a clear claim and strong evidence: now write the reasoning that connects them.'" },
      { principle: "Process & Product", example: "Give feedback on both process (experimental design, safety) and product (write-up quality, conclusion accuracy)." },
      { principle: "Timely & Actionable", example: "Return reports before the next similar task. Each piece of feedback should prompt a specific revision action." },
      { principle: "Growth-Oriented", example: "Frame as a scientific next step: 'What variable could you control more carefully in your next experiment?'" }
    ],
    documentation: [
      { tool: "Schoology Gradebook", purpose: "Record and report all graded scores; track progress.", use: "Enter scores for IA, GA, AT, Review and TEE linked to correct NGSS standard code. Use Science category labels." },
      { tool: "Mark Register", purpose: "Standardised record of all student scores per class.", use: "Complete after every IA, GA and AT. Submit within specified deadlines." },
      { tool: "Evidence of Learning", purpose: "Marked scripts, reports, annotated diagrams kept as records.", use: "Retain at least one graded script per student per term. Lab reports are primary evidence of learning." },
      { tool: "Rubric Library", purpose: "Standardised rubrics for all Science assessment forms.", use: "Use Science Investigation Rubric and Authentic Task Rubric from C&I Platform. Do not create ad hoc rubrics." }
    ],
    dos: [
      { text: "Map every IA and AT to the specific NGSS Performance Expectation before administering it." },
      { text: "Use the CER (Claim–Evidence–Reasoning) framework consistently for written scientific explanations." },
      { text: "Provide feedback on both process (design, safety, collection) and product (written report) for all investigations." },
      { text: "Use approved Science rubrics from the C&I Platform for all IAs and ATs." },
      { text: "Enter scores in Schoology within the agreed deadline and link them to the correct standard code." },
      { text: "Retain marked lab reports and investigation scripts as evidence of learning." },
      { text: "Vary assessment forms : include investigations, engineering challenges and presentations." }
    ],
    donts: [
      { text: "Do not assess recall of facts only: Science assessment must require students to apply, analyse and evaluate." },
      { text: "Do not mark all lab work with the same rubric : use the correct rubric for the specific form." },
      { text: "Do not skip the Group Assessment : collaborative inquiry must be formally assessed." },
      { text: "Do not return marked work without written feedback: a score alone does not move learning forward." },
      { text: "Do not allow students to repeat exactly the same investigation format every term." },
      { text: "Do not enter marks in Schoology without linking them to the correct standard and category." }
    ],
    glossary: [
      { term: "Internal Assessment (IA)", mean: "A graded assessment administered within the school : including tests, investigations, worksheets." },
      { term: "Authentic Task (AT)", mean: "A real-world science task requiring students to transfer learning : design challenge, exhibition, field study." },
      { term: "CER Framework", mean: "Claim–Evidence–Reasoning : the structured approach to scientific writing used at Ekya." },
      { term: "Performance Expectation (PE)", mean: "An NGSS standard describing what students should be able to do : integrating practice, concept, and core idea." },
      { term: "Three-Dimensional Learning", mean: "The integration of Science & Engineering Practices, Crosscutting Concepts, and Disciplinary Core Ideas." },
      { term: "Schoology Gradebook", mean: "The digital platform for recording and reporting all graded scores in Science." }
    ],
    quickTips: [
      { text: "Before every investigation, share the rubric with students. Scientists always know success criteria beforehand." },
      { text: "Use CER as a daily language. Prompt: 'What is your claim? What is your evidence? What is the reasoning?'" },
      { text: "Designate a science journal for each student from Grade 1 for consistent observation habits." },
      { text: "Separate process feedback (fair test, data accuracy) from product feedback (well-reasoned conclusion)." },
      { text: "Photograph students' prototypes at each stage to document the iterative engineering design process." },
      { text: "Keep a simple observation checklist for lab skills (pipette use, safety, formatting) to record in the moment." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_science_assessment");
        if (result && result.value) {
          setData(prev => ({ ...prev, ...result.value }));
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
        settingKey="page_learning_science_assessment"
        initialData={data}
        onSave={setData}
        title="Science Assessment Practices"
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
              { key: "use", label: "Science-Specific Use", type: "textarea" }
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
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Scientific Method</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">FEEDBACK PRINCIPLES</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Feedback Principle</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">What It Looks Like in Science</th>
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
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">SCIENCE-SPECIFIC USE</span>
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

export default ScienceAssessmentPracticesPage;

