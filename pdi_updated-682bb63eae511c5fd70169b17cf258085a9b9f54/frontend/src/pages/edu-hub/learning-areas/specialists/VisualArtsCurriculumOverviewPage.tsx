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
  Palette,
  PaintBrush,
  Cube,
  UsersThree,
  Compass,
  ArrowRight,
  Pentagon,
  House,
  TrendUp
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const VisualArtsCurriculumOverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080&auto=format&fit=crop",
    mainTitle: "Visual Arts",
    italicTitle: "Curriculum",
    heroDesc: "Fostering creative expression, exploration and collaboration through a process-oriented Visual Art & Makery programme.",
    introText: "This handout supports Visual Arts teachers at Ekya Schools in understanding and navigating the Curriculum Overview for the Visual Arts & Makery Learning Area. At Ekya, Visual Art is a dynamic and interconnected journey: students build knowledge and skills through hands-on learning experiences.",
    rationale: "The Visual Art programme fosters appreciation and understanding, encouraging students to learn through making. We believe the process is more valuable than the product. Every piece created is unique and showcases a student's own expression of the creative process.",
    coreAreas: [
      { name: "Representational Skills", desc: "Drawing from observation, still life, figure drawing and rendering forms accurately. Building visual literacy." },
      { name: "Wet & Dry Media", desc: "Exploration of pencil, charcoal, ink, watercolour, acrylic, clay, and mixed media. Experimentation without hesitation." },
      { name: "2D & 3D Work", desc: "Translating ideas into two-dimensional (painting, printing) and three-dimensional (sculpture, construction) forms." },
      { name: "Imagination & Going Beyond", desc: "Encouraging open-ended prompts, tangents and experimental approaches that go beyond the obvious." },
      { name: "Design Thinking (Makery)", desc: "Applying design principles to solve real-world problems, creating functional and aesthetic designs." },
      { name: "Art History & Context", desc: "Learning terminology, reading artworks, and understanding art movements across cultures and eras." }
    ],
    progression: [
      { phase: "Early Years & Primary (Gr EY–5)", focus: "Foundational skills: drawing, painting, motor skill refinement; art history basics; 2D and 3D forms.", experiences: "Colour theory; pattern making; sculpture; reading art in installations." },
      { phase: "Middle School (Gr 6–8)", focus: "Project-based learning; 3D modelling and sculpture; spatial understanding; mindful making.", experiences: "Concept maps; visual thinking; collaborative art projects; decoding artworks." },
      { phase: "Senior School / Makery (Gr 9–12)", focus: "Transformation from simple to complex making; interdisciplinary design; technology in art.", experiences: "Makery projects; digital/traditional media; student-led design challenges; prototyping." }
    ],
    scope: [
      { grade: "Early Years", focus: "Sensory exploration; mark-making; free play; 3D forms (clay); observing artwork." },
      { grade: "Grades 1–2", focus: "Drawing and painting fundamentals; colour mixing; pattern and line; art history stories." },
      { grade: "Grades 3–4", focus: "Wet and dry media; representational drawing; printing; 3D work; exploring artists." },
      { grade: "Grades 5–6", focus: "Mixed media; composition; observational drawing; clay sculpture; cultural context." },
      { grade: "Grades 7–8", focus: "Project-based making; 3D modelling; spatial understanding; mindful making; collaborative art." },
      { grade: "Grades 9–12 (Makery)", focus: "Design thinking; interdisciplinary projects; tech/media integration; student-led functional design." }
    ],
    dos: [
      { text: "Celebrate experimentation: display works-in-progress, not just finished pieces." },
      { text: "Explicitly teach and model the use of each medium before independent work." },
      { text: "Allow students to make mistakes and learn from them with curiosity." },
      { text: "Vary media across the year to build creative range." },
      { text: "Teach art history in connection with current student projects." },
      { text: "Encourage collaborative making to develop shared ownership." },
      { text: "Document processes: photo progression, decision notes, and reflections." }
    ],
    donts: [
      { text: "Do not assess primarily on aesthetic quality or technical perfection: focus on risk-taking and process." },
      { text: "Do not rush students to a finished product: the making is the curriculum." },
      { text: "Do not use the same art project for every class : differentiate tasks." },
      { text: "Do not skip art history and context." },
      { text: "Do not plan without referring to the C&I Platform Master Map." },
      { text: "Do not clean up too early: visible 'messy' work shows genuine making." }
    ],
    glossary: [
      { term: "Elements of Art", mean: "Line, shape, form, colour, value, texture and space : the building blocks of visual art." },
      { term: "Wet Media", mean: "Art materials involving liquid like watercolour, acrylic paint, ink, and dye." },
      { term: "Dry Media", mean: "Materials like pencil, charcoal, pastel, and crayon." },
      { term: "Mixed Media", mean: "Artwork combining more than one medium, encouraging experimentation." },
      { term: "Makery", mean: "Senior School design space using tech and traditional art for interdisciplinary challenges." },
      { term: "Design Thinking", mean: "Problem-solving process: Empathise, Define, Ideate, Prototype, Test." }
    ],
    quickTips: [
      { text: "Post 'The process is the product' visibly in your studio to shift mindsets." },
      { text: "Start units with a 5-minute 'free exploration' of materials before instruction." },
      { text: "Narrate your own creative thinking aloud when demonstrating techniques." },
      { text: "Connect every unit to a cultural or historical context for deeper meaning." },
      { text: "Photograph work at multiple stages (start/middle/finish) as evidence of growth." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_visualarts_curriculum");
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
        settingKey="page_learning_visualarts_curriculum"
        initialData={data}
        onSave={setData}
        title="Visual Arts Curriculum Overview"
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
            key: "coreAreas", 
            label: "Core Learning Areas", 
            type: "list",
            itemFields: [
              { key: "name", label: "Area Name", type: "input" },
              { key: "desc", label: "Description", type: "textarea" }
            ]
          },
          { key: "section_progression", label: "Progression & Scope", type: "section" },
          { 
            key: "progression", 
            label: "Phase Progression", 
            type: "list",
            itemFields: [
              { key: "phase", label: "Phase", type: "input" },
              { key: "focus", label: "Focus", type: "textarea" },
              { key: "experiences", label: "Key Experiences", type: "textarea" }
            ]
          },
          { 
            key: "scope", 
            label: "Scope & Sequence", 
            type: "list",
            itemFields: [
              { key: "grade", label: "Grade Band", type: "input" },
              { key: "focus", label: "Focus Areas", type: "textarea" }
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
                <PaintBrush size={200} weight="fill" />
             </div>
             <div className="relative z-10 max-w-4xl">
               <p className="text-xl text-slate-300 font-medium leading-relaxed">
                 {data.rationale}
               </p>
             </div>
          </div>
        </section>

        {/* Core Learning Areas */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Compass className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Content</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">CORE LEARNING AREAS</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.coreAreas.map((area, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <h4 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors">{area.name}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Three-Phase Progression */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendUp className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Development</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">THREE-PHASE PROGRESSION</h3>
            </div>
          </div>

          <div className="grid gap-6">
            {data.progression.map((row, idx) => (
              <div key={idx} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-primary/20 transition-all flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">PHASE</span>
                    <h4 className="text-xl font-black text-slate-800">{row.phase}</h4>
                 </div>
                 <div className="md:w-1/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">FOCUS</span>
                    <p className="text-sm font-bold text-slate-600">{row.focus}</p>
                 </div>
                 <div className="md:w-2/4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">KEY EXPERIENCES</span>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{row.experiences}</p>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scope & Sequence */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Pentagon className="w-6 h-6" weight="duotone" />
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
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Content & Skill Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.scope.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-800 whitespace-nowrap">{row.grade}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600 leading-relaxed">{row.focus}</td>
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

export default VisualArtsCurriculumOverviewPage;

