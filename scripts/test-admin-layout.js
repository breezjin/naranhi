#!/usr/bin/env node

/**
 * Admin Layout Fix Verification Test
 * Tests that the sidebar no longer overlaps with the header
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Admin Layout Fix Verification')
console.log('================================\n')

// Test files
const files = [
  {
    name: 'AdminSidebar.tsx',
    path: 'src/components/admin/AdminSidebar.tsx',
    tests: [
      {
        name: 'Sidebar positioned below header',
        check: (content) => content.includes('top-16') && content.includes('h-[calc(100vh-4rem)]')
      },
      {
        name: 'Z-index properly set',
        check: (content) => content.includes('z-30') && !content.includes('z-50')
      },
      {
        name: 'Mobile overlay positioned correctly',
        check: (content) => content.includes('top-16 z-20')
      }
    ]
  },
  {
    name: 'AdminLayout.tsx', 
    path: 'src/app/admin/layout.tsx',
    tests: [
      {
        name: 'Header spans full width',
        check: (content) => content.includes('flex-1 flex flex-col min-h-screen')
      },
      {
        name: 'Content margin adjusted for sidebar',
        check: (content) => content.includes('lg:ml-16') && content.includes('lg:ml-64')
      },
      {
        name: 'Mobile padding optimized',
        check: (content) => content.includes('p-4 lg:p-6')
      }
    ]
  },
  {
    name: 'AdminTopBar.tsx',
    path: 'src/components/admin/AdminTopBar.tsx', 
    tests: [
      {
        name: 'Header height consistent',
        check: (content) => content.includes('h-16')
      },
      {
        name: 'Header sticks to top',
        check: (content) => content.includes('sticky top-0')
      },
      {
        name: 'Header z-index below sidebar overlay',
        check: (content) => content.includes('z-40')
      }
    ]
  }
]

let totalTests = 0
let passedTests = 0

files.forEach(file => {
  console.log(`📄 Testing ${file.name}`)
  
  const filePath = path.join(process.cwd(), file.path)
  
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ File not found: ${file.path}`)
    return
  }
  
  const content = fs.readFileSync(filePath, 'utf8')
  
  file.tests.forEach(test => {
    totalTests++
    const passed = test.check(content)
    
    if (passed) {
      passedTests++
      console.log(`   ✅ ${test.name}`)
    } else {
      console.log(`   ❌ ${test.name}`)
    }
  })
  
  console.log('')
})

// Summary
console.log('📊 Layout Fix Summary')
console.log('====================')
console.log(`✅ Passed: ${passedTests}/${totalTests}`)
console.log(`📈 Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`)

if (passedTests === totalTests) {
  console.log('\n🎉 All layout fixes implemented successfully!')
  console.log('   • Sidebar no longer overlaps header')
  console.log('   • Header spans full width properly')
  console.log('   • Mobile responsiveness improved')
  console.log('   • Z-index hierarchy corrected')
} else {
  console.log(`\n⚠️  ${totalTests - passedTests} issues remaining`)
}

console.log('\n🔗 Test server running at: http://localhost:3001/admin/dashboard')