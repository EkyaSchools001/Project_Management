import React, { useState } from 'react';
import MoocModule from '@/components/mooc/MoocModule';

const MoocAdminPage = () => {
  const [hasRead, setHasRead] = useState(false);

  if (!hasRead) {
    return (
      <div className="flex flex-col w-full h-[calc(100vh-60px)] p-6 bg-gray-50 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">MOOC Handout & Instructions</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Please read the guidelines before proceeding to submit your MOOC evidence.</p>
          </div>
          <button 
            onClick={() => setHasRead(true)}
            className="bg-[#ea104a] hover:bg-[#be123c] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-rose-500/20 transition-all hover:scale-105 active:scale-95"
          >
            Enter MOOC Module →
          </button>
        </div>
        
        <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <iframe 
            src="/mooc-handout.pdf#toolbar=0" 
            className="w-full h-full border-none"
            title="MOOC Handout"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-slate-50 overflow-y-auto px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setHasRead(false)}
            className="text-sm text-slate-400 hover:text-primary font-bold transition-colors flex items-center gap-2"
          >
            ← View Instructions
          </button>
        </div>
        <MoocModule />
      </div>
    </div>
  );
};

export default MoocAdminPage;
