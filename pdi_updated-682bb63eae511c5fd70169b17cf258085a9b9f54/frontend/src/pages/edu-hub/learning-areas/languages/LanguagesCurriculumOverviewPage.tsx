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
  Globe,
  Monitor,
  Code,
  UsersThree,
  Compass,
  TreeStructure,
  MagnifyingGlass,
  ArrowRight,
  Translate
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const LanguagesCurriculumOverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop",
    mainTitle: "Languages Curriculum",
    italicTitle: "Overview",
    heroDesc: "Understanding, navigating, and confidently using the Curriculum Overview resources for the Languages Learning Area.",
    introText: "At Ekya Schools and CMR National Public School, we embrace linguistic diversity and follow a three-language approach: a programme that fosters multilingualism and promotes cultural understanding.",
    rationale: "The Language Programme at Ekya is based on a set of standards that chart a clear path to developing language skills. It aims to help learners make meaning, understand a variety of texts, and communicate effectively and creatively.",
    languagePillars: [
      { name: "English", type: "Medium of Instruction", desc: "Core language for all subjects. Covers reading, writing, speaking and listening across all genres using in-house standards." },
      { name: "Kannada", type: "Local Language", desc: "Offered at different proficiency levels to all students, recognising local cultural and linguistic heritage." },
      { name: "Hindi / French", type: "Additional Language", desc: "Hindi for Primary; Choice between Hindi and French for Middle School. Develops communicative competence." }
    ],
    experiences: [
      { name: "Love to Read Programme", icon: "📚", desc: "Initiative encouraging exploration of new genres through Author Talks, Guided Reading, and Literary Circles." },
      { name: "Immersive Booklist", icon: "📖", desc: "Curated collection of award-winning titles (Indian and global) that build empathy and early reading habits." },
      { name: "Writing Process", icon: "✍️", desc: "Writing as a creative act moving through 6 recursive stages from Prewriting to Publishing for an authentic audience." }
    ],
    writingStages: [
      { step: "Prewriting", do: "Brainstorm ideas; use graphic organisers; respond to prompts.", role: "Provide prompts, anchor texts, and graphic organisers." },
      { step: "Research", do: "Gather information from relevant sources to support stance.", role: "Guide to credible sources; teach note-taking strategies." },
      { step: "Drafting", do: "Write a first draft prioritising ideas over correctness.", role: "Confer with students; encourage volume and flow." },
      { step: "Revising", do: "Improve content: word choices, sentence variety, clarity.", role: "Targeted revision lessons (e.g. word choice)." },
      { step: "Editing", do: "Correct errors in spelling, punctuation, and grammar.", role: "Peer editing protocols and checklists." },
      { step: "Publishing", do: "Present the final, polished piece to an audience.", role: "Celebrate work; create authentic publishing opportunities." }
    ],
    standards: [
      { phase: "English Gr 1-8", framework: "Ekya In-House standards", features: "Comprehensive skill-based framework covering R, W, S, L." },
      { phase: "English Gr 9-10", framework: "Cambridge IGCSE (CAIE)", features: "First/Second Language qualification; formal language analysis." },
      { phase: "Kannada All", framework: "Karnataka State Board", features: "Sequenced to develop proficiency appropriate to each level." },
      { phase: "Hindi Primary/MS", framework: "CBSE/ICSE adapted", features: "Foundational to intermediate progression." },
      { phase: "French MS/Senior", framework: "CEFR (A1 to B2)", features: "Communicative competence focus." }
    ],
    scope: [
      { grade: "Grades 1-2", eng: "Phonics, early reading", kan: "Alphabet, basic vocab", hin: "Simple sentences", fre: "-" },
      { grade: "Grades 3-4", eng: "Fiction & non-fiction", kan: "Short texts, grammar", hin: "Short passages", fre: "-" },
      { grade: "Grades 5-6", eng: "Novel study, persuasive", kan: "Prose & poetry", hin: "Tenses, paragraph", fre: "-" },
      { grade: "Grades 7-8", eng: "Argumentative, analysis", kan: "Lit appreciation", hin: "Essay & creative", fre: "Beginners - alphabet" },
      { grade: "Grades 9-10", eng: "Cambridge IGCSE", kan: "Advanced expression", hin: "Advanced literature", fre: "Intermediate" },
      { grade: "Grades 11-12", eng: "Cambridge AS/A Level", kan: "Senior literature", hin: "Oral proficiency", fre: "Upper intermediate" }
    ],
    dos: [
      { text: "Read the LA Insert at the start of every academic year." },
      { text: "Treat the writing process as recursive, not linear." },
      { text: "Create authentic publishing opportunities for student writing." },
      { text: "Use the curated booklist to drive reading instruction." },
      { text: "Embed DEAR (Drop Everything And Read) time consistently." },
      { text: "Distinguish explicitly between revising and editing." }
    ],
    donts: [
      { text: "Do not treat the three languages as isolated subjects: support literacy transfer." },
      { text: "Do not skip the Prewriting or Research stages of the writing process." },
      { text: "Do not correct every error in student drafts; focus on the current stage." },
      { text: "Do not use the same text types and genres every term: vary experiences." },
      { text: "Do not rely solely on grammar exercises : teach in context." }
    ],
    glossary: [
      { term: "Three-Language Approach", mean: "Ekya's policy: English (MOI), Kannada (Local), and Hindi/French (Additional)." },
      { term: "DEAR", mean: "Drop Everything And Read : structured independent reading time to build fluency." },
      { term: "Writing Process", mean: "Recursive 6-stage process: Prewriting → Research → Drafting → Revising → Editing → Publishing." },
      { term: "Literary Circles", mean: "Structured student discussion groups around shared texts." },
      { term: "CEFR", mean: "Common European Framework of Reference for Languages (A1 to C2)." }
    ],
    quickTips: [
      { text: "Start every year by reading the LA Insert for your language." },
      { text: "Post the six stages of the writing process visibly in your classroom." },
      { text: "When giving feedback, name the stage first (e.g. 'We are in the revising stage')." },
      { text: "Use the booklist as a curriculum tool, not just a reading list." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_languages_curriculum");
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
        settingKey="page_learning_languages_curriculum"
        initialData={data}
        onSave={setData}
        title="Languages Curriculum Overview"
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
          { key: "rationale", label: "Programme Rationale", type: "textarea" },
          { 
            key: "languagePillars", 
            label: "Language Pillars", 
            type: "list",
            itemFields: [
              { key: "name", label: "Language Name", type: "input" },
              { key: "type", label: "Category", type: "input" },
              { key: "desc", label: "Description", type: "textarea" }
            ]
          },
          { key: "section_experiences", label: "Experiences & Writing", type: "section" },
          { 
            key: "experiences", 
            label: "Signature Experiences", 
            type: "list",
            itemFields: [
              { key: "name", label: "Experience Name", type: "input" },
              { key: "icon", label: "Emoji Icon", type: "input" },
              { key: "desc", label: "Description", type: "textarea" }
            ]
          },
          { 
            key: "writingStages", 
            label: "The Writing Process", 
            type: "list",
            itemFields: [
              { key: "step", label: "Process Step", type: "input" },
              { key: "do", label: "What Students Do", type: "textarea" },
              { key: "role", label: "Teacher's Role", type: "textarea" }
            ]
          },
          { key: "section_progression", label: "Standards & Scope", type: "section" },
          { 
            key: "standards", 
            label: "Standards Framework", 
            type: "list",
            itemFields: [
              { key: "phase", label: "Language / Phase", type: "input" },
              { key: "framework", label: "Framework", type: "input" },
              { key: "features", label: "Key Features", type: "textarea" }
            ]
          },
          { 
            key: "scope", 
            label: "Scope & Sequence", 
            type: "list",
            itemFields: [
              { key: "grade", label: "Grade Band", type: "input" },
              { key: "eng", label: "English", type: "input" },
              { key: "kan", label: "Kannada", type: "input" },
              { key: "hin", label: "Hindi", type: "input" },
              { key: "fre", label: "French", type: "input" }
            ]
          },
          { key: "section_guidelines", label: "Guidelines & Terms", type: "section" },
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
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Category 01</h2>
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

        {/* Programme Rationale */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Lightbulb className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Philosophy</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">PROGRAMME RATIONALE</h3>
            </div>
          </div>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Lightbulb size={200} weight="fill" />
             </div>
             <div className="relative z-10 max-w-4xl">
               <p className="text-xl text-slate-300 font-medium leading-relaxed">
                 {data.rationale}
               </p>
             </div>
          </div>
        </section>

        {/* Language Pillars */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TreeStructure className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">The Pillars</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">THE THREE-LANGUAGE APPROACH</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.languagePillars.map((pillar, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex flex-col gap-1 mb-6">
                  <h4 className="text-2xl font-black text-primary group-hover:scale-105 transition-transform">{pillar.name}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{pillar.type}</span>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Signature Experiences */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkle className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Innovation</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">LANGUAGE LEARNING EXPERIENCES</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.experiences.map((exp, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-6 mx-auto group-hover:bg-primary group-hover:scale-110 transition-all">
                  {exp.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-4 tracking-tighter">{exp.name}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Writing Process */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Code className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Process</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">THE WRITING PROCESS</h3>
            </div>
          </div>

          <div className="grid gap-6">
            {data.writingStages.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-6 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="md:w-1/4 flex items-center gap-4">
                  <span className="text-3xl font-black text-slate-100 group-hover:text-primary/20 transition-colors">{idx + 1}</span>
                  <h4 className="text-lg font-black text-primary uppercase tracking-tighter">{item.step}</h4>
                </div>
                <div className="md:w-1/4">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 block">WHAT STUDENTS DO</span>
                   <p className="text-sm font-bold text-slate-700">{item.do}</p>
                </div>
                <div className="md:w-2/4">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 block">TEACHER'S ROLE</span>
                   <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Standards Framework */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ListChecks className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Framework</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">STANDARDS FRAMEWORK</h3>
            </div>
          </div>

          <div className="grid gap-6">
            {data.standards.map((row, idx) => (
              <div key={idx} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">PHASE</span>
                    <h4 className="text-xl font-black text-slate-800">{row.phase}</h4>
                 </div>
                 <div className="md:w-1/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">FRAMEWORK</span>
                    <p className="text-sm font-bold text-slate-600">{row.framework}</p>
                 </div>
                 <div className="md:w-2/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">KEY FEATURES</span>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{row.features}</p>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scope & Sequence */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ListChecks className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Progression</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">SCOPE & SEQUENCE</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Grade Band</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">English</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Kannada</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Hindi</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">French</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.scope.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.grade}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.eng}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.kan}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.hin}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.fre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default LanguagesCurriculumOverviewPage;



