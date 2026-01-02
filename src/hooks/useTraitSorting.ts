import { useState, useCallback } from "react";

export type SortField = "name" | "old" | "new" | "diff" | "percentage";
export type SortDirection = "asc" | "desc";

interface UseTraitSortingReturn {
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
}

export function useTraitSorting(
  defaultField: SortField = "diff",
  defaultDirection: SortDirection = "desc"
): UseTraitSortingReturn {
  const [sortField, setSortField] = useState<SortField>(defaultField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultDirection);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("desc");
      }
    },
    [sortField]
  );

  return {
    sortField,
    sortDirection,
    handleSort,
  };
}

