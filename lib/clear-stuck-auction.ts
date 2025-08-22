/**
 * Utility to clear stuck on-chain auction IDs
 * Use this when an auction gets stuck with an old on-chain ID that has already ended
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function clearStuckAuctionId(auctionId: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // First, get the auction details
  const { data: auction, error: fetchError } = await supabase
    .from("auctions")
    .select("*")
    .eq("id", auctionId)
    .single();
    
  if (fetchError) {
    console.error("Error fetching auction:", fetchError);
    return { success: false, error: fetchError };
  }
  
  if (!auction) {
    console.error("Auction not found");
    return { success: false, error: "Auction not found" };
  }
  
  console.log("Current auction state:", {
    id: auction.id,
    title: auction.title,
    on_chain_auction_id: auction.on_chain_auction_id,
    status: auction.status,
    end_time: auction.end_time
  });
  
  // Clear the on_chain_auction_id
  const { error: updateError } = await supabase
    .from("auctions")
    .update({ 
      on_chain_auction_id: null,
      updated_at: new Date().toISOString()
    })
    .eq("id", auctionId);
    
  if (updateError) {
    console.error("Error clearing on_chain_auction_id:", updateError);
    return { success: false, error: updateError };
  }
  
  console.log(`Successfully cleared on_chain_auction_id for auction ${auctionId}`);
  console.log("The next bid attempt will create a new on-chain auction");
  
  return { success: true, previousOnChainId: auction.on_chain_auction_id };
}

// For command-line usage
if (require.main === module) {
  const auctionId = process.argv[2];
  
  if (!auctionId) {
    console.error("Usage: npx tsx lib/clear-stuck-auction.ts <auction-id>");
    console.error("Example: npx tsx lib/clear-stuck-auction.ts e25834f7-a599-49d3-8df1-da8c98416153");
    process.exit(1);
  }
  
  clearStuckAuctionId(auctionId)
    .then(result => {
      if (result.success) {
        console.log("✅ Auction cleared successfully!");
        if (result.previousOnChainId) {
          console.log(`Previous on-chain ID was: ${result.previousOnChainId}`);
        }
      } else {
        console.error("❌ Failed to clear auction:", result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error("❌ Unexpected error:", error);
      process.exit(1);
    });
}