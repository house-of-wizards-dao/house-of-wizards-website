// Simple script to add column using admin API
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addColumn() {
  console.log('Checking if on_chain_auction_id column exists...');
  
  try {
    // First, let's try to select from the auctions table to see current structure
    const { data, error } = await supabase
      .from('auctions')
      .select('on_chain_auction_id')
      .limit(1);
    
    if (error && error.message.includes('column "on_chain_auction_id" does not exist')) {
      console.log('Column does not exist, need to add it via SQL...');
      console.log('Please run this SQL in Supabase SQL editor:');
      console.log('');
      console.log('ALTER TABLE auctions ADD COLUMN on_chain_auction_id INTEGER;');
      console.log('CREATE INDEX idx_auctions_on_chain_auction_id ON auctions(on_chain_auction_id);');
      console.log('');
    } else if (error) {
      console.error('Other error:', error);
    } else {
      console.log('Column already exists!');
      console.log('Data:', data);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addColumn();