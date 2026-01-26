import type { StatsData } from "@/lib/burn-stats";
import { FilteredBurnsView } from "@/components/burns/FilteredBurnsView";

type SoulsViewProps = {
  data: StatsData;
};

export function SoulsView({ data }: SoulsViewProps) {
  return (
    <FilteredBurnsView
      data={data}
      filterBy="soul"
      primaryType="soul"
      itemLabel="souls"
    />
  );
}
