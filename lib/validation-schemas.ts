import { z } from "zod";

// Common validation patterns
const emailSchema = z
  .string()
  .email("Invalid email format")
  .max(254, "Email too long");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long");
const usernameSchema = z
  .string()
  .min(2, "Username too short")
  .max(50, "Username too long")
  .regex(/^[a-zA-Z0-9._#-]+$/, "Invalid username format");
const urlSchema = z
  .string()
  .url("Invalid URL format")
  .max(2048, "URL too long")
  .optional()
  .or(z.literal(""));
const textSchema = (maxLength: number) =>
  z
    .string()
    .max(maxLength, `Text too long (max ${maxLength} characters)`)
    .trim();
const uuidSchema = z.string().uuid("Invalid UUID format");

// File validation
export const fileUploadSchema = z.object({
  name: z.string().min(1, "File name required").max(255, "File name too long"),
  type: z.string().min(1, "File type required"),
  size: z.number().max(10 * 1024 * 1024, "File too large (max 10MB)"), // 10MB limit
});

// Profile validation schemas
export const profileCreateSchema = z.object({
  email: emailSchema,
  name: textSchema(100),
  password: passwordSchema,
  description: textSchema(500).optional(),
  twitter: usernameSchema.optional(),
  discord: usernameSchema.optional(),
  website: urlSchema,
});

export const profileUpdateSchema = z
  .object({
    name: textSchema(100).optional(),
    description: textSchema(500).optional(),
    twitter: usernameSchema.optional(),
    discord: usernameSchema.optional(),
    website: urlSchema.optional(),
    avatar_url: textSchema(255).optional(),
  })
  .refine((data) => Object.keys(data).some(key => data[key as keyof typeof data] !== undefined), {
    message: "At least one field must be provided for update",
  });

// Auth validation schemas
export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    name: textSchema(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password required"),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

// Content validation schemas
export const galleryItemSchema = z.object({
  title: textSchema(200),
  description: textSchema(1000).optional(),
  file_url: z.string().url("Invalid file URL"),
  file_type: z.enum(["image", "video", "audio", "document"]),
  tags: z.array(textSchema(50)).max(10, "Too many tags").optional(),
});

export const talentSchema = z.object({
  name: textSchema(100),
  bio: textSchema(500).optional(),
  skills: z
    .array(textSchema(50))
    .min(1, "At least one skill required")
    .max(20, "Too many skills"),
  portfolio_url: urlSchema,
  contact_email: emailSchema.optional(),
  avatar_url: textSchema(255).optional(),
  social_links: z
    .object({
      twitter: usernameSchema.optional(),
      discord: usernameSchema.optional(),
      website: urlSchema,
      github: usernameSchema.optional(),
    })
    .optional(),
});

// Admin validation schemas
export const userManagementSchema = z.object({
  userId: uuidSchema,
  action: z.enum(["update_role", "ban", "unban", "delete"]),
  role: z.enum(["user", "admin", "moderator"]).optional(),
  reason: textSchema(500).optional(),
});

export const contentModerationSchema = z.object({
  contentId: uuidSchema,
  action: z.enum(["approve", "reject", "flag", "delete"]),
  reason: textSchema(500).optional(),
});

// Search and pagination schemas
export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, "Page must be at least 1")
    .max(1000, "Page too high")
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit too high")
    .default(10),
  sortBy: z.string().max(50, "Sort field too long").optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const searchSchema = z
  .object({
    query: textSchema(200),
    filters: z.record(z.string().max(100)).optional(),
  })
  .merge(paginationSchema);

// Contact form schema
export const contactFormSchema = z.object({
  name: textSchema(100),
  email: emailSchema,
  subject: textSchema(200).optional(),
  message: textSchema(2000),
  honeypot: z.string().max(0, "Bot detected").optional(), // Anti-spam honeypot
});

// API key schema
export const apiKeySchema = z.object({
  name: textSchema(100),
  permissions: z
    .array(z.enum(["read", "write", "admin"]))
    .min(1, "At least one permission required"),
  expiresAt: z
    .date()
    .min(new Date(), "Expiration must be in the future")
    .optional(),
});

// Webhook schema
export const webhookSchema = z.object({
  url: z.string().url("Invalid webhook URL"),
  events: z.array(z.string().max(50)).min(1, "At least one event required"),
  secret: z
    .string()
    .min(16, "Webhook secret too short")
    .max(128, "Webhook secret too long")
    .optional(),
  active: z.boolean().default(true),
});

// Export types for use in components
export type ProfileCreate = z.infer<typeof profileCreateSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type Signup = z.infer<typeof signupSchema>;
export type Login = z.infer<typeof loginSchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;
export type Talent = z.infer<typeof talentSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Search = z.infer<typeof searchSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
