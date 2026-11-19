import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { PrizeDraw } from "@/lib/forgotten-prison/bidding";
import { VISITOR } from "@/lib/forgotten-prison/escape";
import EscapeClient from "./escape-client";

const account = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as const;
const target = { chainId: 1 as const, address: account };
let mockDraw: PrizeDraw;
let mockRejectBonus = false;
const mockWrite = jest.fn(
  async ({ functionName }: { functionName: string }) => {
    if (functionName === "claimBonus" && mockRejectBonus)
      throw new Error("User rejected bonus");
    if (functionName === "claimNFT") mockDraw.claimed = true;
    if (functionName === "claimBonus") mockDraw.bonusClaimed = true;
    return `0x${"1".repeat(64)}`;
  },
);
const mockClient = {
  readContract: jest.fn(async ({ functionName }: { functionName: string }) =>
    functionName === "drawCount" ? 1n : { ...mockDraw },
  ),
  simulateContract: jest.fn(async () => ({})),
};
jest.mock("wagmi", () => ({
  useAccount: () => ({ address: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }),
  useConfig: () => ({}),
  useSwitchChain: () => ({ switchChainAsync: jest.fn() }),
  useWriteContract: () => ({ writeContractAsync: mockWrite }),
}));
jest.mock("@wagmi/core", () => ({
  getAccount: () => ({
    address: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    chainId: 1,
  }),
}));
jest.mock("@rainbow-me/rainbowkit", () => ({
  useConnectModal: () => ({ openConnectModal: jest.fn() }),
}));
jest.mock("@/components/Web3Provider", () => ({
  Web3Provider: ({ children }: { children: ReactNode }) => children,
}));
jest.mock("@/lib/forgotten-prison/bidding", () => ({
  createBidderClient: () => mockClient,
  readMyPrizes: async () => [{ ...mockDraw }],
  waitForBidderReceipt: async () => ({}),
  bidderError: (error: Error) => error.message,
}));
jest.mock("../indexed-auction", () => ({
  usePrisonIndex: () => ({ data: { prizes: [] } }),
}));
jest.mock("./character-selector", () => ({
  CharacterSelector: ({
    onSelect,
  }: {
    onSelect: (character: typeof VISITOR) => void;
  }) => <button onClick={() => onSelect(VISITOR)}>Choose visitor</button>,
}));
jest.mock("./prison-game", () => ({
  __esModule: true,
  default: ({
    release,
    onArrive,
    onRevealed,
  }: {
    release: unknown;
    onArrive: () => void;
    onRevealed: () => void;
  }) => (
    <>
      <button onClick={onArrive}>Meet Stank</button>
      {release ? (
        <button onClick={onRevealed}>Finish rescue animation</button>
      ) : null}
    </>
  ),
}));

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  mockRejectBonus = false;
  mockDraw = {
    id: 1n,
    winner: account,
    status: 3,
    claimed: false,
    bonusAwarded: true,
    bonusClaimed: false,
    collection: "0x521f9C7505005CFA19A8E5786a9c3c9c9F5e6f42",
    tokenId: 951n,
    boxTokenId: 7n,
    price: 1n,
    requestedAt: 1n,
    requestId: 1n,
    inventorySize: 1n,
    boxInventorySize: 1n,
    randomWord: 0n,
    bonusWord: 0n,
  };
});
const enter = async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  render(
    <QueryClientProvider client={client}>
      <EscapeClient target={target} drawId="1" />
    </QueryClientProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Choose visitor" }));
  fireEvent.click(screen.getByRole("button", { name: "Meet Stank" }));
  return screen.findByRole("button", {
    name: "Pay off Stank & claim winnings",
  });
};

it("keeps the prisoner hidden until the single claim flow and reveal finish", async () => {
  const claim = await enter();
  expect(screen.queryByTestId("prize-character")).not.toBeInTheDocument();
  fireEvent.click(claim);
  await screen.findByRole("button", { name: "Finish rescue animation" });
  expect(mockWrite.mock.calls.map(([request]) => request.functionName)).toEqual(
    ["claimNFT", "claimBonus"],
  );
  expect(screen.queryByTestId("prize-character")).not.toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Finish rescue animation" }),
  );
  expect(await screen.findByText("Wizard #951")).toBeInTheDocument();
  expect(screen.getByText(/Imp Box #7/)).toBeInTheDocument();
});

it("offers one resume button after a rejected bonus without resending the main claim", async () => {
  mockRejectBonus = true;
  fireEvent.click(await enter());
  await screen.findByRole("alert");
  expect(screen.queryByTestId("prize-character")).not.toBeInTheDocument();
  mockRejectBonus = false;
  fireEvent.click(
    await screen.findByRole("button", { name: "Finish claiming winnings" }),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Finish rescue animation" }),
    ).toBeInTheDocument(),
  );
  expect(mockWrite.mock.calls.map(([request]) => request.functionName)).toEqual(
    ["claimNFT", "claimBonus", "claimBonus"],
  );
});
