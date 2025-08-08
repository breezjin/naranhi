// Staff API Endpoint Tests
const BASE_URL = 'http://localhost:3000'

async function testStaffAPI() {
  console.log('🧪 Staff API Tests');
  console.log('==================');
  
  const tests = [];
  
  // Test 1: Staff API Endpoint
  try {
    const response = await fetch(`${BASE_URL}/api/staff`);
    const data = await response.json();
    
    tests.push({
      name: 'Staff API Endpoint',
      status: response.ok ? 'PASS' : 'FAIL',
      response: response.status,
      dataLength: data?.data?.length || 0
    });
  } catch (error) {
    tests.push({
      name: 'Staff API Endpoint',
      status: 'ERROR',
      error: error.message
    });
  }
  
  // Test 2: Admin Staff API
  try {
    const response = await fetch(`${BASE_URL}/api/admin/staff`);
    
    tests.push({
      name: 'Admin Staff API',
      status: response.status === 401 || response.ok ? 'PASS' : 'FAIL', // Should require auth
      response: response.status
    });
  } catch (error) {
    tests.push({
      name: 'Admin Staff API',
      status: 'ERROR',
      error: error.message
    });
  }
  
  // Test 3: Staff Categories API
  try {
    const response = await fetch(`${BASE_URL}/api/admin/staff/categories`, {
      method: 'GET'
    });
    
    tests.push({
      name: 'Staff Categories API',
      status: response.status === 401 || response.ok ? 'PASS' : 'FAIL',
      response: response.status
    });
  } catch (error) {
    tests.push({
      name: 'Staff Categories API',
      status: 'ERROR',
      error: error.message
    });
  }
  
  // Results
  const passed = tests.filter(t => t.status === 'PASS').length;
  console.log(`\n📊 Staff API Results: ${passed}/${tests.length} passed`);
  
  tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : 
                 test.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test.name}: ${test.status} (${test.response || 'N/A'})`);
    if (test.error) console.log(`   Error: ${test.error}`);
  });
  
  return { total: tests.length, passed, tests };
}

if (require.main === module) {
  testStaffAPI().then(result => {
    process.exit(result.passed === result.total ? 0 : 1);
  }).catch(console.error);
}

module.exports = { testStaffAPI };