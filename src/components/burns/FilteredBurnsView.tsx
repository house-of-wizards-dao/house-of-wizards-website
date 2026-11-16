"use client";

import { useState, useCallback } from "react";
import { TraitFilter } from "@/components/burns/TraitFilter";
import { BurnsListView } from "@/components/burns/BurnsListView";
import type { StatsData } from "@/lib/burn-stats";

type FilteredBurnsViewProps = {
  data: StatsData;
  filterBy: "wizard" | "soul";
  primaryType: "wizard" | "soul";
  itemLabel: string;
};

export const FilteredBurnsView = ({
  data,
  filterBy,
  primaryType,
  itemLabel,
}: FilteredBurnsViewProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string> | null>(null);
  const filteredBurns = selectedIds
    ? data.burns.filter((burn) => selectedIds.has(burn.tokenId))
    : data.burns;

  const handleFilterChange = useCallback(
    (filtered: Array<{ tokenId: string }>) => {
      const tokenIdSet = new Set(filtered.map((f) => f.tokenId));
      setSelectedIds(tokenIdSet);
    },
    [],
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <TraitFilter
        traits={data.filterOptions[filterBy]}
        burns={data.burns}
        filterBy={filterBy}
        onFilterChange={handleFilterChange}
        itemLabel={itemLabel}
        excludedTraits={["background", "rune"]}
      />
      <BurnsListView burns={filteredBurns} primaryType={primaryType} />
    </div>
  );
};
