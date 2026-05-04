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
  ArrowRight
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const HASSCurriculumOverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2074&auto=format&fit=crop",
    mainTitle: "HASS Curriculum",
    italicTitle: "Overview",
    heroDesc: "Understanding, navigating, and confidently using the Curriculum Overview resources for the Social Science Learning Area.",
    introText: "The Social Science programme at Ekya Schools is focused on studying interaction and human behaviour in social, cultural, environmental, economic and political contexts: with both a historical and contemporary focus, from personal to global scales.",
    rationale: "The purpose of learning Social Science is to enable learners to develop a deeper understanding of society, law, politics and human–environment interactions. It aims at building responsible leaders and global citizens, capable of contributing meaningfully to society.",
    pillars: [
      { name: "Crosscutting Concepts", icon: "🔗", desc: "Six big ideas (Identity, Significance, Place, etc.) that provide the analytical lens through which students examine content." },
      { name: "Knowledge & Understanding", icon: "📚", desc: "The four disciplinary knowledge domains: History, Geography, Civics and Economics." },
      { name: "Inquiry & Skills", icon: "🔍", desc: "The five processes (Questioning, Researching, Analysing, Evaluating, Communicating) that develop critical thinking." }
    ],
    concepts: [
      { concept: "Identity & Culture", explore: "How individuals and groups define themselves; how culture shapes perspectives.", question: "'Who am I and how does my community shape my identity?'" },
      { concept: "Significance & Perspectives", explore: "Why certain events/people matter; how significance is determined.", question: "'Whose perspective is missing from this account?'" },
      { concept: "Place & Environment", explore: "How physical and human features shape societies; human–environment interaction.", question: "'How does geography shape the way people live?'" },
      { concept: "Change & Continuity", explore: "What changes over time and what stays the same; patterns of transformation.", question: "'How does the past shape our present?'" },
      { concept: "Cause & Effect", explore: "Why events happen; the short- and long-term consequences of actions.", question: "'What were the causes of this conflict?'" },
      { concept: "Patterns & Structure", explore: "Recurring patterns in social/economic systems; how structures are organised.", question: "'How does this economic structure affect different groups?'" }
    ],
    disciplines: [
      { discipline: "History", focus: "Understanding the past (civilisations, movements, events); examining sources.", question: "'What happened and why?' · 'How do we know about the past?'" },
      { discipline: "Geography", focus: "Places, environments and spatial patterns; map skills; sustainability.", question: "'Where is it and why is it there?' · 'How do humans interact with their environment?'" },
      { discipline: "Civics", focus: "Systems of governance, law, rights and responsibilities; democratic processes.", question: "'How are laws made?' · 'What are my rights and responsibilities as a citizen?'" },
      { discipline: "Economics", focus: "Production, distribution and consumption; markets; globalisation; personal finance.", question: "'How do we decide what to produce?' · 'Impact of globalisation on local communities?'" }
    ],
    skills: [
      { skill: "Questioning", do: "Formulate inquiry questions: factual, conceptual and debatable.", example: "Generating 'I wonder…' questions; developing essential questions." },
      { skill: "Researching", do: "Gather information from primary and secondary sources.", example: "Library research; field observations; using atlases and timelines." },
      { skill: "Analysing", do: "Examine evidence, identify patterns, compare perspectives and interpret data.", example: "Annotating primary sources; comparing historical accounts; analysing graphs." },
      { skill: "Evaluating & Reflecting", do: "Assess reliability and significance; reflect on perspective.", example: "Source credibility checks; peer critique of arguments; reflective journals." },
      { skill: "Communicating", do: "Present findings through a variety of formats.", example: "Written reports, essays, debates, presentations, exhibitions." }
    ],
    standards: [
      { phase: "Grades 1–8", framework: "Ekya In-House HASS Standards", features: "Designed using ACARA as reference; covers 4 disciplines with integrated concepts." },
      { phase: "Grades 9–10", framework: "Cambridge IGCSE (CAIE)", features: "Emphasises research, critical thinking and communication; Global Perspectives focus." },
      { phase: "Grades 11–12", framework: "CBSE / Cambridge A Level", features: "Advanced History, Geography, Economics or Sociology; original inquiry focus." },
      { phase: "Across All", framework: "UbD Framework", features: "All units designed using Stages 1–4; mapped to KUDs on the C&I Platform." }
    ],
    scope: [
      { grade: "Grades 1–2", hist: "Family & community", geo: "Local environment", civ: "Rules at home/school", eco: "Needs vs Wants" },
      { grade: "Grades 3–4", hist: "Ancient civilisations", geo: "India physical features", civ: "Local government", eco: "Producers & consumers" },
      { grade: "Grades 5–6", hist: "Medieval & Colonial", geo: "Climate & globalisation", civ: "Indian Constitution", eco: "Trade & systems" },
      { grade: "Grades 7–8", hist: "Empires & Revolutions", geo: "Human geography", civ: "Political systems", eco: "Globalisation impact" },
      { grade: "Grades 9–10", hist: "Contemporary history", geo: "Climate change", civ: "Comparative govt", eco: "Macro & Micro eco" },
      { grade: "Grades 11–12", hist: "Extended inquiry", geo: "Spatial analysis", civ: "Political philosophy", eco: "Economic theory" }
    ],
    dos: [
      { text: "Read the LA Insert at the start of every academic year." },
      { text: "Name the crosscutting concept explicitly in every unit." },
      { text: "Begin every unit with an Essential Question displayed in the classroom." },
      { text: "Use primary sources regularly : maps, photographs, documents, artefacts." },
      { text: "Teach the inquiry cycle skills explicitly to students." },
      { text: "Connect content to local and Indian contexts before moving global." }
    ],
    donts: [
      { text: "Do not structure units around textbook chapters : use the Master Map." },
      { text: "Do not teach disciplines as isolated subjects : look for connections." },
      { text: "Do not confuse describing with analysing : go beyond recounting events." },
      { text: "Do not neglect the communicating skill : use audiences beyond the teacher." },
      { text: "Do not rely on recall-only assessments : assess inquiry skills." }
    ],
    glossary: [
      { term: "HASS", mean: "Humanities and Social Sciences: integrated learning area encompassing History, Geography, Civics and Economics." },
      { term: "Inquiry Cycle", mean: "The five-skill process students use: Questioning → Researching → Analysing → Evaluating → Communicating." },
      { term: "Essential Question", mean: "An open-ended, debatable question that drives the entire unit's investigation." },
      { term: "Primary Source", mean: "Original document or record created at the time of the event being studied." },
      { term: "UbD", mean: "Understanding by Design : the backwards design framework used for all curriculum planning." }
    ],
    quickTips: [
      { text: "Display the Essential Question prominently and refer to it at the end of every lesson." },
      { text: "Use the 'describe–explain–evaluate' progression as a daily feedback prompt." },
      { text: "Anchor Authentic Tasks in local Indian contexts to make the inquiry purposeful." },
      { text: "Teach source analysis as an explicit skill before assessing it." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_hass_curriculum");
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
        settingKey="page_learning_hass_curriculum"
        initialData={data}
        onSave={setData}
        title="HASS Curriculum Overview"
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
            key: "pillars", 
            label: "Curriculum Pillars", 
            type: "list",
            itemFields: [
              { key: "name", label: "Pillar Name", type: "input" },
              { key: "icon", label: "Emoji Icon", type: "input" },
              { key: "desc", label: "Description", type: "textarea" }
            ]
          },
          { key: "section_concepts", label: "Concepts & Disciplines", type: "section" },
          { 
            key: "concepts", 
            label: "Crosscutting Concepts", 
            type: "list",
            itemFields: [
              { key: "concept", label: "Concept", type: "input" },
              { key: "explore", label: "What Students Explore", type: "textarea" },
              { key: "question", label: "Sample Question", type: "input" }
            ]
          },
          { 
            key: "disciplines", 
            label: "The Four Disciplines", 
            type: "list",
            itemFields: [
              { key: "discipline", label: "Discipline", type: "input" },
              { key: "focus", label: "Core Focus", type: "textarea" },
              { key: "question", label: "Key Question", type: "input" }
            ]
          },
          { key: "section_skills", label: "Skills & Progression", type: "section" },
          { 
            key: "skills", 
            label: "Inquiry Skills", 
            type: "list",
            itemFields: [
              { key: "skill", label: "Skill Name", type: "input" },
              { key: "do", label: "What Students Do", type: "textarea" },
              { key: "example", label: "Classroom Example", type: "textarea" }
            ]
          },
          { 
            key: "scope", 
            label: "Scope & Sequence", 
            type: "list",
            itemFields: [
              { key: "grade", label: "Grade Band", type: "input" },
              { key: "hist", label: "History", type: "input" },
              { key: "geo", label: "Geography", type: "input" },
              { key: "civ", label: "Civics", type: "input" },
              { key: "eco", label: "Economics", type: "input" }
            ]
          },
          { key: "section_standards", label: "Standards & Rules", type: "section" },
          { 
            key: "standards", 
            label: "Standards Framework", 
            type: "list",
            itemFields: [
              { key: "phase", label: "Phase", type: "input" },
              { key: "framework", label: "Framework", type: "input" },
              { key: "features", label: "Key Features", type: "textarea" }
            ]
          },
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

        {/* Curriculum Pillars */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TreeStructure className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">The Pillars</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">THE THREE PILLARS OF HASS</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.pillars.map((pillar, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  {pillar.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-4">{pillar.name}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Crosscutting Concepts */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Compass className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Conceptual Lenses</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">CROSSCUTTING CONCEPTS</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.concepts.map((item, idx) => (
              <div key={idx} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-primary/20 transition-all flex flex-col gap-4">
                 <h4 className="text-xl font-black text-slate-800 border-b border-slate-50 pb-4">{item.concept}</h4>
                 <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1 block">EXPLORE</span>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">{item.explore}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 block">CLASSROOM QUESTION</span>
                      <p className="text-sm font-bold text-slate-500 italic">{item.question}</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Four Disciplines */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Disciplinary Knowledge</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">THE FOUR DISCIPLINES</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Discipline</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Core Focus</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Key Questions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.disciplines.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.discipline}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600 leading-relaxed">{row.focus}</td>
                      <td className="px-8 py-6 text-sm font-bold text-primary italic">{row.question}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Inquiry & Skills */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <MagnifyingGlass className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Process</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">INQUIRY & SKILLS</h3>
            </div>
          </div>

          <div className="grid gap-6">
            {data.skills.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-6 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="md:w-1/4">
                  <h4 className="text-lg font-black text-primary group-hover:translate-x-1 transition-transform uppercase tracking-tighter">{item.skill}</h4>
                </div>
                <div className="md:w-1/4">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 block">WHAT STUDENTS DO</span>
                   <p className="text-sm font-bold text-slate-700">{item.do}</p>
                </div>
                <div className="md:w-2/4">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 block">IN CLASS</span>
                   <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{item.example}</p>
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
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Timeline</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">SCOPE & SEQUENCE</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Grade Band</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">History</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Geography</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Civics</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Economics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.scope.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.grade}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.hist}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.geo}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.civ}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.eco}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Standards Framework */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TreeStructure className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Curriculum</h2>
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

export default HASSCurriculumOverviewPage;



