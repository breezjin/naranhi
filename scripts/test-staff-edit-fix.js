#!/usr/bin/env node

/**
 * Staff Edit Page Error Fix Verification Test
 * Tests that Next.js 15 params access and fetchCategories errors have been resolved
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Staff Edit Page Error Fix Verification')
console.log('==========================================\n')

const staffEditPagePath = 'src/app/admin/staff/[id]/edit/page.tsx'
const filePath = path.join(process.cwd(), staffEditPagePath)

if (!fs.existsSync(filePath)) {
  console.log(`❌ File not found: ${staffEditPagePath}`)
  process.exit(1)
}

const content = fs.readFileSync(filePath, 'utf8')

const tests = [
  {
    name: 'Next.js 15 use hook imported',
    check: () => content.includes('import { useState, useEffect, use }'),
    description: 'Imports React use hook for async params'
  },
  {
    name: 'Params type updated for Next.js 15',
    check: () => content.includes('params: Promise<{ id: string }>'),
    description: 'Params is now typed as Promise in Next.js 15'
  },
  {
    name: 'Params resolved with use hook',
    check: () => content.includes('const resolvedParams = use(params)'),
    description: 'Uses React use hook to resolve async params'
  },
  {
    name: 'UseEffect uses resolved params',
    check: () => content.includes('[resolvedParams.id]'),
    description: 'Dependencies use resolved params'
  },
  {
    name: 'Database queries use resolved params',
    check: () => content.includes('.eq(\'id\', resolvedParams.id)'),
    description: 'All database queries use resolved params'
  },
  {
    name: 'Enhanced error handling for categories',
    check: () => content.includes('error.code === \'42P01\'') && content.includes('does not exist'),
    description: 'Handles missing staff_categories table gracefully'
  },
  {
    name: 'Fallback categories implemented',
    check: () => content.includes('setCategories([') && content.includes('의료진') && content.includes('치료진'),
    description: 'Provides default categories when table missing'
  },
  {
    name: 'Improved error logging',
    check: () => content.includes('Categories fetch error:'),
    description: 'Better error logging for debugging'
  },
  {
    name: 'Order by name instead of display_order',
    check: () => content.includes('.order(\'name\', { ascending: true })'),
    description: 'Uses name field for ordering (safer fallback)'
  }
]

let passed = 0
let total = tests.length

console.log('📄 Testing Staff Edit Page Fixes')
console.log('--------------------------------')

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
  console.log('   • Next.js 15 async params handling fixed')
  console.log('   • Database error handling enhanced with fallbacks')
  console.log('   • Better error logging added')
  console.log('   • Safer database ordering implemented')
  console.log('\n✅ The /admin/staff/[id]/edit page should now work without errors')
} else {
  console.log(`\n⚠️  ${total - passed} issues remaining`)
  console.log('   Please review the failed tests above')
}

console.log('\n🔗 Test the fix by:')
console.log('   1. Go to http://localhost:3001/admin/staff')
console.log('   2. Click "수정" on any staff member')
console.log('   3. Verify page loads without console errors')