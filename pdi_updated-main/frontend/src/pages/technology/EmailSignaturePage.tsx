import React, { useState, useEffect } from 'react';
import { 
  Monitor,
  Envelope,
  DownloadSimple,
  ArrowSquareOut,
  PencilSimple
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";

export default function EmailSignaturePage() {
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "EMAIL SIGNATURE",
    heroAccent: "TEMPLATE",
    instructionTitle: "How to setup your Email Signature?",
    setupSteps: "Open Gmail.\nAt the top right, click Settings and then See all settings.\nScroll down the General menu.\nIn the \"Signature\" section, click on +Create New and add your signature text in the box.\nSelect the new signature in the drop-down menus provided in the Signature defaults section.\nAt the bottom of the page, click Save Changes.",
    brandAssetsTitle: "Official Brand ",
    brandAssetsAccent: "Logos",
    brandAssetsDescription: "Download the official, high-resolution brand assets for your email signature.",
    cmrLogoLabel: "CMR NPS Logo",
    cmrLogoUrl: "https://drive.google.com/file/d/1iFzxxUX1SH2R72ovwQIof8xSePGYdW_U/view",
    ekyaLogoLabel: "Ekya Schools Logo",
    ekyaLogoUrl: "https://drive.google.com/file/d/1dbhuhFAMp6DaIhDk9CNUWGtp2BD7f9Jp/view"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_email_signature");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch email signature content:", error);
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
        settingKey="page_tech_email_signature"
        initialData={data}
        onSave={setData}
        title="Edit Email Signature Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroTitle", label: "Hero Title", type: "input" },
          { key: "heroAccent", label: "Hero Accent", type: "input" },
          { key: "instructionTitle", label: "Instruction Header", type: "input" },
          { key: "setupSteps", label: "Setup Steps (1 per line)", type: "textarea" },
          { key: "brandAssetsTitle", label: "Brand Assets Section Title", type: "input" },
          { key: "brandAssetsAccent", label: "Brand Assets Title Accent", type: "input" },
          { key: "brandAssetsDescription", label: "Brand Assets Description", type: "textarea" },
          { key: "cmrLogoLabel", label: "CMR Logo Label", type: "input" },
          { key: "cmrLogoUrl", label: "CMR Logo URL", type: "input" },
          { key: "ekyaLogoLabel", label: "Ekya Logo Label", type: "input" },
          { key: "ekyaLogoUrl", label: "Ekya Logo URL", type: "input" },
        ]}
      />

      {/* Hero Banner Section */}
      <div className="relative w-full h-[300px] overflow-hidden bg-gradient-to-br from-[#3D1414] via-[#5C1B1B] to-[#1A0A0A]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="relative z-10 space-y-4 px-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-[0.15em] text-white uppercase drop-shadow-2xl text-center">
              {data.heroTitle}<br/><span className="text-rose-500">{data.heroAccent}</span>
            </h1>
            <div className="h-1.5 w-full max-w-[400px] bg-rose-500 mx-auto rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-20 px-8 space-y-24">
        {/* Setup Instructions */}
        <section className="relative">
          <div className="bg-rose-500 py-8 px-10 rounded-t-[2.5rem] shadow-lg border-b border-rose-400">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white uppercase tracking-wider flex items-center gap-5 text-center md:text-left">
                <Envelope className="w-10 h-10 shrink-0" weight="fill" />
                {data.instructionTitle}
              </h2>
            </div>
          </div>
          
          <div className="bg-rose-500/90 backdrop-blur-sm py-14 px-10 rounded-b-[2.5rem] shadow-2xl">
            <ul className="max-w-4xl mx-auto space-y-6">
              {(data.setupSteps || "").split('\n').filter(s => s.trim()).map((step, i) => (
                <li key={i} className="flex items-start gap-4 text-white text-lg font-medium leading-relaxed group">
                  <div className="w-2.5 h-2.5 bg-white rounded-full mt-2.5 shrink-0 shadow-sm" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Brand Assets Section - Simplified Download Only */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-black text-slate-800 uppercase tracking-tight">{data.brandAssetsTitle}<span className="text-rose-500">{data.brandAssetsAccent}</span></h3>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
              {data.brandAssetsDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* CMR NPS Download Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#003399] rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="relative bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center text-center space-y-6 shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-b-[#003399]">
                 <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <DownloadSimple className="w-10 h-10 text-[#003399]" weight="duotone" />
                 </div>
                 <div>
                    <h4 className="text-2xl font-black text-slate-800 uppercase">{data.cmrLogoLabel}</h4>
                    <p className="text-sm font-bold text-slate-400 mt-2">HIGH RESOLUTION PNG</p>
                 </div>
                 <a 
                    href={data.cmrLogoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#003399] text-white rounded-xl font-black flex items-center justify-center gap-3 hover:bg-[#002266] transition-all group-hover:scale-[1.02]"
                 >
                    DOWNLOAD ASSET
                    <ArrowSquareOut weight="bold" className="w-5 h-5" />
                 </a>
              </div>
            </div>

            {/* Ekya Schools Download Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#EA104A] rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="relative bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center text-center space-y-6 shadow-sm hover:shadow-xl transition-all duration-300 border-b-4 border-b-[#EA104A]">
                 <div className="w-20 h-20 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <DownloadSimple className="w-10 h-10 text-[#EA104A]" weight="duotone" />
                 </div>
                 <div>
                    <h4 className="text-2xl font-black text-slate-800 uppercase">{data.ekyaLogoLabel}</h4>
                    <p className="text-sm font-bold text-slate-400 mt-2">HIGH RESOLUTION PNG</p>
                 </div>
                 <a 
                    href={data.ekyaLogoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#EA104A] text-white rounded-xl font-black flex items-center justify-center gap-3 hover:bg-[#D00E41] transition-all group-hover:scale-[1.02]"
                 >
                    DOWNLOAD ASSET
                    <ArrowSquareOut weight="bold" className="w-5 h-5" />
                 </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-20 border-t border-slate-100">
        <div className="bg-white py-16 px-8 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-12">
            <div className="flex items-center gap-8">
               <span className="text-xl font-black text-rose-600">EKYA SCHOOLS</span>
               <div className="h-10 w-[1px] bg-slate-200" />
               <span className="text-2xl font-black text-blue-900">CMR</span>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-400 font-medium max-w-xl justify-center lg:justify-end">
              {['JP Nagar', 'ITPL', 'BTM Layout', 'Byrathi', 'NICE Road'].map((s) => (
                <span key={s} className="hover:text-rose-500 cursor-pointer transition-colors border-r border-slate-200 pr-4 last:border-0 uppercase tracking-tighter">Ekya School {s}</span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-rose-500 transition-all cursor-pointer shadow-lg">
                  <Monitor weight="fill" className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#EA104A] py-14 px-8 shadow-[0_-10px_40px_rgba(234,16,74,0.1)]">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[11px] leading-relaxed text-white font-medium italic opacity-90">
              "The information disclosed in this site is the valuable property of Ekya Schools and CMR. As a condition of all employees, you will hold all of our organisation's confidential and proprietary information in confidence and will not disclose, use, copy, publish, summarize, share or remove from the premises of the organisation any proprietary or confidential information, except as is necessary to carry out your assigned responsibilities. 'Confidential' and 'Proprietary' Information shall include, but are not limited to, all information related to any aspect of the running of the organisation, including documents, manuals, files, curriculum documents, calendars, finances, plans, promotional methods, marketing plans, lists of parent names, student names and information or personnel lists of suppliers, vendors, partners etc. Any breach of confidentiality or misuse of information could result in disciplinary action including termination of employment and legal course of action."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
