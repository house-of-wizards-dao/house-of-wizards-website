import { createClient } from "@supabase/supabase-js";
import { env, isServerSide } from "./env";

// Client-side Supabase client
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

// Server-side Supabase client with service role key
export const getServiceSupabase = () => {
  if (!isServerSide()) {
    throw new Error("Service Supabase client can only be used server-side");
  }

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for server-side operations",
    );
  }

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
};
