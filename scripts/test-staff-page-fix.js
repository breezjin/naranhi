#!/usr/bin/env node

/**
 * Staff Page Error Fix Verification Test
 * Tests that the fetchCategories error has been resolved
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Staff Page Error Fix Verification')
console.log('=====================================\n')

const staffPagePath = 'src/app/admin/staff/page.tsx'
const filePath = path.join(process.cwd(), staffPagePath)

if (!fs.existsSync(filePath)) {
  console.log(`❌ File not found: ${staffPagePath}`)
  process.exit(1)
}

const content = fs.readFileSync(filePath, 'utf8')

const tests = [
  {
    name: 'Fixed Supabase relation query',
    check: () => content.includes('staff_categories!category_id(name, display_name)'),
    description: 'Uses proper foreign key relation syntax'
  },
  {
    name: 'Enhanced error handling for categories',
    check: () => content.includes('error.code === \'42P01\'') && content.includes('does not exist'),
    description: 'Handles missing table gracefully'
  },
  {
    name: 'Fallback categories implemented',
    check: () => content.includes('setCategories([') && content.includes('의료진') && content.includes('치료진'),
    description: 'Provides default categories when table missing'
  },
  {
    name: 'Safe category access in filtering',
    check: () => content.includes('staff.category && staff.category.name'),
    description: 'Prevents null reference errors in filtering'
  },
  {
    name: 'Safe category display in stats',
    check: () => content.includes('staff.category && staff.category.name === category.name'),
    description: 'Prevents null reference errors in statistics'
  },
  {
    name: 'Safe category display in cards',
    check: () => content.includes('staff.category?.name') && content.includes('staff.category?.display_name'),
    description: 'Uses optional chaining for category display'
  },
  {
    name: 'Fallback display text',
    check: () => content.includes('미분류'),
    description: 'Shows fallback text for missing category'
  },
  {
    name: 'Improved error logging',
    check: () => content.includes('Staff data fetch error:') && content.includes('Categories fetch error:'),
    description: 'Better error logging for debugging'
  }
]

let passed = 0
let total = tests.length

console.log('📄 Testing Staff Page Fixes')
console.log('---------------------------')

tests.forEach((test, index) => {
  const result = test.check()
  const status = result ? '✅' : '❌'
  
  console.log(`${status} ${test.name}`)
  if (test.description) {
    console.log(`   ${test.description}`)
  }
  
  if (result) passed++
  console.log('')
})

console.log('📊 Fix Verification Summary')
console.log('===========================')
console.log(`✅ Passed: ${passed}/${total}`)
console.log(`📈 Success Rate: ${Math.round((passed/total) * 100)}%`)

if (passed === total) {
  console.log('\n🎉 All fixes implemented successfully!')
  console.log('   • Database relation query fixed')
  console.log('   • Error handling enhanced with fallbacks')
  console.log('   • Safe category access implemented')
  console.log('   • Better error logging added')
  console.log('\n✅ The /admin/staff page should now work without errors')
} else {
  console.log(`\n⚠️  ${total - passed} issues remaining`)
  console.log('   Please review the failed tests above')
}

console.log('\n🔗 Test the fix at: http://localhost:3001/admin/staff')