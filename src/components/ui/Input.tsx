import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Unified Input Component following the design system
 * Provides consistent form input styling across the application
 */

const inputVariants = cva(
  // Base styles for all inputs
  "flex w-full rounded-lg border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-normal",
  {
    variants: {
      variant: {
        default:
          "border-neutral-700 text-white hover:border-neutral-600 focus:border-brand-500",
        filled:
          "border-transparent bg-neutral-800 text-white hover:bg-neutral-700",
        underlined:
          "border-0 border-b-2 border-neutral-700 rounded-none px-0 focus:border-brand-500",
        ghost:
          "border-transparent bg-transparent text-white hover:bg-neutral-800/50",
      },
      inputSize: {
        sm: "h-8 text-xs",
        default: "h-10",
        lg: "h-12 text-base",
      },
      state: {
        default: "",
        error: "border-error focus:ring-error",
        success: "border-success focus:ring-success",
        warning: "border-warning focus:ring-warning",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      state: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      state,
      type = "text",
      leftIcon,
      rightIcon,
      label,
      helperText,
      error,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const finalState = error ? "error" : state;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            id={inputId}
            className={cn(
              inputVariants({ variant, inputSize, state: finalState }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            ref={ref}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              "mt-1 text-xs",
              error ? "text-error" : "text-neutral-400",
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

// Textarea variant
const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-lg border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-normal",
  {
    variants: {
      variant: {
        default:
          "border-neutral-700 text-white hover:border-neutral-600 focus:border-brand-500",
        filled:
          "border-transparent bg-neutral-800 text-white hover:bg-neutral-700",
        underlined:
          "border-0 border-b-2 border-neutral-700 rounded-none px-0 focus:border-brand-500",
        ghost:
          "border-transparent bg-transparent text-white hover:bg-neutral-800/50",
      },
      state: {
        default: "",
        error: "border-error focus:ring-error",
        success: "border-success focus:ring-success",
        warning: "border-warning focus:ring-warning",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, variant, state, label, helperText, error, id, ...props },
    ref,
  ) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const finalState = error ? "error" : state;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-white mb-2"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          className={cn(
            textareaVariants({ variant, state: finalState, className }),
          )}
          ref={ref}
          {...props}
        />

        {(error || helperText) && (
          <p
            className={cn(
              "mt-1 text-xs",
              error ? "text-error" : "text-neutral-400",
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
Textarea.displayName = "Textarea";

export { Input, Textarea, inputVariants, textareaVariants };
