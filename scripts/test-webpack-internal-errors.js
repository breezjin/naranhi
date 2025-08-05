#!/usr/bin/env node

/**
 * 🔍 Webpack-Internal 에러 시뮬레이션 및 감지 테스트
 * Webpack-Internal Error Simulation and Detection Test
 */

const fs = require('fs')
const path = require('path')

console.log('\n🔍 Webpack-Internal 에러 감지 테스트')
console.log('====================================')

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

// 1. Nested function analysis
console.log('\n🔬 Nested Function Structure Analysis')
console.log('--------------------------------------')

test('Main page - 중첩 async 함수 구조 분석', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  
  // Check for nested async functions inside useCallback
  const hasNestedAsyncFunctions = content.includes('const fetchNotices = async () => {') && 
                                 content.includes('const fetchCategories = async () => {')
  
  // Check if these are inside useCallback
  const fetchDataIndex = content.indexOf('const fetchData = useCallback(async () => {')
  const fetchNoticesIndex = content.indexOf('const fetchNotices = async () => {')
  const fetchCategoriesIndex = content.indexOf('const fetchCategories = async () => {')
  
  const isNestedStructure = fetchDataIndex !== -1 && 
                           fetchNoticesIndex > fetchDataIndex && 
                           fetchCategoriesIndex > fetchDataIndex
  
  if (isNestedStructure) {
    console.log('   ⚠️  감지: useCallback 내부에 중첩된 async 함수들')
    console.log('   📍 fetchNotices at index:', fetchNoticesIndex)
    console.log('   📍 fetchCategories at index:', fetchCategoriesIndex)
    return false // This structure can cause webpack-internal errors
  }
  
  return !hasNestedAsyncFunctions || !isNestedStructure
})

test('Create page - async 함수 구조 분석', () => {
  const createPath = path.join(process.cwd(), 'src/app/admin/notices/create/page.tsx')
  const content = fs.readFileSync(createPath, 'utf8')
  
  // Check for direct useCallback without nested functions (good pattern)
  const hasDirectUseCallback = content.includes('const fetchCategories = useCallback(async () => {')
  
  return hasDirectUseCallback
})

test('Edit page - async 함수 구조 분석', () => {
  const editPath = path.join(process.cwd(), 'src/app/admin/notices/[id]/edit/page.tsx')
  const content = fs.readFileSync(editPath, 'utf8')
  
  // Check for nested async functions inside useCallback
  const hasNestedAsyncFunctions = content.includes('const fetchNotice = async () => {') && 
                                 content.includes('const fetchCategories = async () => {')
  
  const fetchDataIndex = content.indexOf('const fetchData = useCallback(async () => {')
  const fetchNoticeIndex = content.indexOf('const fetchNotice = async () => {')
  
  const isNestedStructure = fetchDataIndex !== -1 && fetchNoticeIndex > fetchDataIndex
  
  if (isNestedStructure) {
    console.log('   ⚠️  감지: Edit 페이지도 중첩된 async 함수 구조')
    return false
  }
  
  return !hasNestedAsyncFunctions || !isNestedStructure
})

// 2. Potential webpack-internal error patterns
console.log('\n⚠️  Webpack-Internal Error Risk Analysis')
console.log('---------------------------------------')

test('fetch API 호출 패턴 분석', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  
  // Count nested async functions
  const asyncFunctionMatches = content.match(/const \w+ = async \(\) => {/g) || []
  const nestedAsyncCount = asyncFunctionMatches.length
  
  console.log(`   📊 중첩된 async 함수 개수: ${nestedAsyncCount}`)
  
  // Risk increases with more nested async functions
  if (nestedAsyncCount > 2) {
    console.log('   🚨 고위험: 과도한 중첩 async 함수')
    return false
  } else if (nestedAsyncCount > 0) {
    console.log('   ⚠️  중위험: 중첩 async 함수 존재')
    return false
  }
  
  return true
})

test('Promise.all 사용 패턴 분석', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  
  // Check if Promise.all is used with nested functions (old problematic pattern)
  const hasNestedFunctionInside = content.includes('const fetchNotices = async () => {') &&
                                  content.indexOf('const fetchNotices = async') > 
                                  content.indexOf('const fetchData = useCallback')
  
  // Check if Promise.all is used with external useCallback functions (good pattern)
  const hasExternalUseCallback = content.includes('await Promise.all([') && 
                                (content.includes('fetchNotices(),') || content.includes('fetchNotice(),')) &&
                                content.includes('const fetchNotices = useCallback') ||
                                content.includes('const fetchNotice = useCallback')
  
  if (hasNestedFunctionInside) {
    console.log('   ⚠️  Promise.all이 중첩 함수와 함께 사용됨')
    return false
  }
  
  if (hasExternalUseCallback) {
    console.log('   ✅ Promise.all이 외부 useCallback 함수들과 올바르게 사용됨')
    return true
  }
  
  return true
})

// 3. Solution recommendations
console.log('\n💡 Solution Recommendations')
console.log('----------------------------')

function generateSolutionReport() {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  
  const hasNestedStructure = content.includes('const fetchNotices = async () => {') && 
                            content.indexOf('const fetchData = useCallback') < 
                            content.indexOf('const fetchNotices = async')
  
  if (hasNestedStructure) {
    console.log('\n🔧 권장 해결방안:')
    console.log('1. 중첩된 async 함수를 useCallback 외부로 이동')
    console.log('2. 각 fetch 함수를 개별 useCallback으로 분리')  
    console.log('3. useMemo로 API 엔드포인트 관리')
    console.log('4. 커스텀 훅으로 데이터 fetching 로직 분리')
    
    return false
  }
  
  return true
}

test('해결방안 필요성 평가', generateSolutionReport)

// 결과 출력
console.log('\n📊 테스트 결과 요약')
console.log('==================')
console.log(`✅ 통과: ${passedTests}/${totalTests} 테스트`)
console.log(`📈 성공률: ${Math.round((passedTests / totalTests) * 100)}%`)

if (passedTests === totalTests) {
  console.log('\n🎉 Webpack-Internal 에러 위험성이 낮습니다!')
} else {
  console.log('\n⚠️  Webpack-Internal 에러 위험성이 감지되었습니다.')
  console.log('\n🛠️  즉시 수정이 필요한 구조적 문제:')
  console.log('   • useCallback 내부의 중첩 async 함수')
  console.log('   • 복잡한 스코프 체인으로 인한 webpack 컴파일 오류')
  console.log('   • 메모리 누수 및 성능 저하 위험')
}

console.log('\n테스트 완료! 🏁')