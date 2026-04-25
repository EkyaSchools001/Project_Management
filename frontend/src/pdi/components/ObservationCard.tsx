import * as React from 'react';
import { cn } from "@pdi/lib/utils";
import { Calendar, User, Tag, MessageSquare, Eye, CheckCircle2, Zap, ArrowRight, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

interface ObservationCardProps {
  observation: {
    id: string;
    date: string;
    observerName?: string;
    observerRole?: string;
    domain: string;
    score?: number;
    notes?: string;
    hasReflection?: boolean;
    reflection?: string;
    type?: string;
    subject?: string;
    period?: string;
  };
  onReflect?: () => void;
  onView?: () => void;
  className?: string;
}

export function ObservationCard({ observation, onReflect, onView, className }: ObservationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "bg-card border border-border rounded-[2rem] p-8 group hover:border-primary/30 transition-all relative overflow-hidden shadow-sm hover:shadow-xl",
        className
      )}
    >
      {/* Decorative background icon */}
      <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 pointer-events-none group-hover:scale-110 group-hover:rotate-12">
        <Shield size={160} className="text-primary" />
      </div>

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                <Shield size={14} className="text-primary" />
            </div>
            <Badge variant="outline" className="bg-muted text-[10px] font-black uppercase tracking-widest py-1 border-border">
                {observation.type || "Formal Observation"}
            </Badge>
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-[11px] font-black uppercase tracking-widest text-foreground/80">
              {observation.date}
            </span>
          </div>
        </div>

        {observation.score !== undefined && (
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Academic Index</p>
            <div className={cn(
              "flex items-center justify-center w-14 h-14 rounded-2xl font-black text-2xl shadow-lg transition-transform group-hover:scale-110",
              observation.score >= 3.5 ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                observation.score >= 2.5 ? "bg-amber-500 text-white shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
            )}>
              {observation.score}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-4 flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Observer Profile
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary shadow-inner border border-border/50 group-hover:bg-primary/5 transition-colors">
              <User size={24} className="group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-sm font-black text-foreground uppercase tracking-tight">
                {observation.observerName || "School Leader"}
              </p>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                {observation.observerRole || "Campus Administrator"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-4 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            Focus Taxonomy
          </h4>
          <div className="flex flex-wrap gap-2.5">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all">
              {observation.domain}
            </Badge>
            {observation.subject && (
              <Badge variant="secondary" className="bg-muted text-muted-foreground border-border px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl">
                {observation.subject}
              </Badge>
            )}
            {(observation.type === "Quick Feedback" || observation.domain === "Quick Feedback") && (
              <Badge className="bg-primary text-white shadow-lg shadow-primary/20 gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Impact Note
              </Badge>
            )}
          </div>
        </div>
      </div>

      {observation.notes && (
        <div className="mb-10 relative z-10 p-6 rounded-3xl bg-muted/30 border border-border/50 italic">
          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-3">Field Insights</h4>
          <p className="text-sm text-foreground font-bold leading-relaxed line-clamp-3">
            "{observation.notes}"
          </p>
        </div>
      )}

      <div className="mt-auto pt-8 border-t border-border flex flex-wrap items-center justify-between gap-6 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onView}
          className="text-primary hover:text-primary hover:bg-primary/5 text-[10px] font-black uppercase tracking-widest gap-3 px-6 h-12 rounded-2xl transition-all border border-transparent hover:border-primary/20"
        >
          <Eye className="w-4 h-4" />
          Review Matrix
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {observation.hasReflection ? (
          <Badge variant="secondary" className="bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 py-3 px-6 gap-2.5 rounded-2xl border-none text-[10px] font-black uppercase tracking-widest transition-all">
            <CheckCircle2 className="w-4 h-4" />
            Growth Loop Closed
          </Badge>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onReflect}
            className="gap-3 rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            Submit Reflection
          </Button>
        )}
      </div>
    </motion.div>
  );
}
