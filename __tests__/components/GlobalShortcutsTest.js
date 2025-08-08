/**
 * Global Shortcuts Feature Test
 * Testing keyboard shortcut functionality
 */

const fs = require('fs')
const path = require('path')

function runGlobalShortcutsTests() {
  console.log('⌨️  Global Shortcuts Feature Tests')
  console.log('════════════════════════════════════')
  
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

  // Test 1: useGlobalShortcuts hook exists
  test('useGlobalShortcuts hook file exists', () => {
    const hookPath = path.join(__dirname, '../../src/hooks/useGlobalShortcuts.ts')
    return fs.existsSync(hookPath)
  })

  // Test 2: GlobalShortcuts component exists
  test('GlobalShortcuts component file exists', () => {
    const componentPath = path.join(__dirname, '../../src/components/layouts/GlobalShortcuts.tsx')
    return fs.existsSync(componentPath)
  })

  // Test 3: ShortcutHelp component exists
  test('ShortcutHelp component file exists', () => {
    const helpPath = path.join(__dirname, '../../src/components/ui/ShortcutHelp.tsx')
    return fs.existsSync(helpPath)
  })

  // Test 4: Hook implementation has required shortcuts
  test('Hook defines required keyboard shortcuts', () => {
    const hookPath = path.join(__dirname, '../../src/hooks/useGlobalShortcuts.ts')
    if (!fs.existsSync(hookPath)) return false
    
    const content = fs.readFileSync(hookPath, 'utf8')
    return content.includes("key: 'q'") &&
           content.includes("router.push('/admin')") &&
           content.includes("key: 'h'") &&
           content.includes("router.push('/')")
  })

  // Test 5: Input field detection logic
  test('Input field detection implemented', () => {
    const hookPath = path.join(__dirname, '../../src/hooks/useGlobalShortcuts.ts')
    if (!fs.existsSync(hookPath)) return false
    
    const content = fs.readFileSync(hookPath, 'utf8')
    return content.includes('isInputActive') &&
           content.includes("tagName === 'INPUT'") &&
           content.includes("tagName === 'TEXTAREA'") &&
           content.includes('isContentEditable')
  })

  // Test 6: Modal detection logic
  test('Modal detection implemented', () => {
    const hookPath = path.join(__dirname, '../../src/hooks/useGlobalShortcuts.ts')
    if (!fs.existsSync(hookPath)) return false
    
    const content = fs.readFileSync(hookPath, 'utf8')
    return content.includes('hasOpenModal') &&
           content.includes('role="dialog"') &&
           content.includes('data-state="open"')
  })

  // Test 7: Layout integration
  test('GlobalShortcuts integrated in layout', () => {
    const layoutPath = path.join(__dirname, '../../src/app/layout.tsx')
    if (!fs.existsSync(layoutPath)) return false
    
    const content = fs.readFileSync(layoutPath, 'utf8')
    return content.includes('GlobalShortcuts') &&
           content.includes('<GlobalShortcuts />')
  })

  // Test 8: SiteHeader integration
  test('ShortcutHelp integrated in SiteHeader', () => {
    const headerPath = path.join(__dirname, '../../src/components/siteHeaders/SiteHeader.tsx')
    if (!fs.existsSync(headerPath)) return false
    
    const content = fs.readFileSync(headerPath, 'utf8')
    return content.includes('ShortcutHelp') &&
           content.includes('<ShortcutHelp')
  })

  // Test 9: Required Next.js navigation
  test('Next.js router navigation implemented', () => {
    const hookPath = path.join(__dirname, '../../src/hooks/useGlobalShortcuts.ts')
    if (!fs.existsSync(hookPath)) return false
    
    const content = fs.readFileSync(hookPath, 'utf8')
    return content.includes("useRouter") &&
           content.includes("from 'next/navigation'") &&
           content.includes("router.push")
  })

  // Test 10: Event handling and cleanup
  test('Keyboard event handling and cleanup', () => {
    const hookPath = path.join(__dirname, '../../src/hooks/useGlobalShortcuts.ts')
    if (!fs.existsSync(hookPath)) return false
    
    const content = fs.readFileSync(hookPath, 'utf8')
    return content.includes('addEventListener') &&
           content.includes('removeEventListener') &&
           content.includes('keydown') &&
           content.includes('event.preventDefault()')
  })

  // Test 11: Shortcut configuration
  test('Comprehensive shortcut configuration', () => {
    const hookPath = path.join(__dirname, '../../src/hooks/useGlobalShortcuts.ts')
    if (!fs.existsSync(hookPath)) return false
    
    const content = fs.readFileSync(hookPath, 'utf8')
    
    const requiredShortcuts = [
      "key: 'q'",      // Admin page
      "key: 'h'",      // Home page  
      "key: 'n'",      // Notice page
      "key: 'f'",      // Facilities page
      "key: 'c'"       // Contact page
    ]
    
    return requiredShortcuts.every(shortcut => content.includes(shortcut))
  })

  // Test 12: UI Dialog components
  test('Shortcut help dialog components', () => {
    const helpPath = path.join(__dirname, '../../src/components/ui/ShortcutHelp.tsx')
    if (!fs.existsSync(helpPath)) return false
    
    const content = fs.readFileSync(helpPath, 'utf8')
    return content.includes('Dialog') &&
           content.includes('DialogContent') &&
           content.includes('DialogTrigger') &&
           content.includes('Keyboard')
  })

  return results
}

function main() {
  console.log('🧪 Global Keyboard Shortcuts Testing')
  console.log('═══════════════════════════════════')
  console.log(`📅 Test Date: ${new Date().toLocaleString('ko-KR')}`)
  console.log('')

  const results = runGlobalShortcutsTests()

  // Final report
  console.log('\n📊 Shortcuts Feature Test Results')
  console.log('═════════════════════════════════')
  console.log(`✅ Passed:        ${results.passed}/${results.total}`)
  console.log(`❌ Failed:        ${results.failed}/${results.total}`) 
  console.log(`📊 Success Rate:  ${Math.round((results.passed / results.total) * 100)}%`)

  // Shortcut reference
  console.log('\n⌨️  Available Keyboard Shortcuts:')
  console.log('═════════════════════════════════')
  console.log('   Q → Admin 페이지로 이동')
  console.log('   H → 홈페이지로 이동')
  console.log('   N → 공지사항으로 이동')
  console.log('   F → 시설안내로 이동')
  console.log('   C → 문의하기로 이동')

  if (results.failed === 0) {
    console.log('\n🎉 All shortcut feature tests passed! Keyboard shortcuts are ready to use.')
  } else if (results.passed > results.failed) {
    console.log('\n⚠️  Some tests failed, but core shortcut functionality appears to be working.')
  } else {
    console.log('\n❌ Multiple tests failed. Check the shortcut feature implementation.')
  }

  return results
}

if (require.main === module) {
  const results = main()
  process.exit(results.failed === 0 ? 0 : 1)
}

module.exports = { runGlobalShortcutsTests }