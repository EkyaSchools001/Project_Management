import React from "react";
import { Button } from "@pdi/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PencilSimple } from "@phosphor-icons/react";
import { PageEditorControls } from "@pdi/components/educator-hub/InstitutionalIdentity/PageEditorControls";
import { settingsService } from "@pdi/services/settingsService";
import { useAuth } from "@pdi/hooks/useAuth";

const FoundersMessagePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = React.useState({
    name: "Dr. Tristha Ramamurthy",
    designation: "Vice President, CMR Group of Institutions | Founder, Ekya Schools",
    heroSubtitle: "Becoming Agents of Change",
    profileImage: "/images/founder.png",
    message: "Growing up, I witnessed my mother grow as an educator, starting from teaching a small batch of students in our family guava orchard to now leading an educational conglomerate. Therefore, instilled in me is a very deep respect and love for the teaching profession. It is this respect and love, coupled with a responsibility to empower children to make a positive difference in the world, that form the foundations on which Ekya Schools was established in 2011.\n\nI share this with you because I want to invite you to join me in honoring these foundational values by striving to build a community that will endure any uncertainty and survive the test of time. For me, this means encouraging a culture that nurtures authentic relationships with students, parents, and peers as we foster compassion, kindness and cultivate a growth mindset. We do not look at our work as merely transactional but meaningfully and intentionally collaborate with all, including our very own students, to create a positive and experiential learning environment.\n\nThis culture forms the soul of Ekya Schools, and as educators, you play an incredible role in preserving it. I sincerely hope you will collaborate with the School Leadership, ELC members, PDI members, and your peers in upholding our culture and encouraging our students to be thoughtful, compassionate, and eager to make a positive mark on the world.\n\nAs we welcome you back to campus for the academic year 2025-26, I encourage you to use the tools available on our Educator website. We are all here to support you and help you grow – we are dedicated to nurturing your talents and helping you reach your full potential as educators.\n\nHere’s to a year filled with joy, growth, and meaningful achievements!"
  });

  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await settingsService.getSetting("page_founders_message");
        if (result && result.value) {
          setData(prev => ({
            ...prev,
            ...result.value
          }));
        }
      } catch (error) {
        console.error("Failed to fetch founders message:", error);
      }
    };
    fetchData();
  }, []);

  const canEdit = () => {
    const raw = user?.role?.toUpperCase() || "";
    return raw.includes("ADMIN") || raw === "SUPERADMIN" || raw.includes("ELC") || raw.includes("PDI") || raw.includes("LEADER") || raw === "TESTER";
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* HEADER SECTION - Solid Red */}
      <div className="relative bg-[#D32F2F] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10 mb-4 items-center gap-2 self-start absolute top-6 left-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Identity
          </Button>

          {canEdit() && (
            <Button 
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white gap-2 border border-white/20 shadow-lg"
              onClick={() => setIsEditorOpen(true)}
            >
              <PencilSimple size={18} weight="bold" />
              Edit Content
            </Button>
          )}

          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
            FOUNDER’S MESSAGE
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-90">
            {data.heroSubtitle}
          </p>
        </div>
      </div>

      <PageEditorControls 
        settingKey="page_founders_message"
        initialData={data}
        onSave={setData}
        title="Founder's Message"
        isOpenExternal={isEditorOpen}
        onOpenChangeExternal={setIsEditorOpen}
        hideFloatingButton={true}
        fields={[
          { key: "heroSubtitle", label: "Hero Subtitle", type: "input" },
          { key: "profileImage", label: "Founder Profile Photo", type: "image" },
          { key: "name", label: "Founder Name", type: "input" },
          { key: "designation", label: "Designation (use | for separator)", type: "textarea" },
          { key: "message", label: "Full Message Body", type: "textarea" },
        ]}
      />

      {/* MAIN CONTENT SECTION */}
      <div className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-10 border border-slate-200">
          
          {/* LEFT COLUMN: Profile (40%) */}
          <div className="lg:col-span-4 bg-slate-50 p-8 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-slate-200">
            <div className="relative mt-8">
              <div className="w-56 h-72 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <img 
                  src={data.profileImage} 
                  alt={data.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="mt-8 space-y-1">
              <h2 className="text-2xl font-bold text-slate-800">
                {data.name}
              </h2>
              {data.designation.split("|").map((line, i) => (
                <p key={i} className={i === 0 ? "text-[#D32F2F] font-semibold text-sm uppercase tracking-wide" : "text-slate-500 text-sm"}>
                  {line.trim()}
                </p>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Message (60%) */}
          <div className="lg:col-span-6 p-10 lg:p-14 space-y-6 text-slate-700 leading-relaxed font-normal">
            <p className="text-lg font-semibold text-slate-900 italic mb-8">
              "Dear Educators,"
            </p>
            
            {data.message.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            <div className="pt-8 border-t border-slate-100 mt-12">
              <p className="text-slate-500 font-medium">Warmest Regards,</p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {data.name}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FoundersMessagePage;
