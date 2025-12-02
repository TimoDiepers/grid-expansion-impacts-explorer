import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-zinc-950 light:focus-visible:ring-offset-white",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-[0.98]",
        gradient:
          "bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-[length:200%_auto] text-white shadow-lg hover:bg-right active:scale-[0.98] transition-all duration-400",
        destructive:
          "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-500 hover:shadow-red-500/40 active:scale-[0.98]",
        outline:
          "border bg-transparent dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-600 light:border-zinc-300 light:text-zinc-700 light:hover:bg-zinc-100 light:hover:border-zinc-400",
        secondary:
          "dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 light:bg-zinc-200 light:text-zinc-900 light:hover:bg-zinc-300 active:scale-[0.98]",
        ghost: 
          "dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100 light:text-zinc-600 light:hover:bg-zinc-100 light:hover:text-zinc-900",
        link: 
          "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300 light:text-blue-600 light:hover:text-blue-700",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
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
