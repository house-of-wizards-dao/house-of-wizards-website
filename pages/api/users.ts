import { NextApiRequest, NextApiResponse } from "next";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAdmin, AuthenticatedUser } from "@/lib/auth";
import { paginationSchema } from "@/lib/validation-schemas";
import {
  createApiHandler,
  sendSuccess,
  validateQuery,
} from "@/lib/api-middleware";

async function usersHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
) {
  const supabaseAdmin = getServiceSupabase();

  if (req.method === "GET") {
    // Validate query parameters
    const { page = 1, limit = 10, sortBy, sortOrder } =
      validateQuery(paginationSchema)(req);

    const offset = (page - 1) * limit;
    const orderColumn = sortBy || "created_at";

    // Get total count - use active_profiles view to exclude soft-deleted users
    const { count } = await supabaseAdmin
      .from("active_profiles")
      .select("*", { count: "exact", head: true });

    // Fetch paginated users
    const { data, error } = await supabaseAdmin
      .from("active_profiles")
      .select("id, name, email, role, created_at, avatar_url")
      .order(orderColumn, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error("Failed to fetch users");
    }

    const total = count || 0;
    const hasMore = offset + limit < total;

    sendSuccess(res, data || [], "Users fetched successfully", {
      page,
      limit,
      total,
      hasMore,
    });
  }
}

// Create API handler with middleware
const handler = createApiHandler(requireAdmin(usersHandler), {
  methods: ["GET"],
  rateLimit: { maxRequests: 20, windowMs: 60000 }, // 20 requests per minute
  cors: true,
  validation: {
    query: paginationSchema,
  },
});

export default handler;
