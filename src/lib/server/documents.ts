import { unstable_cache } from "next/cache";

import { tableNames } from "@/config/supabase";
import { logger } from "@/lib/logger";
import { getSupabaseClient } from "@/lib/supabase";
import type { DocumentItem } from "@/types/cms";

const CACHE_REVALIDATE_SECONDS = 300;

const fetchPublishedDocumentsFromDb = async (): Promise<DocumentItem[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableNames.DOCUMENTS)
    .select("*")
    .eq("status", "published")
    .is("parent_id", null)
    .order("category_order", { ascending: true })
    .order("category", { ascending: true })
    .order("date", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    logger.error("Error fetching documents", error);
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }

  return (data ?? []) as DocumentItem[];
};

const getCachedPublishedDocuments = unstable_cache(
  fetchPublishedDocumentsFromDb,
  ["published-documents"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["documents"],
  },
);

export const fetchPublishedDocuments = async (): Promise<DocumentItem[]> =>
  getCachedPublishedDocuments();

const fetchPublishedDocumentByIdFromDb = async (
  id: number,
): Promise<DocumentItem | null> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableNames.DOCUMENTS)
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    logger.error("Error fetching document", error);
    throw new Error(`Failed to fetch document: ${error.message}`);
  }

  return data as DocumentItem;
};

const getCachedPublishedDocumentById = unstable_cache(
  fetchPublishedDocumentByIdFromDb,
  ["published-document"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["documents"],
  },
);

export const fetchPublishedDocumentById = async (
  id: number,
): Promise<DocumentItem | null> => {
  const documents = await getCachedPublishedDocuments();
  return (
    documents.find((document) => document.id === id) ??
    getCachedPublishedDocumentById(id)
  );
};
