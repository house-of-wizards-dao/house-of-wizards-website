"use client";

import { useState } from "react";
import Link from "next/link";
import { useBurnStats } from "@/hooks/useBurnStats";
import { ViewSelector, type BurnView } from "@/components/burns/ViewSelector";
import { WizardsView } from "@/components/burns/WizardsView";
import { TraitsView } from "@/components/burns/TraitsView";

export default function BurnsPage() {
  const { data, loading, error } = useBurnStats();
  const [currentView, setCurrentView] = useState<BurnView>("wizards");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <h1 className="sm:text-7xl text-6xl font-atirose text-brand-500">
          Error loading burn statistics
        </h1>
        <p className="text-gray-400">{error?.message || "Unknown error"}</p>
        <Link href="/" className="text-brand-500 hover:text-brand-400 underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 max-w-8xl">
      <h1 className="sm:text-7xl text-6xl font-atirose text-brand-500">
        The Great Burning
      </h1>

      <ViewSelector currentView={currentView} onViewChange={setCurrentView} />

      {currentView === "wizards" ? (
        <WizardsView data={data} />
      ) : (
        <TraitsView data={data} />
      )}
    </div>
  );
}

