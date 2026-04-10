import { Link } from "react-router-dom";
import { MoveRight, Layers, Cpu, Terminal, Zap } from "lucide-react";
import { Button } from "@pdi/components/ui/button";
import { CustomCursor } from "../components/CustomCursor";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black selection:bg-[#00f0ff]/30 text-white overflow-hidden industrial-grid scanlines">
      <CustomCursor />
      
      {/* Neon Viewport Edge */}
      <div className="neon-frame" />

      {/* Floating Meta Labels */}
      <div className="fixed top-8 left-8 z-50 font-mono text-[10px] tracking-[0.4em] text-[#00f0ff] uppercase opacity-50 vertical-text hidden md:block">
        [ SYSTEM_V.2026 // EKYA_DEV ]
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-8">
        <div className="container mx-auto flex items-center justify-between border-b border-white/10 pb-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#00f0ff] rounded-sm" />
            <span className="font-mono text-xl font-bold tracking-tighter uppercase glitch" data-text="VEIDENCE">
              VEIDENCE
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest uppercase">
            <a href="#" className="hover:text-[#00f0ff] transition-colors">Framework</a>
            <a href="#" className="hover:text-[#00f0ff] transition-colors">Methodology</a>
            <a href="#" className="hover:text-[#00f0ff] transition-colors">Labs</a>
            <Button variant="outline" className="border-[#00f0ff] text-[#00f0ff] rounded-none hover:bg-[#00f0ff] hover:text-black transition-all group" asChild>
              <Link to="/login" className="flex items-center gap-2">
                IDENTITY_PORTAL
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - The Stage */}
      <section className="relative h-screen flex flex-col items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 opacity-20 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-mega text-hollow whitespace-nowrap opacity-10 select-none">
            ENGINEERING EXCELLENCE
          </div>
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="font-mono text-[#00f0ff] text-sm mb-6 flex items-center gap-2 uppercase tracking-[0.3em]">
              <Zap className="w-4 h-4 animate-pulse" /> [ START_SEQUENCE ]
            </div>
            
            <h1 className="text-mega mb-12">
              <span className="block">ELEVATE</span>
              <span className="block text-[#00f0ff]">TEACHING</span>
              <span className="block italic text-hollow">STANDARDS.</span>
            </h1>

            <div className="flex flex-col md:flex-row items-end justify-between gap-12">
              <p className="max-w-xl font-light text-xl text-white/60 leading-tight">
                An industrial-grade ecosystem designed to orchestrate observations,
                track professional growth, and empower educators with technical precision.
              </p>
              
              <div className="flex flex-col gap-4">
                 <Button 
                    size="lg" 
                    className="bg-white text-black font-black uppercase tracking-widest rounded-none h-16 px-12 hover:bg-[#00f0ff] transition-colors relative overflow-hidden group"
                    asChild
                  >
                    <Link to="/login">
                      Initialize Platform
                      <div className="absolute bottom-0 left-0 h-1 bg-[#00f0ff] w-0 group-hover:w-full transition-all duration-500" />
                    </Link>
                  </Button>
                  <span className="font-mono text-[10px] text-white/30 text-right">001 // SYSTEM_ENTRY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.5em] text-white/20 animate-bounce uppercase">
          SCROLL_FOR_INTEL
        </div>
      </section>

      {/* Capabilities Section - Grid Layout */}
      <section className="py-24 border-t border-white/5 relative bg-[#0a0a0a]">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="inline-block p-2 border border-[#00f0ff]/50 mb-8">
                <Layers className="text-[#00f0ff] w-6 h-6" />
              </div>
              <h2 className="text-6xl font-black uppercase mb-8 tracking-tighter">
                CAPABILITIES <br/>
                <span className="text-white/20">V.04</span>
              </h2>
              <div className="space-y-12">
                {[
                  { id: "01", title: "Observation Tracking", desc: "Execute lesson observations with evidence-based feedback cycles. Automated technical analytics." },
                  { id: "02", title: "Goal Management", desc: "Align individual priorities with school-wide logic. Progress tracking and milestones." },
                  { id: "03", title: "Training Index", desc: "Centralized hub for all technical development and scheduled learning modules." },
                ].map((item) => (
                  <div key={item.id} className="group relative pl-12 border-l border-white/10 hover:border-[#00f0ff] transition-colors">
                    <span className="absolute left-4 top-0 font-mono text-[10px] text-white/30">{item.id}</span>
                    <h3 className="text-2xl font-bold uppercase mb-2 group-hover:text-[#00f0ff] transition-colors">{item.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed max-w-md">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center p-12 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00f0ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Terminal className="w-32 h-32 text-white/10 group-hover:text-[#00f0ff]/20 transition-colors" />
                
                {/* Technical Overlay */}
                <div className="absolute top-4 right-4 font-mono text-[8px] text-white/20 leading-tight">
                  RENDER_DATA_STREAM<br/>
                  STATUS: OPERATIONAL<br/>
                  LATENCY: 12MS
                </div>
              </div>
              
              {/* Floating Stat Card */}
              <div className="absolute -bottom-12 -left-12 bg-black border border-white/10 p-8 w-64 animate-float">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-[#fff600] rounded-none flex items-center justify-center text-black">
                    <Cpu size={20} />
                  </div>
                  <span className="font-mono text-xs text-white/60">ANALYTICS engine</span>
                </div>
                <div className="text-4xl font-black text-[#fff600]">99.8%</div>
                <div className="font-mono text-[8px] tracking-widest text-white/30 mt-2 uppercase">Precision accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 font-mono text-[10px] tracking-widest text-white/20 uppercase">
        <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            © 2026 VEIDENCE // DIGITAL HANDLING OF EXCELLENCE
          </div>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Internal_Audit</a>
            <a href="#" className="hover:text-white transition-colors">System_Status</a>
            <a href="#" className="hover:text-white transition-colors">Privileged_Access</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

