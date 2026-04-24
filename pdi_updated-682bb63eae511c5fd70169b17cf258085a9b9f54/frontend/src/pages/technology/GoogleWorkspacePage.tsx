import React, { useState, useEffect } from 'react';
import { 
  GoogleDriveLogo,
  FileText,
  Table,
  Presentation,
  ListChecks,
  CalendarBlank,
  VideoCamera,
  Envelope,
  ArrowRight,
  Monitor,
  PencilSimple
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";

export default function GoogleWorkspacePage() {
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "GOOGLE WORKSPACE",
    heroImage: "/assets/technology/google_workspace_banner.png",
    introContent1: "Our vision for Technology for educators is that all of our educators should have access to tools which can make learning anywhere, anytime possible for students. For this reason Ekya relies heavily on cloud-based learning resources such as Google Apps for Education. This has paved new ways for the educators to communicate, collaborate and create and as a result, they are savvy, informed, respectful technology users.",
    introContent2: "Here are some tutorials to get you started! Happy learning!",
    tutorialsTitle: "TUTORIALS FOR GOOGLE WORKSPACE",
    tutorialsSubtitle: "Click below to learn how to use the platforms and for support information.",
    tutorialsText: "Teaching staff - Drive structure | https://drive.google.com/file/d/1MB-SqEiSQhCphYrBLj6BHWUjLF2AJFgF/view | true\nGoogle Forms | /technology/google-forms | false\nGoogle Slides | /technology/google-slides | false\nGoogle Sheets | /technology/google-sheets | false\nGoogle Docs | /technology/google-docs | false\nGoogle Calendar | /technology/google-calendar | false\nGoogle Hangouts Meet | /technology/google-hangouts-meet | false\nGoogle Mail | /technology/google-mail | false"
  });

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("drive")) return <GoogleDriveLogo className="w-16 h-16 text-[#34A853]" weight="fill" />;
    if (n.includes("forms")) return <ListChecks className="w-16 h-16 text-[#673AB7]" weight="fill" />;
    if (n.includes("slides")) return <Presentation className="w-16 h-16 text-[#FBBC04]" weight="fill" />;
    if (n.includes("sheets")) return <Table className="w-16 h-16 text-[#0F9D58]" weight="fill" />;
    if (n.includes("docs")) return <FileText className="w-16 h-16 text-[#4285F4]" weight="fill" />;
    if (n.includes("calendar")) return <CalendarBlank className="w-16 h-16 text-[#4285F4]" weight="fill" />;
    if (n.includes("meet")) return <VideoCamera className="w-16 h-16 text-[#00897B]" weight="fill" />;
    if (n.includes("mail")) return <Envelope className="w-16 h-16 text-[#EA4335]" weight="fill" />;
    return <FileText className="w-16 h-16 text-slate-400" weight="fill" />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_google_workspace");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch google workspace content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw === "TESTER";
  };

  return (
    <div className="min-h-screen bg-white relative">
      {canEdit() && (
        <Button 
          className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white gap-2 z-50 shadow-lg font-bold border border-white/20"
          onClick={() => setIsEditorOpen(true)}
        >
          <PencilSimple size={18} weight="bold" />
          Edit Content
        </Button>
      )}

      <PageEditorControls 
        settingKey="page_tech_google_workspace"
        initialData={data}
        onSave={setData}
        title="Edit Google Workspace Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroTitle", label: "Hero Banner Title", type: "input" },
          { key: "heroImage", label: "Hero Banner Image", type: "image" },
          { key: "introContent1", label: "Introduction Paragraph 1", type: "textarea" },
          { key: "introContent2", label: "Introduction Paragraph 2", type: "textarea" },
          { key: "tutorialsTitle", label: "Tutorials Section Title", type: "input" },
          { key: "tutorialsSubtitle", label: "Tutorials Section Subtitle", type: "textarea" },
          { key: "tutorialsText", label: "Tutorials (Name | URL | isExternal)", type: "textarea" },
        ]}
      />

      {/* Hero Banner Section */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <img 
          src={data.heroImage} 
          alt="Google Workspace Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="relative z-10 space-y-4">
            <h1 className="text-7xl font-bold tracking-[0.15em] text-white uppercase drop-shadow-2xl text-center px-4">
              {data.heroTitle}
            </h1>
            <div className="h-2 w-full max-w-[400px] bg-rose-500 mx-auto rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="max-w-6xl mx-auto px-8 py-16 space-y-8">
        <div className="w-32 h-2 bg-amber-400 mb-8" />
        <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-medium">
          <p>
            {data.introContent1}
          </p>
          <p>
            {data.introContent2}
          </p>
        </div>
      </section>

      {/* Tutorials Banner */}
      <div className="bg-rose-500 py-10 px-8 text-center text-white">
        <h2 className="text-4xl font-bold uppercase tracking-wider mb-2">{data.tutorialsTitle}</h2>
        <p className="text-xs font-semibold opacity-90 uppercase">{data.tutorialsSubtitle}</p>
      </div>

      {/* Tutorials Grid */}
      <section className="max-w-6xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-16 gap-x-8">
          {(data.tutorialsText || "").split('\n').filter(l => l.includes('|')).map((line, index) => {
            const [name, url, isExternalStr] = line.split('|').map(s => s.trim());
            const isExternal = isExternalStr === "true";
            
            const content = (
              <>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-50 group-hover:shadow-md transition-shadow">
                  {getIcon(name)}
                </div>
                <span className="text-sm font-bold text-slate-700 underline underline-offset-4 decoration-slate-200 group-hover:text-rose-500 group-hover:decoration-rose-500 transition-colors">
                  {name}
                </span>
              </>
            );

            const className = "group flex flex-col items-center text-center space-y-4 transition-transform hover:-translate-y-2";

            if (isExternal) {
              return (
                <a 
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={index}
                to={url}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Brands Footer Section */}
      <div className="border-t border-slate-100 py-12 px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-primary/20 flex items-center justify-center font-bold text-rose-600">EKYA SCHOOLS</div>
            <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-primary/20 flex items-center justify-center font-black text-blue-800">CMR</div>
          </div>
          <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase">
            <span>Ekya School JP Nagar</span>
            <span>Ekya School ITPL</span>
            <span>Ekya School BTM Layout</span>
            <span>Ekya School Byrathi</span>
            <span>Ekya School NICE Road</span>
          </div>
          <div className="flex items-center gap-4">
             {/* Social Icons Placeholders */}
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white"><Monitor className="w-4 h-4" /></div>
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white"><Monitor className="w-4 h-4" /></div>
             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white"><Monitor className="w-4 h-4" /></div>
          </div>
        </div>
      </div>

      {/* Footer Legal */}
      <footer className="bg-rose-500 py-12 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[11px] leading-relaxed text-white/90 font-medium italic">
            "The information disclosed in this site is the valuable property of Ekya Schools and CMR. As a condition of all employees, you will hold all of our organisation's confidential and proprietary information in confidence and will not disclose, use, copy, publish, summarize, share or remove from the premises of the organisation any proprietary or confidential information, except as is necessary to carry out your assigned responsibilities. 'Confidential' and 'Proprietary' Information shall include, but are not limited to, all information related to any aspect of the running of the organisation, including documents, manuals, files, curriculum documents, calendars, finances, plans, promotional methods, marketing plans, lists of parent names, student names and information or personnel lists of suppliers, vendors, partners etc. Any breach of confidentiality or misuse of information could result in disciplinary action including termination of employment and legal course of action."
          </p>
        </div>
      </footer>
    </div>
  );
}
