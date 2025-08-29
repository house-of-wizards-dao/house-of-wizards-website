import { GetServerSideProps } from "next";

import DefaultLayout from "@/layouts/default";
import { ClientOnlyWeb3 } from "@/components/ClientOnlyWeb3";
import { AuctionPageClient } from "@/components/auction/AuctionPageClient";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import type { Bid, AuctionActivity, AuctionPageProps } from "@/types";

export default function AuctionPage({
  auction: initialAuction,
  initialBids,
  initialActivity,
}: AuctionPageProps) {
  return (
    <DefaultLayout>
      <ClientOnlyWeb3
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" message="Loading auction..." />
          </div>
        }
      >
        <AuctionPageClient
          auction={initialAuction}
          initialBids={initialBids}
          initialActivity={initialActivity}
        />
      </ClientOnlyWeb3>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const auctionId = params?.id as string;

  try {
    // Import the contract service dynamically to avoid build issues
    const { ContractAuctionService } = await import(
      "@/lib/services/contract-auction-service"
    );

    console.log(`🔍 Fetching auction data for ID: ${auctionId}`);

    // Extract auction index from ID (format: contract-auction-0, contract-auction-1, etc.)
    const auctionIndex = parseInt(auctionId.replace("contract-auction-", ""));

    if (isNaN(auctionIndex)) {
      console.error("Invalid auction ID format:", auctionId);
      return { notFound: true };
    }

    // Fetch real auction data from smart contract
    const auction =
      await ContractAuctionService.getAuctionByIndex(auctionIndex);

    if (!auction) {
      console.log("Auction not found for index:", auctionIndex);
      return { notFound: true };
    }

    console.log(`✅ Found auction: "${auction.title}"`);

    // Mock bids and activity for now - these would come from your database/indexer in production
    const initialBids: Bid[] = [];
    const initialActivity: AuctionActivity[] = [];

    return {
      props: {
        auction,
        initialBids,
        initialActivity,
      },
    };
  } catch (error) {
    console.error("Failed to fetch auction data:", error);
    return {
      notFound: true,
    };
  }
};
