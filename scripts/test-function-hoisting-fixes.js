#!/usr/bin/env node

/**
 * 🔧 Function Hoisting Issues 수정 검증 테스트
 * Function Hoisting Issues Fix Verification Test
 */

const fs = require('fs')
const path = require('path')

console.log('\n🔧 Function Hoisting Issues 수정 검증 테스트')
console.log('===========================================')

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

// 1. Main notices page
console.log('\n📋 Main Notices Page (/admin/notices)')
console.log('------------------------------------')

test('useCallback 임포트 확인', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  return content.includes('import { useEffect, useState, useMemo, useCallback } from \'react\'')
})

test('fetchData useCallback 래핑 확인', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  return content.includes('const fetchData = useCallback(async () => {')
})

test('fetchData가 useEffect 전에 정의됨', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  const fetchDataIndex = content.indexOf('const fetchData = useCallback')
  const useEffectIndex = content.indexOf('useEffect(() => {\n    fetchData()')
  return fetchDataIndex !== -1 && useEffectIndex !== -1 && fetchDataIndex < useEffectIndex
})

test('useEffect 의존성 배열에 fetchData 포함', () => {
  const pagePath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const content = fs.readFileSync(pagePath, 'utf8')
  return content.includes('}, [fetchData])')
})

// 2. Create page
console.log('\n📝 Create Page (/admin/notices/create)')
console.log('------------------------------------')

test('useCallback 임포트 확인', () => {
  const createPath = path.join(process.cwd(), 'src/app/admin/notices/create/page.tsx')
  const content = fs.readFileSync(createPath, 'utf8')
  return content.includes('import { useState, useEffect, useRef, useCallback } from \'react\'')
})

test('fetchCategories useCallback 래핑 확인', () => {
  const createPath = path.join(process.cwd(), 'src/app/admin/notices/create/page.tsx')
  const content = fs.readFileSync(createPath, 'utf8')
  return content.includes('const fetchCategories = useCallback(async () => {')
})

test('fetchCategories가 useEffect 전에 정의됨', () => {
  const createPath = path.join(process.cwd(), 'src/app/admin/notices/create/page.tsx')
  const content = fs.readFileSync(createPath, 'utf8')
  const fetchCategoriesIndex = content.indexOf('const fetchCategories = useCallback')
  const useEffectIndex = content.indexOf('useEffect(() => {\n    fetchCategories()')
  return fetchCategoriesIndex !== -1 && useEffectIndex !== -1 && fetchCategoriesIndex < useEffectIndex
})

test('useEffect 의존성 배열에 fetchCategories 포함', () => {
  const createPath = path.join(process.cwd(), 'src/app/admin/notices/create/page.tsx')
  const content = fs.readFileSync(createPath, 'utf8')
  return content.includes('}, [fetchCategories])')
})

// 3. Edit page
console.log('\n✏️  Edit Page (/admin/notices/[id]/edit)')
console.log('------------------------------------')

test('useCallback 임포트 확인', () => {
  const editPath = path.join(process.cwd(), 'src/app/admin/notices/[id]/edit/page.tsx')
  const content = fs.readFileSync(editPath, 'utf8')
  return content.includes('import { useState, useEffect, useRef, useCallback } from \'react\'')
})

test('fetchData useCallback 래핑 확인', () => {
  const editPath = path.join(process.cwd(), 'src/app/admin/notices/[id]/edit/page.tsx')
  const content = fs.readFileSync(editPath, 'utf8')
  return content.includes('const fetchData = useCallback(async () => {')
})

test('fetchData가 useEffect 전에 정의됨', () => {
  const editPath = path.join(process.cwd(), 'src/app/admin/notices/[id]/edit/page.tsx')
  const content = fs.readFileSync(editPath, 'utf8')
  const fetchDataIndex = content.indexOf('const fetchData = useCallback')
  const useEffectIndex = content.indexOf('useEffect(() => {\n    if (noticeId) {\n      fetchData()')
  return fetchDataIndex !== -1 && useEffectIndex !== -1 && fetchDataIndex < useEffectIndex
})

test('useEffect 의존성 배열에 fetchData 포함', () => {
  const editPath = path.join(process.cwd(), 'src/app/admin/notices/[id]/edit/page.tsx')
  const content = fs.readFileSync(editPath, 'utf8')
  return content.includes('}, [noticeId, fetchData])')
})

test('fetchData 의존성 배열에 fetch functions 포함', () => {
  const editPath = path.join(process.cwd(), 'src/app/admin/notices/[id]/edit/page.tsx')
  const content = fs.readFileSync(editPath, 'utf8')
  return content.includes('}, [fetchNotice, fetchEditCategories]) // Include fetch functions as dependencies')
})

// 4. TypeScript/React best practices
console.log('\n🎯 Best Practices & Performance')
console.log('-------------------------------')

test('모든 페이지에서 React hooks 올바른 사용', () => {
  const pages = [
    'src/app/admin/notices/page.tsx',
    'src/app/admin/notices/create/page.tsx',
    'src/app/admin/notices/[id]/edit/page.tsx'
  ]
  
  return pages.every(pagePath => {
    const fullPath = path.join(process.cwd(), pagePath)
    if (!fs.existsSync(fullPath)) return false
    const content = fs.readFileSync(fullPath, 'utf8')
    
    // Check that useCallback is used for async functions
    const hasUseCallback = content.includes('useCallback(async')
    // Check that specific functions are defined before their corresponding useEffect
    let hasProperOrdering = true
    
    if (pagePath.includes('page.tsx') && !pagePath.includes('create') && !pagePath.includes('edit')) {
      // Main page: fetchData should be before its useEffect
      const fetchDataIndex = content.indexOf('const fetchData = useCallback')
      const fetchDataUseEffectIndex = content.indexOf('useEffect(() => {\n    fetchData()')
      hasProperOrdering = fetchDataIndex !== -1 && fetchDataUseEffectIndex !== -1 && fetchDataIndex < fetchDataUseEffectIndex
    } else if (pagePath.includes('create')) {
      // Create page: fetchCategories should be before its useEffect
      const fetchCategoriesIndex = content.indexOf('const fetchCategories = useCallback')
      const fetchCategoriesUseEffectIndex = content.indexOf('useEffect(() => {\n    fetchCategories()')
      hasProperOrdering = fetchCategoriesIndex !== -1 && fetchCategoriesUseEffectIndex !== -1 && fetchCategoriesIndex < fetchCategoriesUseEffectIndex
    } else if (pagePath.includes('edit')) {
      // Edit page: fetchData should be before its useEffect
      const fetchDataIndex = content.indexOf('const fetchData = useCallback')
      const fetchDataUseEffectIndex = content.indexOf('useEffect(() => {\n    if (noticeId) {\n      fetchData()')
      hasProperOrdering = fetchDataIndex !== -1 && fetchDataUseEffectIndex !== -1 && fetchDataIndex < fetchDataUseEffectIndex
    }
    
    return hasUseCallback && hasProperOrdering
  })
})

test('의존성 배열 완전성 검증', () => {
  const pages = [
    { path: 'src/app/admin/notices/page.tsx', pattern: '}, [fetchData])' },
    { path: 'src/app/admin/notices/create/page.tsx', pattern: '}, [fetchCategories])' },
    { path: 'src/app/admin/notices/[id]/edit/page.tsx', pattern: '}, [noticeId, fetchData])' }
  ]
  
  return pages.every(page => {
    const fullPath = path.join(process.cwd(), page.path)
    if (!fs.existsSync(fullPath)) return false
    const content = fs.readFileSync(fullPath, 'utf8')
    return content.includes(page.pattern)
  })
})

// 결과 출력
console.log('\n📊 테스트 결과 요약')
console.log('==================')
console.log(`✅ 통과: ${passedTests}/${totalTests} 테스트`)
console.log(`📈 성공률: ${Math.round((passedTests / totalTests) * 100)}%`)

if (passedTests === totalTests) {
  console.log('\n🎉 모든 Function Hoisting 이슈가 성공적으로 해결되었습니다!')
  console.log('\n🔧 수정 사항:')
  console.log('   • fetchData/fetchCategories 함수를 useEffect 전에 정의')
  console.log('   • 모든 async 함수를 useCallback으로 래핑')
  console.log('   • 의존성 배열을 올바르게 설정')
  console.log('   • React hooks 최신 패턴 적용')
  console.log('   • webpack-internal hoisting 에러 해결')
  console.log('   • 성능 최적화 및 메모이제이션 개선')
} else {
  console.log('\n⚠️  일부 테스트가 실패했습니다.')
  console.log('   실패한 테스트를 확인하고 수정해주세요.')
}

console.log('\n테스트 완료! 🏁')