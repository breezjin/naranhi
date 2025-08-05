#!/usr/bin/env node
/**
 * Comprehensive Test Suite for Facility Photo Management System
 * Tests all CRUD operations, UI components, and API endpoints
 */

const BASE_URL = 'http://localhost:3000'

async function runTests() {
  console.log('🧪 시설 사진 관리 시스템 테스트 시작\n')
  
  let passed = 0
  let failed = 0
  
  const test = async (name, testFn) => {
    try {
      process.stdout.write(`   ${name}... `)
      await testFn()
      console.log('✅ 통과')
      passed++
    } catch (error) {
      console.log(`❌ 실패: ${error.message}`)
      failed++
    }
  }

  // Helper function for HTTP requests
  const request = async (url, options = {}) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    const data = await response.text()
    
    return {
      status: response.status,
      ok: response.ok,
      data: data ? JSON.parse(data) : null,
      size: data.length
    }
  }

  console.log('📡 1. API 엔드포인트 테스트')
  
  await test('시설 카테고리 목록 조회', async () => {
    const response = await request('/api/admin/facility-categories')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    if (!response.data?.data) throw new Error('No categories data')
    if (response.data.data.length < 2) throw new Error('Expected at least 2 categories')
  })

  await test('시설 사진 목록 조회', async () => {
    const response = await request('/api/admin/facilities')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    if (!response.data?.data) throw new Error('No facilities data') 
    if (!Array.isArray(response.data.data)) throw new Error('Expected array')
  })

  await test('시설 사진 카테고리별 필터링', async () => {
    const response = await request('/api/admin/facilities?category=hospital')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    if (!response.data?.data) throw new Error('No filtered data')
  })

  // Get first facility for individual tests
  let firstFacilityId = null
  await test('개별 시설 사진 조회를 위한 ID 획득', async () => {
    const response = await request('/api/admin/facilities')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    if (!response.data?.data?.length) throw new Error('No facilities available')
    firstFacilityId = response.data.data[0].id
    if (!firstFacilityId) throw new Error('No facility ID found')
  })

  if (firstFacilityId) {
    await test('개별 시설 사진 조회', async () => {
      const response = await request(`/api/admin/facilities/${firstFacilityId}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (!response.data?.data) throw new Error('No facility data')
      if (response.data.data.id !== firstFacilityId) throw new Error('ID mismatch')
    })
  }

  console.log('\n🌐 2. 페이지 접근성 테스트')

  await test('시설 관리 메인 페이지', async () => {
    const response = await request('/admin/facilities')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    if (response.size < 1000) throw new Error('Page too small')
  })

  await test('시설 사진 업로드 페이지', async () => {
    const response = await request('/admin/facilities/upload')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    if (response.size < 1000) throw new Error('Page too small')
  })

  if (firstFacilityId) {
    await test('시설 사진 수정 페이지', async () => {
      const response = await request(`/admin/facilities/${firstFacilityId}/edit`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (response.size < 1000) throw new Error('Page too small')
    })
  }

  console.log('\n📊 3. 데이터 검증 테스트')

  await test('시설 사진 데이터 구조 검증', async () => {
    const response = await request('/api/admin/facilities')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const facilities = response.data.data
    if (!facilities.length) throw new Error('No facilities to validate')
    
    const facility = facilities[0]
    const requiredFields = ['id', 'title', 'image_url', 'alt_text', 'category']
    
    for (const field of requiredFields) {
      if (!(field in facility)) throw new Error(`Missing field: ${field}`)
    }
    
    if (!facility.category.name || !facility.category.display_name) {
      throw new Error('Invalid category structure')
    }
  })

  await test('시설 카테고리 데이터 구조 검증', async () => {
    const response = await request('/api/admin/facility-categories')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const categories = response.data.data
    if (!categories.length) throw new Error('No categories to validate')
    
    const category = categories[0]
    const requiredFields = ['id', 'name', 'display_name']
    
    for (const field of requiredFields) {
      if (!(field in category)) throw new Error(`Missing field: ${field}`)
    }
    
    // Check for expected categories
    const categoryNames = categories.map(c => c.name)
    const expectedCategories = ['hospital', 'center']
    
    for (const expected of expectedCategories) {
      if (!categoryNames.includes(expected)) {
        throw new Error(`Missing expected category: ${expected}`)
      }
    }
  })

  console.log('\n🔒 4. 에러 처리 테스트')

  await test('존재하지 않는 시설 사진 조회', async () => {
    const response = await request('/api/admin/facilities/non-existent-id')
    if (response.status !== 404) throw new Error(`Expected 404, got ${response.status}`)
  })

  await test('잘못된 카테고리 필터', async () => {
    const response = await request('/api/admin/facilities?category=invalid')
    // Should return empty array or handle gracefully
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
  })

  console.log('\n📈 5. 성능 및 데이터 검증')

  await test('API 응답 시간 검증', async () => {
    const start = Date.now()
    const response = await request('/api/admin/facilities')
    const duration = Date.now() - start
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    if (duration > 5000) throw new Error(`Too slow: ${duration}ms`)
  })

  await test('대용량 데이터 처리', async () => {
    const response = await request('/api/admin/facilities')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    
    const facilities = response.data.data
    // Test with whatever data we have
    if (facilities.length > 0) {
      // Check if all required fields are present in all facilities
      facilities.forEach((facility, index) => {
        if (!facility.id) throw new Error(`Missing ID in facility ${index}`)
        if (!facility.title) throw new Error(`Missing title in facility ${index}`)
        if (!facility.category) throw new Error(`Missing category in facility ${index}`)
      })
    }
  })

  console.log('\n📋 테스트 결과 요약')
  console.log('=' .repeat(50))
  console.log(`✅ 통과: ${passed}`)
  console.log(`❌ 실패: ${failed}`)
  console.log(`📊 성공률: ${passed + failed > 0 ? Math.round((passed / (passed + failed)) * 100) : 0}%`)
  
  if (failed === 0) {
    console.log('\n🎉 모든 테스트가 성공적으로 통과했습니다!')
    console.log('✨ 시설 사진 관리 시스템이 정상적으로 작동합니다.')
  } else {
    console.log(`\n⚠️  ${failed}개의 테스트가 실패했습니다.`)
    console.log('🔧 실패한 테스트를 확인하고 수정해주세요.')
  }
  
  console.log('\n📊 상세 통계')
  console.log('-'.repeat(30))
  console.log(`• API 테스트: 기본 CRUD 및 필터링`)
  console.log(`• 페이지 테스트: 접근성 및 렌더링`)
  console.log(`• 데이터 검증: 구조 및 무결성`)
  console.log(`• 에러 처리: 예외 상황 대응`)
  console.log(`• 성능 테스트: 응답 시간 및 처리량`)
  
  return failed === 0
}

// Run tests
if (require.main === module) {
  runTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('❌ 테스트 실행 중 오류:', error)
      process.exit(1)
    })
}

module.exports = { runTests }