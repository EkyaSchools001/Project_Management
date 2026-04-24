import React from "react";
import { CampusPageLayout } from "./CampusPageLayout";
import { CampusHero } from "./CampusHero";
import { CampusMessage } from "./CampusMessage";
import { LeadershipGrid } from "./LeadershipGrid";
import { InstructionList } from "./InstructionList";
import { SchoolTeamData } from "@/types/schoolTeam";
import { PageEditorControls } from "../InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";

interface CampusDetailPageProps {
  data: SchoolTeamData;
}

export const CampusDetailPage = ({ data }: CampusDetailPageProps) => {
  const [campusData, setCampusData] = React.useState(data);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const slug = data.schoolName.toLowerCase().replace(/\s+/g, '-');
  const settingKey = `campus_content_${slug}`;

  React.useEffect(() => {
    const fetchCampusData = async () => {
      try {
        const result = await settingsService.getSetting(settingKey);
        if (result && result.value) {
          setCampusData(prev => ({
            ...prev,
            ...result.value
          }));
        }
      } catch (error) {
        console.error(`Failed to fetch campus data for ${slug}:`, error);
      }
    };
    fetchCampusData();
  }, [settingKey]);

  const highlightColor = campusData.theme?.highlight || campusData.accentColor || "#e53935";

  // Configuration for the personnel list items
  const personnelFields: any[] = [
    { key: "name", label: "Name", type: "input" },
    { key: "role", label: "Role", type: "input" },
    { key: "image", label: "Profile Photo", type: "image" },
    { key: "email", label: "Email", type: "input" },
    { key: "phone", label: "Phone (Optional)", type: "input" },
  ];

  return (
    <CampusPageLayout 
      schoolName={campusData.schoolName} 
      breadcrumbPath={`/campuses/${slug}`}
      accentColor={highlightColor}
      onEdit={() => setIsEditorOpen(true)}
    >
      <CampusHero 
        title={campusData.schoolName}
        backgroundImage={campusData.heroImage}
        accentColor={highlightColor}
      />

      <PageEditorControls 
        settingKey={settingKey}
        initialData={campusData}
        onSave={(newData) => {
          setCampusData(prev => ({
            ...prev,
            ...newData
          }));
        }}
        title={`${campusData.schoolName} Content`}
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "section_general", label: "General Content", type: "section" },
          { key: "heroImage", label: "Hero Background Image", type: "image" },
          { key: "welcomeMessage", label: "Campus Welcome Message", type: "textarea" },
          
          { key: "section_head", label: "Head's Message", type: "section" },
          { key: "headMessage.image", label: "Head's Profile Photo", type: "image" },
          { key: "headMessage.content", label: "Head's Message Content", type: "textarea" },

          { key: "section_personnel", label: "Campus Team Management", type: "section" },
          { 
            key: "leaders", 
            label: "Leadership Team Profiles", 
            type: "list",
            itemFields: personnelFields
          },
          { 
            key: "coordinators", 
            label: "Coordinators Profiles", 
            type: "list",
            itemFields: personnelFields
          }
        ]}
      />

      {campusData.headMessage && (
        <CampusMessage 
          image={campusData.headMessage.image}
          content={campusData.headMessage.content}
          author={campusData.headMessage.author}
          designation={campusData.headMessage.designation}
        />
      )}

      <div className={campusData.headMessage ? "bg-slate-50" : "bg-white"}>
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#1F2839] tracking-[0.2em] uppercase">
              Leadership Team
            </h2>
            <div className="w-24 h-1 mx-auto mt-6" style={{ backgroundColor: highlightColor }} />
          </div>

          <LeadershipGrid 
            leaders={campusData.leaders || []}
            coordinators={campusData.coordinators || []}
            welcomeMessage={campusData.welcomeMessage}
            accentColor={highlightColor}
            theme={campusData.theme}
          />
        </div>
      </div>

      {campusData.instructionCategories ? (
        campusData.instructionCategories.map((category, index) => (
          <InstructionList 
            key={category.title}
            title={category.title}
            instructions={category.items}
            accentColor={highlightColor}
            backgroundColor={index % 2 === 1 ? "white" : undefined}
          />
        ))
      ) : (
        <InstructionList 
          instructions={campusData.instructions || []}
          accentColor={highlightColor}
        />
      )}
    </CampusPageLayout>
  );
};
