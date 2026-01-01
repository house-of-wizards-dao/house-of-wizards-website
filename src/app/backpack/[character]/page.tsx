"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useWalletClient } from "wagmi";
import { mainnet } from "viem/chains";
import { TokenboundClient } from "@tokenbound/sdk";
import { addresses } from "@/config/addresses";

interface NFT {
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
}

interface NFTsResponse {
  nfts: NFT[];
  next: string | null;
}

export default function CharacterBackpackPage() {
  const params = useParams();
  const character = params.character as string;

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

  const tbaAccount = useMemo(
    () => ({
      tokenContract: addresses.wizards,
      tokenId: character ?? "",
    }),
    [character],
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Character #{character} Backpack
      </h1>
      {retrievedAccount && (
        <p className="text-gray-400 mb-6">Account: {retrievedAccount}</p>
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
                No NFTs found in this backpack.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-4">
                Found {nfts.length} NFT{nfts.length !== 1 ? "s" : ""}
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
