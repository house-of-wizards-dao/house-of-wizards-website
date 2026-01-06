"use client";

import { useRouter } from "next/navigation";
import WizardBrowser from "@/components/WizardBrowser";

export default function BackpackPage() {
  const router = useRouter();

  const handleWizardClick = (wizardId: number) => {
    router.push(`/backpack/${wizardId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Forgotten Runes Wizards' Backpack
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
        <WizardBrowser onClick={handleWizardClick} />
      </div>
    </div>
  );
}
