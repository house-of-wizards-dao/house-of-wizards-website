/**
 * CMS Authentication Helpers
 *
 * Provides utilities for checking user permissions in CMS routes.
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { User, NewsItem } from "@/types/cms";

export type CMSAuthResult = {
  user: User;
  address: string;
};

export type CMSAuthError = {
  error: string;
  status: 401 | 403;
};

/**
 * Gets the current session's Ethereum address
 */
export const getSessionAddress = async (): Promise<string | null> => {
  const session = await getServerSession(authOptions);
  return session?.address?.toLowerCase() ?? null;
};

/**
 * Gets the CMS user for the current session.
 * Returns null if not authenticated or not a CMS user.
 */
export const getCMSUser = async (): Promise<User | null> => {
  const address = await getSessionAddress();
  if (!address) return null;

  const supabase = getSupabaseClient();
  // Use ilike for case-insensitive matching (Ethereum addresses can be mixed case)
  const { data, error } = await supabase
    .from(tableNames.USERS)
    .select("*")
    .ilike("eth_address", address)
    .single();

  if (error || !data) return null;
  return data as User;
};

/**
 * Gets the CMS user by Ethereum address.
 * Uses case-insensitive matching since Ethereum addresses are case-insensitive.
 */
export const getCMSUserByAddress = async (
  address: string,
): Promise<User | null> => {
  const supabase = getSupabaseClient();
  // Use ilike for case-insensitive matching
  const { data, error } = await supabase
    .from(tableNames.USERS)
    .select("*")
    .ilike("eth_address", address)
    .single();

  if (error || !data) return null;
  return data as User;
};

/**
 * Requires the current user to be a CMS user (editor or admin).
 * Returns the user or an error response.
 */
export const requireCMSUser = async (): Promise<
  CMSAuthResult | CMSAuthError
> => {
  const address = await getSessionAddress();
  if (!address) {
    return { error: "Not authenticated", status: 401 };
  }

  const user = await getCMSUserByAddress(address);
  if (!user) {
    return { error: "No CMS access", status: 403 };
  }

  return { user, address };
};

/**
 * Requires the current user to be an admin.
 * Returns the user or an error response.
 */
export const requireAdmin = async (): Promise<CMSAuthResult | CMSAuthError> => {
  const result = await requireCMSUser();
  if ("error" in result) return result;

  if (result.user.role !== "admin") {
    return { error: "Admin access required", status: 403 };
  }

  return result;
};

/**
 * Checks if a user can edit a specific news item.
 * Admins can edit any item, editors can only edit their own.
 */
export const canEditNews = (user: User, newsItem: NewsItem): boolean => {
  if (user.role === "admin") return true;
  return newsItem.author_id === user.id;
};

/**
 * Checks if a user can delete a specific news item.
 * Same rules as editing.
 */
export const canDeleteNews = (user: User, newsItem: NewsItem): boolean => {
  return canEditNews(user, newsItem);
};

/**
 * Type guard to check if result is an error
 */
export const isAuthError = (
  result: CMSAuthResult | CMSAuthError,
): result is CMSAuthError => {
  return "error" in result;
};
