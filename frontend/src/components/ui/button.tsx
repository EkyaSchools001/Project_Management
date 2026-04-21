import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base – Toddle uses rounded-xl, tall heights, smooth all-property transitions
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold " +
  "ring-offset-background transition-all duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "active:scale-[0.97] " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary – deep indigo with subtle lift on hover
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-card-hover",
        // Destructive / coral-red
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:-translate-y-0.5",
        // Outlined – Toddle-style clean border button
        outline:
          "border border-border bg-card text-foreground hover:bg-muted/50 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-card",
        // Soft secondary – lavender tint
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 hover:-translate-y-0.5",
        // Ghost – no background, minimal
        ghost:
          "hover:bg-muted text-muted-foreground hover:text-foreground",
        // Link style
        link:
          "text-primary underline-offset-4 hover:underline h-auto p-0",
        // Accent / coral
        accent:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-glow-coral",
        // Success green
        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success/90 hover:-translate-y-0.5",
        // Indigo gradient (hero actions)
        gradient:
          "gradient-indigo text-foreground shadow-fab hover:-translate-y-0.5 hover:shadow-glow-indigo",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-base font-bold",
        icon: "h-10 w-10 rounded-xl",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
