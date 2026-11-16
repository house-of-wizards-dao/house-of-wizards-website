import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Card = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "relative flex flex-col overflow-hidden rounded-xl bg-content1 text-foreground shadow-md",
      className,
    )}
    {...props}
  />
);
