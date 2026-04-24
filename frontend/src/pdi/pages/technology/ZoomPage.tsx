import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  CheckCircle,
  VideoCamera,
  ShieldCheck,
  Lightning,
  MonitorPlay,
  Users,
  Presentation,
  ChatCircleText,
  Trash,
  ArrowRight,
  PencilSimple
} from '@phosphor-icons/react';
import { Button } from "@pdi/components/ui/button";
import { useAuth } from "@pdi/hooks/useAuth";
import { settingsService } from "@pdi/services/settingsService";
import { PageEditorControls } from "@pdi/components/educator-hub/InstitutionalIdentity/PageEditorControls";

export default function ZoomPage() {
  const { user } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "ZOOM",
    heroImage: "",
    introContent: "While we are running virtual school, the platform that we will be using at Ekya and CMR K-12 is Zoom. Typically, free Zoom accounts have a 40 minute limit per meeting. However, as a service offered to schools impacted by COVID-19 lockdown, Zoom has offered to remove the 40-minute limit for accounts from verified domains. Currently, the 40 minute limit has been removed for all @ekyaschools.com and @cmrnps.ac.in accounts. Each teacher will need to create their own account at Zoom using your official email address.",
    tutorialsTitle: "TUTORIALS",
    settingsTitle: "ZOOM SETTINGS",
    engagementTitle: "TOOLS FOR CALL ENGAGEMENT",
    engagementInstruction: "Some tools you may want to consider using to engage students when on a Zoom call include:",
    onlineLearningUrl: "https://docs.google.com/document/d/1iyWiXttxQxWA1qrArjyxzNb9T8BvZgUVCjfgSMWuvE8/edit?tab=t.0#heading=h.vulj2cokosps",
    tutorialsText: "How to join a meeting | https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0060732\nSharing Your Screen | https://www.youtube.com/embed/YA6SGQlVmcA?rel=0&autoplay=1&cc_load_policy=1\nHost Controls in a Meeting | https://www.youtube.com/embed/ygZ96J_z4AY?rel=0&autoplay=1&cc_load_policy=1\nUsing Annotation Tools on a Shared Screen or Whiteboard | https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0067931\nBreakout rooms | https://www.youtube.com/embed/ygZ96J_z4AY?rel=0&autoplay=1&cc_load_policy=1",
    toolsText: "Mentimeter | ask poll questions to an audience, create word clouds, quizzes etc | https://www.mentimeter.com/plans\nNearpod | ask poll questions, quizzes, gamify a quiz etc | https://nearpod.com/\nPadlet | build a board with student thoughts | https://padlet.com/\nKahoot | to game-ify learning (games and quizzes created by other educators already exist) | https://kahoot.com/schools/",
    setUpPointsText: "Require a meeting password\nEnable your waiting room\nParticipant mic and video to be turned off when joining\nDo not allow join before host",
    duringPointsText: "Do not allow participants to rename themselves\nDo not allow participants to chat with everyone - only host, or everyone publicly\nDo not allow participants to annotate on the screen",
    afterPointsText: "When you leave the session, do make sure that you end the call for everyone"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_zoom");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch zoom content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    return user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  };

  return (
    <div className="min-h-screen bg-white pb-20 relative">
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
        settingKey="page_tech_zoom"
        initialData={data}
        onSave={setData}
        title="Edit Zoom Page"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroTitle", label: "Hero Banner Title", type: "input" },
          { key: "introContent", label: "Introduction Body Text", type: "textarea" },
          { key: "tutorialsTitle", label: "Tutorials Section Title", type: "input" },
          { key: "settingsTitle", label: "Settings Section Title", type: "input" },
          { key: "engagementTitle", label: "Engagement Section Title", type: "input" },
          { key: "engagementInstruction", label: "Engagement Instruction Text", type: "textarea" },
          { key: "tutorialsText", label: "Tutorials (Title | URL)", type: "textarea" },
          { key: "toolsText", label: "Engagement Tools (Name | Description | URL)", type: "textarea" },
          { key: "setUpPointsText", label: "Set Up Points (Required Points)", type: "textarea" },
          { key: "duringPointsText", label: "During Meeting Points", type: "textarea" },
          { key: "afterPointsText", label: "After Meeting Points", type: "textarea" },
          { key: "onlineLearningUrl", label: "Online Learning Tools Document Link", type: "input" },
        ]}
      />

      {/* Hero Banner Section */}
      <div className="relative w-full h-[300px] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="relative z-10 space-y-4">
            <h1 className="text-8xl font-bold tracking-[0.2em] text-white uppercase drop-shadow-2xl">
              {data.heroTitle}
            </h1>
            <div className="h-2 w-full max-w-[300px] bg-rose-500 mx-auto rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-16 space-y-24">
        {/* Intro */}
        <section className="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xl text-slate-700 leading-relaxed font-medium">
            {data.introContent}
          </p>
        </section>

        {/* Tutorials */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-12 w-3 bg-rose-500 rounded-full" />
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{data.tutorialsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data.tutorialsText || "").split('\n').filter(l => l.includes('|')).map((line, i) => {
              const [title, url] = line.split('|').map(s => s.trim());
              return (
                <a 
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <MonitorPlay weight="bold" className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors leading-snug">
                      {title}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Settings */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-12 w-3 bg-rose-500 rounded-full" />
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{data.settingsTitle}</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Setting Up */}
            <div className="bg-white border-t-4 border-rose-500 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-rose-500">
                <Lightning weight="fill" className="w-6 h-6" />
                <h3 className="text-xl font-bold uppercase tracking-wide">Setting Up</h3>
              </div>
              <ul className="space-y-4">
                {(data.setUpPointsText || "").split('\n').filter(l => l.trim()).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 font-medium leading-relaxed">
                    <CheckCircle weight="fill" className="w-5 h-5 text-rose-500 mt-1 shrink-0" />
                    {s.trim()}
                  </li>
                ))}
              </ul>
            </div>

            {/* During */}
            <div className="bg-white border-t-4 border-rose-500 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-rose-500">
                <MonitorPlay weight="fill" className="w-6 h-6" />
                <h3 className="text-xl font-bold uppercase tracking-wide">During meeting</h3>
              </div>
              <ul className="space-y-4">
                {(data.duringPointsText || "").split('\n').filter(l => l.trim()).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 font-medium leading-relaxed">
                    <CheckCircle weight="fill" className="w-5 h-5 text-rose-500 mt-1 shrink-0" />
                    {s.trim()}
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="bg-white border-t-4 border-rose-500 p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-rose-500">
                <Trash weight="fill" className="w-6 h-6" />
                <h3 className="text-xl font-bold uppercase tracking-wide">After meeting</h3>
              </div>
              <ul className="space-y-4">
                {(data.afterPointsText || "").split('\n').filter(l => l.trim()).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 font-medium leading-relaxed">
                    <CheckCircle weight="fill" className="w-5 h-5 text-rose-500 mt-1 shrink-0" />
                    {s.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Engagement Tools */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-12 w-3 bg-rose-500 rounded-full" />
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">{data.engagementTitle}</h2>
          </div>
          
          <div className="space-y-8">
            <p className="text-lg text-slate-600 font-medium">
              {data.engagementInstruction}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(data.toolsText || "").split('\n').filter(l => l.includes('|')).map((line, i) => {
                const parts = line.split('|').map(s => s.trim());
                const [name, description, url] = parts;
                return (
                  <a 
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 hover:bg-slate-100 transition-colors"
                  >
                    <h4 className="text-xl font-bold text-slate-900">{name}</h4>
                    <p className="text-slate-600 leading-relaxed font-medium italic">
                      {description}
                    </p>
                  </a>
                );
              })}
            </div>
            <div className="pt-8 text-center">
              <a 
                href={data.onlineLearningUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xl font-bold text-rose-500 hover:text-rose-600 transition-colors underline underline-offset-8 decoration-rose-200"
              >
                Online Learning Tools
                <ArrowRight weight="bold" />
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
              <div className="h-12 w-auto bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex items-center justify-center font-bold text-rose-600">EKYA SCHOOLS</div>
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
