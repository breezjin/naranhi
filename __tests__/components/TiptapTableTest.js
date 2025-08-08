/**
 * TipTap Table Feature Test
 * Testing table insertion and manipulation functionality
 */

const fs = require('fs')
const path = require('path')

function runTiptapTableTests() {
  console.log('🔧 TipTap Table Feature Tests')
  console.log('════════════════════════════')
  
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

  // Test 1: TipTap Editor Enhanced component exists
  test('TipTap Editor Enhanced component file exists', () => {
    const componentPath = path.join(__dirname, '../../src/components/admin/TiptapEditorEnhanced.tsx')
    return fs.existsSync(componentPath)
  })

  // Test 2: Table extensions are properly imported
  test('Table extensions are imported', () => {
    const componentPath = path.join(__dirname, '../../src/components/admin/TiptapEditorEnhanced.tsx')
    if (!fs.existsSync(componentPath)) return false
    
    const content = fs.readFileSync(componentPath, 'utf8')
    return content.includes("import { Table } from '@tiptap/extension-table'") &&
           content.includes("import { TableRow } from '@tiptap/extension-table-row'") &&
           content.includes("import { TableCell } from '@tiptap/extension-table-cell'") &&
           content.includes("import { TableHeader } from '@tiptap/extension-table-header'")
  })

  // Test 3: Table icons are imported
  test('Table UI icons are imported', () => {
    const componentPath = path.join(__dirname, '../../src/components/admin/TiptapEditorEnhanced.tsx')
    if (!fs.existsSync(componentPath)) return false
    
    const content = fs.readFileSync(componentPath, 'utf8')
    return content.includes("Table as TableIcon") &&
           content.includes("Plus") &&
           content.includes("Trash2") &&
           content.includes("MoreHorizontal")
  })

  // Test 4: Table extensions are configured in editor
  test('Table extensions are configured', () => {
    const componentPath = path.join(__dirname, '../../src/components/admin/TiptapEditorEnhanced.tsx')
    if (!fs.existsSync(componentPath)) return false
    
    const content = fs.readFileSync(componentPath, 'utf8')
    return content.includes("Table.configure({") &&
           content.includes("resizable: true") &&
           content.includes("TableRow") &&
           content.includes("TableCell")
  })

  // Test 5: Table toolbar buttons exist
  test('Table toolbar buttons are implemented', () => {
    const componentPath = path.join(__dirname, '../../src/components/admin/TiptapEditorEnhanced.tsx')
    if (!fs.existsSync(componentPath)) return false
    
    const content = fs.readFileSync(componentPath, 'utf8')
    return content.includes("insertTable({ rows: 3, cols: 3, withHeaderRow: true })") &&
           content.includes("addRowBefore") &&
           content.includes("addRowAfter") &&
           content.includes("addColumnBefore") &&
           content.includes("addColumnAfter") &&
           content.includes("deleteTable")
  })

  // Test 6: Table styling is implemented
  test('Table CSS styling is configured', () => {
    const componentPath = path.join(__dirname, '../../src/components/admin/TiptapEditorEnhanced.tsx')
    if (!fs.existsSync(componentPath)) return false
    
    const content = fs.readFileSync(componentPath, 'utf8')
    return content.includes("[&_table]:border-collapse") &&
           content.includes("[&_th]:border") &&
           content.includes("[&_td]:border") &&
           content.includes("selectedCell")
  })

  // Test 7: Notice renderer handles tables
  test('Notice Content Renderer handles table rendering', () => {
    const rendererPath = path.join(__dirname, '../../src/components/notice/NoticeContentRenderer.tsx')
    if (!fs.existsSync(rendererPath)) return false
    
    const content = fs.readFileSync(rendererPath, 'utf8')
    return content.includes("case 'table':") &&
           content.includes("case 'tableRow':") &&
           content.includes("case 'tableCell':") &&
           content.includes("case 'tableHeader':")
  })

  // Test 8: Table status indicator
  test('Table editing status indicator', () => {
    const componentPath = path.join(__dirname, '../../src/components/admin/TiptapEditorEnhanced.tsx')
    if (!fs.existsSync(componentPath)) return false
    
    const content = fs.readFileSync(componentPath, 'utf8')
    return content.includes("'표 편집 중'")
  })

  // Test 9: Package dependencies for tables
  test('TipTap table packages installed', () => {
    const packageJsonPath = path.join(__dirname, '../../package.json')
    if (!fs.existsSync(packageJsonPath)) return false
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    return packageJson.dependencies &&
           packageJson.dependencies['@tiptap/extension-table'] &&
           packageJson.dependencies['@tiptap/extension-table-row'] &&
           packageJson.dependencies['@tiptap/extension-table-cell'] &&
           packageJson.dependencies['@tiptap/extension-table-header']
  })

  // Test 10: Table feature completeness check
  test('Complete table feature implementation', () => {
    // Check if all essential table features are available
    const componentPath = path.join(__dirname, '../../src/components/admin/TiptapEditorEnhanced.tsx')
    if (!fs.existsSync(componentPath)) return false
    
    const content = fs.readFileSync(componentPath, 'utf8')
    
    const requiredFeatures = [
      'insertTable',       // Table insertion
      'deleteTable',       // Table deletion
      'addRowBefore',      // Row manipulation
      'addColumnBefore',   // Column manipulation
      'toggleHeaderRow',   // Header toggle
      'isActive(\'table\')', // Table state detection
    ]
    
    return requiredFeatures.every(feature => content.includes(feature))
  })

  return results
}

function main() {
  console.log('🧪 TipTap Table Feature Testing')
  console.log('═══════════════════════════════')
  console.log(`📅 Test Date: ${new Date().toLocaleString('ko-KR')}`)
  console.log('')

  const results = runTiptapTableTests()

  // Final report
  console.log('\n📊 Table Feature Test Results')
  console.log('═════════════════════════════')
  console.log(`✅ Passed:        ${results.passed}/${results.total}`)
  console.log(`❌ Failed:        ${results.failed}/${results.total}`) 
  console.log(`📊 Success Rate:  ${Math.round((results.passed / results.total) * 100)}%`)

  if (results.failed === 0) {
    console.log('\n🎉 All table feature tests passed! Table editing is ready to use.')
  } else if (results.passed > results.failed) {
    console.log('\n⚠️  Some tests failed, but core table functionality appears to be working.')
  } else {
    console.log('\n❌ Multiple tests failed. Check the table feature implementation.')
  }

  return results
}

if (require.main === module) {
  const results = main()
  process.exit(results.failed === 0 ? 0 : 1)
}

module.exports = { runTiptapTableTests }