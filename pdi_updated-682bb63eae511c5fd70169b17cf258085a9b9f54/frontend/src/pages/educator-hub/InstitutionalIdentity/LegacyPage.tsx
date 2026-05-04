import React from "react";
import { 
  CaretLeft, 
  Trophy, 
  UsersThree,
  ChalkboardTeacher,
  Lightbulb,
  BookOpen,
  PencilSimple
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PageEditorControls } from "@/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { PortalBanner } from "@/components/layout/PortalBanner";

const LegacyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = React.useState({
    heroImage: "",
    legacyTitle: "15 Learnings: The Journey of Building India's Most Innovative Schools",
    legacyContent1: "Discover how Ekya Schools grew through people, moments & choices. 15 Years on and the journey continues!",
    legacyContent2: "Spanning years of belief, bold choices, and thoughtful innovation, this book chronicles how Ekya Schools reshaped learning from its very foundations. Written by the founder of one of the world's most innovative school networks, it offers an intimate look into a journey that continues to shape the future of education.",
    subheading: "For Anyone Who Believes School Can Be Better",
    audience1Title: "PARENTS",
    audience1Desc: "If you're choosing a school for your child and want to understand what truly education looks like beyond brochures and buzzwords, this book gives you clarity, context, and confidence in your decision-making.",
    audience2Title: "Educators",
    audience2Desc: "If you're building, leading, or reimagining a school, this book offers real, lived lessons on what worked, what didn't, and how innovation can be sustained without losing purpose.",
    audience3Title: "Education Changemakers",
    audience3Desc: "If you believe schools must evolve for an unpredictable future, this book shows what's possible when vision, research, and execution come together at scale.",
    customSections: []
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
      <PortalBanner 
        title="Our Legacy"
        subtitle="15 Years of Excellence"
        onBack={() => navigate(-1)}
        onEdit={() => setIsEditorOpen(true)}
        canEdit={canEdit()}
        backgroundImage={data.heroImage}
        className="mt-6 mb-16"
      />

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
          { key: "legacyContent1", label: "Intro Paragraph 1", type: "textarea" },
          { key: "legacyContent2", label: "Intro Paragraph 2", type: "textarea" },
          { key: "subheading", label: "Subheading", type: "input" },
          { key: "audience1Title", label: "Audience 1 Title", type: "input" },
          { key: "audience1Desc", label: "Audience 1 Description", type: "textarea" },
          { key: "audience2Title", label: "Audience 2 Title", type: "input" },
          { key: "audience2Desc", label: "Audience 2 Description", type: "textarea" },
          { key: "audience3Title", label: "Audience 3 Title", type: "input" },
          { key: "audience3Desc", label: "Audience 3 Description", type: "textarea" },
          { key: "section_custom", label: "Custom Sections", type: "section" },
          { 
            key: "customSections", 
            label: "Add New Sections", 
            type: "list",
            itemFields: [
              { key: "title", label: "Section Title", type: "input" },
              { key: "image", label: "Section Image", type: "image" },
              { key: "content", label: "Section Content", type: "textarea" }
            ]
          }
        ]}
      />

      {/* CONTENT SECTIONS */}
      <div className="max-w-5xl mx-auto px-6 mt-12 relative z-20 space-y-12">
        {/* 15 YEAR LEGACY INTRO */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-primary/20 flex flex-col md:flex-row gap-12 items-start"
        >
          <div className="w-20 h-20 rounded-3xl bg-[#FEF2F2] flex items-center justify-center shrink-0 shadow-inner">
            <BookOpen size={48} className="text-[#E63946]" weight="duotone" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-black text-[#1F2839] mb-8 leading-tight tracking-tight">
              {data.legacyTitle}
            </h2>
            <div className="space-y-6">
              <p className="text-2xl text-slate-700 font-bold leading-relaxed">
                {data.legacyContent1}
              </p>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                {data.legacyContent2}
              </p>
            </div>
          </div>
        </motion.div>

        {/* AUDIENCE CARDS */}
        <div className="pt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-widest">{data.subheading}</h3>
            <div className="mt-4 h-1.5 w-24 bg-[#E63946] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8">
                <UsersThree size={32} className="text-blue-500" weight="duotone" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-4">{data.audience1Title}</h4>
              <p className="text-slate-600 leading-relaxed font-medium">{data.audience1Desc}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-8">
                <ChalkboardTeacher size={32} className="text-amber-500" weight="duotone" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-4">{data.audience2Title}</h4>
              <p className="text-slate-600 leading-relaxed font-medium">{data.audience2Desc}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8">
                <Lightbulb size={32} className="text-emerald-500" weight="duotone" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 mb-4">{data.audience3Title}</h4>
              <p className="text-slate-600 leading-relaxed font-medium">{data.audience3Desc}</p>
            </motion.div>
          </div>
        </div>

        {/* Custom Sections */}
        {data.customSections && data.customSections.map((section: any, idx: number) => (
          <motion.div 
            key={'custom-'+idx} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-black text-slate-800 uppercase tracking-widest">{section.title}</h3>
              <div className="mt-4 h-1.5 w-24 bg-[#E63946] mx-auto rounded-full"></div>
            </div>
            
            {section.image && (
              <div className="mb-12 rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl">
                <img src={section.image} alt={section.title || 'Custom Section Image'} className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            )}
            
            {section.content && (
              <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-primary/10 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-[#E63946]" />
                 <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                  {section.content}
                 </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* BOTTOM ACCENT */}
      <div className="mt-24 max-w-7xl mx-auto px-6 border-t border-slate-200 pt-12 text-center">
        <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-sm">Empowering educators since 2009</p>
      </div>
    </div>
  );
};

export default LegacyPage;
