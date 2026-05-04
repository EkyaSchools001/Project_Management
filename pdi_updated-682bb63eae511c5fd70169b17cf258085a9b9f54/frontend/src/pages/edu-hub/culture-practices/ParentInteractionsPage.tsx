import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CaretLeft,
  UsersFour,
  ListChecks,
  Info,
  CheckCircle,
  XCircle,
  BookOpen,
  Lightbulb,
  Sparkle,
  PencilSimple,
  ChatCircleText,
  UserGear,
  Heart
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PortalBanner } from '@/components/layout/PortalBanner';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";

const ParentInteractionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "Parent",
    italicTitle: "Interactions",
    heroDesc: "Building positive parent partnerships that support every student's wellbeing and achievement.",
    introText: "Parent-teacher interactions at Ekya are open, objective, and personal. A structured open-door policy ensures parents can meet teachers regularly. Formal Parent-Teacher Interactions (PTI) are held once per term. All interactions must be documented using the official PTI form and focus primarily on the student's learning, progress, and wellbeing.",
    differentiation: "Block-specific meeting days: Early Years : Mon and Sat (1st & 3rd); Primary (Grades 1–5) : Tue & Thu; Middle Years (Grades 6–8) : Wed & Fri; Senior Years (Grades 9–12) : Mon & Fri. All meetings are held from 3:15–3:45 pm. Emergency meetings can be arranged by calling the school office. Coordinators and HoS are available between 2:00–3:00 pm on working days.",
    quickTip: "Prepare a 'Student Success Summary' before each PTI : 2 strengths, 1 concern, and 1 specific strategy : this keeps you structured, positive, and parent-focused even in challenging conversations.",
    processSteps: [
      { text: "Parents can meet teachers on designated days and times (block-specific schedules : see table)." },
      { text: "Parents must write in the school diary or on Schoology at least a day in advance to book an appointment." },
      { text: "A circular informing parents about the formal PTI must go out at least 10 days before the meeting." },
      { text: "During the conference: create a welcoming environment, open with positives about the child." },
      { text: "Discuss progress, growth, and concerns (if any); provide strategies to support learning and social issues." },
      { text: "Follow up: send the documented interaction summary to the parent's email after the meeting." },
      { text: "Document every interaction in the PTI form : include parent email address." },
      { text: "For Grades 9–12: HoS meets parents separately during the year to discuss academic progress, behaviour, and college planning." }
    ],
    dos: [
      { text: "Open every conference with a genuine positive about the child" },
      { text: "Keep the focus on learning, growth, and student wellbeing" },
      { text: "Document every interaction : no exceptions" },
      { text: "Send the interaction summary to the parent's email after the meeting" },
      { text: "Follow up on action points committed during the conference" }
    ],
    donts: [
      { text: "Don't meet parents without a prior appointment except in emergencies" },
      { text: "Don't deliver only bad news : balance concerns with strengths and strategies" },
      { text: "Don't skip documentation : the PTI form is a legal and professional record" },
      { text: "Don't hold parent meetings during instructional time" },
      { text: "Don't make promises you cannot keep : be honest about limitations and escalate where needed" }
    ],
    glossary: [
      { term: "PTI (Parent-Teacher Interaction)", mean: "A structured meeting between a parent and teacher to discuss the student's academic progress, behaviour, and wellbeing." },
      { term: "Open-Door Policy", mean: "Ekya's commitment to making teachers and leadership available to parents on designated days and times." },
      { term: "PTI Form", mean: "The official document used to record the details and outcomes of every parent-teacher interaction." },
      { term: "Schoology", mean: "The school's online learning management system, used for communication, assignments, and parent messages." },
      { term: "HoS (Head of School)", mean: "The Principal : responsible for meeting senior school parents and managing complex family concerns." }
    ],

    overviewSubtitle: "Overview",
    overviewTitle: "WHAT THIS IS",
    processSubtitle: "The Workflow",
    processTitle: "PROCESS STEPS",
    differentiationSubtitle: "Variations",
    differentiationTitle: "DIFFERENTIATION",
    bestPracticesSubtitle: "Best Practices",
    bestPracticesTitle: "DO'S AND DON'TS",
    glossarySubtitle: "Terminology",
    glossaryTitle: "GLOSSARY",
    quickTipTitle: "Quick Tip",
    customSections: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_culture_parent_interactions");
        if (result && result.value) {
          setData(prev => ({ ...prev, ...result.value }));
        }
      } catch (error) {
        console.error("Failed to fetch content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const role = (user?.role || "").toUpperCase();
    const allowedRoles = ["ADMIN", "SUPERADMIN", "TESTER", "MANAGEMENT", "MANAGER", "LEADER", "COORDINATOR", "HEAD", "PRINCIPAL"];
    const isAllowed = allowedRoles.some(r => role.includes(r));
    return isAllowed;
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 rounded-b-[2.5rem] smooth-scroll">
      <PageEditorControls
        settingKey="page_culture_parent_interactions"
        initialData={data}
        onSave={setData}
        title="Parent Interactions Content"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroImage", label: "Hero Background Image", type: "image" },
          { key: "mainTitle", label: "Main Title", type: "input" },
          { key: "italicTitle", label: "Italic Title", type: "input" },
          { key: "heroDesc", label: "Hero Description", type: "textarea" },
          { key: "section_intro", label: "Introduction", type: "section" },
          { key: "overviewSubtitle", label: "Overview Subtitle", type: "input" },
          { key: "overviewTitle", label: "Overview Title", type: "input" },
          { key: "introText", label: "Intro Paragraph", type: "textarea" },
          { key: "differentiationSubtitle", label: "Differentiation Subtitle", type: "input" },
          { key: "differentiationTitle", label: "Differentiation Title", type: "input" },
          { key: "differentiation", label: "Differentiation Text", type: "textarea" },
          { key: "quickTipTitle", label: "Quick Tip Title", type: "input" },
          { key: "quickTip", label: "Quick Tip Text", type: "textarea" },
          { key: "section_lists", label: "Process & Rules", type: "section" },
          {
            key: "processSteps",
            label: "Process Steps",
            type: "list",
            itemFields: [{ key: "text", label: "Step Text", type: "textarea" }]
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
          { key: "section_custom", label: "Custom Sections", type: "section" },
          {
            key: "customSections",
            label: "Add New Sections",
            type: "list",
            itemFields: [
              { key: "title", label: "Section Title", type: "input" },
              { key: "image", label: "Section Image", type: "image" },
              { key: "content", label: "Section Content", type: "textarea" }
            ]
          }
        ]}
      />


      <PortalBanner 
        title={`${data.mainTitle} ${data.italicTitle || ''}`}
        subtitle={data.heroDesc}
        icon={Heart}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        className="mt-6 mb-16"
      />


      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">

        {/* What This Is */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Info className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.overviewSubtitle || "Overview"}</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.overviewTitle || "WHAT THIS IS"}</h3>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              {data.introText}
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ListChecks className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.processSubtitle || "Interaction Flow"}</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.processTitle || "PROCESS STEPS"}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.processSteps.map((step, idx) => (
              <div key={idx} className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex-none w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary font-black text-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Differentiation */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkle className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.differentiationSubtitle || "Block Schedules"}</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.differentiationTitle || "DIFFERENTIATION"}</h3>
            </div>
          </div>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Sparkle size={200} weight="fill" />
            </div>
            <div className="relative z-10 max-w-4xl">
              <p className="text-xl text-slate-300 font-medium leading-relaxed">
                {data.differentiation}
              </p>
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
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.bestPracticesSubtitle || "Best Practices"}</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.bestPracticesTitle || "DO'S AND DON'TS"}</h3>
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
              <UserGear className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Terminology</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">GLOSSARY</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Term</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">What it means</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.glossary.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <span className="font-bold text-slate-800">{item.term}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.mean}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Tip */}
        <section className="animate-in fade-in zoom-in duration-700">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2.5rem] p-10 md:p-16 border border-amber-200/50 flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center flex-none">
              <ChatCircleText className="w-10 h-10 text-amber-500" weight="fill" />
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-black text-amber-600 uppercase tracking-widest flex items-center gap-3">
                Quick Tip
              </h4>
              <p className="text-lg font-medium text-slate-700 leading-relaxed italic">
                {data.quickTip}
              </p>
            </div>
          </div>
        </section>


        {/* Custom Sections */}
        {data.customSections && data.customSections.map((section, idx) => (
          <section key={'custom-' + idx} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkle className="w-6 h-6" weight="duotone" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{section.title}</h3>
              </div>
            </div>

            {section.image && (
              <div className="mb-8 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm">
                <img src={section.image} alt={section.title || 'Custom Section Image'} className="w-full h-[400px] object-cover" />
              </div>
            )}

            {section.content && (
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
                <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            )}
          </section>
        ))}

      </div>
    </div>
  );
};

export default ParentInteractionsPage;

