import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-zinc-700/30 bg-zinc-900/[0.82] hover:border-zinc-600/40 text-zinc-50 dark:border-zinc-700/30 dark:bg-zinc-900/[0.82] dark:hover:border-zinc-600/40 dark:text-zinc-50 light:border-zinc-200 light:bg-white/90 light:hover:border-zinc-300 light:text-zinc-900",
        glass: "border-white/10 bg-zinc-900/[0.82] text-zinc-50 dark:border-white/10 dark:bg-zinc-900/[0.82] dark:text-zinc-50 light:border-zinc-200 light:bg-white/80 light:text-zinc-900",
        gradient: "border-0 bg-gradient-to-br from-zinc-900/[0.82] to-zinc-950/[0.82] text-zinc-50 dark:from-zinc-900/[0.82] dark:to-zinc-950/[0.82] dark:text-zinc-50 light:from-zinc-100/90 light:to-white/90 light:text-zinc-900",
        accent: "border-blue-500/20 bg-blue-950/[0.82] text-zinc-50 dark:border-blue-500/20 dark:bg-blue-950/[0.82] dark:text-zinc-50 light:border-blue-200 light:bg-blue-50/90 light:text-blue-900",
        success: "border-emerald-500/20 bg-emerald-950/[0.82] text-zinc-50 dark:border-emerald-500/20 dark:bg-emerald-950/[0.82] dark:text-zinc-50 light:border-emerald-200 light:bg-emerald-50/90 light:text-emerald-900",
        warning: "border-amber-500/20 bg-amber-950/[0.82] text-zinc-50 dark:border-amber-500/20 dark:bg-amber-950/[0.82] dark:text-zinc-50 light:border-amber-200 light:bg-amber-50/90 light:text-amber-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-tight tracking-tight text-zinc-100 dark:text-zinc-100 light:text-zinc-900", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-zinc-400 dark:text-zinc-400 light:text-zinc-600", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 sm:p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 sm:p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
