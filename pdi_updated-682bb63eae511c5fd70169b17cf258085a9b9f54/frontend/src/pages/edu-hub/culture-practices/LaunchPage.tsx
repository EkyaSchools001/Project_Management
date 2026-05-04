import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CaretLeft,
  Rocket,
  ListChecks,
  Info,
  CheckCircle,
  XCircle,
  BookOpen,
  Sparkle,
  PencilSimple,
  Lightbulb,
  Quotes
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { PortalBanner } from '@/components/layout/PortalBanner';

const LaunchPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "The",
    italicTitle: "Launch",
    heroDesc: "A short, purposeful closing that sends your students — or your team — out the door with energy, intention, and confidence.",
    introText: "A Launch is a 2–3 minute closing moment at the end of a lesson, the school day, or a staff meeting. It is not a summary or a homework reminder. It is a deliberate, forward-looking message that gives the listener a feeling of momentum — something to carry with them when they leave. Done well, it turns the ordinary act of 'wrapping up' into a moment of genuine inspiration and direction.",
    whyItMatters: "The way you close a session is what people remember. A launch anchors the purpose of what happened, names what comes next, and leaves the listener in an active, positive state of mind rather than a passive or indifferent one. For teachers, it is one of the most underused tools in the instructional day.",
    differentiation: "For Early Years and Grades 1–3: keep the Launch to one sentence — warm, simple, and connected to something concrete from the day. Use a gesture or a class call-and-response to close.\n\nFor Grades 4–8: the Launch can include a reflective question or a challenge: 'Tonight, notice one moment where you felt curious. Come ready to share tomorrow.'\n\nFor Grades 9–12 and staff meetings: the Launch can quote a thinker, name a tension to sit with, or present an open question — something that keeps the thinking going after the room empties.",
    quickTip: "Write your Launch at the top of your lesson plan, not the bottom. When it is the first thing you see, it shapes the arc of everything that comes before it.",
    exampleQuote: "You are not just teaching content. You are teaching someone how to show up in the world.",
    exampleDesc: "Every lesson you deliver — whether it lands perfectly or not — is a deposit into who your students are becoming. Walk out of this room knowing that what you do here matters. Go make it count.",
    processSteps: [
      { text: "Signal the close clearly: 'Before we finish, I want to leave you with something.' This shift in tone tells students to listen differently." },
      { text: "Name the 'what': Connect the Launch to what happened — the learning, the conversation, the decision made in the meeting." },
      { text: "Add the 'so what': Say why it matters beyond today. What will carrying this thought forward actually change?" },
      { text: "Give a specific action or intention: One thing they can do, try, notice, or ask today. Keep it concrete and achievable." },
      { text: "Close with energy: Deliver the final line standing still, looking at the group, with genuine warmth. Do not rush it." },
      { text: "Let it land: After the final line, pause for two seconds before dismissing. The silence is part of the message." }
    ],
    dos: [
      { text: "Write your Launch before the session begins — treat it as the destination you are moving toward" },
      { text: "Keep it under 3 minutes — brevity is part of the power" },
      { text: "Make eye contact with the group, not with your notes" },
      { text: "Connect it to something real that happened in the lesson or meeting" },
      { text: "Use it consistently — students and colleagues begin to anticipate and value it" }
    ],
    donts: [
      { text: "Don't use the Launch to give instructions or homework — that belongs elsewhere" },
      { text: "Don't wing it — improvised closings rarely land with the same power" },
      { text: "Don't trail off — the final line must be your strongest, most deliberate sentence" },
      { text: "Don't rush it when you're short on time — shorten it, but never skip it" },
      { text: "Don't repeat the same Launch — vary tone, theme, and style to keep it fresh" }
    ],
    glossary: [
      { term: "Launch", mean: "A 2–3 minute purposeful closing at the end of a lesson, day, or meeting — designed to send the listener forward with energy and intention." },
      { term: "Forward-looking", mean: "Oriented toward what comes next rather than summarising what already happened." },
      { term: "Intention", mean: "A clear, chosen focus or action that the listener carries into the next part of their day." },
      { term: "Anchor", mean: "To connect a feeling, insight, or message to something concrete so it is remembered." },
      { term: "Momentum", mean: "The sense of forward movement and purpose that a well-delivered Launch creates." }
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
        const result = await settingsService.getSetting("page_culture_launch");
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
        settingKey="page_culture_launch"
        initialData={data}
        onSave={setData}
        title="Launch Content"
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
          { key: "whyItMatters", label: "Why It Matters", type: "textarea" },
          { key: "differentiationSubtitle", label: "Differentiation Subtitle", type: "input" },
          { key: "differentiationTitle", label: "Differentiation Title", type: "input" },
          { key: "differentiation", label: "Differentiation Text", type: "textarea" },
          { key: "quickTipTitle", label: "Quick Tip Title", type: "input" },
          { key: "quickTip", label: "Quick Tip Text", type: "textarea" },
          { key: "section_example", label: "Today's Launch Example", type: "section" },
          { key: "exampleQuote", label: "Example Quote", type: "textarea" },
          { key: "exampleDesc", label: "Example Description", type: "textarea" },
          { key: "section_lists", label: "Process & Rules", type: "section" },
          { key: "processSubtitle", label: "Process Subtitle", type: "input" },
          { key: "processTitle", label: "Process Title", type: "input" },
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
          { key: "glossarySubtitle", label: "Glossary Subtitle", type: "input" },
          { key: "glossaryTitle", label: "Glossary Title", type: "input" },
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
        title={`${data.mainTitle} ${data.italicTitle}`}
        subtitle={data.heroDesc}
        icon={Rocket}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        
        className="mt-6 mb-16"
      />


      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">

        {/* What This Is & Why It Matters */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Info className="w-6 h-6" weight="duotone" />
              </div>
              <div>
                <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.overviewSubtitle || "Overview"}</h2>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.overviewTitle || "WHAT THIS IS"}</h3>
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-primary/10 relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                {data.introText}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Lightbulb className="w-6 h-6" weight="duotone" />
              </div>
              <div>
                <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Impact</h2>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">WHY IT MATTERS</h3>
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-primary/10 relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                {data.whyItMatters}
              </p>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ListChecks className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.processSubtitle || "Delivery Guide"}</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.processTitle || "HOW TO DELIVER"}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.processSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex-none w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary font-black text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Launch Example */}
        <section className="animate-in fade-in zoom-in duration-700">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Rocket size={300} weight="fill" />
            </div>

            <div className="relative z-10 max-w-4xl space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <Quotes size={24} weight="fill" />
                </div>
                <h2 className="text-sm font-black text-primary tracking-[0.4em] uppercase">Today's Launch</h2>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl md:text-5xl font-black italic tracking-tight leading-tight">
                  "{data.exampleQuote}"
                </h3>
                <div className="h-1.5 w-24 bg-primary rounded-full" />
                <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-3xl">
                  {data.exampleDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Differentiation */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkle className="w-6 h-6" weight="duotone" />
            </div>
            <div>
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.differentiationSubtitle || "Tailored Experiences"}</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.differentiationTitle || "DIFFERENTIATION"}</h3>
            </div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 text-primary">
              <Sparkle size={200} weight="fill" />
            </div>
            <div className="relative z-10 max-w-5xl whitespace-pre-line">
              <p className="text-xl text-slate-600 font-medium leading-relaxed">
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
                  <div key={idx} className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex gap-4">
                    <span className="text-emerald-500 font-black text-lg">✓</span>
                    <p className="text-sm font-semibold text-slate-700">{item.text}</p>
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
                  <div key={idx} className="p-6 bg-rose-50/50 rounded-2xl border border-rose-100 flex gap-4">
                    <span className="text-rose-500 font-black text-lg">✗</span>
                    <p className="text-sm font-semibold text-slate-700">{item.text}</p>
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
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.glossarySubtitle || "Terminology"}</h2>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">{data.glossaryTitle || "GLOSSARY"}</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Word</th>
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
              <Lightbulb className="w-10 h-10 text-amber-500" weight="fill" />
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-black text-amber-600 uppercase tracking-widest flex items-center gap-3">
                {data.quickTipTitle || "Quick Tip"}
              </h4>
              <p className="text-lg font-bold text-slate-700 leading-relaxed italic">
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

export default LaunchPage;
