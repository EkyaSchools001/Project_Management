import React from "react";
import { motion } from "framer-motion";
import { Envelope, Phone } from "@phosphor-icons/react";
import { TeamMember } from "../../../types/schoolTeam";

interface LeadershipCardProps {
  member: TeamMember;
  accentColor?: string;
}

export const LeadershipCard = ({ member, accentColor = "#e53935" }: LeadershipCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="bg-white rounded-[8px] shadow-sm overflow-hidden flex flex-col p-6 border border-primary/20 transition-shadow duration-300"
    >
      {/* Profile Image */}
      <div className="aspect-[3/4] w-full mb-6 overflow-hidden rounded-[8px] bg-slate-50">
        <img 
          src={member.image} 
          alt={member.name}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h4 className="text-xl font-bold text-slate-900 leading-tight">
          {member.name}
        </h4>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-4">
          {member.role}
        </p>

        {/* Contact Links */}
        <div className="pt-4 space-y-3 border-t border-slate-100">
          <a 
            href={`mailto:${member.email}`}
            className="flex items-center gap-3 text-slate-600 transition-colors group"
            style={{ color: 'var(--hover-color, inherit)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            <Envelope className="w-5 h-5" />
            <span className="text-sm underline decoration-slate-300 transition-colors">
              {member.email}
            </span>
          </a>
          {member.phone && (
            <a 
              href={`tel:${member.phone}`}
              className="flex items-center gap-3 text-slate-600 transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.color = accentColor}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
            >
              <Phone className="w-5 h-5" />
              <span className="text-sm">
                {member.phone}
              </span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
