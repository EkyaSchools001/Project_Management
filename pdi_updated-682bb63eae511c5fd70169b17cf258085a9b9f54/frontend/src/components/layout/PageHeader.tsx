import { ReactNode } from "react";
import { CaretLeft } from "@phosphor-icons/react";
import { Button } from "../ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  icon?: ReactNode;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, actions, icon, onBack }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="w-fit h-auto p-0 -ml-1 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
        >
          <CaretLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" weight="bold" />
          <span className="text-xs font-semibold tracking-wide uppercase">Back</span>
        </Button>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {icon}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-sm md:text-base text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
