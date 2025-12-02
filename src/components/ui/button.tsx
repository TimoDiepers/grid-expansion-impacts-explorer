import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:ring-offset-1 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        gradient:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        destructive:
          "bg-red-900/50 text-red-100 border border-red-800 hover:bg-red-900/70",
        outline:
          "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100",
        secondary:
          "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800",
        ghost: 
          "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
        link: 
          "text-zinc-400 underline-offset-4 hover:underline hover:text-zinc-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded px-3 text-xs",
        lg: "h-10 rounded px-6 text-sm",
        icon: "h-9 w-9",
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
