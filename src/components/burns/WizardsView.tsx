import type { StatsData } from "@/lib/burn-stats";
import { FilteredBurnsView } from "@/components/burns/FilteredBurnsView";

type WizardsViewProps = {
  data: StatsData;
};

export const WizardsView = ({ data }: WizardsViewProps) => {
  return (
    <FilteredBurnsView
      data={data}
      filterBy="wizard"
      primaryType="wizard"
      itemLabel="wizards"
    />
  );
};
