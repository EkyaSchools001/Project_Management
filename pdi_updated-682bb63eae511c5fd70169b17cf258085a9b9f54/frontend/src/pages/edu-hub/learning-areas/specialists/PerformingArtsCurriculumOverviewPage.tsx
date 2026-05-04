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
  MusicNotes,
  MaskHappy,
  SneakerMove,
  UsersThree,
  Compass,
  ArrowRight,
  Globe,
  Star
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const PerformingArtsCurriculumOverviewPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop",
    mainTitle: "Performing Arts",
    italicTitle: "Curriculum",
    heroDesc: "Empowering students through Dance, Theatre and Music: fostering creative expression and global cultural appreciation.",
    introText: "This handout supports Performing Arts teachers at Ekya Schools in understanding and navigating the Curriculum Overview for Music, Dance and Theatre. The Performing Arts programme offers a comprehensive curriculum that empowers students to develop their creative and expressive abilities.",
    rationale: "The programme offers an enriching experience that empowers students to discover and develop their talents. We focus on creative expression, cultural appreciation, and making connections between arts and other disciplines. Students are encouraged to take ownership and develop self-discipline.",
    disciplines: [
      { name: "Dance", icon: "💃", desc: "Using the body as a medium to communicate through space, time, dynamics and relationships. Focus on movement composition and choreography." },
      { name: "Theatre / Drama", icon: "🎭", desc: "Exploring human experience through live enactment. Collaborative art combining physical, verbal, visual and aural dimensions." },
      { name: "Music", icon: "🎵", desc: "Using concepts of duration, dynamics, form, pitch and timbre to compose, perform and respond using voice, instruments and technology." }
    ],
    integration: [
      { dimension: "Space & Movement", look: "Students use body movement to explore levels, directions and formations: where dance and drama overlap." },
      { dimension: "Pattern & Sound", look: "Recognising rhythm and tempo in music, and motif in dance choreography." },
      { dimension: "Visual & Aural", look: "Exploring costume, staging and lighting alongside dynamics and timbre for whole-performance literacy." },
      { dimension: "Cultural Exploration", look: "Engaging with dance forms and music traditions from diverse cultures worldwide." }
    ],
    scope: [
      { grade: "Early Years", focus: "Exploratory movement; rhythm and rhyme; imaginative play; body awareness." },
      { grade: "Grades 1–2", focus: "Dance elements (space, time); percussion instruments; storytelling through drama." },
      { grade: "Grades 3–4", focus: "Choreography basics; melodic instruments; script reading; cultural traditions." },
      { grade: "Grades 5–6", focus: "Improvisation; music composition; drama conventions (monologue, still image)." },
      { grade: "Grades 7–8", focus: "Performance critique; advanced theory; outbound professional experiences; student-led projects." }
    ],
    dos: [
      { text: "Create a safe, judgement-free studio environment where students feel safe to try and fail." },
      { text: "Name the art form elements explicitly (e.g., dynamics, timbre) in every lesson." },
      { text: "Integrate disciplines where natural connections exist: weave drama, music and movement." },
      { text: "Include cultural contexts for the art forms : know the origin and significance." },
      { text: "Plan for authentic performance experiences, even small class-sharing sessions." },
      { text: "Connect learning to other subjects (e.g., dance patterns and math)." },
      { text: "Check outbound learning opportunities early in the academic year." }
    ],
    donts: [
      { text: "Do not use class as rehearsal time for school events only: the curriculum must drive learning." },
      { text: "Do not assess only the final product : the process of creating and rehearsing is equally important." },
      { text: "Do not skip discipline-specific vocabulary like choreography or monologue." },
      { text: "Do not force performance on students who are not ready; build confidence progressively." },
      { text: "Do not plan in isolation from the C&I Platform Master Map." },
      { text: "Do not neglect the audience role : teach students to be respectful audience members." }
    ],
    glossary: [
      { term: "Elements of Dance", mean: "Space, time, dynamics and relationships: the building blocks of dance." },
      { term: "Drama Conventions", mean: "Techniques like still image, hot seating, role on the wall, and tableau." },
      { term: "Elements of Music", mean: "Duration, dynamics, form, pitch and timbre." },
      { term: "Improvisation", mean: "Spontaneous creation and performance without a pre-planned script or score." },
      { term: "Ensemble", mean: "A group performance requiring students to listen, respond and collaborate in real time." },
      { term: "Choreography", mean: "The art of composing and arranging sequences of movements." }
    ],
    quickTips: [
      { text: "Establish a studio agreement with students for physical and emotional safety." },
      { text: "Plan for 'low-stakes sharing' in every unit to build performance confidence gradually." },
      { text: "Take students to see live professional performances to elevate their sense of possibility." },
      { text: "Document student creative processes with video clips and rehearsal notes for assessment." },
      { text: "Connect units to the school calendar thoughtfully : plan curriculum first, then culminates." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_performingarts_curriculum");
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
    const role = currentUser?.role?.toUpperCase() || "";
    return ["ADMIN", "SUPERADMIN", "TESTER"].includes(role);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 rounded-b-[2.5rem] smooth-scroll overflow-x-hidden">
      <PageEditorControls 
        settingKey="page_learning_performingarts_curriculum"
        initialData={data}
        onSave={setData}
        title="Performing Arts Curriculum Overview"
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
            key: "disciplines", 
            label: "The Three Disciplines", 
            type: "list",
            itemFields: [
              { key: "name", label: "Discipline Name", type: "input" },
              { key: "icon", label: "Emoji Icon", type: "input" },
              { key: "desc", label: "Description", type: "textarea" }
            ]
          },
          { key: "section_integration", label: "Integration & Scope", type: "section" },
          { 
            key: "integration", 
            label: "Integration Dimensions", 
            type: "list",
            itemFields: [
              { key: "dimension", label: "Dimension", type: "input" },
              { key: "look", label: "What it looks like", type: "textarea" }
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
              <MaskHappy className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Philosophy</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">PROGRAMME RATIONALE</h3>
            </div>
          </div>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <MusicNotes size={200} weight="fill" />
             </div>
             <div className="relative z-10 max-w-4xl">
               <p className="text-xl text-slate-300 font-medium leading-relaxed">
                 {data.rationale}
               </p>
             </div>
          </div>
        </section>

        {/* The Three Disciplines */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <UsersThree className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Disciplines</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">DANCE, THEATRE & MUSIC</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.disciplines.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-4">{item.name}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Integration of the Arts */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Compass className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Pedagogy</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">INTEGRATION OF THE ARTS</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.integration.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-primary/20 transition-all">
                <h4 className="text-[10px] font-black text-primary mb-2 uppercase tracking-widest">{item.dimension}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.look}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scope & Sequence */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <SneakerMove className="w-6 h-6" weight="duotone" />
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
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Focus Areas Across Dance, Theatre & Music</th>
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

export default PerformingArtsCurriculumOverviewPage;

