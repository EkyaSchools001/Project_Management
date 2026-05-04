import React, { useState, useEffect } from 'react';
import { 
  Envelope, 
  UserCircle, 
  Globe, 
  GraduationCap, 
  BookOpen,
  ArrowSquareOut,
  Monitor,
  PencilSimple
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { PortalBanner } from "@/components/layout/PortalBanner";
import { useNavigate } from "react-router-dom";

interface TechSite {
  name: string;
  url: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

export default function TechSitesLogin() {
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    title: "Educator ",
    titleAccent: "Site",
    subtitle: "Access all your essential school platforms and external tools from one unified secure gateway.",
    bannerUrl: "/assets/tech-sites/banner.png",
    
    site1Name: "Ekya/CMR Email",
    site1Url: "https://mail.google.com",
    site1Desc: "Access your official Google Workspace email and collaboration tools.",
    
    site2Name: "greytHR",
    site2Url: "https://ekyacmr.greythr.com",
    site2Desc: "Payroll, leave management, and employee self-service portal.",
    
    site3Name: "Ekyaverse - Neverskip",
    site3Url: "https://app.neverskip.com/appnew/login.php",
    site3Desc: "Core school management system for attendance, grades, and records.",
    
    site4Name: "Schoology",
    site4Url: "https://app.schoology.com",
    site4Desc: "Learning Management System for course content and student engagement.",
    
    site5Name: "PowerSchool",
    site5Url: "https://powerschool.com",
    site5Desc: "Curriculum & Instruction platform for academic planning and tracking.",
    sitesText: "Ekya/CMR Email | https://mail.google.com | Access your official Google Workspace email and collaboration tools.\ngreytHR | https://ekyacmr.greythr.com | Payroll, leave management, and employee self-service portal.\nEkyaverse - Neverskip | https://app.neverskip.com/appnew/login.php | Core school management system for attendance, grades, and records.\nSchoology | https://app.schoology.com | Learning Management System for course content and student engagement.\nPowerSchool | https://powerschool.com | Curriculum & Instruction platform for academic planning and tracking."
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_sites_login");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch tech sites login content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw === "TESTER";
  };

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("email") || n.includes("mail")) return <Envelope className="w-10 h-10" weight="duotone" />;
    if (n.includes("greythr")) return <UserCircle className="w-10 h-10" weight="duotone" />;
    if (n.includes("neverskip") || n.includes("ekyaverse")) return <Globe className="w-10 h-10" weight="duotone" />;
    if (n.includes("schoology")) return <GraduationCap className="w-10 h-10" weight="duotone" />;
    if (n.includes("power")) return <BookOpen className="w-10 h-10" weight="duotone" />;
    return <BookOpen className="w-10 h-10" weight="duotone" />;
  };

  const getGradient = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("email") || n.includes("mail")) return "from-blue-500 to-blue-700";
    if (n.includes("greythr")) return "from-emerald-500 to-emerald-700";
    if (n.includes("neverskip") || n.includes("ekyaverse")) return "from-rose-500 to-rose-700";
    if (n.includes("schoology")) return "from-indigo-500 to-indigo-700";
    if (n.includes("power")) return "from-amber-500 to-amber-700";
    return "from-slate-500 to-slate-700";
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 relative">
      <PortalBanner 
        title={`${data.title}${data.titleAccent}`}
        subtitle={data.subtitle}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        icon={Monitor}
        className="mt-6 mb-12"
      />

      <PageEditorControls 
        settingKey="page_tech_sites_login"
        initialData={data}
        onSave={setData}
        title="Edit Educator Site"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "title", label: "Header Title", type: "input" },
          { key: "titleAccent", label: "Title Accent", type: "input" },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "bannerUrl", label: "Banner Image URL", type: "input" },
          { key: "sitesText", label: "Sites List (Name | URL | Desc)", type: "textarea" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {(data.sitesText || "").split('\n').filter(l => l.includes('|')).map((line, idx) => {
            const [name, url, desc] = line.split('|').map(s => s.trim());
            return (
              <button
                key={idx}
                onClick={() => handleOpenLink(url)}
                className="group relative flex flex-col items-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/20"
              >
                <div className={`mb-6 p-5 rounded-2xl bg-gradient-to-br ${getGradient(name)} text-white shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  {getIcon(name)}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors duration-300">
                  {name}
                </h3>
                <p className="text-sm text-slate-500 text-center leading-relaxed">
                  {desc}
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-primary transition-colors">
                  <span>Launch Site</span>
                  <ArrowSquareOut className="w-4 h-4" />
                </div>

                <div className="absolute top-4 right-4 w-12 h-12 bg-slate-50 rounded-full blur-xl group-hover:bg-primary/5 transition-colors" />
              </button>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm italic">
            Can't find what you're looking for? Please contact the Technology Support Desk.
          </p>
        </div>
      </div>
    </div>
  );
}
