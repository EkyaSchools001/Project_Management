import React from "react";
import { motion } from "framer-motion";

interface HeroBannerProps {
  title: string;
  backgroundImage: string;
  accentColor?: string;
  whiteHero?: boolean;
}

export const HeroBanner = ({ title, backgroundImage, accentColor = "#e53935", whiteHero = true }: HeroBannerProps) => {
  return (
    <div className="relative w-full h-[400px] overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className={`absolute inset-0 ${whiteHero ? 'bg-white/30' : 'bg-[#1F2839]/60'} backdrop-blur-[2px]`}></div>
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-4"
      >
        <h1 className={`text-4xl md:text-6xl font-bold tracking-tight uppercase ${whiteHero ? 'text-slate-900' : 'text-white'}`}>
          {title}
        </h1>
        <div 
          className="mt-4 w-32 h-1.5 mx-auto rounded-full"
          style={{ backgroundColor: accentColor }}
        ></div>
      </motion.div>
    </div>
  );
};
