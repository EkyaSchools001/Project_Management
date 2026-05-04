import React from "react";
import { CaretLeft, HandsPraying, PencilSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";

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
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
        <div className="relative h-52 flex flex-col items-center justify-center bg-[#EA104A] overflow-hidden rounded-[2.5rem] shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase">
            School Prayer
          </h1>
          <div className="mt-4 h-1.5 w-32 bg-white mx-auto rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
        </div>
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-10 left-10 p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:scale-105 transition-all group flex items-center gap-3 px-6 shadow-2xl z-20"
        >
          <CaretLeft weight="bold" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back</span>
        </button>

        {canEdit() && (
          <Button 
            className="absolute top-10 right-10 bg-white/10 hover:bg-white/20 text-white gap-2 border border-white/20 shadow-lg z-20"
            onClick={() => setIsEditorOpen(true)}
          >
            <PencilSimple size={18} weight="bold" />
            Edit Content
          </Button>
        )}
        </div>
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 bg-white">
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
