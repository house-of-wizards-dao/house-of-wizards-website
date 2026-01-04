"use client";

export type BurnView = "wizards" | "souls" | "traits";

interface ViewSelectorProps {
  currentView: BurnView;
  onViewChange: (view: BurnView) => void;
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <div className="flex gap-2 font-atirose font-lg">
      <button
        onClick={() => onViewChange("wizards")}
        className={`px-6 py-2 rounded-lg transition-colors ${
          currentView === "wizards"
            ? "bg-brand-500 text-white"
            : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
        }`}
      >
        Wizards
      </button>
      <button
        onClick={() => onViewChange("souls")}
        className={`px-6 py-2 rounded-lg transition-colors ${
          currentView === "souls"
            ? "bg-brand-500 text-white"
            : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
        }`}
      >
        Souls
      </button>
      <button
        onClick={() => onViewChange("traits")}
        className={`px-6 py-2 rounded-lg transition-colors ${
          currentView === "traits"
            ? "bg-brand-500 text-white"
            : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
        }`}
      >
        Traits
      </button>
    </div>
  );
}

