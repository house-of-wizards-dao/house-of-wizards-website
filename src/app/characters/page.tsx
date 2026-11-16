"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { frwcAddresses } from "@/config/addresses";
const WizardBrowser = dynamic(
  () =>
    import("@/components/browser/WizardBrowser").then(
      (module) => module.WizardBrowser,
    ),
  { loading: () => <Spinner label="Loading characters" /> },
);
const WarriorBrowser = dynamic(
  () =>
    import("@/components/browser/WarriorBrowser").then(
      (module) => module.WarriorBrowser,
    ),
  { loading: () => <Spinner label="Loading characters" /> },
);
const SoulBrowser = dynamic(
  () =>
    import("@/components/browser/SoulBrowser").then(
      (module) => module.SoulBrowser,
    ),
  { loading: () => <Spinner label="Loading characters" /> },
);

type CollectionType = "wizards" | "warriors" | "souls";

const collections: { key: CollectionType; name: string; address: string }[] = [
  { key: "wizards", name: "Wizards", address: frwcAddresses.wizards },
  { key: "warriors", name: "Warriors", address: frwcAddresses.warriors },
  { key: "souls", name: "Souls", address: frwcAddresses.souls },
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
        {selectedCollection === "wizards" && (
          <WizardBrowser onClick={handleCharacterClick} />
        )}
        {selectedCollection === "warriors" && (
          <WarriorBrowser onClick={handleCharacterClick} />
        )}
        {selectedCollection === "souls" && (
          <SoulBrowser onClick={handleCharacterClick} />
        )}
      </div>
    </div>
  );
}
