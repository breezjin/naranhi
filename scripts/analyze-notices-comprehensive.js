#!/usr/bin/env node

/**
 * 🔍 공지사항 시스템 종합 분석 
 * Comprehensive Analysis of Notices System
 */

const fs = require('fs')
const path = require('path')

console.log('\n🔍 공지사항 시스템 종합 분석')
console.log('==============================')

let issues = []
let improvements = []
let nextjsErrors = []

// 1. Database-Frontend Schema Alignment Check
console.log('\n📊 1. DB-프론트엔드 스키마 일치성 분석')
console.log('----------------------------------------')

function analyzeDatabaseFrontendGaps() {
  // Read database schema
  const schemaPath = path.join(process.cwd(), 'scripts/setup-notices-schema.sql')
  const schemaContent = fs.readFileSync(schemaPath, 'utf8')
  
  // Extract database fields
  const dbFields = []
  const notices_table_match = schemaContent.match(/CREATE TABLE IF NOT EXISTS notices \(([\s\S]*?)\);/m)
  if (notices_table_match) {
    const tableContent = notices_table_match[1]
    const fieldMatches = tableContent.match(/^\s*(\w+)\s+/gm)
    if (fieldMatches) {
      fieldMatches.forEach(match => {
        const field = match.trim().split(/\s+/)[0]
        if (field && field !== 'PRIMARY' && field !== 'REFERENCES' && field !== 'DEFAULT' && field !== 'UNIQUE') {
          dbFields.push(field)
        }
      })
    }
  }

  // Read frontend interface
  const frontendPath = path.join(process.cwd(), 'src/app/admin/notices/page.tsx')
  const frontendContent = fs.readFileSync(frontendPath, 'utf8')
  
  // Extract frontend interface fields
  const interfaceMatch = frontendContent.match(/interface Notice \{([\s\S]*?)\}/m)
  const frontendFields = []
  if (interfaceMatch) {
    const interfaceContent = interfaceMatch[1]
    const fieldMatches = interfaceContent.match(/^\s*(\w+):/gm)
    if (fieldMatches) {
      fieldMatches.forEach(match => {
        const field = match.trim().replace(':', '')
        frontendFields.push(field)
      })
    }
  }

  console.log(`📋 DB 필드 (${dbFields.length}개):`, dbFields.join(', '))
  console.log(`🖥️  Frontend 필드 (${frontendFields.length}개):`, frontendFields.join(', '))

  // Find missing fields
  const missingInFrontend = dbFields.filter(field => !frontendFields.includes(field))
  const missingInDB = frontendFields.filter(field => !dbFields.includes(field) && field !== 'category')

  if (missingInFrontend.length > 0) {
    issues.push(`❌ Frontend에서 누락된 DB 필드: ${missingInFrontend.join(', ')}`)
  }
  
  if (missingInDB.length > 0) {
    issues.push(`❌ DB에서 누락된 Frontend 필드: ${missingInDB.join(', ')}`)
  }

  if (missingInFrontend.length === 0 && missingInDB.length === 0) {
    console.log('✅ DB와 Frontend 스키마 일치성 확인됨')
  }

  return { dbFields, frontendFields, missingInFrontend, missingInDB }
}

const schemaAnalysis = analyzeDatabaseFrontendGaps()

// 2. Quill Editor Optimization Analysis
console.log('\n🖋️  2. Quill 에디터 최적화 분석')
console.log('----------------------------------')

function analyzeQuillOptimization() {
  const quillPath = path.join(process.cwd(), 'src/components/admin/QuillEditor.tsx')
  const quillContent = fs.readFileSync(quillPath, 'utf8')

  const optimizations = {
    dynamicImport: quillContent.includes('dynamic(() => import(\'react-quill\')'),
    memoPrev: quillContent.includes('memo('),
    useCallback: quillContent.includes('useCallback'),
    useMemo: quillContent.includes('useMemo'),
    errorHandling: quillContent.includes('handleError'),
    koreanOptimization: quillContent.includes('Korean') || quillContent.includes('한글'),
    tableSupport: quillContent.includes('quill-table'),
    imageResize: quillContent.includes('quill-image-resize'),
    seoSupport: quillContent.includes('html_content') && quillContent.includes('plain_text')
  }

  console.log('📊 Quill 에디터 최적화 현황:')
  Object.entries(optimizations).forEach(([key, value]) => {
    const status = value ? '✅' : '❌'
    const label = {
      dynamicImport: 'Dynamic Import (SSR 최적화)',
      memoPrev: 'React.memo (리렌더링 방지)',
      useCallback: 'useCallback (성능 최적화)',
      useMemo: 'useMemo (계산 최적화)',
      errorHandling: '에러 처리',
      koreanOptimization: '한국어 최적화',
      tableSupport: '테이블 지원',
      imageResize: '이미지 리사이즈',
      seoSupport: 'SEO 지원 (HTML/Plain 변환)'
    }
    console.log(`  ${status} ${label[key] || key}`)
    
    if (!value) {
      improvements.push(`💡 Quill 에디터 ${label[key]} 추가 필요`)
    }
  })

  return optimizations
}

const quillAnalysis = analyzeQuillOptimization()

// 3. NextJS Error Analysis
console.log('\n⚠️  3. NextJS 에러 분석')
console.log('----------------------')

function analyzeNextJSErrors() {
  const adminNoticesPages = [
    'src/app/admin/notices/page.tsx',
    'src/app/admin/notices/create/page.tsx',
    'src/app/admin/notices/[id]/edit/page.tsx'
  ]

  const apiRoutes = [
    'src/app/api/admin/notices/route.ts',
    'src/app/api/admin/notices/[id]/route.ts',
    'src/app/api/admin/notice-categories/route.ts'
  ]

  const allFiles = [...adminNoticesPages, ...apiRoutes]
  
  allFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    if (!fs.existsSync(fullPath)) {
      nextjsErrors.push(`❌ 파일 누락: ${filePath}`)
      return
    }

    const content = fs.readFileSync(fullPath, 'utf8')
    
    // Check for common NextJS errors
    const checks = {
      useClientDirective: filePath.includes('/app/') && content.includes('useState') && !content.includes("'use client'"),
      missingExports: filePath.includes('/route.ts') && !(content.includes('export async function GET') || content.includes('export async function POST')),
      invalidImports: content.includes('import React from') && !content.includes('React.'),
      consoleErrors: content.includes('console.error') && !content.includes('development'),
      typeErrors: content.includes(': any') && filePath.includes('.tsx'),
      unusedImports: false // Will be detected by linter
    }

    Object.entries(checks).forEach(([check, hasError]) => {
      if (hasError) {
        const messages = {
          useClientDirective: `'use client' 지시어 누락 - ${filePath}`,
          missingExports: `API 라우트 export 함수 누락 - ${filePath}`,
          invalidImports: `불필요한 React import - ${filePath}`,
          consoleErrors: `Production console.error 사용 - ${filePath}`,
          typeErrors: `타입 명시 필요 (any 사용) - ${filePath}`,
          unusedImports: `사용하지 않는 import - ${filePath}`
        }
        nextjsErrors.push(`⚠️  ${messages[check]}`)
      }
    })
  })

  if (nextjsErrors.length === 0) {
    console.log('✅ 주요 NextJS 에러 없음')
  } else {
    console.log('❌ NextJS 에러 발견:')
    nextjsErrors.forEach(error => console.log(`  ${error}`))
  }

  return nextjsErrors
}

const nextjsAnalysis = analyzeNextJSErrors()

// 4. Quill Editor Delta-HTML Conversion Analysis
console.log('\n🔄 4. Quill Delta-HTML 변환 분석')
console.log('----------------------------------')

function analyzeDeltaHTMLConversion() {
  const apiPath = path.join(process.cwd(), 'src/app/api/admin/notices/route.ts')
  const apiContent = fs.readFileSync(apiPath, 'utf8')

  const conversionFeatures = {
    deltaToHTML: apiContent.includes('convertDeltaToHTML'),
    plainTextExtraction: apiContent.includes('extractPlainTextFromDelta'),
    koreanOptimization: apiContent.includes('korean') || apiContent.includes('한글'),
    fullFormattingSupport: apiContent.includes('bold') && apiContent.includes('italic'),
    listSupport: apiContent.includes('list'),
    tableSupport: apiContent.includes('table'),
    imageSupport: apiContent.includes('image'),
    linkSupport: apiContent.includes('link'),
    codeBlockSupport: apiContent.includes('code-block'),
    blockquoteSupport: apiContent.includes('blockquote')
  }

  console.log('📊 Delta-HTML 변환 기능:')
  Object.entries(conversionFeatures).forEach(([key, value]) => {
    const status = value ? '✅' : '❌'
    const label = {
      deltaToHTML: 'Delta → HTML 변환',
      plainTextExtraction: 'Plain Text 추출',
      koreanOptimization: '한국어 최적화',
      fullFormattingSupport: '전체 포매팅 지원',
      listSupport: '리스트 지원',
      tableSupport: '테이블 지원',
      imageSupport: '이미지 지원',
      linkSupport: '링크 지원',
      codeBlockSupport: '코드 블록 지원',
      blockquoteSupport: '인용문 지원'
    }
    console.log(`  ${status} ${label[key] || key}`)
    
    if (!value) {
      improvements.push(`💡 Delta-HTML 변환 ${label[key]} 개선 필요`)
    }
  })

  return conversionFeatures
}

const conversionAnalysis = analyzeDeltaHTMLConversion()

// 5. Generate Comprehensive Report
console.log('\n📋 5. 종합 분석 결과')
console.log('====================')

console.log(`\n📊 발견된 이슈: ${issues.length}개`)
issues.forEach(issue => console.log(`  ${issue}`))

console.log(`\n💡 개선 권장사항: ${improvements.length}개`)
improvements.forEach(improvement => console.log(`  ${improvement}`))

console.log(`\n⚠️  NextJS 에러: ${nextjsErrors.length}개`)
nextjsErrors.forEach(error => console.log(`  ${error}`))

// 6. Priority Recommendations
console.log('\n🎯 우선순위별 권장사항')
console.log('----------------------')

const highPriorityIssues = [
  ...issues.filter(issue => issue.includes('누락')),
  ...nextjsErrors.filter(error => error.includes('use client') || error.includes('export')),
]

const mediumPriorityIssues = [
  ...improvements.filter(imp => imp.includes('한국어') || imp.includes('에러 처리')),
  ...nextjsErrors.filter(error => error.includes('타입') || error.includes('console'))
]

const lowPriorityIssues = [
  ...improvements.filter(imp => !mediumPriorityIssues.includes(imp))
]

if (highPriorityIssues.length > 0) {
  console.log('\n🔴 높은 우선순위 (즉시 수정):')
  highPriorityIssues.forEach(issue => console.log(`  ${issue}`))
}

if (mediumPriorityIssues.length > 0) {
  console.log('\n🟡 중간 우선순위 (단기 개선):')
  mediumPriorityIssues.forEach(issue => console.log(`  ${issue}`))
}

if (lowPriorityIssues.length > 0) {
  console.log('\n🟢 낮은 우선순위 (장기 개선):')
  lowPriorityIssues.forEach(issue => console.log(`  ${issue}`))
}

// 7. Action Plan
console.log('\n🚀 실행 계획')
console.log('============')

if (highPriorityIssues.length > 0) {
  console.log('1단계: 핵심 이슈 해결')
  console.log('  • DB-Frontend 스키마 불일치 수정')
  console.log('  • 필수 NextJS 에러 수정')
  console.log('  • TypeScript 타입 안전성 개선')
}

if (mediumPriorityIssues.length > 0) {
  console.log('\n2단계: 기능 개선')
  console.log('  • Quill 에디터 한국어 최적화')
  console.log('  • 에러 처리 강화')
  console.log('  • Delta-HTML 변환 기능 확장')
}

if (lowPriorityIssues.length > 0) {
  console.log('\n3단계: 성능 최적화')
  console.log('  • 추가 Quill 모듈 통합')
  console.log('  • UI/UX 개선')
  console.log('  • 코드 품질 향상')
}

console.log('\n분석 완료! 🏁')

// Export results for further processing
const analysisResults = {
  timestamp: new Date().toISOString(),
  schema: schemaAnalysis,
  quill: quillAnalysis,
  nextjs: nextjsAnalysis,
  conversion: conversionAnalysis,
  issues: issues.length,
  improvements: improvements.length,
  errors: nextjsErrors.length,
  highPriority: highPriorityIssues.length,
  mediumPriority: mediumPriorityIssues.length,
  lowPriority: lowPriorityIssues.length
}

// Save analysis results
fs.writeFileSync(
  path.join(process.cwd(), 'notices-analysis-results.json'),
  JSON.stringify(analysisResults, null, 2)
)

console.log('\n📄 분석 결과가 notices-analysis-results.json에 저장되었습니다.')

process.exit(analysisResults.issues > 0 || analysisResults.errors > 0 ? 1 : 0)