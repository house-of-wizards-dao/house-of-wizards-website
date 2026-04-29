"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useWalletClient } from "wagmi";
import { mainnet } from "viem/chains";
import { TokenboundClient } from "@tokenbound/sdk";
import { getCollectionName } from "@/data/traitUtilities";
import { warriorsWithTraitsMap } from "@/data/warriorsWithTraitsMap";
import { wizardsWithTraitsMap } from "@/data/wizardsWithTraitsMap";
import {
  warriorTraits,
  type Trait as WarriorTrait,
} from "@/data/warriorTraits";
import { wizardTraits, type Trait as WizardTrait } from "@/data/wizardTraits";
import { getCharacterName } from "@/data/traitUtilities";

type NFT = {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
};

type NFTsResponse = {
  nfts: NFT[];
  next: string | null;
};

type CharacterTrait = {
  part: string;
  displayName: string;
  description?: string;
};

type LoreEntry = {
  content?: string;
};

type LoreResponse = {
  entries?: LoreEntry[];
};

const emptyTraitId = 7777;
const wizardDisplayParts = [
  "head",
  "body",
  "prop",
  "familiar",
  "rune",
] as const;
const warriorDisplayParts = [
  "head",
  "body",
  "weapon",
  "shield",
  "companion",
  "rune",
] as const;
const warriorTraitsById = new Map<number, WarriorTrait>(
  warriorTraits.map((trait) => [trait.idx, trait]),
);
const wizardTraitsById = new Map<number, WizardTrait>(
  wizardTraits.map((trait) => [trait.idx, trait]),
);

const formatTraitPart = (part: string) =>
  part === "companion"
    ? "Familiar"
    : part.charAt(0).toUpperCase() + part.slice(1);

const getDescriptionPreview = (description: string) =>
  description.length > 100
    ? `${description.slice(0, 100).trimEnd()}...`
    : description;

const getMarkdownPreview = (content: string) =>
  content.length > 800 ? `${content.slice(0, 800).trimEnd()}...` : content;

const getLoreCollectionPath = (collectionName: string) => {
  if (collectionName === "Wizards") return "wizards";
  if (collectionName === "Warriors") return "warriors";
  return null;
};

const getCharacterImageUrl = (collectionName: string, tokenId: string) => {
  if (collectionName === "Wizards") {
    return `https://nfts.forgottenrunes.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/${tokenId}.png`;
  }

  if (collectionName === "Warriors") {
    return `https://portal.forgottenrunes.com/api/warriors/img/${tokenId}.png`;
  }

  return null;
};

const getCharacterTraits = (
  collectionName: string,
  tokenId: string,
): CharacterTrait[] => {
  if (collectionName === "Warriors") {
    const warrior = warriorsWithTraitsMap[tokenId];
    if (!warrior) return [];

    return warriorDisplayParts.flatMap((part) => {
      const traitId = warrior[part];
      const trait = warriorTraitsById.get(traitId);
      if (traitId === emptyTraitId || !trait) return [];

      return [
        {
          part: formatTraitPart(part),
          displayName: trait.displayName,
          description: trait.description,
        },
      ];
    });
  }

  if (collectionName === "Wizards") {
    const wizard = wizardsWithTraitsMap[tokenId];
    if (!wizard) return [];

    return wizardDisplayParts.flatMap((part) => {
      const traitId = wizard[part];
      const trait = wizardTraitsById.get(traitId);
      if (traitId === emptyTraitId || !trait) return [];

      return [
        {
          part: formatTraitPart(part),
          displayName: trait.displayName,
          description: trait.description,
        },
      ];
    });
  }

  return [];
};

export default function CharacterBackpackPage() {
  const params = useParams();
  const contract = params.contract as string;
  const tokenId = params.character as string;
  const collectionName = getCollectionName(contract);
  const loreCollectionPath = getLoreCollectionPath(collectionName);
  const characterName = getCharacterName(contract, tokenId);
  const characterImageUrl = getCharacterImageUrl(collectionName, tokenId);
  const loreUrl = loreCollectionPath
    ? `https://forgottenrunes.com/lore/${loreCollectionPath}/${tokenId}`
    : null;
  const characterTraits = useMemo(
    () => getCharacterTraits(collectionName, tokenId),
    [collectionName, tokenId],
  );

  const { data: walletClient } = useWalletClient();
  const tokenboundClient = useMemo(
    () =>
      new TokenboundClient({
        walletClient,
        chainId: mainnet.id,
      }),
    [walletClient],
  );

  const [retrievedAccount, setRetrievedAccount] = useState<string>();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [nftsError, setNftsError] = useState<string | null>(null);
  const [loreEntries, setLoreEntries] = useState<LoreEntry[]>([]);
  const [isLoadingLore, setIsLoadingLore] = useState(false);
  const [loreError, setLoreError] = useState<string | null>(null);

  const tbaAccount = useMemo(
    () => ({
      tokenContract: contract as `0x${string}`,
      tokenId,
    }),
    [contract, tokenId],
  );

  useEffect(() => {
    if (walletClient && retrievedAccount == null) {
      const call = async () => {
        const account = tokenboundClient.getAccount(tbaAccount);
        setRetrievedAccount(account);
      };
      call();
    }
  }, [walletClient, retrievedAccount, tbaAccount, tokenboundClient]);

  useEffect(() => {
    if (!retrievedAccount) return;

    const fetchNFTs = async () => {
      setIsLoadingNFTs(true);
      setNftsError(null);
      try {
        const response = await fetch(
          `/api/nfts?address=${retrievedAccount}&limit=50`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
        }
        const data: NFTsResponse = await response.json();
        setNfts(data.nfts || []);
      } catch (error) {
        setNftsError(
          error instanceof Error ? error.message : "Failed to fetch NFTs",
        );
      } finally {
        setIsLoadingNFTs(false);
      }
    };

    fetchNFTs();
  }, [retrievedAccount]);

  useEffect(() => {
    if (!loreCollectionPath) return;

    const fetchLore = async () => {
      setIsLoadingLore(true);
      setLoreError(null);
      try {
        const response = await fetch(
          `https://www.forgottenrunes.com/api/lore/${loreCollectionPath}/${tokenId}.json`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch lore: ${response.statusText}`);
        }
        const data: LoreResponse = await response.json();
        setLoreEntries(
          data.entries?.filter((entry) => entry.content?.trim()) ?? [],
        );
      } catch (error) {
        setLoreError(
          error instanceof Error ? error.message : "Failed to fetch lore",
        );
        setLoreEntries([]);
      } finally {
        setIsLoadingLore(false);
      }
    };

    fetchLore();
  }, [loreCollectionPath, tokenId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{characterName}</h1>
      {(characterImageUrl || characterTraits.length > 0) && (
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start">
          {characterImageUrl && (
            <div className="w-80 max-w-full shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
              <Image
                src={characterImageUrl}
                alt={characterName}
                width={320}
                height={320}
                className="h-auto w-full [image-rendering:pixelated]"
                unoptimized
                priority
              />
            </div>
          )}

          {characterTraits.length > 0 && (
            <section className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold mb-3">Traits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {characterTraits.map((trait) => (
                  <div
                    key={`${trait.part}-${trait.displayName}`}
                    className="bg-gray-800 border border-gray-700 rounded-md p-3"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
                      {trait.part}
                    </p>
                    <h3 className="text-sm font-semibold text-white">
                      {trait.displayName}
                    </h3>
                    {trait.description && (
                      <div className="relative group mt-1">
                        <p className="text-xs text-gray-400 cursor-help">
                          {getDescriptionPreview(trait.description)}
                        </p>
                        <div className="hidden group-hover:block absolute left-0 top-full z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-md border border-gray-600 bg-gray-950 p-3 text-xs leading-relaxed text-gray-200 shadow-xl">
                          {trait.description}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {loreCollectionPath && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Lore</h2>
          {isLoadingLore && (
            <p className="text-sm text-gray-400">Loading lore...</p>
          )}
          {loreError && (
            <p className="text-sm text-red-400">Error: {loreError}</p>
          )}
          {!isLoadingLore && !loreError && loreEntries.length > 0 && (
            <div className="rounded-md border border-gray-700 bg-gray-800 p-4 text-sm text-gray-300">
              <ReactMarkdown>
                {getMarkdownPreview(loreEntries[0]?.content ?? "")}
              </ReactMarkdown>
            </div>
          )}
          {!isLoadingLore && !loreError && loreEntries.length === 0 && (
            <p className="text-sm text-gray-400">No lore entries found.</p>
          )}
          {loreUrl && (
            <a
              href={loreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300"
            >
              Read the full lore →
            </a>
          )}
        </section>
      )}

      {isLoadingNFTs && (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading NFTs...</p>
        </div>
      )}

      {nftsError && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">Error: {nftsError}</p>
        </div>
      )}

      {!isLoadingNFTs && !nftsError && (
        <>
          {nfts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {`No NFTs found in backpack: ${retrievedAccount}`}
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-4">
                {retrievedAccount && `Backpack: ${retrievedAccount}`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nfts.map((nft) => (
                  <div
                    key={`${nft.contract}-${nft.identifier}`}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    {nft.image_url && (
                      <div className="relative w-full aspect-square">
                        <Image
                          src={nft.image_url}
                          alt={nft.name || `NFT #${nft.identifier}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1 truncate">
                        {nft.name || `#${nft.identifier}`}
                      </h3>
                      {nft.collection && (
                        <p className="text-sm text-gray-400 truncate">
                          {nft.collection}
                        </p>
                      )}
                      {nft.opensea_url && (
                        <a
                          href={nft.opensea_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                        >
                          View on OpenSea →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
