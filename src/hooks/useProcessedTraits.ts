import { useMemo } from "react";
import type { TraitBurnStat } from "@/lib/burn-stats";
import type { SortField, SortDirection } from "./useTraitSorting";

export interface ProcessedTrait extends TraitBurnStat {
  burnPercentage: number;
}

interface UseProcessedTraitsParams {
  traits: TraitBurnStat[] | undefined;
  selectedType: string;
  searchQuery: string;
  sortField: SortField;
  sortDirection: SortDirection;
}

export function useProcessedTraits({
  traits,
  selectedType,
  searchQuery,
  sortField,
  sortDirection,
}: UseProcessedTraitsParams): ProcessedTrait[] {
  return useMemo<ProcessedTrait[]>(() => {
    if (!traits) return [];

    return traits
      .map((trait) => ({
        ...trait,
        burnPercentage: trait.original > 0 ? (trait.burned / trait.original) * 100 : 0,
      }))
      .filter((trait) => {
        // Filter by type
        if (selectedType !== "all" && trait.traitType !== selectedType) {
          return false;
        }
        // Filter by search query
        if (searchQuery && !trait.value.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (sortField) {
          case "value":
            aValue = a.value;
            bValue = b.value;
            break;
          case "original":
            aValue = a.original;
            bValue = b.original;
            break;
          case "remaining":
            aValue = a.remaining;
            bValue = b.remaining;
            break;
          case "burned":
            aValue = a.burned;
            bValue = b.burned;
            break;
          case "percentage":
            aValue = a.burnPercentage;
            bValue = b.burnPercentage;
            break;
          default:
            return 0;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortDirection === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
  }, [traits, selectedType, searchQuery, sortField, sortDirection]);
}

