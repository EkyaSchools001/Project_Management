import { useState } from 'react';
import { Badge } from '@ekya/ui';
import { TeachingSection } from '../components/TeachingSection';
import { LearningAreasView } from '../components/LearningAreasView';

const EMPTY_SECTION = (title: string) => (
  <div className="mx-auto max-w-7xl px-6">
    <section className="glass-panel border-white/60 p-10 mt-8">
      <p className="mb-4 text-sm uppercase tracking-[0.3em] font-bold text-indigo-500/80">Section</p>
      <h2 className="text-4xl font-extrabold text-slate-800">{title}</h2>
      <p className="mt-4 text-lg text-slate-600 font-medium">Coming soon with comprehensive educator resources.</p>
    </section>
  </div>
);

export function TeacherPortal({ section }: { section: string }) {
  const [activeTeachingView, setActiveTeachingView] = useState<'stage' | 'la'>('stage');

  const sections: Record<string, JSX.Element> = {
    home: (
      <div className="space-y-0 pb-12">
        {/* Hero */}
        <div className="relative overflow-hidden px-6 py-20 sm:px-12 backdrop-blur-3xl bg-white/30 border-b border-white/40 shadow-sm z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-[100px] animate-float-slow -z-10" />
          <div className="mx-auto max-w-3xl relative">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-6 shadow-sm">Good morning, Ananya</span>
            <h1 className="text-6xl font-extrabold leading-tight text-slate-900 drop-shadow-sm">
              Where are you<br />in your <span className="text-gradient italic">journey?</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
              Everything you need as an educator — your campus, your classroom, your curriculum — all in one place.
            </p>
          </div>
        </div>

        {/* Journey cards */}
        <div className="px-6 py-16 sm:px-12 relative z-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { title: 'Just joined', desc: 'Get set up with pre-service essentials, platform access, and your onboarding checklist.', bar: 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(251,191,36,0.5)]' },
                { title: 'Teaching', desc: 'Stage-specific curriculum, subjects, assessment, and learning area resources.', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(52,211,153,0.5)]' },
                { title: 'My classroom', desc: 'Attendance, student lists, micro plans, environment, and records — everything daily.', bar: 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_10px_rgba(96,165,250,0.5)]' },
                { title: 'My campus', desc: 'School details, leadership, history, affiliation, and your class and timetable.', bar: 'bg-gradient-to-r from-purple-400 to-purple-600 shadow-[0_0_10px_rgba(192,132,252,0.5)]' },
                { title: 'Who we are', desc: 'Our vision, mission, 15-year legacy, leadership team, and all campuses.', bar: 'bg-gradient-to-r from-rose-400 to-rose-600 shadow-[0_0_10px_rgba(251,113,133,0.5)]' },
                { title: 'Grow', desc: 'MOOCs, CPS evidence, your learning purpose, and the educator toolkit.', bar: 'bg-gradient-to-r from-teal-400 to-teal-600 shadow-[0_0_10px_rgba(45,212,191,0.5)]' }
              ].map((card) => (
                <div key={card.title} className="glass-card p-8 group cursor-pointer relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-slate-50 rounded-full blur-[40px] group-hover:bg-indigo-50 transition-colors duration-500" />
                  <div className={`h-1.5 w-12 rounded-full ${card.bar} mb-6 transition-all duration-300 group-hover:w-16`} />
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{card.title}</h3>
                  <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shared initiatives */}
        <div className="px-6 py-12 sm:px-12 relative z-20">
          <div className="mx-auto max-w-7xl glass-panel p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-300 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-indigo-400"></span>
              Shared initiatives
            </h4>
            <div className="flex flex-wrap gap-3">
              {['Find Journal', 'Day of Wonder', 'LTR', 'Special days', 'Marquee events', 'Booklist', 'Period matrix', 'PTI'].map((chip) => (
                <button key={chip} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-indigo-400/50">
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    teaching: (
      <div>
        <TeachingSection activeView={activeTeachingView} onViewChange={setActiveTeachingView} />
        {activeTeachingView === 'la' && <LearningAreasView />}
      </div>
    ),

    classroom: (
      <div className="space-y-0">
        <div className="border-b border-slate-200 bg-white px-6 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-light text-green-900">My classroom</h2>
            <p className="mt-2 text-sm text-slate-600">Everything you need day-to-day — the same tools across all stages.</p>
          </div>
        </div>
        <div className="px-6 py-12 sm:px-12 relative z-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { title: 'Attendance', icon: '📋', desc: 'Daily register' },
                { title: 'Micro plans', icon: '📅', desc: 'Weekly planning' },
                { title: 'Student lists', icon: '👥', desc: 'Rosters and records' },
                { title: 'Environment', icon: '🏛', desc: 'Boards, spaces, routines' },
                { title: 'Records', icon: '📑', desc: 'Documentation' },
                { title: 'Shared initiatives', icon: '🎉', desc: 'All stages' }
              ].map((card) => (
                <div key={card.title} className="glass-card p-6 group cursor-pointer">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-white shadow-inner border border-indigo-100 text-2xl group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{card.title}</h4>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">{card.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    who: EMPTY_SECTION('Who we are'),
    campus: EMPTY_SECTION('My campus'),
    grow: EMPTY_SECTION('Grow'),
    joining: EMPTY_SECTION('Joining')
  };

  return sections[section] || sections.home;
}
