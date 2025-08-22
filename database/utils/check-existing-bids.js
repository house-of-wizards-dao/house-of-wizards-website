// Check if there are existing bids for this auction
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBids() {
  const auctionId = 'c8fa53fd-9974-4d50-b2cf-2c7b41599cb0';
  
  console.log('Checking bids for auction:', auctionId);
  
  try {
    // Get all bids for this auction
    const { data: bids, error } = await supabase
      .from('bids')
      .select('*')
      .eq('auction_id', auctionId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log('❌ Error fetching bids:', error.message);
      return;
    }
    
    console.log(`Found ${bids.length} bids:`);
    
    if (bids.length === 0) {
      console.log('✅ No existing bids - this is the first bid');
      console.log('   Minimum bid should be the starting bid: 0.099 ETH');
    } else {
      console.log('📋 Existing bids:');
      bids.forEach((bid, index) => {
        console.log(`   ${index + 1}. ${bid.amount} ETH by ${bid.bidder_id.substring(0, 8)}... at ${bid.created_at}`);
        console.log(`      TX: ${bid.transaction_hash}`);
        console.log(`      Winning: ${bid.is_winning}`);
      });
      
      const highestBid = Math.max(...bids.map(b => b.amount));
      console.log(`\n🏆 Highest bid: ${highestBid} ETH`);
      console.log(`🎯 Next bid should be: ${(highestBid * 1.05).toFixed(6)} ETH (5% higher)`);
    }
    
  } catch (e) {
    console.log('❌ Error:', e.message);
  }
}

checkBids();