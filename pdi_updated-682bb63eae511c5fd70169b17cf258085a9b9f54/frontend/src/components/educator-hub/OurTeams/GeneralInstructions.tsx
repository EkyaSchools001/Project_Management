import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { InstructionLink, SchoolTheme } from "../../../types/schoolTeam";

interface GeneralInstructionsProps {
  instructions: InstructionLink[];
  theme?: SchoolTheme;
}

export const GeneralInstructions = ({ instructions, theme }: GeneralInstructionsProps) => {
  const bgColor = theme?.highlight || "#e53935";
  
  return (
    <div 
      className="py-24 text-white"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black tracking-widest uppercase">
            General Instructions
          </h2>
          <div className="mt-4 w-20 h-1 bg-white mx-auto rounded-full opacity-50"></div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
          {instructions.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.url}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ x: 10 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group flex items-center justify-between py-4 border-b border-white/20 hover:border-white transition-all duration-300"
            >
              <span className="text-lg font-medium tracking-wide group-hover:font-bold">
                {index + 1}. {item.title}
              </span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" weight="bold" />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};
