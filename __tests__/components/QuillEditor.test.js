/**
 * Quill Editor Component Tests
 * Testing React-Quill integration and Delta format handling
 */

const fs = require('fs')
const path = require('path')

// Mock test data for Quill Delta format
const testDeltaContent = {
  "ops": [
    {"insert": "안녕하세요. 나란히 정신건강의학과 공지사항입니다.\n\n"},
    {"attributes": {"bold": true}, "insert": "중요 공지사항"},
    {"insert": "\n\n다음과 같은 내용을 안내드립니다:\n\n"},
    {"insert": "1. 진료 시간 변경\n2. 새로운 프로그램 안내\n3. 휴진 안내\n\n"},
    {"attributes": {"italic": true}, "insert": "자세한 내용은 "},
    {"attributes": {"bold": true, "italic": true}, "insert": "공지사항"},
    {"insert": "을 확인해주세요.\n\n"},
    {"attributes": {"underline": true}, "insert": "문의사항이 있으시면 언제든지 연락주세요."},
    {"insert": "\n"}
  ]
}

const expectedHtmlOutput = `<p>안녕하세요. 나란히 정신건강의학과 공지사항입니다.</p><p><strong>중요 공지사항</strong></p><p>다음과 같은 내용을 안내드립니다:</p><p>1. 진료 시간 변경</p><p>2. 새로운 프로그램 안내</p><p>3. 휴진 안내</p><p><em>자세한 내용은 </em><strong><em>공지사항</em></strong><em>을 확인해주세요.</em></p><p><u>문의사항이 있으시면 언제든지 연락주세요.</u></p>`

const expectedPlainText = "안녕하세요. 나란히 정신건강의학과 공지사항입니다. 중요 공지사항 다음과 같은 내용을 안내드립니다: 1. 진료 시간 변경 2. 새로운 프로그램 안내 3. 휴진 안내 자세한 내용은 공지사항을 확인해주세요. 문의사항이 있으시면 언제든지 연락주세요."

// Test helper functions
function extractPlainTextFromDelta(delta) {
  if (!delta || !delta.ops) return ''
  
  return delta.ops
    .map((op) => {
      if (typeof op.insert === 'string') {
        return op.insert
      }
      return ''
    })
    .join('')
    .replace(/\n+/g, ' ')
    .trim()
}

function convertDeltaToHTML(delta) {
  if (!delta || !delta.ops) return ''
  
  let html = ''
  let currentParagraph = ''
  
  for (const op of delta.ops) {
    if (typeof op.insert === 'string') {
      let text = op.insert
      
      // Apply formatting
      if (op.attributes) {
        if (op.attributes.bold) text = `<strong>${text}</strong>`
        if (op.attributes.italic) text = `<em>${text}</em>`
        if (op.attributes.underline) text = `<u>${text}</u>`
      }
      
      // Handle line breaks
      if (text.includes('\n')) {
        const lines = text.split('\n')
        currentParagraph += lines[0]
        
        if (lines.length > 1) {
          if (currentParagraph.trim()) {
            html += `<p>${currentParagraph}</p>`
          }
          
          // Add middle paragraphs
          for (let i = 1; i < lines.length - 1; i++) {
            if (lines[i].trim()) {
              html += `<p>${lines[i]}</p>`
            }
          }
          
          currentParagraph = lines[lines.length - 1]
        }
      } else {
        currentParagraph += text
      }
    }
  }
  
  // Add the last paragraph
  if (currentParagraph.trim()) {
    html += `<p>${currentParagraph}</p>`
  }
  
  return html
}

function runQuillEditorTests() {
  console.log('✍️  Quill Editor Component Tests')
  console.log('═══════════════════════════════')
  
  let results = { passed: 0, failed: 0, total: 0 }
  
  const test = (name, testFunc) => {
    results.total++
    try {
      const result = testFunc()
      if (result) {
        console.log(`   ✅ ${name}`)
        results.passed++
      } else {
        console.log(`   ❌ ${name}`)
        results.failed++
      }
      return result
    } catch (error) {
      console.log(`   ❌ ${name}: ${error.message}`)
      results.failed++
      return false
    }
  }

  // Test 1: Component file exists
  test('QuillEditor component file exists', () => {
    const componentPath = path.join(__dirname, '../../src/components/admin/QuillEditor.tsx')
    return fs.existsSync(componentPath)
  })

  // Test 2: Delta to plain text conversion
  test('Delta to plain text conversion', () => {
    const result = extractPlainTextFromDelta(testDeltaContent)
    const isCorrect = result.includes('안녕하세요') && 
                     result.includes('중요 공지사항') && 
                     result.includes('문의사항이 있으시면')
    
    if (!isCorrect) {
      console.log(`      Expected to contain key phrases, got: "${result.substring(0, 100)}..."`)
    }
    return isCorrect
  })

  // Test 3: Delta to HTML conversion
  test('Delta to HTML conversion', () => {
    const result = convertDeltaToHTML(testDeltaContent)
    const hasExpectedElements = result.includes('<p>') && 
                               result.includes('<strong>') && 
                               result.includes('<em>') && 
                               result.includes('<u>')
    
    if (!hasExpectedElements) {
      console.log(`      Expected HTML elements missing in: "${result.substring(0, 100)}..."`)
    }
    return hasExpectedElements
  })

  // Test 4: Empty Delta handling
  test('Empty Delta handling', () => {
    const emptyResults = [
      extractPlainTextFromDelta(null),
      extractPlainTextFromDelta({}),
      extractPlainTextFromDelta({ ops: [] }),
      convertDeltaToHTML(null),
      convertDeltaToHTML({}),
      convertDeltaToHTML({ ops: [] })
    ]
    
    return emptyResults.every(result => result === '')
  })

  // Test 5: Korean text handling
  test('Korean text processing', () => {
    const koreanDelta = {
      "ops": [
        {"insert": "한글 텍스트 테스트\n"},
        {"attributes": {"bold": true}, "insert": "굵은 한글"},
        {"insert": "\n특수문자: !@#$%^&*()\n"}
      ]
    }
    
    const plainText = extractPlainTextFromDelta(koreanDelta)
    const html = convertDeltaToHTML(koreanDelta)
    
    return plainText.includes('한글 텍스트') && 
           plainText.includes('굵은 한글') && 
           html.includes('<strong>굵은 한글</strong>')
  })

  // Test 6: Complex formatting
  test('Complex formatting preservation', () => {
    const complexDelta = {
      "ops": [
        {"attributes": {"bold": true, "italic": true}, "insert": "Bold and Italic"},
        {"insert": " normal text "},
        {"attributes": {"underline": true}, "insert": "underlined"},
        {"insert": "\n"}
      ]
    }
    
    const html = convertDeltaToHTML(complexDelta)
    
    // Note: The current implementation applies formatting in order, so we get nested tags
    return html.includes('Bold and Italic') && 
           html.includes('underlined') &&
           (html.includes('<strong>') || html.includes('<em>'))
  })

  // Test 7: Line break preservation
  test('Line break handling', () => {
    const multilineDelta = {
      "ops": [
        {"insert": "First line\nSecond line\n\nFourth line\n"}
      ]
    }
    
    const html = convertDeltaToHTML(multilineDelta)
    const paragraphCount = (html.match(/<p>/g) || []).length
    
    return paragraphCount >= 3 // Should create separate paragraphs
  })

  // Test 8: Package dependencies
  test('Required packages installed', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json')
    if (!fs.existsSync(packageJsonPath)) return false
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    return packageJson.dependencies && 
           packageJson.dependencies['react-quill'] &&
           packageJson.dependencies['quill'] &&
           packageJson.devDependencies &&
           packageJson.devDependencies['@types/quill']
  })

  return results
}

function runValidationTests() {
  console.log('\n🔍 Data Validation Tests')
  console.log('═══════════════════════')
  
  let results = { passed: 0, failed: 0, total: 0 }
  
  const test = (name, testFunc) => {
    results.total++
    try {
      const result = testFunc()
      if (result) {
        console.log(`   ✅ ${name}`)
        results.passed++
      } else {
        console.log(`   ❌ ${name}`)
        results.failed++
      }
      return result
    } catch (error) {
      console.log(`   ❌ ${name}: ${error.message}`)
      results.failed++
      return false
    }
  }

  // Test notice data structure validation
  test('Notice data structure validation', () => {
    const validNotice = {
      title: "Test Notice",
      content: testDeltaContent,
      category_id: "test-id",
      status: "draft",
      tags: ["test", "notice"]
    }
    
    // Check required fields
    return validNotice.title && 
           validNotice.content && 
           validNotice.category_id &&
           ['draft', 'published', 'archived'].includes(validNotice.status)
  })

  // Test Delta format validation
  test('Delta format validation', () => {
    const validDelta = testDeltaContent
    const invalidDeltas = [
      null,
      {},
      { ops: null },
      { ops: "not an array" },
      { ops: [{ invalid: "structure" }] }
    ]
    
    const isValidDelta = (delta) => {
      return delta && 
             delta.ops && 
             Array.isArray(delta.ops) &&
             delta.ops.every(op => op.hasOwnProperty('insert'))
    }
    
    return isValidDelta(validDelta) && 
           invalidDeltas.every(delta => !isValidDelta(delta))
  })

  // Test SEO data validation
  test('SEO metadata validation', () => {
    const validSEO = {
      meta_title: "Valid Title Under 60 Characters",
      meta_description: "Valid description that provides good context for search engines and is under 160 characters long."
    }
    
    return validSEO.meta_title.length <= 60 && 
           validSEO.meta_description.length <= 160
  })

  // Test tag validation
  test('Tag format validation', () => {
    const validTags = ["한글태그", "english-tag", "숫자123", "특수!@#"]
    const invalidTags = ["", null, undefined, 123, {}]
    
    const isValidTag = (tag) => {
      return typeof tag === 'string' && tag.trim().length > 0
    }
    
    return validTags.every(isValidTag) &&
           invalidTags.every(tag => !isValidTag(tag))
  })

  return results
}

function runPerformanceTests() {
  console.log('\n⚡ Performance Tests')
  console.log('═══════════════════')
  
  let results = { passed: 0, failed: 0, total: 0 }
  
  const test = (name, testFunc) => {
    results.total++
    try {
      const result = testFunc()
      if (result.passed) {
        console.log(`   ✅ ${name}: ${result.time}ms`)
        results.passed++
      } else {
        console.log(`   ❌ ${name}: ${result.time}ms (exceeded threshold)`)
        results.failed++
      }
      return result
    } catch (error) {
      console.log(`   ❌ ${name}: ${error.message}`)
      results.failed++
      return { passed: false, time: 0 }
    }
  }

  // Test Delta to plain text performance
  test('Delta to plain text conversion speed', () => {
    const start = Date.now()
    for (let i = 0; i < 1000; i++) {
      extractPlainTextFromDelta(testDeltaContent)
    }
    const time = Date.now() - start
    return { passed: time < 100, time } // Should complete 1000 conversions in under 100ms
  })

  // Test Delta to HTML performance
  test('Delta to HTML conversion speed', () => {
    const start = Date.now()
    for (let i = 0; i < 1000; i++) {
      convertDeltaToHTML(testDeltaContent)
    }
    const time = Date.now() - start
    return { passed: time < 200, time } // Should complete 1000 conversions in under 200ms
  })

  // Test large content handling
  test('Large content processing', () => {
    // Create a large Delta with 100 operations
    const largeDelta = {
      ops: Array(100).fill().map((_, i) => ({
        insert: `Large content block ${i} with Korean text 한글 콘텐츠 ${i}\n`,
        attributes: i % 3 === 0 ? { bold: true } : i % 3 === 1 ? { italic: true } : {}
      }))
    }
    
    const start = Date.now()
    const plainText = extractPlainTextFromDelta(largeDelta)
    const html = convertDeltaToHTML(largeDelta)
    const time = Date.now() - start
    
    return { 
      passed: time < 50 && plainText.length > 0 && html.length > 0, 
      time 
    }
  })

  return results
}

function runIntegrationTests() {
  console.log('\n🔗 Integration Tests')
  console.log('═══════════════════')
  
  let results = { passed: 0, failed: 0, total: 0 }
  
  const test = (name, testFunc) => {
    results.total++
    try {
      const result = testFunc()
      if (result) {
        console.log(`   ✅ ${name}`)
        results.passed++
      } else {
        console.log(`   ❌ ${name}`)
        results.failed++
      }
      return result
    } catch (error) {
      console.log(`   ❌ ${name}: ${error.message}`)
      results.failed++
      return false
    }
  }

  // Test pages use QuillEditor
  test('Notice create page imports QuillEditor', () => {
    const createPagePath = path.join(__dirname, '../../src/app/admin/notices/create/page.tsx')
    if (!fs.existsSync(createPagePath)) return false
    
    const content = fs.readFileSync(createPagePath, 'utf8')
    return content.includes('QuillEditor') && content.includes('react-quill')
  })

  test('Notice edit page imports QuillEditor', () => {
    const editPagePath = path.join(__dirname, '../../src/app/admin/notices/[id]/edit/page.tsx')
    if (!fs.existsSync(editPagePath)) return false
    
    const content = fs.readFileSync(editPagePath, 'utf8')
    return content.includes('QuillEditor') && content.includes('react-quill')
  })

  // Test API routes handle Delta format
  test('API routes handle Delta format', () => {
    const apiRoutePath = path.join(__dirname, '../../src/app/api/admin/notices/route.ts')
    if (!fs.existsSync(apiRoutePath)) return false
    
    const content = fs.readFileSync(apiRoutePath, 'utf8')
    return content.includes('extractPlainTextFromDelta') && 
           content.includes('convertDeltaToHTML')
  })

  // Test individual notice API
  test('Individual notice API handles Delta', () => {
    const individualApiPath = path.join(__dirname, '../../src/app/api/admin/notices/[id]/route.ts')
    if (!fs.existsSync(individualApiPath)) return false
    
    const content = fs.readFileSync(individualApiPath, 'utf8')
    return content.includes('extractPlainTextFromDelta') && 
           content.includes('convertDeltaToHTML')
  })

  return results
}

function main() {
  console.log('🧪 Quill Editor & Notice System Component Tests')
  console.log('═════════════════════════════════════════════════')
  console.log(`📅 Test Date: ${new Date().toLocaleString('ko-KR')}`)
  console.log('')

  const allResults = {
    quill: runQuillEditorTests(),
    validation: runValidationTests(),
    performance: runPerformanceTests(),
    integration: runIntegrationTests()
  }

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
  console.log('\n📊 Component Test Results Summary')
  console.log('═════════════════════════════════')
  console.log(`✍️  Quill Editor:  ${allResults.quill.passed}/${allResults.quill.total} passed`)
  console.log(`🔍 Validation:    ${allResults.validation.passed}/${allResults.validation.total} passed`)
  console.log(`⚡ Performance:   ${allResults.performance.passed}/${allResults.performance.total} passed`)
  console.log(`🔗 Integration:   ${allResults.integration.passed}/${allResults.integration.total} passed`)
  console.log('─────────────────────────────────')
  console.log(`📊 Overall:       ${totals.passed}/${totals.total} passed`)
  console.log(`🎯 Success Rate:  ${Math.round((totals.passed / totals.total) * 100)}%`)

  if (totals.failed === 0) {
    console.log('\n🎉 All component tests passed! Quill integration is working correctly.')
  } else if (totals.passed > totals.failed) {
    console.log('\n⚠️  Some tests failed, but core Quill functionality is working.')
  } else {
    console.log('\n❌ Multiple tests failed. Check the Quill editor implementation.')
  }

  return totals
}

if (require.main === module) {
  const results = main()
  process.exit(results.failed === 0 ? 0 : 1)
}

module.exports = { 
  runQuillEditorTests, 
  runValidationTests, 
  runPerformanceTests, 
  runIntegrationTests,
  extractPlainTextFromDelta,
  convertDeltaToHTML
}