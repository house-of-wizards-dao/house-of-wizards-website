"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/cms";

type CMSUserResponse = {
  user: User | null;
  address: string;
};

async function fetchCMSUser(): Promise<CMSUserResponse> {
  const response = await fetch("/api/cms/users/me");
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Not authenticated");
    }
    throw new Error("Failed to fetch CMS user");
  }
  return response.json();
}

export function useCMSUser() {
  const { data: session, status: sessionStatus } = useSession();

  const {
    data,
    isLoading: isQueryLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cms-user", session?.address],
    queryFn: fetchCMSUser,
    enabled: sessionStatus === "authenticated" && !!session?.address,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  const isLoading = sessionStatus === "loading" || isQueryLoading;
  const isAuthenticated = sessionStatus === "authenticated";
  const user = data?.user ?? null;
  const hasCMSAccess = !!user;
  const isAdmin = user?.role === "admin";
  const isEditor = user?.role === "editor";

  return {
    user,
    address: data?.address ?? session?.address ?? null,
    isLoading,
    isAuthenticated,
    hasCMSAccess,
    isAdmin,
    isEditor,
    error,
    refetch,
  };
}
