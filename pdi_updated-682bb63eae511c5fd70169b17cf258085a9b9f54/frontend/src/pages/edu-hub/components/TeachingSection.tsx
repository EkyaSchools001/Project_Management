import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Books, 
  Plant, 
  MagnifyingGlass, 
  GraduationCap, 
  ClipboardText, 
  ArrowUpRight,
  Palette,
  Sparkle,
  CaretRight,
  Book,
  Clock,
  ChalkboardTeacher,
  Exam,
  TrendUp,
  Globe,
  House,
  ListBullets,
  Layout,
  UserFocus,
  MapTrifold,
  FileText,
  Users,
  Buildings
} from '@phosphor-icons/react';

const STAGE_DATA: Record<string, any> = {
  ey: {
    id: 'ey',
    label: 'Early Years Academy',
    color: '#EA104A',
    bannerBg: 'bg-[#EA104A]/5',
    bannerBorder: 'border-[#EA104A]/10',
    desc: 'Foundational learning through play, inquiry, and holistic development.',
    sidebarItems: [
      { id: 'curriculum', label: 'Curriculum', icon: Book },
      { id: 'initiatives', label: 'Learning Area Initiatives', icon: Sparkle },
      { id: 'routines', label: 'Routines', icon: Clock },
      { id: 'instruction', label: 'Instruction', icon: ChalkboardTeacher },
      { id: 'assessment', label: 'Assessment', icon: Exam },
      { id: 'pd', label: 'Professional Development', icon: TrendUp },
      { id: 'culture', label: 'Environment & Culture', icon: Globe }
    ],
    categoryContent: {
      curriculum: [
        'Program Overview & Philosophy',
        'Learning Frameworks by Domain',
        'Learner Profiles by Grade Level',
        'Scope & Sequence by Age Group'
      ],
      initiatives: [
        'Levelled Reading Program (Love to Read)',
        'Phonics Program',
        'Handwriting Program'
      ],
      routines: [
        'Arrival & Entry',
        'Circle Time & Calendar Time',
        'Rhyme Time',
        'Storytelling & Puppetry',
        'Montessori & Learning Block',
        'Transitions & Attention Signals',
        'Washroom Hygiene',
        'Snack, Lunch & Dispersal'
      ],
      instruction: [
        'Timetables & Period Matrix',
        'Montessori Material Guides',
        'Atelier Hub Guides',
        'Outdoor Learning',
        'Differentiation & Age-Group Modifications'
      ],
      assessment: [
        'Performance-Based Assessment Guidelines',
        'Observation & Anecdote-Keeping Tools',
        'Progress Cards & Reporting',
        'Parent Communication Resources'
      ],
      pd: [
        'Making Learning Visible & Documentation',
        'SOPs',
        'Pedagogical Approaches (Montessori, Reggio Emilia)'
      ],
      culture: [
        'Classroom Setup & Learning Spaces',
        'Atelier Design & Maintenance',
        'Bulletin Board Guidelines',
        'Classroom Jobs & Student Responsibilities',
        'Rapport Building & Recognition',
        'Outdoor Spaces Design'
      ]
    }
  },
  primary: {
    id: 'primary',
    label: 'Primary',
    color: '#2E6B3E',
    bannerBg: 'bg-green-50',
    bannerBorder: 'border-green-100',
    desc: 'Empowering students with foundational skills and deep inquiry across disciplines.',
    cards: [
      { icon: Books, title: 'Block purpose', items: ['Block rationale', 'Booklist', 'Period matrix'] },
      { icon: Plant, title: 'Subjects', type: 'grid', items: ['Languages', 'Math', 'Science', 'Social', 'Arts', 'PE'] },
      { icon: MagnifyingGlass, title: 'Assessment', items: ['Assessment pattern', 'Term schedule', 'Rubrics'] },
      { icon: GraduationCap, title: 'Initiatives', items: ['Key programs', 'Special events', 'Transitions'] },
      { icon: ClipboardText, title: 'Policies', items: ['Teaching policies', 'Guidelines', 'Standards'] }
    ]
  },
  middle: {
    id: 'middle',
    label: 'Middle',
    color: '#7C3D8F',
    bannerBg: 'bg-purple-50',
    bannerBorder: 'border-purple-100',
    desc: 'Navigating academic rigor and personal growth through exploration and specialized learning.',
    cards: [
      { icon: Books, title: 'Block purpose', items: ['Block rationale', 'Booklist', 'Period matrix'] },
      { icon: Plant, title: 'Subjects', type: 'grid', items: ['Languages', 'Math', 'Science', 'Social', 'Arts', 'PE'] },
      { icon: MagnifyingGlass, title: 'Assessment', items: ['Assessment pattern', 'Term schedule', 'Rubrics'] },
      { icon: GraduationCap, title: 'Initiatives', items: ['Key programs', 'Special events', 'Transitions'] },
      { icon: ClipboardText, title: 'Policies', items: ['Teaching policies', 'Guidelines', 'Standards'] }
    ]
  },
  beyond: {
    id: 'beyond',
    label: 'Beyond academics',
    color: '#C07830',
    bannerBg: 'bg-[#FDF3E7]',
    bannerBorder: 'border-[#F8E7D1]',
    desc: 'Visual arts, performing arts, physical education, and enrichment programmes.',
    cards: [
      { 
        icon: Books, 
        title: 'Block purpose', 
        items: ['CSVAPA rationale', 'PE framework'] 
      },
      { 
        icon: Palette, 
        title: 'Programmes', 
        type: 'grid',
        items: ['Visual arts', 'Perf. arts', 'PE', 'Atelier'] 
      },
      { 
        icon: Sparkle, 
        title: 'Initiatives', 
        items: ['Marquee events', 'Special days'] 
      }
    ]
  }
};

export function TeachingSection({ activeView, onViewChange }: { activeView: 'stage' | 'la'; onViewChange: (v: 'stage' | 'la') => void }) {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState<'ey' | 'primary' | 'middle' | 'beyond'>('ey');
  const [activeCategory, setActiveCategory] = useState<string>('curriculum');

  const stages = [
    { id: 'ey', label: 'Early Years Academy', color: '#1B5E8A', dot: true },
    { id: 'primary', label: 'Primary', color: '#2E6B3E', dot: true },
    { id: 'middle', label: 'Middle', color: '#7C3D8F', dot: true },
    { id: 'beyond', label: 'Beyond academics', color: '#C07830', dot: true }
  ];

  const content = STAGE_DATA[activeStage];

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white px-6 py-12 sm:px-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-8">
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
    </div>

      {/* STAGE NAVIGATION - STICKY PILL */}
      {activeView === 'stage' && (
        <>
          <div className="sticky top-[var(--global-header-height,80px)] z-30 py-4 bg-[#FAF9F6]/80 backdrop-blur-md transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 px-8 py-1">
                <div className="flex items-center gap-10 overflow-x-auto scrollbar-hide">
                  {stages.map((stage) => {
                    const isActive = activeStage === stage.id;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => setActiveStage(stage.id as any)}
                        className={cn(
                          "flex items-center gap-3 py-4 text-sm font-black transition-all relative group shrink-0 uppercase tracking-widest",
                          isActive ? "text-primary" : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        {stage.dot && (
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stage.color }} />
                        )}
                        {stage.label}
                        {isActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Stage Content */}
          <div className="py-8 bg-[#FAF9F6] min-h-[400px]">
            <div className="mx-auto max-w-7xl px-4 md:px-6 space-y-8">
              <div className={`rounded-2xl border ${content.bannerBorder} ${content.bannerBg} p-6 shadow-sm`}>
                <h3 className="font-bold text-slate-800" style={{ color: content.color }}>{content.label}</h3>
                <p className="text-sm text-slate-600 mt-1">{content.desc}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* VERTICAL SIDEBAR for Early Years */}
                {activeStage === 'ey' && (
                  <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EA104A]/60 px-4">Early Years Academy</p>
                      <div className="space-y-1">
                        {content.sidebarItems.map((item: any) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveCategory(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all border ${
                              activeCategory === item.id
                                ? 'bg-[#EA104A]/10 border-[#EA104A]/20 text-[#EA104A] shadow-sm font-bold'
                                : 'bg-white border-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <item.icon className={`w-5 h-5 ${activeCategory === item.id ? 'text-[#EA104A]' : 'text-slate-400'}`} weight={activeCategory === item.id ? "fill" : "duotone"} />
                            <span className="text-sm tracking-tight">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dashboard Content */}
                <div className={`${activeStage === 'ey' ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-6`}>
                  {activeStage === 'ey' ? (
                    /* FLAT SUB-BUTTON CARDS (As requested in the screenshot) */
                    <div className="grid gap-4 sm:grid-cols-2">
                       {content.categoryContent[activeCategory].map((subItem: string) => (
                         <div
                           key={subItem}
                           onClick={() => {
                             const slugMap: Record<string, string> = {
                               'Program Overview & Philosophy': 'program-overview-philosophy',
                               'Learning Frameworks by Domain': 'learning-frameworks-domain',
                               'Learner Profiles by Grade Level': 'learner-profiles-grade',
                               'Scope & Sequence by Age Group': 'scope-sequence-age',
                               'Levelled Reading Program (Love to Read)': 'levelled-reading-program',
                               'Phonics Program': 'phonics-program',
                               'Handwriting Program': 'handwriting-program',
                               'Arrival & Entry': 'arrival-entry',
                               'Circle Time & Calendar Time': 'circle-time-calendar',
                               'Rhyme Time': 'rhyme-time',
                               'Storytelling & Puppetry': 'storytelling-puppetry',
                               'Montessori & Learning Block': 'montessori-learning-block',
                               'Transitions & Attention Signals': 'transitions-attention-signals',
                               'Washroom Hygiene': 'washroom-hygiene',
                               'Snack, Lunch & Dispersal': 'snack-lunch-dispersal',
                               'Timetables & Period Matrix': 'timetables-period-matrix',
                               'Montessori Material Guides': 'montessori-material-guides',
                               'Atelier Hub Guides': 'atelier-hub-guides',
                               'Outdoor Learning': 'outdoor-learning',
                               'Differentiation & Age-Group Modifications': 'differentiation-modifications',
                               'Performance-Based Assessment Guidelines': 'performance-assessment-guidelines',
                               'Observation & Anecdote-Keeping Tools': 'observation-anecdote-tools',
                               'Progress Cards & Reporting': 'progress-cards-reporting',
                               'Parent Communication Resources': 'parent-communication-resources',
                               'Making Learning Visible & Documentation': 'making-learning-visible-documentation',
                               'SOPs': 'sops',
                               'Pedagogical Approaches (Montessori, Reggio Emilia)': 'pedagogical-approaches'
                             };
                             
                             const finalSlug = slugMap[subItem] || subItem.toLowerCase().replace(/\s+/g, '-');
                             navigate(`/edu-hub/early-years/${finalSlug}`);
                           }}
                           className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                         >
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#EA104A] border border-red-100 shadow-inner group-hover:bg-[#EA104A] group-hover:text-white transition-all duration-300">
                                 <FileText size={24} weight="duotone" />
                               </div>
                               <div className="flex flex-col gap-0.5">
                                 <span className="text-sm font-black text-slate-800 leading-tight tracking-tight uppercase max-w-[200px]">{subItem}</span>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeCategory}</span>
                               </div>
                            </div>
                            <CaretRight size={20} className="text-slate-300 group-hover:text-[#EA104A] group-hover:translate-x-1 transition-all" weight="bold" />
                         </div>
                       ))}
                    </div>
                  ) : (
                    /* Standard Cards Grid for other stages */
                    <div className="grid gap-6 md:grid-cols-2">
                      {content.cards.map((card: any) => (
                        <div key={card.title} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
                          {/* Card Header */}
                          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary/70 shrink-0 border border-slate-100">
                                 <card.icon weight="duotone" size={24} />
                               </div>
                               <h3 className="font-bold text-slate-800 text-lg tracking-tight">{card.title}</h3>
                             </div>
                          </div>
                          
                          {/* Card Content */}
                          <div className="p-8 flex-grow">
                            {card.type === 'grid' ? (
                              <div className="grid grid-cols-2 gap-3">
                                 {card.items.map((item: string) => (
                                   <button key={item} className="px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-black text-slate-600 text-center transition-all border border-slate-100">
                                     {item}
                                   </button>
                                 ))}
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {card.items.map((item: string) => (
                                  <button key={item} className="w-full flex items-center justify-between py-3 px-2 group/item rounded-xl hover:bg-slate-50 transition-colors">
                                    <span className="text-sm font-medium text-slate-600 group-hover/item:text-primary transition-colors">{item}</span>
                                    <CaretRight size={14} className="text-slate-300 group-hover/item:text-primary transition-colors" weight="bold" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
