import React, { useState, useEffect } from "react";
import { 
  Book, 
  Heart, 
  Shield, 
  CheckCircle2, 
  User, 
  Clock, 
  Layout, 
  Settings, 
  Coffee,
  ChevronDown,
  FileText,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight as CaretRight,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@pdi/components/ui/button";
import { Card, CardContent } from "@pdi/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@pdi/components/ui/accordion";
import { cn } from "@pdi/lib/utils";
import { useAuth } from "@pdi/hooks/useAuth";
import { settingsService } from "@pdi/services/settingsService";
import { PageEditorControls } from "@pdi/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { PencilSimple } from "@phosphor-icons/react";

const EducatorGuide = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "handbook", label: "Handbook" },
    { id: "confidence", label: "Confidence" },
    { id: "professionalism", label: "Professionalism" },
    { id: "prepared", label: "Be Prepared" },
    { id: "organized", label: "Be Organized" },
    { id: "patient", label: "Be Patient" },
    { id: "realperson", label: "Be Real Person" },
    { id: "discipline", label: "Discipline" },
    { id: "selfcare", label: "Self Care" },
  ];

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    headerPrefix: "Educator Resources",
    headerTitle: "EDUCATOR GUIDE",
    headerSubtitle: "A Comprehensive Guide to Shaping Lifelong Learners",
    headerDesc1: "Welcome to the Ekya Educator Guide. Your role here extends far beyond teaching a subject; it’s about touching lives, nurturing minds, and guiding students to become confident, contributing members of society.",
    headerDesc2: "This guide provides the framework and philosophy essential to our shared success. It outlines practical procedures, fundamental expectations, and essential resources to help you thrive in your journey with us.",
    
    // Teacher Companion Handbook
    handbookTitle: "TEACHER COMPANION HANDBOOK",
    handbookDesc1: "This New Teacher’s Companion is a valuable resource for any teacher who wants the classroom to be a rich and rewarding place for both teachers and students alike.",
    handbookDesc2: "It outlines essential policies, procedures, and expectations for educators. It serves as a quick reference for teachers while providing practical guidance for navigating their roles within the educational institution.",
    handbookBtnText: "Teacher Companion Handbook (AY 24-25)",
    handbookUrl: "https://drive.google.com/file/d/1t6fj33QDXDulm90U-uG0b81bkhorDHDW/view",

    dutyTitle: "DUTY OF CARE",
    dutySubtitle: "Navigating the Classroom with Confidence and Professionalism",
    dutyQuote: '"Research confirms that the teacher makes the greatest difference in the learning success of students."',
    dutyDesc: "Teaching is a physically and emotionally demanding career but also incredibly rewarding. Teachers must demonstrate professionalism, patience, responsibility, and compassion in every interaction within the classroom.",

    profTitle: "PROFESSIONALISM",
    profPoints: "Always do what you believe to be best for your students.\nFoster a comfortable and friendly cooperative relationship between teachers, parents, administrators, and students.\nRespect decisions of your Head of School and understand responsibilities.\nMaintain professionalism and a positive attitude at all times.\nBe mindful of tone when addressing students and colleagues.\nWork cooperatively with colleagues and share best practices.\nEnsure lessons are well prepared and engaging.\nCommunicate clearly with parents and colleagues.\nRespect confidentiality and professional boundaries.",

    prepTitle: "BE PREPARED",
    prepPoints: "Be sure to practice with technology before the start of school.\nUnderstand the platforms used daily such as email and learning systems.\nPlan lessons in advance and ensure materials are prepared.\nPrepare classroom resources and student learning materials beforehand.\nHave backup activities ready for classroom sessions.\nEnsure the classroom environment is ready before students arrive.",

    orgTitle: "BE ORGANIZED",
    orgPoints: "Prepare lesson plans and teaching materials daily.\nKeep lesson resources structured and easy to access.\nMaintain attendance records and assignment tracking.\nOrganize student work, papers, and grading systems.\nMaintain classroom order and learning materials.\nEnsure administrative documentation is properly handled.",

    patTitle: "BE PATIENT",
    patPoints: "Give students enough time to think and respond.\nUnderstand that learning happens at different paces.\nEncourage students who struggle and support them positively.\nMaintain calm and patience when handling difficult situations.\nProvide constructive feedback instead of criticism.",

    realTitle: "Be a Real Person",
    realSubtitle: "AND HONOR EACH STUDENT AS A REAL PERSON",
    realPoints: "Treat students with respect at all times.\nNever embarrass a student or make them feel ashamed.\nEncourage leadership and confidence among students.\nRecognize achievements and support improvement.\nBuild positive relationships with students.\nAllow students to feel safe expressing themselves.\nBe authentic and approachable as a teacher.",

    discTitle: "BE SENSIBLE WITH DISCIPLINE",
    discPoints: "Establish clear classroom rules and expectations.\nMaintain fairness and consistency in discipline.\nEncourage respectful behavior and accountability.\nAddress disruptive behavior calmly and professionally.\nSupport students in learning from mistakes.\nMaintain positive classroom management strategies.",

    selfCareTitle: "BE AWARE OF YOUR OWN NEEDS",
    selfCareDesc: "Teaching is a demanding profession that requires emotional resilience and self-awareness. Taking care of yourself is not selfish—it's necessary for being the best educator for your students.",
    selfCarePoints: "Take time outside of school to decompress.\nPrioritize work-life balance.\nExercise and maintain healthy routines.\nSeek support from colleagues and mentors.\nReflect regularly on your teaching practices.\nFocus on progress rather than perfection.",

    headerImgUrl: "/images/hr/educator_guide_banner.png",
    dutyImgUrl: "/images/hr/duty_of_care.png",
    selfCareImgUrl: "/images/hr/self_care.png"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("hr_educator_guide");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch hr_educator_guide content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw === "TESTER";
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-2 overflow-x-auto scrollbar-hide shrink-0">
        <div className="max-w-7xl mx-auto flex gap-6 whitespace-nowrap">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={cn(
                "text-sm font-semibold transition-all py-2 border-b-2 px-1",
                activeSection === s.id 
                  ? "text-[#EA104A] border-[#EA104A]" 
                  : "text-muted-foreground border-transparent hover:text-[#EA104A]"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-1">
        {/* Header Banner */}
        <header id="overview" className="bg-white border-b border-black/5 relative">
          {canEdit() && (
            <Button 
              className="absolute top-6 right-6 bg-[#EA104A] hover:bg-[#C40E3E] text-white gap-2 z-10 shadow-lg font-bold"
              onClick={() => setIsEditorOpen(true)}
            >
              <PencilSimple size={18} weight="bold" />
              Edit Content
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="absolute top-6 left-10 text-[#EA104A] hover:bg-[#EA104A]/5 gap-2 z-10 font-bold"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Button>

          <PageEditorControls 
            settingKey="hr_educator_guide"
            initialData={data}
            onSave={setData}
            title="Edit Educator Guide Background"
            isOpenExternal={isEditorOpen}
            onOpenChangeExternal={setIsEditorOpen}
            hideFloatingButton={true}
            fields={[
              { key: "headerPrefix", label: "Header Prefix", type: "input" },
              { key: "headerTitle", label: "Header Title", type: "input" },
              { key: "headerSubtitle", label: "Header Subtitle", type: "input" },
              { key: "headerDesc1", label: "Header Description 1", type: "textarea" },
              { key: "headerDesc2", label: "Header Description 2", type: "textarea" },
              { key: "handbookTitle", label: "Handbook Title", type: "input" },
              { key: "handbookDesc1", label: "Handbook Description 1", type: "textarea" },
              { key: "handbookDesc2", label: "Handbook Description 2", type: "textarea" },
              { key: "handbookBtnText", label: "Handbook Button Text", type: "input" },
              { key: "handbookUrl", label: "Handbook URL Link", type: "input" },
              { key: "dutyTitle", label: "Duty of Care Title", type: "input" },
              { key: "dutySubtitle", label: "Duty of Care Subtitle", type: "input" },
              { key: "dutyQuote", label: "Duty of Care Quote", type: "textarea" },
              { key: "dutyDesc", label: "Duty of Care Description", type: "textarea" },
              { key: "profTitle", label: "Professionalism Title", type: "input" },
              { key: "profPoints", label: "Professionalism Points (1 per line)", type: "textarea" },
              { key: "prepTitle", label: "Be Prepared Title", type: "input" },
              { key: "prepPoints", label: "Be Prepared Points (1 per line)", type: "textarea" },
              { key: "orgTitle", label: "Be Organized Title", type: "input" },
              { key: "orgPoints", label: "Be Organized Points (1 per line)", type: "textarea" },
              { key: "patTitle", label: "Be Patient Title", type: "input" },
              { key: "patPoints", label: "Be Patient Points (1 per line)", type: "textarea" },
              { key: "realTitle", label: "Real Person Title", type: "input" },
              { key: "realSubtitle", label: "Real Person Subtitle", type: "input" },
              { key: "realPoints", label: "Real Person Points (1 per line)", type: "textarea" },
              { key: "discTitle", label: "Discipline Title", type: "input" },
              { key: "discPoints", label: "Discipline Points (1 per line)", type: "textarea" },
              { key: "selfCareTitle", label: "Self Care Title", type: "input" },
              { key: "selfCareDesc", label: "Self Care Description", type: "textarea" },
              { key: "selfCarePoints", label: "Self Care Points (1 per line)", type: "textarea" },
              { key: "headerImgUrl", label: "Header Image URL", type: "input" },
              { key: "dutyImgUrl", label: "Duty Image URL", type: "input" },
              { key: "selfCareImgUrl", label: "Self Care Image URL", type: "input" },
            ]}
          />

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 p-12 lg:p-20 items-center">
            <div className="space-y-6">
              <div className="inline-block p-1 px-3 rounded-full bg-[#EA104A]/10 text-[#EA104A] font-bold text-xs uppercase tracking-widest">
                {data.headerPrefix}
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-[#1A1A1A] tracking-tighter">
                {data.headerTitle}
              </h1>
              <p className="text-xl md:text-2xl text-[#EA104A] font-semibold leading-tight">
                {data.headerSubtitle}
              </p>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed text-justify">
                <p>
                  {data.headerDesc1}
                </p>
                <p>
                  {data.headerDesc2}
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-[#EA104A]/5 rounded-3xl -rotate-2 group-hover:rotate-1 transition-transform"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-black/5">
                <img 
                  src={data.headerImgUrl} 
                  alt="Classroom support" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-24 space-y-32">
          {/* Section 2 – Teacher Companion Handbook */}
          <section id="handbook" className="scroll-mt-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-sm font-bold text-[#EA104A] uppercase tracking-[0.2em] mb-4">Section 2</h2>
              <h3 className="text-4xl font-bold text-[#1A1A1A]">{data.handbookTitle}</h3>
            </div>
            
            <Card className="border-none shadow-xl overflow-hidden bg-white">
              <div className="grid md:grid-cols-2">
                <div className="p-10 md:p-16 space-y-8">
                  <p className="text-lg text-[#555555] leading-relaxed whitespace-pre-wrap">
                    {data.handbookDesc1}
                  </p>
                  <p className="text-lg text-[#555555] leading-relaxed whitespace-pre-wrap">
                    {data.handbookDesc2}
                  </p>
                  <Button asChild className="bg-[#EA104A] hover:bg-[#C40E3E] text-white py-6 h-auto px-10 text-lg rounded-xl flex items-center gap-3 w-fit">
                    <a href={data.handbookUrl} target="_blank" rel="noopener noreferrer">
                      <FileText size={20} />
                      {data.handbookBtnText}
                    </a>
                  </Button>
                </div>
                <div className="bg-[#EA104A]/5 flex items-center justify-center p-12">
                   <div className="w-full max-w-sm aspect-[3/4] bg-white rounded-lg shadow-2xl border border-black/10 flex flex-col p-6 space-y-4">
                      <div className="w-full h-1/3 bg-slate-100 rounded-md animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                      <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                      <div className="flex-1"></div>
                      <div className="h-10 w-full bg-[#EA104A]/20 rounded"></div>
                   </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 3 – Navigating with Confidence */}
          <section id="confidence" className="scroll-mt-20">
            <div className="rounded-3xl overflow-hidden relative shadow-2xl h-[400px] flex items-center mb-16 border border-black/5">
              <img 
                src={data.dutyImgUrl} 
                alt="Duty of Care" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10 p-12 md:p-20 text-white max-w-2xl">
                 <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{data.dutyTitle}</h3>
                 <p className="text-xl text-white/80 font-light">{data.dutySubtitle}</p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto text-center space-y-6">
              <p className="text-2xl text-[#1A1A1A] font-medium italic leading-relaxed">
                {data.dutyQuote}
              </p>
              <p className="text-lg text-[#555555] leading-relaxed whitespace-pre-wrap">
                {data.dutyDesc}
              </p>
            </div>
          </section>

          {/* Section 4 – Professionalism */}
          <section id="professionalism" className="scroll-mt-20">
            <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-12 rounded-2xl bg-[#EA104A] flex items-center justify-center text-white shadow-lg">
                  <Shield size={24} />
               </div>
               <h3 className="text-3xl font-bold tracking-tight">{data.profTitle}</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
               {data.profPoints.split('\n').filter(p => p.trim()).map((item, idx) => (
                 <div key={idx} className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-card-hover transition-all flex gap-4 group">
                    <CheckCircle2 className="shrink-0 w-5 h-5 text-[#EA104A] mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[#555555] leading-relaxed">{item}</p>
                 </div>
               ))}
            </div>
          </section>

          {/* Core "Be" Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Section 5 – Be Prepared */}
            <section id="prepared" className="bg-white p-10 rounded-3xl shadow-sm border border-black/5 scroll-mt-20">
                <div className="flex items-center gap-3 mb-8">
                  <Clock className="text-[#EA104A]" />
                  <h3 className="text-2xl font-bold">{data.prepTitle}</h3>
               </div>
               <ul className="space-y-4">
                  {data.prepPoints.split('\n').filter(p => p.trim()).map((text, i) => (
                    <li key={i} className="flex gap-3 text-[#555555] group">
                       <CaretRight size={16} className="shrink-0 mt-1 text-[#EA104A] opacity-30 group-hover:translate-x-1 transition-all" />
                       <span className="leading-relaxed">{text}</span>
                    </li>
                  ))}
               </ul>
            </section>

            {/* Section 6 – Be Organized */}
            <section id="organized" className="bg-white p-10 rounded-3xl shadow-sm border border-black/5 scroll-mt-20">
                <div className="flex items-center gap-3 mb-8">
                  <Layout className="text-[#EA104A]" />
                  <h3 className="text-2xl font-bold">{data.orgTitle}</h3>
               </div>
               <ul className="space-y-4">
                  {data.orgPoints.split('\n').filter(p => p.trim()).map((text, i) => (
                    <li key={i} className="flex gap-3 text-[#555555] group">
                       <CaretRight size={16} className="shrink-0 mt-1 text-[#EA104A] opacity-30 group-hover:translate-x-1 transition-all" />
                       <span className="leading-relaxed">{text}</span>
                    </li>
                  ))}
               </ul>
            </section>

            {/* Section 7 – Be Patient */}
            <section id="patient" className="bg-white p-10 rounded-3xl shadow-sm border border-black/5 scroll-mt-20">
                <div className="flex items-center gap-3 mb-8">
                  <Heart className="text-[#EA104A]" />
                  <h3 className="text-2xl font-bold">{data.patTitle}</h3>
               </div>
               <ul className="space-y-4">
                  {data.patPoints.split('\n').filter(p => p.trim()).map((text, i) => (
                    <li key={i} className="flex gap-3 text-[#555555] group">
                       <CaretRight size={16} className="shrink-0 mt-1 text-[#EA104A] opacity-30 group-hover:translate-x-1 transition-all" />
                       <span className="leading-relaxed">{text}</span>
                    </li>
                  ))}
               </ul>
            </section>

            {/* Section 8 – Be a Real Person */}
            <section id="realperson" className="bg-white p-10 rounded-3xl shadow-sm border border-black/5 scroll-mt-20">
                <div className="flex items-center gap-3 mb-8">
                  <User className="text-[#EA104A]" />
                  <h3 className="text-2xl font-bold uppercase text-sm">{data.realTitle}</h3>
               </div>
               <h4 className="text-lg font-bold mb-6 text-[#1A1A1A]">{data.realSubtitle}</h4>
               <ul className="space-y-4">
                  {data.realPoints.split('\n').filter(p => p.trim()).map((text, i) => (
                    <li key={i} className="flex gap-3 text-[#555555] group">
                       <CaretRight size={16} className="shrink-0 mt-1 text-[#EA104A] opacity-30 group-hover:translate-x-1 transition-all" />
                       <span className="leading-relaxed">{text}</span>
                    </li>
                  ))}
               </ul>
            </section>
          </div>

          {/* Section 9 – Be Sensible with Discipline */}
          <section id="discipline" className="scroll-mt-20">
            <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden rounded-3xl">
               <CardContent className="p-12 md:p-20 flex flex-col items-center">
                   <Settings className="w-16 h-16 text-[#EA104A] mb-8" />
                  <h3 className="text-4xl font-black mb-12 tracking-tight">{data.discTitle}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                     {data.discPoints.split('\n').filter(p => p.trim()).map((text, i) => (
                       <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                          <p className="text-white/80 leading-relaxed text-center">{text}</p>
                       </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
          </section>

          {/* Section 10 – Be Aware of Your Own Needs */}
            <section id="selfcare" className="scroll-mt-20">
             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 relative">
                    <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
                    <img 
                      src={data.selfCareImgUrl} 
                      alt="Self Care" 
                      className="relative w-full h-auto rounded-3xl"
                    />
                </div>
                <div className="order-1 md:order-2 space-y-10">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <Coffee className="text-[#EA104A]" />
                         <h3 className="text-3xl font-bold tracking-tight">{data.selfCareTitle}</h3>
                      </div>
                      <p className="text-[#555555] text-lg leading-relaxed whitespace-pre-wrap">
                        {data.selfCareDesc}
                      </p>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {data.selfCarePoints.split('\n').filter(p => p.trim()).map((item, i) => (
                        <div key={i} className="flex gap-3 text-sm text-[#333333] font-medium p-4 bg-white rounded-xl shadow-sm border border-black/5 hover:border-[#EA104A]/20 transition-all">
                           <CheckCircle2 size={18} className="text-[#EA104A] shrink-0" />
                           {item}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 px-6 shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6 text-xl font-bold tracking-tight">
                    <span className="text-[#EA104A]">EKYA</span> Schools
                </div>
                <p className="text-white/60 mb-8 max-w-md">
                  Empowering educators to navigate the classroom with confidence, professionalism, and self-awareness.
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
              <p>© {new Date().getFullYear()} EKYA Schools – Educator Professional Development Resources</p>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default EducatorGuide;
