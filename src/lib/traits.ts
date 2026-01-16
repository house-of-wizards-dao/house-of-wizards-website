/**
 * Trait types and constants
 * This file is safe to import in both client and server components
 */

export const TRAITS = [
  "head",
  "body",
  "prop",
  "familiar",
  "rune",
  "background",
] as const;
export type TraitType = (typeof TRAITS)[number];
