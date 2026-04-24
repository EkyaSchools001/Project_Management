import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@pdi/lib/utils";

const badgeVariants = cva(
  // Toddle uses rounded-full pill badges with subtle tinted backgrounds
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold " +
  "transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Indigo – primary brand
        default:
          "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        // Coral / accent
        accent:
          "border-transparent bg-accent/10 text-accent hover:bg-accent/20",
        // Soft secondary lavender
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/70",
        // Red destructive
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        // Success emerald
        success:
          "border-transparent bg-[hsl(var(--success)/0.12)] text-success hover:bg-[hsl(var(--success)/0.2)]",
        // Warning amber
        warning:
          "border-transparent bg-[hsl(var(--warning)/0.12)] text-warning hover:bg-[hsl(var(--warning)/0.2)]",
        // Info sky blue
        info:
          "border-transparent bg-[hsl(var(--info)/0.12)] text-info hover:bg-[hsl(var(--info)/0.2)]",
        // Ghost / outlined
        outline:
          "border-border text-muted-foreground bg-transparent hover:bg-muted/50",
        // Muted grey
        muted:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
