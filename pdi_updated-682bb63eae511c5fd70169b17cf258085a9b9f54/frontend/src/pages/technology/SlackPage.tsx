import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  Monitor,
  ChatCircleText,
  SlackLogo,
  PencilSimple
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { PortalBanner } from "@/components/layout/PortalBanner";
import { useNavigate } from "react-router-dom";

export default function SlackPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "SLACK",
    introQuote: "Slack is a centralized Internal Communication tool that connects teams, facilitates sharing of content, wishing teams on special occasions, milestones, celebrations & events. This platform increases visibility on events across teams hence building an open-door culture.",
    guideSectionTitle: "QUICK START GUIDE TO SLACK",
    guideLinkTitle: "How to use Slack: your quick start guide",
    guideLinkUrl: "https://slack.com/intl/en-gb/help/articles/360059928654-How-to-use-Slack--your-quick-start-guide"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_slack");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch slack content:", error);
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
        settingKey="page_tech_slack"
        initialData={data}
        onSave={setData}
        title="Edit Slack Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroTitle", label: "Hero Banner Title", type: "input" },
          { key: "introQuote", label: "Introduction Quote", type: "textarea" },
          { key: "guideSectionTitle", label: "Guide Section Title", type: "input" },
          { key: "guideLinkTitle", label: "Guide Link Label", type: "input" },
          { key: "guideLinkUrl", label: "Guide URL Link", type: "input" },
        ]}
      />

      <PortalBanner 
        title={data.heroTitle}
        subtitle={data.introQuote.split('.')[0] + '.'}
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        icon={SlackLogo}
        className="mt-6 mb-12"
      />

      <div className="max-w-6xl mx-auto px-8 py-20 space-y-24">
        {/* Introduction */}
        <section className="text-center">
          <p className="text-xl text-slate-700 leading-relaxed font-medium max-w-4xl mx-auto italic">
            "{data.introQuote}"
          </p>
        </section>

        {/* Quick Start Guide */}
        <section className="mb-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="bg-rose-500 py-10 px-8 rounded-t-[2rem] shadow-lg text-center">
              <h2 className="text-4xl font-bold text-white uppercase tracking-wider">{data.guideSectionTitle}</h2>
            </div>
            
            <div className="bg-white border-x border-b border-slate-100 rounded-b-[2rem] shadow-xl overflow-hidden group">
              <a 
                href={data.guideLinkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center p-20 space-y-12 transition-all hover:bg-slate-50"
              >
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#4A154B] rounded-3xl rotate-6 group-hover:rotate-12 transition-transform opacity-10" />
                <SlackLogo className="w-40 h-40 text-[#4A154B] relative z-10" weight="fill" />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-bold text-rose-500 group-hover:text-rose-600 transition-colors underline underline-offset-8 decoration-rose-200">
                  {data.guideLinkTitle}
                </h3>
              </div>
            </a>
          </div>
          </div>
        </section>
      </div>

      {/* Footer Branding & Legal */}
      <footer className="mt-20 border-t border-slate-100">
        <div className="bg-white py-16 px-8 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-12">
            <div className="flex items-center gap-8">
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-primary/20 flex items-center justify-center font-bold text-rose-600">EKYA SCHOOLS</div>
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-sidebar-border flex items-center justify-center font-black text-blue-800">CMR</div>
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
