import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Toddle-style: tall (44px), rounded-xl, soft muted bg, smooth focus transition
          "flex h-11 w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5",
          "text-sm text-foreground font-normal",
          "placeholder:text-muted-foreground/60",
          // Subtle transition on focus
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:bg-card focus-visible:border-primary/50 focus-visible:shadow-focus-indigo",
          // States
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Hover
          "hover:border-border/80",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
