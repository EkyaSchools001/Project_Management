import React, { useState, useEffect } from 'react';
import { 
  IdentificationCard,
  FileText,
  ClockAfternoon,
  Question,
  GraduationCap,
  ArrowRight,
  Monitor,
  PencilSimple
} from '@phosphor-icons/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { PortalBanner } from "@/components/layout/PortalBanner";
import { useNavigate } from "react-router-dom";

export default function GreytHRPage() {
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "GREYTHR",
    heroImage: "/assets/technology/greythr_banner.png",
    description: "GreytHR is a 24x7 Employee Self Service portal.",
    points: "Effective management of attendance, leaves & payroll.\nSeamless payroll process.\nFAQ document prepared to address the commonly captured queries or issues.",
    tutorialTitle: "TUTORIAL",
    knowledgeBankLabel: "Knowledge Bank",
    knowledgeBankUrl: "https://ekyacmr.greythr.com"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_greythr");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch greythr content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw === "TESTER";
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ClockAfternoon": return <ClockAfternoon className="w-5 h-5 text-primary" />;
      case "IdentificationCard": return <IdentificationCard className="w-5 h-5 text-primary" />;
      case "Question": return <Question className="w-5 h-5 text-primary" />;
      default: return <GraduationCap className="w-5 h-5 text-primary" />;
    }
  };

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white relative">
      <PortalBanner 
        title={data.heroTitle}
        subtitle={data.description}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        icon={IdentificationCard}
        className="mt-6 mb-12"
      />

      <PageEditorControls 
        settingKey="page_tech_greythr"
        initialData={data}
        onSave={setData}
        title="Edit GreytHR Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroTitle", label: "Hero Banner Title", type: "input" },
          { key: "heroImage", label: "Hero Banner Image", type: "image" },
          { key: "description", label: "Description Text", type: "textarea" },
          { key: "points", label: "Feature Points (1 per line)", type: "textarea" },
          { key: "tutorialTitle", label: "Tutorial Section Title", type: "input" },
          { key: "knowledgeBankLabel", label: "Knowledge Bank Label", type: "input" },
          { key: "knowledgeBankUrl", label: "Knowledge Bank URL", type: "input" },
        ]}
      />

      {/* Description Section */}
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="bg-slate-50 border border-primary/20 rounded-[2.5rem] p-12 shadow-sm">
          <p className="text-2xl text-slate-700 font-medium mb-10 leading-relaxed">
            {data.description}
          </p>
          <ul className="space-y-6">
            {(data.points || "").split('\n').filter(p => p.trim()).map((point, index) => (
              <li key={index} className="flex items-start gap-4 text-lg text-slate-600 group">
                <div className="mt-1 p-1 bg-white rounded-lg shadow-sm border border-primary/20 group-hover:scale-110 transition-transform">
                  <ClockAfternoon className="w-5 h-5 text-primary" />
                </div>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tutorial Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
        <div className="bg-primary py-12 rounded-[2rem] text-center overflow-hidden relative shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          <h2 className="text-4xl font-extrabold text-white tracking-widest relative z-10 transition-all hover:scale-105 uppercase">{data.tutorialTitle}</h2>
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="max-w-5xl mx-auto px-8 py-24 text-center">
        <div className="inline-block p-12 bg-white border border-primary/20 rounded-3xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="h-20 mx-auto mb-10 flex flex-col items-center justify-center">
            {/* Inline SVG Logo for reliability */}
            <svg viewBox="0 0 100 40" className="h-16 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15C15 10 19 6 24 6C29 6 33 10 33 15C33 16 33 17 32 18C35 15 40 15 43 18C46 15 51 15 54 18C57 15 62 15 65 18C64 17 64 16 64 15C64 10 68 6 73 6C78 6 82 10 82 15C82 19 80 23 76 25L70 28L60 30L40 30L30 28L24 25C20 23 15 19 15 15Z" fill="#1E293B" opacity="0.1" />
              <text x="5" y="32" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="18" fill="#1E293B">greyt</text>
              <text x="50" y="32" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="18" fill="#F43F5E">HR</text>
              <path d="M35 12C35 8 38 5 42 5C46 5 49 8 49 12" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <a 
            href={data.knowledgeBankUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2"
          >
            <span className="text-2xl font-bold text-slate-800 border-b-2 border-transparent group-hover:border-primary transition-all">GreytHR</span>
            <span className="text-xl text-primary font-semibold flex items-center gap-2 group-hover:gap-4 transition-all uppercase">
              {data.knowledgeBankLabel} <ArrowRight weight="bold" />
            </span>
          </a>
        </div>
      </div>

      {/* Footer Branding & Legal */}
      <footer className="mt-20 border-t border-slate-100">
        <div className="bg-white py-16 px-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-12">
            <div className="flex items-center gap-8">
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-primary/20 flex items-center justify-center font-bold text-rose-600">EKYA SCHOOLS</div>
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-primary/20 flex items-center justify-center font-black text-blue-800">CMR</div>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-400 font-medium max-w-xl justify-center lg:justify-end">
              {['JP Nagar', 'ITPL', 'BTM Layout', 'Byrathi', 'NICE Road'].map((s) => (
                <span key={s} className="hover:text-primary cursor-pointer transition-colors border-r border-slate-200 pr-4 last:border-0 capitalize">Ekya School {s}</span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-primary transition-colors cursor-pointer">
                  <Monitor className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-primary py-12 px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[11px] leading-relaxed text-rose-100/80 font-medium italic">
              "The information disclosed in this site is the valuable property of Ekya Schools and CMR. As a condition of all employees, you will hold all of our organisation's confidential and proprietary information in confidence and will not disclose, use, copy, publish, summarize, share or remove from the premises of the organisation any proprietary or confidential information, except as is necessary to carry out your assigned responsibilities. 'Confidential' and 'Proprietary' Information shall include, but are not limited to, all information related to any aspect of the running of the organisation, including documents, manuals, files, curriculum documents, calendars, finances, plans, promotional methods, marketing plans, lists of parent names, student names and information or personnel lists of suppliers, vendors, partners etc. Any breach of confidentiality or misuse of information could result in disciplinary action including termination of employment and legal course of action."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
