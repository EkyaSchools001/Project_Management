import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Users, 
  Brain, 
  Puzzle, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PencilSimple } from "@phosphor-icons/react";
import { Card, CardContent } from '@/components/ui/card';
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { Button } from '@/components/ui/button';
import { PortalBanner } from "@/components/layout/PortalBanner";
import { Heart } from "@phosphor-icons/react";

const WellBeing = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    headerTitle: "WELLBEING",
    headerSubtitle: "Student Development Department",
    introPillar: "Health and Wellbeing",
    introText: "The Wellbeing vertical is therefore a critical focus area for all campuses. We invite all educators and specialist staff members to explore this page and understand the priorities of wellbeing.",
    visionTitle: "VISION",
    visionText: "Every student will feel seen, heard, valued, supported and encouraged to achieve their full potential and flourish in their student life.",
    missionTitle: "MISSION",
    missionText: "To build a team that will be instrumental in empowering students to engage as committed and responsible global citizens with shared values awareness, compassion and engagement.",
    pillarsTitle: "THE PILLARS",
    
    pillar1Title: "AWARENESS",
    pillar1Desc: "Build a purposeful, motivated and continuously learning community.",
    pillar1Students: "Awareness programs\nClassroom introductions\nLifeSkills sessions",
    pillar1Teachers: "Teacher awareness sessions\nCampus specific workshops",
    pillar1Parents: "Awareness sessions",

    pillar2Title: "COMPASSION",
    pillar2Desc: "Cultivate skills of self-care, empathy and common humanity.",
    pillar2Students: "Monthly Schoology posts\nTeacher / HOS check-ins",
    pillar2Parents: "Parent teacher interaction\nMonthly newsletter bulletin\nLifeSkills learning showcase",

    pillar3Title: "ENGAGEMENT",
    pillar3Desc: "Build self-regulation, self-awareness and a sense of belonging.",
    pillar3Students: "Counselling\nRemediation\nCampus specific student workshops",
    pillar3Parents: "Weekly open line"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("hr_wellbeing");
        if (result && result.value) {
          setData(prev => ({ ...prev, ...result.value }));
        }
      } catch (error) {
        console.error("Failed to fetch hr_wellbeing content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' || user?.role === 'TESTER';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      <PageEditorControls
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        settingKey="hr_wellbeing"
        title="WellBeing Hub"
        initialData={data}
        onSave={setData}
        hideFloatingButton={true}
        fields={[
          { key: "headerTitle", label: "Header Title", type: "input" },
          { key: "headerSubtitle", label: "Header Subtitle", type: "input" },
          { key: "introPillar", label: "Intro Highlight Pillar", type: "input" },
          { key: "introText", label: "Intro Main Text", type: "textarea" },
          { key: "visionTitle", label: "Vision Title", type: "input" },
          { key: "visionText", label: "Vision Description", type: "textarea" },
          { key: "missionTitle", label: "Mission Title", type: "input" },
          { key: "missionText", label: "Mission Description", type: "textarea" },
          { key: "pillarsTitle", label: "Pillars Section Title", type: "input" },
          { key: "pillar1Title", label: "Pillar 1 Title", type: "input" },
          { key: "pillar1Desc", label: "Pillar 1 Description", type: "textarea" },
          { key: "pillar1Students", label: "Pillar 1 Students (1 per line)", type: "textarea" },
          { key: "pillar1Teachers", label: "Pillar 1 Teachers (1 per line)", type: "textarea" },
          { key: "pillar1Parents", label: "Pillar 1 Parents (1 per line)", type: "textarea" },
          { key: "pillar2Title", label: "Pillar 2 Title", type: "input" },
          { key: "pillar2Desc", label: "Pillar 2 Description", type: "textarea" },
          { key: "pillar2Students", label: "Pillar 2 Students (1 per line)", type: "textarea" },
          { key: "pillar2Parents", label: "Pillar 2 Parents (1 per line)", type: "textarea" },
          { key: "pillar3Title", label: "Pillar 3 Title", type: "input" },
          { key: "pillar3Desc", label: "Pillar 3 Description", type: "textarea" },
          { key: "pillar3Students", label: "Pillar 3 Students (1 per line)", type: "textarea" },
          { key: "pillar3Parents", label: "Pillar 3 Parents (1 per line)", type: "textarea" },
        ]}
      />

      <PortalBanner 
        title={data.headerTitle}
        subtitle={data.headerSubtitle}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit}
        icon={Heart}
        className="mt-6 mb-12"
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-20 space-y-24">
        
        {/* 2. Introduction Section */}
        <section className="max-w-4xl mx-auto transform -translate-y-32 relative z-20">
          <Card className="shadow-2xl border-none overflow-hidden rounded-3xl bg-white/95 backdrop-blur-md">
            <CardContent className="p-10 md:p-14 text-center space-y-6">
              <p className="text-xl md:text-2xl text-[#1A1A1A] font-medium leading-relaxed">
                One of the main pillars of the Student Development Department is <span className="text-[#EA104A] font-bold">{data.introPillar}</span>.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap">
                {data.introText}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 3. Vision & Mission Section */}
        <section className="grid md:grid-cols-2 gap-10 -mt-12">
          {/* Vision */}
          <div className="group bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-black/5 hover:border-[#EA104A]/30 hover:shadow-xl transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-[#EA104A]/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#EA104A] transition-all duration-500">
              <HeartHandshake className="text-[#EA104A] group-hover:text-white w-10 h-10 transition-colors" />
            </div>
            <h2 className="text-3xl font-black text-[#1A1A1A] mb-6 tracking-tight uppercase">{data.visionTitle}</h2>
            <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
              {data.visionText}
            </p>
          </div>

          {/* Mission */}
          <div className="group bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-black/5 hover:border-[#EA104A]/30 hover:shadow-xl transition-all duration-300">
            <div className="w-20 h-20 rounded-2xl bg-[#EA104A]/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#EA104A] transition-all duration-500">
              <Users className="text-[#EA104A] group-hover:text-white w-10 h-10 transition-colors" />
            </div>
            <h2 className="text-3xl font-black text-[#1A1A1A] mb-6 tracking-tight uppercase">{data.missionTitle}</h2>
            <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
              {data.missionText}
            </p>
          </div>
        </section>

        {/* 4. The Pillars Section */}
        <section className="space-y-16">
          <div className="text-center">
            <h2 className="inline-block text-4xl font-black text-[#1A1A1A] tracking-tighter relative uppercase">
              {data.pillarsTitle}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full h-1 bg-[#EA104A] rounded-full"></div>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Pillar 1: Awareness */}
            <Card className="border-none shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-3xl overflow-hidden group">
              <div className="h-4 bg-[#EA104A]"></div>
              <CardContent className="p-8 md:p-10 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#EA104A]/10 transition-colors">
                    <Brain className="w-8 h-8 text-[#EA104A]" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight uppercase">{data.pillar1Title}</h3>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                  {data.pillar1Desc}
                </p>
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-[#EA104A] uppercase tracking-wider mb-3">Students</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(data.pillar1Students || "").split('\n').filter(p => p.trim()).map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#EA104A] uppercase tracking-wider mb-3">Teachers / HOS</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(data.pillar1Teachers || "").split('\n').filter(p => p.trim()).map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#EA104A] uppercase tracking-wider mb-3">Parents</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(data.pillar1Parents || "").split('\n').filter(p => p.trim()).map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2: Compassion */}
            <Card className="border-none shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-3xl overflow-hidden group">
              <div className="h-4 bg-[#EA104A]"></div>
              <CardContent className="p-8 md:p-10 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#EA104A]/10 transition-colors">
                    <Heart className="w-8 h-8 text-[#EA104A]" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight uppercase">{data.pillar2Title}</h3>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                  {data.pillar2Desc}
                </p>
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-[#EA104A] uppercase tracking-wider mb-3">Students</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(data.pillar2Students || "").split('\n').filter(p => p.trim()).map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#EA104A] uppercase tracking-wider mb-3">Parents</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(data.pillar2Parents || "").split('\n').filter(p => p.trim()).map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3: Engagement */}
            <Card className="border-none shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-3xl overflow-hidden group">
              <div className="h-4 bg-[#EA104A]"></div>
              <CardContent className="p-8 md:p-10 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#EA104A]/10 transition-colors">
                    <Puzzle className="w-8 h-8 text-[#EA104A]" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight uppercase">{data.pillar3Title}</h3>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                  {data.pillar3Desc}
                </p>
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-[#EA104A] uppercase tracking-wider mb-3">Students</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(data.pillar3Students || "").split('\n').filter(p => p.trim()).map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#EA104A] uppercase tracking-wider mb-3">Parents</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {(data.pillar3Parents || "").split('\n').filter(p => p.trim()).map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 px-6 shrink-0 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6 text-xl font-bold tracking-tight">
                  <span className="text-[#EA104A]">EKYA</span> Schools
              </div>
              <p className="text-white/60 mb-8 max-w-md leading-relaxed">
                Empowering students and educators to engage as committed and responsible global citizens with shared values awareness, compassion, and engagement.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#EA104A] transition-colors">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Group Links</h4>
              <ul className="space-y-3 text-white/50 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">CMR Group</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Opportunities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Student Platform</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Mobile App</h4>
              <div className="w-32 h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-[#EA104A]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-[10px] font-black tracking-[0.2em] text-[#EA104A] mb-1">COMING SOON</span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">In Progress</span>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
            <p>© {new Date().getFullYear()} Ekya Schools – Student Development & Wellbeing</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WellBeing;
