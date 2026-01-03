"use client";

import { useState } from "react";
import Link from "next/link";
import { useBurnStats } from "@/hooks/useBurnStats";
import { ViewSelector, type BurnView } from "@/components/burns/ViewSelector";
import { WizardsView } from "@/components/burns/WizardsView";
import { SoulsView } from "@/components/burns/SoulsView";
import { TraitsView } from "@/components/burns/TraitsView";
import { PageTitle } from "@/components/PageTitle";
import Image from "next/image";

export default function BurnsPage() {
  const { data, loading, error } = useBurnStats();
  const [currentView, setCurrentView] = useState<BurnView>("wizards");

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 max-w-8xl">
        <PageTitle title="The Great Burning" />
        <Image src="/img/tulip.gif" alt="Loading" width={200} height={200} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <PageTitle title="Error loading burn statistics" />
        <p className="text-gray-400">{error?.message || "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <PageTitle title="The Great Burning" />

      <ViewSelector currentView={currentView} onViewChange={setCurrentView} />

      {currentView === "wizards" ? (
        <WizardsView data={data} />
      ) : currentView === "souls" ? (
        <SoulsView data={data} />
      ) : (
        <TraitsView data={data} />
      )}
    </div>
  );
}

