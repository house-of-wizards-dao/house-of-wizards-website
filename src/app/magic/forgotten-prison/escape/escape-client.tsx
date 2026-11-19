"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccount } from "@wagmi/core";
import { useAccount, useConfig, useSwitchChain, useWriteContract } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import type { Address, Hex } from "viem";
import { Web3Provider } from "@/components/Web3Provider";
import { prisonAbi } from "@/lib/forgotten-prison/abi";
import {
  bidderError,
  createBidderClient,
  readMyPrizes,
  waitForBidderReceipt,
  type PrisonTarget,
  type PrizeDraw,
} from "@/lib/forgotten-prison/bidding";
import {
  characterFamily,
  claimsComplete,
  claimWinnings,
  pendingClaims,
  type EscapeCharacter,
} from "@/lib/forgotten-prison/escape";
import { usePrisonIndex } from "../indexed-auction";
import { CharacterPreview } from "../prize-pool";
import { CharacterSelector } from "./character-selector";
import PrisonGame from "./prison-game";

const primary =
  "rounded-xl bg-amber-200 px-6 py-3.5 text-sm font-semibold text-[#251a20] transition hover:bg-amber-100 disabled:cursor-wait disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200";

const RevealedPrize = ({
  target,
  draw,
}: {
  target: PrisonTarget;
  draw: PrizeDraw;
}) => {
  const index = usePrisonIndex(target);
  const metadata = index.data?.prizes.find(
    (prize) =>
      prize.collection.toLowerCase() === draw.collection.toLowerCase() &&
      prize.tokenId === String(draw.tokenId),
  );
  return (
    <section
      className="mt-6 rounded-xl border border-emerald-300/30 bg-emerald-300/5 p-5"
      aria-labelledby="rescued-prisoner"
    >
      <p className="text-xs uppercase tracking-widest text-emerald-200/70">
        02 / The escape
      </p>
      <h2 id="rescued-prisoner" className="mb-4 mt-2 text-2xl font-semibold">
        Someone owes you their freedom.
      </h2>
      <CharacterPreview
        collection={draw.collection}
        tokenId={String(draw.tokenId)}
        prize={metadata}
      />
      <p className="mt-4 text-sm leading-6 text-violet-200/70">
        Your prisoner is safely in your wallet.
        {draw.bonusAwarded
          ? ` Stank slipped you Imp Box #${draw.boxTokenId}, too.`
          : " No Imp Box was awarded this round."}
      </p>
      <Link
        href="/magic/forgotten-prison#your-prison"
        className="mt-5 inline-block text-sm text-violet-300 underline underline-offset-4"
      >
        Return to your bids & prizes →
      </Link>
    </section>
  );
};

const EscapeSession = ({
  target,
  drawId,
  address,
}: {
  target: PrisonTarget | null;
  drawId?: string;
  address?: Address;
}) => {
  const { openConnectModal } = useConnectModal();
  const config = useConfig();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const cache = useQueryClient();
  const client = useMemo(
    () => (target ? createBidderClient(target) : null),
    [target],
  );
  const [character, setCharacter] = useState<EscapeCharacter | null>(null);
  const [arrived, setArrived] = useState(false);
  const [round, setRound] = useState(drawId);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PrizeDraw | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [hash, setHash] = useState<Hex | null>(null);
  const lock = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const wins = useQuery({
    queryKey: ["prison-escape-wins", target?.chainId, target?.address, address],
    enabled: !!client && !!target && !!address,
    queryFn: async () => {
      if (!client || !target || !address) return [];
      const count = await client.readContract({
        address: target.address,
        abi: prisonAbi,
        functionName: "drawCount",
      });
      return readMyPrizes(client, target, address, count);
    },
    refetchInterval: 30_000,
    retry: 1,
  });
  const activeId = round ?? wins.data?.[0]?.id.toString();
  const drawQuery = useQuery({
    queryKey: [
      "prison-escape-draw",
      target?.chainId,
      target?.address,
      address,
      activeId,
    ],
    enabled: !!client && !!target && !!activeId && !!address,
    queryFn: async () => {
      if (!client || !target || !activeId) return null;
      return {
        ...(await client.readContract({
          address: target.address,
          abi: prisonAbi,
          functionName: "getDraw",
          args: [BigInt(activeId)],
        })),
        id: BigInt(activeId),
      };
    },
    refetchInterval: progress ? false : 15_000,
    retry: 1,
  });
  const draw = drawQuery.data;
  const winner =
    !!address && draw?.winner.toLowerCase() === address.toLowerCase();
  const release = useMemo(
    () =>
      result
        ? {
            character: {
              family: characterFamily(result.collection) ?? "warriors",
              tokenId: String(result.tokenId),
              name: "Your rescued prisoner",
            },
            bonus: result.bonusAwarded,
          }
        : null,
    [result],
  );

  const claim = async () => {
    if (lock.current) return;
    if (!address) {
      openConnectModal?.();
      return;
    }
    if (!target || !client || !draw || !winner) return;
    const id = draw.id;
    const storageKey = `prison-claim:${target.chainId}:${target.address.toLowerCase()}:${address.toLowerCase()}:${id}`;
    const remember = (value: Hex | null) => {
      try {
        if (value) localStorage.setItem(storageKey, value);
        else localStorage.removeItem(storageKey);
      } catch {
        /* Private browsing may disable storage. */
      }
    };
    const assertAccount = () => {
      const current = getAccount(config);
      if (
        !alive.current ||
        current.address?.toLowerCase() !== address.toLowerCase() ||
        current.chainId !== target.chainId
      )
        throw new Error(
          "Your wallet or network changed. Reopen this round with the winning wallet to continue.",
        );
    };
    const read = async () => ({
      ...(await client.readContract({
        address: target.address,
        abi: prisonAbi,
        functionName: "getDraw",
        args: [id],
      })),
      id,
    });
    const confirm = async (sent: Hex) => {
      let currentHash = sent;
      setHash(sent);
      try {
        await waitForBidderReceipt(client, sent, (replacement) => {
          currentHash = replacement;
          remember(replacement);
          setHash(replacement);
        });
        remember(null);
      } catch (cause) {
        // Retain an unconfirmed hash across reloads. A mined failure/cancellation
        // is safe to clear; the next attempt still re-reads both claim flags.
        try {
          await client.getTransactionReceipt({ hash: currentHash });
          remember(null);
        } catch {
          /* Still pending. */
        }
        throw cause;
      }
    };
    lock.current = true;
    setError("");
    setRound(String(id));
    try {
      if (getAccount(config).chainId !== target.chainId) {
        setProgress("Switching to the auction network…");
        await switchChainAsync({ chainId: target.chainId });
        assertAccount();
      }
      let previous: string | null = null;
      try {
        previous = localStorage.getItem(storageKey);
      } catch {
        /* Storage unavailable. */
      }
      if (previous && /^0x[\da-fA-F]{64}$/.test(previous)) {
        setProgress("Checking your previously submitted claim…");
        await confirm(previous as Hex);
      }
      await claimWinnings({
        account: address,
        read,
        assertAccount,
        submitAndConfirm: async (functionName) => {
          assertAccount();
          setProgress(
            functionName === "claimNFT"
              ? "Confirm the prisoner claim in your wallet…"
              : "Confirm the Imp Box claim in your wallet…",
          );
          const request = {
            address: target.address,
            abi: prisonAbi,
            functionName,
            args: [id, address] as const,
            account: address,
            chainId: target.chainId,
          };
          await client.simulateContract(request);
          assertAccount();
          const sent = await writeContractAsync(request);
          remember(sent);
          setProgress(
            functionName === "claimNFT"
              ? "Waiting for your prisoner’s transfer…"
              : "Waiting for your Imp Box transfer…",
          );
          await confirm(sent);
        },
      });
      const confirmed = await read();
      assertAccount();
      setResult(confirmed);
      setProgress(null);
      void cache.invalidateQueries({ queryKey: ["prison-bidder"] });
      void cache.invalidateQueries({ queryKey: ["prison-escape-wins"] });
      void cache.invalidateQueries({ queryKey: ["wallet-nfts"] });
      void drawQuery.refetch();
    } catch (cause) {
      if (alive.current) {
        setError(bidderError(cause));
        void drawQuery.refetch();
      }
    } finally {
      lock.current = false;
      if (alive.current) setProgress(null);
    }
  };
  return (
    <>
      {!character ? (
        <CharacterSelector
          address={address}
          onSelect={setCharacter}
          onConnect={() => openConnectModal?.()}
        />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-violet-300/20 bg-[#171022]">
          <PrisonGame
            character={character}
            release={release}
            onArrive={() => setArrived(true)}
            onRevealed={() => setRevealed(true)}
          />
          <div className="p-5 font-sans sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-widest text-amber-200/65">
                Stank Death of the Dread Tower
              </p>
              {!progress && !result ? (
                <button
                  className="text-xs text-violet-300 underline underline-offset-4"
                  onClick={() => {
                    setCharacter(null);
                    setArrived(false);
                  }}
                >
                  Change visitor
                </button>
              ) : null}
            </div>
            <p className="mt-4 max-w-2xl text-xl leading-8 text-violet-100">
              {result
                ? "“Fine. A deal’s a deal. Take them and get out before I change my mind.”"
                : arrived
                  ? "“Oh, trying to free someone from the Forgotten Prison?”"
                  : "The Dread Tower looms ahead. A goblin watches you approach."}
            </p>
            {arrived && !result ? (
              <>
                {!address ? (
                  <div className="mt-5">
                    <p className="mb-4 text-sm leading-6 text-violet-200/65">
                      “I don’t open the gate for just anyone. Show me the wallet
                      that won.”
                    </p>
                    <button
                      className={primary}
                      onClick={() => openConnectModal?.()}
                    >
                      Connect winning wallet
                    </button>
                  </div>
                ) : !target ? (
                  <p className="mt-5 text-sm text-violet-200/65">
                    The auction is not available yet. You can visit Stank, but
                    there are no claims to make.
                  </p>
                ) : wins.isError || drawQuery.isError ? (
                  <div role="alert" className="mt-5 text-sm text-amber-200">
                    Couldn’t check your winnings.{" "}
                    <button
                      className="underline"
                      onClick={() => {
                        void wins.refetch();
                        void drawQuery.refetch();
                      }}
                    >
                      Try again
                    </button>
                  </div>
                ) : wins.isPending || (activeId && drawQuery.isPending) ? (
                  <p role="status" className="mt-5 text-sm text-violet-200/65">
                    Stank is checking his ledger…
                  </p>
                ) : !draw ? (
                  <div className="mt-5">
                    <p className="text-sm leading-6 text-violet-200/65">
                      “No winning bribe in your name. Come back when you’ve won
                      a daily auction.”
                    </p>
                    <Link
                      className="mt-4 inline-block text-violet-300 underline"
                      href="/magic/forgotten-prison"
                    >
                      Place a bid →
                    </Link>
                  </div>
                ) : !winner ? (
                  <p className="mt-5 text-sm text-amber-200">
                    This round belongs to another wallet. Connect the wallet
                    that won to collect it.
                  </p>
                ) : draw.status !== 3 ? (
                  <p className="mt-5 text-sm text-violet-200/65">
                    This round is not ready to claim. Return after the draw is
                    settled.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {wins.data && wins.data.length > 1 && !progress ? (
                      <label className="block text-sm text-violet-200">
                        Choose a winning round
                        <select
                          className="ml-3 rounded-lg border border-violet-300/30 bg-[#21162e] p-2"
                          value={activeId}
                          onChange={(event) => {
                            setRound(event.target.value);
                            setError("");
                          }}
                        >
                          <option value={activeId}>Round #{activeId}</option>
                          {wins.data
                            .filter((win) => String(win.id) !== activeId)
                            .map((win) => (
                              <option
                                key={String(win.id)}
                                value={String(win.id)}
                              >
                                Round #{String(win.id)}
                              </option>
                            ))}
                        </select>
                      </label>
                    ) : (
                      <p className="text-xs text-violet-300">
                        Round #{String(draw.id)}
                      </p>
                    )}
                    <p className="max-w-2xl text-sm leading-6 text-violet-200/70">
                      {claimsComplete(draw)
                        ? "You already paid your dues. The prisoner and any awarded Imp Box have been claimed. Relive the escape without another transaction."
                        : draw.claimed
                          ? "Your prisoner is already safe. Stank still has your Imp Box. Finish collecting it to complete this escape."
                          : "“Your bribe’s already in my pocket. Just sign the release and I’ll look the other way.” Your winning bid already paid Stank. This step only transfers your winnings; you pay the network fee."}
                    </p>
                    {!claimsComplete(draw) &&
                    pendingClaims(draw).length === 2 ? (
                      <p className="text-xs leading-5 text-violet-300/60">
                        One claim flow, two wallet confirmations: your prisoner,
                        then your awarded Imp Box. If interrupted, return here
                        to finish the remaining claim.
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        if (claimsComplete(draw)) setResult(draw);
                        else void claim();
                      }}
                      className={primary}
                      disabled={!!progress}
                    >
                      {progress ??
                        (claimsComplete(draw)
                          ? "Replay the escape"
                          : draw.claimed
                            ? "Finish claiming winnings"
                            : "Pay off Stank & claim winnings")}
                    </button>
                  </div>
                )}
              </>
            ) : null}
            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-amber-300/25 p-4 text-sm leading-6 text-amber-100"
              >
                {error} Any confirmed transfer stays claimed. Return here to
                finish only what remains.
              </p>
            ) : null}
            {hash && target?.chainId === 1 ? (
              <a
                href={`https://etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-xs text-violet-300 underline"
              >
                View latest claim transaction ↗
              </a>
            ) : null}
            {result && target ? (
              revealed ? (
                <RevealedPrize target={target} draw={result} />
              ) : (
                <div className="mt-5">
                  <p role="status" className="text-sm text-emerald-200">
                    Transfers confirmed. The gate is opening…
                  </p>
                  <button
                    className="mt-3 text-xs text-violet-300 underline"
                    onClick={() => setRevealed(true)}
                  >
                    Skip animation and reveal prisoner
                  </button>
                </div>
              )
            ) : null}
          </div>
        </section>
      )}
      <p className="mt-5 max-w-3xl font-sans text-xs leading-5 text-violet-300/50">
        The scene is a presentation of your claim. Your prize was selected by
        the contract’s daily draw, and there is no claim deadline. Walking,
        character choice, and dialogue do not change the result.
      </p>
    </>
  );
};
const WalletEscape = (props: {
  target: PrisonTarget | null;
  drawId?: string;
}) => {
  const { address } = useAccount();
  return (
    <EscapeSession
      key={address?.toLowerCase() ?? "guest"}
      {...props}
      address={address}
    />
  );
};
const EscapeClient = (props: {
  target: PrisonTarget | null;
  drawId?: string;
}) => (
  <Web3Provider synchronizeSession={false} authenticate={false}>
    <WalletEscape {...props} />
  </Web3Provider>
);
export default EscapeClient;
