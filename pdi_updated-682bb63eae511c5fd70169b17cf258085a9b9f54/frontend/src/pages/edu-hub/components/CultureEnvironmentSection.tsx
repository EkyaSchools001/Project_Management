import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, ChalkboardTeacher, Medal, Warning, UsersThree, ChatCircle, Handshake,
  Star, Rocket, Heart, FileText, TShirt, ClockCounterClockwise, UsersFour,
  Lightbulb, PushPin, Confetti, Fire, Mountains, PawPrint,
  Trophy, SquaresFour, Books, BookOpen, PresentationChart, IdentificationBadge,
  FacebookLogo, TwitterLogo, InstagramLogo, LinkedinLogo, QrCode, Sparkle, CaretLeft, Buildings, PencilSimple
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { PortalBanner } from '@/components/layout/PortalBanner';
import { sanitizeContent } from "@/utils/contentSanitizer";

interface PracticeCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const PracticeCard: React.FC<PracticeCardProps & { customLink?: string }> = ({ icon, title, desc, customLink }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(customLink || '/in-progress')}
      className="bg-white rounded-2xl p-6 shadow-sm border border-primary/20 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 group flex flex-col h-full cursor-pointer"
    >
      <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1">{desc}</p>
    </div>
  );
};

export const CultureEnvironmentSection = ({ hideInternalBanner = false }: { hideInternalBanner?: boolean }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [data, setData] = useState({
    heroImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
    pillarTitle: "Pillar of Practice",
    mainTitle: "CULTURE &",
    italicTitle: "ENVIRONMENT",
    cultureIntro1: "At Ekya, we have high expectations for our students and believe creating a positive environment is essential for their success. Our community is a safe and supportive space where students can explore new ideas and discover their sense of purpose.",
    cultureIntro2: "We encourage self-managing behavior and believe that our students can positively impact the world around them as long as we work collaboratively with our parents in supporting their child's journey of growth and discovery.",
    envIntro: "What is the physical environment we create for children? How do we create and organize spaces?",
    bannerSubtitle: "Our core principles, culture practices, and physical environment standards.",
    coreSubtitle: "Core Principles",
    coreTitle: "CARE ABOUT CULTURE",
    envSubtitle: "Physical Spaces",
    envTitle: "ENVIRONMENT",
    customSections: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_culture_environment");
        if (result && result.value) {
          setData(prev => sanitizeContent({ ...prev, ...result.value }));
        }
      } catch (error) {
        console.error("Failed to fetch culture content:", error);
      }
    };
    fetchData();

    const handleOpenEditor = () => setIsEditorOpen(true);
    window.addEventListener('open-culture-editor', handleOpenEditor);
    return () => window.removeEventListener('open-culture-editor', handleOpenEditor);
  }, []);

  const canEdit = () => {
    const role = (user?.role || "").toUpperCase();
    const allowedRoles = ["ADMIN", "SUPERADMIN", "TESTER", "MANAGEMENT", "MANAGER", "LEADER", "COORDINATOR", "HEAD", "PRINCIPAL"];
    const isAllowed = allowedRoles.some(r => role.includes(r));
    return isAllowed;
  };

  const culturePractices = [
    { title: "School Assembly", icon: <Users weight="duotone" className="w-7 h-7" />, desc: "Morning gathering where students and teachers connect, celebrate achievements, and build school community.", customLink: "/edu-hub/culture/school-assembly" },
    { title: "Teacher Responsibilities", icon: <ChalkboardTeacher weight="duotone" className="w-7 h-7" />, desc: "Teachers guide students academically and socially while modeling responsibility and leadership.", customLink: "/edu-hub/culture/teacher-responsibilities" },
    { title: "Student Responsibilities & Awards", icon: <Medal weight="duotone" className="w-7 h-7" />, desc: "Encouraging accountability, recognizing student achievements, and celebrating effort and success.", customLink: "/edu-hub/culture/student-responsibilities-awards" },
    { title: "Student Consequences", icon: <Warning weight="duotone" className="w-7 h-7" />, desc: "Helping students learn from mistakes through reflective discipline practices.", customLink: "/edu-hub/culture/student-consequences" },
    { title: "Morning Meetings", icon: <UsersThree weight="duotone" className="w-7 h-7" />, desc: "Daily classroom meetings that promote connection, collaboration, and communication.", customLink: "/edu-hub/culture/morning-meetings" },
    { title: "Circle Time", icon: <ChatCircle weight="duotone" className="w-7 h-7" />, desc: "Structured discussions where students share experiences, build trust, and develop communication skills.", customLink: "/edu-hub/culture/circle-time" },
    { title: "Greeting", icon: <Handshake weight="duotone" className="w-7 h-7" />, desc: "Creating a welcoming environment through respectful daily greetings between students and teachers.", customLink: "/edu-hub/culture/greetings" },
    { title: "Good Things", icon: <Star weight="duotone" className="w-7 h-7" />, desc: "Celebrating positive moments, achievements, and gratitude within the classroom.", customLink: "/edu-hub/culture/good-things" },
    { title: "Launch", icon: <Rocket weight="duotone" className="w-7 h-7" />, desc: "Beginning the day with clear goals, enthusiasm, and purpose.", customLink: "/edu-hub/culture/launch" },
    { title: "Affirmations", icon: <Heart weight="duotone" className="w-7 h-7" />, desc: "Encouraging students through positive statements that build confidence and resilience.", customLink: "/edu-hub/culture/affirmations" },
    { title: "Social Contract", icon: <FileText weight="duotone" className="w-7 h-7" />, desc: "Collaboratively creating classroom expectations and agreements between students and teachers.", customLink: "/edu-hub/culture/social-contract" },
    { title: "Uniforms", icon: <TShirt weight="duotone" className="w-7 h-7" />, desc: "Maintaining school identity and discipline through appropriate uniform standards.", customLink: "/edu-hub/culture/uniforms" },
    { title: "Class History / Transition", icon: <ClockCounterClockwise weight="duotone" className="w-7 h-7" />, desc: "Reflecting on class journeys while preparing students for transitions to the next level." },
    { title: "Parent Interactions", icon: <UsersFour weight="duotone" className="w-7 h-7" />, desc: "Building strong partnerships with parents through communication and collaboration.", customLink: "/edu-hub/culture/parent-interactions" },
    { title: "Day / Days of Wonder", icon: <Lightbulb weight="duotone" className="w-7 h-7" />, desc: "Special school events that inspire curiosity, creativity, and discovery.", customLink: "/edu-hub/culture/days-of-wonder" },
    { title: "Bulletin Boards / Making Learning Visible", icon: <PresentationChart weight="duotone" className="w-7 h-7" />, desc: "Making learning visible, celebrating student work, and building a vibrant school community.", customLink: "/edu-hub/culture/bulletin-boards" },
    { title: "Annual Day", icon: <Confetti weight="duotone" className="w-7 h-7" />, desc: "School-wide celebration showcasing student talents, achievements, and performances.", customLink: "/edu-hub/culture/annual-day" },
    { title: "Fire Safety", icon: <Fire weight="duotone" className="w-7 h-7" />, desc: "Educating students about fire safety practices and emergency response awareness.", customLink: "/edu-hub/culture/fire-safety" },
    { title: "Natural Disaster", icon: <Mountains weight="duotone" className="w-7 h-7" />, desc: "Guidelines and protocols for ensuring safety during natural calamities.", customLink: "/edu-hub/culture/natural-disaster" },
    { title: "Animal Management & Response", icon: <PawPrint weight="duotone" className="w-7 h-7" />, desc: "Protocols for managing and responding to animal presence on school premises safely.", customLink: "/edu-hub/culture/animal-management" },
  ];

  const environmentPractices = [
    { title: "House Points", icon: <Trophy weight="duotone" className="w-7 h-7" />, desc: "Motivational reward system encouraging teamwork and positive behavior.", customLink: "/edu-hub/culture/house-points" },
    { title: "Classroom Layout", icon: <SquaresFour weight="duotone" className="w-7 h-7" />, desc: "Designing physical classroom spaces that promote student engagement, collaboration, and learning.", customLink: "/edu-hub/culture/classroom-layout" },
    { title: "In-Class Shelves", icon: <Books weight="duotone" className="w-7 h-7" />, desc: "Organized storage that ensures learning materials are accessible and structured.", customLink: "/edu-hub/culture/in-class-shelves" },
    { title: "In-Class Library", icon: <BookOpen weight="duotone" className="w-7 h-7" />, desc: "A classroom reading corner encouraging independent reading and literacy development.", customLink: "/edu-hub/culture/in-class-library" },
    { title: "Making Learning Visible", icon: <PresentationChart weight="duotone" className="w-7 h-7" />, desc: "Displaying student work and progress to celebrate learning journeys.", customLink: "/edu-hub/culture/bulletin-boards" },
    { title: "Ekya Mirror", icon: <IdentificationBadge weight="duotone" className="w-7 h-7" />, desc: "Reflection spaces where students can see their progress and recognize achievements.", customLink: "/edu-hub/culture/ekya-mirror" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20 rounded-b-[2.5rem] smooth-scroll">
      <PageEditorControls
        settingKey="page_culture_environment"
        initialData={data}
        onSave={setData}
        title="Culture & Environment Content"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroImage", label: "Hero Background Image", type: "image" },
          { key: "pillarTitle", label: "Pillar Tagline", type: "input" },
          { key: "mainTitle", label: "Main Title (Culture &)", type: "input" },
          { key: "italicTitle", label: "Italic Title (Environment)", type: "input" },
          { key: "cultureIntro1", label: "Culture Paragraph 1", type: "textarea" },
          { key: "cultureIntro2", label: "Culture Paragraph 2", type: "textarea" },
          { key: "envIntro", label: "Environment Intro Text", type: "textarea" },
          { key: "bannerSubtitle", label: "Banner Subtitle", type: "input" },
          { key: "coreSubtitle", label: "Core Principles Subtitle", type: "input" },
          { key: "coreTitle", label: "Core Principles Title", type: "input" },
          { key: "envSubtitle", label: "Environment Subtitle", type: "input" },
          { key: "envTitle", label: "Environment Title", type: "input" },
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



      {/* Hero Banner */}
      {!hideInternalBanner && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-2 relative h-[280px] md:h-[320px] overflow-hidden rounded-[2.5rem] shadow-2xl mb-16">
          <div className="absolute inset-0 bg-slate-900">
            <img
              src={data.heroImage}
              alt="School Culture"
              className="w-full h-full object-cover object-[30%_center] opacity-40 mix-blend-luminosity transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end pl-12 md:pl-20 lg:pl-40 pr-12 pb-20">
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Sparkle className="w-5 h-5 text-primary" weight="fill" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">{data.pillarTitle}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase">
                {data.mainTitle} <span className="text-primary italic">{data.italicTitle}</span>
              </h1>
              <div className="h-1.5 w-32 bg-primary rounded-full mt-4 shadow-[0_0_20px_rgba(234,16,74,0.5)]" />
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 opacity-10 hidden md:block">
            <Rocket className="w-40 h-40 text-white rotate-12" weight="duotone" />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="space-y-24">
          {/* 2. Care About Culture Section */}
          <section className="space-y-12 animate-in fade-in duration-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Heart className="w-6 h-6" weight="duotone" />
              </div>
              <div>
                <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.coreSubtitle || "Core Principles"}</h2>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{data.coreTitle || "CARE ABOUT CULTURE"}</h3>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-primary/20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
              <p className="text-xl text-slate-600 font-medium leading-relaxed mb-6 max-w-4xl mx-auto">
                {data.cultureIntro1}
              </p>
              <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-4xl mx-auto">
                {data.cultureIntro2}
              </p>
            </div>
          </section>

          {/* 3. Culture Practices Grid */}
          <section className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {culturePractices.map((practice, idx) => (
                <PracticeCard key={idx} {...practice} />
              ))}
            </div>
          </section>

          {/* 4. Environment Section Header */}
          <section className="pt-12 border-t-2 border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Buildings className="w-6 h-6" weight="duotone" />
              </div>
              <div>
                <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">{data.envSubtitle || "Physical Spaces"}</h2>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{data.envTitle || "ENVIRONMENT"}</h3>
              </div>
            </div>
            <p className="text-xl text-slate-500 font-medium tracking-tight mb-12 max-w-4xl">
              {data.envIntro}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
              {environmentPractices.map((practice, idx) => (
                <PracticeCard key={idx} {...practice} />
              ))}
            </div>
          </section>

          {/* 5. Custom Sections */}
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

      {/* 6. Footer Section */}
      <footer className="bg-slate-900 -mx-6 md:-mx-12 -mb-12 mt-12 py-16 px-6 md:px-12 text-slate-400 relative overflow-hidden rounded-b-[2.5rem]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">

          <div className="space-y-6 flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Ekya <span className="text-primary italic">Schools</span></h2>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <FacebookLogo className="w-5 h-5" weight="fill" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <TwitterLogo className="w-5 h-5" weight="fill" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <InstagramLogo className="w-5 h-5" weight="fill" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                <LinkedinLogo className="w-5 h-5" weight="fill" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-4">
              © Ekya Schools – Educator Hub
            </p>
          </div>

          <div className="flex justify-center">
            <div className="text-center space-y-3">
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 bg-white/5 px-4 py-1.5 rounded-full">Part of</span>
              <h3 className="text-xl font-bold text-white tracking-tight">CMR Group of Institutions</h3>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-32 h-32 bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <QrCode className="w-full h-full text-slate-800" weight="bold" />
              <span className="text-[8px] font-black uppercase text-slate-400 mt-1">Scan for Guide</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};
