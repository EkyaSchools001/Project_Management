import React from "react";
import { motion } from "framer-motion";

interface CampusHeroProps {
  title: string;
  backgroundImage: string;
  accentColor?: string;
}

export const CampusHero = ({ title, backgroundImage, accentColor = "#E63946" }: CampusHeroProps) => {
  return (
    <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s]"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-[0.2em] mb-4 uppercase">
            {title}
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 mx-auto"
            style={{ backgroundColor: accentColor }}
          />
        </motion.div>
      </div>
    </div>
  );
};
