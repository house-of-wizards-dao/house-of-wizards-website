import NextLink from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type LinkProps = ComponentProps<typeof NextLink> & { isExternal?: boolean };

export const Link = ({
  isExternal = false,
  className,
  target,
  rel,
  ...props
}: LinkProps) => (
  <NextLink
    className={cn(
      "inline-flex items-center gap-1 text-brand-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400",
      className,
    )}
    target={isExternal ? "_blank" : target}
    rel={isExternal ? "noopener noreferrer" : rel}
    {...props}
  />
);
