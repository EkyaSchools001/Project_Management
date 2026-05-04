import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  Monitor,
  CheckCircle,
  PencilSimple,
  CalendarBlank
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { PortalBanner } from "@/components/layout/PortalBanner";
import { useNavigate } from "react-router-dom";

export default function GoogleCalendarPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [data, setData] = useState({
    heroTitle: "GOOGLE CALENDAR",
    heroImage: "/assets/technology/google_workspace_banner.png",
    introTitle: "INTRODUCTION",
    introContent: "Google Calendar is a Google App that is a great resource to use to manage your everyday tasks and activities. It integrates with your Gmail and other Google Apps so you are always on task and have your schedule!",
    objectiveTitle: "OBJECTIVES OF THE TUTORIAL",
    trainingTitle: "GOOGLE TRAINING ON CALENDAR",
    objectiveGroups1Title: "Schedule events",
    objectiveGroups1Text: "Create an event | https://drive.google.com/file/d/1eutSyW5VmiT4ByO0X0GDROK47EFhz1DZ/view\nInvite guests | https://drive.google.com/file/d/125W2ik73cgfanTA_faJPBzt6fzMOIAkF/view\nAdd event details, video conferencing, and attachments | https://drive.google.com/file/d/1FfUETtldH9Hg1_ugv0LKOtSoeRc2AG8E/view\nSave and update events | https://drive.google.com/file/d/1CbfrrgpOgz9uSivqQd2Fmg823owsfUaz/view",
    objectiveGroups2Title: "Share and view calendars",
    objectiveGroups2Text: "Share your calendar | https://drive.google.com/file/d/1_TC4QEbeXKhMqA72ce2J6dZAXPcWRrHi/view\nView other people's calendars | https://drive.google.com/file/d/1S7bbLqQjvE_UkpTOLU8EyZvLSviDJiJY/view\nCreate a shared calendar | https://drive.google.com/file/d/1EcPH6iKpOHfGVy5MXA6alSBHQep7cyq4/view\nDelete a calendar | https://drive.google.com/file/d/17GJGnIlJgYbkfZeyS8Gh7lQ5jNa9lu5T/view",
    trainingLinksText: "Schedule events - G Suite Learning Center | https://drive.google.com/file/d/1o--VXuX7sCB1TFgoshuo0PR1QZkHZEYJ/view\nRespond to and manage events - G Suite Learning Center | https://drive.google.com/file/d/1a77n_04VeG0uhVW8vzBN5ImfCIHzOHUd/view\nCreate reminders in Calendar - G Suite Learning Center | https://drive.google.com/file/d/1TDjPVSp6ZFAC7_7UJsUJQwU6wUWhnlgu/view\nShare and view calendars - G Suite Learning Center | https://drive.google.com/file/d/1pXVe_J4omIxR7ro-ezPVukJGKGZLXdVn/view\nCustomize your calendar - G Suite Learning Center | https://drive.google.com/file/d/1UP3sGow-c79PYA4Rn0WRMqAoANjh3yCN/view\nAccess your notes and tasks - G Suite Learning Center | https://drive.google.com/file/d/1534EX8BCuKvMuDYXzHBYfBBGwfOMtJIB/view"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_tech_google_calendar");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch google calendar content:", error);
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
        settingKey="page_tech_google_calendar"
        initialData={data}
        onSave={setData}
        title="Edit Google Calendar Page"
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
          { key: "trainingTitle", label: "Training Section Title", type: "input" },
          { key: "trainingLinksText", label: "Training Links (Title | URL)", type: "textarea" },
        ]}
      />

      <PortalBanner 
        title={data.heroTitle}
        subtitle="Manage your tasks, activities, and schedule efficiently with Google Calendar."
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        icon={CalendarBlank}
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
            {[1, 2].map((idx) => (
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
