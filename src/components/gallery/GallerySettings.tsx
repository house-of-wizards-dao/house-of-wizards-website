"use client";

import { useState, useRef, useEffect } from "react";
import { frwcAddresses } from "@/config/addresses";
import { isAddress, isENSName } from "@/lib/ens";
import { useGallery } from "@/contexts/GalleryContext";

type GallerySettingsProps = {
  // No props needed - uses context
};

export const GallerySettings = ({}: GallerySettingsProps) => {
  const {
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
  } = useGallery();
  const [isOpen, setIsOpen] = useState(false);
  const [newWallet, setNewWallet] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAddWallet = () => {
    const trimmed = newWallet.trim();
    setValidationError(null);

    if (!trimmed) {
      setValidationError("Please enter an address or ENS name");
      return;
    }

    // Check if it's a valid address or ENS name
    const isValidAddress = isAddress(trimmed);
    const isValidENS = isENSName(trimmed);

    if (!isValidAddress && !isValidENS) {
      setValidationError(
        "Invalid format. Please enter a valid Ethereum address (0x...) or ENS name (name.eth)",
      );
      return;
    }

    const normalized = trimmed.toLowerCase();

    // Check for duplicates (case-insensitive)
    const isDuplicate = walletInputs.some(
      (w) => w.toLowerCase() === normalized,
    );

    if (isDuplicate) {
      setValidationError("This address or ENS name is already added");
      return;
    }

    setWalletInputs([...walletInputs, normalized]);
    setNewWallet("");
    setValidationError(null);
  };

  const handleRemoveWallet = (wallet: string) => {
    setWalletInputs(walletInputs.filter((w) => w !== wallet));
  };

  const handleToggleCollection = (contractAddress: string) => {
    const normalized = contractAddress.toLowerCase();
    const newSet = new Set(enabledCollections);
    if (newSet.has(normalized)) {
      newSet.delete(normalized);
    } else {
      newSet.add(normalized);
    }
    setEnabledCollections(newSet);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Settings
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50 p-4">
          <div className="flex flex-col gap-4">
            {/* Wallets Section */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">
                Wallet Addresses / ENS Names
              </h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newWallet}
                  onChange={(e) => {
                    setNewWallet(e.target.value);
                    setValidationError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddWallet();
                    }
                  }}
                  placeholder="0x... or name.eth"
                  className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddWallet}
                  className="px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  Add
                </button>
              </div>
              {validationError && (
                <p className="text-xs text-red-400 mb-2">{validationError}</p>
              )}
              <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                {walletInputs.map((wallet) => (
                  <div
                    key={wallet}
                    className="flex items-center justify-between px-2 py-1 bg-neutral-800 rounded text-xs"
                  >
                    <span className="text-gray-300 truncate flex-1">
                      {wallet}
                    </span>
                    <button
                      onClick={() => handleRemoveWallet(wallet)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {walletInputs.length === 0 && (
                  <p className="text-xs text-gray-500 px-2">No wallets added</p>
                )}
              </div>
            </div>

            {/* Display Options Section */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">
                Display Options
              </h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={imagesOnly}
                    onChange={(e) => setImagesOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-neutral-800 text-brand-500 focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-xs text-gray-300">Images Only</span>
                </label>
                {imagesOnly && (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="image-size"
                      className="text-xs text-gray-300"
                    >
                      Image Size: {imageSize}px
                    </label>
                    <input
                      id="image-size"
                      type="range"
                      min="40"
                      max="250"
                      step="5"
                      value={imageSize}
                      onChange={(e) =>
                        setImageSize(parseInt(e.target.value, 10))
                      }
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <label htmlFor="view-mode" className="text-xs text-gray-300">
                    View Mode
                  </label>
                  <select
                    id="view-mode"
                    value={viewMode}
                    onChange={(e) =>
                      setViewMode(e.target.value as "flat" | "grouped")
                    }
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="flat">Flat</option>
                    <option value="grouped">Grouped by Collection</option>
                  </select>
                </div>
                {viewMode === "grouped" && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCollectionTitles}
                      onChange={(e) =>
                        setShowCollectionTitles(e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-700 bg-neutral-800 text-brand-500 focus:ring-2 focus:ring-brand-500"
                    />
                    <span className="text-xs text-gray-300">
                      Show Collection Titles
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Collections Section */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">
                Collections
              </h3>
              <div className="flex flex-col gap-2">
                {Object.entries(frwcAddresses).map(([name, address]) => (
                  <label
                    key={address}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={enabledCollections.has(address.toLowerCase())}
                      onChange={() =>
                        handleToggleCollection(address.toLowerCase())
                      }
                      className="w-4 h-4 rounded border-gray-700 bg-neutral-800 text-brand-500 focus:ring-2 focus:ring-brand-500"
                    />
                    <span className="text-xs text-gray-300 capitalize">
                      {name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
