// Check if on_chain_auction_id column exists in bids table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBidsTable() {
  console.log('Checking bids table structure...');
  
  try {
    // Try to select from the bids table to see current structure
    const { data, error } = await supabase
      .from('bids')
      .select('on_chain_auction_id')
      .limit(1);
    
    if (error && error.message.includes('column "on_chain_auction_id" does not exist')) {
      console.log('Column does not exist in bids table, need to add it via SQL...');
      console.log('');
      console.log('ALTER TABLE bids ADD COLUMN on_chain_auction_id INTEGER;');
      console.log('');
    } else if (error) {
      console.error('Other error:', error);
    } else {
      console.log('Column exists in bids table!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBidsTable();