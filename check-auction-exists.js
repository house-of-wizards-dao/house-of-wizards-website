// Check if the auction exists in the database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAuction() {
  const auctionId = 'c8fa53fd-9974-4d50-b2cf-2c7b41599cb0';
  
  console.log('Checking auction:', auctionId);
  
  try {
    // Check if auction exists
    const { data: auction, error } = await supabase
      .from('auctions')
      .select('id, title, creator_id, status')
      .eq('id', auctionId)
      .single();
    
    if (error) {
      console.log('❌ Auction not found:', error.message);
      return;
    }
    
    console.log('✅ Auction exists:', auction);
    
    // Check if creator exists  
    if (auction.creator_id) {
      const { data: creator, error: creatorError } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('id', auction.creator_id)
        .single();
      
      if (creatorError) {
        console.log('❌ Creator not found:', creatorError.message);
      } else {
        console.log('✅ Creator exists:', creator);
      }
    }
    
    // Try to get current user to test bidder_id
    console.log('\nChecking user 0af0d632-6962-407d-8b08-8fa99066a35d...');
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('id', '0af0d632-6962-407d-8b08-8fa99066a35d')
      .single();
    
    if (userError) {
      console.log('❌ User not found:', userError.message);
    } else {
      console.log('✅ User exists:', user);
    }
    
  } catch (e) {
    console.log('❌ Error:', e.message);
  }
}

checkAuction();