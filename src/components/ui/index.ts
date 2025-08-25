/**
 * Design System Component Library Index
 *
 * This file exports all unified UI components following the design system.
 * Import components from here to ensure consistency across the application.
 *
 * Usage:
 * import { Button, Card, Input } from '@/components/ui'
 */

// Core UI Components
export { Button, buttonVariants } from "./Button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
} from "./Card";
export { Input, Textarea, inputVariants, textareaVariants } from "./Input";

// Existing components (refactored to use design system)
export { default as LoadingSpinner } from "./LoadingSpinner";
export { default as ErrorMessage } from "./ErrorMessage";

// Component types for TypeScript
export type { ButtonProps } from "./Button";
export type { CardProps } from "./Card";
export type { InputProps, TextareaProps } from "./Input";
