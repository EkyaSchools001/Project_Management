import { cn } from "@pdi/lib/utils";
import { Calendar, User, Tag, MessageSquare, Eye, CheckCircle2, Zap, ArrowRight, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
    <div className={cn(
      "dashboard-card p-5 sm:p-8 group hover:border-primary/40 transition-all relative overflow-hidden",
      className
    )}>
      {/* Decorative background icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
        <Shield size={100} />
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className="w-fit bg-muted/50 text-[10px] font-bold capitalize tracking-wider">
            {observation.type || "Formal Observation"}
          </Badge>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-sm font-semibold text-foreground">
              {observation.date}
            </span>
          </div>
        </div>

        {observation.score !== undefined && (
          <div className="text-right">
            <p className="text-[10px] font-black capitalize text-zinc-950 tracking-widest mb-1">Score</p>
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-2xl font-black text-xl shadow-sm",
              observation.score >= 3.5 ? "bg-backgroundmerald-500 text-foreground" :
                observation.score >= 2.5 ? "bg-amber-500 text-foreground" : "bg-primary text-foreground"
            )}>
              {observation.score}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-sm font-black capitalize text-zinc-950 tracking-widest mb-2 flex items-center gap-2">
            <Shield className="w-3 h-3 text-primary" />
            Observer Details
          </h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-zinc-900">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {observation.observerName || "School Leader"}
              </p>
              <p className="text-xs text-zinc-700 font-medium">
                {observation.observerRole || "Campus Administrator"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black capitalize text-zinc-950 tracking-widest mb-2">Focus Area</h4>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
              {observation.domain}
            </Badge>
            {observation.subject && (
              <Badge variant="secondary" className="bg-backgroundackgroundlue-50 text-blue-700 hover:bg-backgroundackgroundlue-100 border-none">
                {observation.subject}
              </Badge>
            )}
            {(observation.type === "Quick Feedback" || observation.domain === "Quick Feedback") && (
              <Badge className="bg-indigo-600 text-foreground shadow-sm gap-1">
                <Zap className="w-3 h-3 fill-current" />
                Quick Feedback
              </Badge>
            )}
          </div>
        </div>

        {observation.notes && (
          <div>
            <h4 className="text-sm font-black capitalize text-zinc-950 tracking-widest mb-1">Initial Feedback</h4>
            <p className="text-sm text-zinc-800 font-medium line-clamp-2 italic leading-relaxed">
              "{observation.notes}"
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-5 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onView}
          className="text-primary hover:text-primary hover:bg-primary/5 font-bold gap-2 px-0"
        >
          <Eye className="w-4 h-4" />
          Full Report
          <ArrowRight className="w-3 h-3" />
        </Button>

        {observation.hasReflection ? (
          <Badge variant="secondary" className="bg-backgroundmerald-50 text-emerald-700 hover:bg-backgroundmerald-100 border-emerald-100 py-1.5 px-3 gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Reflection Submitted
          </Badge>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onReflect}
            className="gap-2 rounded-full font-bold shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Add Reflection
          </Button>
        )}
      </div>
    </div>
  );
}
