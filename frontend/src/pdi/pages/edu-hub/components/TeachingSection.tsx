import { useState } from 'react';
import { TEACHING_DATA } from '../data/teacherPortalData';
import { Books, Plant, MagnifyingGlass, GraduationCap, ClipboardText, ArrowUpRight } from '@phosphor-icons/react';

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

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => onViewChange('stage')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeView === 'stage' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                By stage
              </button>
              <button
                onClick={() => onViewChange('la')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeView === 'la' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
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
                      ? 'border-b-2 border-primary text-primary'
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

              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { icon: Books, title: 'Block purpose', items: ['Block rationale', 'Booklist', 'Period matrix'] },
                  { icon: Plant, title: 'Subjects', items: ['Languages', 'Math', 'Science', 'Social', 'Arts', 'PE'] },
                  { icon: MagnifyingGlass, title: 'Assessment', items: ['Assessment pattern', 'Term schedule', 'Rubrics'] },
                  { icon: GraduationCap, title: 'Initiatives', items: ['Key programs', 'Special events', 'Transitions'] },
                  { icon: ClipboardText, title: 'Policies', items: ['Teaching policies', 'Guidelines', 'Standards'] }
                ].map((card) => (
                  <div key={card.title} className="group cursor-pointer bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-lg font-bold text-slate-900 tracking-wide">{card.title}</h3>
                      <div className="w-14 h-14 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors bg-white">
                        <card.icon weight="duotone" size={28} />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-6xl font-black text-[#111827] tracking-tighter">{card.items.length}</div>
                      <div className="text-lg text-slate-600 font-medium mt-2">Available Categories</div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F5E9] text-[#2E7D32] text-sm font-bold rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                        <ArrowUpRight weight="bold" size={16} /> 
                        <span>{card.items[0]} & more</span>
                      </div>
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
