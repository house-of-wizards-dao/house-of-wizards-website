import NextImage from "next/image";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Sparkles } from "lucide-react";

import { LoreWidget } from "@/app/(landing)/LoreWidget";
import { NewsCard } from "@/components/news/NewsCard";
import {
  fetchCultContentChronicle,
  CultContentDbItem,
} from "@/lib/server/cult-content";
import { getSortedPostsData, Post } from "@/lib/posts";

/**
 * Determines the card variant based on position
 * Creates a newspaper-like layout with varying card sizes
 */
const getCardVariant = (
  index: number,
): "highlight" | "large" | "medium" | "small" => {
  if (index === 0) return "highlight";
  if (index === 1 || index === 2) return "large";
  if (index >= 3 && index <= 5) return "medium";
  if ((index - 6) % 7 === 0) return "large";
  if (index % 3 === 0) return "medium";
  return "medium";
};

/**
 * Converts a blog post to CultContentDbItem format for display in NewsCard
 */
const convertPostToNewsItem = (
  post: Post,
  index: number,
): CultContentDbItem => {
  // Generate a unique negative ID to avoid collision with DB items
  const id = -(index + 1000);

  // Format the date to ISO format (posts use YYYY-MM-DD format)
  const date = post.date || new Date().toISOString().split("T")[0];

  return {
    id,
    text: `Read the full article: [${post.title}](/blog/${post.id})`,
    date,
    author: "@FRWCCouncil",
    highlight: false,
    title: post.title,
  };
};

const NewsGrid = ({ items }: { items: CultContentDbItem[] }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-neutral-500">
        <Sparkles className="w-12 h-12 mb-4 text-brand-500/30" />
        <p className="text-xl font-heading">No news yet</p>
        <p className="text-sm text-neutral-600 mt-2">
          Check back soon for updates from the community
        </p>
      </div>
    );
  }

  // Find the item marked as highlight, or fall back to first item
  const highlightItem = items.find((item) => item.highlight) || items[0];
  const regularItems = items.filter((item) => item.id !== highlightItem.id);

  return (
    <div className="space-y-4">
      {/* Top row: Highlight card + LoreWidget side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 items-stretch">
        <div className="lg:col-span-2">
          <NewsCard item={highlightItem} variant="highlight" />
        </div>
        <div className="lg:col-span-1">
          <LoreWidget />
        </div>
      </div>

      {/* Regular items in masonry columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 lg:gap-4">
        {regularItems.map((item, index) => (
          <div key={item.id} className="break-inside-avoid mb-3 lg:mb-4">
            <NewsCard item={item} variant={getCardVariant(index + 1)} />
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsSection = async () => {
  // Fetch news from the database
  const newsItems = await fetchCultContentChronicle(20);

  // Get blog posts and convert to news items
  const posts = getSortedPostsData();
  const blogItems = posts.map((post, index) =>
    convertPostToNewsItem(post, index),
  );

  // Merge and sort by date (newest first)
  const allItems = [...newsItems, ...blogItems].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return <NewsGrid items={allItems} />;
};

const NewsLoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Spinner size="lg" color="secondary" />
      <p className="text-neutral-400 text-sm animate-pulse">
        Loading the chronicle...
      </p>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="relative h-[280px] lg:h-[350px] overflow-hidden">
        <NextImage
          src="/img/merlin_last_supper.png"
          alt="House of Wizards Banner"
          fill
          priority={true}
          className="object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/20" />

        {/* Header text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-heading text-brand-400 drop-shadow-lg">
              Cult Content Chronicle
            </h1>
            <p className="text-neutral-300 text-sm lg:text-base mt-2 max-w-xl">
              Latest news about Forgotten Runes
            </p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main className="relative z-10 -mt-4">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* News grid section */}
          <section className="pb-16 pt-6">
            <Suspense fallback={<NewsLoadingFallback />}>
              <NewsSection />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}
