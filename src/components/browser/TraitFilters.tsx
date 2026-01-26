import { ChangeEvent } from "react";

type Props<TPart extends string> = {
  traits: readonly TPart[];
  selectedTraits: Partial<Record<TPart, number>>;
  onSelectTrait: (part: TPart) => (e: ChangeEvent<HTMLSelectElement>) => void;
  partToTraitOptions: Record<TPart, Array<{ value: number; label: string }>>;
};

export const TraitFilters = <TPart extends string>(props: Props<TPart>) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
      {props.traits.map((part) => (
        <div key={part} className="flex flex-col gap-1">
          <label className="text-sm text-gray-300 capitalize">{part}</label>
          <select
            className="rounded-md bg-[#111015] text-white px-3 py-2 border border-gray-700"
            value={props.selectedTraits[part] ?? ""}
            onChange={props.onSelectTrait(part)}
          >
            <option value="">Any</option>
            {props.partToTraitOptions[part].map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
