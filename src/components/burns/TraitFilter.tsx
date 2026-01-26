"use client";

import { useState, useMemo, useEffect } from "react";
import { TraitBurnStat } from "@/lib/burn-stats";
import { TRAITS, type TraitType } from "@/lib/traits";

export type TraitOption = {
  type: string;
  name: string;
};

export type TraitSelection = {
  head: TraitOption | null;
  body: TraitOption | null;
  prop: TraitOption | null;
  familiar: TraitOption | null;
  rune: TraitOption | null;
  background: TraitOption | null;
};

type TraitSelectorProps = {
  trait: TraitType;
  options: TraitOption[];
  selectedOption: TraitOption | null;
  onSelectOption: (option: TraitOption | null) => void;
};

function TraitSelector({
  trait,
  options,
  selectedOption,
  onSelectOption,
}: TraitSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <select
        id={`trait-${trait}`}
        value={selectedOption?.name || ""}
        onChange={(e) => {
          const option = e.target.value
            ? options.find((opt) => opt.name === e.target.value) || null
            : null;
          onSelectOption(option);
        }}
        className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent capitalize"
      >
        <option value="">All {trait}s</option>
        {options.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

type TraitFilterProps = {
  traits: TraitBurnStat[] | Array<{ type: string; name: string }>;
  burns: Array<{
    tokenId: string;
    wizard: {
      name: string;
      head?: string;
      body?: string;
      prop?: string;
      familiar?: string;
      rune?: string;
      background?: string;
    };
    soul: {
      name: string;
      head?: string;
      body?: string;
      prop?: string;
      familiar?: string;
      rune?: string;
      background?: string;
    };
  }>;
  filterBy: "wizard" | "soul"; // Filter by wizard traits or soul traits
  onFilterChange: (filteredBurns: Array<{ tokenId: string }>) => void;
  itemLabel?: string; // "wizards" or "souls"
  excludedTraits?: TraitType[]; // Trait types to exclude from the filter UI
};

export function TraitFilter({
  traits,
  burns,
  filterBy,
  onFilterChange,
  itemLabel = "items",
  excludedTraits = [],
}: TraitFilterProps) {
  const [selection, setSelection] = useState<TraitSelection>({
    head: null,
    body: null,
    prop: null,
    familiar: null,
    rune: null,
    background: null,
  });

  // Group traits by type for each selector
  const traitsByType = useMemo(() => {
    const grouped: Record<TraitType, TraitOption[]> = {
      head: [],
      body: [],
      prop: [],
      familiar: [],
      rune: [],
      background: [],
    };

    // Use Set to track seen trait names per type
    const seen = new Map<TraitType, Set<string>>();
    TRAITS.forEach((type) => {
      seen.set(type, new Set());
    });

    traits.forEach((trait) => {
      // Handle both TraitBurnStat and TraitOption formats
      const traitType = (
        "traitType" in trait ? trait.traitType : trait.type
      ).toLowerCase() as TraitType;
      const traitValue = "value" in trait ? trait.value : trait.name;
      const traitTypeOriginal =
        "traitType" in trait ? trait.traitType : trait.type;

      if (
        TRAITS.includes(traitType) &&
        traitValue &&
        !seen.get(traitType)!.has(traitValue)
      ) {
        seen.get(traitType)!.add(traitValue);
        grouped[traitType].push({
          type: traitTypeOriginal,
          name: traitValue,
        });
      }
    });

    // Sort each group
    TRAITS.forEach((type) => {
      grouped[type].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [traits]);

  // Get active selections (only traits that have a filter applied)
  const activeSelections = useMemo(() => {
    const active: Array<[TraitType, string]> = [];
    TRAITS.forEach((traitType) => {
      const selected = selection[traitType];
      if (selected) {
        active.push([traitType, selected.name]);
      }
    });
    return active;
  }, [selection]);

  // Filter burns based on current selection
  const filteredBurns = useMemo(() => {
    // Early exit: if no filters are active, return all burns
    if (activeSelections.length === 0) {
      return burns;
    }

    const filtered: typeof burns = [];

    for (const burn of burns) {
      // Check only active selections - early exit on first mismatch
      let matches = true;
      const item = filterBy === "wizard" ? burn.wizard : burn.soul;

      if (!item) {
        continue; // Skip burns without data
      }

      for (const [traitType, expectedValue] of activeSelections) {
        const itemTrait = item[traitType];
        if (itemTrait !== expectedValue) {
          matches = false;
          break; // Early exit on first mismatch
        }
      }

      if (matches) {
        filtered.push(burn);
      }
    }

    return filtered;
  }, [burns, activeSelections, filterBy]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filteredBurns.map((burn) => ({ tokenId: burn.tokenId })));
  }, [filteredBurns, onFilterChange]);

  const handleSelectOption = (
    traitType: TraitType,
    option: TraitOption | null,
  ) => {
    setSelection((prev) => ({
      ...prev,
      [traitType]: option,
    }));
  };

  const clearFilters = () => {
    setSelection({
      head: null,
      body: null,
      prop: null,
      familiar: null,
      rune: null,
      background: null,
    });
  };

  const hasActiveFilters = activeSelections.length > 0;

  const traitsToShow = TRAITS.filter(
    (trait) => !excludedTraits.includes(trait),
  );

  return (
    <div className="flex flex-col gap-4 md:sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-b border-neutral-800 mb-4">
      <div className="flex justify-center items-center gap-4 flex-wrap">
        {traitsToShow.map((trait) => (
          <TraitSelector
            key={trait}
            trait={trait}
            options={traitsByType[trait]}
            selectedOption={selection[trait]}
            onSelectOption={(option) => handleSelectOption(trait, option)}
          />
        ))}
      </div>
      {hasActiveFilters && (
        <div className="flex justify-center">
          <button
            onClick={clearFilters}
            className="text-sm text-brand-500 hover:text-brand-400 underline"
          >
            Clear all filters
          </button>
        </div>
      )}
      {hasActiveFilters && (
        <div className="text-center text-sm text-gray-400">
          Showing {filteredBurns.length} of {burns.length} {itemLabel}
        </div>
      )}
    </div>
  );
}
