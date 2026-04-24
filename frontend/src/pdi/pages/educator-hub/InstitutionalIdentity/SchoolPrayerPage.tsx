import React from "react";
import { CaretLeft, HandsPraying, PencilSimple } from "@phosphor-icons/react";
import { Button } from "@pdi/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageEditorControls } from "@pdi/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@pdi/services/settingsService";
import { useAuth } from "@pdi/hooks/useAuth";

const SchoolPrayerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = React.useState({
    prayerText: "Aham Sukhito Homi\nNiddhukho Homi\n\nMay I be Happy,\nHappy and Free\n\nLokah Samastah Sukhino Bhavantu\n\nMay we be happy,\nMay we be happy, Me & you",
    footerCaption: "The Spiritual Foundation of Our Community"
  });

  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_school_prayer");
        if (result && result.value) {
          setData(result.value);
        }
      } catch (error) {
        console.error("Failed to fetch prayer content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw.includes("ELC") || raw.includes("PDI") || raw.includes("LEADER") || raw === "TESTER";
  };

  const renderPrayerLines = () => {
    return data.prayerText.split("\n").map((line, idx) => {
      if (line.trim() === "") {
        return <div key={idx} className="h-6" />;
      }
      
      const isItalic = line.includes("Homi") || line.includes("Bhavantu") || line.includes("Samastah");
      
      return (
        <p 
          key={idx} 
          className={`text-2xl md:text-3xl text-gray-800 tracking-tight ${
            isItalic ? "italic font-light text-gray-500" : "font-medium"
          }`}
        >
          {line.trim()}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* HEADER SECTION */}
      <div className="relative w-full h-64 flex flex-col items-center justify-center bg-white overflow-hidden border-b">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-[#1F2839] tracking-widest uppercase">
            School Prayer
          </h1>
          <div className="mt-4 h-1.5 w-64 bg-[#E63946] mx-auto rounded-full"></div>
        </div>
        
        <Button 
          variant="ghost" 
          className="absolute top-6 left-6 text-gray-600 hover:bg-gray-100 gap-2 border border-gray-200 z-10"
          onClick={() => navigate(-1)}
        >
          <CaretLeft size={20} /> Back
        </Button>

        {canEdit() && (
          <Button 
            className="absolute top-6 right-6 bg-[#E63946] hover:bg-[#D62839] text-white gap-2 z-10 shadow-lg"
            onClick={() => setIsEditorOpen(true)}
          >
            <PencilSimple size={18} weight="bold" />
            Edit Content
          </Button>
        )}
      </div>

      <PageEditorControls 
        settingKey="page_school_prayer"
        initialData={data}
        onSave={setData}
        title="School Prayer"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "prayerText", label: "Prayer Text (One line per verse, empty line for spacer)", type: "textarea" },
          { key: "footerCaption", label: "Footer Caption", type: "input" },
        ]}
      />

      {/* CONTENT SECTION */}
      <div className="max-w-4xl mx-auto px-6 py-20 bg-white">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="p-4 bg-[#FEE2E2] rounded-full mb-4">
            <HandsPraying size={48} className="text-[#E63946]" weight="duotone" />
          </div>
          
          <div className="space-y-4">
            {renderPrayerLines()}
          </div>

          <div className="pt-16 max-w-lg text-center">
            <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold">
              {data.footerCaption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolPrayerPage;
