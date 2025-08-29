import { GetServerSideProps } from "next";
import { supabase } from "@/lib/supabase";
import DefaultLayout from "@/layouts/default";
import { AuctionPageClient } from "@/components/auction/AuctionPageClient";
import { AuctionPageProps, Auction, Bid, AuctionActivity } from "@/types";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function AuctionPageRoute(props: AuctionPageProps) {
  return (
    <DefaultLayout>
      <ErrorBoundary
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Auction Error
              </h1>
              <p className="text-gray-400 mb-4">
                Something went wrong loading this auction page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        }
      >
        <AuctionPageClient {...props} />
      </ErrorBoundary>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps<AuctionPageProps> = async (
  context,
) => {
  const { id } = context.params!;

  if (!id || typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  try {
    // Try to fetch from database first
    let auction: Auction | null = null;
    let bids: Bid[] = [];
    let activity: AuctionActivity[] = [];

    try {
      const { data: auctionData, error } = await supabase
        .from("auctions")
        .select(
          `
          *,
          artist:artists(*)
        `,
        )
        .eq("id", id)
        .single();

      if (!error && auctionData) {
        auction = auctionData;

        // Fetch bids
        const { data: bidsData } = await supabase
          .from("auction_bids")
          .select(
            `
            *,
            bidder_profile:profiles(*)
          `,
          )
          .eq("auction_id", id)
          .order("amount", { ascending: false });

        bids = bidsData || [];

        // Fetch activity
        const { data: activityData } = await supabase
          .from("auction_activity")
          .select(
            `
            *,
            user_profile:profiles(*)
          `,
          )
          .eq("auction_id", id)
          .order("created_at", { ascending: false });

        activity = activityData || [];
      }
    } catch (dbError) {
      console.log("Database not available:", dbError);
    }

    // For contract auctions (id starts with 'contract-auction-'), create a minimal auction object
    if (!auction && id.startsWith("contract-auction-")) {
      const auctionIndex = id.replace("contract-auction-", "");
      auction = {
        id: id,
        title: `Contract Auction #${auctionIndex}`,
        description: "Live auction data from blockchain contract",
        artwork_url:
          "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=800&fit=crop&crop=center",
        artist_id: "contract-artist",
        artist: {
          id: "contract-artist",
          name: "Blockchain Artist",
          bio: "Decentralized digital art",
        },
        start_price: "1000000000000000000", // 1 ETH in wei
        current_bid: "1000000000000000000", // Will be updated by contract data
        min_bid_increment: "100000000000000000", // 0.1 ETH in wei
        start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        total_bids: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // If still no auction found, return 404
    if (!auction) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        auction,
        initialBids: bids,
        initialActivity: activity,
      },
    };
  } catch (error) {
    console.error("Error fetching auction:", error);
    return {
      notFound: true,
    };
  }
};
