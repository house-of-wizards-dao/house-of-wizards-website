"use client";

import { useState } from "react";
import { useTraitSorting } from "@/hooks/useTraitSorting";
import { useProcessedTraits } from "@/hooks/useProcessedTraits";
import { TraitFilters } from "@/components/burns/TraitFilters";
import { TraitTable } from "@/components/burns/TraitTable";
import { TraitStatsSummary } from "@/components/burns/TraitStatsSummary";
import type { StatsData } from "@/lib/burn-stats";
import { TRAITS } from "@/lib/traits";

type TraitsViewProps = {
  data: StatsData;
};

export function TraitsView({ data }: TraitsViewProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { sortField, sortDirection, handleSort } = useTraitSorting(
    "burned",
    "desc",
  );

  const processedTraits = useProcessedTraits({
    traits: data.traits,
    selectedType,
    searchQuery,
    sortField,
    sortDirection,
  });

  const traitTypes = ["all", ...TRAITS];

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <TraitFilters
        selectedType={selectedType}
        searchQuery={searchQuery}
        traitTypes={traitTypes}
        onTypeChange={setSelectedType}
        onSearchChange={setSearchQuery}
      />

      <TraitTable
        traits={processedTraits}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <TraitStatsSummary
        showing={processedTraits.length}
        total={data.traits.length}
      />
    </div>
  );
}
