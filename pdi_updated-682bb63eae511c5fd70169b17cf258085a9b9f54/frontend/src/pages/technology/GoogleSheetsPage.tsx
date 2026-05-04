import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  Monitor,
  CheckCircle,
  PencilSimple,
  Table
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { PortalBanner } from "@/components/layout/PortalBanner";
import { useNavigate } from "react-router-dom";

export default function GoogleSheetsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "GOOGLE SHEETS",
    heroImage: "/assets/technology/google_workspace_banner.png",
    introTitle: "INTRODUCTION",
    introContent: "Google Apps includes a powerful alternative to Excel called Google Sheets, that provides users with the ability to create, edit, and collaborate with others live on the web. The interface is minimalist yet powerful and you can collaborate on Google Spreadsheets with up to 99 other colleagues. It also integrates with Google Drive, Google's storage app, creating a single place for you to access your spreadsheets from anywhere! To get started with Google Sheets, all you need is to create a Google account.",
    objectiveTitle: "OBJECTIVES OF THE TUTORIAL",
    trainingTitle: "GOOGLE TRAINING ON SHEETS",
    objectiveGroups1Title: "Create or Import",
    objectiveGroups1Text: "Creating a new spreadsheet | https://drive.google.com/file/d/1K1R8DP_2x5-8cAI6T2ruyJT-eWYaDtxb/view\nImport and convert old spreadsheets to Sheets | https://drive.google.com/file/d/1j3EoKB-Tw5I0kl5Qxa9_cGRDrM_Aiu5k/view",
    objectiveGroups2Title: "Share and collaborate",
    objectiveGroups2Text: "Share spreadsheets | https://drive.google.com/file/d/13oEScP3ZEjGg6xTdOIGbmOXATp1cGRVd/view\nAdd comments and replies | https://drive.google.com/file/d/1qb3jNpKlKU-_PBtCOIOlppv5tQ5rxbWi/view\nChat with people directly | https://drive.google.com/file/d/11f8mjcEjNSJvGnTdROPzCZZSDS-kDFMN/view",
    objectiveGroups3Title: "Add content",
    objectiveGroups3Text: "Enter and edit your data | https://drive.google.com/file/d/1-rubDSaJXojGsyoM_r7kaGTo_lhm4Ek5/view\nCustomize your spreadsheet | https://drive.google.com/file/d/1EEBlE1sT9vTRgp3OYJJxwvX0J7HXN836/view\nWork with rows, columns, and cells | https://drive.google.com/file/d/1YREKijuLRIv7iHkKMsSrevJN7Cy8PnlB/view\nWork with multiple sheets | https://drive.google.com/file/d/1xhOlDR0nR9oTDKpIQDb_rvFLC9m-r-rJ/view",
    objectiveGroups4Title: "Print and download",
    objectiveGroups4Text: "Print your spreadsheet | https://drive.google.com/file/d/1H5xBPOAYhfhO9kn0AQjgdV8GSXNRcZjK/view\nDownload versions in other formats | https://drive.google.com/file/d/1sdvcE7EwImSGLwLPoE1kkTCMGSpr0ZkR/view\nMake a copy in Sheets | https://drive.google.com/file/d/1qopiLsgLTvxYAJL-x5o3YPaSFQh5ia3S/view\nEmail copy as attachments | https://drive.google.com/file/d/1sYaKb5N5OahBshDcZQFPoQUfCYkAQ_mK/view",
    trainingLinksText: "Create or import files - G Suite Learning Center | https://drive.google.com/file/d/1qj32_GQBKNQ3IA96NccF_I4xI0Kazuff/view\nAdd content to your spreadsheet - G Suite Learning Center | https://drive.google.com/file/d/1uOqhSPn1c2NBC3znilTLKy6wJgl7xj8s/view\nShare and collaborate on files or share files with large groups of people - G Suite Learning Center | https://drive.google.com/file/d/1haOUIsnJrPuuXPPX-JDV7CSWU18fl46J/view\nPrint and download files - G Suite Learning Center | https://drive.google.com/file/d/1sOaeqjLeeUvbEBeKQ8yonUln7Ak7OdAo/view\nAccess your calendar, notes, and tasks - G Suite Learning Center | https://drive.google.com/file/d/19IPWJKk1mZLV-qYGO9L9mLjGLYkpQ2_N/view"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_google_sheets");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch google sheets content:", error);
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

      <PageEditorControls 
        settingKey="page_tech_google_sheets"
        initialData={data}
        onSave={setData}
        title="Edit Google Sheets Page"
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

      <PortalBanner 
        title={data.heroTitle}
        subtitle="Analyze and organize your data with powerful collaborative spreadsheets."
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        icon={Table}
        className="mt-6 mb-12"
      />

      {/* Introduction Section */}
      <section className="mb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-rose-500 py-10 px-8 rounded-[2rem] shadow-lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.introTitle}</h2>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-8 py-20 text-lg text-slate-700 leading-relaxed font-medium">
          <p>
            {data.introContent}
          </p>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="mb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-rose-500 py-10 px-8 rounded-[2rem] shadow-lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.objectiveTitle}</h2>
            </div>
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
      <section className="mb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-rose-500 py-10 px-8 rounded-[2rem] shadow-lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.trainingTitle}</h2>
            </div>
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
