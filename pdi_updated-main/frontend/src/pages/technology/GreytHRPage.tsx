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
    knowledgeBankUrl: "https://ekyacmr.greythr.com/uas/portal/auth/login?login_challenge=k1uNF2YVIGN-nMgoRA1BYeNqvnoAK-wgvAAlIxvXOkIADmYtWoudSbvEweSEpk93PrawmKBtQRmJM-gPsnBHj1JkoPSCcR1MLw69i8cyMec927P7WTQ4jpm5XfI8rj5ArG3CPcciuDOG-cDQcrbsm58C83o2w5qdqTBc_X6f3ymDxcqHGvMSbJ38S6b0ZY9Kw9N--PeFODCFFPRGpPjI9jasV3s-rd5sW5UgkomR0knUxBACvzE_MxNpJm4l0T4Ugfa-9o2XJKCbBrzCc4w93b19lqEibMRCYyT-bjt6lfOYCCAuq7CRyfdwRcMzvfFJlcO0huuLCKBBfNmKLDBtTwBG81vXbWtAQt4wUIOFimAh0NaXBKIOqGuCpjHUHe-D9GJhcYRGrwLimBYCI_d041bi818UQ-vW7yaE55RDJn5Dk5A1r78fudA6VkD71kaSoQ2xJOfFL9BjTX4mJr5ndLxi4buuYf3POhUnU0k5n8BGji6gMDepgyZXDaLeVEypyK322gcZzuxDzOISEsP_BvgoYNdtLKVQsmevb4D2BMBOnegz7CuO79fi8PKKbgkEHYaHDsD3di1aAcwcWoWxyzk5oXCjawmDvNrHGtZ6jv3ku3QfhlAuL2oJuk5aG4VRaVub-mfplcsB8ARTmh-N2XqvFW3SzakAM3-D_GhagkN334mCIafb4HPe9VPEn9r07PR4IIjBGXTtSK7bhQgBXHjomqKxYz54o3UwLeYaPHkquW0OMRRrQWaM5lmJjB6P3C4L-3N466VSeFCx67fc_D4Bu9Mx6s-B9Al2uzodOIIVCmhzisjrkhWrKqhyZzKc2XIvK8n0dOtkoRtz8luIhRVdxlTRb7V0Ksume3pvigSLZ0xgsiRoxfYUgL3J4ddfTcn3EmgmI5SX-_11Z-9pkn961DBi3KnqFK6rG_a_73O8h6hnmZl2ut1VxdJn1hP9-1UmGGDtBM-XFnUxNH4fLvMiPO9S2FnTh9HJ7_KXwcKNJlWOONfZpN817smgRLo6iPezlmVxGMT94YJR2oQTxFMCA4ThlU1e6e7vTWoM8yStMrpz-je3iYpQoJaifoXsLeMQVqXZGD9GG3Wx0gTgZh_e8Jd8618ZrtSZGYH5QC7k9XPS4Xs-NtJ_8P4AJC-kvw32H1sFKkrQ1cYFSW-RPTqJSh0nbywWK2BRwIfC5r83gfAen2v0oJvtq9oAhxMGm7AfINV4umpqFjCm7Pdico_GAttWPtz7k8prkgsCcC-enX9q7b3eWKdMd4QdG5YHB3ypDD-wLUwWbCfjv4hZdCxFnLGlMnZ69Xtz5edDv3am2MaGe8Qa3qjCOGP9k_mHnnkSSsJi-AtKu-D2yy18fRRgEVEj3i90iZt1pgM%3D"
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

      {/* Hero Banner Section */}
      <div className="relative w-full h-[450px] overflow-hidden">
        <img 
          src={data.heroImage} 
          alt="GreytHR Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="relative z-10 space-y-4">
            <h1 className="text-8xl font-bold tracking-[0.2em] text-white drop-shadow-2xl uppercase">
              {data.heroTitle}
            </h1>
            <div className="h-2 w-full max-w-[500px] bg-primary mx-auto rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-12 shadow-sm">
          <p className="text-2xl text-slate-700 font-medium mb-10 leading-relaxed">
            {data.description}
          </p>
          <ul className="space-y-6">
            {(data.points || "").split('\n').filter(p => p.trim()).map((point, index) => (
              <li key={index} className="flex items-start gap-4 text-lg text-slate-600 group">
                <div className="mt-1 p-1 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <ClockAfternoon className="w-5 h-5 text-primary" />
                </div>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tutorial Header */}
      <div className="bg-primary py-12 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <h2 className="text-4xl font-extrabold text-white tracking-widest relative z-10 transition-all hover:scale-105 uppercase">{data.tutorialTitle}</h2>
      </div>

      {/* Tutorial Content */}
      <div className="max-w-5xl mx-auto px-8 py-24 text-center">
        <div className="inline-block p-12 bg-white border border-slate-100 rounded-3xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1">
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
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex items-center justify-center font-bold text-rose-600">EKYA SCHOOLS</div>
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex items-center justify-center font-black text-blue-800">CMR</div>
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
