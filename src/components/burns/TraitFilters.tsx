"use client";

interface TraitFiltersProps {
  selectedType: string;
  searchQuery: string;
  traitTypes: string[];
  onTypeChange: (type: string) => void;
  onSearchChange: (query: string) => void;
}

export function TraitFilters({
  selectedType,
  searchQuery,
  traitTypes,
  onTypeChange,
  onSearchChange,
}: TraitFiltersProps) {
  return (
    <div className="md:sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-b border-neutral-800 mb-4 w-full">
      <div className="flex justify-center gap-4 flex-wrap">
        <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-4 py-2 text-sm md:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      >
        {traitTypes.map((type) => (
          <option key={type} value={type}>
            {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search trait name..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-4 py-2 text-sm md:text-base min-w-[200px] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent         placeholder-gray-500"
      />
      </div>
    </div>
  );
}

