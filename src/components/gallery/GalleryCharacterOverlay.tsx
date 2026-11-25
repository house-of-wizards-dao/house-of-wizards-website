"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId } from "react";
import { TraitRarityChip } from "@/components/characters/TraitRarityChip";
import { getLocalCharacterImageUrl } from "@/lib/character-image";
import { localCharacterCollection } from "@/lib/local-character-contract";
import type { LocalGalleryNFT } from "@/types/gallery";

type GalleryCharacterOverlayProps = {
  nft: LocalGalleryNFT;
  onClose: () => void;
};

const formatAttunement = (attunement: number) => `${attunement}%`;

export const GalleryCharacterOverlay = ({
  nft,
  onClose,
}: GalleryCharacterOverlayProps) => {
  const titleId = useId();
  const { traits, affinity } = nft.character;
  const collection = localCharacterCollection(nft.contract);
  const imageUrl = collection
    ? getLocalCharacterImageUrl(collection, nft.identifier)
    : nft.image_url;
  const title = nft.name || `#${nft.identifier}`;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close character details"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative mx-4 flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-gray-800 bg-[#0C0B10]"
      >
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 id={titleId} className="text-xl font-bold text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
            <div>
              {imageUrl && (
                <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
                  <Image
                    src={imageUrl}
                    alt={title}
                    width={320}
                    height={320}
                    className="h-auto w-full [image-rendering:pixelated]"
                    unoptimized
                  />
                </div>
              )}
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <Link
                  href={`/characters/${nft.contract}/${nft.identifier}`}
                  className="text-brand-500 hover:text-white"
                >
                  View character
                </Link>
                <a
                  href={nft.opensea_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  View on OpenSea
                </a>
              </div>
              {affinity && (
                <section className="mt-6">
                  <h3 className="mb-3 text-xl font-semibold">Affinity</h3>
                  <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <h4 className="text-base font-semibold text-white">
                      {affinity.affinityName}
                    </h4>
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">Attunement</span>
                        <span className="font-medium text-gray-200">
                          {formatAttunement(affinity.attunement)}
                        </span>
                      </p>
                      <p className="flex items-center justify-between gap-3">
                        <span className="text-gray-500">Traits</span>
                        <span className="font-medium text-gray-200">
                          {affinity.traitsInAffinity}/{affinity.numberOfTraits}
                        </span>
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <section>
              <h3 className="mb-3 text-xl font-semibold">Traits</h3>
              {traits.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {traits.map((trait) => (
                    <div
                      key={`${trait.partKey}-${trait.traitId}`}
                      className="rounded-lg border border-gray-700 bg-gray-800 p-4"
                    >
                      <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">
                        {trait.part}
                      </p>
                      <h4 className="text-lg font-semibold text-white">
                        {trait.displayName}
                      </h4>
                      <TraitRarityChip
                        count={trait.count}
                        total={trait.total}
                        className="mt-3"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No traits.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
