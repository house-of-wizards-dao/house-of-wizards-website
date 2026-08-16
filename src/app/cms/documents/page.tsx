"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/spinner";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCMSUser } from "@/hooks/useCMSUser";
import type { DocumentItem } from "@/types/cms";

type DocumentsResponse = { documents: DocumentItem[] };

const fetchDocuments = async (): Promise<DocumentsResponse> => {
  const response = await fetch("/api/cms/documents");
  if (!response.ok) throw new Error("Failed to fetch documents");
  return response.json();
};

const deleteDocument = async (id: number): Promise<void> => {
  const response = await fetch(`/api/cms/documents/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete document");
};

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

const DocumentsDashboard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin } = useCMSUser();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["cms-documents"],
    queryFn: fetchDocuments,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSettled: () => setDeletingId(null),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cms-documents"] }),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Spinner size="lg" color="secondary" />
        <p className="text-neutral-400">Loading documents...</p>
      </div>
    );
  }
  if (error) {
    return (
      <p className="py-12 text-center text-red-400">
        Failed to load documents.
      </p>
    );
  }

  const documents = data?.documents ?? [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl text-neutral-100">
            Documents Management
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            {isAdmin ? "All documents" : "Your documents"}
          </p>
        </div>
        <button
          onClick={() => router.push("/cms/documents/new")}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-500"
        >
          <Plus className="h-4 w-4" />
          New Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 py-12 text-center">
          <p className="text-neutral-400">No documents yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/50">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-xs uppercase text-neutral-500">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr
                  key={document.id}
                  className="border-b border-neutral-800/50 last:border-0 hover:bg-neutral-800/30"
                >
                  <td className="px-4 py-3 font-medium text-neutral-100">
                    {document.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-brand-400">
                    {document.category}
                  </td>
                  <td className="px-4 py-3 text-sm tabular-nums text-neutral-400">
                    {document.category_order}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-300">
                    {document.author}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-400">
                    {formatDate(document.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                        document.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {document.status === "published" ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      {document.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          router.push(`/cms/documents/${document.id}/edit`)
                        }
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-brand-400"
                        aria-label={`Edit ${document.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        disabled={deletingId === document.id}
                        onClick={() => {
                          if (confirm(`Delete “${document.title}”?`)) {
                            setDeletingId(document.id);
                            deleteMutation.mutate(document.id);
                          }
                        }}
                        className="rounded p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-red-400 disabled:opacity-50"
                        aria-label={`Delete ${document.title}`}
                      >
                        {deletingId === document.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentsDashboard;
