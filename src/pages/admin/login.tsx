// pages/admin/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import DefaultLayout from "@/layouts/default";

const AdminLogin = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const {
        data: { session },
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (!session) {
        setError("Invalid credentials");

        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        setError("Unauthorized access");
        await supabase.auth.signOut();

        return;
      }

      router.push("/admin");
    } catch (err) {
      setError("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 border-1 border-[#9564b4] rounded-xl">
          <div>
            <h2 className="text-[#9564b4] text-center text-3xl font-serif italic">
              Admin Login
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="sr-only" htmlFor="email">
                  Email address
                </label>
                <input
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <input
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#9564b4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AdminLogin;
