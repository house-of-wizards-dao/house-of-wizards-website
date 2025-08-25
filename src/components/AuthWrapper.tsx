// components/AuthWrapper.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/admin/login");

          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role !== "admin") {
          router.push("/admin/login?error=unauthorized");

          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        // Handle auth error silently in production
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};
