"use client";

import { useMemo, useState, useEffect } from "react";
import type { WarriorGraphQLResponse } from "@/lib/frwc-graphql";

interface ForgedWithFilterProps {
  warriors: WarriorGraphQLResponse[];
  onFilterChange: (filtered: WarriorGraphQLResponse[]) => void;
}

export function ForgedWithFilter({ warriors, onFilterChange }: ForgedWithFilterProps) {
  const [selectedForgedWith, setSelectedForgedWith] = useState<string>("all");

  // Get unique items that weapons were forged with
  const forgedWithItems = useMemo(() => {
    const items = new Set<string>();
    warriors.forEach((warrior) => {
      if (warrior.forgedWith) {
        items.add(warrior.forgedWith);
      }
    });
    return Array.from(items).sort();
  }, [warriors]);

  // Filter warriors based on what their weapon was forged with
  const filteredWarriors = useMemo(() => {
    if (selectedForgedWith === "all") {
      return warriors;
    }
    return warriors.filter((warrior) => warrior.forgedWith === selectedForgedWith);
  }, [warriors, selectedForgedWith]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filteredWarriors);
  }, [filteredWarriors, onFilterChange]);

  const handleForgedWithChange = (forgedWith: string) => {
    setSelectedForgedWith(forgedWith);
  };

  return (
    <div className="flex flex-col gap-4 md:sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-b border-neutral-800 mb-4 w-full">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 px-2">
        <label htmlFor="forged-with-filter" className="text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">
          Filter by Forged With:
        </label>
        <select
          id="forged-with-filter"
          value={selectedForgedWith}
          onChange={(e) => handleForgedWithChange(e.target.value)}
          className="w-full sm:w-auto min-w-0 px-3 sm:px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        >
          <option value="all">All ({warriors.length})</option>
          {forgedWithItems.map((item) => {
            const count = warriors.filter((w) => w.forgedWith === item).length;
            return (
              <option key={item} value={item}>
                {item} ({count})
              </option>
            );
          })}
        </select>
      </div>
      {selectedForgedWith !== "all" && (
        <div className="text-center text-xs sm:text-sm text-gray-400">
          Showing {filteredWarriors.length} of {warriors.length} warriors
        </div>
      )}
    </div>
  );
}

