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
  Flask,
  Compass,
  TreeStructure,
  TrendUp,
  Atom,
  ArrowRight,
  Globe,
  UsersThree
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

export const ScienceCurriculumOverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "Science Curriculum",
    italicTitle: "Overview",
    heroDesc: "Understanding, navigating, and effectively using the Curriculum Overview resources for the Science Learning Area.",
    introText: "This handout is designed to support Science teachers at Ekya Schools in understanding, navigating, and effectively using the Curriculum Overview resources for the Science Learning Area. The Curriculum Overview is the starting point for all instructional planning: it tells you what you are teaching, why you are teaching it, and how the learning progresses across grade levels.",
    rationale: "We at Ekya believe in a world beyond boundaries where education should continuously evolve and adapt as the world changes. The Science programme equips learners with curiosity, creativity and scientific inquiry to foster deeper and meaningful learning.",
    dimensions: [
      { name: "Science & Engineering Practices (SEP)", desc: "Students engage in practices that engineers and scientists use: asking questions, designing experiments, analysing data, and constructing explanations.", example: "Grade 6 students design a water filtration device using the NASA ISS Water Recovery System as a model." },
      { name: "Crosscutting Concepts (CCC)", desc: "Ideas that cut across science disciplines: patterns, cause and effect, structure and function, systems. Organizing lenses to make sense of phenomena.", example: "Applying the lens of 'Structure and Function' to both plant cells and engineering prototypes." },
      { name: "Disciplinary Core Ideas (DCI)", desc: "The coherent progression of fundamental concepts across Physical Science, Life Science, Earth & Space Science, and Engineering Design.", example: "Building understanding of 'Matter and Its Interactions' from Grade 1 through Grade 12." }
    ],
    framework: [
      { aspect: "Framework", info: "Next Generation Science Standards (NGSS)" },
      { aspect: "Disciplines", info: "Physical Science · Life Science · Earth & Space Science · Engineering Design" },
      { aspect: "Approach", info: "Three-dimensional: SEP + CCC + DCI integrated in every unit" },
      { aspect: "Key Feature", info: "Performance Expectations (PEs) define what students should be able to DO" }
    ],
    scope: [
      { grade: "Grades 1–2", phys: "Matter; forces & motion", life: "Habitats; life cycles", earth: "Weather; surface features", eng: "Simple design challenges" },
      { grade: "Grades 3–4", phys: "Light, sound; magnets", life: "Ecosystems; human body", earth: "Rocks; soil; climate", eng: "Iterative design process" },
      { grade: "Grades 5–6", phys: "Reactions; circuits", life: "Cell biology; genetics", earth: "Earth systems; space", eng: "Problem-solving/constraints" },
      { grade: "Grades 7–8", phys: "Newton's laws; waves", life: "Evolution; ecology", earth: "Plate tectonics; climate", eng: "Systems thinking" },
      { grade: "Grades 9–10", phys: "Thermodynamics", life: "Molecular biology", earth: "Geologic time; atmos", eng: "Real-world STEM projects" },
      { grade: "Grades 11–12", phys: "Quantum; nuclear", life: "Advanced physiology", earth: "Astrophysics; sustainability", eng: "Capstone research projects" }
    ],
    dos: [
      { text: "Read the LA Insert at the start of every academic year to anchor your teaching purpose." },
      { text: "Refer to the NGSS Performance Expectations when designing lessons and assessments." },
      { text: "Use the three dimensions (SEP, CCC, DCI) as an integrated whole : not separate add-ons." },
      { text: "Cross-reference your unit topics with the Scope & Sequence before beginning a new unit." },
      { text: "Access the Master Map on the C&I Platform for the most current unit plans and KUDs." },
      { text: "Connect the Science content to real-world phenomena and student-directed inquiry." },
      { text: "Share the programme rationale with students so they understand the 'why'." }
    ],
    donts: [
      { text: "Do not treat the LA Insert as a one-time read : revisit it when planning each unit." },
      { text: "Do not skip the Scope & Sequence: this avoids gaps in conceptual progression." },
      { text: "Do not isolate science practices (SEP) as 'lab activities': embed them into every lesson." },
      { text: "Do not rely solely on the textbook; the Science framework requires multiple resources." },
      { text: "Do not plan without checking the standards on the C&I Platform." },
      { text: "Do not conflate crosscutting concepts with generic 'themes': they must be explicitly taught." },
      { text: "Do not modify the Scope & Sequence without first consulting the C&I team." }
    ],
    glossary: [
      { term: "NGSS", mean: "Next Generation Science Standards: the international standards framework integrating three dimensions of learning." },
      { term: "SEP", mean: "Science and Engineering Practices: the eight practices that scientists and engineers use." },
      { term: "CCC", mean: "Crosscutting Concepts: seven big ideas that connect all science disciplines." },
      { term: "DCI", mean: "Disciplinary Core Ideas: foundational concepts in Physical, Life, Earth & Space Science and Engineering Design." },
      { term: "Performance Expectation (PE)", mean: "An NGSS standard that describes what students should be able to do." },
      { term: "Three-Dimensional Learning", mean: "The approach of integrating SEP, CCC, and DCI into every learning experience." }
    ],
    quickTips: [
      { text: "Start with the LA Insert: read the rationale before your first unit. It frames everything." },
      { text: "Print or bookmark the NGSS Performance Expectations for your grade level." },
      { text: "Open the Master Map on the C&I Platform before every new unit." },
      { text: "Use the Scope & Sequence as a 'big picture' map for students." },
      { text: "Pick a local, observable phenomenon that connects to the Disciplinary Core Idea." },
      { text: "Talk to your Science Kit coordinator at the start of each unit." },
      { text: "If unsure your lesson is '3D', ask: Am I asking students to USE a practice to explore a concept?" }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_science_curriculum");
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
        settingKey="page_learning_science_curriculum"
        initialData={data}
        onSave={setData}
        title="Science Curriculum Overview"
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
            key: "dimensions", 
            label: "Three Dimensions", 
            type: "list",
            itemFields: [
              { key: "name", label: "Dimension Name", type: "input" },
              { key: "desc", label: "Description", type: "textarea" },
              { key: "example", label: "Example", type: "textarea" }
            ]
          },
          { 
            key: "framework", 
            label: "Framework Overview", 
            type: "list",
            itemFields: [
              { key: "aspect", label: "Aspect", type: "input" },
              { key: "info", label: "Information", type: "textarea" }
            ]
          },
          { key: "section_progression", label: "Standards & Scope", type: "section" },
          { 
            key: "scope", 
            label: "Scope & Sequence", 
            type: "list",
            itemFields: [
              { key: "grade", label: "Grade Band", type: "input" },
              { key: "phys", label: "Physical Science", type: "input" },
              { key: "life", label: "Life Science", type: "input" },
              { key: "earth", label: "Earth & Space", type: "input" },
              { key: "eng", label: "Engineering Design", type: "input" }
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

        {/* Three-Dimensional Learning */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TreeStructure className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Methodology</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">3D LEARNING APPROACH</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.dimensions.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <h4 className="text-2xl font-black text-primary mb-4 group-hover:scale-105 transition-transform leading-tight">{item.name}</h4>
                <p className="text-sm text-slate-700 font-bold mb-4">{item.desc}</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-500">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Example</span>
                  {item.example}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Framework Overview */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Globe className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Standards</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">NGSS FRAMEWORK</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.framework.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-primary/20 transition-all text-center flex flex-col justify-center">
                <h4 className="text-[10px] font-black text-primary mb-2 uppercase tracking-widest">{item.aspect}</h4>
                <p className="text-sm text-slate-800 font-black tracking-tighter leading-tight">{item.info}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scope & Sequence */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Atom className="w-6 h-6" weight="duotone" />
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
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Physical Science</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Life Science</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Earth & Space</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Engineering Design</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.scope.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.grade}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.phys}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.life}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.earth}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.eng}</td>
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

export default ScienceCurriculumOverviewPage;



