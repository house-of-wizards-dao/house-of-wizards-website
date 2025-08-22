// Debug current auction to see the starting bid and minimum requirements
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugAuction() {
  const auctionId = 'c8fa53fd-9974-4d50-b2cf-2c7b41599cb0';
  
  console.log('Checking auction details:', auctionId);
  
  try {
    // Get auction details
    const { data: auction, error } = await supabase
      .from('auctions')
      .select('starting_bid, minimum_increment, title, status')
      .eq('id', auctionId)
      .single();
    
    if (error) {
      console.log('❌ Auction not found:', error.message);
      return;
    }
    
    console.log('✅ Auction details:', auction);
    console.log('   Starting bid:', auction.starting_bid, 'ETH');
    console.log('   Minimum increment:', auction.minimum_increment, 'ETH');
    
    // Check what the minimum bid should be
    console.log('\n📊 Bidding Requirements:');
    console.log('   First bid must be at least:', auction.starting_bid, 'ETH');
    console.log('   If there are existing bids, next bid must be 5% higher');
    
    // Check existing bids
    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select('amount, transaction_hash, created_at')
      .eq('auction_id', auctionId)
      .order('amount', { ascending: false })
      .limit(5);
    
    if (bidsError) {
      console.log('❌ Error fetching bids:', bidsError.message);
    } else if (bids && bids.length > 0) {
      console.log('\n💰 Existing bids:');
      bids.forEach((bid, index) => {
        console.log(`   ${index + 1}. ${bid.amount} ETH (${bid.transaction_hash})`);
      });
      
      const highestBid = bids[0].amount;
      const nextMinBid = highestBid * 1.05; // 5% increment
      console.log('\n🎯 Next bid must be at least:', nextMinBid.toFixed(8), 'ETH');
    } else {
      console.log('\n💰 No existing bids - first bid needs:', auction.starting_bid, 'ETH');
    }
    
  } catch (e) {
    console.log('❌ Error:', e.message);
  }
}

debugAuction();