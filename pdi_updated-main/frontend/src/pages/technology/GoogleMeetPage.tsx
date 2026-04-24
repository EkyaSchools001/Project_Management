import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  Monitor,
  CheckCircle,
  PencilSimple
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";

export default function GoogleMeetPage() {
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "GOOGLE MEET",
    heroImage: "/assets/technology/google_workspace_banner.png",
    quickStartTitle: "QUICK START",
    quickStartGuideLabel: "A Quick Start Guide: Hangouts Meet",
    quickStartGuideUrl: "https://drive.google.com/file/d/1vQeoCCK7Nbeop9lnScN-2POguSz0knpI/view",
    trainingTitle: "GOOGLE TRAINING ON HANGOUTS MEET",
    trainingLevel1LinksText: "1.1 | Start a video meeting - Computer - G Suite Learning Center | https://drive.google.com/file/d/1hHbspBEg84l-9SRTvzKy64d9XWQbpL9i/view\n1.2 | Join a video meeting - Computer - G Suite Learning Center | https://drive.google.com/file/d/16L3uz9Bn9BkoeVvSTl5Nuy55zELLrwup/view\n1.3 | Add people to a video meeting - Computer - G Suite Learning Center | https://drive.google.com/file/d/1NWcfp0Z0Y8Qo_1F3JdXxkH91YUtfcA_5/view",
    trainingLevel2LinksText: "2.1.1 | Change screen layouts in a meeting - G Suite Learning Center | https://drive.google.com/file/d/18FIzMwfxoQwyulHm34qZwLgD4dWUvGgk/view\n2.1.2 | Pin, mute, or remove Hangouts Meet participants - Computer - G Suite Learning Center | https://drive.google.com/file/d/1jfj6tD-mT9ROYJKBBb98PeMoz4WfN3cM/view\n2.1.3 | Use captions in a video meeting - Computer - G Suite Learning Center | https://drive.google.com/file/d/1sqTPPfnIv45HY7G9RHCPz2gU3LsRCZRj/view\n2.2.1 | View meeting details and attachments - Computer - G Suite Learning Center | https://drive.google.com/file/d/1UBU3wJ7t2CdGBOKqwxQBWImgfs-vhYe8/view\n2.2.2 | Send chat messages to video meeting participants - Computer - G Suite Learning Center | https://drive.google.com/file/d/1hkuumHTTzpb4Cr4gjw2wXY-BscIfVoaV/view\n2.2.3 | Present during a video meeting - Computer - G Suite Learning Center | https://drive.google.com/file/d/1NKE-ZunN-KRF4pcw7YxpSD16MMY5R5kc/view\n2.3.1 | Record a video meeting - G Suite Learning Center | https://drive.google.com/file/d/1pN5ZNLta-aNXhYD64zPHbp2CkAbi69RI/view",
    trainingLevel3LinksText: " | Plan and hold meetings from anywhere - G Suite Learning Center | https://drive.google.com/file/d/16tVnu7h5DBOwiZZEOm6l2ytfqbvSbdxy/view"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_google_meet");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch google meet content:", error);
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
        settingKey="page_tech_google_meet"
        initialData={data}
        onSave={setData}
        title="Edit Google Meet Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroTitle", label: "Hero Banner Title", type: "input" },
          { key: "heroImage", label: "Hero Banner Image", type: "image" },
          { key: "quickStartTitle", label: "Quick Start Section Title", type: "input" },
          { key: "quickStartGuideLabel", label: "Quick Start Guide Label", type: "input" },
          { key: "quickStartGuideUrl", label: "Quick Start Guide URL", type: "input" },
          { key: "trainingTitle", label: "Training Section Title", type: "input" },
          { key: "trainingLevel1LinksText", label: "Level 1 Links (ID | Title | URL)", type: "textarea" },
          { key: "trainingLevel2LinksText", label: "Level 2 Links (ID | Title | URL)", type: "textarea" },
          { key: "trainingLevel3LinksText", label: "Level 3 Links (ID | Title | URL)", type: "textarea" },
        ]}
      />

      {/* Hero Banner Section */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <img 
          src={data.heroImage} 
          alt="Google Meet Banner"
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

      {/* Quick Start Section */}
      <section>
        <div className="bg-rose-500 py-10 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.quickStartTitle}</h2>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-8 py-20 text-center">
          <a 
            href={data.quickStartGuideUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-bold text-slate-700 hover:text-rose-500 hover:underline underline-offset-8 transition-all"
          >
            {data.quickStartGuideLabel}
          </a>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
            {[1, 2, 3].map((levelNum) => (
              <div key={levelNum} className={levelNum === 3 ? "md:col-span-2" : ""}>
                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center justify-center">
                  Level {levelNum}
                </h3>
                <div className="space-y-6">
                  {(data[`trainingLevel${levelNum}LinksText` as keyof typeof data] || "").split('\n').filter(l => l.includes('|')).map((line, i) => {
                    const [id, title, url] = line.split('|').map(s => s.trim());
                    return (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 text-lg text-slate-700 font-bold group hover:text-rose-500 transition-all underline underline-offset-8 decoration-slate-200 hover:decoration-rose-500 leading-tight"
                      >
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:rotate-6 transition-transform shrink-0">
                          <ArrowRight className="w-5 h-5 text-rose-500" weight="bold" />
                        </div>
                        <span>{id ? `${id} ` : ""}{title}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Branding & Legal */}
      <footer className="mt-20 border-t border-slate-100">
        <div className="bg-white py-16 px-8 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-12">
            <div className="flex items-center gap-8">
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex items-center justify-center font-bold text-rose-600">EKYA SCHOOLS</div>
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex items-center justify-center font-black text-blue-800">CMR</div>
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
