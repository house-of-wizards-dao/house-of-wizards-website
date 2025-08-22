// Quick test to verify Supabase connection and check if auction tables exist
// Run with: node test-db-connection.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Try to read .env.local file
let supabaseUrl, supabaseKey;
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1];
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1];
    }
  }
} catch (error) {
  console.log('📝 No .env.local file found, checking environment variables...');
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure you have .env.local with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data: { user } } = await supabase.auth.getUser();
    console.log('✅ Supabase connection successful');
    
    // Check if auction tables exist
    console.log('🔍 Checking if auction tables exist...');
    
    const { data: auctions, error: auctionError } = await supabase
      .from('auctions')
      .select('count', { count: 'exact', head: true });
    
    if (auctionError) {
      if (auctionError.code === 'PGRST116') {
        console.log('❌ Auction tables NOT found');
        console.log('👉 You need to run the SQL schema in Supabase SQL Editor');
        console.log('👉 Use auction-minimal.sql for quick setup');
      } else {
        console.log('❌ Error checking auctions table:', auctionError.message);
      }
    } else {
      console.log('✅ Auctions table exists');
      console.log(`📊 Current auction count: ${auctions || 0}`);
      
      // Test other tables
      const { error: bidsError } = await supabase
        .from('bids')
        .select('count', { count: 'exact', head: true });
      
      if (!bidsError) {
        console.log('✅ Bids table exists');
      }
      
      const { error: watchersError } = await supabase
        .from('auction_watchers')
        .select('count', { count: 'exact', head: true });
      
      if (!watchersError) {
        console.log('✅ Auction watchers table exists');
      }
    }
    
    // Test profiles table (should exist)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (!profileError) {
      console.log('✅ Profiles table exists');
      console.log(`👥 Profile count: ${profiles || 0}`);
    } else {
      console.log('❌ Profiles table missing:', profileError.message);
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();