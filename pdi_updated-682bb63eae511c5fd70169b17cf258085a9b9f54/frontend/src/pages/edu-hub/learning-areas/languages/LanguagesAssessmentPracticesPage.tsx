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
  Translate,
  Notebook
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const LanguagesAssessmentPracticesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop",
    mainTitle: "Languages Assessment",
    italicTitle: "Practices",
    heroDesc: "Understanding, applying and documenting assessment for English, Kannada, Hindi and French.",
    introText: "This handout supports Languages teachers at Ekya Schools in understanding, applying and documenting assessment practices for English, Kannada, Hindi and French. It should be read alongside the Curriculum Overview handout (Category 01) and the AY 2025-26 Assessment Pattern document.",
    philosophy: "At Ekya Schools, HOW students learn is as important as WHAT they learn. For Languages, this means assessment is never just about testing grammar or spelling in isolation. Every assessment focuses on the application of language skills in purposeful, meaningful contexts.",
    assessmentTypes: [
      { type: "Ungraded Assignments", icon: "📝", desc: "Ongoing tasks including reflection, revision and application of concepts. Examples: reading responses, grammar practice, writing drafts, vocabulary exercises." },
      { type: "Graded Assessments", icon: "📊", desc: "Official assessments contributing to scores: Reading & Writing, Speaking & Listening, Writing Projects, Reviews and TEEs." },
      { type: "Authentic Tasks & Portfolio", icon: "🎯", desc: "Real-world tasks: published pieces, speeches, debates, multimedia presentations. Portfolios compile evidence of growth over time." }
    ],
    pattern: [
      { grade: "1-3", rw: "2 per term", sl: "2 per term*", wp: "1 per term", review: "N/A", tee: "N/A" },
      { grade: "4", rw: "2 per term", sl: "2 per term*", wp: "1 per term", review: "1 per term", tee: "N/A" },
      { grade: "5-7", rw: "2 per term", sl: "2 per term*", wp: "1 per term", review: "1 per term", tee: "1 per term" },
      { grade: "8 (ICSE)", rw: "Included in 3 IAs + 1 GA", sl: "Included", wp: "Included in ATs", review: "2 Reviews", tee: "2 TEEs" },
      { grade: "9-10", rw: "Board Pattern", sl: "Board Pattern", wp: "Board Pattern", review: "2 Reviews", tee: "2 + PB" },
      { grade: "11-12", rw: "Board Pattern", sl: "Board Pattern", wp: "Board Pattern", review: "2 Reviews", tee: "2 + PB" }
    ],
    skillDomains: [
      { domain: "Reading", forms: "Comprehension exercises · Guided reading tasks · Novel study responses · Literary circle tasks · Annotation and close reading" },
      { domain: "Writing", forms: "Essay · Narrative · Descriptive · Persuasive · Reflective · Dialogue · Diary Entry · Letter · Poem · Story · Summary · Report · Script · Article" },
      { domain: "Speaking & Listening", forms: "Speech · Presentation · Debate · Interview · Role Play · Recitation (Poetry) · Recital · Group Discussion · Storytelling" },
      { domain: "Grammar & Language", forms: "Worksheet · Paragraph · Notebooking · Revision exercises · Error correction tasks" },
      { domain: "Authentic Tasks (AT)", forms: "Publishing a piece · Exhibition of writing · Research Report · Portfolio compilation · Dramatised reading · Publications submission" }
    ],
    feedback: [
      { principle: "Timely", example: "Feedback given within agreed timeframe: ideally before the next similar task. Written work returned promptly; oral feedback in-session." },
      { principle: "Specific & Targeted", example: "'Your topic sentence is clear. Now focus on adding evidence in the second paragraph.' Target one or two specific skills." },
      { principle: "Growth-Oriented", example: "Frame as a next step: 'What you could try next is…' or 'One way to strengthen this would be…'" },
      { principle: "Balanced", example: "Acknowledge what was done well before identifying work needed. Use 'commend-recommend' approach. Avoid over-correcting every error." },
      { principle: "Actionable", example: "'Revise this paragraph using the vocabulary from our lesson' is actionable. 'Improve vocabulary' is not." },
      { principle: "Stage-Specific", example: "Drafting stage: focus on ideas and organisation. Editing stage: focus on grammar and mechanics." }
    ],
    notebooking: [
      { aspect: "Formatting", guideline: "Establish date, topic, heading style, margin for remarks. Consistent formatting helps students organise learning." },
      { aspect: "Content Coverage", guideline: "Reflect full range: grammar notes, vocabulary lists, writing drafts, reading responses. Evidence of learning: not copying." },
      { aspect: "Stamps & Remarks", guideline: "Use purposefully: not just a tick. Brief written remarks are more useful than a grade alone." },
      { aspect: "Student Reflection", guideline: "Build time for self-assessment: 'What is one thing you would change now?' Part of the notebooking process." },
      { aspect: "Portfolio", guideline: "Select representative pieces across the year to show growth in reading, writing and oral skills. Include student reflections." }
    ],
    documentation: [
      { tool: "Schoology Gradebook", purpose: "Record and report all graded scores; track progress.", use: "Enter scores for R&W, S&L, Writing Projects, Reviews and TEEs. Map every entry to the correct standards code." },
      { tool: "Mark Register", purpose: "Standardised record of all student scores per class.", use: "Complete for each assessment type (R&W, S&L, Writing Project) after completion. Submit by specified deadlines." },
      { tool: "Evidence of Learning", purpose: "Marked scripts, annotated notebooks: kept as records.", use: "Retain at least one graded script per student per assessment type per term. Used for moderation and portfolios." },
      { tool: "Rubric Library", purpose: "Standardised rubrics for all Languages assessment forms.", use: "Use approved templates for S&L, Writing Projects and ATs. Do not create ad hoc rubrics; refer to C&I Platform." }
    ],
    dos: [
      { text: "Map every graded assessment to the relevant language standard before administering it." },
      { text: "Use the approved Rubric Template Library for all Writing Projects and S&L assessments." },
      { text: "Give feedback at the correct stage: ideas/organisation during drafting; grammar/mechanics during editing." },
      { text: "Enter scores into Schoology within the agreed deadline after each assessment." },
      { text: "Retain at least one marked script per student per term as evidence of learning." },
      { text: "Communicate with students about what each assessment is measuring before they sit it." },
      { text: "Vary assessment forms across the year: do not assess writing only through essays." }
    ],
    donts: [
      { text: "Do not use the same assessment form for every Reading & Writing task: vary text types." },
      { text: "Do not correct every error in student writing in one go: prioritise the skill focus." },
      { text: "Do not enter a final grade without first giving feedback that students can act on." },
      { text: "Do not administer an assessment that is not on the approved AY Assessment Pattern." },
      { text: "Do not delay returning marked work: feedback loses value if it arrives too late." },
      { text: "Do not skip Speaking & Listening assessments: oral skills are as important as written skills." }
    ],
    glossary: [
      { term: "Graded Assessment", mean: "Official assessments contributing to scores: R&W, S&L, Writing Projects, Reviews and TEEs." },
      { term: "Writing Project (WP)", mean: "Sustained, process-based assessment completed once per term. Students move through 6 stages (prewriting to publishing)." },
      { term: "Reading & Writing (R&W)", mean: "Formal assessment of reading comprehension and written expression. Administered twice per term for Gr 1-7." },
      { term: "Speaking & Listening (S&L)", mean: "Formal assessment of oral language skills. Administered twice per term (once in Term 1 for AY 25-26)." },
      { term: "Commend-Recommend", mean: "Feedback structure: first commend a specific strength, then recommend one clear next step." },
      { term: "Portfolio", mean: "Curated collection of student work across the year accompanied by student reflections." }
    ],
    quickTips: [
      { text: "Before every assessment, tell students exactly what you are measuring: show them the rubric." },
      { text: "Use the 'commend-recommend' structure for all written feedback." },
      { text: "Check the AY Assessment Pattern at the start of every term and map out dates early." },
      { text: "For Speaking & Listening: use the rubric while the student is speaking, not after." },
      { text: "For Writing Projects: share the rubric at the prewriting stage, not just before submission." },
      { text: "When entering scores in Schoology, check standard code and assessment type mapping." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_languages_assessment");
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
        settingKey="page_learning_languages_assessment"
        initialData={data}
        onSave={setData}
        title="Languages Assessment Practices"
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
              { key: "rw", label: "Reading & Writing", type: "input" },
              { key: "sl", label: "Speaking & Listening", type: "input" },
              { key: "wp", label: "Writing Project", type: "input" },
              { key: "review", label: "Review", type: "input" },
              { key: "tee", label: "TEE", type: "input" }
            ]
          },
          { 
            key: "skillDomains", 
            label: "Skill Domains & Forms", 
            type: "list",
            itemFields: [
              { key: "domain", label: "Skill Domain", type: "input" },
              { key: "forms", label: "Common Forms", type: "textarea" }
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
            key: "notebooking", 
            label: "Notebooking Guidelines", 
            type: "list",
            itemFields: [
              { key: "aspect", label: "Aspect", type: "input" },
              { key: "guideline", label: "Guideline", type: "textarea" }
            ]
          },
          { 
            key: "documentation", 
            label: "Documentation Tools", 
            type: "list",
            itemFields: [
              { key: "tool", label: "Tool Name", type: "input" },
              { key: "purpose", label: "Purpose", type: "textarea" },
              { key: "use", label: "Languages Use", type: "textarea" }
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
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">R&W</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">S&L</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Writing Project</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Review</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">TEE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.pattern.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.grade}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.rw}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.sl}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.wp}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">{row.review}</td>
                      <td className="px-8 py-6 text-sm font-black text-primary uppercase tracking-tighter">{row.tee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 italic mt-2">
            * PS: For Term 1 AY 2025-26 only, there will be a reduction of one Speaking and Listening assessment in Languages.
          </p>
        </section>

        {/* Skill Domains & Forms */}
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
            {data.skillDomains.map((form, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-6 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="md:w-1/3">
                  <h4 className="text-lg font-bold text-primary group-hover:translate-x-1 transition-transform">{form.domain}</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                    {form.forms}
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
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">What It Looks Like in Languages</th>
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

        {/* Notebooking Guidelines */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Notebook className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Evidence</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">NOTEBOOKING GUIDELINES</h3>
            </div>
          </div>

          <div className="grid gap-6">
            {data.notebooking.map((row, idx) => (
              <div key={idx} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-primary/20 transition-all flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">ASPECT</span>
                    <h4 className="text-xl font-black text-slate-800">{row.aspect}</h4>
                 </div>
                 <div className="md:w-3/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">GUIDELINE</span>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{row.guideline}</p>
                 </div>
              </div>
            ))}
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
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">LANGUAGES USE</span>
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

export default LanguagesAssessmentPracticesPage;
