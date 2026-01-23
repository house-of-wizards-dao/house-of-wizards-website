import { Metadata } from "next";
import { MarketplaceBrowser } from "@/components/marketplace";
import { PageTitle } from "@/components/PageTitle";

export const metadata: Metadata = {
  title: "Marketplace | House of Wizards",
  description:
    "Browse and trade Forgotten Runes characters and items. Buy Wizards, Warriors, Souls, Beasts, and more from the Runiverse.",
  openGraph: {
    title: "Marketplace | House of Wizards",
    description:
      "Browse and trade Forgotten Runes characters and items. Buy Wizards, Warriors, Souls, Beasts, and more from the Runiverse.",
  },
};

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="Marketplace"
        subtitle="Browse and trade Forgotten Runes characters and items"
      />

      <div className="mt-8">
        <MarketplaceBrowser initialCollection="wizards" />
      </div>
    </div>
  );
}
