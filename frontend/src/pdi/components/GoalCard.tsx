import { cn } from "@pdi/lib/utils";
import { Target, Calendar, User, ArrowRight, Flag } from "lucide-react";
import { Progress } from "./ui/progress";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    description?: string;
    actionStep?: string;
    pillar?: string;
    category?: string;
    progress: number;
    dueDate: string;
    assignedBy?: string;
    isSchoolAligned?: boolean;
    teacher?: string;
    reflectionCompleted?: boolean;
    selfReflectionForm?: string;
    goalSettingForm?: string;
    goalCompletionForm?: string;
    academics?: string;
    teacherEmail?: string;
  };
  onReflect?: () => void;
  className?: string;
}

export function GoalCard({ goal, onReflect, className }: GoalCardProps) {
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className={cn(
      "dashboard-card p-5 sm:p-8 relative group overflow-hidden border-l-4",
      goal.isSchoolAligned ? "border-l-primary" : "border-l-info",
      className
    )}>
      {/* Background Decor */}
      <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
        <Target size={120} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {goal.isSchoolAligned && (
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
            <Flag className="w-3 h-3 mr-1" />
            School Priority
          </Badge>
        )}
        {goal.reflectionCompleted && (
          <Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-none">
            Reflected
          </Badge>
        )}
        {(goal.pillar || goal.category) && (
          <Badge variant="outline" className="text-[10px] font-bold capitalize tracking-wider">
            {goal.pillar || goal.category}
          </Badge>
        )}
        {goal.academics && (
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] font-black capitalize tracking-wider",
              goal.academics === "CORE" ? "bg-violet-100 text-blue-700" : "bg-purple-100 text-purple-700"
            )}
          >
            {goal.academics === "NON_CORE" ? "Non-Core" : "Core"}
          </Badge>
        )}
      </div>

      <h3 className="text-lg font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
        {goal.title}
      </h3>

      {goal.description && (
        <div className="mb-5">
          <p className="text-sm text-zinc-800 font-medium line-clamp-3 leading-relaxed">
            {goal.description}
          </p>
        </div>
      )}

      {goal.actionStep && (
        <div className="mb-6 p-4 bg-muted/40 rounded-xl border border-muted/50 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/30" />
          <p className="text-[10px] font-black capitalize text-zinc-900 mb-1.5 tracking-widest">Next Action Step</p>
          <p className="text-sm italic text-foreground/80 leading-snug">{goal.actionStep}</p>
        </div>
      )}

      <div className="space-y-3 mb-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-900 capitalize tracking-widest">Progress</span>
            <p className="text-2xl font-black text-foreground">{goal.progress}%</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-zinc-900 capitalize tracking-widest block mb-1">Target Date</span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground bg-muted/50 px-2 py-1 rounded">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {formatDate(goal.dueDate)}
            </span>
          </div>
        </div>
        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          {goal.assignedBy && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {goal.assignedBy.charAt(0)}
              </div>
              <span className="font-bold text-zinc-900">Assigned by {goal.assignedBy}</span>
            </div>
          )}
        </div>

        {onReflect && (
          <Button
            onClick={(e) => { e.stopPropagation(); onReflect(); }}
            variant={goal.selfReflectionForm ? "outline" : "default"}
            size="sm"
            className={cn(
              "rounded-full px-5 font-bold shadow-sm transition-all hover:shadow-md active:scale-95",
              goal.selfReflectionForm && "border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800"
            )}
          >
            {goal.selfReflectionForm ? "View Reflection" : "Self Reflection"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
