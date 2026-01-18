"use client";

import { Card } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";
import { BookOpen, ExternalLink, Scroll } from "lucide-react";

import { getTokenName, useLore } from "@/hooks/useLore";

export const LoreWidget = () => {
  const { data: loreEntries, isLoading, error } = useLore();

  return (
    <div className="flex flex-col gap-4 w-full h-full border border-brand-500/30 rounded-xl p-6 bg-neutral-950/80 backdrop-blur-sm">
      {/* Title */}
      <h3 className="text-brand-500 font-atirose text-base text-center">
        Latest from the Book of Lore
      </h3>

      {isLoading && (
        <div className="flex items-center justify-center py-6 gap-2">
          <Spinner size="sm" color="secondary" />
          <p className="text-gray-400 text-xs animate-pulse">Loading lore...</p>
        </div>
      )}

      {error && (
        <Card className="p-4 w-full border border-error/30 bg-error/5">
          <div className="flex items-center gap-2">
            <Scroll className="w-4 h-4 text-error" />
            <p className="text-error text-xs">Failed to load lore</p>
          </div>
        </Card>
      )}

      {loreEntries && loreEntries.length > 0 && (
        <div className="w-full">
          <div className="flex flex-col gap-3">
            {loreEntries.map((entry) => {
              const characterName = getTokenName(entry.token);
              return (
                <Card
                  key={`${entry.tokenId}-${entry.index}`}
                  className="group relative overflow-hidden border border-brand-500/20 hover:border-brand-500/40 transition-all duration-300 bg-neutral-900/60"
                >
                  <div className="relative p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                        <p className="text-brand-500 font-atirose text-sm">
                          {characterName}
                        </p>
                        <span className="text-gray-600 text-xs">
                          Ch. {entry.index + 1}
                        </span>
                      </div>
                      <Link
                        href={`https://www.forgottenrunes.com/lore/wizards/${entry.tokenId}/${entry.index}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-brand-500 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Preview text */}
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {entry.previewText}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-4 text-center">
            <Link
              href="https://www.forgottenrunes.com/lore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-500 transition-colors"
            >
              <Scroll className="w-3 h-3" />
              View all lore
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      )}

      {loreEntries && loreEntries.length === 0 && (
        <Card className="p-4 w-full">
          <div className="flex items-center gap-2 justify-center">
            <Scroll className="w-4 h-4 text-gray-500" />
            <p className="text-gray-400 text-xs">No lore found</p>
          </div>
        </Card>
      )}
    </div>
  );
};
