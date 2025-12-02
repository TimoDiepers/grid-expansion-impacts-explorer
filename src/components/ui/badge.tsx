import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "border-transparent bg-blue-600/20 text-blue-400 border-blue-500/30 dark:bg-blue-600/20 dark:text-blue-400 light:bg-blue-100 light:text-blue-700 light:border-blue-200",
      secondary:
        "border-transparent bg-zinc-800 text-zinc-300 border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 light:bg-zinc-200 light:text-zinc-700 light:border-zinc-300",
      destructive:
        "border-transparent bg-red-600/20 text-red-400 border-red-500/30 dark:bg-red-600/20 dark:text-red-400 light:bg-red-100 light:text-red-700 light:border-red-200",
      outline: 
        "bg-transparent dark:border-zinc-700 dark:text-zinc-300 light:border-zinc-300 light:text-zinc-700",
      success:
        "border-transparent bg-emerald-600/20 text-emerald-400 border-emerald-500/30 dark:bg-emerald-600/20 dark:text-emerald-400 light:bg-emerald-100 light:text-emerald-700 light:border-emerald-200",
      warning:
        "border-transparent bg-amber-600/20 text-amber-400 border-amber-500/30 dark:bg-amber-600/20 dark:text-amber-400 light:bg-amber-100 light:text-amber-700 light:border-amber-200",
      info:
        "border-transparent bg-cyan-600/20 text-cyan-400 border-cyan-500/30 dark:bg-cyan-600/20 dark:text-cyan-400 light:bg-cyan-100 light:text-cyan-700 light:border-cyan-200",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
