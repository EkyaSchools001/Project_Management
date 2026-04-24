import { useState } from 'react';
import { TEACHING_DATA, SECTIONS, SECTION_LABELS } from '../data/teacherPortalData';
import { 
  BookOpen, 
  Hash, 
  Flask, 
  Globe, 
  Barbell, 
  Palette,
  CaretRight,
  CaretDown
} from "@phosphor-icons/react";

export function LearningAreasView() {
  const [activeLa, setActiveLa] = useState('lang');
  const [activeSub, setActiveSub] = useState('english');
  const [activeSection, setActiveSection] = useState(0);

  const laData = TEACHING_DATA[activeLa as keyof typeof TEACHING_DATA];
  const hasSubs = laData?.subIds && laData.subIds.length > 0;

  let stages: any[] = [];
  let title = '';

  if (hasSubs && activeSub) {
    const subData = laData?.subjectData?.[activeSub];
    stages = subData?.stages || [];
    title = subData?.label || '';
  } else {
    stages = laData?.stages || [];
    title = laData?.label || '';
  }

  const laList = [
    { id: 'lang', label: 'Languages', icon: BookOpen },
    { id: 'math', label: 'Mathematics', icon: Hash },
    { id: 'science', label: 'Science', icon: Flask },
    { id: 'humanities', label: 'Social Sciences', icon: Globe },
    { id: 'pe', label: 'Physical Education', icon: Barbell },
    { id: 'arts', label: 'Visual Arts', icon: Palette }
  ];

  return (
    <div className="border-t border-slate-200 px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Learning areas</p>
              <div className="space-y-1">
                {laList.map((la) => (
                  <div key={la.id}>
                    <button
                      onClick={() => {
                        setActiveLa(la.id);
                        setActiveSub(TEACHING_DATA[la.id as keyof typeof TEACHING_DATA]?.subIds?.[0] || '');
                        setActiveSection(0);
                      }}
                      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-3 ${
                        activeLa === la.id
                          ? 'bg-primary/10 font-bold text-primary shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <la.icon className={`w-5 h-5 ${activeLa === la.id ? 'text-primary' : 'text-slate-400'}`} weight={activeLa === la.id ? "fill" : "duotone"} />
                      {la.label}
                    </button>

                    {/* Sub-items */}
                    {activeLa === la.id && TEACHING_DATA[la.id as keyof typeof TEACHING_DATA]?.subIds?.map((subId) => (
                      <button
                        key={subId}
                        onClick={() => {
                          setActiveSub(subId);
                          setActiveSection(0);
                        }}
                        className={`ml-10 mt-1 w-[calc(100%-2.5rem)] rounded-lg px-3 py-1.5 text-left text-xs transition-all ${
                          activeSub === subId
                            ? 'font-bold text-primary bg-primary/5'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {TEACHING_DATA[la.id as keyof typeof TEACHING_DATA]?.subjectData?.[subId]?.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 xl:col-span-4">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">{laData?.desc}</p>
              </div>

              {/* Subject tabs */}
              {hasSubs && laData?.subs && (
                <div className="flex flex-wrap gap-2">
                  {laData.subs.map((sub, idx) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setActiveSub(laData.subIds![idx]);
                        setActiveSection(0);
                      }}
                      className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${
                        activeSub === laData.subIds![idx]
                          ? 'bg-primary text-white shadow-md shadow-primary/20 -translate-y-0.5'
                          : 'border border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:text-primary'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}

              {/* Section tabs */}
              <div className="border-b border-slate-200">
                <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                  {SECTION_LABELS.map((label, idx) => (
                    <button
                      key={label}
                      onClick={() => setActiveSection(idx)}
                      className={`border-b-2 px-1 py-4 text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                        activeSection === idx
                          ? 'border-primary text-primary'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage accordions */}
              <div className="space-y-3 pb-20">
                {stages.map((stage, idx) => {
                  const sectionKey = SECTIONS[activeSection];
                  const items = (stage as any)[sectionKey] || [];

                  return (
                    <details key={stage.id} open={idx === 0} className="group rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:border-primary/20 shadow-sm overflow-hidden">
                      <summary className="flex cursor-pointer items-center justify-between px-6 py-5 transition group-open:bg-slate-50/50">
                        <div className="flex items-center gap-4">
                          <span
                            className="rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm"
                            style={{ backgroundColor: stage.bg, color: stage.color }}
                          >
                            {stage.label}
                          </span>
                          <div>
                            <p className="text-sm font-black text-slate-900">
                              {stage.label}
                            </p>
                            <p className="text-xs font-medium text-slate-500">{stage.desc}</p>
                          </div>
                        </div>
                        <CaretDown className="w-5 h-5 text-slate-300 transition-transform duration-300 group-open:rotate-180 group-open:text-primary" />
                      </summary>

                      <div className="border-t border-slate-100 px-6 py-6 bg-slate-50/30">
                        {items.length > 0 ? (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {items.map((item: string) => (
                              <div
                                key={item}
                                className="flex cursor-pointer items-center justify-between rounded-2xl bg-white border border-primary/20 px-4 py-3 transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:scale-[1.02] group/item"
                              >
                                <span className="text-xs font-bold text-slate-700 group-hover/item:text-primary transition-colors">{item}</span>
                                <CaretRight className="w-4 h-4 text-slate-300 group-hover/item:translate-x-1 group-hover/item:text-primary transition-all" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-xs font-bold text-slate-400 italic">Curriculum content for this section is being updated.</p>
                          </div>
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

