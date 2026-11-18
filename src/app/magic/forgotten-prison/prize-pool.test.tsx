import { render, screen, fireEvent } from "@testing-library/react";
import { PrizePool } from "./prize-pool";
import type { IndexedPrize } from "@/lib/forgotten-prison/index-types";
const prize: IndexedPrize = {
  collection: "0x9690b63eb85467be5267a3603f770589ab12dc95",
  tokenId: "0",
  kind: "Warrior",
  status: "available",
  drawId: null,
  updatedAt: "2026-11-18T00:00:00Z",
  name: "The Emissary",
  imageUrl: "https://portal.forgottenrunes.com/api/warriors/img/0.png",
};
it("shows cached character details, searches names, and removes newly awarded prizes", () => {
  const { rerender } = render(
    <PrizePool
      prizes={[
        prize,
        { ...prize, tokenId: "1", name: "Awarded Warrior", status: "awarded" },
      ]}
      loading={false}
      error={false}
    />,
  );
  expect(screen.getByText("The Emissary")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "The Emissary" })).toBeInTheDocument();
  expect(screen.queryByText("Awarded Warrior")).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Find a prisoner"), {
    target: { value: "Wizard" },
  });
  expect(
    screen.getByText("No prisoners match your search."),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Find a prisoner"), {
    target: { value: "" },
  });
  rerender(
    <PrizePool
      prizes={[{ ...prize, status: "awarded" }]}
      loading={false}
      error={false}
    />,
  );
  expect(screen.queryByText("The Emissary")).not.toBeInTheDocument();
  expect(screen.getByTestId("prize-pool-count")).toHaveTextContent("0 prizes");
});
