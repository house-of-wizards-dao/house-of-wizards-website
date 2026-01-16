import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@nextui-org/card";
import { getSortedPostsData, type Post } from "@/lib/posts";
import { PageTitle } from "@/components/PageTitle";

export const metadata: Metadata = {
  title: "Blog",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function BlogIndexPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="flex flex-col items-center gap-4 max-w-8xl min-h-screen">
      <PageTitle title="Blog" />
      <Link
        href="/feed.xml"
        className="text-sm text-gray-400 hover:text-brand-500 transition-colors flex items-center gap-1"
        title="RSS Feed"
      >
        RSS Feed
      </Link>

      <div className="max-w-7xl flex flex-col gap-6 sm:p-0 p-4">
        {allPostsData.length === 0 ? (
          <p className="text-md text-center text-gray-400">
            No blog posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPostsData.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="p-6 hover:border-brand-500/60 hover:bg-content1/40 transition-colors cursor-pointer h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 font-atirose text-brand-500">
                    {post.title || "Untitled"}
                  </h2>
                  {post.formattedDate && (
                    <p className="text-sm text-gray-400 mb-4">
                      {post.formattedDate}
                    </p>
                  )}
                  <div className="mt-auto">
                    <span className="text-sm text-brand-500 hover:underline">
                      Read more →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
