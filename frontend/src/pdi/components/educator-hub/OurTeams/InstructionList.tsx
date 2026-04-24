import React from "react";
import { motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import { InstructionLink } from "../../../types/schoolTeam";

interface InstructionListProps {
  instructions: InstructionLink[];
  accentColor?: string;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

export const InstructionList = ({ 
  instructions, 
  accentColor = "#E63946",
  title = "GENERAL INSTRUCTIONS",
  backgroundColor,
  textColor = "text-white",
  className = ""
}: InstructionListProps) => {
  const finalBg = backgroundColor || accentColor;
  const isDarkBg = finalBg !== "#FFFFFF" && finalBg !== "white";

  return (
    <section 
      className={`py-20 px-4 ${className}`}
      style={{ backgroundColor: finalBg }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-black uppercase tracking-[0.2em] ${isDarkBg ? 'text-white' : 'text-[#1F2839]'}`}>
            {title}
          </h2>
          <div className={`w-24 h-1 mx-auto mt-6 ${isDarkBg ? 'bg-white/30' : 'bg-current'}`} style={{ color: isDarkBg ? undefined : accentColor }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructions.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.url}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ x: 10 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`flex items-center justify-between p-6 rounded-xl transition-all group backdrop-blur-sm border
                ${isDarkBg 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'}`}
            >
              <span className={`font-bold uppercase tracking-widest text-sm ${isDarkBg ? 'text-white' : 'text-[#1F2839]'}`}>
                {item.title}
              </span>
              <CaretRight 
                weight="bold" 
                className={`w-5 h-5 transition-opacity ${isDarkBg ? 'text-white opacity-40 group-hover:opacity-100' : 'text-slate-400 group-hover:text-slate-600'}`} 
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
