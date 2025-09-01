// Comprehensive test script for all auction API endpoints
// Run this after applying the complete database schema

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

// Test endpoints configuration
const TEST_ENDPOINTS = [
  {
    name: 'List Auctions',
    method: 'GET',
    url: '/api/auctions',
    expectedStatus: 200,
    description: 'Should return array of auctions or empty array'
  },
  {
    name: 'List Artworks', 
    method: 'GET',
    url: '/api/artworks',
    expectedStatus: 200,
    description: 'Should return array of artworks or empty array'
  },
  {
    name: 'Admin - List All Auctions',
    method: 'GET', 
    url: '/api/admin/auctions',
    expectedStatus: [200, 401], // 401 if not authenticated
    description: 'Admin endpoint for auction management'
  },
  {
    name: 'Admin - List All Artworks',
    method: 'GET',
    url: '/api/admin/artworks', 
    expectedStatus: [200, 401],
    description: 'Admin endpoint for artwork management'
  }
];

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m', 
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test a single endpoint
async function testEndpoint(test) {
  console.log(`\n${colors.blue}Testing: ${test.name}${colors.reset}`);
  console.log(`${colors.cyan}${test.method} ${test.url}${colors.reset}`);
  console.log(`Description: ${test.description}`);
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${BASE_URL}${test.url}`, {
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000 // 10 second timeout
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const expectedStatuses = Array.isArray(test.expectedStatus) 
      ? test.expectedStatus 
      : [test.expectedStatus];
    
    const statusMatch = expectedStatuses.includes(response.status);
    const performanceGood = responseTime < 2000; // Under 2 seconds
    
    console.log(`Status: ${response.status} ${statusMatch ? '✅' : '❌'}`);
    console.log(`Response Time: ${responseTime}ms ${performanceGood ? '✅' : '⚠️ SLOW'}`);
    
    // Try to parse response body
    let bodyPreview = '';
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (Array.isArray(data)) {
          bodyPreview = `Array with ${data.length} items`;
        } else if (typeof data === 'object') {
          bodyPreview = `Object with keys: ${Object.keys(data).slice(0, 3).join(', ')}`;
        } else {
          bodyPreview = String(data).substring(0, 100);
        }
      } else {
        const text = await response.text();
        bodyPreview = text.substring(0, 100) + (text.length > 100 ? '...' : '');
      }
    } catch (parseError) {
      bodyPreview = 'Unable to parse response body';
    }
    
    console.log(`Response: ${bodyPreview}`);
    
    return {
      name: test.name,
      status: response.status,
      responseTime,
      statusMatch,
      performanceGood,
      success: statusMatch && performanceGood
    };
    
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`${colors.red}❌ Request failed: ${error.message}${colors.reset}`);
    console.log(`Time before failure: ${responseTime}ms`);
    
    return {
      name: test.name,
      status: 'ERROR',
      responseTime,
      statusMatch: false,
      performanceGood: false,
      success: false,
      error: error.message
    };
  }
}

// Run all tests
async function runAllTests() {
  console.log(`${colors.green}🚀 Starting comprehensive API endpoint tests${colors.reset}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const test of TEST_ENDPOINTS) {
    const result = await testEndpoint(test);
    results.push(result);
    
    // Brief pause between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary report
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.green}📊 TEST SUMMARY${colors.reset}`);
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const slow = results.filter(r => !r.performanceGood && r.status !== 'ERROR');
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  console.log(`⚠️  Slow (>2s): ${slow.length}/${results.length}`);
  
  if (failed.length > 0) {
    console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
    failed.forEach(result => {
      console.log(`- ${result.name}: ${result.status} ${result.error ? `(${result.error})` : ''}`);
    });
  }
  
  if (slow.length > 0) {
    console.log(`\n${colors.yellow}Slow Tests:${colors.reset}`);
    slow.forEach(result => {
      console.log(`- ${result.name}: ${result.responseTime}ms`);
    });
  }
  
  // Performance summary
  const avgResponseTime = results
    .filter(r => typeof r.responseTime === 'number')
    .reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  
  console.log(`\n📈 Average Response Time: ${Math.round(avgResponseTime)}ms`);
  
  // Final verdict
  if (successful.length === results.length) {
    console.log(`\n${colors.green}🎉 ALL TESTS PASSED! Database fix successful.${colors.reset}`);
  } else if (successful.length > 0) {
    console.log(`\n${colors.yellow}⚠️  PARTIAL SUCCESS: Some endpoints working.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}💥 ALL TESTS FAILED: Database schema needs attention.${colors.reset}`);
  }
  
  return results;
}

// Export for use as module
export { runAllTests, testEndpoint };

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}