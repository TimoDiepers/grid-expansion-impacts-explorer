import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "border-zinc-700 bg-transparent text-zinc-300",
      secondary:
        "border-zinc-800 bg-transparent text-zinc-400",
      destructive:
        "border-red-900/50 bg-transparent text-red-400",
      outline: 
        "border-zinc-700 bg-transparent text-zinc-400",
      success:
        "border-emerald-900/50 bg-transparent text-emerald-400",
      warning:
        "border-amber-900/50 bg-transparent text-amber-400",
      info:
        "border-cyan-900/50 bg-transparent text-cyan-400",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium",
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
