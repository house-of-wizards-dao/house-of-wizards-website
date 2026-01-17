"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";

import { NewsForm } from "@/components/cms/NewsForm";
import { NewsItem } from "@/types/cms";

type NewsResponse = {
  news: NewsItem;
};

async function fetchNewsItem(id: string): Promise<NewsResponse> {
  const response = await fetch(`/api/cms/news/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch news item");
  }
  return response.json();
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EditNewsPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cms-news", id],
    queryFn: () => fetchNewsItem(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Spinner size="lg" color="secondary" />
        <p className="text-neutral-400">Loading post...</p>
      </div>
    );
  }

  if (error || !data?.news) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Failed to load post.</p>
        <button
          onClick={() => router.push("/cms")}
          className="text-brand-400 hover:text-brand-300"
        >
          Return to dashboard
        </button>
      </div>
    );
  }

  return <NewsForm initialData={data.news} isEdit />;
}
