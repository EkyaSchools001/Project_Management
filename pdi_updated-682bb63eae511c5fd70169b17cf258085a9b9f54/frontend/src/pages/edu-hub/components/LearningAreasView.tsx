import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEACHING_DATA } from '../data/teacherPortalData';
import { 
  BookOpen, 
  Hash, 
  Flask, 
  Globe, 
  Palette,
  CaretRight,
  CaretDown,
  Monitor,
  FileText,
  Link,
  Info
} from "@phosphor-icons/react";

const GLOBAL_HANDOUTS = [
  {
    id: '01',
    label: '01 - Curriculum Overview',
    items: [
      { title: 'LA Insert : All Learning Areas', desc: 'Programme rationale, key content areas, pedagogy', badge: 'Reference' },
      { title: 'Master Map (C&I Link)', desc: 'Full year unit plans with standards and KUDs', badge: 'Platform' },
      { title: 'Scope & Sequence by LA', desc: 'Year-level content progression plan', badge: 'Guide' },
      { title: 'UbD Framework Guide', desc: 'Understanding by Design : stages 1-4 explained', badge: 'Guide' },
      { title: 'Rubicon Atlas / C&I Platform', desc: 'Direct link to curriculum mapping tool', badge: 'Platform' },
    ]
  },
  {
    id: '02',
    label: '02 - Instructional Practices',
    subtitle: 'Methodology, thinking routines & technology',
    items: [
      { title: 'Instruction Pillar Document', desc: 'Ekya instructional philosophy and approach', badge: 'Reference' },
      { title: 'Thinking Routines Toolkit', desc: 'KWL, 3-2-1, See-Think-Wonder, and more', badge: 'Toolkit' },
      { title: 'Technology Integration Guide', desc: 'How to use Schoology, C&I, Google Workspace & AI', badge: 'Guide' },
      { title: 'Singapore Math (CPA) Guide', desc: 'Concrete-Pictorial-Abstract methodology for Gr 1-6', badge: 'Guide' },
      { title: 'Classroom Management Routines', desc: 'Mindfulness, signals, and routines for an engaged class', badge: 'Guide' },
    ]
  },
  {
    id: '03',
    label: '03 - Assessment Practices',
    subtitle: 'Types, forms, feedback & reporting',
    items: [
      { title: 'Assessment Pillar Document', desc: 'Philosophy, types, and forms of assessment at Ekya', badge: 'Reference' },
      { title: 'AY Assessment Pattern', desc: 'Approved assessment schedule for AY 2025-26 per LA', badge: 'Policy' },
      { title: 'Rubric Template Library', desc: 'Rubrics for all assessment forms', badge: 'Toolkit' },
      { title: 'Feedback & Correction Guide', desc: 'How to give meaningful, growth-oriented feedback', badge: 'Guide' },
      { title: 'Schoology Gradebook Guide', desc: 'Recording, reporting, and managing scores on Schoology', badge: 'Platform' },
      { title: 'Mark Register Template', desc: 'Standardised assessment/mark register format', badge: 'Template' },
    ]
  },
  {
    id: '04',
    label: '04 - Lesson Planning',
    subtitle: 'C&I, Microplan, Toolkit & Schoology',
    items: [
      { title: 'Accessing Curriculum on C&I', desc: 'Step-by-step guide to using C&I for planning', badge: 'Guide' },
      { title: 'Microplan Template', desc: 'Pre-designed template on C&I Week Planner', badge: 'Template' },
      { title: 'AI Microplanning Guide', desc: 'Using PowerBuddy & AI tools to draft microplans', badge: 'Guide' },
      { title: 'Academic Year Calendar', desc: 'Key dates, term boundaries, and assessment windows', badge: 'Reference' },
      { title: 'LA Toolkit (per subject)', desc: 'Strategies, thinking tools, unit planning resources', badge: 'Toolkit' },
      { title: 'Coordinator Feedback Process', desc: 'How microplan review and feedback works on C&I', badge: 'Process' },
    ]
  },
  {
    id: '05',
    label: '05 - Making Learning Visible',
    subtitle: 'Notebooking, EOL & visible thinking',
    items: [
      { title: 'Notebooking Policy & Guide', desc: 'Standards for notebooks, correction, and feedback', badge: 'Policy' },
      { title: 'Evidence of Learning Guide', desc: 'How to collect, organize, and link EOL to C&I Stage 4', badge: 'Guide' },
      { title: 'EOL Folder Template (Drive)', desc: 'Google Drive folder structure for documenting EOL', badge: 'Template' },
      { title: 'Thinking Routine Display Guide', desc: 'How to use and display classroom thinking routines', badge: 'Guide' },
      { title: 'Stage 4 Feedback Form (C&I)', desc: 'Post-unit reflection form : linked from the Master Map', badge: 'Form' },
    ]
  },
  {
    id: '06',
    label: '06 - Resources & Materials',
    subtitle: 'Digital, print & professional learning resources',
    items: [
      { title: 'LA Resource Kit Index', desc: "What's in your subject resource kit and how to use it", badge: 'Reference' },
      { title: 'In-House Resource Books', desc: 'Ekya-developed curriculum-aligned resource books', badge: 'Reference' },
      { title: 'Digital Platform Quick Guides', desc: 'Schoology, C&I, Google Workspace : how-to guides', badge: 'Guide' },
      { title: 'PDI PD Calendar & MOOC Access', desc: 'Professional development offerings and course links', badge: 'Platform' },
      { title: 'Vetted External Resources', desc: 'Approved external websites, videos, and tools per LA', badge: 'Reference' },
    ]
  },
  {
    id: '07',
    label: '07 - Board Policies & Procedures',
    subtitle: 'Academic, conduct, and operational guidelines',
    items: [
      { title: 'Ekya Employee Handbook', desc: 'Institutional policies, conduct, and expectations', badge: 'Policy' },
      { title: 'CBSE/ICSE Board Guidelines', desc: 'Board-specific exam guidelines, typology & marking', badge: 'Policy' },
      { title: 'Academic Reporting Calendar', desc: 'Dates for report cards, parent meetings, and submissions', badge: 'Reference' },
      { title: 'Parent Communication Protocol', desc: 'How to communicate with parents through official channels', badge: 'Policy' },
      { title: 'Student Welfare & Safeguarding', desc: 'How to identify, document, and report welfare concerns', badge: 'Policy' },
      { title: 'Leave & Substitution Process', desc: 'Steps to follow when planning leave or cover classes', badge: 'Process' },
    ]
  },
  {
    id: '08',
    label: '08 - Glossary & Help Centre',
    subtitle: 'Key terms, FAQs & support contacts',
    items: [
      { title: 'Master Glossary', desc: 'All key terms and acronyms used at Ekya Schools', badge: 'Reference' },
      { title: 'Frequently Asked Questions', desc: 'Common teacher questions answered by category', badge: 'Guide' },
      { title: 'Support Contacts Directory', desc: 'Who to contact for curriculum, tech, HR, or welfare queries', badge: 'Reference' },
      { title: 'New Teacher Onboarding Guide', desc: 'Getting started at Ekya : platforms, people, and processes', badge: 'Guide' },
      { title: "What's New / Updates", desc: 'Latest policy changes, new resources, and announcements', badge: 'Updates' },
    ]
  },
];

export function LearningAreasView() {
  const navigate = useNavigate();
  const [activeLa, setActiveLa] = useState('cs');
  const [expandedHandout, setExpandedHandout] = useState<string | null>(null);
  const [activeHandout, setActiveHandout] = useState('01');

  const laData = TEACHING_DATA[activeLa as keyof typeof TEACHING_DATA] as any;
  const title = laData?.label || '';

  const laList = [
    { id: 'cs', label: 'Computer Science', icon: Monitor },
    { id: 'hass', label: 'HASS (Social Science)', icon: Globe },
    { id: 'lang', label: 'Languages', icon: BookOpen },
    { id: 'math', label: 'Mathematics', icon: Hash },
    { id: 'science', label: 'Science', icon: Flask },
    { id: 'specialists', label: 'Specialists', icon: Palette },
  ];

  return (
    <div className="border-t border-slate-200 py-8 bg-[#FAF9F6] min-h-[400px]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">

        {/* TOP SECTION: Sidebar + Content */}
        <div className="grid gap-8 lg:grid-cols-4 xl:grid-cols-5">

          {/* VERTICAL SIDEBAR - Subject Areas */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EA104A]/60 px-4">Subject Areas</p>
              <div className="space-y-1">
                {laList.map((la) => (
                  <div key={la.id}>
                    <button
                      onClick={() => {
                        setActiveLa(la.id);
                        setExpandedHandout(null);
                      }}
                      className={`w-full rounded-2xl px-4 py-3.5 text-left transition-all duration-200 flex items-center gap-3 border ${
                        activeLa === la.id
                          ? 'bg-[#EA104A]/10 border-[#EA104A]/20 font-bold text-[#EA104A] shadow-sm'
                          : 'bg-white border-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <la.icon className={`w-5 h-5 flex-shrink-0 ${activeLa === la.id ? 'text-[#EA104A]' : 'text-slate-400'}`} weight={activeLa === la.id ? "fill" : "duotone"} />
                      <span className="text-sm tracking-tight">{la.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="lg:col-span-3 xl:col-span-4">
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Header Card */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 mb-6">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Official Curriculum</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">{title}</h3>
                  <p className="mt-4 text-slate-500 font-medium max-w-2xl text-base leading-relaxed">
                    {laData?.desc || "Empowering educators with world-class curriculum resources, assessment frameworks, and pedagogical strategies designed for intentional teaching."}
                  </p>
                </div>
              </div>

              {/* Handouts Grid */}
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 pb-8">
                {[...(laData?.stages?.[0]?.curriculum || []), ...(laData?.stages?.[0]?.assessment || [])].map((item: string) => {
                  const nested = laData?.stages?.[0]?.nestedHandouts?.[item];
                  const isExpanded = expandedHandout === item;

                  return (
                    <div key={item} className="flex flex-col gap-2">
                      <div
                        onClick={() => {
                          const link = laData?.stages?.[0]?.handoutLinks?.[item];
                          if (link) {
                            navigate(link);
                          } else if (nested) {
                            setExpandedHandout(isExpanded ? null : item);
                          }
                        }}
                        className={`flex items-center justify-between p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                          isExpanded ? 'ring-2 ring-[#EA104A]/20' : 'hover:-translate-y-1'
                        }`}
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-inner border ${
                            isExpanded ? 'bg-[#EA104A] text-white border-[#EA104A]' : 'bg-slate-50 text-[#EA104A] border-slate-100 group-hover:bg-[#EA104A] group-hover:text-white group-hover:border-[#EA104A]'
                          }`}>
                            <FileText size={24} weight="duotone" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-black text-slate-800 leading-tight tracking-tight uppercase">{item}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeLa}</span>
                          </div>
                        </div>
                        {nested ? (
                          <CaretDown className={`w-5 h-5 text-slate-300 transition-all duration-300 relative z-10 ${isExpanded ? 'rotate-180 text-[#EA104A]' : ''}`} />
                        ) : (
                          <CaretRight className="w-5 h-5 text-slate-300 group-hover:text-[#EA104A] group-hover:translate-x-1 transition-all relative z-10" />
                        )}
                      </div>

                      {/* Sub-buttons */}
                      {isExpanded && nested && (
                        <div className="ml-8 space-y-2 animate-in slide-in-from-top-2 duration-300">
                          {nested.map((sub: string) => (
                            <div
                              key={sub}
                              className="flex items-center justify-between p-5 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-[#EA104A]/30 transition-all duration-200 cursor-pointer group/sub"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-[#EA104A] shadow-sm group-hover/sub:bg-[#EA104A] group-hover/sub:text-white transition-all">
                                  <FileText size={16} weight="bold" />
                                </div>
                                <span className="text-xs font-bold text-slate-700 tracking-tight uppercase">{sub}</span>
                              </div>
                              <CaretRight className="w-4 h-4 text-slate-300 group-hover/sub:translate-x-1 group-hover/sub:text-[#EA104A] transition-all" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Global Handouts aligned side-by-side */}
        <div className="mt-10 border-t border-slate-200/80 pt-8">
          <div className="grid gap-8 lg:grid-cols-4 xl:grid-cols-5">

            {/* Left: Global Handouts category buttons */}
            <div className="lg:col-span-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EA104A]/60 px-4 mb-3">
                Global Handouts : {laList.find(la => la.id === activeLa)?.label || activeLa}
              </p>
              <div className="space-y-1">
                {GLOBAL_HANDOUTS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setActiveHandout(h.id)}
                    className={`w-full rounded-2xl px-4 py-3.5 text-left transition-all duration-200 flex items-center gap-3 border ${
                      activeHandout === h.id
                        ? 'bg-[#EA104A]/10 border-[#EA104A]/20 font-bold text-[#EA104A] shadow-sm'
                        : 'bg-white border-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <FileText className={`w-5 h-5 flex-shrink-0 ${activeHandout === h.id ? 'text-[#EA104A]' : 'text-slate-400'}`} weight={activeHandout === h.id ? 'fill' : 'duotone'} />
                    <span className="text-sm tracking-tight">{h.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Sub-items for selected Global Handout */}
            <div className="lg:col-span-3 xl:col-span-4 pb-20">
              {(() => {
                const selected = GLOBAL_HANDOUTS.find(h => h.id === activeHandout);
                if (!selected) return null;
                return (
                  <div className="animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-5 h-5 text-[#EA104A]" weight="fill" />
                      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{selected.label}</h3>
                    </div>
                    {selected.items.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {selected.items.map((item, idx) => (
                          <button
                            key={idx}
                            className="flex items-start gap-4 p-6 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#EA104A] group-hover:border-[#EA104A] transition-all duration-200">
                              {item.badge === 'Platform' ? (
                                <Link className="w-5 h-5 text-[#EA104A] group-hover:text-white transition-colors" weight="duotone" />
                              ) : (
                                <FileText className="w-5 h-5 text-[#EA104A] group-hover:text-white transition-colors" weight="duotone" />
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-[#EA104A] transition-colors">{item.title}</h4>
                              <p className="text-xs text-slate-500 mt-1 leading-snug">{item.desc}</p>
                              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                item.badge === 'Reference' ? 'text-purple-600 bg-purple-50' :
                                item.badge === 'Platform' ? 'text-orange-600 bg-orange-50' :
                                item.badge === 'Policy' ? 'text-red-600 bg-red-50' :
                                item.badge === 'Template' ? 'text-blue-600 bg-blue-50' :
                                item.badge === 'Form' ? 'text-blue-600 bg-blue-50' :
                                item.badge === 'Process' ? 'text-red-600 bg-red-50' :
                                item.badge === 'Toolkit' ? 'text-pink-600 bg-pink-50' :
                                item.badge === 'Updates' ? 'text-purple-600 bg-purple-50' :
                                'text-green-600 bg-green-50'
                              }`}>{item.badge}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-40 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
                        <p className="text-sm font-bold">Content coming soon</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
