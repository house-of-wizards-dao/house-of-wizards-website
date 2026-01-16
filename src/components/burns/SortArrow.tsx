type SortDirection = "asc" | "desc";

interface SortArrowProps {
  field: string;
  currentField: string;
  direction: SortDirection;
}

export function SortArrow({ field, currentField, direction }: SortArrowProps) {
  if (field !== currentField) return null;
  return <span>{direction === "asc" ? " ↑" : " ↓"}</span>;
}
