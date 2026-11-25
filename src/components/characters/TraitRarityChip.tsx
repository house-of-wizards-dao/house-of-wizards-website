import {
  formatTraitPercent,
  traitRarityTier,
  type TraitRarityTier,
} from "@/lib/trait-rarity";
import { cn } from "@/lib/utils";

type TraitRarityChipProps = {
  count: number;
  total: number;
  className?: string;
};

const rarityChipClass: Record<TraitRarityTier, string> = {
  common: "bg-neutral-800 text-neutral-300",
  standard: "bg-emerald-950 text-emerald-200",
  uncommon: "bg-sky-950 text-sky-200",
  rare: "bg-purple-950 text-purple-200",
  epic: "bg-orange-950 text-orange-200",
  unique: "bg-yellow-950 text-yellow-200",
};

const rarityPercentClass: Record<TraitRarityTier, string> = {
  common: "text-neutral-400",
  standard: "text-emerald-400",
  uncommon: "text-sky-400",
  rare: "text-purple-400",
  epic: "text-orange-400",
  unique: "text-yellow-300",
};

export const TraitRarityChip = ({
  count,
  total,
  className,
}: TraitRarityChipProps) => {
  const tier = traitRarityTier(count);

  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm tabular-nums",
        rarityChipClass[tier],
        className,
      )}
    >
      <span>{count.toLocaleString("en-US")}</span>
      <span className={cn("font-semibold", rarityPercentClass[tier])}>
        {formatTraitPercent(count, total)}
      </span>
    </p>
  );
};
