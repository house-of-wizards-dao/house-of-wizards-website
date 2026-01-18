"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/spinner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

import { useCMSUser } from "@/hooks/useCMSUser";
import { NewsItem } from "@/types/cms";

type NewsResponse = {
  news: NewsItem[];
};

async function fetchNews(): Promise<NewsResponse> {
  const response = await fetch("/api/cms/news");
  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }
  return response.json();
}

async function deleteNews(id: number): Promise<void> {
  const response = await fetch(`/api/cms/news/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete news");
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default function CMSDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin } = useCMSUser();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cms-news"],
    queryFn: fetchNews,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-news"] });
      setDeletingId(null);
    },
    onError: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this news item?")) {
      setDeletingId(id);
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Spinner size="lg" color="secondary" />
        <p className="text-neutral-400">Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load news. Please try again.</p>
      </div>
    );
  }

  const news = data?.news ?? [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading text-neutral-100">
            News Management
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            {isAdmin ? "All news items" : "Your news items"}
          </p>
        </div>
        <button
          onClick={() => router.push("/cms/news/new")}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* News List */}
      {news.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <p className="text-neutral-400">No news items yet.</p>
          <button
            onClick={() => router.push("/cms/news/new")}
            className="mt-4 text-brand-400 hover:text-brand-300 text-sm"
          >
            Create your first post
          </button>
        </div>
      ) : (
        <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">
                  Title / Content
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase hidden md:table-cell">
                  Author
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase hidden sm:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-neutral-800/50 last:border-0 hover:bg-neutral-800/30"
                >
                  <td className="px-4 py-3">
                    <div>
                      {item.title && (
                        <p className="font-medium text-neutral-100">
                          {item.title}
                        </p>
                      )}
                      <p className="text-sm text-neutral-400">
                        {truncateText(item.text, 80)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-300 hidden md:table-cell">
                    {item.author}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-400 hidden sm:table-cell">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                        item.status === "published"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {item.status === "published" ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {item.status}
                    </span>
                    {item.highlight && (
                      <span className="ml-1 inline-flex px-2 py-0.5 text-xs rounded-full bg-brand-500/20 text-brand-400">
                        highlight
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/cms/news/${item.id}/edit`)}
                        className="p-1.5 text-neutral-400 hover:text-brand-400 hover:bg-neutral-800 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === item.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
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
}
