"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { formatEther, type Address } from "viem";
import { prisonAbi } from "@/lib/forgotten-prison/abi";
import { COLLECTIONS } from "@/lib/forgotten-prison/config";
import type {
  PrisonCommand,
  PrisonState,
} from "@/lib/forgotten-prison/controller";

const endpoint = "/api/forgotten-prison/local";
const functions = prisonAbi.filter((item) => item.type === "function");
type ContractFunction = (typeof functions)[number];
type Run = (command: PrisonCommand, label: string) => Promise<void>;
const inputClass =
  "w-full min-w-0 rounded border border-violet-400/30 bg-[#100b1d] px-3 py-2 text-sm text-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-400";
const buttonClass =
  "rounded border border-violet-400/40 bg-violet-500/20 px-4 py-2 text-sm text-violet-100 hover:bg-violet-500/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-40";
const statuses = [
  "None",
  "Requested · waiting for VRF",
  "Ready · finalize next",
  "Finalized",
  "Aborted",
];
const eth = (value: string) => formatEther(BigInt(value));
const short = (value: string) => `${value.slice(0, 8)}…${value.slice(-6)}`;
const collectionName = (address: string) =>
  Object.entries(COLLECTIONS).find(
    ([, value]) => value.toLowerCase() === address.toLowerCase(),
  )?.[0] ?? short(address);
const date = (seconds: string) =>
  new Date(Number(seconds) * 1000).toLocaleString();

const fetchState = async (signal?: AbortSignal): Promise<PrisonState> => {
  const response = await fetch(endpoint, { cache: "no-store", signal });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.error ?? "Unable to read the local fork.");
  }
  return response.json();
};

const descriptions: Record<string, string> = {
  bid: "Add ETH to this account’s standing bid. The highest total wins; ties favor the earlier bid.",
  cancelBid:
    "Return this account’s entire standing bid to the recipient. Usually available before cutoff; losing bids otherwise roll over.",
  startDailyDraw:
    "Anyone can start at the cutoff. Locks the top bidder’s full payment and requests two random words. An empty day advances the cutoff without creating a draw.",
  finalizeDraw:
    "Anyone can settle a Ready draw. Selects the NFT and possible box, then credits the owner’s proceeds.",
  claimNFT:
    "Only this draw’s winner can claim its main prize, once. Recipient can be another address.",
  claimBonus:
    "Only the winner can claim an awarded Imp Box, independently of the main prize.",
  withdrawProceeds:
    "Owner only. Withdraw completed-sale proceeds; amount is in wei. Active bids and refunds remain separate.",
  withdrawRefund:
    "Withdraw this account’s aborted-draw refund. Use cancelBid() for a standing bid.",
  syncReceivedNFT:
    "Register a supported NFT already in the prison after a plain transferFrom(). Safe transfers register automatically.",
  shutdownStalledAuction:
    "Permanently closes the auction after a 7-day stall. A Requested draw becomes refundable. A Ready draw cannot be aborted.",
  recoverUnsoldNFT:
    "Owner only, after shutdown. Recover an available unsold NFT; prizes assigned to winners cannot be recovered.",
  transferOwnership:
    "Owner only. Nominate a new owner (zero cancels a nomination). The nominated account must accept.",
  acceptOwnership: "Switch to the nominated account, then accept ownership.",
  renounceOwnership:
    "Removes the owner permanently on this fork, disabling owner withdrawals and recovery. Reset the fork to undo this test.",
  rawFulfillRandomWords:
    "Direct callback test from the selected account; ordinary accounts revert. Use the mock VRF button above to impersonate the coordinator.",
  onERC721Received:
    "Normally called by the NFT collection during safeTransferFrom(). Calling from an ordinary account should fail.",
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="space-y-4">
    <h2 className="text-xl text-violet-200">{title}</h2>
    {children}
  </section>
);

const FunctionCard = ({
  fn,
  state,
  account,
  busy,
  run,
}: {
  fn: ContractFunction;
  state: PrisonState;
  account: Address;
  busy: string | null;
  run: Run;
}) => {
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [value, setValue] = useState("0.01");
  const readOnly = ["view", "pure"].includes(fn.stateMutability);
  const args = fn.inputs.map((parameter, index) => {
    if (inputs[index] !== undefined) return inputs[index];
    if (parameter.name === "drawId")
      return state.drawCount === "0" ? "1" : state.drawCount;
    if (parameter.name === "requestId")
      return (
        state.draws.find((draw) => draw.id === state.pendingDrawId)
          ?.requestId ?? "0"
      );
    if (parameter.type === "address")
      return parameter.name === "collection"
        ? (state.inventory[0]?.collection ?? COLLECTIONS.Warriors)
        : account;
    if (parameter.type === "bytes") return "0x";
    if (parameter.type === "uint256[]") return "[123, 456]";
    if (parameter.name === "tokenId") return state.inventory[0]?.tokenId ?? "0";
    if (parameter.name === "amount") return state.proceeds;
    return "0";
  });
  return (
    <form
      data-testid={`function-${fn.name}`}
      id={`function-${fn.name}`}
      className="flex flex-col gap-3 rounded-lg border border-violet-400/20 bg-violet-950/15 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        void run(
          {
            action: "call",
            account,
            functionName: fn.name,
            args,
            value: fn.stateMutability === "payable" ? value : "0",
          },
          fn.name,
        );
      }}
    >
      <h3 className="break-all font-mono text-sm text-violet-100">
        {fn.name}({fn.inputs.map((parameter) => parameter.type).join(", ")})
      </h3>
      {descriptions[fn.name] ? (
        <p className="text-sm leading-relaxed text-violet-200/70">
          {descriptions[fn.name]}
        </p>
      ) : null}
      <div className="mt-auto space-y-3">
        {fn.inputs.map((parameter, index) => (
          <label key={index} className="block text-xs text-violet-200/80">
            {parameter.name || `argument ${index + 1}`}{" "}
            <span className="text-violet-300/50">({parameter.type})</span>
            <input
              aria-label={`${fn.name} ${parameter.name || index}`}
              className={`${inputClass} mt-1`}
              value={args[index]}
              onChange={(event) =>
                setInputs((previous) => ({
                  ...previous,
                  [index]: event.target.value,
                }))
              }
              required
              spellCheck={false}
            />
          </label>
        ))}
        {fn.stateMutability === "payable" ? (
          <label className="block text-xs text-violet-200/80">
            ETH to add
            <input
              aria-label="Bid ETH"
              className={`${inputClass} mt-1`}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              inputMode="decimal"
              required
            />
          </label>
        ) : null}
        <button className={`${buttonClass} w-full`} disabled={busy !== null}>
          {busy === fn.name
            ? "Waiting for confirmation…"
            : `${readOnly ? "Read " : ""}${fn.name}()`}
        </button>
      </div>
    </form>
  );
};

export const PrisonLab = () => {
  const [state, setState] = useState<PrisonState | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<Address | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const lock = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ label: string; body: string }[]>([]);
  const [seconds, setSeconds] = useState("86400");
  const [words, setWords] = useState<[string, string]>(["123", "456"]);
  const [requestId, setRequestId] = useState("");
  const [donationCollection, setDonationCollection] = useState<Address>(
    COLLECTIONS.Warriors,
  );
  const [donationId, setDonationId] = useState("");
  const refresh = useCallback(async () => {
    setState(await fetchState());
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    void fetchState(controller.signal)
      .then(setState)
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setError(
            error instanceof Error
              ? error.message
              : "Cannot reach the local fork.",
          );
      });
    return () => controller.abort();
  }, []);
  const run: Run = async (command, label) => {
    if (lock.current) return;
    lock.current = true;
    setBusy(label);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Action failed.");
      setResults((previous) =>
        [{ label, body: JSON.stringify(body, null, 2) }, ...previous].slice(
          0,
          15,
        ),
      );
      await refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Action failed.");
    } finally {
      lock.current = false;
      setBusy(null);
    }
  };
  const account =
    selectedAccount ?? state?.accounts[1]?.address ?? state?.deployment.owner;
  const current = state?.accounts.find(
    (entry) => entry.address.toLowerCase() === account?.toLowerCase(),
  );
  const pending = state?.draws.find((draw) => draw.id === state.pendingDrawId);
  const cards = (names: string[]) =>
    state && account ? (
      <div className="grid gap-4 md:grid-cols-2">
        {functions
          .filter((fn) => names.includes(fn.name))
          .sort((a, b) => names.indexOf(a.name) - names.indexOf(b.name))
          .map((fn) => (
            <FunctionCard
              key={fn.name}
              fn={fn}
              state={state}
              account={account}
              busy={busy}
              run={run}
            />
          ))}
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#140a24] to-[#080510] px-4 py-10 text-violet-50 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-violet-300">
            Magic / local test lab
          </p>
          <h1 className="text-3xl font-bold sm:text-5xl">
            Forgotten Prison · Test lab
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-violet-200/80">
            Bid → advance to cutoff → startDailyDraw → mock VRF callback →
            finalizeDraw → claim. Use the account selector to test different
            bidders and the owner. All ETH, NFT transfers, time changes, and
            callbacks happen on localhost.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-200">
              ANVIL · CHAIN 31337
            </span>
            <span className="text-violet-300/70">
              RPC: http://127.0.0.1:8545
            </span>
            <button
              className={buttonClass}
              disabled={busy !== null}
              onClick={() => {
                setError(null);
                void refresh().catch((error: unknown) =>
                  setError(String(error)),
                );
              }}
            >
              Refresh state
            </button>
          </div>
        </header>

        {error ? (
          <div
            id="prison-error"
            role="alert"
            className="overflow-auto whitespace-pre-wrap rounded-lg border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200"
          >
            {error}
            {!state ? (
              <p className="mt-3">
                Start the fork and deployment with{" "}
                <code>pnpm prison:local</code>, then refresh.
              </p>
            ) : null}
          </div>
        ) : null}
        {!state || !account ? (
          <p role="status" className="text-violet-300">
            {error
              ? "Local deployment unavailable."
              : "Reading the local deployment…"}
          </p>
        ) : (
          <>
            <section className="space-y-4 rounded-lg border border-violet-400/30 bg-violet-950/25 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1 text-xs text-violet-200/70">
                  <p>
                    Contract{" "}
                    <code className="break-all text-violet-100">
                      {state.deployment.address}
                    </code>
                  </p>
                  <p>
                    Fork block {state.deployment.forkBlock.toLocaleString()} ·
                    Local block {state.block}
                  </p>
                  <p>
                    Seeded from{" "}
                    <code className="break-all">{state.deployment.donor}</code>
                  </p>
                  <p>
                    {state.deployment.seeded
                      .map(
                        (pool) =>
                          `${pool.tokenIds.length} ${pool.name.toLowerCase()}`,
                      )
                      .join(" · ")}
                  </p>
                </div>
                <span
                  className={`rounded px-3 py-1 text-sm ${state.closed ? "bg-red-400/15 text-red-200" : "bg-emerald-400/15 text-emerald-200"}`}
                >
                  {state.closed
                    ? "Permanently closed"
                    : pending
                      ? statuses[pending.status]
                      : "Open"}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Available prizes", state.prizeCount],
                  ["Available boxes", state.boxCount],
                  ["Highest bid", `${eth(state.highestBid[1])} ETH`],
                  ["Owner proceeds", `${eth(state.proceeds)} ETH`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-violet-300/70">{label}</p>
                    <p className="mt-1 text-2xl" data-testid={label}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-violet-200/70">
                Block time: {date(state.timestamp)} · Next cutoff:{" "}
                {date(state.nextDrawAt)} · Eligible at cutoff:{" "}
                {state.eligible[0]} prizes / {state.eligible[1]} boxes
              </p>
              <label className="block text-sm text-violet-200">
                Send transactions as
                <select
                  aria-label="Active account"
                  className={`${inputClass} mt-2`}
                  value={account}
                  disabled={busy !== null}
                  onChange={(event) =>
                    setSelectedAccount(event.target.value as Address)
                  }
                >
                  {state.accounts.map((entry) => (
                    <option key={entry.address} value={entry.address}>
                      {entry.label}
                      {entry.address.toLowerCase() === state.owner.toLowerCase()
                        ? " · current owner"
                        : ""}{" "}
                      — {entry.address}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-xs text-violet-200/70">
                Balance: {eth(current?.balance ?? "0")} ETH · Standing bid:{" "}
                {eth(current?.bid ?? "0")} ETH · Refund:{" "}
                {eth(current?.refund ?? "0")} ETH. These are unlocked local test
                accounts; no wallet connection is needed.
              </p>
            </section>

            <Section title="1. Place and manage bids">
              {cards(["bid", "cancelBid"])}
            </Section>
            <Section title="2. Advance time and run a draw">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-lg border border-violet-400/20 p-4">
                  <h3>Block time</h3>
                  <p className="text-sm text-violet-200/70">
                    Move the fork clock forward and mine a block. This does not
                    automatically start or settle a draw.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={buttonClass}
                      disabled={!!busy}
                      onClick={() => void run({ action: "cutoff" }, "cutoff")}
                    >
                      Advance to next cutoff
                    </button>
                    <button
                      className={buttonClass}
                      disabled={!!busy}
                      onClick={() =>
                        void run(
                          { action: "advance", seconds: 7 * 86400 + 1 },
                          "7 days",
                        )
                      }
                    >
                      Advance 7 days + 1 second
                    </button>
                  </div>
                  <label className="block text-xs text-violet-200/80">
                    Custom seconds
                    <input
                      aria-label="Seconds to advance"
                      className={`${inputClass} mt-1`}
                      value={seconds}
                      onChange={(event) => setSeconds(event.target.value)}
                      inputMode="numeric"
                    />
                  </label>
                  <button
                    className={buttonClass}
                    disabled={!!busy}
                    onClick={() =>
                      void run(
                        { action: "advance", seconds: Number(seconds) },
                        "advance",
                      )
                    }
                  >
                    Advance block time
                  </button>
                </div>
                <div className="space-y-3 rounded-lg border border-violet-400/20 p-4">
                  <h3>Mock VRF callback</h3>
                  <p className="text-sm text-violet-200/70">
                    Calls rawFulfillRandomWords(requestId, [mainWord,
                    bonusWord]) as the coordinator. An even bonus word awards a
                    box if eligible stock exists; odd means no box. This
                    bypasses the oracle proof and billing.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {words.map((word, index) => (
                      <label className="text-xs text-violet-200/80" key={index}>
                        {index === 0 ? "Main word" : "Bonus word"}
                        <input
                          aria-label={
                            index === 0
                              ? "Main random word"
                              : "Bonus random word"
                          }
                          className={`${inputClass} mt-1`}
                          value={word}
                          onChange={(event) =>
                            setWords((previous) =>
                              index === 0
                                ? [event.target.value, previous[1]]
                                : [previous[0], event.target.value],
                            )
                          }
                          inputMode="numeric"
                        />
                      </label>
                    ))}
                  </div>
                  <label className="block text-xs text-violet-200/80">
                    Request ID (blank = current pending draw)
                    <input
                      aria-label="VRF request ID"
                      className={`${inputClass} mt-1`}
                      value={requestId}
                      onChange={(event) => setRequestId(event.target.value)}
                      placeholder={pending?.requestId ?? "Start a draw first"}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={buttonClass}
                      disabled={!!busy}
                      onClick={() => {
                        const values = crypto.getRandomValues(
                          new Uint32Array(2),
                        );
                        setWords([String(values[0]), String(values[1])]);
                      }}
                    >
                      Generate random values
                    </button>
                    <button
                      className={buttonClass}
                      disabled={!!busy}
                      onClick={() =>
                        void run(
                          {
                            action: "fulfill",
                            words,
                            ...(requestId ? { requestId } : {}),
                          },
                          "VRF callback",
                        )
                      }
                    >
                      Callback with VRF
                    </button>
                  </div>
                </div>
              </div>
              {cards(["startDailyDraw", "finalizeDraw"])}
            </Section>
            <Section title="3. Claim prizes and withdraw ETH">
              {cards([
                "claimNFT",
                "claimBonus",
                "withdrawProceeds",
                "withdrawRefund",
              ])}
            </Section>
            <Section title="Draw history">
              <div className="overflow-x-auto rounded-lg border border-violet-400/20">
                <table className="w-full text-left text-xs">
                  <thead className="bg-violet-500/10 text-violet-200">
                    <tr>
                      {[
                        "Draw",
                        "Status",
                        "Winner / price",
                        "Main prize",
                        "Bonus",
                      ].map((label) => (
                        <th key={label} className="p-3">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.draws.length ? (
                      state.draws.map((draw) => (
                        <tr
                          className="border-t border-violet-400/10"
                          key={draw.id}
                        >
                          <td className="p-3">#{draw.id}</td>
                          <td className="p-3">{statuses[draw.status]}</td>
                          <td className="p-3" title={draw.winner}>
                            {short(draw.winner)}
                            <br />
                            {eth(draw.price)} ETH
                          </td>
                          <td className="p-3">
                            {draw.status === 3
                              ? `${collectionName(draw.collection)} #${draw.tokenId} · ${draw.claimed ? "claimed" : "unclaimed"}`
                              : "—"}
                          </td>
                          <td className="p-3">
                            {draw.bonusAwarded
                              ? `Box #${draw.boxTokenId} · ${draw.bonusClaimed ? "claimed" : "unclaimed"}`
                              : "—"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-violet-200/60">
                          No draws yet. Place a bid and advance to the cutoff.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-violet-300/60">
                Latest 20 draws. Use getDraw(drawId) below to inspect any older
                draw or its complete request details.
              </p>
            </Section>
            <Section title="Inventory and donation tests">
              <details className="rounded-lg border border-violet-400/20 p-4">
                <summary className="cursor-pointer text-sm">
                  Browse all available NFTs (
                  {Number(state.prizeCount) + Number(state.boxCount)})
                </summary>
                <div className="mt-3 max-h-64 overflow-auto text-xs leading-6">
                  {state.inventory.map((asset, i) => (
                    <p key={`${asset.collection}-${asset.tokenId}`}>
                      [{i}] {collectionName(asset.collection)} #{asset.tokenId}
                    </p>
                  ))}
                  {state.boxes.map((id, i) => (
                    <p key={id}>
                      [box {i}] Imp box #{id}
                    </p>
                  ))}
                </div>
              </details>
              <div className="space-y-3 rounded-lg border border-violet-400/20 p-4">
                <p className="text-sm text-violet-200/70">
                  Return a claimed or recovered NFT from the selected account. A
                  plain transfer lets you test syncReceivedNFT(); a safe
                  transfer tests onERC721Received().
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs">
                    Collection
                    <select
                      aria-label="Donation collection"
                      className={`${inputClass} mt-1`}
                      value={donationCollection}
                      onChange={(event) =>
                        setDonationCollection(event.target.value as Address)
                      }
                    >
                      {Object.entries(COLLECTIONS).map(([name, address]) => (
                        <option key={address} value={address}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs">
                    Token ID
                    <input
                      aria-label="Donation token ID"
                      className={`${inputClass} mt-1`}
                      value={donationId}
                      onChange={(event) => setDonationId(event.target.value)}
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[true, false].map((safe) => (
                    <button
                      key={String(safe)}
                      className={buttonClass}
                      disabled={!!busy || !donationId}
                      onClick={() =>
                        void run(
                          {
                            action: "donate",
                            account,
                            collection: donationCollection,
                            tokenId: donationId,
                            safe,
                          },
                          safe ? "Safe donation" : "Plain donation",
                        )
                      }
                    >
                      {safe
                        ? "safeTransferFrom() + register"
                        : "transferFrom() without registration"}
                    </button>
                  ))}
                </div>
              </div>
              {cards(["syncReceivedNFT"])}
            </Section>
            <Section title="Recovery and ownership">
              <p className="break-all text-xs text-violet-200/70">
                Current owner: {state.owner}
                <br />
                Pending owner: {state.pendingOwner}
              </p>
              {cards([
                "shutdownStalledAuction",
                "recoverUnsoldNFT",
                "transferOwnership",
                "acceptOwnership",
                "renounceOwnership",
              ])}
              <button
                className={`${buttonClass} border-amber-300/40 text-amber-100`}
                disabled={!!busy}
                onClick={() => void run({ action: "reset" }, "reset")}
              >
                Reset to seeded deployment
              </button>
              <p className="text-xs text-violet-200/60">
                Reset restores the original owner, NFT pool, subscription and
                empty bid book. It clears all test transactions since setup.
              </p>
            </Section>
            <details className="space-y-4 rounded-lg border border-violet-400/20 p-4">
              <summary className="cursor-pointer text-lg text-violet-200">
                All read functions and direct callback tests
              </summary>
              <p className="text-sm text-violet-200/70">
                Reads return their full result below. Callback calls from an
                ordinary account are useful for testing access restrictions.
                Contract rules remain enforced on every button.
              </p>
              {cards(
                functions
                  .filter(
                    (fn) =>
                      ["view", "pure"].includes(fn.stateMutability) ||
                      fn.name === "rawFulfillRandomWords" ||
                      fn.name === "onERC721Received",
                  )
                  .map((fn) => fn.name),
              )}
            </details>
            <details className="rounded-lg border border-violet-400/20 p-4">
              <summary className="cursor-pointer text-sm">
                Full state and ETH accounting
              </summary>
              <p className="mt-3 text-xs">
                Contract balance {eth(state.balance)} ETH = bids{" "}
                {eth(state.totalBidEscrow)} + pending payments{" "}
                {eth(state.pendingPayments)} + proceeds {eth(state.proceeds)} +
                refunds {eth(state.totalRefunds)}.
              </p>
              <pre className="mt-4 max-h-96 overflow-auto text-xs">
                {JSON.stringify(state, null, 2)}
              </pre>
            </details>
          </>
        )}
        <section
          id="prison-results"
          aria-label="Call results"
          className="space-y-3"
        >
          <h2 className="text-xl text-violet-200">Call results</h2>
          <div
            role="status"
            aria-live="polite"
            className="text-sm text-violet-200/80"
          >
            {busy
              ? `Running ${busy}…`
              : results[0]
                ? `${results[0].label} completed. State refreshed.`
                : "Transactions and read results will appear here."}
          </div>
          {results.map((result, index) => (
            <details
              key={`${results.length}-${index}`}
              open={index === 0}
              className="rounded-lg border border-violet-400/20 p-4"
            >
              <summary className="cursor-pointer text-sm">
                {result.label}
              </summary>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap break-all text-xs text-violet-200/80">
                {result.body}
              </pre>
            </details>
          ))}
        </section>
        {busy ? (
          <div
            role="status"
            className="fixed right-4 bottom-4 z-50 rounded-lg border border-violet-300/40 bg-[#211335] px-5 py-3 text-sm shadow-xl"
          >
            Running {busy}…
          </div>
        ) : error ? (
          <div className="fixed right-4 bottom-4 left-4 z-50 rounded-lg border border-red-400/40 bg-[#301422] px-4 py-3 text-sm text-red-100 sm:left-auto sm:max-w-sm">
            <p className="break-words">{error.slice(0, 180)}</p>
            <a className="mt-1 block underline" href="#prison-error">
              View full error
            </a>
          </div>
        ) : results[0] ? (
          <a
            href="#prison-results"
            className="fixed right-4 bottom-4 z-50 max-w-[calc(100%-2rem)] rounded-lg border border-emerald-300/40 bg-[#14291e] px-4 py-3 text-sm text-emerald-100"
          >
            {results[0].label} completed · View result
          </a>
        ) : null}
      </div>
    </div>
  );
};
