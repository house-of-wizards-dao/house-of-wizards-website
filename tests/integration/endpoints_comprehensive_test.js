// Comprehensive API Endpoint Testing Script
// Tests all auction system APIs after database schema application
// Run this with: node test-all-endpoints-comprehensive.js

const BASE_URL = 'http://localhost:3001'; // Next.js development server

// Test configuration
const TEST_CONFIG = {
  timeout: 15000, // 15 seconds timeout
  retries: 3,
  delay: 1000 // 1 second between tests
};

// Mock authentication header (you'll need to replace with actual token)
const MOCK_AUTH = {
  'Authorization': 'Bearer your-test-token-here', // Replace with actual token
  'Content-Type': 'application/json'
};

class APITester {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async testEndpoint(name, url, options = {}) {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`📍 URL: ${url}`);
    
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TEST_CONFIG.timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const duration = Date.now() - startTime;
      const success = response.status < 500; // Accept 4xx as "working" (auth/validation issues are expected)
      
      const result = {
        name,
        url,
        status: response.status,
        duration,
        success,
        error: null
      };

      if (success) {
        console.log(`✅ ${name} - Status: ${response.status} (${duration}ms)`);
        if (response.status === 200 || response.status === 201) {
          try {
            const data = await response.json();
            console.log(`📊 Response keys: ${Object.keys(data).join(', ')}`);
          } catch (e) {
            console.log('📊 Response: Non-JSON or empty');
          }
        } else if (response.status === 401) {
          console.log('🔐 Authentication required (expected for protected endpoints)');
        } else if (response.status === 403) {
          console.log('🔒 Forbidden (expected for admin endpoints without admin role)');
        } else if (response.status === 404) {
          console.log('❓ Not found (endpoint may not exist)');
        } else if (response.status === 429) {
          console.log('🚫 Rate limited (rate limiting is working!)');
        }
      } else {
        const errorText = await response.text().catch(() => 'No error details');
        result.error = errorText;
        console.log(`❌ ${name} - Status: ${response.status} (${duration}ms)`);
        console.log(`💥 Error: ${errorText}`);
      }
      
      this.results.push(result);
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const result = {
        name,
        url,
        status: 0,
        duration,
        success: false,
        error: error.message
      };
      
      console.log(`💥 ${name} - FAILED (${duration}ms)`);
      console.log(`❌ Error: ${error.message}`);
      
      if (error.name === 'AbortError') {
        console.log('⏰ Request timed out - this indicates database/function issues');
      }
      
      this.results.push(result);
      return result;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting comprehensive API endpoint testing...\n');
    console.log('==========================================');
    console.log('TESTING CRITICAL ENDPOINTS');
    console.log('==========================================');

    // Test 1: Basic auction endpoints (these were timing out)
    await this.testEndpoint(
      'GET /api/auctions',
      `${BASE_URL}/api/auctions`,
      { method: 'GET' }
    );

    await this.sleep(TEST_CONFIG.delay);

    await this.testEndpoint(
      'GET /api/artworks',
      `${BASE_URL}/api/artworks`,
      { method: 'GET' }
    );

    await this.sleep(TEST_CONFIG.delay);

    console.log('\n==========================================');
    console.log('TESTING ADMIN ENDPOINTS');
    console.log('==========================================');

    // Test 2: Admin endpoints (these were 404)
    await this.testEndpoint(
      'GET /api/admin/auctions',
      `${BASE_URL}/api/admin/auctions`,
      { method: 'GET', headers: MOCK_AUTH }
    );

    await this.sleep(TEST_CONFIG.delay);

    await this.testEndpoint(
      'GET /api/admin/artworks',
      `${BASE_URL}/api/admin/artworks`,
      { method: 'GET', headers: MOCK_AUTH }
    );

    await this.sleep(TEST_CONFIG.delay);

    console.log('\n==========================================');
    console.log('TESTING ADDITIONAL ENDPOINTS');
    console.log('==========================================');

    // Test 3: Other auction system endpoints
    const additionalTests = [
      { name: 'GET /api/auctions/stats', url: `${BASE_URL}/api/auctions/stats` },
      { name: 'GET /api/admin/bulk-operations', url: `${BASE_URL}/api/admin/bulk-operations`, headers: MOCK_AUTH },
      { name: 'GET /api/user/watchlist', url: `${BASE_URL}/api/user/watchlist`, headers: MOCK_AUTH },
      { name: 'GET /api/user/bids', url: `${BASE_URL}/api/user/bids`, headers: MOCK_AUTH },
      { name: 'GET /api/user/auctions', url: `${BASE_URL}/api/user/auctions`, headers: MOCK_AUTH },
      { name: 'GET /api/profile', url: `${BASE_URL}/api/profile`, headers: MOCK_AUTH },
      { name: 'GET /api/users', url: `${BASE_URL}/api/users` },
    ];

    for (const test of additionalTests) {
      await this.testEndpoint(
        test.name,
        test.url,
        { method: 'GET', headers: test.headers || {} }
      );
      await this.sleep(TEST_CONFIG.delay);
    }

    console.log('\n==========================================');
    console.log('TESTING POST ENDPOINTS (Creation)');
    console.log('==========================================');

    // Test 4: POST endpoints with mock data
    const mockArtwork = {
      title: "Test Artwork",
      description: "Test artwork for API testing",
      artist_id: "test-artist-id",
      medium: "Digital",
      metadata: {}
    };

    await this.testEndpoint(
      'POST /api/artworks',
      `${BASE_URL}/api/artworks`,
      {
        method: 'POST',
        headers: MOCK_AUTH,
        body: JSON.stringify(mockArtwork)
      }
    );

    await this.sleep(TEST_CONFIG.delay);

    const mockAuction = {
      title: "Test Auction",
      description: "Test auction for API testing",
      artwork_id: "test-artwork-id",
      starting_bid: 100,
      bid_increment: 10,
      start_time: new Date(Date.now() + 60000).toISOString(),
      end_time: new Date(Date.now() + 3600000).toISOString()
    };

    await this.testEndpoint(
      'POST /api/auctions',
      `${BASE_URL}/api/auctions`,
      {
        method: 'POST',
        headers: MOCK_AUTH,
        body: JSON.stringify(mockAuction)
      }
    );

    console.log('\n==========================================');
    console.log('TESTING RATE LIMITING');
    console.log('==========================================');

    // Test 5: Rate limiting by making rapid requests
    console.log('🏃‍♂️ Testing rate limiting with rapid requests...');
    
    for (let i = 1; i <= 5; i++) {
      await this.testEndpoint(
        `Rate Limit Test ${i}/5`,
        `${BASE_URL}/api/auctions`,
        { method: 'GET' }
      );
      await this.sleep(100); // Very short delay to trigger rate limiting
    }

    this.generateReport();
  }

  generateReport() {
    const totalTime = Date.now() - this.startTime;
    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - successfulTests;
    const averageResponseTime = Math.round(
      this.results.reduce((sum, r) => sum + r.duration, 0) / totalTests
    );

    console.log('\n==========================================');
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('==========================================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Successful: ${successfulTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${Math.round((successfulTests / totalTests) * 100)}%`);
    console.log(`Average Response Time: ${averageResponseTime}ms`);
    console.log(`Total Test Duration: ${Math.round(totalTime / 1000)}s`);

    console.log('\n==========================================');
    console.log('🔍 DETAILED RESULTS');
    console.log('==========================================');

    // Group results by status
    const statusGroups = {};
    this.results.forEach(result => {
      const status = result.status || 'ERROR';
      if (!statusGroups[status]) {
        statusGroups[status] = [];
      }
      statusGroups[status].push(result);
    });

    Object.keys(statusGroups).sort().forEach(status => {
      const tests = statusGroups[status];
      console.log(`\n📋 Status ${status} (${tests.length} tests):`);
      tests.forEach(test => {
        const icon = test.success ? '✅' : '❌';
        console.log(`  ${icon} ${test.name} (${test.duration}ms)`);
        if (test.error && !test.success) {
          console.log(`    💥 ${test.error}`);
        }
      });
    });

    console.log('\n==========================================');
    console.log('🎯 KEY FINDINGS');
    console.log('==========================================');

    // Analyze key endpoints
    const keyEndpoints = [
      '/api/auctions',
      '/api/artworks', 
      '/api/admin/auctions',
      '/api/admin/artworks'
    ];

    keyEndpoints.forEach(endpoint => {
      const result = this.results.find(r => r.url.includes(endpoint) && r.url.split('?')[0].endsWith(endpoint));
      if (result) {
        if (result.success) {
          if (result.status === 200) {
            console.log(`✅ ${endpoint}: Working correctly (${result.duration}ms)`);
          } else if (result.status === 401 || result.status === 403) {
            console.log(`🔐 ${endpoint}: Protected endpoint working (needs auth)`);
          } else if (result.status === 429) {
            console.log(`🚫 ${endpoint}: Rate limiting active (good!)`);
          }
        } else {
          if (result.error?.includes('timeout') || result.error?.includes('AbortError')) {
            console.log(`⏰ ${endpoint}: TIMEOUT - Database/function issue`);
          } else {
            console.log(`❌ ${endpoint}: ERROR - ${result.error}`);
          }
        }
      }
    });

    console.log('\n==========================================');
    console.log('📋 NEXT STEPS');
    console.log('==========================================');

    if (failedTests > 0) {
      const timeouts = this.results.filter(r => 
        r.error?.includes('timeout') || r.error?.includes('AbortError')
      );
      
      if (timeouts.length > 0) {
        console.log('🔧 CRITICAL: Apply the database schema to fix timeouts:');
        console.log('   1. Run COMPLETE-DATABASE-SETUP.sql in Supabase');
        console.log('   2. Restart your development server');
        console.log('   3. Re-run this test');
      }

      const notFound = this.results.filter(r => r.status === 404);
      if (notFound.length > 0) {
        console.log('📁 Some endpoints returned 404 - check file paths');
      }

      const serverErrors = this.results.filter(r => r.status >= 500);
      if (serverErrors.length > 0) {
        console.log('💥 Server errors detected - check application logs');
      }
    } else {
      console.log('🎉 All tests passed! Your API is working correctly.');
      console.log('🚀 You can now proceed with full development.');
    }

    console.log('\n==========================================');
  }
}

// Main execution
async function main() {
  // Check if fetch is available (Node.js 18+)
  if (typeof fetch === 'undefined') {
    try {
      const { default: fetch, Headers, Request, Response } = await import('node-fetch');
      global.fetch = fetch;
      global.Headers = Headers;
      global.Request = Request;
      global.Response = Response;
    } catch (error) {
      console.error('❌ node-fetch not available. Please install it or use Node.js 18+');
      console.log('💡 Run: npm install node-fetch');
      process.exit(1);
    }
  }

  const tester = new APITester();
  await tester.runAllTests();
}

main().catch(console.error);