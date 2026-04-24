import React from "react";
import { 
  Eye, 
  RocketLaunch, 
  Brain, 
  Heart, 
  HandWaving,
  CaretLeft,
  PencilSimple
} from "@phosphor-icons/react";
import { Button } from "@pdi/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageEditorControls } from "@pdi/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@pdi/services/settingsService";
import { useAuth } from "@pdi/hooks/useAuth";

const PhilosophyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = React.useState({
    heroImage: "",
    vision: "Our vision is to empower young minds to make a difference in the world.",
    mission: "Our mission is to build progressive K-12 schools that provide technology-rich and immersive learning experiences facilitated by passionate educators, to prepare students for a rapidly evolving future.",
    habitsIntro: "We inculcate habits that are encouraged, modelled and nurtured by all educators. Lifelong habits of the head, heart and hand make our students globally competent and good human beings.",
    habitsHead: "Think creatively, Communicate effectively, Reason critically, Reflect and learn continuously",
    habitsHeart: "Respectful, empathetic and caring, Integrity in thought and action, Collaborate to achieve goals, Committed, passionate and keen to serve",
    habitsHand: "Using design thinking, Learn hands-on, Imbibe problem solving and decision making skills, Make, break and make again"
  });

  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_philosophy");
        if (result && result.value) {
          setData(prev => ({
            ...prev,
            ...result.value
          }));
        }
      } catch (error) {
        console.error("Failed to fetch philosophy content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw.includes("ELC") || raw.includes("PDI") || raw.includes("LEADER") || raw === "TESTER";
  };

  const parseList = (str: string) => str.split(",").map(s => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* HEADER SECTION */}
      <div 
        className="relative w-full h-80 flex flex-col items-center justify-center bg-gradient-to-r from-[#5D4037] to-[#8D6E63] overflow-hidden transition-all duration-700"
        style={data.heroImage ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {!data.heroImage && <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>}
        
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase mb-2">
            Philosophy
          </h1>
          <div className="mt-4 h-1.5 w-24 bg-[#D32F2F] mx-auto rounded-full"></div>
        </div>
        
        <Button 
          variant="ghost" 
          className="absolute top-6 left-6 text-white hover:bg-white/10 gap-2 z-10"
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
        settingKey="page_philosophy"
        initialData={data}
        onSave={setData}
        title="Philosophy Content"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroImage", label: "Hero Background Image", type: "image" },
          { key: "vision", label: "Vision Statement", type: "textarea" },
          { key: "mission", label: "Mission Statement", type: "textarea" },
          { key: "habitsIntro", label: "Habits Introduction", type: "textarea" },
          { key: "habitsHead", label: "Habits of the Head (comma separated)", type: "textarea" },
          { key: "habitsHeart", label: "Habits of the Heart (comma separated)", type: "textarea" },
          { key: "habitsHand", label: "Habits of the Hand (comma separated)", type: "textarea" },
        ]}
      />

      {/* VISION & MISSION SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center items-center relative h-[300px]">
            <div className="absolute w-64 h-64 rounded-full border-[12px] border-[#009688]/20 -translate-x-12"></div>
            <div className="absolute w-64 h-64 rounded-full border-[12px] border-[#D32F2F]/20 translate-x-12"></div>
            
            <div className="relative z-10 flex gap-8">
              <div className="w-24 h-24 rounded-full bg-[#009688] flex items-center justify-center shadow-lg transform -rotate-12">
                <Eye size={48} color="white" weight="duotone" />
              </div>
              <div className="w-24 h-24 rounded-full bg-[#D32F2F] flex items-center justify-center shadow-lg transform rotate-12">
                <RocketLaunch size={48} color="white" weight="duotone" />
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="text-[#009688] text-3xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <span className="w-8 h-1 bg-[#009688]"></span> VISION
              </h2>
              <p className="text-xl text-gray-700 font-medium leading-relaxed">
                "{data.vision}"
              </p>
            </div>

            <div>
              <h2 className="text-[#D32F2F] text-3xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <span className="w-8 h-1 bg-[#D32F2F]"></span> MISSION
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed italic">
                "{data.mission}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HABITS SECTION */}
      <div className="bg-[#D32F2F] py-20 rounded-3xl mx-6 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="text-[#FBC02D] text-5xl font-black uppercase tracking-tighter mb-8">
            Habits
          </h2>
          <p className="max-w-3xl mx-auto text-xl font-medium leading-relaxed opacity-90">
            "{data.habitsIntro}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* COLUMN 1: HEAD */}
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Brain size={32} className="text-[#D32F2F]" weight="fill" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-[#FBC02D]">Habits of the Head</h3>
              <ul className="text-left space-y-3 mb-6">
                {parseList(data.habitsHead).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                    <span className="font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 2: HEART */}
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart size={32} className="text-[#D32F2F]" weight="fill" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-[#FBC02D]">Habits of the Heart</h3>
              <ul className="text-left space-y-3 mb-6">
                {parseList(data.habitsHeart).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                    <span className="font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: HAND */}
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <HandWaving size={32} className="text-[#D32F2F]" weight="fill" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-[#FBC02D]">Habits of the Hand</h3>
              <ul className="text-left space-y-3 mb-6">
                {parseList(data.habitsHand).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                    <span className="font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosophyPage;
