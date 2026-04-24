import { useState } from 'react';
import { TEACHING_DATA, SECTIONS, SECTION_LABELS } from '../data/teacherPortalData';

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

  const laList = Object.entries(TEACHING_DATA).map(([key, data]) => ({
    id: key,
    label: data.label,
    icon: key === 'lang' ? '📖' : key === 'math' ? '🔢' : key === 'science' ? '🔬' : key === 'humanities' ? '🌍' : key === 'pe' ? '🏃' : '🎨'
  }));

  return (
    <div className="border-t border-slate-200 px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Learning areas</p>
              <div className="space-y-1">
                {laList.map((la) => (
                  <div key={la.id}>
                    <button
                      onClick={() => {
                        setActiveLa(la.id);
                        setActiveSub(TEACHING_DATA[la.id as keyof typeof TEACHING_DATA]?.subIds?.[0] || '');
                        setActiveSection(0);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        activeLa === la.id
                          ? 'bg-green-100 font-semibold text-green-900'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="mr-2">{la.icon}</span>
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
                        className={`ml-4 w-full rounded-lg px-3 py-1.5 text-left text-xs transition ${
                          activeSub === subId
                            ? 'font-semibold text-green-900'
                            : 'text-slate-600 hover:text-slate-900'
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
                <h3 className="text-2xl font-light text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{laData?.desc}</p>
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
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                        activeSub === laData.subIds![idx]
                          ? 'bg-green-900 text-white'
                          : 'border border-slate-200 bg-white text-slate-700 hover:border-green-900'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}

              {/* Section tabs */}
              <div className="border-b border-slate-200">
                <div className="flex gap-4 overflow-x-auto">
                  {SECTION_LABELS.map((label, idx) => (
                    <button
                      key={label}
                      onClick={() => setActiveSection(idx)}
                      className={`border-b-2 px-1 py-3 text-sm font-medium transition ${
                        activeSection === idx
                          ? 'border-b-2 border-green-900 text-green-900'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage accordions */}
              <div className="space-y-2">
                {stages.map((stage, idx) => {
                  const sectionKey = SECTIONS[activeSection];
                  const items = stage[sectionKey] || [];

                  return (
                    <details key={stage.id} open={idx === 0} className="group rounded-2xl border border-slate-200 bg-white transition">
                      <summary className="flex cursor-pointer items-center justify-between px-5 py-4 transition group-open:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-medium white"
                            style={{ backgroundColor: stage.bg, color: stage.color }}
                          >
                            {stage.label}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {stage.label}
                            </p>
                            <p className="text-xs text-slate-500">{stage.desc}</p>
                          </div>
                        </div>
                        <span className="text-slate-400 transition group-open:rotate-180">▼</span>
                      </summary>

                      <div className="border-t border-slate-200 px-5 py-4">
                        {items.length > 0 ? (
                          <div className="grid gap-2 sm:grid-cols-2">
                            {items.map((item: string) => (
                              <div
                                key={item}
                                className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-50 px-3 py-2 transition hover:bg-green-50"
                              >
                                <span className="text-xs text-slate-700">{item}</span>
                                <span className="text-slate-400">→</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">Content coming soon.</p>
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
