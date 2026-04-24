import React from "react";
import { 
  CaretLeft, 
  Trophy, 
  UsersThree,
  PencilSimple
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const LegacyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = React.useState({
    heroImage: "",
    legacyTitle: "15 Year Legacy",
    legacyContent: "Celebrate over a decade of impact. This section highlights key achievements, programs launched, schools and teachers served, and transformations witnessed across our community. It's a testaments to our sustained commitment and the trust educators have placed in us."
  });

  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_legacy");
        if (result && result.value) {
          setData(prev => ({
            ...prev,
            ...result.value
          }));
        }
      } catch (error) {
        console.error("Failed to fetch legacy content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw.includes("ELC") || raw.includes("PDI") || raw.includes("LEADER") || raw === "TESTER";
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* HERO SECTION */}
      <div 
        className="relative w-full h-[450px] flex flex-col items-center justify-center bg-[#1F2839] overflow-hidden"
        style={data.heroImage ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${data.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase mb-4 drop-shadow-2xl">
            Our Legacy
          </h1>
          <p className="text-white/80 text-xl font-medium tracking-[0.3em] uppercase">15 Years of Excellence</p>
          <div className="mt-8 h-1.5 w-32 bg-[#E63946] mx-auto rounded-full"></div>
        </motion.div>
        
        <Button 
          variant="ghost" 
          className="absolute top-8 left-8 text-white hover:bg-white/10 gap-2 z-10 font-bold uppercase tracking-widest bg-black/20 backdrop-blur-md px-6 py-6 rounded-full"
          onClick={() => navigate(-1)}
        >
          <CaretLeft size={24} weight="bold" /> Back
        </Button>

        {canEdit() && (
          <Button 
            className="absolute top-8 right-8 bg-[#E63946] hover:bg-[#D62839] text-white gap-2 z-10 shadow-xl px-6 py-6 rounded-full font-bold uppercase tracking-widest"
            onClick={() => setIsEditorOpen(true)}
          >
            <PencilSimple size={20} weight="bold" />
            Edit
          </Button>
        )}
      </div>

      <PageEditorControls 
        settingKey="page_legacy"
        initialData={data}
        onSave={setData}
        title="Legacy Page Content"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroImage", label: "Hero Background Image", type: "image" },
          { key: "legacyTitle", label: "Legacy Section Title", type: "input" },
          { key: "legacyContent", label: "Legacy Section Content", type: "textarea" },
        ]}
      />

      {/* CONTENT SECTIONS */}
      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-20 space-y-12">
        {/* 15 YEAR LEGACY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-primary/20 flex flex-col md:flex-row gap-12 items-start"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#FEF2F2] flex items-center justify-center shrink-0 shadow-inner">
            <Trophy size={48} className="text-[#E63946]" weight="duotone" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#1F2839] mb-8 leading-tight tracking-tight uppercase">
              {data.legacyTitle}
            </h2>
            <p className="text-xl text-slate-600 leading-[1.8] font-medium">
              {data.legacyContent}
            </p>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM ACCENT */}
      <div className="mt-24 max-w-7xl mx-auto px-6 border-t border-slate-200 pt-12 text-center">
        <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-sm">Empowering educators since 2009</p>
      </div>
    </div>
  );
};

export default LegacyPage;
