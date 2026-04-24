import { useState } from 'react';
import { TEACHING_DATA, SECTION_LABELS } from '../data/teacherPortalData';

export function TeachingSection({ activeView, onViewChange }: { activeView: 'stage' | 'la'; onViewChange: (v: 'stage' | 'la') => void }) {
  const [activeStage, setActiveStage] = useState<'ey' | 'primary' | 'middle' | 'senior'>('ey');

  const stages = [
    { id: 'ey', label: 'Early years', color: '#1B5E8A', dot: true },
    { id: 'primary', label: 'Primary', color: '#2E6B3E', dot: true },
    { id: 'middle', label: 'Middle', color: '#7C3D8F', dot: true },
    { id: 'beyond', label: 'Beyond academics', color: '#C07830', dot: false }
  ];

  const mathStages = TEACHING_DATA.math.stages ?? [];

  const stageContent: Record<string, any> = {
    ey: mathStages[0] ?? {
      id: 'ey',
      label: 'Early years',
      color: '#1B5E8A',
      bg: '#EFF6FF',
      desc: 'Early years mathematics overview appears here.',
      purpose: [],
      curriculum: [],
      pedagogy: [],
      tools: [],
      assessment: [],
      evidence: []
    },
    primary: { ...(mathStages[1] ?? {}), label: 'Primary' },
    middle: { ...(mathStages[2] ?? {}), label: 'Middle' },
    beyond: {
      id: 'beyond',
      label: 'Beyond academics',
      color: '#C07830',
      bg: '#FDF3E7',
      desc: 'Visual arts, performing arts, physical education, and enrichment programmes.'
    }
  };

  const content = stageContent[activeStage];

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-light text-green-900">Teaching</h2>
          <p className="mt-2 text-sm text-slate-600">Browse by stage or explore resources across learning areas.</p>

          {/* View Toggle */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => onViewChange('stage')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeView === 'stage' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              By stage
            </button>
            <button
              onClick={() => onViewChange('la')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeView === 'la' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Learning areas
            </button>
          </div>
        </div>
      </div>

      {/* Stage tabs */}
      {activeView === 'stage' && (
        <>
          <div className="border-b border-slate-200 bg-white px-6 sm:px-8">
            <div className="mx-auto max-w-7xl flex gap-6 overflow-x-auto">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id as any)}
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${
                    activeStage === stage.id
                      ? 'border-b-2 text-slate-900'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {stage.dot && (
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stage.color }} />
                  )}
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stage Content Cards */}
          <div className="px-6 py-8 sm:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-blue-50 p-4">
                <p className="text-sm text-slate-700">{content.desc}</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {[
                  { icon: '📚', title: 'Block purpose', items: ['Block rationale', 'Booklist', 'Period matrix'] },
                  { icon: '🌱', title: 'Subjects', items: ['Languages', 'Math', 'Science', 'Social', 'Arts', 'PE'] },
                  { icon: '🔍', title: 'Assessment', items: ['Assessment pattern', 'Term schedule', 'Rubrics'] },
                  { icon: '🎓', title: 'Initiatives', items: ['Key programs', 'Special events', 'Transitions'] },
                  { icon: '📋', title: 'Policies', items: ['Teaching policies', 'Guidelines', 'Standards'] }
                ].map((card) => (
                  <div key={card.title} className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-lg">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xl">{card.icon}</span>
                      <h4 className="text-sm font-semibold text-slate-900">{card.title}</h4>
                    </div>
                    <div className="space-y-2">
                      {card.items.map((item) => (
                        <div key={item} className="flex items-center justify-between text-xs text-slate-600">
                          <span>{item}</span>
                          <span className="text-slate-400">→</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
