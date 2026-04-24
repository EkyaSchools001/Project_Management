import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  Calculator, 
  Download, 
  ExternalLink,
  Mail,
  Search,
  BookOpen,
  PieChart,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@pdi/components/ui/button";
import { Card, CardContent } from "@pdi/components/ui/card";
import { Input } from "@pdi/components/ui/input";
import { Badge } from "@pdi/components/ui/badge";
import { PencilSimple } from "@phosphor-icons/react";
import { useAuth } from "@pdi/hooks/useAuth";
import { settingsService } from "@pdi/services/settingsService";
import { PageEditorControls } from "@pdi/components/educator-hub/InstitutionalIdentity/PageEditorControls";

const SECTIONS = [
  { id: "job-description", label: "Job Description", icon: Briefcase },
  { id: "policies", label: "Know Your Policies", icon: ShieldCheck },
  { id: "income-tax", label: "Income Tax", icon: Calculator }
];

export default function EducatorEssentials() {
  const [activeSection, setActiveSection] = useState("job-description");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    headerBadge: "Human Resource",
    headerTitle: "Educator Essentials",
    headerSubtitle: "Your centralized access to job descriptions, institutional policies, and income tax guidelines.",

    // Job Description Section
    rolePurposeTitle: "Role Purpose",
    rolePurposeContent: "As an Ekya Educator, your primary purpose is to facilitate meaningful learning experiences that align with the institution's curriculum and vision. You are a catalyst for student growth, encouraging critical thinking, empathy, and excellence.",
    roleReportLine1: "Reports to Coordinator / School Leader",
    roleReportLine2: "Full-time Professional Role",

    jd1Title: "Curriculum & Planning",
    jd1Points: "Design and implement engaging lesson plans in alignment with Ekya's pedagogical approach.\nAdapt curriculum materials to accommodate diverse learning styles and abilities.\nCollaborate with peers horizontally and vertically to ensure curriculum continuity.",
    
    jd2Title: "Instruction & Delivery",
    jd2Points: "Utilize research-based instructional strategies to foster student engagement.\nIncorporate technology and real-world applications into daily teaching.\nMaintain an active, student-centric classroom environment.",
    
    jd3Title: "Assessment & Feedback",
    jd3Points: "Design authentic formative and summative assessments to measure student understanding.\nProvide timely, constructive, and actionable feedback to students and parents.\nMaintain accurate records of student progress using institutional platforms.",
    
    jd4Title: "Culture & Environment",
    jd4Points: "Cultivate a safe, inclusive, and respectful classroom culture.\nEstablish clear routines and behavioural expectations.\nBuild strong, positive relationships with students, parents, and colleagues.",
    
    jd5Title: "Professional Practice",
    jd5Points: "Actively participate in professional development and continuous learning.\nEngage in reflective practice and peer observations.\nAdhere to all school policies and uphold the professional code of conduct.",

    // Dynamic Lists
    taxDocsText: "IT Declaration Guidelines 2025-26 | https://drive.google.com/file/d/1RDCY2_Eu_I0Yv_Si8-mw6xVhJnOhMQdQ/view | Learn how to accurately declare your income tax for the upcoming financial year to optimize your savings.\nIT Proof Submission Guidelines 2025-26 | https://drive.google.com/file/d/1z9atkjodYe_1nwDXq9B6dgQvyxYqeN2B/view | Step-by-step comprehensive guide to submitting your valid IT proofs to avoid unexpected salary deductions.",
    
    policiesText: "Teaching Staff HR Policies 2025-26 | https://docs.google.com/document/d/1IOzSegINcgGGHPKq2x5GtFIhAlwr5MHm5qmP_kPusWo/edit?tab=t.0#heading=h.g2nxrjvq2tat | General\nAssistant Teaching Staff HR Policies 2025-26 | | General\nBehavioural Counselling HR Policies 2025-26 | | Specialist\nPhysical Education Educators HR Policies | | Specialist\nDesign and Technology Educators HR Policies | | Specialist\nVisual Arts Educators HR Policies | | Specialist\nPerforming Arts Educators HR Policies | | Specialist\nCCE - HR Policies 2025-26 | | General\nAll Staff Dress Code Policy | | Guidelines\nStaff Fee Concession Policy AY 2025-26 | | Benefits"
  });

  const POLICIES = (data.policiesText || "").split('\n').filter(l => l.includes('|')).map((line, idx) => {
    const [title, url, category] = line.split('|').map(s => s.trim());
    return { id: `p${idx}`, title, url, category };
  });

  const TAX_DOCS = (data.taxDocsText || "").split('\n').filter(l => l.includes('|')).map((line, idx) => {
    const [title, url, description] = line.split('|').map(s => s.trim());
    return { id: `t${idx}`, title, url, description };
  });

  const JD_DATA = [
    {
      title: data.jd1Title,
      color: "border-l-blue-500",
      bg: "bg-blue-50/30",
      points: data.jd1Points.split('\n').filter(p => p.trim())
    },
    {
      title: data.jd2Title,
      color: "border-l-[#EA104A]",
      bg: "bg-[#EA104A]/5",
      points: data.jd2Points.split('\n').filter(p => p.trim())
    },
    {
      title: data.jd3Title,
      color: "border-l-emerald-500",
      bg: "bg-emerald-50/30",
      points: data.jd3Points.split('\n').filter(p => p.trim())
    },
    {
      title: data.jd4Title,
      color: "border-l-amber-500",
      bg: "bg-amber-50/30",
      points: data.jd4Points.split('\n').filter(p => p.trim())
    },
    {
      title: data.jd5Title,
      color: "border-l-purple-500",
      bg: "bg-purple-50/30",
      points: data.jd5Points.split('\n').filter(p => p.trim())
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("hr_educator_essentials");
        if (result && result.value) {
          setData(prev => ({ ...prev, ...result.value }));
        }
      } catch (error) {
        console.error("Failed to fetch hr_educator_essentials content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw === "TESTER";
  };

  // Smooth scroll and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && 
            element.offsetTop <= scrollPosition && 
            (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const filteredPolicies = POLICIES.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-[#333333]">
      {/* 1. Header Banner */}
      <header className="bg-gradient-to-r from-[#EA104A] to-[#B80A37] text-white py-16 px-6 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 transition-colors rounded-full text-xs font-bold tracking-widest text-white uppercase mb-6 backdrop-blur-md border border-white/20">
              <BookOpen size={14} />
              {data.headerBadge}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm">
              {data.headerTitle}
            </h1>
            <p className="text-xl text-white/90 font-light leading-relaxed">
              {data.headerSubtitle}
            </p>
          </div>
          <div className="hidden md:flex gap-4 opacity-80 mix-blend-overlay">
             <FileText size={100} strokeWidth={1} />
          </div>
        </div>

        {canEdit() && (
          <Button 
            className="absolute top-6 right-6 bg-white hover:bg-slate-100 text-[#EA104A] gap-2 z-10 shadow-lg font-bold"
            onClick={() => setIsEditorOpen(true)}
          >
            <PencilSimple size={18} weight="bold" />
            Edit Content
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-white hover:bg-white/10 gap-2 z-10 font-bold underline decoration-white/30"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Button>
      </header>

      <PageEditorControls 
        settingKey="hr_educator_essentials"
        initialData={data}
        onSave={setData}
        title="Edit Educator Essentials Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "headerBadge", label: "Header Badge", type: "input" },
          { key: "headerTitle", label: "Header Title", type: "input" },
          { key: "headerSubtitle", label: "Header Subtitle", type: "input" },
          { key: "rolePurposeTitle", label: "Role Purpose Title", type: "input" },
          { key: "rolePurposeContent", label: "Role Purpose Content", type: "textarea" },
          { key: "roleReportLine1", label: "Report Line 1", type: "input" },
          { key: "roleReportLine2", label: "Report Line 2", type: "input" },
          { key: "jd1Title", label: "JD Section 1 Title", type: "input" },
          { key: "jd1Points", label: "JD Section 1 Points (1 per line)", type: "textarea" },
          { key: "jd2Title", label: "JD Section 2 Title", type: "input" },
          { key: "jd2Points", label: "JD Section 2 Points (1 per line)", type: "textarea" },
          { key: "jd3Title", label: "JD Section 3 Title", type: "input" },
          { key: "jd3Points", label: "JD Section 3 Points (1 per line)", type: "textarea" },
          { key: "jd4Title", label: "JD Section 4 Title", type: "input" },
          { key: "jd4Points", label: "JD Section 4 Points (1 per line)", type: "textarea" },
          { key: "jd5Title", label: "JD Section 5 Title", type: "input" },
          { key: "jd5Points", label: "JD Section 5 Points (1 per line)", type: "textarea" },
          { key: "taxDocsText", label: "Tax Documents (Title | URL | Description)", type: "textarea" },
          { key: "policiesText", label: "Policies (Title | URL | Category)", type: "textarea" },
        ]}
      />

      {/* 2. Sticky Navigation Bar */}
      <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 py-3 min-w-max">
            {SECTIONS.map((section) => {
              const active = activeSection === section.id;
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                    ${active 
                      ? 'bg-[#EA104A] text-white shadow-md shadow-[#EA104A]/30 scale-105' 
                      : 'text-[#666] hover:bg-black/5 hover:text-[#1A1A1A]'
                    }
                  `}
                >
                  <Icon size={16} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-24">
        
        {/* SECTION 1: Educator Job Description */}
        <section id="job-description" className="scroll-mt-32">
          <div className="flex gap-4 items-center mb-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
               <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Educator Job Description</h2>
              <p className="text-[#666] text-sm font-medium mt-1 uppercase tracking-widest">Roles & Responsibilities</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <Card className="border-none shadow-xl bg-white sticky top-36">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-[#1A1A1A]">{data.rolePurposeTitle}</h3>
                  <p className="text-[#555] leading-relaxed mb-6">
                    {data.rolePurposeContent}
                  </p>
                  <div className="h-px w-full bg-slate-100 my-6"></div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-[#444] font-medium">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div> {data.roleReportLine1}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#444] font-medium">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div> {data.roleReportLine2}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
              {JD_DATA.map((role, idx) => (
                <Card key={idx} className={`border-none shadow-sm hover:shadow-md transition-shadow ${role.bg} overflow-hidden rounded-2xl`}>
                  <div className={`p-6 md:p-8 border-l-4 ${role.color}`}>
                    <h4 className="text-lg font-bold text-[#1A1A1A] mb-4">{role.title}</h4>
                    <ul className="space-y-3">
                      {role.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex gap-3 text-[#555] leading-relaxed">
                           <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                           <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: Know Your Policies */}
        <section id="policies" className="scroll-mt-32 pt-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">KYP - Know Your Policies</h2>
                  <p className="text-[#666] text-sm font-medium mt-1 uppercase tracking-widest">Document Repository</p>
                </div>
              </div>
              
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input 
                  placeholder="Search policies..." 
                  className="pl-10 rounded-xl bg-white border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredPolicies.map((policy) => (
                 <a 
                   href={policy.url || "#"} 
                   target={policy.url ? "_blank" : undefined}
                   rel={policy.url ? "noopener noreferrer" : undefined}
                   key={policy.id}
                   className="group block h-full"
                   onClick={(e) => { if (!policy.url) { e.preventDefault(); console.log(`Opening ${policy.title}`); } }}
                 >
                   <Card className="h-full border border-black/5 bg-white hover:border-[#EA104A]/30 hover:shadow-xl transition-all duration-300 relative overflow-hidden top-0 group-hover:-top-2">
                      <CardContent className="p-6 flex flex-col h-full">
                         <div className="mb-6 flex justify-between items-start">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#EA104A] group-hover:bg-[#EA104A] group-hover:text-white transition-colors duration-300">
                               <FileText size={22} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-500 font-bold tracking-widest border-slate-200">
                               {policy.category}
                            </Badge>
                         </div>
                         <h4 className="font-bold text-[#1A1A1A] leading-snug flex-1 group-hover:text-[#EA104A] transition-colors">
                           {policy.title}
                         </h4>
                      </CardContent>
                   </Card>
                 </a>
              ))}
           </div>
           
           {filteredPolicies.length === 0 && (
             <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No policies found</h3>
                <p className="text-slate-500">Try adjusting your search query.</p>
             </div>
           )}
        </section>

        {/* SECTION 3: Income Tax Essentials */}
        <section id="income-tax" className="scroll-mt-32 pt-8">
           <div className="flex gap-4 items-center mb-10">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                <PieChart size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Income Tax Essentials</h2>
                <p className="text-[#666] text-sm font-medium mt-1 uppercase tracking-widest">Compliance & Submissions</p>
              </div>
           </div>

           <Card className="border-none shadow-xl bg-white overflow-hidden mb-8">
              <CardContent className="p-8 md:p-12">
                 <div className="max-w-3xl mb-12">
                    <p className="text-lg text-[#555] leading-relaxed">
                      Ensuring timely and accurate Income Tax declarations and proof submissions is crucial. Use the standardized guidelines below to help you understand what constitutes valid proof and how to declare your tax-saving investments for the current assessment year.
                    </p>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    {TAX_DOCS.map((doc, idx) => (
                       <a href={doc.url || "#"} target="_blank" rel="noopener noreferrer" key={doc.id} className="group" onClick={(e) => { if (!doc.url) e.preventDefault(); }}>
                          <div className="p-8 rounded-2xl border-2 border-slate-100 hover:border-amber-400/50 bg-slate-50/50 hover:bg-amber-50/30 transition-all duration-300 h-full flex flex-col relative overflow-hidden group-hover:shadow-lg">
                             <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <Calculator size={150} />
                             </div>
                             
                             <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                                <FileText size={24} />
                             </div>
                             
                             <h4 className="text-xl font-bold text-[#1A1A1A] mb-3 group-hover:text-amber-600 transition-colors">
                                {doc.title}
                             </h4>
                             
                             <p className="text-[#666] leading-relaxed mb-6 flex-1">
                                {doc.description}
                             </p>
                             
                             <div className="flex items-center gap-2 text-sm font-bold text-amber-600 uppercase tracking-widest">
                                Read Guidelines <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                             </div>
                          </div>
                       </a>
                    ))}
                 </div>
              </CardContent>
           </Card>

           {/* Help Note */}
           <div className="bg-[#EA104A] text-white p-6 md:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <Mail size={24} />
                 </div>
                 <div>
                    <h4 className="text-lg font-bold">Have questions regarding policies or taxes?</h4>
                    <p className="text-white/80">Our HR team is here to help clarify any doubts.</p>
                 </div>
              </div>
              <Button className="bg-white text-[#EA104A] hover:bg-slate-100 rounded-full px-8 font-bold relative z-10 whitespace-nowrap shadow-xl">
                 Contact HR Support
              </Button>
           </div>
        </section>

      </main>
    </div>
  );
}
