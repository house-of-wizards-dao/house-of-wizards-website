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
    <div className="flex justify-center gap-4 mb-8 flex-wrap p-1">
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
        className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-4 py-2 text-sm md:text-base min-w-[200px] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-gray-500"
      />
    </div>
  );
}

