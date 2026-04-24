import React from "react";

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <div className="w-full py-12 text-center">
      <div className="inline-block relative">
        <h2 className="text-2xl md:text-3xl font-light text-[#e53935] tracking-widest uppercase">
          {title}
        </h2>
        <div className="mt-2 mx-auto w-24 h-[1px] bg-[#e53935]"></div>
      </div>
    </div>
  );
};
