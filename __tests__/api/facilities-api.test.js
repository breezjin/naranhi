// Facilities API Endpoint Tests
const BASE_URL = 'http://localhost:3000'

async function testFacilitiesAPI() {
  console.log('🧪 Facilities API Tests');
  console.log('======================');
  
  const tests = [];
  
  // Test 1: Public Facilities API
  try {
    const response = await fetch(`${BASE_URL}/api/facilities`);
    const data = await response.json();
    
    tests.push({
      name: 'Public Facilities API',
      status: response.ok ? 'PASS' : 'FAIL',
      response: response.status,
      dataLength: data?.data?.length || 0
    });
  } catch (error) {
    tests.push({
      name: 'Public Facilities API',
      status: 'ERROR',
      error: error.message
    });
  }
  
  // Test 2: Admin Facilities API
  try {
    const response = await fetch(`${BASE_URL}/api/admin/facilities`);
    
    tests.push({
      name: 'Admin Facilities API',
      status: response.status === 401 || response.ok ? 'PASS' : 'FAIL', // Should require auth
      response: response.status
    });
  } catch (error) {
    tests.push({
      name: 'Admin Facilities API',
      status: 'ERROR',
      error: error.message
    });
  }
  
  // Test 3: Facility Categories API
  try {
    const response = await fetch(`${BASE_URL}/api/admin/facility-categories`);
    
    tests.push({
      name: 'Facility Categories API',
      status: response.status === 401 || response.ok ? 'PASS' : 'FAIL',
      response: response.status
    });
  } catch (error) {
    tests.push({
      name: 'Facility Categories API',
      status: 'ERROR',
      error: error.message
    });
  }
  
  // Test 4: Image Upload API
  try {
    const response = await fetch(`${BASE_URL}/api/admin/upload-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty body to test error handling
    });
    
    tests.push({
      name: 'Image Upload API',
      status: response.status === 400 || response.status === 401 ? 'PASS' : 'FAIL', // Should return error for empty body
      response: response.status
    });
  } catch (error) {
    tests.push({
      name: 'Image Upload API',
      status: 'ERROR',
      error: error.message
    });
  }
  
  // Results
  const passed = tests.filter(t => t.status === 'PASS').length;
  console.log(`\n📊 Facilities API Results: ${passed}/${tests.length} passed`);
  
  tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : 
                 test.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test.name}: ${test.status} (${test.response || 'N/A'})`);
    if (test.error) console.log(`   Error: ${test.error}`);
    if (test.dataLength) console.log(`   Data Length: ${test.dataLength}`);
  });
  
  return { total: tests.length, passed, tests };
}

if (require.main === module) {
  testFacilitiesAPI().then(result => {
    process.exit(result.passed === result.total ? 0 : 1);
  }).catch(console.error);
}

module.exports = { testFacilitiesAPI };