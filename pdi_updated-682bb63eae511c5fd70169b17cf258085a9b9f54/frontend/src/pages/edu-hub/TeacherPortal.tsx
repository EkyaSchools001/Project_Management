import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeachingSection } from './components/TeachingSection';
import { LearningAreasView } from './components/LearningAreasView';
import { CultureEnvironmentSection } from './components/CultureEnvironmentSection';
import CoCurricularActivities from "./components/CoCurricularActivities";
import LACModule from "./components/LACModule";
import { useAuth } from '@/hooks/useAuth';

const campusSlugMap: Record<string, string> = {
  'ENICE': 'ekya-nice-road',
  'EITPL': 'ekya-itpl',
  'EJPN': 'ekya-jp-nagar',
  'EBTM': 'ekya-btm-layout',
  'EBYR': 'ekya-byrathi',
  'CMR NPS': 'cmr-nps',
  'PU HRBR': 'cmrpu-hrbr',
  'PU ITPL': 'cmrpu-itpl',
  'PU BTM': 'cmrpu-btm',
  'PU BYR': 'cmrpu-byrathi'
};
import { InteractionsDashboard } from '@/components/educator-hub/interactions/InteractionsDashboard';
import { TicketsDashboard } from '@/components/educator-hub/interactions/TicketsDashboard';
import { 
  Rocket, 
  GraduationCap, 
  ChalkboardTeacher, 
  Buildings, 
  Users, 
  TrendUp,
  Files,
  Calendar,
  ClipboardText,
  UserCircle,
  Confetti,
  Sparkle,
  BookOpen,
  ArrowRight,
  ChatCircleDots,
  Ticket
} from "@phosphor-icons/react";
import { PageHeader } from '@/components/layout/PageHeader';

const EMPTY_SECTION = (title: string, subtitle: string, navigate: any) => (
  <div className="space-y-6">
    <PageHeader 
      title={title}
      subtitle={subtitle}
      icon={<Sparkle className="w-8 h-8 text-primary" weight="duotone" />}
      onBack={() => navigate(-1)}
    />
    <div className="rounded-[2.5rem] bg-white border border-slate-200 p-12 text-center shadow-sm">
      <div className="mb-6 mx-auto w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-4xl shadow-inner border border-primary/10">
        ✨
      </div>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-4">Curating Resources</h2>
      <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
        We are currently curating premium resources and curriculum materials for this section. Stay tuned for updates!
      </p>
    </div>
  </div>
);

export function TeacherPortal({ section }: { section: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTeachingView, setActiveTeachingView] = useState<'stage' | 'la'>('stage');

  const firstName = user?.fullName?.split(' ')[0] || 'Educator';

  const getDefaultBackPath = () => {
    const role = user?.role?.toUpperCase() || "";
    if (role === 'TEACHER') return '/teacher';
    if (role.includes('LEADER')) return '/leader';
    if (role === 'ADMIN' || role === 'SUPERADMIN') return '/admin';
    if (role === 'MANAGEMENT') return '/management';
    if (role === 'COORDINATOR') return '/coordinator';
    return '/';
  };

  const sections: Record<string, JSX.Element> = {
    home: (
      <div className="space-y-0 pb-12">
        {/* Immersive Hero Banner */}
        <div className="relative w-full h-[280px] overflow-hidden -mt-6 -mr-4 md:-mr-6 lg:-mr-8 xl:-mr-10 2xl:-mr-12 3xl:-mr-16 rounded-b-[3rem] shadow-2xl mb-12">
          <div className="absolute inset-0 bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
              alt="Educator Journey"
              className="w-full h-full object-cover object-right opacity-50 mix-blend-luminosity transform scale-110 hover:scale-100 transition-transform duration-[10000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-end px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-28 3xl:px-32 pb-12">
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Sparkle className="w-5 h-5 text-primary" weight="fill" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Welcome Back to</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none uppercase">
                EDUCATOR <span className="text-primary italic">SITE</span>
              </h2>
              <div className="h-1.5 w-32 bg-primary rounded-full mt-4 shadow-[0_0_20px_rgba(234,16,74,0.5)]" />
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 opacity-10">
             <Rocket className="w-40 h-40 text-white rotate-12" weight="duotone" />
          </div>
        </div>

        <div className="px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-28 3xl:px-32">
          <PageHeader 
            title="Overview"
            subtitle={`Good morning, ${firstName}. Everything you need as an educator — your campus, your classroom, your curriculum — all in one place.`}
            icon={<Rocket className="w-8 h-8 text-primary" weight="duotone" />}
            onBack={() => navigate(getDefaultBackPath())}
          />
        </div>

        {/* Journey cards - Refined for Dashboard */}

        {/* Journey cards */}
        <div className="py-16 relative z-20">
          <div className="px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-28 3xl:px-32">
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { title: 'Just joined', icon: Rocket, desc: 'Get set up with pre-service essentials, platform access, and your onboarding checklist.', bar: 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(251,191,36,0.5)]', path: '/edu-hub/joining' },
                { title: 'Teaching', icon: GraduationCap, desc: 'Stage-specific curriculum, subjects, assessment, and learning area resources.', bar: 'bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(247,53,88,0.5)]', path: '/edu-hub/teaching' },
                { title: 'My classroom', icon: ChalkboardTeacher, desc: 'Attendance, student lists, micro plans, environment, and records — everything daily.', bar: 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-[0_0_10px_rgba(96,165,250,0.5)]', path: '/edu-hub/my-classroom' },
                { title: 'My campus', icon: Buildings, desc: 'School details, leadership, history, affiliation, and your class and timetable.', bar: 'bg-gradient-to-r from-purple-400 to-purple-600 shadow-[0_0_10px_rgba(192,132,252,0.5)]', path: '/edu-hub/my-campus' },
                { title: 'Who we are', icon: Users, desc: 'Our vision, mission, 15-year legacy, leadership team, and all campuses.', bar: 'bg-gradient-to-r from-rose-400 to-rose-600 shadow-[0_0_10px_rgba(251,113,133,0.5)]', path: '/edu-hub/who-we-are' },
                { title: 'Grow', icon: TrendUp, desc: 'MOOCs, CPS evidence, your learning purpose, and the educator toolkit.', bar: 'bg-gradient-to-r from-teal-400 to-teal-600 shadow-[0_0_10px_rgba(45,212,191,0.5)]', path: '/edu-hub/grow' },
                { title: 'LAC', icon: ClipboardText, desc: 'Learning Accountability Checklist — monitor and track curriculum delivery.', bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]', path: '/edu-hub/lac' }
              ].map((card) => (
                <div 
                  key={card.title} 
                  onClick={() => navigate(card.path)}
                  className="bg-white/50 backdrop-blur-lg border border-primary/20 shadow-sm rounded-2xl p-8 group cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/80 hover:-translate-y-1 hover:border-primary/50"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-slate-50 rounded-full blur-[40px] group-hover:bg-primary/5 transition-colors duration-500" />
                  <div className="mb-6 flex items-center justify-between">
                    <div className={`h-1.5 w-12 rounded-full ${card.bar} transition-all duration-300 group-hover:w-16`} />
                    <card.icon className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">{card.title}</h3>
                  <p className="mt-3 text-sm text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shared initiatives */}
        <div className="py-12 relative z-20">
          <div className="px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-28 3xl:px-32">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.2)] p-8 rounded-[2.5rem]">
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary/80 mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary/40"></span>
                Shared initiatives
              </h4>
              <div className="flex flex-wrap gap-3">
                {['Find Journal', 'Day of Wonder', 'LTR', 'Special days', 'Marquee events', 'Booklist', 'Period matrix', 'PTI'].map((chip) => (
                  <button key={chip} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-primary/50">
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    teaching: (
      <div className="space-y-6">
        <PageHeader 
          title="Teaching & Curriculum"
          subtitle="Explore stage-specific curriculum, learning areas, and pedagogical resources."
          icon={<GraduationCap className="w-8 h-8 text-primary" weight="duotone" />}
          onBack={() => {
            if (activeTeachingView === 'la') {
              setActiveTeachingView('stage');
            } else {
              navigate('/edu-hub');
            }
          }}
        />
        <TeachingSection activeView={activeTeachingView} onViewChange={setActiveTeachingView} />
        {activeTeachingView === 'la' && <LearningAreasView />}
      </div>
    ),

    classroom: (
      <div className="space-y-8 pb-12 text-slate-900">
        <PageHeader 
          title="My Classroom"
          subtitle="Daily essentials, student records, and environment management across all stages."
          icon={<ChalkboardTeacher className="w-8 h-8 text-primary" weight="duotone" />}
          onBack={() => navigate('/edu-hub')}
        />
        <div className="px-0 relative z-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { title: 'Attendance', icon: ClipboardText, desc: 'Daily register' },
                { title: 'Micro plans', icon: Calendar, desc: 'Weekly planning' },
                { title: 'Student lists', icon: Users, desc: 'Rosters and records' },
                { title: 'Environment', icon: Buildings, desc: 'Boards, spaces, routines' },
                { title: 'Records', icon: Files, desc: 'Documentation' },
                { title: 'Shared initiatives', icon: Confetti, desc: 'All stages' }
              ].map((card) => (
                <div key={card.title} className="bg-white/50 backdrop-blur-lg border border-primary/20 shadow-sm rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:bg-white/80 hover:-translate-y-1 hover:border-primary/50">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/5 to-white shadow-inner border border-primary/10 text-2xl group-hover:scale-110 transition-transform duration-300">
                      <card.icon className="w-7 h-7 text-primary" weight="duotone" />
                    </div>
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

    interactions: (
      <div className="space-y-6">
        <PageHeader 
          title="Interactions"
          subtitle="School community interactions, parent-teacher logs, and engagement tracking."
          icon={<ChatCircleDots className="w-8 h-8 text-primary" weight="duotone" />}
          onBack={() => navigate('/edu-hub')}
        />
        <InteractionsDashboard />
      </div>
    ),
    tickets: (
      <div className="space-y-6">
        <PageHeader 
          title="Tickets"
          subtitle="Manage support requests raised via the Official Support Portal. Track, assign, and resolve."
          icon={<Ticket className="w-8 h-8 text-[#EA104A]" weight="duotone" />}
          onBack={() => navigate('/edu-hub')}
        />
        <TicketsDashboard />
      </div>
    ),

    who: (
      <div className="space-y-6">
        <PageHeader 
          title="Who we are"
          subtitle="Our vision, values, and the story behind 15 years of building something remarkable in education."
          icon={<Users className="w-8 h-8 text-primary" weight="duotone" />}
          onBack={() => navigate('/edu-hub')}
        />
        <div className="bg-[#FAF9F6] -mx-6 md:-mx-12 px-6 md:px-12 py-12 rounded-b-[2.5rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "Vision & mission",
                desc: "Vision: To empower young minds to make a difference in the world. Mission: To build progressive K-12 schools that provide technology-rich and immersive learning experiences facilitated by passionate educators.",
                tags: ["Vision", "Mission", "Values"],
                path: "/educator-hub/institutional-identity/philosophy"
              },
              {
                title: "15 Year Legacy",
                desc: "Celebrate over a decade of impact. This section highlights key achievements, programs launched, schools and teachers served, and transformations witnessed across our community. It's a testament to our sustained commitment and the trust educators have placed in us.",
                tags: ["Achievements", "Impact", "Milestones"],
                path: "/educator-hub/institutional-identity/legacy"
              },
              {
                title: "Founder's Message",
                desc: "A legacy of excellence built on trust and innovation. Read the inspiring message from our Founder, outlining the ongoing commitment to shaping the future of education.",
                tags: ["Message", "Visionary", "Legacy"],
                path: "/educator-hub/institutional-identity/founders-message"
              },
              {
                title: "Our schools",
                desc: "Exquisite campuses designed with state-of-the-art infrastructure and a student-centric environment, nurturing the next generation of leaders.",
                tags: ["Existing", "Upcoming", "Locations"],
                path: "/educator-hub/institutional-identity/schools"
              }
            ].map((card) => (
              <div 
                key={card.title} 
                onClick={() => navigate(card.path)}
                className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-primary/20 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col gap-8 group relative overflow-hidden"
              >
                <div className="flex items-start justify-between z-10 relative">
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors pr-4">{card.title}</h3>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white text-slate-400 transition-all duration-300 transform group-hover:scale-110">
                    <ArrowRight weight="bold" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 z-10 relative">
                  {card.tags.map((tag) => (
                    <span key={tag} className="px-5 py-2 bg-[#F5F1EA] rounded-full text-[10px] font-bold text-slate-400 tracking-wider uppercase group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    campus: (
      <div className="space-y-6">
        <PageHeader 
          title="My campus"
          subtitle="Your campus, your class, your timetable — the details specific to where you teach."
          icon={<Buildings className="w-8 h-8 text-primary" weight="duotone" />}
          onBack={() => navigate('/edu-hub')}
        />
        <div className="bg-[#FAF9F6] -mx-6 md:-mx-12 px-6 md:px-12 py-12 rounded-b-[2.5rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {(() => {
              const slug = campusSlugMap[user?.campusId || ''] || 'ekya-nice-road';
              // Info pages are now available for all campuses mapped in campusSlugMap
              const hasInfoPage = true;
              
              return [
                {
                  title: "School details",
                  desc: "Address, contact numbers, affiliation, board information, and administrative contacts.",
                  tags: ["Affiliation", "Board", "Contacts"],
                  path: hasInfoPage ? `/campuses/${slug}/info` : `/campuses/${slug}`
                },
                {
                  title: "Campus leadership",
                  desc: "Your principal, HODs, and support staff — who to go to for what.",
                  tags: ["Principal", "HODs", "Admin"],
                  path: `/campuses/${slug}`
                },
                {
                  title: "Campus duty",
                  desc: "Duty rosters, assembly schedules, and general operational instructions.",
                  tags: ["Duties", "Roster", "Schedules"],
                  path: `/campuses/${slug}/duties`
                },
                {
                  title: "My class + timetable",
                  desc: "Your assigned class, sections, and weekly timetable for the current academic year.",
                  tags: ["My class", "Timetable"],
                  path: "/edu-hub/work-in-progress"
                },
                {
                  title: "Campus gallery + history",
                  desc: "Photos, campus videos, and the history of how this campus came to be.",
                  tags: ["Gallery", "History"],
                  path: hasInfoPage ? `/campuses/${slug}/info#history` : "/edu-hub/work-in-progress"
                }
              ];
            })().map((card) => (
              <div 
                key={card.title} 
                onClick={() => navigate(card.path)}
                className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-primary/20 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col gap-8 group relative overflow-hidden"
              >
                <div className="flex items-start justify-between z-10 relative">
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors pr-4">{card.title}</h3>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white text-slate-400 transition-all duration-300 transform group-hover:scale-110">
                    <ArrowRight weight="bold" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 z-10 relative">
                  {card.tags.map((tag) => (
                    <span 
                      key={tag} 
                      onClick={(e) => {
                        const slug = campusSlugMap[user?.campusId || ''] || 'ekya-nice-road';
                        if (card.title === "Campus gallery + history") {
                          e.stopPropagation();
                          const target = tag.toLowerCase() === 'gallery' ? '#gallery' : '#history';
                          // All campuses now have an info page
                          navigate(`/campuses/${slug}/info${target}`);
                        }
                      }}
                      className="px-5 py-2 bg-[#F5F1EA] rounded-full text-[10px] font-bold text-slate-400 tracking-wider uppercase hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    grow: (
      <div className="space-y-6">
        <PageHeader 
          title="Grow"
          subtitle="Your professional development — learning goals, evidence, courses, and what you want to explore next."
          icon={<TrendUp className="w-8 h-8 text-primary" weight="duotone" />}
          onBack={() => navigate('/edu-hub')}
        />
        <div className="bg-[#FAF9F6] -mx-6 md:-mx-12 px-6 md:px-12 py-12 rounded-b-[2.5rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "MOOCs",
                desc: "Browse and enrol in recommended courses aligned to your teaching practice and learning needs.",
                tags: ["Courses", "Certificates"],
                path: "/edu-hub/grow"
              },
              {
                title: "CPS + evidence",
                desc: "Document your Continuous Professional Study — goals, reflections, and student work evidence.",
                tags: ["CPS goals", "Evidence", "Reflection"],
                path: "/edu-hub/grow"
              },
              {
                title: "Toolkit + wishlist",
                desc: "Resources, templates, and tools you've saved — plus a space to request what you need.",
                tags: ["Templates", "Wishlist", "Saved"],
                path: "/edu-hub/grow"
              }
            ].map((card) => (
              <div 
                key={card.title} 
                onClick={() => navigate(card.path)}
                className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-primary/20 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col gap-8 group relative overflow-hidden"
              >
                <div className="flex items-start justify-between z-10 relative">
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors pr-4">{card.title}</h3>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white text-slate-400 transition-all duration-300 transform group-hover:scale-110">
                    <ArrowRight weight="bold" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 z-10 relative">
                  {card.tags.map((tag) => (
                    <span key={tag} className="px-5 py-2 bg-[#F5F1EA] rounded-full text-[10px] font-bold text-slate-400 tracking-wider uppercase group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    joining: EMPTY_SECTION('Joining', 'Onboarding essentials and your first-day checklist.', navigate),
    culture: <CultureEnvironmentSection />,
    'co-curricular': <CoCurricularActivities />,
    lac: <LACModule />,
    wip: EMPTY_SECTION('Working on this', 'This professional section is currently under development. Stay tuned for updates!', navigate)
  };

  return sections[section] || sections.home;
}
