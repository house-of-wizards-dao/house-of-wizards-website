"use client";

import { TraitTableHeader } from "./TraitTableHeader";
import { TraitTableRow } from "./TraitTableRow";
import type { SortField, SortDirection } from "@/hooks/useTraitSorting";
import type { ProcessedTrait } from "@/hooks/useProcessedTraits";

interface TraitTableProps {
  traits: ProcessedTrait[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function TraitTable({
  traits,
  sortField,
  sortDirection,
  onSort,
}: TraitTableProps) {
  return (
    <div className="w-full overflow-x-auto flex flex-col items-center">
      <table>
      <TraitTableHeader
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <tbody>
        {traits.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-8 text-center text-gray-400">
              No traits found matching your filters.
            </td>
          </tr>
        ) : (
          traits.map((trait, index) => (
            <TraitTableRow key={`${trait.type}-${trait.name}-${index}`} trait={trait} index={index} />
          ))
        )}
      </tbody>
      </table>
    </div>
  );
}

