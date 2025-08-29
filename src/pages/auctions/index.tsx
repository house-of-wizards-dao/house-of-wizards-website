import { GetServerSideProps } from "next";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { formatEther } from "viem";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  ClockIcon,
  FireIcon,
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

import DefaultLayout from "@/layouts/default";
import { useTimer } from "@/hooks/useTimer";
import type { Auction } from "@/types";

interface AuctionsPageProps {
  auctions: Auction[];
}

export default function AuctionsPage({
  auctions: initialAuctions,
}: AuctionsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [favoriteAuctions, setFavoriteAuctions] = useState<Set<string>>(
    new Set(),
  );

  const filteredAuctions = useMemo(() => {
    let filtered = initialAuctions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (auction) =>
          auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.artist?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          auction.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (selectedTab !== "all") {
      filtered = filtered.filter((auction) => auction.status === selectedTab);
    }

    return filtered;
  }, [initialAuctions, searchTerm, selectedTab]);

  const toggleFavorite = (auctionId: string) => {
    setFavoriteAuctions((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(auctionId)) {
        newFavorites.delete(auctionId);
      } else {
        newFavorites.add(auctionId);
      }
      return newFavorites;
    });
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-heading text-white mb-6 leading-tight">
              Art Auctions
            </h1>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Discover and bid on unique digital artworks from talented artists
              in the House of Wizards community.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-neutral-800/50 border border-neutral-700">
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                  {/* Search Bar */}
                  <div className="w-full lg:w-1/2">
                    <Input
                      placeholder="Search auctions, artists, or artworks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      startContent={
                        <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400" />
                      }
                      classNames={{
                        input: "text-white placeholder-neutral-500",
                        inputWrapper: [
                          "bg-neutral-800/50",
                          "border",
                          "border-neutral-600",
                          "hover:border-brand-500/50",
                          "focus-within:border-brand-500",
                          "transition-colors",
                        ],
                      }}
                      size="lg"
                    />
                  </div>

                  {/* Status Filters */}
                  <div className="w-full lg:w-auto">
                    <Tabs
                      selectedKey={selectedTab}
                      onSelectionChange={(key) => setSelectedTab(key as string)}
                      color="primary"
                      variant="bordered"
                    >
                      <Tab key="all" title="All Auctions" />
                      <Tab key="active" title="Live" />
                      <Tab key="upcoming" title="Upcoming" />
                      <Tab key="ended" title="Ended" />
                    </Tabs>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Auctions Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filteredAuctions.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-neutral-800 rounded-full flex items-center justify-center">
                  <MagnifyingGlassIcon className="w-12 h-12 text-neutral-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  No Auctions Found
                </h3>
                <p className="text-neutral-400 mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms or filters"
                    : "Check back soon for new auctions"}
                </p>
                {searchTerm && (
                  <Button
                    size="lg"
                    className="bg-brand-500 text-white"
                    onPress={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredAuctions.map((auction, index) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    index={index}
                    isFavorite={favoriteAuctions.has(auction.id)}
                    onToggleFavorite={() => toggleFavorite(auction.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DefaultLayout>
  );
}

interface AuctionCardProps {
  auction: Auction;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function AuctionCard({
  auction,
  index,
  isFavorite,
  onToggleFavorite,
}: AuctionCardProps) {
  const timer = useTimer(auction.end_time);
  const currentBid = formatEther(BigInt(auction.current_bid));
  const startingPrice = formatEther(BigInt(auction.start_price));

  const getStatusConfig = () => {
    switch (auction.status) {
      case "active":
        return {
          color: "success" as const,
          label: "Live",
          icon: <FireIcon className="w-4 h-4" />,
        };
      case "upcoming":
        return {
          color: "warning" as const,
          label: "Upcoming",
          icon: <ClockIcon className="w-4 h-4" />,
        };
      case "ended":
        return {
          color: "default" as const,
          label: "Ended",
          icon: <ClockIcon className="w-4 h-4" />,
        };
      default:
        return {
          color: "default" as const,
          label: "Unknown",
          icon: <ClockIcon className="w-4 h-4" />,
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group bg-gradient-to-b from-neutral-800/60 to-neutral-900/60 border border-neutral-700 hover:border-brand-500/50 transition-all duration-500 hover:shadow-brand overflow-hidden">
        {/* Artwork Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={auction.artwork_url}
            alt={auction.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            classNames={{
              img: "transition-transform duration-700",
            }}
          />

          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                isIconOnly
                size="sm"
                className={`bg-black/50 backdrop-blur-sm transition-colors ${
                  isFavorite
                    ? "text-red-400 hover:text-red-300"
                    : "text-white hover:text-red-400"
                }`}
                onPress={onToggleFavorite}
              >
                <HeartIcon
                  className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
            </div>

            <div className="absolute top-4 left-4">
              <Chip
                color={statusConfig.color}
                variant="flat"
                startContent={statusConfig.icon}
              >
                {statusConfig.label}
              </Chip>
            </div>

            {/* Quick View Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Link href={`/auction/${auction.id}`}>
                <Button
                  size="lg"
                  className="bg-white/90 text-black font-semibold hover:bg-white transition-all duration-300 transform hover:scale-105"
                  startContent={<EyeIcon className="w-5 h-5" />}
                >
                  View Auction
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <CardHeader className="pb-2">
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white truncate">
                {auction.title}
              </h3>
              {auction.status === "active" && (
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Live</span>
                </div>
              )}
            </div>

            {auction.artist && (
              <p className="text-brand-400 text-sm font-medium">
                by {auction.artist.name}
              </p>
            )}
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          {/* Auction Timer */}
          {auction.status === "active" && (
            <div className="mb-4 p-3 bg-black/20 rounded-lg">
              <div className="text-xs text-neutral-400 mb-1">
                Time Remaining
              </div>
              <div className="grid grid-cols-4 gap-1 text-center">
                {[
                  { label: "D", value: timer.days },
                  { label: "H", value: timer.hours },
                  { label: "M", value: timer.minutes },
                  { label: "S", value: timer.seconds },
                ].map((unit) => (
                  <div key={unit.label} className="text-white">
                    <div className="text-sm font-bold">
                      {unit.value.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-neutral-400">{unit.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 text-sm">
                {auction.total_bids > 0 ? "Current Bid" : "Starting Price"}
              </span>
              <span className="text-white font-bold text-lg">
                {auction.total_bids > 0 ? currentBid : startingPrice} ETH
              </span>
            </div>

            {auction.total_bids > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-sm">Total Bids</span>
                <Chip color="primary" variant="flat" size="sm">
                  {auction.total_bids}
                </Chip>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-4 pt-4 border-t border-neutral-700/50">
            <Link href={`/auction/${auction.id}`} className="w-full">
              <Button
                size="lg"
                className={`w-full font-semibold transition-all duration-300 ${
                  auction.status === "active"
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:shadow-brand transform hover:scale-[1.02]"
                    : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                }`}
              >
                {auction.status === "active"
                  ? "Place Bid"
                  : auction.status === "upcoming"
                    ? "View Details"
                    : "View Results"}
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Import the contract service dynamically to avoid build issues
    const { ContractAuctionService } = await import(
      "@/lib/services/contract-auction-service"
    );

    console.log("🚀 Fetching real auction data from smart contract...");

    // Fetch real auction data from smart contract
    const contractAuctions = await ContractAuctionService.getAllAuctions();

    console.log(`✅ Found ${contractAuctions.length} auctions from contract`);

    // If no contract auctions, provide helpful message
    if (contractAuctions.length === 0) {
      console.log("ℹ️ No auctions found, returning empty array");
    } else {
      console.log(
        "📋 Auction titles:",
        contractAuctions.map((a) => a.title).join(", "),
      );
    }

    return {
      props: {
        auctions: contractAuctions,
      },
    };
  } catch (error) {
    console.error("❌ Failed to fetch auctions from contract:", error);

    // Return empty array on error, let the UI handle the empty state
    return {
      props: {
        auctions: [],
      },
    };
  }
};
