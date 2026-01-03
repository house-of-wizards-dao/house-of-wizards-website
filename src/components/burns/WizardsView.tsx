import type { StatsData } from "@/lib/burn-stats";
import { FilteredBurnsView } from "@/components/burns/FilteredBurnsView";

interface WizardsViewProps {
  data: StatsData;
}

export function WizardsView({ data }: WizardsViewProps) {
  return (
    <FilteredBurnsView
      data={data}
      filterBy="wizard"
      primaryType="wizard"
      itemLabel="wizards"
    />
  );
}

