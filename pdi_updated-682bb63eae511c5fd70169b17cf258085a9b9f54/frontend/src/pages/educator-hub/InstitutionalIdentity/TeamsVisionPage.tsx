import React from "react";
import { 
  CaretLeft, 
  UsersThree,
  PencilSimple
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const TeamsVisionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = React.useState({
    heroImage: "",
    teamsTitle: "The People/Teams Behind the Vision",
    teamsContent: "Meet the educators, designers, researchers, and professionals who bring Ekya's mission to life daily. Discover the diverse expertise, backgrounds, and passions of our team members—from curriculum specialists to instructional designers to community coordinators. This is where you see the faces and stories of the people dedicated to your success."
  });

  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_teams_vision");
        if (result && result.value) {
          setData(prev => ({
            ...prev,
            ...result.value
          }));
        }
      } catch (error) {
        console.error("Failed to fetch teams vision content:", error);
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
        <div 
          className="relative h-[320px] flex flex-col items-center justify-center bg-[#1F2839] overflow-hidden rounded-[3rem] shadow-2xl transition-all duration-700"
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
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase mb-4 drop-shadow-2xl max-w-4xl leading-tight">
            The Teams Behind <br/> The Vision
          </h1>
          <p className="text-white/80 text-xl font-medium tracking-[0.3em] uppercase mt-4">People Dedicated to Success</p>
          <div className="mt-8 h-1.5 w-32 bg-[#EA104A] mx-auto rounded-full shadow-[0_0_20px_rgba(234,16,74,0.5)]"></div>
        </motion.div>
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-12 p-2.5 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-white/40 hover:scale-105 transition-all group flex items-center gap-3 px-6 shadow-2xl z-20"
        >
          <CaretLeft weight="bold" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Back</span>
        </button>

        {canEdit() && (
          <Button 
            className="absolute top-12 right-12 bg-[#EA104A] hover:bg-[#D61040] text-white gap-2 z-20 shadow-xl px-6 py-6 rounded-full font-bold uppercase tracking-widest"
            onClick={() => setIsEditorOpen(true)}
          >
            <PencilSimple size={20} weight="bold" />
            Edit
          </Button>
        )}
        </div>
      </div>

      <PageEditorControls 
        settingKey="page_teams_vision"
        initialData={data}
        onSave={setData}
        title="Teams Vision Page Content"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroImage", label: "Hero Background Image", type: "image" },
          { key: "teamsTitle", label: "Teams Section Title", type: "input" },
          { key: "teamsContent", label: "Teams Section Content", type: "textarea" },
        ]}
      />

      {/* CONTENT SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-20 relative z-20 space-y-12">

        {/* TEAMS CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-primary/20 flex flex-col md:flex-row gap-12 items-start"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#FEF2F2] flex items-center justify-center shrink-0 shadow-inner">
            <UsersThree size={48} className="text-[#E63946]" weight="duotone" />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-black text-[#1F2839] mb-8 leading-tight tracking-tight uppercase">
              {data.teamsTitle}
            </h2>
            <p className="text-xl text-slate-600 leading-[1.8] font-medium">
              {data.teamsContent}
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

export default TeamsVisionPage;
