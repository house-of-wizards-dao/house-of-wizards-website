type TraitStatsSummaryProps = {
  showing: number;
  total: number;
};

export function TraitStatsSummary({ showing, total }: TraitStatsSummaryProps) {
  return (
    <div className="mt-8 text-center text-sm text-gray-400 mb-8">
      Showing {showing} of {total} traits
    </div>
  );
}
