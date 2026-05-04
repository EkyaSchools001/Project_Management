import React from "react";
import { motion } from "framer-motion";
import { getAssetUrl } from "@/lib/utils";

interface CampusMessageProps {
  image: string;
  content: string;
  author: string;
  designation: string;
}

export const CampusMessage = ({ image, content, author, designation }: CampusMessageProps) => {
  // Simple keyword highlighting logic for specific EKYA terms
  const highlightedContent = content.split('\n').map((line, i) => (
    <p key={i} className="mb-4 text-slate-600 leading-relaxed text-lg">
      {line}
    </p>
  ));

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src={getAssetUrl(image)} 
                alt={author}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-8 flex flex-col justify-center"
          >
            <div className="relative">
              <div className="relative z-10 pt-4">
                {highlightedContent}
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h4 className="text-2xl font-black text-[#1F2839] uppercase tracking-wider">{author}</h4>
              <p className="text-[#B69D74] font-medium uppercase tracking-[0.2em] text-sm mt-1">{designation}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
