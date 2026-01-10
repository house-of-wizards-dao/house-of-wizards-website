"use client";

import { frwcAddresses } from "@/config/addresses";
import { useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useMemo,
} from "react";

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

const GalleryContext = createContext<GalleryContextValue | undefined>(
  undefined
);

export function GalleryProvider({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();

  // Get wallets from query params (can be addresses or ENS names)
  const initialWalletInputs = useMemo(() => {
    const wallets = searchParams.getAll("wallets");
    return wallets.map((addr) => addr.trim()).filter((addr) => addr.length > 0);
  }, [searchParams]);

  // Initialize enabled collections (all enabled by default)
  const initialEnabledCollections = useMemo(() => {
    return new Set(
      Object.values(frwcAddresses).map((addr) => addr.toLowerCase())
    );
  }, []);

  const [walletInputs, setWalletInputs] =
    useState<string[]>(initialWalletInputs);
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
