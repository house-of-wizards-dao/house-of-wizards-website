// Script to add on_chain_auction_id column to auctions table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('Adding on_chain_auction_id column to auctions table...');
  
  try {
    // Add the column
    const { data, error } = await supabase.rpc('sql', {
      query: `
        -- Add the on_chain_auction_id column to link off-chain auctions to on-chain auction IDs
        ALTER TABLE auctions ADD COLUMN IF NOT EXISTS on_chain_auction_id INTEGER;
        
        -- Add index for better query performance
        CREATE INDEX IF NOT EXISTS idx_auctions_on_chain_auction_id ON auctions(on_chain_auction_id);
      `
    });

    if (error) {
      console.error('Error executing migration:', error);
      process.exit(1);
    }

    console.log('Migration completed successfully!');
    console.log('Added on_chain_auction_id column to auctions table');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();