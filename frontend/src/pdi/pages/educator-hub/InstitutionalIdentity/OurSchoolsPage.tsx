import React from "react";
import { SchoolRow } from "@pdi/components/educator-hub/InstitutionalIdentity/SchoolRow";
import { SectionHeader } from "@pdi/components/educator-hub/InstitutionalIdentity/SectionHeader";
import { schools } from "@pdi/data/schools";
import { ArrowLeft, PencilSimple } from "@phosphor-icons/react";
import { Button } from "@pdi/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageEditorControls } from "@pdi/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@pdi/services/settingsService";
import { useAuth } from "@pdi/hooks/useAuth";

const OurSchoolsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = React.useState<any>({
    upcomingTitle: "Ekya Nava",
    upcomingDescription: "Extending our commitment to educational excellence, we are thrilled to announce our forthcoming campus. Designed with state-of-the-art infrastructure and a student-centric environment, this new addition will further our mission of nurturing the next generation of leaders.",
    upcomingImage: "",
    overrides: {} // Stores per-school image overrides
  });

  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_our_schools");
        if (result && result.value) {
          setData(prev => ({
            ...prev,
            ...result.value
          }));
        }
      } catch (error) {
        console.error("Failed to fetch our schools content:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw.includes("ELC") || raw.includes("PDI") || raw.includes("LEADER") || raw === "TESTER";
  };

  const existingSchools = schools.filter(s => s.category === "existing");
  const upcomingSchools = schools.filter(s => s.category === "upcoming");
  const defaultUpcomingImage = upcomingSchools[0]?.images[0];
  const activeUpcomingImage = data.upcomingImage || defaultUpcomingImage;

  // Generate editor fields dynamically for all existing schools
  const editorFields: any[] = [
    { key: "section_upcoming", label: "Upcoming Campus", type: "section" },
    { key: "upcomingTitle", label: "Upcoming Campus Title", type: "input" },
    { key: "upcomingDescription", label: "Upcoming Campus Description", type: "textarea" },
    { key: "upcomingImage", label: "Upcoming Campus Image", type: "image" },
    
    ...existingSchools.flatMap(school => [
      { key: `section_${school.id}`, label: `${school.name} Images`, type: "section" },
      { key: `overrides.${school.id}.image1`, label: "Left Image (Main)", type: "image" },
      { key: `overrides.${school.id}.image2`, label: "Right Image (Secondary)", type: "image" },
    ])
  ];

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Header Banner */}
      <div className="relative bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-6 left-6 hover:bg-slate-100 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft weight="bold" /> Back
          </Button>

          {canEdit() && (
            <Button 
              className="absolute top-6 right-6 bg-[#e53935] hover:bg-[#c62828] text-white gap-2 shadow-lg"
              onClick={() => setIsEditorOpen(true)}
            >
              <PencilSimple size={18} weight="bold" />
              Edit Content
            </Button>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative pb-8 mt-12"
          >
            <h1 className="text-5xl md:text-7xl font-light text-[#e53935] tracking-[0.2em] uppercase">
              Our Schools
            </h1>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[3px] bg-[#e53935]"></div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        
        <PageEditorControls 
          settingKey="page_our_schools"
          initialData={data}
          onSave={setData}
          title="Our Schools Content"
          isOpenExternal={isEditorOpen}
          onOpenChangeExternal={setIsEditorOpen}
          hideFloatingButton={true}
          fields={editorFields}
        />
        
        {/* Existing Schools Section */}
        <SectionHeader title="Existing Campuses" />
        <div className="space-y-0">
          {existingSchools.map((school, index) => {
            const schoolOverrides = data.overrides?.[school.id] || {};
            return (
              <SchoolRow 
                key={school.id}
                id={school.id}
                name={school.name}
                leftImage={schoolOverrides.image1 || school.images[0]}
                rightImage={schoolOverrides.image2 || school.images[1]}
                reverseLayout={index % 2 !== 0}
              />
            );
          })}
        </div>

        {/* Upcoming Section */}
        <div className="mt-20 pt-12 border-t border-slate-300">
          <SectionHeader title="Upcoming Campuses" />
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 mt-8 border border-slate-200">
            <div className="p-10 lg:p-16 flex flex-col justify-center space-y-6">
              <div>
                <span className="bg-[#e53935] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Coming Soon
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 uppercase">
                  {data.upcomingTitle}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                {data.upcomingDescription}
              </p>
              <div className="pt-4">
                <Button className="bg-[#e53935] hover:bg-[#c62828] text-white px-8 py-6 rounded-lg font-bold uppercase tracking-widest transition-all">
                  Get Updates
                </Button>
              </div>
            </div>
            
            <div className="relative h-96 lg:h-auto overflow-hidden">
              <motion.img 
                key={activeUpcomingImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={activeUpcomingImage} 
                alt="Upcoming Campus"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurSchoolsPage;
