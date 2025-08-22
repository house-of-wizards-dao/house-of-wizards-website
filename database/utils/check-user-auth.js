// Check the relationship between profiles and auth.users
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserAuth() {
  const userId = '0af0d632-6962-407d-8b08-8fa99066a35d';
  
  console.log('Checking user auth relationship for:', userId);
  
  try {
    // Check if this ID exists in auth.users
    console.log('\n1. Checking auth.users table...');
    const { data: authUser, error: authError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('id', userId)
      .single();
    
    if (authError) {
      console.log('❌ Not found in auth.users:', authError.message);
    } else {
      console.log('✅ Found in auth.users:', authUser);
    }
    
    // Check profiles table
    console.log('\n2. Checking profiles table...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.log('❌ Not found in profiles:', profileError.message);
    } else {
      console.log('✅ Found in profiles:', profile);
    }
    
    // Try to insert a test bid with this user ID
    console.log('\n3. Testing bid insertion...');
    const testBid = {
      auction_id: 'c8fa53fd-9974-4d50-b2cf-2c7b41599cb0',
      bidder_id: userId,
      amount: 0.1,
      transaction_hash: '0x1234567890abcdef',
      is_winning: true,
    };
    
    const { data: bidResult, error: bidError } = await supabase
      .from('bids')
      .insert(testBid)
      .select();
    
    if (bidError) {
      console.log('❌ Bid insertion failed:', bidError.message);
      console.log('   Details:', bidError.details);
      console.log('   Hint:', bidError.hint);
    } else {
      console.log('✅ Bid insertion successful:', bidResult);
      
      // Clean up the test bid
      if (bidResult && bidResult[0]) {
        await supabase
          .from('bids')
          .delete()
          .eq('id', bidResult[0].id);
        console.log('   (Test bid cleaned up)');
      }
    }
    
  } catch (e) {
    console.log('❌ Error:', e.message);
  }
}

checkUserAuth();