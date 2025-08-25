// Check and report missing database tables and columns
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('Checking database structure...\n');
  
  // Check auction_watchers table
  try {
    const { data, error } = await supabase
      .from('auction_watchers')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ auction_watchers table missing or inaccessible:');
      console.log('   Error:', error.message);
      console.log('   SQL to create: CREATE TABLE auction_watchers (id SERIAL PRIMARY KEY, auction_id UUID REFERENCES auctions(id), user_id UUID REFERENCES profiles(id), created_at TIMESTAMP DEFAULT NOW());');
    } else {
      console.log('✅ auction_watchers table exists');
    }
  } catch (e) {
    console.log('❌ auction_watchers error:', e.message);
  }
  
  console.log('');
  
  // Check bids table structure
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('id, auction_id, bidder_id, amount, transaction_hash, is_winning, created_at')
      .limit(1);
    
    if (error) {
      console.log('❌ bids table issue:');
      console.log('   Error:', error.message);
    } else {
      console.log('✅ bids table exists with expected columns');
    }
  } catch (e) {
    console.log('❌ bids error:', e.message);
  }
  
  console.log('');
  
  // Check specific columns exist
  console.log('Checking individual columns...');
  
  // Test if we can insert a test bid (to see what columns are missing)
  try {
    const testBid = {
      auction_id: 'test-uuid-that-wont-exist',
      bidder_id: 'test-bidder',
      amount: 0.1,
      transaction_hash: '0xtest',
      is_winning: true,
    };
    
    const { error } = await supabase
      .from('bids')
      .insert(testBid);
    
    if (error) {
      console.log('❌ Bid insertion test failed:');
      console.log('   Error:', error.message);
      console.log('   Details:', error.details);
    } else {
      console.log('✅ Bid insertion would work (test with invalid UUID failed as expected)');
    }
  } catch (e) {
    console.log('❌ Bid test error:', e.message);
  }
}

checkTables();