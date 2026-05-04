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
  Compass
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const HASSAssessmentPracticesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    mainTitle: "HASS Assessment",
    italicTitle: "Practices",
    heroDesc: "Understanding, applying and documenting assessment for the HASS (Social Science) Learning Area.",
    introText: "This handout supports HASS (Social Science) teachers at Ekya Schools in understanding, applying and documenting assessment practices for the HASS (Social Science) Learning Area. It should be read alongside the HASS Curriculum Overview handout (Category 01) and the AY 2025-26 Assessment Pattern document.",
    philosophy: "At Ekya Schools, HOW students learn is as important as WHAT they learn. The primary purpose of assessment is to provide students with varied learning experiences using various approaches: so that a holistic understanding of where a child is and where they are headed is gained. For HASS, this means every assessment focuses on the application of learning in purposeful, meaningful contexts.",
    assessmentTypes: [
      { type: "Ungraded Assignments", icon: "📝", desc: "Inquiry reflections, source analysis practice, map exercises, concept maps and discussion responses. Build critical thinking habits: inform instruction but do not contribute to official scores." },
      { type: "Graded Assessments", icon: "📊", desc: "IAs, GAs, ATs, Reviews and TEEs: each mapped to HASS standards and to the crosscutting concepts and inquiry skills being assessed." },
      { type: "Authentic Tasks & Portfolio", icon: "🎯", desc: "Community investigations, historical exhibitions, geography fieldwork reports, civics debates and economic case studies. Students demonstrate inquiry skills in real-world HASS contexts." }
    ],
    pattern: [
      { grade: "EY", ia: "Observation-based tasks", at: "Performance tasks", review: "N/A", tee: "N/A", senior: "No formal graded assessments" },
      { grade: "1-3", ia: "4", at: "1", review: "N/A", tee: "N/A", senior: "-" },
      { grade: "4", ia: "4", at: "1", review: "1", tee: "N/A", senior: "-" },
      { grade: "5-7", ia: "4", at: "1", review: "1", tee: "1", senior: "-" },
      { grade: "8 (ICSE)", ia: "3 IA + 1 GA", at: "1", review: "2", tee: "2 TEEs", senior: "-" },
      { grade: "9-10", ia: "Varies by board", at: "1 per term", review: "2", tee: "2 + PB", senior: "CBSE / ICSE / IGCSE" },
      { grade: "11-12", ia: "Varies by board", at: "1 (Term 1)", review: "2", tee: "2 + PB", senior: "CBSE / Cambridge" }
    ],
    forms: [
      { type: "Written Assessment (IA)", examples: "Short answer · Structured essay · Source analysis · Map interpretation · Timeline · Constructed response · Case study · Paragraph response" },
      { type: "Authentic Task (AT)", examples: "Historical investigation report · Geography fieldwork report · Civics debate · Economic case study · Community audit · Exhibition · Research project · Persuasive essay on a social issue" },
      { type: "Group Assessment (GA)", examples: "Collaborative inquiry project · Group debate · Shared research presentation · Community mapping exercise · Role play (e.g. parliament simulation)" },
      { type: "Discussion & Presentation", examples: "Oral presentation · Debate · Interview · Panel discussion · Role play · Group Discussion · Speech on a civic issue" },
      { type: "Creative & Analytical Forms", examples: "Diary Entry (historical perspective) · Narrative (first-person historical account) · Persuasive Writing · Journalistic Writing · Illustrations (maps, diagrams) · Notebooking" },
      { type: "Reflection & Notebooking", examples: "HASS inquiry journal · We knew/discovered/wonder reflection · Source reliability assessment · Self-assessment against inquiry skills rubric" }
    ],
    feedback: [
      { principle: "Inquiry-Focused", example: "Frame feedback around the five inquiry skills: 'Your questioning is strong: now focus on evaluating the reliability of the sources you are using to research the answer.'" },
      { principle: "Evidence-Based", example: "In historical and geographical writing, address the quality of evidence: 'You have made a strong claim. Now cite a specific source that supports it and explain why it is reliable.'" },
      { principle: "Perspective & Analysis", example: "Push beyond description: 'You have described what happened: now explain why it happened and whose perspective this account represents.' HASS feedback must move students from recounting to analysing." },
      { principle: "Specific & Criteria-Linked", example: "Link feedback to the rubric criteria explicitly: 'On Criterion 2 (source analysis), your source identification is correct: now add an evaluation of the source's purpose and bias.'" },
      { principle: "Growth-Oriented", example: "Frame feedback as a next inquiry step: 'You have identified one cause. Can you research two more causes that historians consider equally significant?'" }
    ],
    documentation: [
      { tool: "Schoology Gradebook", purpose: "Record and report all graded scores; track progress.", use: "Enter scores for each IA, GA, AT, Review and TEE linked to the correct HASS standard code (ACARA or Cambridge). Use the HASS assessment category labels set by C&I." },
      { tool: "Mark Register", purpose: "Standardised record of all student scores per class.", use: "Complete after every IA, GA and AT. HASS assessments often involve multiple sub-criteria: record component and total scores where applicable." },
      { tool: "Evidence of Learning", purpose: "Marked essays, source analyses, inquiry reports: kept as assessment records.", use: "Retain at least one graded IA per student per term. Annotated student essays showing teacher feedback are particularly valuable evidence in HASS." },
      { tool: "Rubric Library", purpose: "Standardised rubrics for all HASS assessment forms.", use: "Use the HASS Essay Rubric, Authentic Task Rubric and Oral Presentation Rubric from the C&I Platform. All extended writing and ATs must be rubric-marked." }
    ],
    dos: [
      { text: "Map every IA and AT to the specific HASS standard and the inquiry skill it is assessing before administering it." },
      { text: "Use the five inquiry skill categories as the organising framework for feedback: tell students which skill they are developing." },
      { text: "Push students beyond description to analysis in all written assessments: use crosscutting concepts as feedback prompts." },
      { text: "Use the approved HASS rubrics from the C&I Platform for all extended writing tasks, ATs and GAs." },
      { text: "Vary assessment forms: include debates, source analyses, maps, presentations and community investigations, not only essays." },
      { text: "Retain annotated student essays and inquiry reports as evidence of learning." },
      { text: "Return marked work with specific, criteria-linked feedback before the next related assessment." }
    ],
    donts: [
      { text: "Do not accept description as analysis: all HASS assessments should require students to go beyond recounting events to explaining significance, cause, effect or perspective." },
      { text: "Do not use the same written essay format for every IA: vary forms to assess the full range of HASS inquiry skills." },
      { text: "Do not mark extended writing without a rubric: all HASS essays, reports and ATs must be assessed against criteria from the C&I Rubric Library." },
      { text: "Do not give feedback only on content knowledge: always include feedback on evidence quality, clarity of argument and inquiry skill." },
      { text: "Do not skip Group Assessments: collaborative inquiry is a core HASS skill and must be formally assessed." },
      { text: "Do not enter marks in Schoology without linking them to the correct HASS standard code." }
    ],
    glossary: [
      { term: "Internal Assessment (IA)", mean: "A graded HASS assessment: test, source analysis, essay or constructed response: administered within the school and contributing to the official score." },
      { term: "Authentic Task (AT)", mean: "A real-world HASS task requiring inquiry skill transfer: historical investigation, geography fieldwork report, civics debate or economic case study. Graded using a rubric." },
      { term: "Source Analysis", mean: "The skill of examining a primary or secondary source to determine its origin, purpose, content, value and limitations. A core HASS assessment form from Grade 3 onwards." },
      { term: "Crosscutting Concepts", mean: "The six analytical lenses of the HASS curriculum (Identity & Culture, Significance & Perspectives, Place & Environment, Change & Continuity, Cause & Effect, Patterns & Structure) are used as the framework for assessment feedback." },
      { term: "Inquiry Skills", mean: "The five HASS process skills (Questioning, Researching, Analysing, Evaluating & Reflecting, Communicating) are assessed in every unit and referenced explicitly in feedback." },
      { term: "Describe-Explain-Evaluate", mean: "A three-level feedback progression is used in HASS. Feedback should name which level the student is at and what to do next." },
      { term: "Rubric", mean: "A criteria-referenced scoring guide for all HASS extended writing, ATs and GAs. Available in the C&I Platform Rubric Library." }
    ],
    quickTips: [
      { text: "Before every extended writing task, co-construct the success criteria with students using the rubric." },
      { text: "Use the 'describe-explain-evaluate' progression as a daily feedback prompt: 'You described what happened (good). Now explain why (next step). Then evaluate whether it was significant (deeper step).'" },
      { text: "For Authentic Tasks, anchor them in real local and Indian contexts before zooming to global ones." },
      { text: "Teach source analysis as an explicit skill before assessing it. Use a structured tool consistently so that feedback can reference it specifically." },
      { text: "Schedule at least one debate or oral assessment per term in HASS. Oral communication of historical, geographical or civic arguments is a core disciplinary skill." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_hass_assessment");
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
        settingKey="page_learning_hass_assessment"
        initialData={data}
        onSave={setData}
        title="HASS Assessment Practices"
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
              { key: "use", label: "HASS-Specific Use", type: "textarea" }
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
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">What It Looks Like in HASS</th>
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
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">HASS-SPECIFIC USE</span>
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

export default HASSAssessmentPracticesPage;
