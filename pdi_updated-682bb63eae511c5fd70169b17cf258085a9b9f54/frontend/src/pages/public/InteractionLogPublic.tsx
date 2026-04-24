import React from 'react';
import { SupportForm } from '@/components/educator-hub/interactions/SupportForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lifebuoy } from '@phosphor-icons/react';

export default function InteractionLogPublic() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 selection:bg-red-100">
      {/* School Branding / Header */}
      <div className="max-w-[700px] w-full mb-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-3xl shadow-sm border border-primary/20">
            <img 
            src="/EKYA.png" 
            alt="Ekya Schools" 
            className="h-12 w-auto object-contain"
            />
            <div className="h-8 w-px bg-slate-200" />
            <span className="text-xl font-black tracking-tighter text-black uppercase">
                EKYA <span className="text-[#EA104A]">SUPPORT</span>
            </span>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">How can we help you today?</h1>
        <p className="text-slate-500 text-lg max-w-lg">
          Provide your details and issue below, and our team will get back to you promptly.
        </p>
      </div>

      <Card className="max-w-[850px] w-full shadow-2xl border-none rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-slate-900 text-white p-8 sm:p-10 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-200 text-[10px] font-black tracking-widest uppercase mb-4 mb-4">
              <Lifebuoy weight="fill" size={14} className="text-red-400" />
              Official Support Portal
            </div>
            <CardTitle className="text-3xl font-black tracking-tight mb-2">Support Request Form</CardTitle>
            <CardDescription className="text-slate-400 text-base max-w-md">
              This form is to provide timely support to parents in case they are facing any issues. Complete all fields to ensure correct routing.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <SupportForm 
            onSuccess={() => {
              window.location.href = '/support/success';
            }}
          />
        </CardContent>
      </Card>

      <footer className="mt-12 text-center">
        <p className="text-sm font-bold text-slate-400 tracking-wide uppercase">
          &copy; {new Date().getFullYear()} Ekya Schools • CMR Group of Institutions
        </p>
        <p className="text-[10px] text-slate-300 mt-1">Designed for Educational Excellence</p>
      </footer>
    </div>
  );
}
