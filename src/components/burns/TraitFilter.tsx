"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { getWizardTrait } from "@/lib/wizards";
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
  traits: TraitStat[];
  wizardIds: string[];
  onFilterChange: (filteredIds: string[]) => void;
}

export function TraitFilter({ traits, wizardIds, onFilterChange }: TraitFilterProps) {
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

    traits.forEach((trait) => {
      if (trait.type in grouped && trait.name) {
        grouped[trait.type as TraitType].push({
          type: trait.type,
          name: trait.name,
        });
      }
    });

    // Remove duplicates and sort
    Object.keys(grouped).forEach((type) => {
      const typed = type as TraitType;
      grouped[typed] = Array.from(
        new Map(grouped[typed].map((item) => [item.name, item])).values()
      ).sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [traits]);

  const handleSelectOption = useCallback(
    (traitType: TraitType, option: TraitOption | null) => {
      setSelection((prev) => ({
        ...prev,
        [traitType]: option,
      }));
    },
    []
  );

  // Filter wizard IDs based on current selection
  const filteredIds = useMemo(() => {
    const newOrder: string[] = [];

    for (const wizId of wizardIds) {
      const match = {
        head: false,
        body: false,
        prop: false,
        familiar: false,
        rune: false,
        background: false,
      };

      for (const traitType of traitList) {
        const traitSelection = selection[traitType];
        if (!traitSelection) {
          match[traitType] = true;
        } else {
          const wizardTrait = getWizardTrait(wizId, traitType);
          if (wizardTrait === traitSelection.name) {
            match[traitType] = true;
          }
        }
      }

      if (
        match.head &&
        match.body &&
        match.prop &&
        match.familiar &&
        match.rune &&
        match.background
      ) {
        newOrder.push(wizId);
      }
    }

    return newOrder;
  }, [wizardIds, selection]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filteredIds);
  }, [filteredIds, onFilterChange]);

  const clearFilters = useCallback(() => {
    setSelection({
      head: null,
      body: null,
      prop: null,
      familiar: null,
      rune: null,
      background: null,
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(selection).some((value) => value !== null);
  }, [selection]);

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
          Showing {filteredIds.length} of {wizardIds.length} wizards
        </div>
      )}
    </div>
  );
}

