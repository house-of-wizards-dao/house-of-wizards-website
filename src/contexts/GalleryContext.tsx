"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ViewMode = "flat" | "grouped";

interface GalleryContextValue {
  // Wallet management
  walletInputs: string[];
  setWalletInputs: (wallets: string[]) => void;
  
  // Collection filtering
  enabledCollections: Set<string>;
  setEnabledCollections: (collections: Set<string>) => void;
  
  // Display options
  imagesOnly: boolean;
  setImagesOnly: (imagesOnly: boolean) => void;
  imageSize: number; // pixel size (e.g., 100-300px)
  setImageSize: (size: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showCollectionTitles: boolean;
  setShowCollectionTitles: (show: boolean) => void;
}

const GalleryContext = createContext<GalleryContextValue | undefined>(undefined);

interface GalleryProviderProps {
  children: ReactNode;
  initialWalletInputs?: string[];
  initialEnabledCollections?: Set<string>;
}

export function GalleryProvider({
  children,
  initialWalletInputs = [],
  initialEnabledCollections,
}: GalleryProviderProps) {
  const [walletInputs, setWalletInputs] = useState<string[]>(initialWalletInputs);
  const [enabledCollections, setEnabledCollections] = useState<Set<string>>(
    initialEnabledCollections || new Set()
  );
  const [imagesOnly, setImagesOnly] = useState(false);
  const [imageSize, setImageSize] = useState(200); // Default 200px
  const [viewMode, setViewMode] = useState<ViewMode>("flat");
  const [showCollectionTitles, setShowCollectionTitles] = useState(true);

  return (
    <GalleryContext.Provider
      value={{
        walletInputs,
        setWalletInputs,
        enabledCollections,
        setEnabledCollections,
        imagesOnly,
        setImagesOnly,
        imageSize,
        setImageSize,
        viewMode,
        setViewMode,
        showCollectionTitles,
        setShowCollectionTitles,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return context;
}

