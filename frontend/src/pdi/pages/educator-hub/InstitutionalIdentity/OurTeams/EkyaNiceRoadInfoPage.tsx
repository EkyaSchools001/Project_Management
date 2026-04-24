import React from "react";
import { CampusPageLayout } from "@pdi/components/educator-hub/OurTeams/CampusPageLayout";
import { ekyaNiceRoadTeam } from "@pdi/data/teams/ekya-nice-road";
import { 
  MapPin, 
  Phone, 
  Envelope, 
  Certificate, 
  Buildings, 
  Clock, 
  Calendar,
  SwimmingPool,
  Highlighter,
  Palette,
  Tree,
  BookOpen,
  Users
} from "@phosphor-icons/react";

const EkyaNiceRoadInfoPage = () => {
  return (
    <CampusPageLayout 
      schoolName={ekyaNiceRoadTeam.schoolName}
      breadcrumbPath="/campuses/ekya-nice-road/info"
      accentColor={ekyaNiceRoadTeam.accentColor}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-24">
        
        {/* Header Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-primary font-black uppercase tracking-widest text-[10px]">
            <Buildings size={16} weight="bold" />
            Campus Information
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight uppercase">
            School <span className="text-primary italic">Details</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
            A state-of-the-art learning environment overlooking the NICE Road, designed to nurture curiosity and excellence.
          </p>
        </section>

        {/* Essential Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-primary/20 shadow-sm space-y-6 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
               <MapPin size={28} weight="duotone" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Location</h3>
              <p className="text-lg font-bold text-slate-800 leading-snug">
                Begur-Koppa Road, Overlooking NICE Road,<br/>
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
                CBSE Affiliated<br/>
                Grade 1 to Grade 10
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

        {/* Infrastructure Highlights */}
        <section id="facilities" className="space-y-12 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">State-of-the-art Infrastructure</h2>
              <h3 className="text-3xl font-black text-slate-900 uppercase">World-Class Facilities</h3>
            </div>
            <div className="h-[2px] flex-1 mx-12 bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Auditorium", desc: "750-seater multi-purpose magnificent auditorium", icon: Highlighter, color: "blue" },
              { title: "Sports Center", desc: "Multi-game indoor sports center", icon: Users, color: "emerald" },
              { title: "Amphitheater", desc: "10,000 sq. ft. sprawling amphitheater", icon: Palette, color: "rose" },
              { title: "Swimming", desc: "Indoor temperature-controlled pool", icon: SwimmingPool, color: "indigo" },
              { title: "Arts Studio", desc: "Specialized visual arts and creative spaces", icon: Palette, color: "amber" },
              { title: "Maker Space", desc: "Digital library and innovation maker space", icon: Highlighter, color: "teal" },
              { title: "Sand Pit", desc: "Specialized zones for early years", icon: Tree, color: "orange" },
              { title: "Gardening", desc: "Open greens for botanical learning", icon: Tree, color: "lime" }
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

        {/* Campus Gallery Section */}
        <section id="gallery" className="space-y-12 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Visual Journey</h2>
              <h3 className="text-3xl font-black text-slate-900 uppercase">Campus Gallery</h3>
            </div>
            <div className="h-[2px] flex-1 mx-12 bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Main Campus Video Placeholder */}
             <div className="aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden relative group shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1541339907198-e08756ebafe1?q=80&w=2070&auto=format&fit=crop" 
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

             {/* Photo Grid Overlay */}
             <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[2rem] overflow-hidden h-full border-4 border-white shadow-lg">
                   <img src="/images/schools/nice-1.jpg" alt="Campus View 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="grid grid-rows-2 gap-4">
                   <div className="rounded-[2rem] overflow-hidden border-4 border-white shadow-lg">
                      <img src="/images/schools/nice-2.jpg" alt="Campus View 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                   </div>
                   <div className="rounded-[2rem] overflow-hidden border-4 border-white shadow-lg bg-primary/5 flex items-center justify-center p-4">
                      <div className="text-center">
                         <span className="block text-2xl font-black text-primary">15+</span>
                         <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">View More Photos</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* History Section */}
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
                    Since <span className="text-primary italic">2022</span>
                 </h2>
                 <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    Ekya NICE Road is the youngest jewel in the Ekya Schools crown, established in 2022 to bring world-class education to the Begur area. 
                    As part of the CMR Group of Institutions (legacy since 1990), we inherit a rich tradition of academic excellence combined with a modern, forward-thinking approach.
                 </p>
                 <div className="grid grid-cols-3 gap-8">
                    <div>
                       <span className="block text-3xl font-black text-primary">2022</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Established</span>
                    </div>
                    <div>
                       <span className="block text-3xl font-black text-white">CBSE</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Affiliation</span>
                    </div>
                    <div>
                       <span className="block text-3xl font-black text-white">10th</span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">K-10 Campus</span>
                    </div>
                 </div>
                 <div className="pt-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                          <Certificate size={20} weight="bold" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-white uppercase tracking-tight">Accreditation</p>
                          <p className="text-[10px] text-slate-400">Official CBSE School Affiliation</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-12 backdrop-blur-sm">
                 <div className="flex gap-6">
                    <div className="flex-none w-1 h-32 bg-primary rounded-full" />
                    <div className="space-y-4">
                       <h4 className="text-xl font-bold uppercase tracking-tight">The Youngest Campus</h4>
                       <p className="text-sm font-medium text-slate-400 leading-relaxed">
                          While most Ekya campuses are established, NICE Road was designed from the ground up to represent the "future of Ekya" — featuring the most integrated technology spaces and amphitheaters in our network.
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-6">
                    <div className="flex-none w-1 h-32 bg-slate-700 rounded-full" />
                    <div className="space-y-4">
                       <h4 className="text-xl font-bold uppercase tracking-tight">CMR Heritage</h4>
                       <p className="text-sm font-medium text-slate-400 leading-relaxed">
                          Our campus benefits from the 30+ years of institutional wisdom provided by the CMR Group, ensuring that while our building is new, our pedagogy is time-tested.
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

export default EkyaNiceRoadInfoPage;
