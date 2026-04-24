import React, { useState, useEffect } from 'react';
import { 
  Monitor,
  Presentation,
  ArrowSquareOut,
  CaretLeft,
  CaretRight,
  MagnifyingGlassPlus,
  PencilSimple
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";

export default function EkyaversePage() {
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "EKYAVERSE - ",
    heroTitleAccent: "NEVERSKIP",
    heroBgImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    tutorialHeader: "TUTORIAL",
    iframeUrl: "https://drive.google.com/file/d/1vsOWv7vaL0CxcEO4cM3QZWDxiTz2qO3h/preview",
    videoTutorialTitle: "Video Tutorial",
    videoTutorialDesc: "Watch the full step-by-step video guide for Neverskip ERP.",
    videoTutorialUrl: "#"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_ekyaverse");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch ekyaverse content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw === "TESTER";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative">
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
        settingKey="page_tech_ekyaverse"
        initialData={data}
        onSave={setData}
        title="Edit Ekyaverse Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroTitle", label: "Hero Title Prefix", type: "input" },
          { key: "heroTitleAccent", label: "Hero Title Accent", type: "input" },
          { key: "heroBgImage", label: "Hero Background Image", type: "image" },
          { key: "tutorialHeader", label: "Tutorial Section Header", type: "input" },
          { key: "iframeUrl", label: "Iframe Preview URL", type: "input" },
          { key: "videoTutorialTitle", label: "Video Card Title", type: "input" },
          { key: "videoTutorialDesc", label: "Video Card Description", type: "textarea" },
          { key: "videoTutorialUrl", label: "Video Card URL", type: "input" },
        ]}
      />

      {/* Hero Banner Section */}
      <div className="relative w-full h-[350px] overflow-hidden">
        <div className="absolute inset-0 bg-[#075985]">
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center mix-blend-overlay" 
            style={{ backgroundImage: `url('${data.heroBgImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="relative z-10 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white uppercase drop-shadow-2xl">
              {data.heroTitle}<span className="text-rose-500">{data.heroTitleAccent}</span>
            </h1>
            <div className="h-1.5 w-full max-w-[500px] bg-rose-500 mx-auto rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* Tutorial Section Header */}
      <div className="bg-[#EA104A] py-8 shadow-xl relative z-20">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-center">
          <h2 className="text-4xl font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
            <Presentation weight="fill" className="w-10 h-10" />
            {data.tutorialHeader}
          </h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-8">
        {/* Training Deck Container */}
        <div className="bg-[#1E293B] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-700 p-4 md:p-8 relative group">
          <div className="absolute top-8 right-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-xl transition-all border border-white/20">
              <ArrowSquareOut weight="bold" className="w-6 h-6" />
            </button>
          </div>

          <div className="aspect-[16/9] bg-white rounded-2xl shadow-inner relative overflow-hidden flex flex-col items-center justify-center border border-slate-600">
            <iframe 
              src={data.iframeUrl} 
              className="w-full h-full border-0"
              allow="autoplay"
              title="Neverskip ERP Training Deck"
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl px-6 py-2 rounded-xl flex items-center gap-6 text-white border border-white/10 text-xs font-bold shadow-2xl pointer-events-none">
               <div className="flex items-center gap-3 border-r border-white/20 pr-6">
                 <span className="text-white/60">Page</span>
                 <span className="bg-white/20 px-2 py-0.5 rounded text-sm">2</span>
                 <span className="text-white/40">/ 14</span>
               </div>
               <div className="flex items-center gap-4">
                 <CaretLeft weight="bold" className="w-4 h-4 opacity-50" />
                 <CaretRight weight="bold" className="w-4 h-4 opacity-50" />
                 <div className="w-[1px] h-3 bg-white/20 mx-1" />
                 <MagnifyingGlassPlus weight="bold" className="w-4 h-4 opacity-50" />
               </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <a 
            href={data.videoTutorialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-500 group-hover:text-white transition-all">
              <Monitor className="w-8 h-8" weight="fill" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">{data.videoTutorialTitle}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{data.videoTutorialDesc}</p>
          </a>
        </div>
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
