import { useState, useEffect, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Gavel } from "lucide-react";

import DefaultLayout from "@/layouts/default";

interface Auction {
  id: string;
  title: string;
  description: string;
  artwork_url: string;
  artwork_thumbnail_url?: string;
  starting_bid: number;
  current_bid: number;
  reserve_price?: number;
  end_time: string;
  status: "upcoming" | "active" | "ended" | "settled" | "cancelled";
  creator_name: string;
  creator_avatar?: string;
  total_bids: number;
  watchers_count: number;
  category: string;
}

const ARTWORK_CDN_URL =
  "https://ctyeiwzxltrqyrbcbrii.supabase.co/storage/v1/object/public/files/";

export default function AuctionsPage() {
  const supabase = useSupabaseClient();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "ended">(
    "active",
  );

  const fetchAuctions = useCallback(async () => {
    try {
      let query = supabase
        .from("active_auctions")
        .select("*")
        .order("end_time", { ascending: true });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAuctions(data || []);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, filter]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatPrice = (price: number) => {
    return `${price} ETH`;
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-atirose text-violet text-5xl md:text-6xl mb-6">
            Auction House
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Discover and bid on exclusive artworks from the Forgotten Runes
            community. Every piece tells a story waiting to be discovered.
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              className={`px-6 py-3 rounded-full transition-all ${
                filter === "active"
                  ? "bg-violet text-white"
                  : "bg-transparent border border-darkviolet text-gray-300 hover:border-violet"
              }`}
              onClick={() => setFilter("active")}
            >
              <Gavel size={16} className="mr-2" />
              Active Auctions
            </Button>
            <Button
              className={`px-6 py-3 rounded-full transition-all ${
                filter === "upcoming"
                  ? "bg-violet text-white"
                  : "bg-transparent border border-darkviolet text-gray-300 hover:border-violet"
              }`}
              onClick={() => setFilter("upcoming")}
            >
              <Clock size={16} className="mr-2" />
              Upcoming
            </Button>
            <Button
              className={`px-6 py-3 rounded-full transition-all ${
                filter === "ended"
                  ? "bg-violet text-white"
                  : "bg-transparent border border-darkviolet text-gray-300 hover:border-violet"
              }`}
              onClick={() => setFilter("ended")}
            >
              Past Auctions
            </Button>
          </div>
        </div>

        {/* Decorative separator */}
        <div className="w-full mb-12">
          <svg
            className="w-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 330 8"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M59.0303 3.5303L58.8107 3.75H58.5H35.3107L0.25 7.8107V11.75H329.25V7.8107L294.189 3.75H271H270.689L270.47 3.5303L241.689 0.75H87.8107L59.0303 3.5303Z"
              stroke="#A986D9"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Auction Grid */}
        {auctions.length === 0 ? (
          <div className="text-center py-16">
            <Gavel size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No auctions found</h3>
            <p className="text-gray-500">
              {filter === "active" && "No active auctions at the moment."}
              {filter === "upcoming" && "No upcoming auctions scheduled."}
              {filter === "ended" && "No past auctions to display."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 container  mx-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {auctions.map((auction) => (
              <Link key={auction.id} href={`/auctions/${auction.id}`}>
                <Card className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm hover:border-violet hover:shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                  <CardBody className="p-0">
                    {/* Artwork Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        alt={auction.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        src={
                          auction.artwork_thumbnail_url || auction.artwork_url
                        }
                        fill
                        unoptimized
                      />

                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            auction.status === "active"
                              ? "bg-green-600 text-white"
                              : auction.status === "upcoming"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-white"
                          }`}
                        >
                          {auction.status.charAt(0).toUpperCase() +
                            auction.status.slice(1)}
                        </span>
                      </div>

                      {/* Time Remaining */}
                      {auction.status === "active" && (
                        <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 rounded-lg">
                          <div className="flex items-center space-x-1 text-white text-xs">
                            <Clock size={12} />
                            <span>{formatTimeRemaining(auction.end_time)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardBody>

                  <CardFooter className="flex flex-col items-start p-4 space-y-3">
                    {/* Title and Creator */}
                    <div className="w-full">
                      <h3 className="text-white font-semibold text-lg truncate mb-1">
                        {auction.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        by {auction.creator_name}
                      </p>
                    </div>

                    {/* Bidding Info */}
                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">
                          Current Bid
                        </span>
                        <span className="text-violet font-semibold">
                          {formatPrice(
                            auction.current_bid || auction.starting_bid,
                          )}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Gavel size={12} />
                          <span>{auction.total_bids} bids</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye size={12} />
                          <span>{auction.watchers_count} watching</span>
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Create Auction CTA */}
        <div className="text-center mt-16 container mx-auto">
          <div className="bg-gradient-to-r from-violet/20 to-purple-600/20 rounded-2xl p-8 border border-violet/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to auction your artwork?
            </h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Join the Forgotten Runes auction house and showcase your creations
              to collectors worldwide.
            </p>
            <Button
              as={Link}
              href="/auctions/create"
              className="bg-violet hover:bg-violet-600 text-white px-8 py-3 rounded-full transition-all duration-300"
            >
              Create Auction
            </Button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
