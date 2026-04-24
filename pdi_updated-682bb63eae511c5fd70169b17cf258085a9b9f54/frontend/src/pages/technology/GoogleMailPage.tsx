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

export default function GoogleMailPage() {
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "GOOGLE MAIL",
    heroImage: "/assets/technology/google_workspace_banner.png",
    introTitle: "INTRODUCTION",
    introContent: "Gmail is an email service provided by Google. In many ways, Gmail is like any other email service: You can send and receive emails, block spam, create an address book, and perform other basic email tasks. But it also has some more unique features that help make it one of the most popular online email services.",
    objectiveGroups1Title: "Create and send email",
    objectiveGroups1Text: "Create and send email | https://drive.google.com/file/d/1QmsbaXSKyMX8_UwGyn6PZssH98kHhIS_/view\nSee new email | https://drive.google.com/file/d/1VAESEKoSojOvSGk_KZFMDOL9UO12dqjF/view\nReply to email | https://drive.google.com/file/d/1yG4REPjVfkx4cS7UhWNBnZrKcHOw0m4N/view",
    objectiveGroups2Title: "Organize your inbox",
    objectiveGroups2Text: "Switch to labels from folders | https://drive.google.com/file/d/1m_OE4rbBs2WiDQxYMwbc_sLlj5l9dl_u/view\nLabels guide | https://drive.google.com/file/d/1m_OE4rbBs2WiDQxYMwbc_sLlj5l9dl_u/view\nApply labels | https://drive.google.com/file/d/1tQwCcz1iDF7E8HCfhClpQPJcVoadJ9H8/view\nStar important email | https://drive.google.com/file/d/1C-wo9aH28gl73RZPqxT3Tb68WAp8SUu0/view",
    objectiveGroups3Title: "Find email",
    objectiveGroups3Text: "Search your inbox | https://drive.google.com/file/d/1Txk07Z4tnwhAdG5exxcOJ3mNApRer_nc/view\nNarrow your search | https://drive.google.com/file/d/1ziu2L5xoUBC5TFgGRuscOnENc_RDAJyV/view",
    objectiveGroups4Title: "Create signatures",
    objectiveGroups4Text: "Create a signature | https://drive.google.com/file/d/1uq7mv4Krw3pDpvkjLG-nCzMspXtdVvss/view",
    trainingLinksText: "Create and send email - G Suite Learning Center | https://drive.google.com/file/d/1QmsbaXSKyMX8_UwGyn6PZssH98kHhIS_/view\nOrganize your inbox - G Suite Learning Center | https://drive.google.com/file/d/1e_UlDj2qiJ2hjb-T3RhOSx8zmS1Bc8kq/view\nFind email - G Suite Learning Center | https://drive.google.com/file/d/1L-M0Z1Y8fFXzkGmVC7z2N5SJF9R4q4NT/view\nCreate signatures - G Suite Learning Center | https://drive.google.com/file/d/1YZvUeuE4Q1dS56-kGHXfaErTq8IC3LPr/view\nAccess your calendar, notes, and tasks - G Suite Learning Center | https://drive.google.com/file/d/1LnWzfqtVM6SVVhTkFwWaVwhGwS3zaFSo/view"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_google_mail");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch google mail content:", error);
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
        settingKey="page_tech_google_mail"
        initialData={data}
        onSave={setData}
        title="Edit Google Mail Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroTitle", label: "Hero Banner Title", type: "input" },
          { key: "heroImage", label: "Hero Banner Image", type: "image" },
          { key: "introTitle", label: "Introduction Title", type: "input" },
          { key: "introContent", label: "Introduction Body Text", type: "textarea" },
          { key: "objectiveTitle", label: "Objectives Section Title", type: "input" },
          { key: "objectiveGroups1Title", label: "Objectives Group 1 Title", type: "input" },
          { key: "objectiveGroups1Text", label: "Objectives Group 1 Links (Label | URL)", type: "textarea" },
          { key: "objectiveGroups2Title", label: "Objectives Group 2 Title", type: "input" },
          { key: "objectiveGroups2Text", label: "Objectives Group 2 Links (Label | URL)", type: "textarea" },
          { key: "objectiveGroups3Title", label: "Objectives Group 3 Title", type: "input" },
          { key: "objectiveGroups3Text", label: "Objectives Group 3 Links (Label | URL)", type: "textarea" },
          { key: "objectiveGroups4Title", label: "Objectives Group 4 Title", type: "input" },
          { key: "objectiveGroups4Text", label: "Objectives Group 4 Links (Label | URL)", type: "textarea" },
          { key: "trainingTitle", label: "Training Section Title", type: "input" },
          { key: "trainingLinksText", label: "Training Links (Title | URL)", type: "textarea" },
        ]}
      />

      {/* Hero Banner Section */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <img 
          src={data.heroImage} 
          alt="Google Mail Banner"
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

      {/* Introduction Section */}
      <section>
        <div className="bg-rose-500 py-10 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.introTitle}</h2>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-8 py-20 text-lg text-slate-700 leading-relaxed font-medium">
          <p>
            {data.introContent}
          </p>
        </div>
      </section>

      {/* Objectives Section */}
      <section>
        <div className="bg-rose-500 py-10 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.objectiveTitle}</h2>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-8 bg-rose-500 rounded-full" />
                  {data[`objectiveGroups${idx}Title` as keyof typeof data]}
                </h3>
                <ul className="space-y-3 pl-4">
                  {(data[`objectiveGroups${idx}Text` as keyof typeof data] || "").split('\n').filter(l => l.includes('|')).map((line, i) => {
                    const [label, url] = line.split('|').map(s => s.trim());
                    return (
                      <li key={i} className="flex items-center gap-2 leading-relaxed">
                        <CheckCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" weight="fill" />
                        <a 
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 font-medium hover:text-rose-500 hover:underline transition-colors decoration-rose-200 underline-offset-4"
                        >
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {(data.trainingLinksText || "").split('\n').filter(l => l.includes('|')).map((line, index) => {
              const [title, url] = line.split('|').map(s => s.trim());
              return (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-lg text-slate-700 font-bold group hover:text-rose-500 transition-all underline underline-offset-8 decoration-slate-200 hover:decoration-rose-500 leading-tight"
                >
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:rotate-6 transition-transform shrink-0">
                    <ArrowRight className="w-6 h-6" weight="bold" />
                  </div>
                  <span>{index + 1}. {title}</span>
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
