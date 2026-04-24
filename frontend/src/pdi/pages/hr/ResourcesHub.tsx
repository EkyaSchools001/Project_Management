import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Slack, 
  Mail, 
  LifeBuoy, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileText,
  ShieldCheck,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PencilSimple } from "@phosphor-icons/react";
import { Button } from "@pdi/components/ui/button";
import { Card, CardContent } from "@pdi/components/ui/card";
import { useAuth } from "@pdi/hooks/useAuth";
import { settingsService } from "@pdi/services/settingsService";
import { PageEditorControls } from "@pdi/components/educator-hub/InstitutionalIdentity/PageEditorControls";

const ResourcesHub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    headerTitle: "Human Resource – Resources Hub",
    headerSubtitle: "A centralized space for educators to access HR guidance, policies, and communication channels.",
    
    aceTitle: "Becoming an ACE Educator",
    aceContent: "Becoming an ACE Educator – Aware, Compassionate, and Engaged educator is not just a professional journey; it is a transformative process that shapes not only the lives of students but also the educators themselves.\n\nAt Ekya, we recognize the profound impact that educators have on the learning experience and overall well-being of our students.\n\nThat’s why we are committed to supporting our educators in their journey toward becoming ACE Educators.",
    
    navTitle: "Navigating the HR Page",
    navContent: "The HR page is designed to be a comprehensive resource hub for educators, covering various aspects of your professional life, from practical guidance in the classroom to understanding company policies and addressing common queries.",
    
    navItem1Title: "Educator Guide",
    navItem1Desc: "Provides essential resources like the Teacher Companion Handbook, practical procedures, and expectations for educators.",
    
    navItem2Title: "Educator Essentials",
    navItem2Desc: "Contains policies related to professional conduct, administrative procedures, leave policies, and operational guidelines.",
    
    navItem3Title: "FAQ (Frequently Asked Questions)",
    navItem3Desc: "Answers common questions educators may have regarding HR procedures and policies.",

    slackTitle: "Slack Communication",
    slackContent: "Effective communication between team members is essential for smooth school operations and collaboration across all departments.\n\nTherefore, we encourage each of you to continue leveraging Slack for official correspondence, announcements, updates, and discussions related to work matters.",

    supportTitle: "We're here to support you",
    supportSubtitle: "If you have any questions related to HR activities, feel free to reach out to the HR team through the following channels:",
    supportEmailTitle: "Email Us",
    supportEmail: "hr@ekyaschools.com",
    supportTicketTitle: "Ticketing System",
    supportTicketDesc: "Raise a request through the platform Support Ticketing System.",
    navItem1Url: "/hr/educator-guide",
    navItem2Url: "/hr/educator-essentials",
    navItem3Url: "#",
    slackGuideUrl: "#"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("hr_resources_hub");
        if (result && result.value) {
          setData(prev => ({ ...prev, ...result.value }));
        }
      } catch (error) {
        console.error("Failed to fetch hr_resources_hub content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw === "TESTER";
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#333333] font-sans pb-12">
      {/* 1. Header Banner */}
      <header className="bg-gradient-to-r from-[#EA104A] to-[#C40E3E] text-white py-16 px-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {data.headerTitle}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light">
            {data.headerSubtitle}
          </p>
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
          className="absolute top-6 left-6 text-white hover:bg-white/10 gap-2 z-10 font-bold"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </Button>
      </header>

      <PageEditorControls 
        settingKey="hr_resources_hub"
        initialData={data}
        onSave={setData}
        title="Edit Resources Hub"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "headerTitle", label: "Header Title", type: "input" },
          { key: "headerSubtitle", label: "Header Subtitle", type: "input" },
          { key: "aceTitle", label: "ACE Section Title", type: "input" },
          { key: "aceContent", label: "ACE Section Content", type: "textarea" },
          { key: "navTitle", label: "Navigating HR Section Title", type: "input" },
          { key: "navContent", label: "Navigating HR Section Content", type: "textarea" },
          { key: "navItem1Title", label: "Nav Item 1 Title", type: "input" },
          { key: "navItem1Desc", label: "Nav Item 1 Desc", type: "textarea" },
          { key: "navItem2Title", label: "Nav Item 2 Title", type: "input" },
          { key: "navItem2Desc", label: "Nav Item 2 Desc", type: "textarea" },
          { key: "navItem3Title", label: "Nav Item 3 Title", type: "input" },
          { key: "navItem3Desc", label: "Nav Item 3 Desc", type: "textarea" },
          { key: "slackTitle", label: "Slack Section Title", type: "input" },
          { key: "slackContent", label: "Slack Section Content", type: "textarea" },
          { key: "supportTitle", label: "Support Section Title", type: "input" },
          { key: "supportSubtitle", label: "Support Section Subtitle", type: "input" },
          { key: "supportEmailTitle", label: "Email Title", type: "input" },
          { key: "supportEmail", label: "Support Email", type: "input" },
          { key: "supportTicketTitle", label: "Ticket Title", type: "input" },
          { key: "supportTicketDesc", label: "Ticket Desc", type: "textarea" },
          { key: "navItem1Url", label: "Nav Item 1 URL", type: "input" },
          { key: "navItem2Url", label: "Nav Item 2 URL", type: "input" },
          { key: "navItem3Url", label: "Nav Item 3 URL", type: "input" },
          { key: "slackGuideUrl", label: "Slack Guide URL", type: "input" },
        ]}
      />


      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-24">
        {/* Section 1 – Becoming ACE Educators */}
        <section id="ace-educators" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-[#EA104A] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#EA104A] uppercase tracking-wider">
              {data.aceTitle}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl hover:shadow-card-lifted transition-all duration-500 border border-black/5">
                <img 
                  src="/images/hr/ace_educator.png" 
                  alt="Growth and Engagement" 
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-3xl font-bold mb-6 text-[#1A1A1A]">{data.aceTitle}</h3>
                  <div className="space-y-4 text-lg leading-relaxed text-[#555555] whitespace-pre-wrap">
                    {data.aceContent}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 2 – Navigating the HR Page */}
        <section id="navigating-hr" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-[#EA104A] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#EA104A] uppercase tracking-wider">
              {data.navTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-8 md:p-10">
                  <p className="text-lg text-[#555555] mb-8 leading-relaxed whitespace-pre-wrap">
                    {data.navContent}
                  </p>
                  <p className="text-[#1A1A1A] font-semibold mb-6">Key sections available:</p>
                  
                  <div className="space-y-4">
                    {[
                      {
                        title: data.navItem1Title,
                        icon: BookOpen,
                        description: data.navItem1Desc,
                        url: data.navItem1Url
                      },
                      {
                        title: data.navItem2Title,
                        icon: ShieldCheck,
                        description: data.navItem2Desc,
                        url: data.navItem2Url
                      },
                      {
                        title: data.navItem3Title,
                        icon: HelpCircle,
                        description: data.navItem3Desc,
                        url: data.navItem3Url
                      }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => item.url && navigate(item.url)}
                        className="flex gap-4 p-5 rounded-xl border border-black/5 bg-[#FDFDFD] hover:bg-[#F9F9F9] hover:border-[#EA104A]/20 transition-all group cursor-pointer"
                      >
                        <div className="shrink-0 w-12 h-12 rounded-lg bg-[#EA104A]/5 flex items-center justify-center text-[#EA104A] group-hover:bg-[#EA104A] group-hover:text-white transition-colors duration-300">
                          <item.icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1A1A1A] mb-1">{item.title}</h4>
                          <p className="text-sm text-[#666666] leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-black/5">
              <img 
                src="/images/hr/hr_navigation.png" 
                alt="Navigation Guidance" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Section 3 – EKYA Official Communication Channel */}
        <section id="communication" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-[#EA104A] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#EA104A] uppercase tracking-wider">
              {data.slackTitle}
            </h2>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="bg-[#4A154B] flex items-center justify-center p-16">
                  <div className="text-white flex flex-col items-center">
                    <Slack size={100} className="mb-6 animate-pulse-dot" />
                    <span className="text-3xl font-black tracking-tight">slack</span>
                  </div>
                </div>
                <div className="p-10 md:p-14 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold mb-6">{data.slackTitle}</h3>
                  <div className="space-y-6 text-lg text-[#555555] leading-relaxed mb-8">
                    <div className="whitespace-pre-wrap">{data.slackContent}</div>
                    <div className="bg-[#F8F9FA] p-6 rounded-xl border-l-4 border-[#4A154B]">
                      <p className="text-base italic">
                        Please access the <span className="font-semibold text-[#4A154B]">Slack Guide</span> for more information on how to use the platform effectively.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => data.slackGuideUrl && window.open(data.slackGuideUrl, '_blank')}
                    className="bg-[#4A154B] hover:bg-[#320E33] text-white w-fit px-8 py-6 text-lg rounded-xl transition-all hover:translate-x-1 group"
                  >
                    View Slack Guide
                    <ExternalLink className="ml-2 w-5 h-5 opacity-70 group-hover:opacity-100" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 4 – Need Help */}
        <section id="support" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-[#EA104A] rounded-full"></div>
            <h2 className="text-2xl font-bold text-[#EA104A] uppercase tracking-wider">
              Need Help? Please reach out to us!
            </h2>
          </div>

          <Card className="border-none shadow-xl bg-gradient-to-br from-white to-[#FDFDFD] overflow-hidden relative border-t-4 border-t-[#EA104A]">
            <CardContent className="p-10 md:p-16 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#EA104A]/5 rounded-full flex items-center justify-center text-[#EA104A] mb-8">
                <LifeBuoy size={40} className="animate-spin-slow" />
              </div>
              
              <h3 className="text-3xl font-bold mb-6">{data.supportTitle}</h3>
              <p className="text-xl text-[#666666] max-w-2xl mb-12 leading-relaxed">
                {data.supportSubtitle}
              </p>

              <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="p-8 rounded-2xl bg-white border border-black/5 hover:border-[#EA104A]/30 transition-all hover:shadow-card group">
                  <Mail className="w-10 h-10 text-[#EA104A] mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-bold mb-2">{data.supportEmailTitle}</h4>
                  <p className="text-[#EA104A] font-medium text-lg mb-6">{data.supportEmail}</p>
                  <Button variant="outline" className="w-full hover:bg-[#EA104A] hover:text-white border-[#EA104A] text-[#EA104A]" asChild>
                    <a href={`mailto:${data.supportEmail}`}>Contact HR</a>
                  </Button>
                </div>

                <div className="p-8 rounded-2xl bg-white border border-black/5 hover:border-[#EA104A]/30 transition-all hover:shadow-card group">
                  <FileText className="w-10 h-10 text-[#EA104A] mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-lg font-bold mb-2">{data.supportTicketTitle}</h4>
                  <p className="text-[#666666] mb-6">{data.supportTicketDesc}</p>
                  <Button className="w-full bg-[#EA104A] hover:bg-[#C40E3E] text-white">
                    Raise Support Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 pt-20 pb-10 bg-[#1A1A1A] text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                  <div className="p-1 px-2 rounded-lg bg-[#EA104A] font-bold text-xs uppercase">Ekya</div>
                  <span className="text-xl font-bold tracking-tight">
                    <span className="text-[#EA104A]">Teacher</span> Platform
                  </span>
              </div>
              <p className="text-white/60 mb-8 max-w-md">
                Dedicated to empowering our educators through streamlined processes, clear communication, and continuous support. Part of the CME / CMR Group.
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
              <h4 className="font-bold mb-6 text-white text-lg">Quick Links</h4>
              <ul className="space-y-4 text-white/60">
                {['About EKYA', 'School Policies', 'Professional Development', 'Contact Support'].map((link) => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 transition-all" />
                    {link}
                  </a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Scan to Mobile</h4>
              <div className="w-32 h-32 bg-white p-2 rounded-xl mb-4">
                {/* QR Code Placeholder */}
                <div className="w-full h-full bg-[#eee] border-2 border-dashed border-[#ccc] flex items-center justify-center text-[#999] text-[10px] text-center">
                  QR CODE<br/>EKYA APP
                </div>
              </div>
              <p className="text-xs text-white/40 italic">Download the Ekya Staff App</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
            <p>© {new Date().getFullYear()} Ekya Schools – Human Resources Resource Hub</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResourcesHub;
