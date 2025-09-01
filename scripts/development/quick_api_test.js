// Quick API Test - Verify Critical Fixes
// Run this after applying COMPLETE-DATABASE-SETUP.sql
// Usage: node quick-api-test.js

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(name, url, timeout = 10000) {
  console.log(`\n🧪 Testing ${name}...`);
  console.log(`📍 ${url}`);
  
  const start = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    const duration = Date.now() - start;
    
    if (response.ok) {
      console.log(`✅ SUCCESS: ${response.status} (${duration}ms)`);
      try {
        const data = await response.json();
        console.log(`📊 Response: ${JSON.stringify(data).substring(0, 100)}...`);
      } catch (e) {
        console.log(`📊 Response: Non-JSON content`);
      }
      return true;
    } else if (response.status === 401 || response.status === 403) {
      console.log(`🔐 PROTECTED: ${response.status} (${duration}ms) - Auth required`);
      return true; // This is expected behavior
    } else if (response.status === 429) {
      console.log(`🚫 RATE LIMITED: ${response.status} (${duration}ms) - Rate limiting works!`);
      return true; // This means rate limiting is working
    } else {
      console.log(`❌ ERROR: ${response.status} (${duration}ms)`);
      const text = await response.text().catch(() => '');
      console.log(`💥 Details: ${text.substring(0, 200)}`);
      return false;
    }
    
  } catch (error) {
    const duration = Date.now() - start;
    
    if (error.name === 'AbortError') {
      console.log(`⏰ TIMEOUT: ${duration}ms - Database issue!`);
      console.log(`🔧 Action needed: Run COMPLETE-DATABASE-SETUP.sql in Supabase`);
    } else {
      console.log(`💥 ERROR: ${error.message} (${duration}ms)`);
    }
    return false;
  }
}

async function runQuickTest() {
  console.log('🚀 Quick API Test - Critical Endpoints');
  console.log('=====================================');
  
  // Add fetch polyfill for older Node versions
  if (typeof fetch === 'undefined') {
    try {
      const { default: fetch } = await import('node-fetch');
      global.fetch = fetch;
    } catch (error) {
      console.log('❌ Please install node-fetch or use Node.js 18+');
      console.log('💡 Run: npm install node-fetch');
      return;
    }
  }
  
  const tests = [
    { name: 'Public Auctions API', url: `${BASE_URL}/api/auctions` },
    { name: 'Public Artworks API', url: `${BASE_URL}/api/artworks` },
    { name: 'Admin Auctions API', url: `${BASE_URL}/api/admin/auctions` },
    { name: 'Admin Artworks API', url: `${BASE_URL}/api/admin/artworks` },
  ];
  
  const results = [];
  
  for (const test of tests) {
    const success = await testEndpoint(test.name, test.url);
    results.push({ ...test, success });
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n=====================================');
  console.log('📊 RESULTS SUMMARY');
  console.log('=====================================');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✨ Your API is working correctly');
    console.log('🚀 Ready for development');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED');
    
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      console.log('\n🔧 ACTION REQUIRED:');
      console.log('1. Run COMPLETE-DATABASE-SETUP.sql in Supabase SQL Editor');
      console.log('2. Restart your development server (npm run dev)');
      console.log('3. Run this test again');
      
      console.log('\n📋 Failed endpoints:');
      failed.forEach(f => console.log(`  ❌ ${f.name}`));
    }
  }
  
  console.log('\n=====================================');
}

runQuickTest().catch(console.error);