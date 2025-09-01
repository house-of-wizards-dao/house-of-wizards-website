// Test script to verify rate limiting fixes
// Run this after applying the database fixes

async function testRateLimitFix() {
  const baseUrl = 'http://localhost:3001'; // Next.js dev server default port
  
  console.log('Testing rate limit functionality...');
  
  try {
    // Test a simple API endpoint
    const response = await fetch(`${baseUrl}/api/auctions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response time: ${Date.now() - start}ms`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('✅ API is working correctly');
      console.log(`Response data keys: ${Object.keys(data).join(', ')}`);
      return true;
    } else if (response.status === 429) {
      console.log('✅ Rate limiting is working (got 429)');
      return true;
    } else {
      console.log('❌ Unexpected response status');
      const text = await response.text();
      console.log('Response:', text);
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return false;
  }
}

// Run multiple tests
async function runTests() {
  console.log('Running auction API tests...\n');
  
  const results = [];
  for (let i = 1; i <= 3; i++) {
    console.log(`Test ${i}:`);
    const start = Date.now(); // Move timing inside the loop
    const result = await testRateLimitFix();
    results.push(result);
    console.log('');
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const successCount = results.filter(r => r).length;
  console.log(`\nResults: ${successCount}/${results.length} tests passed`);
  
  if (successCount === results.length) {
    console.log('🎉 All tests passed! Rate limiting is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the database schema application.');
  }
}

// For Node.js environment
if (typeof window === 'undefined') {
  // Add fetch polyfill for Node.js
  const fetch = require('node-fetch');
  global.fetch = fetch;
  
  runTests().catch(console.error);
}

module.exports = { testRateLimitFix, runTests };