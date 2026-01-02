interface TraitTableRowProps {
  trait: {
    name: string;
    old: number;
    new: number;
    diff: number;
    burnPercentage: number;
    type: string;
  };
  index: number;
}

export function TraitTableRow({ trait, index }: TraitTableRowProps) {
  return (
    <tr
      className={`border-b border-neutral-800 ${
        index % 2 === 0 ? "bg-transparent" : "bg-white/5"
      }`}
    >
      <td className="p-4">
        <strong>{trait.name}</strong>
      </td>
      <td className="p-4">{trait.old}</td>
      <td className="p-4">{trait.new}</td>
      <td className={`p-4 ${trait.diff > 0 ? "text-red-400" : "text-white"}`}>
        {trait.diff}
      </td>
      <td className="p-4">{trait.burnPercentage.toFixed(1)}%</td>
      <td className="p-4 capitalize">{trait.type}</td>
    </tr>
  );
}

