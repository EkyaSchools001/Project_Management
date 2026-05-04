import React from "react";
import { CampusPageLayout } from "@/components/educator-hub/OurTeams/CampusPageLayout";
import { ekyaByrathiTeam } from "@/data/teams/ekya-byrathi";
import { 
  MapPin, Phone, Envelope, Certificate, Buildings, Clock, 
  Calendar, SwimmingPool, Highlighter, Palette, Tree, BookOpen, Users
} from "@phosphor-icons/react";

const EkyaByrathiInfoPage = () => {
  return (
    <CampusPageLayout 
      schoolName={ekyaByrathiTeam.schoolName}
      breadcrumbPath="/campuses/ekya-byrathi/info"
      accentColor={ekyaByrathiTeam.accentColor}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary font-black uppercase tracking-widest text-[10px]">
            <Buildings size={16} weight="bold" />
            Campus Information
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight uppercase">
            School <span className="text-primary italic">Details</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
            A dynamic learning environment fostering innovation, excellence, and a strong sense of community.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-primary/20 shadow-sm space-y-6 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
               <MapPin size={28} weight="duotone" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Location</h3>
              <p className="text-lg font-bold text-slate-800 leading-snug">
                Bengaluru, Karnataka
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-primary/20 shadow-sm space-y-6 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
               <Certificate size={28} weight="duotone" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Affiliation</h3>
              <p className="text-lg font-bold text-slate-800">
                Recognized Board Affiliated
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-primary/20 shadow-sm space-y-6 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
               <Phone size={28} weight="duotone" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Contact</h3>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   080 - 46809096
                </p>
                <p className="text-sm font-bold text-slate-500 hover:text-primary cursor-pointer transition-colors block">
                   info@ekyaschools.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <section id="facilities" className="space-y-12 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Infrastructure</h2>
              <h3 className="text-3xl font-black text-slate-900 uppercase">Facilities</h3>
            </div>
            <div className="h-[2px] flex-1 mx-12 bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Auditorium", desc: "Multi-purpose auditorium", icon: Highlighter, color: "blue" },
              { title: "Sports Center", desc: "Indoor & outdoor sports", icon: Users, color: "emerald" },
              { title: "Labs", desc: "Advanced science and computer labs", icon: Palette, color: "rose" },
              { title: "Library", desc: "Extensive physical and digital library", icon: BookOpen, color: "indigo" },
            ].map((f) => (
              <div key={f.title} className="bg-slate-50 rounded-3xl p-6 border border-primary/20 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors mb-4">
                   <f.icon size={24} weight="duotone" />
                </div>
                <h4 className="font-black text-slate-800 uppercase tracking-tight mb-2">{f.title}</h4>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="gallery" className="space-y-12 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Visual Journey</h2>
              <h3 className="text-3xl font-black text-slate-900 uppercase">Campus Gallery</h3>
            </div>
            <div className="h-[2px] flex-1 mx-12 bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden relative group shadow-2xl border-8 border-white">
                <img 
                  src={`/images/schools/byrathi-1.jpg`} 
                  alt="Campus Video Thumbnail"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(234,16,74,0.4)] group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                   </div>
                </div>
                <div className="absolute bottom-8 left-8 text-white">
                   <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Campus Tour</p>
                   <h4 className="text-xl font-black uppercase">Watch the Journey</h4>
                </div>
             </div>
          </div>
        </section>

        <section id="history" className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-white scroll-mt-24">
           <div className="absolute top-0 right-0 p-20 opacity-5">
              <Clock size={300} />
           </div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-primary font-black uppercase tracking-widest text-[10px]">
                    <Clock size={16} weight="bold" />
                    Journey & Legacy
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">
                    Our <span className="text-primary italic">History</span>
                 </h2>
                 <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    Our campus is built on the foundation of the CMR Group of Institutions' legacy, delivering a progressive, future-focused education.
                 </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-12 backdrop-blur-sm">
                 <div className="flex gap-6">
                    <div className="flex-none w-1 h-32 bg-primary rounded-full" />
                    <div className="space-y-4">
                       <h4 className="text-xl font-bold uppercase tracking-tight">Legacy</h4>
                       <p className="text-sm font-medium text-slate-400 leading-relaxed">
                          Bringing world-class pedagogy and a student-centric approach to education, cultivating the next generation of thinkers and leaders.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </CampusPageLayout>
  );
};

export default EkyaByrathiInfoPage;
