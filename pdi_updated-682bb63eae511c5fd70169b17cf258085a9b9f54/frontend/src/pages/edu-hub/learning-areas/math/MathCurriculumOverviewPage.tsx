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
  Calculator,
  Compass,
  TreeStructure,
  TrendUp,
  Atom,
  ArrowRight
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const MathCurriculumOverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "Math Curriculum",
    italicTitle: "Overview",
    heroDesc: "Understanding, navigating, and confidently using the Curriculum Overview resources for the Mathematics Learning Area.",
    introText: "This handout supports Mathematics teachers at Ekya Schools in understanding, navigating, and confidently using the Curriculum Overview resources for the Mathematics Learning Area. The Curriculum Overview is the foundation of all instructional planning: it tells you what you are teaching, why it matters, and how mathematical understanding builds across grade levels.",
    rationale: "The Mathematics Programme at Ekya Schools promotes deep understanding through structured approaches that allow students to learn and build problem-solving skills. Our goal is to enable students to develop mathematical thinking, use practices for problem-solving, and understand the relevance of mathematics in the real world.",
    cpaMethod: [
      { stage: "Concrete (C)", desc: "Students handle physical manipulatives: counters, fraction tiles, base-ten blocks: to build tangible understanding before any symbols are introduced.", example: "Folding paper strips into equal parts; using fraction tiles to compare halves and quarters" },
      { stage: "Pictorial (P)", desc: "Students represent the concrete experience through diagrams, bar models or number bonds: a bridge between physical objects and abstract notation.", example: "Drawing a bar model divided into equal portions; sketching fraction circles to show 3/4" },
      { stage: "Abstract (A)", desc: "Students work fluently with numbers, symbols and equations once conceptual understanding is secure through C and P stages.", example: "Writing 3/4 + 1/4 = 1; solving multi-step fraction word problems using symbolic notation" }
    ],
    practices: [
      { skill: "Problem-solving and reasoning", desc: "Approaching unfamiliar problems with persistence and strategy." },
      { skill: "Connecting", desc: "Linking mathematical ideas across topics and to real-world contexts." },
      { skill: "Communicating", desc: "Sharing mathematical thinking clearly, verbally and in writing." },
      { skill: "Representing", desc: "Using models, diagrams, bar models and symbols to visualize problems." },
      { skill: "Reflecting", desc: "Evaluating the efficiency of chosen strategies and methods." }
    ],
    contentAreas: [
      { area: "Numbers & Algebra", focus: "Counting, place value, fractions, decimals, ratio, algebra, calculus, and complex numbers." },
      { area: "Measurement & Geometry", focus: "Shapes, standard measurement, area, perimeter, volume, trigonometry, and coordinate geometry." },
      { area: "Statistics & Probability", focus: "Data collection, pictographs, mean, median, mode, distributions, and hypothesis testing." }
    ],
    standards: [
      { phase: "Grades 1-6 (Primary)", framework: "Singapore Math", features: "Ministry of Education Singapore curriculum. Emphasises mastery through CPA, number bonds and bar models." },
      { phase: "Grades 7-10", framework: "ICSE / Cambridge IGCSE", features: "Rigorous progression from middle school algebra through internationally recognised IGCSE qualification." },
      { phase: "Grades 11-12", framework: "Cambridge AS & A Level", features: "Covers pure mathematics, statistics and mechanics. Preparation for STEM undergraduate study." }
    ],
    scope: [
      { grade: "Grades 1-2", num: "Number bonds, addition/subtraction", meas: "2D/3D shapes, telling time", stat: "Picture graphs, tallies", prac: "Concrete manipulation" },
      { grade: "Grades 3-4", num: "Mult/Div, fractions, decimals", meas: "Area, perimeter, angles", stat: "Bar graphs, line graphs", prac: "Bar modelling introduced" },
      { grade: "Grades 5-6", num: "Ratio, percentages, integers", meas: "Volume, transformations", stat: "Mean, median, mode", prac: "Heuristic problem-solving" },
      { grade: "Grades 7-8", num: "Equations, linear functions", meas: "Pythagoras, congruence", stat: "Data analysis, tree diagrams", prac: "Reasoning & justification" },
      { grade: "Grades 9-10", num: "Quadratic equations, surds", meas: "Trigonometry, vectors", stat: "Histograms, scatter graphs", prac: "Proof writing" },
      { grade: "Grades 11-12", num: "Calculus, complex numbers", meas: "3D vectors, mech", stat: "Statistical distributions", prac: "Mathematical rigour" }
    ],
    dos: [
      { text: "Read the LA Insert at the start of every academic year." },
      { text: "Follow the CPA sequence for Grades 1-6: begin with concrete manipulatives." },
      { text: "Use bar models and number bonds as primary visual problem-solving tools." },
      { text: "Check the standards codes in your unit plan on the C&I Platform." },
      { text: "Cross-reference the Scope & Sequence to ensure you are building on prior learning." },
      { text: "Encourage mathematical discussion and justification of reasoning." },
      { text: "Connect concepts to real-world problems to build relevance." }
    ],
    donts: [
      { text: "Do not skip the Concrete stage and move directly to Abstract." },
      { text: "Do not rely solely on the textbook for planning; use the C&I Master Map." },
      { text: "Do not treat mathematical practices as optional extras." },
      { text: "Do not teach topics in isolation; Mathematics is cumulative." },
      { text: "Do not plan without checking the relevant standards codes." },
      { text: "Do not use drill-and-practice as the primary mode of instruction." },
      { text: "Do not modify the Scope & Sequence without consulting the C&I team." }
    ],
    glossary: [
      { term: "Singapore Math", mean: "Ministry of Education Singapore curriculum framework used for Grades 1-6." },
      { term: "CPA Method", mean: "Concrete-Pictorial-Abstract: the three-stage instructional sequence." },
      { term: "Bar Model", mean: "A visual problem-solving strategy using rectangular bars to represent quantities." },
      { term: "Number Bond", mean: "A visual representation showing how a number can be split into parts." },
      { term: "KUD", mean: "Knows, Understands, Does: the learning framework used in UbD planning." },
      { term: "SMART Tool", mean: "A structured problem-solving heuristic used to guide students through challenges." }
    ],
    quickTips: [
      { text: "Start with the LA Insert before your first unit every year." },
      { text: "For Grades 1-6: never skip the Concrete stage." },
      { text: "Keep a bar model reference sheet at your desk." },
      { text: "Open the C&I Platform Master Map before every new unit." },
      { text: "Use the Scope & Sequence as a 'learning journey' visual for students." },
      { text: "For Grades 7-12: download and annotate the relevant Cambridge syllabus." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_math_curriculum");
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
        settingKey="page_learning_math_curriculum"
        initialData={data}
        onSave={setData}
        title="Math Curriculum Overview"
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
            key: "cpaMethod", 
            label: "CPA Method Stages", 
            type: "list",
            itemFields: [
              { key: "stage", label: "Stage Name", type: "input" },
              { key: "desc", label: "Description", type: "textarea" },
              { key: "example", label: "Example", type: "textarea" }
            ]
          },
          { 
            key: "practices", 
            label: "Mathematical Practices", 
            type: "list",
            itemFields: [
              { key: "skill", label: "Practice Skill", type: "input" },
              { key: "desc", label: "Description", type: "textarea" }
            ]
          },
          { key: "section_progression", label: "Standards & Scope", type: "section" },
          { 
            key: "standards", 
            label: "Standards Framework", 
            type: "list",
            itemFields: [
              { key: "phase", label: "Phase / Grades", type: "input" },
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
              { key: "num", label: "Numbers & Algebra", type: "input" },
              { key: "meas", label: "Measurement & Geo", type: "input" },
              { key: "stat", label: "Stats & Prob", type: "input" },
              { key: "prac", label: "Practices", type: "input" }
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

        {/* CPA Method */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TreeStructure className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Methodology</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">THE CPA METHOD</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.cpaMethod.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <h4 className="text-2xl font-black text-primary mb-4 group-hover:scale-105 transition-transform">{item.stage}</h4>
                <p className="text-sm text-slate-700 font-bold mb-4">{item.desc}</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-500">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-1">Example</span>
                  {item.example}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mathematical Practices */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Compass className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Process Skills</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">MATHEMATICAL PRACTICES</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {data.practices.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-primary/20 transition-all text-center">
                <h4 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter leading-tight">{item.skill}</h4>
                <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Content Areas */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendUp className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Organization</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">KEY CONTENT AREAS</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.contentAreas.map((area, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <h4 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors">{area.area}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{area.focus}</p>
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
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Numbers & Algebra</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Measurement & Geo</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Stats & Prob</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Practices</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.scope.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800">{row.grade}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.num}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.meas}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.stat}</td>
                      <td className="px-8 py-6 text-xs font-medium text-slate-600">{row.prac}</td>
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

export default MathCurriculumOverviewPage;



