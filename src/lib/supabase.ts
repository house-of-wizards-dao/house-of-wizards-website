import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
  const supabaseServiceKey = process.env.SUPABASE_API_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_PROJECT_URL environment variable is not set");
  }

  if (!supabaseServiceKey) {
    throw new Error(
      "SUPABASE_API_KEY environment variable is not set",
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
