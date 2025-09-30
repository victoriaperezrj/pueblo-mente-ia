import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-xl border-2 border-primary/30 hover:scale-[1.02]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-xl border-2 border-destructive/30 hover:scale-[1.02]",
        outline: "border-2 border-primary/40 bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-md hover:shadow-xl hover:scale-[1.02]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-xl border-2 border-secondary/30 hover:scale-[1.02]",
        ghost: "text-foreground hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        gradient: "gradient-primary text-white font-bold shadow-xl hover:shadow-2xl border-2 border-white/20 hover:scale-[1.05]",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-md hover:shadow-xl border-2 border-success/30 hover:scale-[1.02]",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-md hover:shadow-xl border-2 border-warning/30 hover:scale-[1.02]",
        info: "bg-info text-info-foreground hover:bg-info/90 shadow-md hover:shadow-xl border-2 border-info/30 hover:scale-[1.02]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
