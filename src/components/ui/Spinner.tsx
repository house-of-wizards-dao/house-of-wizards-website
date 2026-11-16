import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SpinnerProps = ComponentProps<"span"> & {
  size?: "sm" | "md" | "lg";
  color?: string;
  label?: string;
};

export const Spinner = ({
  size = "md",
  color = "secondary",
  label = "Loading",
  className,
  ...props
}: SpinnerProps) => (
  <span
    role="status"
    aria-label={label}
    className={cn("inline-flex items-center justify-center", className)}
    {...props}
  >
    <span
      aria-hidden="true"
      className={cn(
        "rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin",
        {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg",
          "text-brand-400": color === "secondary",
          "text-current": color !== "secondary",
        },
      )}
    />
  </span>
);
