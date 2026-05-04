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
  Compass
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

export const CSCurriculumOverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "CS Curriculum",
    italicTitle: "Overview",
    heroDesc: "Understanding, navigating, and confidently using the Computer Science Curriculum Overview resources.",
    introText: "The CS curriculum at Ekya Schools equips students to develop computational thinking and problem-solving skills while being responsible digital citizens: preparing them not just to use technology, but to understand, design and critically evaluate it.",
    rationale: "The purpose of the Computer Science programme is to enable students to collaborate, design, create and implement solutions to real-world problems using technology. A unique aspect is the integration of Design Thinking principles: a human-centred approach woven throughout the curriculum.",
    strands: [
      { name: "Computing Systems", icon: "🖥", desc: "Hardware, software and data working together: from personal devices to global networks." },
      { name: "Networks & Internet", icon: "🌐", desc: "How data is transmitted across networks and the internet. Covers security and architecture." },
      { name: "Data & Analysis", icon: "📊", desc: "Collecting, storing, interpreting and communicating raw data into valid information." },
      { name: "Algorithms & Programming", icon: "💻", desc: "Writing algorithms and programs; debugging; from block-based to Python/Java." },
      { name: "Impacts of Computing", icon: "🌍", desc: "Social, ethical and civic dimensions: privacy, security, and digital footprints." },
      { name: "Design Thinking", icon: "🎨", desc: "Applying human-centred design principles to understand user needs and create meaningful solutions." }
    ],
    practices: [
      { category: "Computational Thinking", practice: "Recognising & Defining Problems", means: "Students identify which real-world problems can be solved computationally." },
      { category: "Computational Thinking", practice: "Developing & Using Abstractions", means: "Students simplify complex systems by focusing on essential information." },
      { category: "Computational Thinking", practice: "Creating Computational Artefacts", means: "Students design, build and document programs, apps, or simulations." },
      { category: "Computational Thinking", practice: "Testing & Refining Artefacts", means: "Students systematically test for bugs and revise. Debugging is a core learning act." },
      { category: "Culture & Communication", practice: "Fostering Inclusive Culture", means: "Students design and code with accessibility and equity in mind." },
      { category: "Culture & Communication", practice: "Collaborating about Computing", means: "Students work in teams to design, build and troubleshoot." },
      { category: "Culture & Communication", practice: "Communicating about Computing", means: "Students articulate their thinking and explain algorithms." }
    ],
    progression: [
      { phase: "Grades 1–3", tools: "Scratch Jr., code.org", skills: "Sequencing, pattern recognition, basic algorithm writing, debugging introduction." },
      { phase: "Grades 4–6", tools: "Scratch, Paint.net, Python intro", skills: "Event-driven programming; variables; functions; iteration; UI design." },
      { phase: "Grades 7–8", tools: "Python, Web Dev, Arduino, SQL", skills: "OOP concepts; data structures; networks; physical computing; collaborative projects." },
      { phase: "Grades 9–10", tools: "Python (Int), VB, Arduino, SQL", skills: "OOP mastery; software engineering; GUI design; network security." },
      { phase: "Grades 11–12", tools: "Java, Python (Adv), AI, OOP", skills: "Advanced OOP; algorithm complexity; machine learning; capstone projects." }
    ],
    standards: [
      { phase: "Grades 1–8", framework: "Ekya / CSTA Standards", features: "Strand-based framework covering systems, networks, data, and impacts." },
      { phase: "Grades 9–10", framework: "Cambridge IGCSE CS (0478)", features: "Rigorous qualification covering theory and practical programming." },
      { phase: "Grades 11–12", framework: "CBSE / Cambridge A Level", features: "Advanced computational thinking, data structures, and algorithms." }
    ],
    scope: [
      { grade: "Grades 1–2", systems: "Parts of computer", data: "Sorting info", algorithms: "Step-by-step", design: "Everyday machines" },
      { grade: "Grades 3–4", systems: "Hardware vs Software", data: "Spreadsheets", algorithms: "Scratch animation", design: "Digital footprints" },
      { grade: "Grades 5–6", systems: "Network basics", data: "Visualisation", algorithms: "Python intro", design: "User-centred design" },
      { grade: "Grades 7–8", systems: "Network protocols", data: "Databases", algorithms: "HTML/CSS, OOP", design: "Cybersecurity" },
      { grade: "Grades 9–10", systems: "Advanced networks", data: "SQL modelling", algorithms: "Software engineering", design: "AI ethics" },
      { grade: "Grades 11–12", systems: "Cloud computing", data: "Big Data/AI", algorithms: "Advanced Java", design: "Responsible Innovation" }
    ],
    dos: [
      { text: "Read the LA Insert at the start of every academic year." },
      { text: "Follow the programming progression: ensure conceptual foundations before moving to text code." },
      { text: "Treat debugging as a core learning activity, not a sign of failure." },
      { text: "Embed Design Thinking in every relevant unit." },
      { text: "Explicitly name the CS practice students are using in each lesson." }
    ],
    donts: [
      { text: "Do not teach programming tools or languages as the goal: tools are the vehicle." },
      { text: "Do not skip the Impacts of Computing strand: ethics is as important as coding." },
      { text: "Do not treat the CS lesson as a typing class: require students to think and design." },
      { text: "Do not move to next phase before students demonstrate understanding." }
    ],
    glossary: [
      { term: "Computational Thinking", mean: "A problem-solving approach involving decomposition, pattern recognition, and abstraction." },
      { term: "Algorithm", mean: "A precise, step-by-step set of instructions for solving a problem." },
      { term: "Abstraction", mean: "Simplifying a complex system by focusing on essential information." },
      { term: "Design Thinking", mean: "Human-centred problem-solving process (Empathise, Define, Ideate, Prototype, Test)." }
    ],
    quickTips: [
      { text: "Start every unit with an Essential Question that connects computing to the real world." },
      { text: "Normalise the debugging mindset from Day 1. Bugs are information, not mistakes." },
      { text: "Teach the seven CS practices by name to build metacognitive awareness." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_cs_curriculum");
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
        settingKey="page_learning_cs_curriculum"
        initialData={data}
        onSave={setData}
        title="CS Curriculum Overview"
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
            key: "strands", 
            label: "Curriculum Strands", 
            type: "list",
            itemFields: [
              { key: "name", label: "Strand Name", type: "input" },
              { key: "icon", label: "Emoji Icon", type: "input" },
              { key: "desc", label: "Description", type: "textarea" }
            ]
          },
          { key: "section_progression", label: "Practices & Progression", type: "section" },
          { 
            key: "practices", 
            label: "Core CS Practices", 
            type: "list",
            itemFields: [
              { key: "category", label: "Category", type: "input" },
              { key: "practice", label: "Practice Name", type: "input" },
              { key: "means", label: "What it Means", type: "textarea" }
            ]
          },
          { 
            key: "progression", 
            label: "Tool Progression", 
            type: "list",
            itemFields: [
              { key: "phase", label: "Phase", type: "input" },
              { key: "tools", label: "Tools", type: "input" },
              { key: "skills", label: "Skills developed", type: "textarea" }
            ]
          },
          { key: "section_standards", label: "Standards & Scope", type: "section" },
          { 
            key: "standards", 
            label: "Standards Framework", 
            type: "list",
            itemFields: [
              { key: "phase", label: "Phase", type: "input" },
              { key: "framework", label: "Framework Name", type: "input" },
              { key: "features", label: "Key Features", type: "textarea" }
            ]
          },
          { 
            key: "scope", 
            label: "Scope & Sequence", 
            type: "list",
            itemFields: [
              { key: "grade", label: "Grade Band", type: "input" },
              { key: "systems", label: "Systems", type: "input" },
              { key: "data", label: "Data", type: "input" },
              { key: "algorithms", label: "Algorithms", type: "input" },
              { key: "design", label: "Design/Impacts", type: "input" }
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

        {/* Curriculum Strands */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Globe className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Core Strands</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">CURRICULUM STRANDS</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.strands.map((strand, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  {strand.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-4">{strand.name}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{strand.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core CS Practices */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Code className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Practices</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">THE SEVEN CORE CS PRACTICES</h3>
            </div>
          </div>

          <div className="grid gap-6">
            {data.practices.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center gap-6 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-primary/20 transition-all group">
                <div className="md:w-1/4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1 block">{item.category}</span>
                  <h4 className="text-lg font-bold text-slate-800">{item.practice}</h4>
                </div>
                <div className="md:w-3/4">
                  <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                    "{item.means}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tool Progression */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Monitor className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Progression</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">LANGUAGE & TOOL PROGRESSION</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Phase</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Tools & Languages</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Key Skills Developed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.progression.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.phase}</td>
                      <td className="px-8 py-6 text-sm font-black text-primary uppercase">{row.tools}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-500 leading-relaxed">{row.skills}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Scope & Sequence Table */}
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
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Computing Systems</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Data & Analysis</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Algorithms & Programming</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Impacts & Design</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.scope.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.grade}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.systems}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.data}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.algorithms}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600 italic">{row.design}</td>
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

export default CSCurriculumOverviewPage;

