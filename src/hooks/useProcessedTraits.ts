import { useMemo } from "react";
import type { TraitStat } from "@/lib/burn-stats";
import type { SortField, SortDirection } from "./useTraitSorting";

export interface ProcessedTrait extends TraitStat {
  burnPercentage: number;
}

interface UseProcessedTraitsParams {
  traits: TraitStat[] | undefined;
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
        burnPercentage: trait.old > 0 ? (trait.diff / trait.old) * 100 : 0,
      }))
      .filter((trait) => {
        // Filter by type
        if (selectedType !== "all" && trait.type !== selectedType) {
          return false;
        }
        // Filter by search query
        if (searchQuery && !trait.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (sortField) {
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "old":
            aValue = a.old;
            bValue = b.old;
            break;
          case "new":
            aValue = a.new;
            bValue = b.new;
            break;
          case "diff":
            aValue = a.diff;
            bValue = b.diff;
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

