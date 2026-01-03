"use client";

import { useState, useMemo, useEffect } from "react";
import { TraitStat } from "@/lib/burn-stats";

const traitList = ["head", "body", "prop", "familiar", "rune", "background"] as const;
export type TraitType = typeof traitList[number];

export interface TraitOption {
  type: string;
  name: string;
}

export interface TraitSelection {
  head: TraitOption | null;
  body: TraitOption | null;
  prop: TraitOption | null;
  familiar: TraitOption | null;
  rune: TraitOption | null;
  background: TraitOption | null;
}

interface TraitSelectorProps {
  trait: TraitType;
  options: TraitOption[];
  selectedOption: TraitOption | null;
  onSelectOption: (option: TraitOption | null) => void;
}

function TraitSelector({ trait, options, selectedOption, onSelectOption }: TraitSelectorProps) {
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

interface TraitFilterProps {
  traits: TraitStat[] | Array<{ type: string; name: string }>;
  itemIds: string[];
  traitsMap: Record<string, Record<TraitType, string | undefined>>;
  onFilterChange: (filteredIds: string[]) => void;
  itemLabel?: string; // "wizards" or "souls"
}

export function TraitFilter({ 
  traits, 
  itemIds, 
  traitsMap,
  onFilterChange,
  itemLabel = "items"
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
    traitList.forEach((type) => {
      seen.set(type, new Set());
    });

    traits.forEach((trait) => {
      const type = trait.type.toLowerCase() as TraitType;
      if (traitList.includes(type) && trait.name && !seen.get(type)!.has(trait.name)) {
        seen.get(type)!.add(trait.name);
        grouped[type].push({
          type: trait.type,
          name: trait.name,
        });
      }
    });

    // Sort each group
    traitList.forEach((type) => {
      grouped[type].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [traits]);

  // Get active selections (only traits that have a filter applied)
  const activeSelections = useMemo(() => {
    const active: Array<[TraitType, string]> = [];
    traitList.forEach((traitType) => {
      const selected = selection[traitType];
      if (selected) {
        active.push([traitType, selected.name]);
      }
    });
    return active;
  }, [selection]);

  // Filter item IDs based on current selection
  const filteredIds = useMemo(() => {
    // Early exit: if no filters are active, return all items
    if (activeSelections.length === 0) {
      return itemIds;
    }

    const filtered: string[] = [];

    for (const itemId of itemIds) {
      // Check only active selections - early exit on first mismatch
      let matches = true;
      const itemTraits = traitsMap[itemId];
      
      if (!itemTraits) {
        continue; // Skip items without trait data
      }

      for (const [traitType, expectedValue] of activeSelections) {
        const itemTrait = itemTraits[traitType];
        if (itemTrait !== expectedValue) {
          matches = false;
          break; // Early exit on first mismatch
        }
      }

      if (matches) {
        filtered.push(itemId);
      }
    }

    return filtered;
  }, [itemIds, activeSelections, traitsMap]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filteredIds);
  }, [filteredIds, onFilterChange]);

  const handleSelectOption = (traitType: TraitType, option: TraitOption | null) => {
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

  return (
    <div className="flex flex-col gap-4 md:sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-b border-neutral-800 mb-4">
      <div className="flex justify-center items-center gap-4 flex-wrap">
        {traitList.map((trait) => (
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
          Showing {filteredIds.length} of {itemIds.length} {itemLabel}
        </div>
      )}
    </div>
  );
}

