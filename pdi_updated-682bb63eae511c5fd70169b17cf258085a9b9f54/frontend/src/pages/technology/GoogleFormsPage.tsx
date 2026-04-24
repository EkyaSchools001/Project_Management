import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  Monitor,
  Info,
  BookOpen,
  PencilSimple
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";

export default function GoogleFormsPage() {
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "GOOGLE FORMS",
    heroImage: "/assets/technology/google_workspace_banner.png",
    gettingStartedTitle: "GETTING STARTED WITH FORMS",
    introContent: "Manage event registrations, create a quick opinion poll, and much more. With Google Forms, you can create and analyze surveys right in your mobile or web browser—no special software required. You get instant results as they come in. And, you can summarize survey results at a glance with charts and graphs.",
    trainingTitle: "GOOGLE TRAINING ON FORMS",
    trainingLinksText: "Create your form - G Suite Learning Center | https://drive.google.com/file/d/1Uhn8IeMuCxp4at3Sb5qQhT5CizrK7GdH/view\nChoose settings and preview your form - G Suite Learning Center | https://drive.google.com/file/d/1uzAUdtUg58QkkqLG4-dfDbGj6cuVcEIX/view\nSend your form - G Suite Learning Center | https://drive.google.com/file/d/1DalCGybQTYTbopIvoomSpF5JeyNS15BA/view\nAnalyze form responses - G Suite Learning Center | https://drive.google.com/file/d/10zz4w5pPDKrZODqIfSsYdiq7X3bzYyiC/view\nPrint a form - G Suite Learning Center | https://drive.google.com/file/d/1pKhEF5F2_HtexzKjU9pG1V2VxIIoscFz/view"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_google_forms");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch google forms content:", error);
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
        settingKey="page_tech_google_forms"
        initialData={data}
        onSave={setData}
        title="Edit Google Forms Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroTitle", label: "Hero Banner Title", type: "input" },
          { key: "heroImage", label: "Hero Banner Image", type: "image" },
          { key: "gettingStartedTitle", label: "Getting Started Section Title", type: "input" },
          { key: "introContent", label: "Introduction Body Text", type: "textarea" },
          { key: "trainingTitle", label: "Training Section Title", type: "input" },
          { key: "trainingLinksText", label: "Training Links (Format: Title | URL, one per line)", type: "textarea" },
        ]}
      />

      {/* Hero Banner Section */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <img 
          src={data.heroImage} 
          alt="Google Forms Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="relative z-10 space-y-4">
            <h1 className="text-7xl font-bold tracking-[0.15em] text-white uppercase drop-shadow-2xl">
              {data.heroTitle}
            </h1>
            <div className="h-2 w-full max-w-[400px] bg-rose-500 mx-auto rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <section>
        <div className="bg-rose-500 py-10 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.gettingStartedTitle}</h2>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-8 py-20">
          <p className="text-lg text-slate-700 leading-relaxed font-medium">
            {data.introContent}
          </p>
        </div>
      </section>

      {/* Google Training Section */}
      <section>
        <div className="bg-rose-500 py-10 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.trainingTitle}</h2>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="space-y-6">
            {(data.trainingLinksText || "").split('\n').filter(l => l.includes('|')).map((line, index) => {
              const [title, url] = line.split('|').map(s => s.trim());
              return (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-xl text-slate-700 font-bold group hover:text-rose-500 transition-all underline underline-offset-8 decoration-slate-200 hover:decoration-rose-500"
                >
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:rotate-6 transition-transform">
                    <ArrowRight className="w-6 h-6" weight="bold" />
                  </div>
                  {index + 1}. {title}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Branding & Legal */}
      <footer className="mt-20 border-t border-slate-100">
        <div className="bg-white py-16 px-8 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-12">
            <div className="flex items-center gap-8">
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-primary/20 flex items-center justify-center font-bold text-rose-600">EKYA SCHOOLS</div>
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-primary/20 flex items-center justify-center font-black text-blue-800">CMR</div>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-400 font-medium max-w-xl justify-center lg:justify-end">
              {['JP Nagar', 'ITPL', 'BTM Layout', 'Byrathi', 'NICE Road'].map((s) => (
                <span key={s} className="hover:text-rose-500 cursor-pointer transition-colors border-r border-slate-200 pr-4 last:border-0 capitalize">Ekya School {s}</span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-rose-500 transition-colors cursor-pointer">
                  <Monitor className="w-5 h-5 font-bold" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-rose-500 py-12 px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[11px] leading-relaxed text-white font-medium italic">
              "The information disclosed in this site is the valuable property of Ekya Schools and CMR. As a condition of all employees, you will hold all of our organisation's confidential and proprietary information in confidence and will not disclose, use, copy, publish, summarize, share or remove from the premises of the organisation any proprietary or confidential information, except as is necessary to carry out your assigned responsibilities. 'Confidential' and 'Proprietary' Information shall include, but are not limited to, all information related to any aspect of the running of the organisation, including documents, manuals, files, curriculum documents, calendars, finances, plans, promotional methods, marketing plans, lists of parent names, student names and information or personnel lists of suppliers, vendors, partners etc. Any breach of confidentiality or misuse of information could result in disciplinary action including termination of employment and legal course of action."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
