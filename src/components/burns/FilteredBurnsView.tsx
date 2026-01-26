"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { TraitFilter } from "@/components/burns/TraitFilter";
import { BurnsListView } from "@/components/burns/BurnsListView";
import type { StatsData, Burn } from "@/lib/burn-stats";

type FilteredBurnsViewProps = {
  data: StatsData;
  filterBy: "wizard" | "soul";
  primaryType: "wizard" | "soul";
  itemLabel: string;
};

export function FilteredBurnsView({
  data,
  filterBy,
  primaryType,
  itemLabel,
}: FilteredBurnsViewProps) {
  const [filteredBurns, setFilteredBurns] = useState<Burn[]>([]);

  // Initialize filteredBurns when data loads
  useEffect(() => {
    if (data) {
      setFilteredBurns(data.burns);
    }
  }, [data]);

  const handleFilterChange = useCallback(
    (filtered: Array<{ tokenId: string }>) => {
      const tokenIdSet = new Set(filtered.map((f) => f.tokenId));
      setFilteredBurns(
        data.burns.filter((burn) => tokenIdSet.has(burn.tokenId)),
      );
    },
    [data.burns],
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
}
