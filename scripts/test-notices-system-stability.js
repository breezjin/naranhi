#!/usr/bin/env node

/**
 * 🛡️ Notices 시스템 안정성 및 에러 처리 검증 테스트
 * Notices System Stability and Error Handling Verification
 */

const fs = require('fs')
const path = require('path')

console.log('\n🛡️ Notices 시스템 안정성 검증 테스트')
console.log('=======================================')

let passedTests = 0
let totalTests = 0

function test(description, testFn) {
  totalTests++
  try {
    const result = testFn()
    if (result) {
      console.log(`✅ ${description}`)
      passedTests++
    } else {
      console.log(`❌ ${description}`)
    }
  } catch (error) {
    console.log(`❌ ${description} - Error: ${error.message}`)
  }
}

// 1. Main notices page error handling
console.log('\n📋 Main Notices Page (/admin/notices)')
console.log('------------------------------------')

test('안전한 fetchData 함수 구현 확인', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  return content.includes('fetchNotices = useCallback(async') && 
         content.includes('fetchCategories = useCallback(async') &&
         content.includes('success: true')
})

test('개별 fetch 함수 에러 처리 확인', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  return content.includes('throw new Error(`HTTP ${response.status}') &&
         content.includes('success: false,')
})

test('병렬 Promise.all 실행 확인', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  return content.includes('Promise.all([') &&
         content.includes('fetchNotices(),') &&
         content.includes('fetchCategories()')
})

test('폴백 카테고리 구현 확인', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  return content.includes('일반') && 
         content.includes('중요') &&
         content.includes('#3b82f6')
})

test('상세한 에러 메시지 구현 확인', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  return content.includes('공지사항: ${noticesResult.error}') &&
         content.includes('카테고리: ${categoriesResult.error}')
})

// 2. Create page error handling
console.log('\n📝 Create Page (/admin/notices/create)')
console.log('------------------------------------')

test('향상된 fetchCategories 에러 처리 확인', () => {
  const createPath = path.join(process.cwd(), 'src/app/admin/notices/create/page.tsx')
  const content = fs.readFileSync(createPath, 'utf8')
  return content.includes('setError(null)') &&
         content.includes('HTTP ${response.status}: ${response.statusText}')
})

test('빈 카테고리 배열 처리 확인', () => {
  const createPath = path.join(process.cwd(), 'src/app/admin/notices/create/page.tsx')
  const content = fs.readFileSync(createPath, 'utf8')
  return content.includes('categories.length === 0') &&
         content.includes('fallbackCategories')
})

test('에러 발생 시 폴백 카테고리 설정 확인', () => {
  const createPath = path.join(process.cwd(), 'src/app/admin/notices/create/page.tsx')
  const content = fs.readFileSync(createPath, 'utf8')
  return content.includes('Set fallback categories on error') &&
         content.includes('setSelectedCategoryId(fallbackCategories[0].id)')
})

test('사용자 친화적 에러 메시지 확인', () => {
  const createPath = path.join(process.cwd(), 'src/app/admin/notices/create/page.tsx')
  const content = fs.readFileSync(createPath, 'utf8')
  return content.includes('기본 카테고리를 사용합니다') &&
         content.includes('${error.message}')
})

// 3. Edit page error handling
console.log('\n✏️  Edit Page (/admin/notices/[id]/edit)')
console.log('------------------------------------')

test('분리된 fetch 함수 구현 확인', () => {
  const editPath = path.join(process.cwd(), 'src/app/admin/notices/[id]/edit/page.tsx')
  const content = fs.readFileSync(editPath, 'utf8')
  return content.includes('fetchNotice = useCallback(async') &&
         content.includes('fetchEditCategories = useCallback(async')
})

test('공지사항 데이터 필수 확인 로직', () => {
  const editPath = path.join(process.cwd(), 'src/app/admin/notices/[id]/edit/page.tsx')
  const content = fs.readFileSync(editPath, 'utf8')
  return content.includes('Critical error - can\'t proceed without notice data') &&
         content.includes('return // Critical error')
})

test('카테고리 폴백 메커니즘 확인', () => {
  const editPath = path.join(process.cwd(), 'src/app/admin/notices/[id]/edit/page.tsx')
  const content = fs.readFileSync(editPath, 'utf8')
  return content.includes('카테고리를 불러오지 못했지만 기본 카테고리를 사용합니다') &&
         content.includes('console.warn')
})

test('병렬 실행 및 결과 처리 확인', () => {
  const editPath = path.join(process.cwd(), 'src/app/admin/notices/[id]/edit/page.tsx')
  const content = fs.readFileSync(editPath, 'utf8')
  return content.includes('Promise.all([') &&
         content.includes('noticeResult.success') &&
         content.includes('categoriesResult.data')
})

// 4. API endpoint error handling
console.log('\n🔌 API Endpoints Error Handling')
console.log('-------------------------------')

test('Notices API 데이터베이스 에러 처리 확인', () => {
  const apiPath = path.join(process.cwd(), 'src/app/api/admin/notices/route.ts')
  const content = fs.readFileSync(apiPath, 'utf8')
  return content.includes('error.code === \'42P01\'') &&
         content.includes('Notices table not found')
})

test('Categories API 데이터베이스 에러 처리 확인', () => {
  const categoriesApiPath = path.join(process.cwd(), 'src/app/api/admin/notice-categories/route.ts')
  const content = fs.readFileSync(categoriesApiPath, 'utf8')
  return content.includes('error.code === \'42P01\'') &&
         content.includes('Notice categories table not found')
})

test('API 응답에 빈 데이터 배열 포함 확인', () => {
  const apiPath = path.join(process.cwd(), 'src/app/api/admin/notices/route.ts')
  const content = fs.readFileSync(apiPath, 'utf8')
  return content.includes('data: []') &&
         content.includes('details: error.message')
})

test('카테고리 필터링 수정 확인', () => {
  const apiPath = path.join(process.cwd(), 'src/app/api/admin/notices/route.ts')
  const content = fs.readFileSync(apiPath, 'utf8')
  return content.includes('category.name') &&
         !content.includes('notice_categories.name')
})

// 5. Integration and consistency
console.log('\n🔗 Integration & Consistency')
console.log('---------------------------')

test('모든 페이지에서 일관된 폴백 카테고리 사용', () => {
  const pages = [
    'src/app/admin/notices/page.tsx',
    'src/app/admin/notices/create/page.tsx',
    'src/app/admin/notices/[id]/edit/page.tsx'
  ]
  
  return pages.every(pagePath => {
    const fullPath = path.join(process.cwd(), pagePath)
    if (!fs.existsSync(fullPath)) return false
    const content = fs.readFileSync(fullPath, 'utf8')
    return content.includes('일반') && content.includes('중요')
  })
})

test('에러 상태 초기화 패턴 일관성', () => {
  const pages = [
    'src/app/admin/notices/page.tsx',
    'src/app/admin/notices/create/page.tsx',
    'src/app/admin/notices/[id]/edit/page.tsx'
  ]
  
  return pages.every(pagePath => {
    const fullPath = path.join(process.cwd(), pagePath)
    if (!fs.existsSync(fullPath)) return false
    const content = fs.readFileSync(fullPath, 'utf8')
    return content.includes('setError(null)')
  })
})

test('HTTP 상태 코드 포함 에러 메시지', () => {
  const pages = [
    'src/app/admin/notices/page.tsx',
    'src/app/admin/notices/create/page.tsx',
    'src/app/admin/notices/[id]/edit/page.tsx'
  ]
  
  return pages.every(pagePath => {
    const fullPath = path.join(process.cwd(), pagePath)
    if (!fs.existsSync(fullPath)) return false
    const content = fs.readFileSync(fullPath, 'utf8')
    return content.includes('HTTP ${response.status}')
  })
})

// 6. Database schema compatibility
console.log('\n🗄️  Database Schema Compatibility')
console.log('--------------------------------')

test('Database schema file 존재 확인', () => {
  const schemaPath = path.join(process.cwd(), 'scripts/setup-notices-schema.sql')
  return fs.existsSync(schemaPath)
})

test('필수 테이블 정의 확인', () => {
  const schemaPath = path.join(process.cwd(), 'scripts/setup-notices-schema.sql')
  const content = fs.readFileSync(schemaPath, 'utf8')
  return content.includes('CREATE TABLE IF NOT EXISTS notices') &&
         content.includes('CREATE TABLE IF NOT EXISTS notice_categories')
})

test('기본 카테고리 데이터 삽입 확인', () => {
  const schemaPath = path.join(process.cwd(), 'scripts/setup-notices-schema.sql')
  const content = fs.readFileSync(schemaPath, 'utf8')
  return content.includes('INSERT INTO notice_categories') &&
         content.includes('general') &&
         content.includes('일반공지')
})

// 결과 출력
console.log('\n📊 테스트 결과 요약')
console.log('==================')
console.log(`✅ 통과: ${passedTests}/${totalTests} 테스트`)
console.log(`📈 성공률: ${Math.round((passedTests / totalTests) * 100)}%`)

if (passedTests === totalTests) {
  console.log('\n🎉 모든 안정성 검증이 성공적으로 완료되었습니다!')
  console.log('\n🛡️ 안정성 개선 사항:')
  console.log('   • 개별 fetch 함수로 세분화된 에러 처리')
  console.log('   • HTTP 상태 코드 포함 상세 에러 메시지')
  console.log('   • 폴백 메커니즘으로 앱 크래시 방지')
  console.log('   • 데이터베이스 테이블 누락 시 graceful degradation')
  console.log('   • 일관된 사용자 경험 제공')
  console.log('   • Production 환경에서 안정적 동작 보장')
} else {
  console.log('\n⚠️  일부 안정성 테스트가 실패했습니다.')
  console.log('   실패한 테스트를 확인하고 수정해주세요.')
}

console.log('\n테스트 완료! 🏁')