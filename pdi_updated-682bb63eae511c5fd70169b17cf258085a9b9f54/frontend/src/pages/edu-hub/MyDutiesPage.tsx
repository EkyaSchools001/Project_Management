import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { settingsService } from "@/services/settingsService";
import { PageHeader } from "@/components/layout/PageHeader";
import { useNavigate } from "react-router-dom";
import { ekyaNiceRoadTeam } from "@/data/teams/ekya-nice-road";
import { ekyaItplTeam } from "@/data/teams/ekya-itpl";
import { ekyaJpNagarTeam } from "@/data/teams/ekya-jp-nagar";
import { ekyaBtmLayoutTeam } from "@/data/teams/ekya-btm-layout";
import { ekyaByrathiTeam } from "@/data/teams/ekya-byrathi";
import { cmrNpsTeam } from "@/data/teams/cmr-nps";
import { cmrpuHrbrTeam } from "@/data/teams/cmrpu-hrbr";
import { cmrpuItplTeam } from "@/data/teams/cmrpu-itpl";
import { cmrpuBtmTeam } from "@/data/teams/cmrpu-btm";

const campusTeamMap: Record<string, any> = {
  'ENICE': ekyaNiceRoadTeam,
  'EITPL': ekyaItplTeam,
  'EJPN': ekyaJpNagarTeam,
  'EBTM': ekyaBtmLayoutTeam,
  'EBYR': ekyaByrathiTeam,
  'CMR NPS': cmrNpsTeam,
  'PU HRBR': cmrpuHrbrTeam,
  'PU ITPL': cmrpuItplTeam,
  'PU BTM': cmrpuBtmTeam,
};
import { 
  ClipboardText, 
  Clock, 
  Calendar,
  ShieldCheck,
  WarningCircle
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface DutyAssignment {
  teacherId: string;
  teacherName: string;
  time?: string;
  startDate?: string;
  endDate?: string;
}

const MyDutiesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myDuties, setMyDuties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const SETTING_KEY = `duty_assignments_${user?.campusId?.toLowerCase() || 'enice'}`;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await settingsService.getSetting(SETTING_KEY);
        if (result && result.value) {
          const allAssignments: Record<string, DutyAssignment> = result.value;
          
          // Filter duties assigned to this user
          const filtered = Object.entries(allAssignments)
            .filter(([_, data]) => data.teacherId === user?.id)
            .map(([id, data]) => {
                // Find duty title from master data
                const campusTeam = campusTeamMap[user?.campusId || 'ENICE'] || ekyaNiceRoadTeam;
                const dutyInfo = campusTeam.instructions.find(i => i.id === id);
                return {
                    id,
                    title: dutyInfo?.title || id,
                    ...data
                };
            });
          
          setMyDuties(filtered);
        }
      } catch (error) {
        console.error("Failed to load assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        title="Duties Assigned"
        subtitle="Manage and track your assigned campus duties and schedules."
        icon={<ClipboardText className="w-8 h-8 text-primary" weight="duotone" />}
        onBack={() => navigate(-1)}
      />

      <div className="max-w-5xl mx-auto px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="mt-4 text-slate-400 font-medium tracking-widest text-xs uppercase">Loading assignments...</p>
          </div>
        ) : myDuties.length > 0 ? (
          <div className="grid gap-6">
            {myDuties.map((duty, index) => (
              <motion.div 
                key={duty.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-primary/20 relative overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <ShieldCheck size={120} weight="duotone" className="text-primary" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                      <span className="w-8 h-[1px] bg-primary/40"></span>
                      Duty Assignment
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight uppercase group-hover:text-primary transition-colors">
                      {duty.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {duty.time && (
                        <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-primary/20 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                            <Clock className="w-5 h-5 text-primary" weight="duotone" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Time Slot</span>
                                <span className="font-bold text-slate-700">{duty.time}</span>
                            </div>
                        </div>
                    )}
                    {(duty.startDate || duty.endDate) && (
                        <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-primary/20 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                            <Calendar className="w-5 h-5 text-primary" weight="duotone" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Duration</span>
                                <span className="font-bold text-slate-700">
                                    {duty.startDate || "?"} - {duty.endDate || "Ongoing"}
                                </span>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-primary/20">
             <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto mb-8 border border-primary/20 group">
                <WarningCircle size={48} weight="duotone" className="text-slate-300 group-hover:text-primary transition-colors" />
             </div>
             <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4 uppercase">No Duties Assigned</h3>
             <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed italic">
                You haven't been assigned any campus duties yet. Any assignments from leadership will appear here.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDutiesPage;
