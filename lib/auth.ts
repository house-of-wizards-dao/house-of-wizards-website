import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

// Server-side Supabase client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: Record<string, any>;
}

/**
 * Middleware to authenticate API requests
 * Extracts and validates the Authorization header
 */
export async function authenticateRequest(
  req: NextApiRequest,
): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the JWT token
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    // Get user profile with role information
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email,
      role: profile?.role || "user",
      user_metadata: user.user_metadata,
    };
  } catch (error) {
    // Authentication error - handled gracefully
    return null;
  }
}

/**
 * Middleware to require authentication on API routes
 */
export function requireAuth(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    user: AuthenticatedUser,
  ) => Promise<void> | void,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await authenticateRequest(req);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    return handler(req, res, user);
  };
}

/**
 * Middleware to require admin role
 */
export function requireAdmin(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    user: AuthenticatedUser,
  ) => Promise<void> | void,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await authenticateRequest(req);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Admin access required",
      });
    }

    return handler(req, res, user);
  };
}

/**
 * Helper to get current session from client-side cookies (alternative method)
 */
export async function getSessionFromCookies(
  req: NextApiRequest,
): Promise<AuthenticatedUser | null> {
  try {
    // Extract session from cookies manually if needed
    const cookies = req.headers.cookie;
    if (!cookies) {
      return null;
    }

    // For now, we'll use the Bearer token method as it's more secure
    // This function can be extended if needed for cookie-based auth
    return await authenticateRequest(req);
  } catch (error) {
    // Session authentication error - handled gracefully
    return null;
  }
}
