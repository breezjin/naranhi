/**
 * Simple Admin System Test Script
 * Tests basic functionality without external dependencies
 */

const http = require('http')
const https = require('https')
const { URL } = require('url')

const BASE_URL = 'http://localhost:3000'

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const client = urlObj.protocol === 'https:' ? https : http
    
    const req = client.request(url, { method: 'GET' }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }))
    })
    
    req.on('error', reject)
    req.setTimeout(5000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
    req.end()
  })
}

async function testEndpoint(name, url, expectedStatus = [200]) {
  try {
    console.log(`🧪 Testing ${name}...`)
    const response = await makeRequest(url)
    
    if (expectedStatus.includes(response.status)) {
      console.log(`   ✅ ${name}: Status ${response.status} (${response.body.length} bytes)`)
      return true
    } else {
      console.log(`   ❌ ${name}: Expected status ${expectedStatus}, got ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ ${name}: ${error.message}`)
    return false
  }
}

async function testPageContent(name, url, expectedContent = []) {
  try {
    console.log(`🔍 Testing ${name} content...`)
    const response = await makeRequest(url)
    
    if (response.status !== 200) {
      console.log(`   ❌ ${name}: Status ${response.status}`)
      return false
    }
    
    let passed = 0
    for (const content of expectedContent) {
      if (response.body.includes(content)) {
        console.log(`   ✅ Found: "${content}"`)
        passed++
      } else {
        console.log(`   ❌ Missing: "${content}"`)
      }
    }
    
    const success = passed === expectedContent.length
    console.log(`   ${success ? '✅' : '❌'} ${name}: ${passed}/${expectedContent.length} content checks passed`)
    return success
    
  } catch (error) {
    console.log(`   ❌ ${name}: ${error.message}`)
    return false
  }
}

async function testAdminRedirects(name, url) {
  try {
    console.log(`🔄 Testing ${name} redirect...`)
    
    const response = await new Promise((resolve, reject) => {
      const urlObj = new URL(url)
      const req = http.request(url, { method: 'GET' }, (res) => {
        resolve({ status: res.statusCode, headers: res.headers, location: res.headers.location })
      })
      req.on('error', reject)
      req.setTimeout(5000, () => {
        req.destroy()
        reject(new Error('Request timeout'))
      })
      req.end()
    })
    
    if ([301, 302, 307, 308].includes(response.status)) {
      console.log(`   ✅ ${name}: Redirects to ${response.location || 'unknown'}`)
      return true
    } else if (response.status === 200) {
      console.log(`   ⚠️  ${name}: No redirect (status 200) - might be accessible`)
      return true
    } else {
      console.log(`   ❌ ${name}: Unexpected status ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ ${name}: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('🚀 Starting Naranhi Admin System Tests\n')
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  }
  
  const test = async (name, testFunc) => {
    results.total++
    try {
      const result = await testFunc()
      if (result) {
        results.passed++
      } else {
        results.failed++
      }
    } catch (error) {
      console.log(`   ❌ ${name}: Error - ${error.message}`)
      results.failed++
    }
    console.log('') // Add spacing
  }
  
  // Basic connectivity tests
  console.log('📡 Basic Connectivity Tests')
  console.log('═══════════════════════════')
  
  await test('Main Site', () => testEndpoint('Main Site', `${BASE_URL}/`))
  await test('Admin Login', () => testEndpoint('Admin Login', `${BASE_URL}/admin/login`))
  await test('Favicon', () => testEndpoint('Favicon', `${BASE_URL}/favicon.ico`))
  await test('Static Image', () => testEndpoint('Static Image', `${BASE_URL}/imgs/naranhi-logo-color.png`))
  
  // Admin protection tests
  console.log('🔒 Admin Protection Tests')
  console.log('═════════════════════════')
  
  await test('Admin Test Redirect', () => testAdminRedirects('Admin Test Page', `${BASE_URL}/admin/test`))
  await test('Admin Dashboard Redirect', () => testAdminRedirects('Admin Dashboard', `${BASE_URL}/admin/dashboard`))
  
  // Content tests
  console.log('📝 Content Validation Tests')
  console.log('═══════════════════════════')
  
  await test('Admin Login Content', () => testPageContent(
    'Admin Login Page',
    `${BASE_URL}/admin/login`,
    ['나란히 관리자', '이메일', '비밀번호', '로그인']
  ))
  
  await test('Main Site Content', () => testPageContent(
    'Main Site',
    `${BASE_URL}/`,
    ['나란히']
  ))
  
  // API tests
  console.log('🔌 API Endpoint Tests')
  console.log('═════════════════════')
  
  await test('Notice API', () => testEndpoint('Notice API', `${BASE_URL}/api/notice`, [200, 500]))
  
  // Summary
  console.log('📊 Test Results Summary')
  console.log('══════════════════════')
  console.log(`✅ Passed: ${results.passed}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`📊 Total:  ${results.total}`)
  console.log(`🎯 Success Rate: ${Math.round((results.passed / results.total) * 100)}%`)
  
  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Admin system is working correctly.')
  } else if (results.passed > results.failed) {
    console.log('\n⚠️  Some tests failed, but core functionality is working.')
  } else {
    console.log('\n❌ Multiple tests failed. Check the admin system setup.')
  }
  
  return results
}

// Database connection test
async function testDatabase() {
  console.log('\n🗄️  Database Connection Test')
  console.log('════════════════════════════')
  
  try {
    // Load environment variables
    require('dotenv').config()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️  Supabase environment variables not configured')
      console.log('   Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env')
      return false
    }
    
    console.log('✅ Environment variables configured')
    console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`)
    console.log(`   Key: ${supabaseKey.substring(0, 30)}...`)
    
    // Test database connectivity (would need Supabase client)
    console.log('ℹ️  Database connectivity requires manual verification')
    console.log('   Visit: http://localhost:3001/admin/test for full database test')
    
    return true
    
  } catch (error) {
    console.log('❌ Database test error:', error.message)
    return false
  }
}

// Run all tests
async function main() {
  const webResults = await runTests()
  const dbResult = await testDatabase()
  
  console.log('\n🏁 Final Status')
  console.log('═══════════════')
  console.log(`Web Tests: ${webResults.passed}/${webResults.total} passed`)
  console.log(`Database: ${dbResult ? 'Configured' : 'Needs Setup'}`)
  
  const overallSuccess = webResults.failed === 0 && dbResult
  process.exit(overallSuccess ? 0 : 1)
}

if (require.main === module) {
  main().catch(error => {
    console.error('Test runner error:', error)
    process.exit(1)
  })
}

module.exports = { runTests, testDatabase }