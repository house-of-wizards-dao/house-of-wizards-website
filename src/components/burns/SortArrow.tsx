type SortDirection = "asc" | "desc";

type SortArrowProps = {
  field: string;
  currentField: string;
  direction: SortDirection;
};

export const SortArrow = ({ field, currentField, direction }: SortArrowProps) => {
  if (field !== currentField) return null;
  return <span>{direction === "asc" ? " ↑" : " ↓"}</span>;
};
