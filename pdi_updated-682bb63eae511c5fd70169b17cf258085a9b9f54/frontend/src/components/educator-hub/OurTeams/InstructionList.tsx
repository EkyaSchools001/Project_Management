import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, PencilLine, Trash, UsersThree } from "@phosphor-icons/react";
import { InstructionLink } from "../../../types/schoolTeam";

interface InstructionListProps {
  instructions: InstructionLink[];
  accentColor?: string;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  id?: string;
  assignments?: Record<string, string>; // item id -> teacher names string (legacy)
  onAssign?: (id: string, title: string) => void;
  // New props for integrated management
  allAssignments?: any[]; 
  onEdit?: (id: string, title: string, assignment: any) => void;
  onDelete?: (uid: string) => void;
  integrated?: boolean;
}

export const InstructionList = ({ 
  instructions, 
  accentColor = "#E63946",
  title = "GENERAL INSTRUCTIONS",
  backgroundColor,
  className = "",
  id,
  assignments = {},
  onAssign,
  allAssignments = [],
  onEdit,
  onDelete,
  integrated = false
}: InstructionListProps) => {
  const isDarkBg = backgroundColor && backgroundColor !== "#FFFFFF" && backgroundColor !== "white" && backgroundColor !== "#FAF9F6";

  return (
    <section 
      id={id}
      className={`py-16 px-4 ${className}`}
      style={{ backgroundColor: backgroundColor || "transparent" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-[11px] font-black tracking-[0.4em] uppercase mb-3 ${isDarkBg ? 'text-white/60' : 'text-primary'}`}>
            {title}
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full shadow-[0_0_10px_rgba(230,57,70,0.3)]" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructions.map((item, index) => {
            const dutyAssignments = allAssignments.filter(a => a.dutyId === item.id);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-primary/10 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 group flex flex-col h-full relative overflow-hidden text-left"
              >
                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-500">
                  <UsersThree size={28} weight="duotone" className="text-primary/60 group-hover:text-primary transition-colors" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-black text-primary tracking-tight uppercase leading-tight group-hover:translate-x-1 transition-transform duration-300">
                      {item.title}
                    </h3>
                    {onAssign && !integrated && (
                      <button 
                        onClick={() => onAssign(item.id, item.title)}
                        className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                      >
                        <Plus size={18} weight="bold" />
                      </button>
                    )}
                  </div>

                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                    {item.description || "Operational guidelines and team responsibilities for this campus activity."}
                  </p>

                  {/* Current Roster Section */}
                    <div className="pt-8 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-[2px] flex-1 bg-slate-200" />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-700">Duty Roster</span>
                      <div className="h-[2px] flex-1 bg-slate-200" />
                    </div>

                    <div className="space-y-2.5">
                      <AnimatePresence mode="popLayout">
                        {integrated ? (
                          <>
                            {dutyAssignments.length > 0 ? (
                              dutyAssignments.map((a) => (
                                <motion.div 
                                  layout
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  key={a.uid} 
                                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 group/item hover:bg-white hover:border-primary/20 transition-all duration-300"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary font-black text-[11px] shadow-sm">
                                        {a.teacherName.charAt(0)}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[13px] font-bold text-slate-800 leading-none">{a.teacherName}</span>
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                          {a.day && (
                                            <span className="text-[8px] font-black text-primary/70 uppercase tracking-wider px-1.5 py-0.5 bg-primary/5 rounded">{a.day}</span>
                                          )}
                                          {(a.startDate || a.floor) && (
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
                                              {a.startDate || a.floor}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-all transform translate-x-1 group-hover/item:translate-x-0">
                                      {onEdit && (
                                        <button 
                                          onClick={() => onEdit(item.id, item.title, a)}
                                          className="p-1.5 rounded-md hover:bg-amber-50 text-amber-600 transition-colors"
                                        >
                                          <PencilLine size={16} weight="bold" />
                                        </button>
                                      )}
                                      {onDelete && (
                                        <button 
                                          onClick={() => onDelete(a.uid)}
                                          className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition-colors"
                                        >
                                          <Trash size={16} weight="bold" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-center py-10 px-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-100/50 shadow-inner">
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest italic opacity-80">No assignments active</p>
                              </div>
                            )}
                            
                            <button 
                              onClick={() => onAssign?.(item.id, item.title)}
                              className="w-full mt-4 py-4 rounded-xl border-2 border-dashed border-[#8B0000]/40 text-[#8B0000] font-black text-[10px] uppercase tracking-[0.2em] bg-[#8B0000]/[0.02] hover:bg-[#8B0000] hover:text-white hover:border-[#8B0000] transition-all duration-300 flex items-center justify-center gap-2.5 group/btn shadow-sm"
                            >
                              <Plus size={18} weight="bold" className="group-hover/btn:rotate-90 transition-transform duration-300" />
                              Assign Activity
                            </button>
                          </>

                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {assignments?.[item.id] ? (
                              assignments[item.id].split(', ').map((name, i) => (
                                <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-600 shadow-sm uppercase tracking-wider">
                                  {name}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Pending...</span>
                            )}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Aesthetic touch */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/[0.015] rounded-full blur-3xl group-hover:bg-primary/[0.04] transition-all duration-700" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
