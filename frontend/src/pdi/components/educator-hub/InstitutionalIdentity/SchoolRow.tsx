import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SchoolRowProps {
  id: string;
  name: string;
  leftImage: string;
  rightImage?: string;
  reverseLayout?: boolean;
}

export const SchoolRow = ({ id, name, leftImage, rightImage, reverseLayout }: SchoolRowProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id === "cmr-nps") {
      navigate("/educator-hub/institutional-identity/our-teams/cmr-nps");
    } else if (id === "ekya-byrathi") {
      navigate("/campuses/ekya-byrathi");
    } else if (id === "ekya-btm") {
      navigate("/campuses/ekya-btm-layout");
    } else if (id === "ekya-itpl") {
      navigate("/campuses/ekya-itpl");
    } else if (id === "ekya-jpn") {
      navigate("/campuses/ekya-jp-nagar");
    } else if (id === "ekya-nice") {
      navigate("/campuses/ekya-nice-road");
    } else if (id === "cmrpu-hrbr") {
      navigate("/campuses/cmrpu-hrbr");
    } else if (id === "cmrpu-itpl") {
      navigate("/campuses/cmrpu-itpl");
    } else if (id === "cmrpu-btm") {
      navigate("/campuses/cmrpu-btm");
    }
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 py-12 bg-white"
    >
      {/* Left Image */}
      <div className={`col-span-12 md:col-span-5 ${reverseLayout ? 'md:order-3' : 'md:order-1'}`}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden rounded-3xl shadow-xl border border-primary/20"
        >
          <img 
            src={leftImage} 
            alt={`${name} view 1`}
            className="w-full h-72 md:h-[320px] object-cover"
          />
        </motion.div>
      </div>

      {/* Center Name */}
      <div className="col-span-12 md:col-span-2 text-center py-4 md:order-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="group cursor-pointer"
          onClick={handleClick}
        >
          <h3 className="text-[#e53935] font-black text-2xl tracking-widest uppercase inline-block relative px-4 py-2 border-b-2 border-transparent group-hover:border-[#e53935] transition-all duration-300">
            {name}
          </h3>
        </motion.button>
      </div>

      {/* Right Image */}
      <div className={`col-span-12 md:col-span-5 ${reverseLayout ? 'md:order-1' : 'md:order-3'}`}>
        {rightImage && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl shadow-xl border border-primary/20"
          >
            <img 
              src={rightImage} 
              alt={`${name} view 2`}
              className="w-full h-72 md:h-[320px] object-cover"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
