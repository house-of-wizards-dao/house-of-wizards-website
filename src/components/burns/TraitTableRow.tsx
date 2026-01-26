import type { ProcessedTrait } from "@/hooks/useProcessedTraits";

type TraitTableRowProps = {
  trait: ProcessedTrait;
  index: number;
};

export const TraitTableRow = ({ trait, index }: TraitTableRowProps) => {
  return (
    <tr
      className={`border-b border-neutral-800 ${
        index % 2 === 0 ? "bg-transparent" : "bg-white/5"
      }`}
    >
      <td className="p-4 text-sm">
        <strong>{trait.value}</strong>
      </td>
      <td className="p-4 text-sm">{trait.original}</td>
      <td className="p-4 text-sm">{trait.remaining}</td>
      <td
        className={`p-4 text-sm ${trait.burned > 0 ? "text-red-400" : "text-white"}`}
      >
        {trait.burned}
      </td>
      <td className="p-4 text-sm">{trait.burnPercentage.toFixed(1)}%</td>
      <td className="p-4 text-sm capitalize">{trait.traitType}</td>
    </tr>
  );
};
