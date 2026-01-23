"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { frwcAddresses } from "@/config/addresses";
import { WizardBrowser } from "@/components/browser/WizardBrowser";
import { WarriorBrowser } from "@/components/browser/WarriorBrowser";

type CollectionType = "wizards" | "warriors";

const collections: { key: CollectionType; name: string; address: string }[] = [
  { key: "wizards", name: "Wizards", address: frwcAddresses.wizards },
  { key: "warriors", name: "Warriors", address: frwcAddresses.warriors },
];

export default function CharactersPage() {
  const router = useRouter();
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionType>("wizards");

  const currentCollection = collections.find(
    (c) => c.key === selectedCollection,
  )!;

  const handleCharacterClick = (characterId: number) => {
    router.push(`/characters/${currentCollection.address}/${characterId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-row justify-center items-center gap-4 mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          Forgotten Runes
        </h1>
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          {collections.map((collection) => (
            <button
              key={collection.key}
              onClick={() => setSelectedCollection(collection.key)}
              className={`px-4 py-2 text-md md:text-xl font-medium transition-colors ${
                selectedCollection === collection.key
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {collection.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
        {selectedCollection === "wizards" ? (
          <WizardBrowser onClick={handleCharacterClick} />
        ) : (
          <WarriorBrowser onClick={handleCharacterClick} />
        )}
      </div>
    </div>
  );
}
