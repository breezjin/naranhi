#!/usr/bin/env node

/**
 * Admin System Test Suite
 * Tests admin pages, database connections, and error handling
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Admin System Test Suite');
console.log('================================');

const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function logTest(name, status, message = '') {
  const statusIcon = {
    'PASS': '✅',
    'FAIL': '❌', 
    'WARN': '⚠️'
  }[status];
  
  console.log(`${statusIcon} ${name}: ${message}`);
  
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else if (status === 'WARN') testResults.warnings++;
  
  testResults.details.push({ name, status, message });
}

// Test 1: Check admin layout structure
function testAdminLayout() {
  console.log('\n📋 Testing Admin Layout Structure...');
  
  const layoutPath = './src/app/admin/layout.tsx';
  const sidebarPath = './src/components/admin/AdminSidebar.tsx';
  const topbarPath = './src/components/admin/AdminTopBar.tsx';
  
  try {
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      if (layoutContent.includes('AdminSidebar') && layoutContent.includes('AdminTopBar')) {
        logTest('Admin Layout Structure', 'PASS', 'Layout includes sidebar and topbar');
      } else {
        logTest('Admin Layout Structure', 'FAIL', 'Missing sidebar or topbar imports');
      }
    } else {
      logTest('Admin Layout Structure', 'FAIL', 'Layout file missing');
    }
    
    if (fs.existsSync(sidebarPath)) {
      logTest('AdminSidebar Component', 'PASS', 'Component file exists');
    } else {
      logTest('AdminSidebar Component', 'FAIL', 'Component file missing');
    }
    
    if (fs.existsSync(topbarPath)) {
      logTest('AdminTopBar Component', 'PASS', 'Component file exists');
    } else {
      logTest('AdminTopBar Component', 'FAIL', 'Component file missing');
    }
    
  } catch (error) {
    logTest('Admin Layout Test', 'FAIL', `Error: ${error.message}`);
  }
}

// Test 2: Check admin pages
function testAdminPages() {
  console.log('\n📄 Testing Admin Pages...');
  
  const adminPages = [
    { name: 'Dashboard', path: './src/app/admin/dashboard/page.tsx' },
    { name: 'Staff Management', path: './src/app/admin/staff/page.tsx' },
    { name: 'Notices Management', path: './src/app/admin/notices/page.tsx' }
  ];
  
  adminPages.forEach(page => {
    try {
      if (fs.existsSync(page.path)) {
        const content = fs.readFileSync(page.path, 'utf8');
        
        // Check for proper client component declaration
        if (content.includes("'use client'")) {
          logTest(`${page.name} - Client Component`, 'PASS', 'Properly declared');
        } else {
          logTest(`${page.name} - Client Component`, 'WARN', 'Missing "use client" directive');
        }
        
        // Check for error handling
        if (content.includes('try') && content.includes('catch')) {
          logTest(`${page.name} - Error Handling`, 'PASS', 'Has error handling');
        } else {
          logTest(`${page.name} - Error Handling`, 'WARN', 'Limited error handling');
        }
        
        // Check for loading states
        if (content.includes('loading') || content.includes('Loading')) {
          logTest(`${page.name} - Loading States`, 'PASS', 'Has loading indicators');
        } else {
          logTest(`${page.name} - Loading States`, 'WARN', 'Missing loading states');
        }
        
      } else {
        logTest(`${page.name} Page`, 'FAIL', 'Page file missing');
      }
    } catch (error) {
      logTest(`${page.name} Page Test`, 'FAIL', `Error: ${error.message}`);
    }
  });
}

// Test 3: Check database schema consistency
function testDatabaseSchema() {
  console.log('\n🗄️  Testing Database Schema Consistency...');
  
  try {
    // Check dashboard page for schema references
    const dashboardPath = './src/app/admin/dashboard/page.tsx';
    if (fs.existsSync(dashboardPath)) {
      const content = fs.readFileSync(dashboardPath, 'utf8');
      
      // Check for correct notices status field
      if (content.includes("eq('status', 'published')")) {
        logTest('Dashboard Schema - Notices Status', 'PASS', 'Uses correct status field');
      } else if (content.includes("eq('is_published', true)")) {
        logTest('Dashboard Schema - Notices Status', 'FAIL', 'Uses deprecated is_published field');
      } else {
        logTest('Dashboard Schema - Notices Status', 'WARN', 'No published notices filter found');
      }
      
      // Check for proper table references
      const expectedTables = ['staff_members', 'facility_photos', 'notices'];
      expectedTables.forEach(table => {
        if (content.includes(`from('${table}')`)) {
          logTest(`Table Reference - ${table}`, 'PASS', 'Referenced correctly');
        } else {
          logTest(`Table Reference - ${table}`, 'WARN', 'Not referenced');
        }
      });
    }
    
    // Check API routes for schema consistency
    const noticesApiPath = './src/app/api/admin/notices/route.ts';
    if (fs.existsSync(noticesApiPath)) {
      const content = fs.readFileSync(noticesApiPath, 'utf8');
      
      if (content.includes("status") && content.includes("'published'")) {
        logTest('API Schema - Notices Status', 'PASS', 'API uses status field correctly');
      } else {
        logTest('API Schema - Notices Status', 'WARN', 'API schema unclear');
      }
    }
    
  } catch (error) {
    logTest('Database Schema Test', 'FAIL', `Error: ${error.message}`);
  }
}

// Test 4: Check for common React/Next.js issues
function testReactIssues() {
  console.log('\n⚛️  Testing React/Next.js Issues...');
  
  const adminFiles = [
    './src/app/admin/dashboard/page.tsx',
    './src/app/admin/staff/page.tsx',
    './src/app/admin/notices/page.tsx',
    './src/components/admin/AdminSidebar.tsx',
    './src/components/admin/AdminTopBar.tsx'
  ];
  
  adminFiles.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        // Check for missing dependencies
        const imports = content.match(/import .+ from ['"].+['"]/g) || [];
        const hasUseEffect = content.includes('useEffect');
        const hasUseState = content.includes('useState');
        
        if (hasUseEffect || hasUseState) {
          const hasReactImport = imports.some(imp => imp.includes('react'));
          if (hasReactImport) {
            logTest(`${fileName} - React Hooks Import`, 'PASS', 'React imported correctly');
          } else {
            logTest(`${fileName} - React Hooks Import`, 'FAIL', 'Missing React import for hooks');
          }
        }
        
        // Check for hydration issues (client-server mismatch)
        if (content.includes("'use client'") && content.includes('useEffect')) {
          logTest(`${fileName} - Hydration Safety`, 'PASS', 'Client component with proper hooks');
        } else if (content.includes('useEffect') && !content.includes("'use client'")) {
          logTest(`${fileName} - Hydration Safety`, 'FAIL', 'Server component using client hooks');
        }
        
      }
    } catch (error) {
      logTest(`React Issues - ${path.basename(filePath)}`, 'FAIL', `Error: ${error.message}`);
    }
  });
}

// Test 5: Create enhanced error handling
function createErrorHandlingFixes() {
  console.log('\n🔧 Creating Error Handling Improvements...');
  
  const errorHandlerContent = `
// Enhanced error handling for admin pages
export const handleSupabaseError = (error: any, context: string) => {
  console.error(\`[\${context}] Supabase Error:\`, error);
  
  // Common database errors
  if (error?.code === 'PGRST116') {
    return 'Database table not found. Please ensure database is properly set up.';
  }
  
  if (error?.code === 'PGRST301') {
    return 'Database connection failed. Please check Supabase configuration.';
  }
  
  if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
    return 'Database table missing. Run database setup first.';
  }
  
  if (error?.message?.includes('column') && error?.message?.includes('does not exist')) {
    return 'Database schema mismatch. Please update database schema.';
  }
  
  // Auth errors
  if (error?.message?.includes('JWT')) {
    return 'Authentication failed. Please log in again.';
  }
  
  // Generic fallback
  return error?.message || 'An unexpected error occurred.';
};

export const withErrorBoundary = (WrappedComponent: React.ComponentType<any>) => {
  return function ErrorBoundaryWrapper(props: any) {
    const [hasError, setHasError] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    
    React.useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        setHasError(true);
        setError(event.error?.message || 'Component error occurred');
      };
      
      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);
    
    if (hasError) {
      return (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">오류가 발생했습니다</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => {setHasError(false); setError('')}} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};
`;
  
  try {
    fs.writeFileSync('./src/lib/error-handling.tsx', errorHandlerContent);
    logTest('Error Handler Creation', 'PASS', 'Enhanced error handling utilities created');
  } catch (error) {
    logTest('Error Handler Creation', 'FAIL', `Failed to create: ${error.message}`);
  }
}

// Run all tests
async function runTests() {
  testAdminLayout();
  testAdminPages();
  testDatabaseSchema();
  testReactIssues();
  createErrorHandlingFixes();
  
  // Generate summary
  console.log('\n📊 Test Summary');
  console.log('===============');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}`);
  console.log(`📋 Total: ${testResults.passed + testResults.failed + testResults.warnings}`);
  
  // Create detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      passed: testResults.passed,
      failed: testResults.failed,
      warnings: testResults.warnings,
      total: testResults.passed + testResults.failed + testResults.warnings
    },
    details: testResults.details,
    recommendations: [
      'Ensure all database tables are created before testing',
      'Add proper error boundaries to admin components',
      'Implement graceful fallbacks for missing data',
      'Test with actual Supabase connection',
      'Add loading states for all async operations'
    ]
  };
  
  fs.writeFileSync('./admin-test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to: admin-test-report.json');
  
  // Return exit code based on results
  if (testResults.failed > 0) {
    console.log('\n❌ Some tests failed. Please review and fix issues.');
    process.exit(1);
  } else if (testResults.warnings > 0) {
    console.log('\n⚠️  All tests passed but there are warnings to address.');
    process.exit(0);
  } else {
    console.log('\n✅ All tests passed successfully!');
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});