"use client";

import { SortArrow } from "./SortArrow";
import type { SortField, SortDirection } from "@/hooks/useTraitSorting";

interface TraitTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const columns: Array<{ field: SortField; label: string; sortable: boolean }> = [
  { field: "value", label: "Trait Name", sortable: true },
  { field: "original", label: "Original", sortable: true },
  { field: "remaining", label: "Remaining", sortable: true },
  { field: "burned", label: "Burned", sortable: true },
  { field: "percentage", label: "Burn %", sortable: true },
];

export function TraitTableHeader({
  sortField,
  sortDirection,
  onSort,
}: TraitTableHeaderProps) {
  return (
    <thead>
      <tr className="border-b-2 border-neutral-700">
        {columns.map((column) => (
          <th
            key={column.field}
            className={`p-4 text-left text-sm ${
              column.sortable
                ? "cursor-pointer select-none hover:text-brand-500 transition-colors"
                : ""
            }`}
            onClick={column.sortable ? () => onSort(column.field) : undefined}
          >
            {column.label}
            {column.sortable && (
              <SortArrow
                field={column.field}
                currentField={sortField}
                direction={sortDirection}
              />
            )}
          </th>
        ))}
        <th className="p-4 text-left text-sm">Type</th>
      </tr>
    </thead>
  );
}
