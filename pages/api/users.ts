import { NextApiRequest, NextApiResponse } from "next";

import { createClient } from "@supabase/supabase-js";
import { requireAdmin, AuthenticatedUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/sanitization";

// Server-side Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
) {
  if (req.method === "GET") {
    try {
      // Rate limiting
      checkRateLimit(user.id, 20, 60000); // 20 requests per minute
      // Admin-only endpoint to fetch all users
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id, name, email, role, created_at, avatar_url")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      res.status(200).json(data || []);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

// Export the handler wrapped with admin authentication
export default requireAdmin(handler);
