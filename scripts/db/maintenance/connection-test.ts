/**
 * Database Connection Test Script
 * 
 * Tests the connection to Supabase and validates basic functionality
 * 
 * Usage: npx tsx scripts/db/maintenance/connection-test.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  // Test environment variables
  console.log('Environment Variables:');
  console.log(`✅ SUPABASE_URL: ${supabaseUrl ? 'Set' : '❌ Missing'}`);
  console.log(`✅ ANON_KEY: ${supabaseAnonKey ? 'Set' : '❌ Missing'}`);
  console.log(`✅ SERVICE_KEY: ${supabaseServiceKey ? 'Set' : '❌ Missing'}\n`);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing required environment variables');
    return;
  }
  
  // Test anonymous connection
  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    console.log('Testing anonymous connection...');
    const { data, error } = await supabaseAnon
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Anonymous connection failed:', error.message);
    } else {
      console.log('✅ Anonymous connection successful');
    }
  } catch (error) {
    console.log('❌ Anonymous connection error:', error);
  }
  
  // Test service role connection (if available)
  if (supabaseServiceKey) {
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    
    try {
      console.log('Testing service role connection...');
      const { data: users, error } = await supabaseService.auth.admin.listUsers({
        page: 1,
        perPage: 1
      });
      
      if (error) {
        console.log('❌ Service role connection failed:', error.message);
      } else {
        console.log('✅ Service role connection successful');
        console.log(`   Found ${users.users.length} users in database`);
      }
    } catch (error) {
      console.log('❌ Service role connection error:', error);
    }
  }
  
  // Test table structure
  try {
    console.log('\nTesting table structure...');
    const { data, error } = await supabaseAnon
      .from('profiles')
      .select('*')
      .limit(0);
      
    if (error) {
      console.log('❌ Profiles table test failed:', error.message);
    } else {
      console.log('✅ Profiles table accessible');
    }
  } catch (error) {
    console.log('❌ Table structure test error:', error);
  }
  
  console.log('\n🏁 Database connection test completed');
}

testDatabaseConnection().catch(console.error);