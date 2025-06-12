import { NextApiRequest, NextApiResponse } from "next";

import { createClient } from "@supabase/supabase-js";
import { requireAuth, AuthenticatedUser } from "@/lib/auth";
import { checkRateLimit, validators } from "@/lib/sanitization";

// Server-side Supabase client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Sanitize and validate profile update data
function sanitizeProfileData(body: any): Record<string, any> {
  const sanitized: Record<string, any> = {};

  if (body.name !== undefined) {
    sanitized.name = validators.profileUpdate.name(body.name);
  }

  if (body.description !== undefined) {
    sanitized.description = validators.profileUpdate.description(
      body.description,
    );
  }

  if (body.twitter !== undefined) {
    sanitized.twitter = validators.profileUpdate.twitter(body.twitter);
  }

  if (body.discord !== undefined) {
    sanitized.discord = validators.profileUpdate.discord(body.discord);
  }

  if (body.website !== undefined) {
    sanitized.website = validators.profileUpdate.website(body.website);
  }

  return sanitized;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
) {
  try {
    // Rate limiting
    checkRateLimit(user.id, 30, 60000); // 30 requests per minute

    if (req.method === "GET") {
      // Get current user's profile
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select(
          "id, name, email, description, twitter, discord, website, avatar_url, created_at",
        )
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      res.status(200).json(data);
    } else if (req.method === "PUT") {
      // Sanitize input data
      const sanitizedData = sanitizeProfileData(req.body);

      // Update current user's profile
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .update(sanitizedData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      res.status(200).json(data);
    } else {
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "An error occurred",
    });
  }
}

// Apply middleware: authentication with built-in sanitization and rate limiting
export default requireAuth(handler);
