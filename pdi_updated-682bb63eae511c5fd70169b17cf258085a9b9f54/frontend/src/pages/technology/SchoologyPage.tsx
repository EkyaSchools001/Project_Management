import React, { useState, useEffect } from 'react';
import {
  Monitor,
  DeviceMobile,
  Key,
  ArrowRight,
  Info,
  GraduationCap,
  PencilSimple,
  Student
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { PortalBanner } from "@/components/layout/PortalBanner";
import { useNavigate } from "react-router-dom";

export default function SchoologyPage() {
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "SCHOOLOGY",
    heroImage: "/assets/technology/schoology_banner.png",
    introTitle: "INTRODUCTION",
    introContent1: "Schoology is a social networking service virtual learning environment for K-12 school and higher education institutions that allows users to create, manage, and share academic content.",
    introContent2: "Also known as a learning management system (LMS) or course management system (CMS), the cloud-based platform provides tools needed to manage an online classroom. Schoology can help teachers contact students with homework and more. They can post daily reminders or updates. They can message students, manage the assignment calendar and put new assignments.",
    tutorialTitle: "TUTORIAL ON HOW TO LOGIN",
    tutorialInstruction: "Please click on the links below to see how to login to Schoology",
    desktopLoginUrl: "https://drive.google.com/file/d/1khDIHWoF647eN1UVPpJcGr8fGmx0X-iW/view",
    mobileLoginUrl: "https://drive.google.com/file/d/1s953WKne7hRqIr9fjamyNTpyrZPtG1ak/view",
    onboardingTitle: "SCHOOLOGY ONBOARDING COURSE FOR ALL TEACHERS",
    onboardingDesc: "We understand that many of you may want to practice using Schoology on your own. For this reason, we have put together a Schoology Onboarding tutorial. It is essential for everyone to join the Schoology onboarding course. Click the link below to see how to join the course. Within the course, please explore all the materials and other features to know more about the platform.",
    onboardingLinkTitle: "How to join a course with access code",
    onboardingLinkUrl: "https://drive.google.com/file/d/137uw0wo2FRXHb5g99TbRa7hwhWp1bWN-/view",
    accessCode: "HZ9R-C83S-GCB2T",
    loginLinksText: "Desktop/Browser | https://drive.google.com/file/d/1khDIHWoF647eN1UVPpJcGr8fGmx0X-iW/view\nMobile/tablet app (Android/iOS) | https://drive.google.com/file/d/1s953WKne7hRqIr9fjamyNTpyrZPtG1ak/view"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_schoology");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch schoology content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw === "TESTER";
  };

  const navigate = useNavigate();
  const loginLinks = [
    { title: "Desktop/Browser", icon: <Monitor className="w-5 h-5" />, url: data.desktopLoginUrl },
    { title: "Mobile/tablet app (Android/iOS)", icon: <DeviceMobile className="w-5 h-5" />, url: data.mobileLoginUrl },
  ];

  return (
    <div className="min-h-screen bg-white relative">

      <PageEditorControls 
        settingKey="page_tech_schoology"
        initialData={data}
        onSave={setData}
        title="Edit Schoology Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroTitle", label: "Hero Banner Title", type: "input" },
          { key: "heroImage", label: "Hero Banner Image", type: "image" },
          { key: "introTitle", label: "Introduction Title", type: "input" },
          { key: "introContent1", label: "Intro Paragraph 1", type: "textarea" },
          { key: "introContent2", label: "Intro Paragraph 2", type: "textarea" },
          { key: "tutorialTitle", label: "Tutorial Section Title", type: "input" },
          { key: "tutorialInstruction", label: "Tutorial Top Instruction", type: "textarea" },
          { key: "desktopLoginUrl", label: "Desktop Login Tutorial Link", type: "input" },
          { key: "mobileLoginUrl", label: "Mobile Login Tutorial Link", type: "input" },
          { key: "onboardingTitle", label: "Onboarding Section Title", type: "input" },
          { key: "onboardingDesc", label: "Onboarding Description", type: "textarea" },
          { key: "onboardingLinkTitle", label: "Onboarding Link Label", type: "input" },
          { key: "onboardingLinkUrl", label: "Onboarding URL Link", type: "input" },
          { key: "accessCode", label: "Onboarding Access Code", type: "input" },
          { key: "loginLinksText", label: "Login Links (Title | URL)", type: "textarea" },
        ]}
      />

      <PortalBanner 
        title={data.heroTitle}
        subtitle={data.introContent1}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        icon={Student}
        className="mt-6 mb-12"
      />

      {/* Introduction Section */}
      <section className="mb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-primary py-10 px-8 rounded-[2rem] shadow-lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.introTitle}</h2>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-20 flex flex-col md:flex-row items-center gap-16">
          <div className="w-64 h-64 shrink-0 bg-white border-2 border-slate-100 rounded-3xl shadow-xl flex items-center justify-center p-8 transition-transform hover:scale-105">
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="#00ADEF" />
              <text x="50" y="65" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="45" fill="white" textAnchor="middle">S</text>
            </svg>
          </div>
          <div className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed font-medium">
              {data.introContent1}
            </p>
            <p className="text-lg text-slate-700 leading-relaxed italic">
              {data.introContent2}
            </p>
          </div>
        </div>
      </section>

      {/* Login Tutorial Section */}
      <section className="mb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-primary py-10 px-8 rounded-[2rem] shadow-lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.tutorialTitle}</h2>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="bg-slate-50 border border-primary/20 rounded-3xl p-10 shadow-sm transition-all hover:bg-slate-100/50">
            <p className="text-xl font-semibold text-slate-800 mb-10 flex items-center gap-3">
              <Info className="w-6 h-6 text-primary" weight="fill" />
              {data.tutorialInstruction}
            </p>
            <div className="space-y-6">
              {(data.loginLinksText || "").split('\n').filter(l => l.includes('|')).map((line, i) => {
                const [title, url] = line.split('|').map(s => s.trim());
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-xl text-slate-700 font-bold group hover:text-primary transition-all underline underline-offset-8 decoration-slate-200 hover:decoration-primary"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                      {title.toLowerCase().includes('mobile') ? <DeviceMobile className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                    </div>
                    {title}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Course Section */}
      <section className="mb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-primary py-10 px-8 rounded-[2rem] shadow-lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-white uppercase tracking-wider leading-tight">{data.onboardingTitle}</h2>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="space-y-10 leading-relaxed text-slate-700 font-medium text-lg">
            <p>
              {data.onboardingDesc}
            </p>
            <div className="bg-white border-2 border-primary/20 rounded-3xl p-10 shadow-lg space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4 transition-transform group-hover:translate-x-0 group-hover:translate-y-0">
                <GraduationCap className="w-32 h-32" />
              </div>

              <a
                href={data.onboardingLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-xl text-slate-700 font-bold hover:text-primary transition-all underline underline-offset-4"
              >
                <div className="p-2 bg-slate-50 rounded-lg group-hover:rotate-6 transition-transform">
                  <ArrowRight className="w-6 h-6" weight="bold" />
                </div>
                {data.onboardingLinkTitle}
              </a>

              <div className="flex items-center gap-4 text-2xl font-black text-slate-900 bg-slate-50 p-6 rounded-2xl border border-primary/20 w-fit">
                <Key className="text-primary w-8 h-8" weight="fill" />
                <span>Access code for teacher onboarding course: <span className="text-primary select-all">{data.accessCode}</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <Monitor className="w-5 h-5 font-bold" />
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
