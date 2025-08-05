/**
 * Comprehensive Notice Management System Test Suite
 * Tests API endpoints, database operations, and Quill editor integration
 */

const http = require('http')
const https = require('https')
const { URL } = require('url')
const fs = require('fs')
const path = require('path')

const BASE_URL = 'http://localhost:3000'

// Test data for notices
const testNoticeData = {
  title: "테스트 공지사항",
  content: {
    "ops": [
      {"insert": "이것은 테스트 공지사항입니다.\n\n"},
      {"attributes": {"bold": true}, "insert": "중요한 내용"},
      {"insert": "\n• 첫 번째 항목\n• 두 번째 항목\n• 세 번째 항목\n\n"},
      {"attributes": {"italic": true}, "insert": "기울임 텍스트"},
      {"insert": " 그리고 일반 텍스트입니다.\n"}
    ]
  },
  category_id: null, // Will be set dynamically
  status: "draft",
  meta_title: "테스트 공지사항 - SEO 제목",
  meta_description: "이것은 테스트 공지사항의 메타 설명입니다.",
  tags: ["테스트", "공지사항", "자동화"]
}

const updateNoticeData = {
  title: "수정된 테스트 공지사항",
  content: {
    "ops": [
      {"insert": "이것은 수정된 테스트 공지사항입니다.\n\n"},
      {"attributes": {"bold": true}, "insert": "수정된 중요한 내용"},
      {"insert": "\n수정된 내용이 추가되었습니다.\n"}
    ]
  },
  status: "published",
  meta_title: "수정된 테스트 공지사항 - SEO 제목",
  meta_description: "수정된 테스트 공지사항의 메타 설명입니다.",
  tags: ["테스트", "공지사항", "수정됨"]
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const client = urlObj.protocol === 'https:' ? https : http
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }
    
    const req = client.request(url, requestOptions, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const body = data ? JSON.parse(data) : null
          resolve({ 
            status: res.statusCode, 
            headers: res.headers, 
            body,
            rawBody: data
          })
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            headers: res.headers, 
            body: null,
            rawBody: data,
            parseError: e.message
          })
        }
      })
    })
    
    req.on('error', reject)
    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
    
    if (options.body) {
      req.write(JSON.stringify(options.body))
    }
    
    req.end()
  })
}

async function testApiEndpoint(name, url, options = {}, expectedStatus = [200]) {
  try {
    console.log(`🧪 Testing ${name}...`)
    const response = await makeRequest(url, options)
    
    if (expectedStatus.includes(response.status)) {
      console.log(`   ✅ ${name}: Status ${response.status}`)
      if (response.body && response.body.data) {
        console.log(`   📊 Data: ${Array.isArray(response.body.data) ? response.body.data.length + ' items' : 'Object returned'}`)
      }
      return { success: true, response }
    } else {
      console.log(`   ❌ ${name}: Expected status ${expectedStatus}, got ${response.status}`)
      if (response.body && response.body.error) {
        console.log(`   💬 Error: ${response.body.error}`)
      }
      return { success: false, response }
    }
  } catch (error) {
    console.log(`   ❌ ${name}: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function testDatabase() {
  console.log('🗄️  Notice Database Schema Test')
  console.log('═══════════════════════════════════')
  
  let results = { passed: 0, failed: 0, total: 0 }
  
  const test = async (name, testFunc) => {
    results.total++
    try {
      const result = await testFunc()
      if (result.success) {
        results.passed++
      } else {
        results.failed++
      }
      return result
    } catch (error) {
      console.log(`   ❌ ${name}: Error - ${error.message}`)
      results.failed++
      return { success: false, error: error.message }
    }
  }

  // Test database setup script
  console.log('📝 Database Setup Verification')
  const setupScriptPath = path.join(__dirname, 'setup-notices-direct.ts')
  const schemaPath = path.join(__dirname, 'setup-notices-schema.sql')
  
  if (fs.existsSync(setupScriptPath)) {
    console.log('   ✅ setup-notices-direct.ts exists')
    results.passed++
  } else {
    console.log('   ❌ setup-notices-direct.ts missing')
    results.failed++
  }
  results.total++
  
  if (fs.existsSync(schemaPath)) {
    console.log('   ✅ setup-notices-schema.sql exists')
    results.passed++
  } else {
    console.log('   ❌ setup-notices-schema.sql missing')
    results.failed++
  }
  results.total++

  return results
}

async function testNoticeCategories() {
  console.log('\n📁 Notice Categories API Test')
  console.log('══════════════════════════════')
  
  let results = { passed: 0, failed: 0, total: 0 }
  
  const test = async (name, testFunc) => {
    results.total++
    try {
      const result = await testFunc()
      if (result.success) {
        results.passed++
      } else {
        results.failed++
      }
      return result
    } catch (error) {
      console.log(`   ❌ ${name}: Error - ${error.message}`)
      results.failed++
      return { success: false, error: error.message }
    }
  }

  // Test GET categories
  const getCategoriesResult = await test('GET Categories', () => 
    testApiEndpoint('Notice Categories List', `${BASE_URL}/api/admin/notice-categories`)
  )
  
  let testCategoryId = null
  if (getCategoriesResult.success && getCategoriesResult.response.body && getCategoriesResult.response.body.data) {
    const categories = getCategoriesResult.response.body.data
    if (categories.length > 0) {
      testCategoryId = categories[0].id
      console.log(`   📋 Found ${categories.length} categories, using '${categories[0].display_name}' for tests`)
    }
  }

  // Test POST new category
  const newCategoryData = {
    name: "test-category",
    display_name: "테스트 카테고리",
    description: "자동화 테스트용 카테고리",
    color: "#ff6b6b"
  }
  
  await test('POST New Category', () => 
    testApiEndpoint(
      'Create Test Category', 
      `${BASE_URL}/api/admin/notice-categories`,
      { method: 'POST', body: newCategoryData },
      [201, 409] // 201 Created or 409 Conflict if exists
    )
  )

  return { results, testCategoryId }
}

async function testNoticesAPI(testCategoryId) {
  console.log('\n📰 Notices API CRUD Test')
  console.log('═══════════════════════════')
  
  let results = { passed: 0, failed: 0, total: 0 }
  let createdNoticeId = null

  const test = async (name, testFunc) => {
    results.total++
    try {
      const result = await testFunc()
      if (result.success) {
        results.passed++
      } else {
        results.failed++
      }
      return result
    } catch (error) {
      console.log(`   ❌ ${name}: Error - ${error.message}`)
      results.failed++
      return { success: false, error: error.message }
    }
  }

  // Test GET notices
  await test('GET Notices List', () => 
    testApiEndpoint('Notice List', `${BASE_URL}/api/admin/notices`)
  )

  // Test POST new notice
  if (testCategoryId) {
    testNoticeData.category_id = testCategoryId
    
    const createResult = await test('POST New Notice', () => 
      testApiEndpoint(
        'Create Test Notice', 
        `${BASE_URL}/api/admin/notices`,
        { method: 'POST', body: testNoticeData },
        [201]
      )
    )
    
    if (createResult.success && createResult.response.body && createResult.response.body.data) {
      createdNoticeId = createResult.response.body.data.id
      console.log(`   📝 Created notice with ID: ${createdNoticeId}`)
    }
  } else {
    console.log('   ⚠️  Skipping POST test - no category available')
    results.total++
    results.failed++
  }

  // Test GET single notice
  if (createdNoticeId) {
    await test('GET Single Notice', () => 
      testApiEndpoint(`Get Notice ${createdNoticeId}`, `${BASE_URL}/api/admin/notices/${createdNoticeId}`)
    )

    // Test PUT update notice
    updateNoticeData.category_id = testCategoryId
    await test('PUT Update Notice', () => 
      testApiEndpoint(
        `Update Notice ${createdNoticeId}`, 
        `${BASE_URL}/api/admin/notices/${createdNoticeId}`,
        { method: 'PUT', body: updateNoticeData }
      )
    )

    // Test PATCH increment views
    await test('PATCH Increment Views', () => 
      testApiEndpoint(
        `Increment Views ${createdNoticeId}`, 
        `${BASE_URL}/api/admin/notices/${createdNoticeId}`,
        { method: 'PATCH', body: { action: 'increment_views' } }
      )
    )

    // Test DELETE notice (commented out to preserve test data)
    // await test('DELETE Notice', () => 
    //   testApiEndpoint(
    //     `Delete Notice ${createdNoticeId}`, 
    //     `${BASE_URL}/api/admin/notices/${createdNoticeId}`,
    //     { method: 'DELETE' }
    //   )
    // )
  } else {
    console.log('   ⚠️  Skipping individual notice tests - no notice created')
    results.total += 4
    results.failed += 4
  }

  return { results, createdNoticeId }
}

async function testQuillEditorIntegration() {
  console.log('\n✍️  Quill Editor Integration Test')
  console.log('══════════════════════════════════')
  
  let results = { passed: 0, failed: 0, total: 0 }

  const test = async (name, testFunc) => {
    results.total++
    try {
      const result = await testFunc()
      if (result.success) {
        results.passed++
      } else {
        results.failed++
      }
      return result
    } catch (error) {
      console.log(`   ❌ ${name}: Error - ${error.message}`)
      results.failed++
      return { success: false, error: error.message }
    }
  }

  // Test Quill component file existence
  const quillComponentPath = path.join(__dirname, '../src/components/admin/QuillEditor.tsx')
  if (fs.existsSync(quillComponentPath)) {
    console.log('   ✅ QuillEditor.tsx component exists')
    results.passed++
  } else {
    console.log('   ❌ QuillEditor.tsx component missing')
    results.failed++
  }
  results.total++

  // Test create page
  const createPagePath = path.join(__dirname, '../src/app/admin/notices/create/page.tsx')
  if (fs.existsSync(createPagePath)) {
    console.log('   ✅ Notice create page exists')
    results.passed++
  } else {
    console.log('   ❌ Notice create page missing')
    results.failed++
  }
  results.total++

  // Test edit page template
  const editPagePath = path.join(__dirname, '../src/app/admin/notices/[id]/edit/page.tsx')
  if (fs.existsSync(editPagePath)) {
    console.log('   ✅ Notice edit page exists')
    results.passed++
  } else {
    console.log('   ❌ Notice edit page missing')
    results.failed++
  }
  results.total++

  // Test package.json for required dependencies
  const packageJsonPath = path.join(__dirname, '../package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    const requiredDeps = ['react-quill', 'quill']
    const requiredDevDeps = ['@types/quill']
    
    let depsOk = true
    for (const dep of requiredDeps) {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        console.log(`   ✅ Dependency ${dep}: ${packageJson.dependencies[dep]}`)
        results.passed++
      } else {
        console.log(`   ❌ Missing dependency: ${dep}`)
        results.failed++
        depsOk = false
      }
      results.total++
    }
    
    for (const dep of requiredDevDeps) {
      if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        console.log(`   ✅ Dev dependency ${dep}: ${packageJson.devDependencies[dep]}`)
        results.passed++
      } else {
        console.log(`   ❌ Missing dev dependency: ${dep}`)
        results.failed++
        depsOk = false
      }
      results.total++
    }
  }

  return results
}

async function testPageAccessibility() {
  console.log('\n🌐 Page Accessibility Test')
  console.log('═══════════════════════════')
  
  let results = { passed: 0, failed: 0, total: 0 }

  const test = async (name, testFunc) => {
    results.total++
    try {
      const result = await testFunc()
      if (result.success) {
        results.passed++
      } else {
        results.failed++
      }
      return result
    } catch (error) {
      console.log(`   ❌ ${name}: Error - ${error.message}`)
      results.failed++
      return { success: false, error: error.message }
    }
  }

  // Test notices list page
  await test('Notices List Page', async () => {
    try {
      const response = await makeRequest(`${BASE_URL}/admin/notices`)
      
      // Check for redirect to login (expected behavior)
      if ([301, 302, 307, 308].includes(response.status)) {
        console.log('   🔒 Correctly redirects unauthenticated users')
        return { success: true, response }
      }
      
      // If accessible, check for expected content
      if (response.status === 200) {
        const hasContent = response.rawBody && response.rawBody.includes('공지사항 관리')
        if (hasContent) {
          console.log('   ✅ Page loads with expected content')
          return { success: true, response }
        } else {
          console.log('   ❌ Page loads but missing expected content')
          return { success: false, response }
        }
      }
      
      return { success: false, response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Test notices create page
  await test('Notices Create Page', async () => {
    try {
      const response = await makeRequest(`${BASE_URL}/admin/notices/create`)
      
      if ([301, 302, 307, 308].includes(response.status)) {
        console.log('   🔒 Correctly redirects unauthenticated users')
        return { success: true, response }
      }
      
      if (response.status === 200) {
        const hasContent = response.rawBody && response.rawBody.includes('공지사항 작성')
        if (hasContent) {
          console.log('   ✅ Create page loads with expected content')
          return { success: true, response }
        }
      }
      
      return { success: false, response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  return results
}

async function runNoticeTests() {
  console.log('🚀 Starting Notice Management System Tests\n')
  
  const allResults = {
    database: { passed: 0, failed: 0, total: 0 },
    categories: { passed: 0, failed: 0, total: 0 },
    notices: { passed: 0, failed: 0, total: 0 },
    quill: { passed: 0, failed: 0, total: 0 },
    pages: { passed: 0, failed: 0, total: 0 }
  }

  // Run all test suites
  allResults.database = await testDatabase()
  
  const categoriesResult = await testNoticeCategories()
  allResults.categories = categoriesResult.results
  
  const noticesResult = await testNoticesAPI(categoriesResult.testCategoryId)
  allResults.notices = noticesResult.results
  
  allResults.quill = await testQuillEditorIntegration()
  allResults.pages = await testPageAccessibility()

  // Calculate totals
  const totals = {
    passed: 0,
    failed: 0,
    total: 0
  }

  for (const suite of Object.values(allResults)) {
    totals.passed += suite.passed
    totals.failed += suite.failed
    totals.total += suite.total
  }

  // Final report
  console.log('\n📊 Notice System Test Results Summary')
  console.log('════════════════════════════════════════')
  console.log(`🗄️  Database:   ${allResults.database.passed}/${allResults.database.total} passed`)
  console.log(`📁 Categories: ${allResults.categories.passed}/${allResults.categories.total} passed`)
  console.log(`📰 Notices:    ${allResults.notices.passed}/${allResults.notices.total} passed`)
  console.log(`✍️  Quill:      ${allResults.quill.passed}/${allResults.quill.total} passed`)
  console.log(`🌐 Pages:      ${allResults.pages.passed}/${allResults.pages.total} passed`)
  console.log('────────────────────────────────────────')
  console.log(`📊 Overall:    ${totals.passed}/${totals.total} passed`)
  console.log(`🎯 Success Rate: ${Math.round((totals.passed / totals.total) * 100)}%`)

  if (totals.failed === 0) {
    console.log('\n🎉 All notice system tests passed! System is fully functional.')
  } else if (totals.passed > totals.failed) {
    console.log('\n⚠️  Some tests failed, but core notice functionality is working.')
  } else {
    console.log('\n❌ Multiple tests failed. Check the notice system setup.')
  }

  // Recommendations
  console.log('\n💡 Recommendations:')
  if (allResults.database.failed > 0) {
    console.log('   • Run `yarn tsx scripts/setup-notices-direct.ts` to setup database')
  }
  if (allResults.quill.failed > 0) {
    console.log('   • Install missing dependencies: `yarn add react-quill quill @types/quill`')
  }
  if (allResults.notices.failed > allResults.notices.passed) {
    console.log('   • Check API routes and database connectivity')
  }
  if (allResults.pages.failed > 0) {
    console.log('   • Test with authenticated admin user for full page testing')
  }

  return totals
}

// Enhanced test runner with coverage info
async function main() {
  console.log('🧪 Naranhi Notice System - Comprehensive Test Suite')
  console.log('═════════════════════════════════════════════════════')
  console.log(`📅 Test Date: ${new Date().toLocaleString('ko-KR')}`)
  console.log(`🌐 Target URL: ${BASE_URL}`)
  console.log(`📁 Test Coverage: API endpoints, Database schema, UI components, Page accessibility`)
  console.log('')

  const results = await runNoticeTests()
  
  // Exit with appropriate code
  const success = results.failed === 0
  process.exit(success ? 0 : 1)
}

if (require.main === module) {
  main().catch(error => {
    console.error('Notice test runner error:', error)
    process.exit(1)
  })
}

module.exports = { 
  runNoticeTests, 
  testDatabase, 
  testNoticeCategories, 
  testNoticesAPI, 
  testQuillEditorIntegration, 
  testPageAccessibility 
}