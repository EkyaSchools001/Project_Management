import React from "react";
import { motion } from "framer-motion";
import { LeadershipCard } from "./LeadershipCard";
import { TeamMember, SchoolTheme } from "../../../types/schoolTeam";

interface LeadershipGridProps {
  leaders: TeamMember[];
  coordinators: TeamMember[];
  welcomeMessage?: string;
  accentColor?: string;
  theme?: SchoolTheme;
}

export const LeadershipGrid = ({ leaders, coordinators, welcomeMessage, accentColor, theme }: LeadershipGridProps) => {
  const highlightColor = accentColor || "#e53935";
  const allMembers = [...leaders, ...coordinators];
  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Leadership Grid Content */}
        {welcomeMessage ? (
          <>
            {/* Top Row (Key Leaders + Quote) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-24">
              <div className="md:col-span-4 flex justify-center w-full">
                {leaders[0] && <LeadershipCard member={leaders[0]} accentColor={highlightColor} />}
              </div>

              <div className="md:col-span-4 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 italic text-slate-600 leading-relaxed text-lg"
                >
                  <span className="text-4xl font-serif pr-2" style={{ color: highlightColor }}>"</span>
                  {welcomeMessage}
                  <span className="text-4xl font-serif pl-2" style={{ color: highlightColor }}>"</span>
                </motion.div>
              </div>

              <div className="md:col-span-4 flex justify-center w-full">
                {leaders[1] && <LeadershipCard member={leaders[1]} accentColor={highlightColor} />}
              </div>
            </div>

            {/* Coordinators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {coordinators.map((coordinator, index) => (
                <motion.div
                  key={coordinator.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <LeadershipCard member={coordinator} accentColor={highlightColor} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* Standard Unified Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {allMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <LeadershipCard member={member} accentColor={highlightColor} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
