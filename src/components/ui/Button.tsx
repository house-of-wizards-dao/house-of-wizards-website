import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Unified Button Component following the design system
 * Replaces inconsistent button implementations across the app
 */

const buttonVariants = cva(
  // Base styles - consistent for all buttons
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary action buttons
        primary:
          "bg-brand-500 text-white hover:bg-brand-600 shadow-md hover:shadow-brand active:bg-brand-700",

        // Secondary action buttons
        secondary:
          "bg-transparent border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white",

        // Ghost/subtle buttons
        ghost: "hover:bg-brand-500/10 text-brand-500 hover:text-brand-600",

        // Destructive actions
        destructive: "bg-error text-white hover:bg-red-600 shadow-md",

        // Success actions
        success: "bg-success text-white hover:bg-green-600 shadow-md",

        // Outline variant
        outline:
          "border border-neutral-700 bg-transparent hover:bg-neutral-800 text-white",

        // Link style
        link: "text-brand-500 underline-offset-4 hover:underline p-0 h-auto",

        // Loading variant
        loading: "bg-brand-400 text-white cursor-not-allowed",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-8",
        xl: "h-12 px-10 text-base",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        none: "rounded-none",
        sm: "rounded-md",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      rounded: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  "aria-label"?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
