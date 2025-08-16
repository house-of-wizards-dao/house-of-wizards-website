import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import Image from "next/image";
import Link from "next/link";
import { Heart, Twitter, Globe, AlertCircle } from "lucide-react";

import DefaultLayout from "@/layouts/default";
import { BidWithETH } from "@/components/auction/BidWithETH";

interface AuctionDetail {
  id: string;
  title: string;
  description: string;
  artwork_url: string;
  starting_bid: number;
  current_bid: number;
  minimum_increment: number;
  reserve_price?: number;
  start_time: string;
  end_time: string;
  status: "upcoming" | "active" | "ended" | "settled" | "cancelled";
  creator_id: string;
  creator_name: string;
  creator_avatar?: string;
  creator_twitter?: string;
  creator_website?: string;
  total_bids: number;
  bid_history: Array<{
    id: string;
    amount: number;
    bidder_name: string;
    bidder_avatar?: string;
    created_at: string;
    is_winning: boolean;
  }>;
  category: string;
  on_chain_auction_id?: number;
}

const AVATAR_CDN_URL =
  "https://ctyeiwzxltrqyrbcbrii.supabase.co/storage/v1/object/public/avatars/";

export default function AuctionDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const supabase = useSupabaseClient();
  const user = useUser();

  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [isWatching, setIsWatching] = useState(false);
  const [bidding, setBidding] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");

  const fetchAuction = useCallback(async () => {
    if (!id || typeof id !== "string") return;

    try {
      const { data, error } = await supabase
        .from("auction_details")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setAuction(data);
    } catch (error) {
      console.error("Error fetching auction:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, id]);

  const checkWatchingStatus = useCallback(async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from("auction_watchers")
        .select("*")
        .eq("auction_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      setIsWatching(!!data && !error);
    } catch (error) {
      setIsWatching(false);
    }
  }, [supabase, user, id]);

  const updateTimeRemaining = useCallback(() => {
    if (!auction) return;

    const now = new Date();
    const end = new Date(auction.end_time);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeRemaining("Auction Ended");
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    } else if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeRemaining(`${minutes}m ${seconds}s`);
    }
  }, [auction]);

  useEffect(() => {
    fetchAuction();
  }, [fetchAuction]);

  useEffect(() => {
    checkWatchingStatus();
  }, [checkWatchingStatus]);

  useEffect(() => {
    const interval = setInterval(updateTimeRemaining, 1000);
    updateTimeRemaining();
    return () => clearInterval(interval);
  }, [updateTimeRemaining]);

  const handleBid = async () => {
    if (!user || !auction || !bidAmount) return;

    setBidding(true);
    try {
      const { data, error } = await supabase.rpc("place_bid", {
        p_auction_id: auction.id,
        p_bidder_id: user.id,
        p_amount: parseFloat(bidAmount),
      });

      if (error) throw error;

      if (data.success) {
        setBidAmount("");
        fetchAuction(); // Refresh auction data
      } else {
        alert(data.error || "Failed to place bid");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid. Please try again.");
    } finally {
      setBidding(false);
    }
  };

  const toggleWatch = async () => {
    if (!user || !auction) return;

    try {
      if (isWatching) {
        const { error } = await supabase
          .from("auction_watchers")
          .delete()
          .eq("auction_id", auction.id)
          .eq("user_id", user.id);

        if (error) throw error;
        setIsWatching(false);
      } else {
        const { error } = await supabase.from("auction_watchers").insert({
          auction_id: auction.id,
          user_id: user.id,
        });

        if (error) throw error;
        setIsWatching(true);
      }
    } catch (error) {
      console.error("Error toggling watch:", error);
    }
  };

  const formatPrice = (price: number) => `${price} ETH`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMinimumBid = () => {
    if (!auction) return 0;
    return (
      (auction.current_bid || auction.starting_bid) + auction.minimum_increment
    );
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

  if (!auction) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <AlertCircle size={64} className="text-gray-600 mb-4" />
          <h2 className="text-2xl text-gray-400 mb-2">Auction Not Found</h2>
          <p className="text-gray-500 mb-6">
            The auction you're looking for doesn't exist.
          </p>
          <Button
            as={Link}
            href="/auctions"
            className="bg-violet hover:bg-violet-600 text-white px-6 py-3 rounded-full"
          >
            Back to Auctions
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Artwork */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Artwork */}
            <Card className="border border-darkviolet bg-transparent/50 backdrop-blur-sm">
              <CardBody className="p-0">
                <div className="relative aspect-square">
                  <Image
                    alt={auction.title}
                    className="object-cover w-full h-full rounded-lg"
                    src={auction.artwork_url}
                    fill
                    unoptimized
                    priority
                  />
                </div>
              </CardBody>
            </Card>

            {/* Auction Details */}
            <Card className="border border-darkviolet bg-transparent/50 backdrop-blur-sm">
              <CardHeader>
                <h2 className="text-2xl font-bold text-white">
                  About This Piece
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-violet mb-2">
                    {auction.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {auction.description}
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-darkviolet/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        alt={auction.creator_name}
                        className="object-cover w-full h-full"
                        src={
                          auction.creator_avatar
                            ? auction.creator_avatar.startsWith("http")
                              ? auction.creator_avatar
                              : `${AVATAR_CDN_URL}${auction.creator_avatar}`
                            : "/img/logo.png"
                        }
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {auction.creator_name}
                      </p>
                      <p className="text-gray-400 text-sm">Artist</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {auction.creator_twitter && (
                      <Button
                        as={Link}
                        href={`https://twitter.com/${auction.creator_twitter}`}
                        target="_blank"
                        size="sm"
                        className="bg-transparent border border-darkviolet text-gray-300 hover:border-violet"
                      >
                        <Twitter size={16} />
                      </Button>
                    )}
                    {auction.creator_website && (
                      <Button
                        as={Link}
                        href={auction.creator_website}
                        target="_blank"
                        size="sm"
                        className="bg-transparent border border-darkviolet text-gray-300 hover:border-violet"
                      >
                        <Globe size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Bid History */}
            <Card className="border border-darkviolet bg-transparent/50 backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-xl font-bold text-white">Bid History</h3>
              </CardHeader>
              <CardBody>
                {auction.bid_history && auction.bid_history.length > 0 ? (
                  <div className="space-y-3">
                    {auction.bid_history.map((bid) => (
                      <div
                        key={bid.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          bid.is_winning
                            ? "bg-green-600/20 border border-green-600/50"
                            : "bg-gray-800/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              alt={bid.bidder_name}
                              className="object-cover w-full h-full"
                              src={
                                bid.bidder_avatar
                                  ? bid.bidder_avatar.startsWith("http")
                                    ? bid.bidder_avatar
                                    : `${AVATAR_CDN_URL}${bid.bidder_avatar}`
                                  : "/img/logo.png"
                              }
                              width={32}
                              height={32}
                            />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {bid.bidder_name}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {formatDate(bid.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-violet font-semibold">
                            {formatPrice(bid.amount)}
                          </p>
                          {bid.is_winning && (
                            <p className="text-green-400 text-sm">
                              Winning bid
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    No bids yet. Be the first to bid!
                  </p>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Bidding */}
          <div className="space-y-6">
            {/* Auction Status */}
            <Card className="border border-darkviolet bg-transparent/50 backdrop-blur-sm">
              <CardBody className="text-center p-6">
                <div
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                    auction.status === "active"
                      ? "bg-green-600 text-white"
                      : auction.status === "upcoming"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white"
                  }`}
                >
                  {auction.status.charAt(0).toUpperCase() +
                    auction.status.slice(1)}
                </div>

                {auction.status === "active" && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Time Remaining</p>
                    <p className="text-2xl font-bold text-white mb-4">
                      {timeRemaining}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Current Bid</p>
                    <p className="text-3xl font-bold text-violet">
                      {formatPrice(auction.current_bid || auction.starting_bid)}
                    </p>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="text-center">
                      <p className="text-gray-400">Bids</p>
                      <p className="text-white font-semibold">
                        {auction.total_bids}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400">Watching</p>
                      <p className="text-white font-semibold">
                        {/* Note: watchers count would need to be added to the query */}
                        -
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* ETH Bidding Form */}
            {auction.status === "active" && (
              <Card className="border border-darkviolet bg-transparent/50 backdrop-blur-sm">
                <CardHeader>
                  <h3 className="text-lg font-bold text-white">
                    Place a Bid with ETH
                  </h3>
                </CardHeader>
                <CardBody>
                  <BidWithETH
                    auctionId={auction.id}
                    currentBid={auction.current_bid || auction.starting_bid}
                    minimumIncrement={auction.minimum_increment}
                    onChainAuctionId={auction.on_chain_auction_id}
                    endTime={auction.end_time}
                    hasBids={auction.total_bids > 0}
                    onBidSuccess={() => {
                      fetchAuction(); // Refresh auction data after successful bid
                    }}
                  />

                  {auction.reserve_price && (
                    <p className="text-yellow-400 text-sm text-center mt-4">
                      Reserve price: {formatPrice(auction.reserve_price)}
                    </p>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Watch Button */}
            {user && (
              <Button
                className={`w-full py-3 rounded-full font-semibold transition-all ${
                  isWatching
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-transparent border border-darkviolet text-gray-300 hover:border-violet hover:bg-violet/20"
                }`}
                onClick={toggleWatch}
              >
                <Heart
                  size={16}
                  className="mr-2"
                  fill={isWatching ? "currentColor" : "none"}
                />
                {isWatching ? "Stop Watching" : "Watch Auction"}
              </Button>
            )}

            {/* Auction Info */}
            <Card className="border border-darkviolet bg-transparent/50 backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-lg font-bold text-white">
                  Auction Details
                </h3>
              </CardHeader>
              <CardBody className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Starting Bid</span>
                  <span className="text-white">
                    {formatPrice(auction.starting_bid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum Increment</span>
                  <span className="text-white">
                    {formatPrice(auction.minimum_increment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Start Time</span>
                  <span className="text-white">
                    {formatDate(auction.start_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">End Time</span>
                  <span className="text-white">
                    {formatDate(auction.end_time)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white capitalize">
                    {auction.category}
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* Login CTA */}
            {!user && (
              <Card className="border border-violet bg-violet/10 backdrop-blur-sm">
                <CardBody className="text-center p-6">
                  <h4 className="text-lg font-bold text-white mb-2">
                    Ready to bid?
                  </h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Sign in to place bids and watch auctions
                  </p>
                  <Button
                    as={Link}
                    href="/signup"
                    className="bg-violet hover:bg-violet-600 text-white px-6 py-2 rounded-full"
                  >
                    Sign In
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
