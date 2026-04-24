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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`grid grid-cols-1 md:grid-cols-12 items-center gap-0 py-1 bg-white`}
    >
      {/* Left Image */}
      <div className="col-span-12 md:col-span-5">
        <div className="relative overflow-hidden">
          <motion.img 
            src={leftImage} 
            alt={`${name} view 1`}
            className="w-full h-56 md:h-[400px] object-cover"
          />
        </div>
      </div>

      {/* Center Name */}
      <div className="col-span-12 md:col-span-2 text-center py-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group cursor-pointer"
          onClick={handleClick}
        >
          <h3 className="text-[#e53935] font-medium text-2xl md:text-2xl tracking-widest uppercase inline-block relative border-b-2 border-[#e53935] pb-1 transition-colors group-hover:text-[#c62828] group-hover:border-[#c62828]">
            {name}
          </h3>
        </motion.button>
      </div>

      {/* Right Image */}
      <div className="col-span-12 md:col-span-5">
        {rightImage && (
          <div className="relative overflow-hidden">
            <motion.img 
              src={rightImage} 
              alt={`${name} view 2`}
              className="w-full h-56 md:h-[400px] object-cover"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};
