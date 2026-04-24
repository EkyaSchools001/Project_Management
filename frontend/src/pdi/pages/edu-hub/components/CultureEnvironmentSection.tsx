import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, ChalkboardTeacher, Medal, Warning, UsersThree, ChatCircle, Handshake,
  Star, Rocket, Heart, FileText, TShirt, ClockCounterClockwise, UsersFour,
  Lightbulb, PushPin, Confetti, Fire, CloudWarning, PawPrint,
  Trophy, SquaresFour, Books, BookOpen, PresentationChart, IdentificationBadge,
  FacebookLogo, TwitterLogo, InstagramLogo, LinkedinLogo, QrCode, Sparkle, CaretLeft, Buildings, PencilSimple
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PageEditorControls } from "@pdi/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@pdi/services/settingsService";
import { useAuth } from "@pdi/hooks/useAuth";

interface PracticeCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  link?: string;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ icon, title, desc, link }) => (
  <div 
    onClick={() => link && window.open(link, '_blank')}
    className={`bg-white rounded-2xl p-6 shadow-sm border border-primary/20 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 group flex flex-col h-full ${link ? 'cursor-pointer' : ''}`}
  >
    <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1">{desc}</p>
  </div>
);

export const CultureEnvironmentSection = () => {
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
    envIntro: "What is the physical environment we create for children? How do we create and organize spaces?"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_culture_environment");
        if (result && result.value) {
          setData(prev => ({ ...prev, ...result.value }));
        }
      } catch (error) {
        console.error("Failed to fetch culture content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const role = user?.role?.toUpperCase() || "";
    return role.includes("ADMIN") || role === "SUPERADMIN" || role.includes("LEADER") || role === "TESTER";
  };

  const culturePractices = [
    { title: "School Assembly", icon: <Users weight="duotone" className="w-7 h-7" />, desc: "Morning gathering where students and teachers connect, celebrate achievements, and build school community.", link: "https://docs.google.com/document/d/1GtI2mK1xgCW2TXhvpWrgwU32afANLUByBmRXgtbVF9s/edit?tab=t.0#" },
    { title: "Teacher Responsibilities", icon: <ChalkboardTeacher weight="duotone" className="w-7 h-7" />, desc: "Teachers guide students academically and socially while modeling responsibility and leadership.", link: "https://docs.google.com/document/d/1fc9s_Q_7_kXJ3xTWEniFaRtSc_yRSjDV_T55B8TijVA/edit?tab=t.0#" },
    { title: "Student Responsibilities & Awards", icon: <Medal weight="duotone" className="w-7 h-7" />, desc: "Encouraging accountability, recognizing student achievements, and celebrating effort and success.", link: "https://docs.google.com/document/d/11Ry7xeV901koJDYWzta5I48Y0ODMBwmT6NprI5uuWtE/edit?tab=t.0" },
    { title: "Student Consequences", icon: <Warning weight="duotone" className="w-7 h-7" />, desc: "Helping students learn from mistakes through reflective discipline practices.", link: "https://docs.google.com/document/d/1EggmCSmM8RCZli90_L1BFqvOkwJECU-eOvbs3aVW_Fo/edit?tab=t.0#" },
    { title: "Morning Meetings", icon: <UsersThree weight="duotone" className="w-7 h-7" />, desc: "Daily classroom meetings that promote connection, collaboration, and communication.", link: "https://docs.google.com/document/d/1bajQithbKqrcdlxlDpP5XuNqd58YCvOza0RXFDyXO7s/edit?tab=t.0#" },
    { title: "Circle Time", icon: <ChatCircle weight="duotone" className="w-7 h-7" />, desc: "Structured discussions where students share experiences, build trust, and develop communication skills.", link: "https://docs.google.com/document/d/1rKT8VC4qotAJIcYIJYsKUWoUaPTqdevQypyMVTgIoR8/edit?tab=t.0" },
    { title: "Greeting", icon: <Handshake weight="duotone" className="w-7 h-7" />, desc: "Creating a welcoming environment through respectful daily greetings between students and teachers.", link: "https://docs.google.com/document/d/1xuGYxBEDT0EwlNTQcFF-U6e_1UlO36OAgX54A_ehvto/edit?tab=t.0#" },
    { title: "Good Things", icon: <Star weight="duotone" className="w-7 h-7" />, desc: "Celebrating positive moments, achievements, and gratitude within the classroom.", link: "https://docs.google.com/document/d/1RZMEFCzQ-yhWGjcJ9lIpiSTpCriR9rfgec52ze6Ix8M/edit?tab=t.0#" },
    { title: "Launch", icon: <Rocket weight="duotone" className="w-7 h-7" />, desc: "Beginning the day with clear goals, enthusiasm, and purpose.", link: "https://docs.google.com/document/d/1w6iRWxmWkaIjG8yBRMQi_V9j98fD6rg3oZLeH10xjs8/edit?tab=t.0#" },
    { title: "Affirmations", icon: <Heart weight="duotone" className="w-7 h-7" />, desc: "Encouraging students through positive statements that build confidence and resilience.", link: "https://docs.google.com/document/d/12Y4QUdvJg5gSW6sl9nhCobLFbYq6PlxaCWEFwXYQlSM/edit?tab=t.0#" },
    { title: "Social Contract", icon: <FileText weight="duotone" className="w-7 h-7" />, desc: "Collaboratively creating classroom expectations and agreements between students and teachers.", link: "https://docs.google.com/document/d/1SgRm1b-5eFx3_S6FQKFpXkoFvcJGeQ5dugBVBE2H0lg/edit?tab=t.0" },
    { title: "Uniforms", icon: <TShirt weight="duotone" className="w-7 h-7" />, desc: "Maintaining school identity and discipline through appropriate uniform standards.", link: "https://docs.google.com/document/d/1b9UyXW-OhGidilf4_fHeBVLi3DU2fSxiHJS3rfdNNnY/edit?tab=t.0#heading=h.oyzfurtqalvo" },
    { title: "Class History / Transition", icon: <ClockCounterClockwise weight="duotone" className="w-7 h-7" />, desc: "Reflecting on class journeys while preparing students for transitions to the next level.", link: "https://docs.google.com/document/d/1YEdiYlwVosEvuWi0fdqGj9sycKWFPDQqeD7_u5St4SQ/edit?tab=t.0#" },
    { title: "Parent Interactions", icon: <UsersFour weight="duotone" className="w-7 h-7" />, desc: "Building strong partnerships with parents through communication and collaboration.", link: "https://docs.google.com/document/d/1BI6gKBB_BW37aTKe3QuAvPEPsAcNpKeBx5ZIqVJGPD8/edit?tab=t.0#" },
    { title: "Day / Days of Wonder", icon: <Lightbulb weight="duotone" className="w-7 h-7" />, desc: "Special school events that inspire curiosity, creativity, and discovery.", link: "https://docs.google.com/document/d/1Y-eMW0IsGZIt5-YPlIi459xD6KMNQpVTcMBw2WhuefU/edit?tab=t.0" },
    { title: "Bulletin Boards / Making Learning Visible", icon: <PushPin weight="duotone" className="w-7 h-7" />, desc: "Displaying student work and learning journeys to celebrate progress and growth.", link: "https://docs.google.com/document/d/1DVu_qA5qxd6q4Ev3ypxSXpl45WqLRWi8g9QYZgQum-A/edit?tab=t.0" },
    { title: "Annual Day", icon: <Confetti weight="duotone" className="w-7 h-7" />, desc: "School-wide celebration showcasing student talents, achievements, and performances.", link: "https://docs.google.com/document/d/1WrTIimMLJoFeX3KoJeOFiba00VBuTOvwfp0QcK7h4dY/edit?tab=t.0" },
    { title: "Fire Safety", icon: <Fire weight="duotone" className="w-7 h-7" />, desc: "Educating students about fire safety practices and emergency response awareness.", link: "https://docs.google.com/document/d/1A-4Z1Tvz8RXO3c9rOKSJh8v1BvaQfGmW_Xxo8hz1QS0/edit?tab=t.0" },
    { title: "Natural Disaster", icon: <CloudWarning weight="duotone" className="w-7 h-7" />, desc: "Preparing students and staff for emergency preparedness and safety protocols.", link: "https://docs.google.com/document/d/1yp3uNeYzvHrzSGvl0g0I_eSkNbxWBcnVCTe3CZ-Vj3U/edit?tab=t.0" },
    { title: "Animal Management & Response", icon: <PawPrint weight="duotone" className="w-7 h-7" />, desc: "Ensuring safety procedures when encountering animals on or near school premises.", link: "https://docs.google.com/document/d/1cpik1pSB7ypEzlBAJQZefk93z0djNfDkfb67xkoKitI/edit?tab=t.0" },
  ];

  const environmentPractices = [
    { title: "House Points", icon: <Trophy weight="duotone" className="w-7 h-7" />, desc: "Motivational reward system encouraging teamwork and positive behavior.", link: "https://docs.google.com/document/d/1CzDB-A7sC4Nu1Jz0FrhktAF_NZ1OLI-S-TXhcRCO5a0/edit?tab=t.0#" },
    { title: "Classroom Layout", icon: <SquaresFour weight="duotone" className="w-7 h-7" />, desc: "Intentional classroom arrangement designed to promote collaboration and focus.", link: "https://docs.google.com/document/d/1B1rw79WggxBQjfxxSNhXrWceOfWSkKQLVVC_iPee1i4/edit?tab=t.0#" },
    { title: "In-Class Shelves", icon: <Books weight="duotone" className="w-7 h-7" />, desc: "Organized storage that ensures learning materials are accessible and structured.", link: "https://docs.google.com/document/d/1V2AH03lL7lFjNY0kwVnHvmC0dqUuP0zRCg1yWLkNmF4/edit?tab=t.0#" },
    { title: "In-Class Library", icon: <BookOpen weight="duotone" className="w-7 h-7" />, desc: "A classroom reading corner encouraging independent reading and literacy development.", link: "https://docs.google.com/document/d/1jYYHb6xeU2R0tXgzycFAr0TPbQPE47r0QERRtQ0kPlA/edit?tab=t.0#" },
    { title: "Making Learning Visible", icon: <PresentationChart weight="duotone" className="w-7 h-7" />, desc: "Displaying student work and progress to celebrate learning journeys.", link: "https://docs.google.com/document/d/1DVu_qA5qxd6q4Ev3ypxSXpl45WqLRWi8g9QYZgQum-A/edit?tab=t.0#" },
    { title: "Ekya Mirror", icon: <IdentificationBadge weight="duotone" className="w-7 h-7" />, desc: "Reflection spaces where students can see their progress and recognize achievements.", link: "https://docs.google.com/document/d/14-dPIVgV_HdlTWDsfgGGnkbtQOHAHxGnbTd5VEu1znk/edit?tab=t.0#" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-12 rounded-b-[2.5rem] smooth-scroll overflow-x-hidden">
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
        ]}
      />

      {/* 1. Immersive Hero Banner (Premium Hub Style) */}
      <div className="relative w-full h-[320px] overflow-hidden -mt-6 -mx-6 md:-mx-12 rounded-b-[3rem] shadow-2xl mb-16">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src={data.heroImage} 
            alt="School Culture"
            className="w-full h-full object-cover object-[30%_center] opacity-40 mix-blend-luminosity transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end px-12 md:px-16 lg:px-20 xl:px-24 pb-12">
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

        {canEdit() && (
          <Button 
            className="absolute top-10 right-10 bg-[#E63946] hover:bg-[#D62839] text-white gap-2 z-20 shadow-lg"
            onClick={() => setIsEditorOpen(true)}
          >
            <PencilSimple size={18} weight="bold" />
            Edit Content
          </Button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/edu-hub')}
          className="mb-8 -ml-2 text-slate-400 hover:text-primary hover:bg-primary/5 gap-2 font-bold uppercase tracking-widest text-[10px]"
        >
          <CaretLeft weight="bold" /> Back
        </Button>

        <div className="space-y-24">
          {/* 2. Care About Culture Section */}
          <section className="space-y-12 animate-in fade-in duration-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Heart className="w-6 h-6" weight="duotone" />
              </div>
              <div>
                <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Core Principles</h2>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">CARE ABOUT CULTURE</h3>
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
                <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase">Physical Spaces</h2>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">ENVIRONMENT</h3>
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
