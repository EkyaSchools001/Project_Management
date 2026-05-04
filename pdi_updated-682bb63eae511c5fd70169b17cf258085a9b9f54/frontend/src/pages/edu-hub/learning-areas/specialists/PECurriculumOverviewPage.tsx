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
  Heart,
  SneakerMove,
  UsersThree,
  Compass,
  ArrowRight,
  Barbell,
  FirstAid,
  Trophy
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const PECurriculumOverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "Physical Education",
    italicTitle: "Curriculum",
    heroDesc: "Promoting lifelong health, movement competence, and sportsmanship through a comprehensive PE programme.",
    introText: "This handout supports Physical Education teachers at Ekya Schools in understanding and navigating the Curriculum Overview for the PE Learning Area. The PE programme introduces students to fitness, movement competence, safety and participation in activities that promote overall well-being.",
    rationale: "The PE programme at Ekya Schools equips learners to develop physical, emotional and social skills transferable to everyday life. Students understand their own body's capabilities, develop confidence, and take personal responsibility for lifelong health through a range of sports and activities.",
    aspects: [
      { name: "Strength & Conditioning", icon: "💪", desc: "Develops every area of the body and improves the way a child moves. Training includes mind, mobility, stability, strength, endurance, power, speed and agility." },
      { name: "Skills & Sportsmanship", icon: "🏅", desc: "Developing movement skills and positive sportsmanship attitudes through team sports (basketball, football) and individual activities (swimming, yoga)." },
      { name: "Safety, Nutrition & Wellbeing", icon: "❤️", desc: "Focuses on personal safety, field etiquette, and the relationship between nutrition and performance. Building habits for lifelong wellness." }
    ],
    activities: [
      { category: "Team Sports", list: "Basketball, Throwball, Cricket, Football: focusing on tactical thinking, communication and collaborative play." },
      { category: "Individual Activities", list: "Swimming, Athletics, Yoga & Stretching, Roller Skating, Chess, Table Tennis: building personal focus and individual skill." },
      { category: "Strength & Conditioning", list: "Guided warm-up/cool-down; mobility and stability; agility and speed drills; climbing wall (where available)." },
      { category: "Motor Skills & Rhythm", list: "Fine and gross motor development; rhythm and coordination; movement to music; spatial awareness." },
      { category: "Outdoor & Adventure", list: "Activities that develop body awareness, risk assessment, confidence and resilience in varied environments." }
    ],
    scope: [
      { grade: "Early Years", focus: "Body awareness; fundamental patterns; spatial exploration; cooperative games; safe play routines." },
      { grade: "Grades 1–2", focus: "Locomotor and non-locomotor movements; balance; team games with simple rules; yoga routines." },
      { grade: "Grades 3–4", focus: "Skill development in specific sports (basketball, throwball); agility work; nutrition basics; sportsmanship." },
      { grade: "Grades 5–6", focus: "Team tactics and strategies; fitness goals; swimming and individual sports; emotional regulation." },
      { grade: "Grades 7–8", focus: "Advanced sports skills; conditioning programmes; health-related fitness concepts; leadership." },
      { grade: "Grades 9–12", focus: "Independent fitness management; sports leadership; stress management through movement; lifelong active living." }
    ],
    dos: [
      { text: "Begin every PE lesson with a structured warm-up and end with a cool-down: this is non-negotiable for safety." },
      { text: "Teach safety and etiquette explicitly: field rules, equipment handling and respectful behaviour." },
      { text: "Connect physical activity to health knowledge: explain the 'why' behind warming up or stretching." },
      { text: "Differentiate : adapt activities so students of all abilities can participate meaningfully." },
      { text: "Use the Language of wellbeing: prompt students to notice how their body feels." },
      { text: "Celebrate effort and improvement, not just winning: reward a growth mindset." },
      { text: "Check equipment safety before every lesson : never proceed with unsafe surfaces or gear." },
      { text: "Focus on lifelong health habits : not just competitive sports performance." }
    ],
    donts: [
      { text: "Do not use PE time as free play without structure : tie every lesson to learning intentions." },
      { text: "Do not use physical activity as punishment (e.g., laps for being late) : it creates negative associations." },
      { text: "Do not make fitness assessments purely competitive : assess against personal progress." },
      { text: "Do not ignore the emotional safety of students who find physical activity challenging." },
      { text: "Do not allow students to opt out without a documented reason : inclusive PE is a curriculum right." },
      { text: "Do not plan without referring to the C&I Platform Master Map." }
    ],
    glossary: [
      { term: "Movement Competence", mean: "The ability to move effectively and confidently across locomotor, stability and manipulative movements." },
      { term: "Strength & Conditioning", mean: "Training approach focusing on mobility, stability, strength, power and agility." },
      { term: "Sportsmanship", mean: "Attitudes reflecting fair play, respect for opponents/officials, and graciousness in victory or defeat." },
      { term: "Warm-Up / Cool-Down", mean: "Activities at the start and end of a session to prepare the body and promote recovery." },
      { term: "Motor Skills", mean: "Physical skills involving large muscle groups (gross) or precise movements (fine)." },
      { term: "Lifelong Wellness", mean: "Sustainable habits of activity, nutrition, and emotional wellbeing." }
    ],
    quickTips: [
      { text: "Open every lesson by telling students what SKILL they will develop, not just what activity they will do." },
      { text: "Teach the warm-up deliberately so students understand its role in injury prevention." },
      { text: "Make nutrition conversations routine : check in on water and food intake before class." },
      { text: "Differentiate visually using coloured bibs or modified rules to include all ability levels." },
      { text: "Document progress with quick observational notes against the unit's movement skill focus." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_pe_curriculum");
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
        settingKey="page_learning_pe_curriculum"
        initialData={data}
        onSave={setData}
        title="Physical Education Curriculum Overview"
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
            key: "aspects", 
            label: "Curriculum Aspects", 
            type: "list",
            itemFields: [
              { key: "name", label: "Aspect Name", type: "input" },
              { key: "icon", label: "Emoji Icon", type: "input" },
              { key: "desc", label: "Description", type: "textarea" }
            ]
          },
          { key: "section_activities", label: "Activities & Scope", type: "section" },
          { 
            key: "activities", 
            label: "Sports Categories", 
            type: "list",
            itemFields: [
              { key: "category", label: "Category", type: "input" },
              { key: "list", label: "Activities List", type: "textarea" }
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
              <Heart className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Philosophy</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">PROGRAMME RATIONALE</h3>
            </div>
          </div>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Barbell size={200} weight="fill" />
             </div>
             <div className="relative z-10 max-w-4xl">
               <p className="text-xl text-slate-300 font-medium leading-relaxed">
                 {data.rationale}
               </p>
             </div>
          </div>
        </section>

        {/* Key Curriculum Aspects */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ListChecks className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Focus Areas</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">KEY CURRICULUM ASPECTS</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.aspects.map((item, idx) => (
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

        {/* Sports & Activities Offered */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Compass className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Provision</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">SPORTS & ACTIVITIES</h3>
            </div>
          </div>

          <div className="grid gap-6">
            {data.activities.map((item, idx) => (
              <div key={idx} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-primary/20 transition-all flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">CATEGORY</span>
                    <h4 className="text-xl font-black text-slate-800">{item.category}</h4>
                 </div>
                 <div className="md:w-2/3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">ACTIVITIES & SPORTS</span>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.list}</p>
                 </div>
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
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Focus Areas in Physical Education</th>
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

export default PECurriculumOverviewPage;

