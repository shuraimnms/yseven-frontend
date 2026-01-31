import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-body tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-md",
        link: "text-primary underline-offset-4 hover:underline",
        // Y7 Luxury Variants
        gold: "bg-gradient-to-r from-gold to-gold-light text-obsidian font-semibold hover:shadow-[0_0_30px_hsl(43_74%_49%/0.4)] hover:scale-[1.02] active:scale-[0.98] rounded-md",
        "gold-outline": "border-2 border-gold text-gold bg-transparent hover:bg-gold/10 hover:shadow-[0_0_20px_hsl(43_74%_49%/0.2)] rounded-md",
        "red-glow": "bg-deep-red text-cream font-semibold hover:bg-deep-red-light hover:shadow-[0_0_30px_hsl(0_72%_35%/0.4)] hover:scale-[1.02] active:scale-[0.98] rounded-md",
        luxury: "bg-charcoal border border-gold/30 text-cream hover:border-gold hover:shadow-[0_0_20px_hsl(43_74%_49%/0.15)] hover:bg-charcoal/80 rounded-md",
        hero: "bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_40px_hsl(43_74%_49%/0.5)] hover:scale-[1.03] active:scale-[0.98] rounded-none",
        "hero-outline": "border-2 border-cream/50 text-cream bg-transparent uppercase tracking-[0.2em] hover:border-cream hover:bg-cream/5 rounded-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
        hero: "h-14 px-12 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
