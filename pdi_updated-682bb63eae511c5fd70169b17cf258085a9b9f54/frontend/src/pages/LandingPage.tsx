import { Link } from "react-router-dom";
import { GraduationCap, Users, Shield, ArrowRight, CheckCircle2, BarChart3, Calendar, Target, Award, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


const features = [
  {
    icon: BarChart3,
    title: "Observation Tracking",
    description: "Execute lesson observations with evidence-based feedback cycles. Track growth over multiple sessions with automated analytics.",
    color: "bg-blue-500",
    lightColor: "bg-blue-50 text-blue-600"
  },
  {
    icon: Target,
    title: "Goal Management",
    description: "Align individual teacher goals with school-wide priorities. SMART goal setting with progress tracking and milestones.",
    color: "bg-[#EA104A]",
    lightColor: "bg-red-50 text-[#EA104A]"
  },
  {
    icon: BookOpen,
    title: "Training Calendar",
    description: "Centralized hub for all Teacher Development. Register for sessions and manage your learning schedule effortlessly.",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50 text-emerald-600"
  },
  {
    icon: Award,
    title: "Growth Analytics",
    description: "Visualize teacher performance across domains. Data-driven insights to identify strengths and areas for future development.",
    color: "bg-amber-500",
    lightColor: "bg-amber-50 text-amber-600"
  },
];


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-red-50 selection:bg-primary/20">
      {/* Navigation Header */}
      <nav className="bg-red-50/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <img src="/EKYA.png" alt="Ekya Schools" className="h-[40px] sm:h-[60px] md:h-[75px] w-auto animate-scale-in" />
              <div className="flex flex-col py-0.5">
                <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-black leading-none uppercase">
                  EKYA <span className="text-[#EA104A]">TEACHER</span>
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-0.5">
                  Platform
                </span>
              </div>
            </div>
            <Button variant="default" className="bg-[#EA104A] hover:bg-[#EA104A]/90 text-white font-bold rounded-full px-6 shadow-lg shadow-red-500/20" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-red-50 pt-16 pb-24 md:pt-32 md:pb-48">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-secondary text-[10px] sm:text-xs font-black tracking-widest text-[#EA104A] mb-8 animate-fade-in">
              <Sparkles className="w-3 h-3" />
              Empowering Educators Worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-8 tracking-tighter leading-[0.9] animate-slide-up">
              Elevate Teaching.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA104A] to-red-400">Transform Learning.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up delay-150">
              A premium, data-driven platform designed to orchestrate observations,
              track professional growth, and empower teachers to reach their peak potential.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-black hover:bg-zinc-800 text-white font-bold rounded-full px-10 h-14 text-lg shadow-2xl transition-all hover:scale-105 active:scale-95"
                asChild
              >
                <Link to="/login">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-black/10 hover:bg-muted font-bold rounded-full px-10 h-14 text-lg transition-all"
                asChild
              >
                <a href="https://pdi.ekyaschools.com/" target="_blank" rel="noopener noreferrer">
                  Explore Ecosystem
                </a>
              </Button>
            </div>

            <div className="mt-8 animate-slide-up delay-500">
              <Link 
                to="/support" 
                className="inline-flex items-center gap-2 text-sm font-bold text-[#EA104A] hover:text-[#EA104A]/80 transition-all bg-red-50/50 px-5 py-2 rounded-full border border-red-100 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Raise Interaction
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Stat Decorations */}
        <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2 animate-float">
          <div className="p-4 bg-white shadow-2xl rounded-3xl border border-border/50 scale-75 rotate-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-2xl font-black">98%</p>
                <p className="text-[10px] font-bold text-muted-foreground capitalize">Goal Alignment</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute right-10 top-1/3 animate-float delay-500">
          <div className="p-4 bg-white shadow-2xl rounded-3xl border border-border/50 scale-90 -rotate-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                <Users size={24} />
              </div>
              <div>
                <p className="text-2xl font-black">2.5k+</p>
                <p className="text-[10px] font-bold text-muted-foreground">Active Teachers</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-zinc-50 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-20">
            <Badge variant="outline" className="mb-4 border-[#EA104A] text-[#EA104A] font-black tracking-widest px-4 py-1">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-black mb-6 tracking-tight">
              A comprehensive ecosystem for<br className="hidden md:block" /> professional excellence.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We've built every tool you need to manage teacher lifecycles,
              from induction to leadership development.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 bg-white border border-border/50 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500 shadow-lg",
                  feature.color,
                  "text-white"
                )}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-black mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm antialiased">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-black text-white py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <img src="/EKYA__1_-removebg-preview.png" alt="EKYA TEACHER PLATFORM" className="h-[80px] w-auto [filter:brightness(0)_saturate(100%)_invert(25%)_sepia(97%)_saturate(6054%)_hue-rotate(342deg)_brightness(92%)_contrast(92%)] opacity-90 drop-shadow-sm" />
                <div className="h-10 w-px bg-white/20 hidden sm:block" />
                <div className="flex flex-col text-center sm:text-left">
                  <span className="text-xl font-black tracking-tighter">EKYA <span className="text-[#EA104A]">Teacher</span></span>
                  <span className="text-[10px] font-bold text-white/40 tracking-widest capitalize"> Platform</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm font-bold text-white/60 mb-2">Designed for Educational Excellence</p>
              <p className="text-xs text-white/40 capitalize tracking-[0.2em]">
                © 2026 Teacher Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
