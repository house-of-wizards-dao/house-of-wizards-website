import { render, screen } from "@testing-library/react";
import { WinningRound, DrawProgress } from "./indexed-auction";
import { COLLECTIONS } from "@/lib/forgotten-prison/config";
import type { Auction } from "@/lib/forgotten-prison/bidding";
import type { IndexedDraw } from "@/lib/forgotten-prison/index-types";

const wallet = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as const;
const hash = `0x${"1".repeat(64)}`;
const target = { chainId: 1 as const, address: wallet };
const draw: IndexedDraw = {
  id: "1",
  winner: wallet,
  price: "123456789012345678",
  status: "finalized",
  startedAt: "2026-11-17T12:00:00Z",
  readyAt: "2026-11-17T12:00:30Z",
  finalizedAt: "2026-11-17T12:01:00Z",
  startTx: hash,
  finalizeTx: hash,
  requestId: "1",
  collection: COLLECTIONS.Wizards,
  tokenId: "0",
  boxTokenId: "0",
  claimed: false,
  bonusClaimed: true,
  recipient: null,
  bonusRecipient: wallet,
  claimTx: null,
  bonusClaimTx: hash,
};
const auction: Auction = {
  closed: false,
  nextDrawAt: 10n,
  pendingDrawId: 0n,
  drawCount: 0n,
  highestBid: [wallet, 1n],
  prizeCount: 1n,
  boxCount: 1n,
  eligible: [1n, 1n],
  bid: 0n,
  refund: 0n,
  balance: 0n,
  timestamp: 10n,
  history: [],
};

it("renders exact winning ETH, zero token IDs, and independent claim status with explorer links", () => {
  render(<WinningRound draw={draw} target={target} />);
  expect(screen.getByText("0.123456789012345678 ETH")).toBeInTheDocument();
  expect(screen.getByText("Wizard #0")).toBeInTheDocument();
  expect(screen.getByText("Main prize · Ready to claim")).toBeInTheDocument();
  expect(screen.getByText("Imp Box #0 · Claimed")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Bonus claim transaction" }),
  ).toHaveAttribute("href", `https://etherscan.io/tx/${hash}`);
});

it("shows aborted rounds without implying the payment bought a prize", () => {
  render(
    <WinningRound
      draw={{
        ...draw,
        status: "aborted",
        collection: null,
        tokenId: null,
        boxTokenId: null,
      }}
      target={target}
    />,
  );
  expect(screen.getByText("Refundable payment")).toBeInTheDocument();
  expect(screen.getByText("No prize awarded")).toBeInTheDocument();
  expect(
    screen.queryByText("Main prize · Ready to claim"),
  ).not.toBeInTheDocument();
});

it("does not call an elapsed cutoff a started draw", () => {
  render(<DrawProgress auction={auction} remaining={0} />);
  expect(
    screen.getByText("Cutoff reached · draw not started"),
  ).toBeInTheDocument();
});

it("shows a ready previous draw while the next bidding window remains open", () => {
  render(
    <DrawProgress
      auction={{
        ...auction,
        pendingDrawId: 1n,
        drawCount: 1n,
        history: [
          {
            id: 1n,
            winner: wallet,
            price: 1n,
            requestId: 1n,
            requestedAt: 1n,
            inventorySize: 1n,
            boxInventorySize: 1n,
            randomWord: 0n,
            bonusWord: 0n,
            collection: wallet,
            tokenId: 0n,
            boxTokenId: 0n,
            status: 2,
            claimed: false,
            bonusAwarded: false,
            bonusClaimed: false,
          },
        ],
      }}
      remaining={100}
    />,
  );
  expect(
    screen.getByText("Round #1 · randomness received"),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "New bids enter the following round while this draw settles.",
    ),
  ).toBeInTheDocument();
});
