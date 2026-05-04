import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CaretLeft,
  Medal,
  ListChecks,
  Info,
  CheckCircle,
  XCircle,
  BookOpen,
  Lightbulb,
  Sparkle,
  PencilSimple,
  Trophy
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { PortalBanner } from '@/components/layout/PortalBanner';

const StudentResponsibilitiesAwardsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1523240715632-99045506af5b?q=80&w=2070&auto=format&fit=crop",
    mainTitle: "Responsibilities &",
    italicTitle: "Rewards",
    heroDesc: "Using badges, chips, and trophies to recognise achievement and build student ownership.",
    introText: "At CMR/Ekya Schools, students earn Responsibility Badges for classroom roles and Reward Badges for individual and group achievements. These recognition systems build confidence, encourage positive behaviour, and create a culture of ownership. Responsibilities rotate fortnightly; rewards are given at monthly Long Assemblies.",
    differentiation: "Responsibility Badges differ by block: Early Years have Crew, Ambassador, and Caregiver; Primary adds Chief Librarian and Class Representative; Middle School adds Academic Representative; Senior School adds mobile phone management and emergency protocol roles. Leadership Badges are for Student Council members in Grades 10 and 12 only.",
    quickTip: "Print and laminate the Responsibility Chart at the start of the year : it saves significant time and ensures all classrooms have a consistent, professional display.",
    processSteps: [
      { text: "Assign Classroom Responsibility Badges at the start of the year, rotating every two weeks by roll number." },
      { text: "Display the Responsibility Chart and Fortnightly Responsibility Holder on the Information Board." },
      { text: "Students wear their badge during their duty period; badges stay in class at day's end." },
      { text: "Award Individual Rewards (ACE Award, Reading Laureate, Astounding Attendance) through the Head of School at Long Assembly." },
      { text: "Distribute Chips (Green/Orange/Blue/Yellow) to students who participate in Outbound, Wrap Around, Deep Dive, or WEP programmes." },
      { text: "Award Group Trophies (Tidy Titans, Super Board, Board of Brilliance, Star Innovator, Club Excellence, House Trophy) on a rolling basis." },
      { text: "CCA Coordinator updates the House Point Tracker; points are added to the relevant house for every individual award." },
      { text: "Collect and return badges and trophies to the CCA Coordinator one week before each Long Assembly." }
    ],
    dos: [
      { text: "Display both the Responsibility Chart and the Responsibility Holder in the classroom" },
      { text: "Reassign duties temporarily when a badge holder is absent" },
      { text: "Submit chips and badges to CCA Coordinator one week before Long Assembly" },
      { text: "Add house points for every award received by a student" },
      { text: "Ensure mid-year joiners are included in the duty rotation in Term 2" }
    ],
    donts: [
      { text: "Don't allow students to take responsibility badges home" },
      { text: "Don't skip rotating duties : every student deserves a turn" },
      { text: "Don't award trophies informally : all awards go through the HoS at Long Assembly" },
      { text: "Don't deduct house points without CCA Coordinator authorisation" },
      { text: "Don't forget that lost badges must be paid for by the student (Rs 175–250)" }
    ],
    glossary: [
      { term: "Responsibility Badge", mean: "A badge worn by a student holding a specific classroom duty role for a two-week period." },
      { term: "Chip", mean: "A collectable wooden token given for participation in school programmes like Outbound trips or WEP." },
      { term: "Rolling Trophy", mean: "A trophy awarded temporarily to a group and returned at the end of the stipulated period." },
      { term: "ACE Award", mean: "Recognition for exemplary Aware, Compassionate, or Engaged actions, nominated by any school member." },
      { term: "Reading Laureate", mean: "A badge for students who meet a reading milestone (books read in 2 months) : top 3 per grade." },
      { term: "House Point Tracker", mean: "A spreadsheet maintained by the CCA Coordinator to record all house points and deductions." }
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
        const result = await settingsService.getSetting("page_culture_student_responsibilities_awards");
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
        settingKey="page_culture_student_responsibilities_awards"
        initialData={data}
        onSave={setData}
        title="Responsibilities & Rewards Content"
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
        icon={Medal}
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
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.processSubtitle || "The Workflow"}</h2>
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
              <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.differentiationSubtitle || "Variations"}</h2>
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
              <Lightbulb className="w-10 h-10 text-amber-500" weight="fill" />
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-black text-amber-600 uppercase tracking-widest flex items-center gap-3">
                {data.quickTipTitle || "Quick Tip"}
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

export default StudentResponsibilitiesAwardsPage;

