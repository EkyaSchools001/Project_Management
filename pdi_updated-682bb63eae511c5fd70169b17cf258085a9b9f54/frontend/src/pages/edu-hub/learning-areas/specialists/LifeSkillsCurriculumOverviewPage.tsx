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
  Brain,
  Globe,
  UsersThree,
  Compass,
  ArrowRight,
  Notebook,
  Smiley,
  Wind,
  TreeStructure,
  TrendUp
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { sanitizeContent } from "@/utils/contentSanitizer";

const LifeSkillsCurriculumOverviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "Life Skills",
    italicTitle: "Curriculum",
    heroDesc: "Empowering students through Social, Emotional and Ethical (SEE) Learning based on the Emory University framework.",
    introText: "This handout supports Life Skills teachers at Ekya Schools in understanding and navigating the Curriculum Overview for the Life Skills Learning Area. The Ekya Life Skills programme is grounded in the Social, Emotional and Ethical (SEE) Learning curriculum from Emory University: a research-based framework that promotes compassion, ethics and social responsibility.",
    rationale: "The Life Skills programme aims to help students become aware, compassionate and engaged by enabling them to gain self-awareness, cultivate emotional hygiene, build self-regulation, and recognise common humanity. At Ekya, we believe education should empower students to become thoughtful members of society.",
    pillars: [
      { name: "Awareness", icon: "🧠", desc: "The first step towards personal growth. Students develop awareness of their own thoughts, feelings and actions, and those of others." },
      { name: "Compassion", icon: "❤️", desc: "The heart of the programme. Students learn to be more empathetic and understanding: to act with kindness and generosity." },
      { name: "Engagement", icon: "🌍", desc: "Students learn to be more engaged with the world and take an active role in making positive change as leaders in their communities." }
    ],
    practices: [
      { tool: "One-Minute Practices", purpose: "Short mindfulness exercises (breathing, body scan) to manage stress and re-centre at any time of the school day." },
      { tool: "Help-Now Strategies", purpose: "Immediate coping strategies students can use when feeling overwhelmed or anxious in the classroom and beyond." },
      { tool: "FIND Journal", purpose: "Private tool for self-reflection and emotional expression. A non-assessed space for students to reflect meaningfully." },
      { tool: "SEE Learning", purpose: "Structured lesson sequence covering attention, self-compassion, compassion for others, and systems thinking." },
      { tool: "Resiliency Practices", purpose: "Strategies to help students manage stress and overcome challenges, taught as a skill built through practice." }
    ],
    scope: [
      { grade: "Early Years", focus: "Body awareness; naming emotions; simple kindness; mindful breathing; community belonging." },
      { grade: "Grades 1–2", focus: "Understanding emotions; calming strategies; making kind choices; caring for community." },
      { grade: "Grades 3–4", focus: "Self-regulation; empathy; perspective-taking; resiliency; FIND Journal begins." },
      { grade: "Grades 5–6", focus: "Emotional hygiene; social awareness; managing difficult emotions; common humanity." },
      { grade: "Grades 7–8", focus: "Ethics and values; identity; systems thinking; leadership with compassion." },
      { grade: "Grades 9–12", focus: "Ethical discernment; purpose and meaning; civic engagement; wellbeing under pressure." }
    ],
    dos: [
      { text: "Model the practices yourself: participate fully in exercises to lead by example." },
      { text: "Create a psychologically safe environment where feelings shared are respected and confidential." },
      { text: "Protect FIND Journal time: ensure it remains a private space without assessment." },
      { text: "Connect content to real events in students' lives to make it meaningful." },
      { text: "Teach precise emotional vocabulary (e.g., distinguishing 'frustrated' from 'angry')." },
      { text: "Normalise difficult emotions as part of regular emotional hygiene." },
      { text: "Check the room's energy before starting to adjust your response." }
    ],
    donts: [
      { text: "Do not treat Life Skills as a 'soft' add-on: it is as rigorous as academic subjects." },
      { text: "Do not force students to share personal experiences publicly; always make sharing optional." },
      { text: "Do not use Life Skills time to address individual disciplinary issues publicly." },
      { text: "Do not skip mindfulness practices because of time constraints." },
      { text: "Do not assess Life Skills through traditional written tests." },
      { text: "Do not plan without referring to the C&I Platform Master Map." }
    ],
    glossary: [
      { term: "SEE Learning", mean: "Social, Emotional and Ethical Learning framework from Emory University." },
      { term: "Self-Awareness", mean: "Recognising one's own thoughts, feelings, and triggers: the foundation of SEL." },
      { term: "Self-Regulation", mean: "Managing emotions, thoughts and behaviours in different situations." },
      { term: "Common Humanity", mean: "Recognition that all people share fundamental experiences like joy and suffering." },
      { term: "Ethical Discernment", mean: "Ability to reason through dilemmas and make fair, compassionate decisions." },
      { term: "Resiliency", mean: "The capacity to recover from difficulties, taught as a skill built through practice." }
    ],
    quickTips: [
      { text: "Begin every lesson with a one-minute practice to signal a shift in pace and attention." },
      { text: "Check your students' 'window of tolerance' before starting with a quick 2-minute circle check-in." },
      { text: "Protect FIND Journal time absolutely: do not read them without explicit permission." },
      { text: "Model vulnerability by sharing your own use of mindfulness strategies in real life." },
      { text: "Use the end of each term for a 'skills I have' reflection to make learning visible." }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_learning_lifeskills_curriculum");
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
        settingKey="page_learning_lifeskills_curriculum"
        initialData={data}
        onSave={setData}
        title="Life Skills Curriculum Overview"
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
            label: "Three Pillars", 
            type: "list",
            itemFields: [
              { key: "name", label: "Pillar Name", type: "input" },
              { key: "icon", label: "Emoji Icon", type: "input" },
              { key: "desc", label: "Description", type: "textarea" }
            ]
          },
          { key: "section_progression", label: "Practices & Scope", type: "section" },
          { 
            key: "practices", 
            label: "Key Practices", 
            type: "list",
            itemFields: [
              { key: "tool", label: "Tool/Practice", type: "input" },
              { key: "purpose", label: "Purpose & Use", type: "textarea" }
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
                <Brain size={200} weight="fill" />
             </div>
             <div className="relative z-10 max-w-4xl">
               <p className="text-xl text-slate-300 font-medium leading-relaxed">
                 {data.rationale}
               </p>
             </div>
          </div>
        </section>

        {/* The Three Pillars */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TreeStructure className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Core Pillars</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">THE THREE PILLARS</h3>
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

        {/* Key Practices & Strategies */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Compass className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Tools</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">KEY PRACTICES & STRATEGIES</h3>
            </div>
          </div>

          <div className="grid gap-6">
            {data.practices.map((practice, idx) => (
              <div key={idx} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-primary/20 transition-all flex flex-col md:flex-row gap-8">
                 <div className="md:w-1/3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">PRACTICE / TOOL</span>
                    <h4 className="text-xl font-black text-slate-800">{practice.tool}</h4>
                 </div>
                 <div className="md:w-2/3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">PURPOSE & HOW TO USE IT</span>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{practice.purpose}</p>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scope & Sequence */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendUp className="w-6 h-6" weight="duotone" />
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
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Focus Areas in Life Skills</th>
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

export default LifeSkillsCurriculumOverviewPage;

