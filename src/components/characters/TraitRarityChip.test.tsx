import { render, screen } from "@testing-library/react";
import { TraitRarityChip } from "./TraitRarityChip";

it("shows the mint count and its share of the collection", () => {
  render(<TraitRarityChip count={26} total={10000} />);

  expect(screen.getByText("26")).toBeInTheDocument();
  expect(screen.getByText("0.26%")).toBeInTheDocument();
});
