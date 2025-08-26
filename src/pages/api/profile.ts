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

  console.log(`📝 ${req.method} /api/profile - User ID: ${user.id}`);

  if (req.method === "GET") {
    // Get current user's profile (without aliases to avoid Supabase client bug)
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select(
        "id, name, email, bio, twitter_handle, discord_handle, website_url, avatar_url, created_at",
      )
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("❌ Profile fetch failed:", error);
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    // Map database fields to application fields
    const mappedData = {
      id: data.id,
      name: data.name,
      email: data.email,
      description: data.bio,
      twitter: data.twitter_handle,
      discord: data.discord_handle,
      website: data.website_url,
      avatar_url: data.avatar_url,
      created_at: data.created_at,
    };

    console.log("✅ Profile fetched and mapped successfully:", mappedData);

    sendSuccess(res, mappedData);
  } else if (req.method === "PUT") {
    console.log("🔍 PUT /api/profile request received", {
      userId: user.id,
      body: req.body,
    });

    // Validate and sanitize input data
    const validatedData = validateBody(profileUpdateSchema)(req);
    console.log("✅ Data validated successfully:", validatedData);

    // Map application fields to database fields for update (only include defined fields)
    const dbFields: Record<string, any> = {};
    if (validatedData.name !== undefined) dbFields.name = validatedData.name;
    if (validatedData.description !== undefined)
      dbFields.bio = validatedData.description;
    if (validatedData.twitter !== undefined)
      dbFields.twitter_handle = validatedData.twitter;
    if (validatedData.discord !== undefined)
      dbFields.discord_handle = validatedData.discord;
    if (validatedData.website !== undefined)
      dbFields.website_url = validatedData.website;
    if (validatedData.avatar_url !== undefined)
      dbFields.avatar_url = validatedData.avatar_url;

    console.log("📝 Database fields to update:", dbFields);

    // Update current user's profile
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(dbFields)
      .eq("id", user.id)
      .select(
        "id, name, email, bio, twitter_handle, discord_handle, website_url, avatar_url, created_at",
      )
      .single();

    console.log("🔍 Database update result:", { data, error });

    if (error) {
      console.error("❌ Database update failed:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    // Verify the update was successful
    if (!data) {
      console.error("❌ No data returned from update operation");
      throw new Error("Profile update failed: No data returned");
    }

    // Map database fields to application fields for consistent response
    const mappedData = {
      id: data.id,
      name: data.name,
      email: data.email,
      description: data.bio,
      twitter: data.twitter_handle,
      discord: data.discord_handle,
      website: data.website_url,
      avatar_url: data.avatar_url,
      created_at: data.created_at,
    };

    console.log("✅ Profile updated and mapped successfully:", mappedData);
    sendSuccess(res, mappedData, "Profile updated successfully");
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
