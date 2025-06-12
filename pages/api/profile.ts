import { NextApiRequest, NextApiResponse } from "next";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAuth, AuthenticatedUser } from "@/lib/auth";
import { profileUpdateSchema } from "@/lib/validation-schemas";
import {
  createApiHandler,
  sendSuccess,
  validateBody,
} from "@/lib/api-middleware";

async function profileHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
) {
  const supabaseAdmin = getServiceSupabase();

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
      throw new Error("Failed to fetch profile");
    }

    sendSuccess(res, data);
  } else if (req.method === "PUT") {
    // Validate and sanitize input data
    const validatedData = validateBody(profileUpdateSchema)(req);

    // Update current user's profile
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(validatedData)
      .eq("id", user.id)
      .select(
        "id, name, email, description, twitter, discord, website, avatar_url, created_at",
      )
      .single();

    if (error) {
      throw new Error("Failed to update profile");
    }

    sendSuccess(res, data, "Profile updated successfully");
  }
}

// Create API handler with middleware
const handler = createApiHandler(requireAuth(profileHandler), {
  methods: ["GET", "PUT"],
  rateLimit: { maxRequests: 30, windowMs: 60000 }, // 30 requests per minute
  cors: true,
  validation: {
    body: profileUpdateSchema,
  },
});

export default handler;
