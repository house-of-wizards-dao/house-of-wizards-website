import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import DefaultLayout from "@/layouts/default";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AdminPanel from "@/components/AdminPanel";
import PageErrorBoundary from "@/components/PageErrorBoundary";

const AdminPage = () => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user) {
        router.push("/admin/login");

        return;
      }

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          setIsAuthorized(true);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [user, router, supabase]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <LoadingSpinner fullScreen message="Checking authorization..." />
      </DefaultLayout>
    );
  }

  if (!isAuthorized) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-400">Redirecting to login...</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <PageErrorBoundary pageTitle="Admin Panel" showHomeButton={false}>
        <AdminPanel />
      </PageErrorBoundary>
    </DefaultLayout>
  );
};

export default AdminPage;
