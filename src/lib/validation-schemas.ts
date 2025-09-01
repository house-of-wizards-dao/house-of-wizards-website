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
  .regex(/^@?[a-zA-Z0-9._#-]+$/, "Invalid username format");

// Twitter-specific schema that removes @ and validates format
const twitterHandleSchema = z
  .string()
  .transform((val) => val.replace(/^@/, "")) // Remove leading @
  .transform((val) => (val.trim() === "" ? undefined : val)) // Convert empty string to undefined
  .refine((val) => val === undefined || /^[A-Za-z0-9_]{1,15}$/.test(val), {
    message:
      "Twitter handle must be 1-15 characters, letters, numbers, and underscores only",
  })
  .optional();
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
  twitter: twitterHandleSchema,
  discord: usernameSchema.optional(),
  website: urlSchema,
});

export const profileUpdateSchema = z
  .object({
    name: textSchema(100).optional(),
    description: textSchema(500).optional(),
    twitter: twitterHandleSchema,
    discord: usernameSchema.optional(),
    website: urlSchema.optional(),
    avatar_url: textSchema(255).optional(),
  })
  .refine(
    (data) =>
      Object.keys(data).some(
        (key) => data[key as keyof typeof data] !== undefined,
      ),
    {
      message: "At least one field must be provided for update",
    },
  );

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

// Auction validation schemas
const currencySchema = z.coerce
  .number()
  .min(0, "Amount must be positive")
  .max(10000000, "Amount too high")
  .refine((val) => Number.isFinite(val), "Invalid amount");

const bidAmountSchema = z.coerce
  .number()
  .min(1, "Bid amount must be at least $1")
  .max(10000000, "Amount too high")
  .refine((val) => Number.isFinite(val), "Invalid amount");

const startingBidSchema = z.coerce
  .number()
  .min(1, "Starting bid must be at least $1")
  .max(10000000, "Amount too high")
  .refine((val) => Number.isFinite(val), "Invalid amount");

const bidIncrementSchema = z.coerce
  .number()
  .min(1, "Bid increment must be at least $1")
  .max(10000000, "Amount too high")
  .refine((val) => Number.isFinite(val), "Invalid amount");

const dateTimeSchema = z
  .string()
  .datetime("Invalid datetime format")
  .refine((date) => new Date(date) > new Date(), {
    message: "Date must be in the future",
  });

// Artwork schemas
export const createArtworkSchema = z
  .object({
    title: textSchema(200),
    description: textSchema(2000),
    artist_id: uuidSchema,
    image_urls: z
      .array(z.string().url("Invalid image URL"))
      .min(1, "At least one image required")
      .max(10, "Too many images"),
    thumbnail_url: z.string().url("Invalid thumbnail URL"),
    medium: textSchema(100).optional(),
    dimensions: textSchema(100).optional(),
    year_created: z.coerce
      .number()
      .int()
      .min(1000, "Year too old")
      .max(new Date().getFullYear(), "Year cannot be in future")
      .optional(),
    edition_size: z.coerce.number().int().min(1).max(10000).optional(),
    edition_number: z.coerce.number().int().min(1).optional(),
    provenance: textSchema(1000).optional(),
    certificate_authenticity: z.boolean().optional(),
    estimated_value_min: currencySchema.optional(),
    estimated_value_max: currencySchema.optional(),
    reserve_price: currencySchema.optional(),
    metadata: z.record(z.any()).optional(),
  })
  .refine(
    (data) => {
      if (data.estimated_value_min && data.estimated_value_max) {
        return data.estimated_value_min <= data.estimated_value_max;
      }
      return true;
    },
    {
      message: "Minimum estimated value must be less than maximum",
      path: ["estimated_value_min"],
    },
  )
  .refine(
    (data) => {
      if (data.edition_number && data.edition_size) {
        return data.edition_number <= data.edition_size;
      }
      return true;
    },
    {
      message: "Edition number cannot exceed edition size",
      path: ["edition_number"],
    },
  );

export const updateArtworkSchema = z.object({
  title: textSchema(200).optional(),
  description: textSchema(2000).optional(),
  image_urls: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image required")
    .max(10, "Too many images")
    .optional(),
  thumbnail_url: z.string().url("Invalid thumbnail URL").optional(),
  medium: textSchema(100).optional(),
  dimensions: textSchema(100).optional(),
  year_created: z.coerce
    .number()
    .int()
    .min(1000, "Year too old")
    .max(new Date().getFullYear(), "Year cannot be in future")
    .optional(),
  edition_size: z.coerce.number().int().min(1).max(10000).optional(),
  edition_number: z.coerce.number().int().min(1).optional(),
  provenance: textSchema(1000).optional(),
  certificate_authenticity: z.boolean().optional(),
  estimated_value_min: currencySchema.optional(),
  estimated_value_max: currencySchema.optional(),
  reserve_price: currencySchema.optional(),
  metadata: z.record(z.any()).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

// Auction schemas
export const createAuctionSchema = z
  .object({
    artwork_id: uuidSchema,
    title: textSchema(200),
    description: textSchema(2000),
    starting_bid: startingBidSchema,
    reserve_price: currencySchema.optional(),
    bid_increment: bidIncrementSchema,
    start_time: z.string().datetime("Invalid start time format"),
    end_time: z.string().datetime("Invalid end time format"),
    featured: z.boolean().default(false),
    metadata: z.record(z.any()).optional(),
  })
  .refine(
    (data) => {
      const startTime = new Date(data.start_time);
      const endTime = new Date(data.end_time);
      return endTime > startTime;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    },
  )
  .refine(
    (data) => {
      const startTime = new Date(data.start_time);
      const minDuration = 1000 * 60 * 30; // 30 minutes
      const endTime = new Date(data.end_time);
      return endTime.getTime() - startTime.getTime() >= minDuration;
    },
    {
      message: "Auction must run for at least 30 minutes",
      path: ["end_time"],
    },
  )
  .refine(
    (data) => {
      if (data.reserve_price) {
        return data.reserve_price >= data.starting_bid;
      }
      return true;
    },
    {
      message: "Reserve price must be at least the starting bid",
      path: ["reserve_price"],
    },
  );

export const updateAuctionSchema = z.object({
  title: textSchema(200).optional(),
  description: textSchema(2000).optional(),
  starting_bid: startingBidSchema.optional(),
  reserve_price: currencySchema.optional(),
  bid_increment: bidIncrementSchema.optional(),
  start_time: z.string().datetime("Invalid start time format").optional(),
  end_time: z.string().datetime("Invalid end time format").optional(),
  featured: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
  status: z.enum(["draft", "active", "ended", "cancelled"]).optional(),
});

// Bid schemas
export const placeBidSchema = z
  .object({
    amount: bidAmountSchema,
    max_bid: currencySchema.optional(),
  })
  .refine(
    (data) => {
      if (data.max_bid) {
        return data.max_bid >= data.amount;
      }
      return true;
    },
    {
      message: "Maximum bid must be at least the current bid amount",
      path: ["max_bid"],
    },
  );

// Auction search and filter schemas
export const auctionFiltersSchema = z
  .object({
    status: z
      .array(z.enum(["draft", "active", "ended", "cancelled"]))
      .optional(),
    artist_id: uuidSchema.optional(),
    price_min: currencySchema.optional(),
    price_max: currencySchema.optional(),
    start_date: z.string().datetime().optional(),
    end_date: z.string().datetime().optional(),
    featured: z.boolean().optional(),
    has_reserve: z.boolean().optional(),
    category: textSchema(50).optional(),
  })
  .refine(
    (data) => {
      if (data.price_min && data.price_max) {
        return data.price_min <= data.price_max;
      }
      return true;
    },
    {
      message: "Minimum price must be less than maximum price",
      path: ["price_min"],
    },
  )
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.start_date) <= new Date(data.end_date);
      }
      return true;
    },
    {
      message: "Start date must be before end date",
      path: ["start_date"],
    },
  );

export const auctionSearchSchema = z
  .object({
    query: textSchema(200).optional(),
    filters: auctionFiltersSchema.optional(),
    sort_by: z
      .enum([
        "created_at",
        "start_time",
        "end_time",
        "current_bid",
        "total_bids",
      ])
      .optional(),
    sort_order: z.enum(["asc", "desc"]).default("desc"),
  })
  .merge(paginationSchema);

// Admin auction management schemas
export const auctionModerationSchema = z.object({
  auction_id: uuidSchema,
  action: z.enum([
    "approve",
    "reject",
    "feature",
    "unfeature",
    "cancel",
    "extend",
  ]),
  reason: textSchema(500).optional(),
  extend_minutes: z.coerce.number().int().min(1).max(1440).optional(), // Max 24 hours
});

export const bulkAuctionActionSchema = z.object({
  auction_ids: z
    .array(uuidSchema)
    .min(1, "At least one auction required")
    .max(50, "Too many auctions"),
  action: z.enum(["feature", "unfeature", "cancel", "approve", "reject"]),
  reason: textSchema(500).optional(),
});

// Rate limiting schemas
export const bidRateLimitSchema = z.object({
  auction_id: uuidSchema,
  user_id: uuidSchema,
  timestamp: z.number(),
  ip_address: z.string().ip().optional(),
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

// Auction types
export type CreateArtwork = z.infer<typeof createArtworkSchema>;
export type UpdateArtwork = z.infer<typeof updateArtworkSchema>;
export type CreateAuction = z.infer<typeof createAuctionSchema>;
export type UpdateAuction = z.infer<typeof updateAuctionSchema>;
export type PlaceBid = z.infer<typeof placeBidSchema>;
export type AuctionFilters = z.infer<typeof auctionFiltersSchema>;
export type AuctionSearch = z.infer<typeof auctionSearchSchema>;
export type AuctionModeration = z.infer<typeof auctionModerationSchema>;
export type BulkAuctionAction = z.infer<typeof bulkAuctionActionSchema>;
