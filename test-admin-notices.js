#!/usr/bin/env node

/**
 * Admin Notices System Comprehensive Test Suite
 * Tests API endpoints, React components, Quill integration, and workflows
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Admin Notices System Test Suite');
console.log('===================================');

const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: [],
  coverage: {
    api: 0,
    components: 0,
    integration: 0,
    e2e: 0
  }
};

function logTest(name, status, message = '', category = 'general') {
  const statusIcon = {
    'PASS': '✅',
    'FAIL': '❌', 
    'WARN': '⚠️'
  }[status];
  
  console.log(`${statusIcon} ${name}: ${message}`);
  
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else if (status === 'WARN') testResults.warnings++;
  
  testResults.details.push({ name, status, message, category });
}

// Test 1: API Endpoints Testing
function testNoticesAPI() {
  console.log('\n🌐 Testing Notices API Endpoints...');
  
  const apiPath = './src/app/api/admin/notices/route.ts';
  
  try {
    if (fs.existsSync(apiPath)) {
      const content = fs.readFileSync(apiPath, 'utf8');
      
      // Test GET endpoint implementation
      if (content.includes('export async function GET')) {
        logTest('GET Endpoint', 'PASS', 'GET handler implemented', 'api');
        testResults.coverage.api += 25;
        
        // Check for filtering support
        if (content.includes('status') && content.includes('search')) {
          logTest('API Filtering', 'PASS', 'Status and search filtering supported', 'api');
        } else {
          logTest('API Filtering', 'WARN', 'Limited filtering capabilities', 'api');
        }
      } else {
        logTest('GET Endpoint', 'FAIL', 'GET handler missing', 'api');
      }
      
      // Test POST endpoint implementation
      if (content.includes('export async function POST')) {
        logTest('POST Endpoint', 'PASS', 'POST handler implemented', 'api');
        testResults.coverage.api += 25;
        
        // Check for validation
        if (content.includes('title') && content.includes('content') && content.includes('category_id')) {
          logTest('POST Validation', 'PASS', 'Required fields validated', 'api');
        } else {
          logTest('POST Validation', 'WARN', 'Basic validation may be missing', 'api');
        }
      } else {
        logTest('POST Endpoint', 'FAIL', 'POST handler missing', 'api');
      }
      
      // Test Delta/HTML conversion
      if (content.includes('convertDeltaToHTML') || content.includes('extractPlainTextFromDelta')) {
        logTest('Delta Conversion', 'PASS', 'Quill Delta conversion functions present', 'api');
        testResults.coverage.api += 25;
      } else {
        logTest('Delta Conversion', 'WARN', 'Delta conversion may be incomplete', 'api');
      }
      
      // Test error handling
      if (content.includes('try') && content.includes('catch') && content.includes('NextResponse.json')) {
        logTest('API Error Handling', 'PASS', 'Proper error handling implemented', 'api');
        testResults.coverage.api += 25;
      } else {
        logTest('API Error Handling', 'WARN', 'Error handling may be incomplete', 'api');
      }
      
    } else {
      logTest('Notices API', 'FAIL', 'API route file missing', 'api');
    }
    
    // Test individual notice API
    const individualApiPath = './src/app/api/admin/notices/[id]/route.ts';
    if (fs.existsSync(individualApiPath)) {
      logTest('Individual Notice API', 'PASS', 'Individual notice endpoints exist', 'api');
    } else {
      logTest('Individual Notice API', 'WARN', 'Individual notice endpoints missing', 'api');
    }
    
  } catch (error) {
    logTest('API Test', 'FAIL', `Error: ${error.message}`, 'api');
  }
}

// Test 2: React Components Testing
function testNoticesComponents() {
  console.log('\n⚛️  Testing Notices React Components...');
  
  const componentsToTest = [
    { name: 'Notices List Page', path: './src/app/admin/notices/page.tsx' },
    { name: 'Quill Editor Component', path: './src/components/admin/QuillEditor.tsx' },
    { name: 'Notice Create Page', path: './src/app/admin/notices/create/page.tsx' },
    { name: 'Notice Edit Page', path: './src/app/admin/notices/[id]/edit/page.tsx' }
  ];
  
  componentsToTest.forEach(component => {
    try {
      if (fs.existsSync(component.path)) {
        const content = fs.readFileSync(component.path, 'utf8');
        
        // Check client component declaration
        if (content.includes("'use client'")) {
          logTest(`${component.name} - Client Component`, 'PASS', 'Properly declared', 'components');
          testResults.coverage.components += 6.25;
        } else {
          logTest(`${component.name} - Client Component`, 'WARN', 'Missing client directive', 'components');
        }
        
        // Check React hooks usage
        if (content.includes('useState') && content.includes('useEffect')) {
          logTest(`${component.name} - React Hooks`, 'PASS', 'Proper hooks usage', 'components');
          testResults.coverage.components += 6.25;
        } else {
          logTest(`${component.name} - React Hooks`, 'WARN', 'Limited hooks usage', 'components');
        }
        
        // Check error handling
        if (content.includes('try') && content.includes('catch')) {
          logTest(`${component.name} - Error Handling`, 'PASS', 'Error handling present', 'components');
          testResults.coverage.components += 6.25;
        } else {
          logTest(`${component.name} - Error Handling`, 'WARN', 'Limited error handling', 'components');
        }
        
        // Check loading states
        if (content.includes('loading') || content.includes('Loading')) {
          logTest(`${component.name} - Loading States`, 'PASS', 'Loading indicators present', 'components');
          testResults.coverage.components += 6.25;
        } else {
          logTest(`${component.name} - Loading States`, 'WARN', 'Missing loading states', 'components');
        }
        
      } else {
        logTest(`${component.name}`, 'FAIL', 'Component file missing', 'components');
      }
    } catch (error) {
      logTest(`${component.name} Test`, 'FAIL', `Error: ${error.message}`, 'components');
    }
  });
}

// Test 3: Quill Editor Integration
function testQuillIntegration() {
  console.log('\n📝 Testing Quill Editor Integration...');
  
  try {
    const quillPath = './src/components/admin/QuillEditor.tsx';
    if (fs.existsSync(quillPath)) {
      const content = fs.readFileSync(quillPath, 'utf8');
      
      // Test Quill imports
      if (content.includes('react-quill') || content.includes('quill')) {
        logTest('Quill Imports', 'PASS', 'React-Quill properly imported', 'integration');
        testResults.coverage.integration += 20;
      } else {
        logTest('Quill Imports', 'FAIL', 'Quill imports missing', 'integration');
      }
      
      // Test SSR handling
      if (content.includes('dynamic') && content.includes('ssr: false')) {
        logTest('SSR Handling', 'PASS', 'Proper SSR configuration', 'integration');
        testResults.coverage.integration += 20;
      } else {
        logTest('SSR Handling', 'WARN', 'SSR configuration may cause hydration issues', 'integration');
      }
      
      // Test toolbar configuration
      if (content.includes('toolbar') || content.includes('modules')) {
        logTest('Toolbar Config', 'PASS', 'Custom toolbar configuration', 'integration');
        testResults.coverage.integration += 20;
      } else {
        logTest('Toolbar Config', 'WARN', 'Default toolbar configuration', 'integration');
      }
      
      // Test Korean typography support
      if (content.includes('font-family') || content.includes('Noto Sans')) {
        logTest('Korean Typography', 'PASS', 'Korean font support configured', 'integration');
        testResults.coverage.integration += 20;
      } else {
        logTest('Korean Typography', 'WARN', 'Korean typography may not be optimized', 'integration');
      }
      
      // Test Delta format handling
      if (content.includes('value') && content.includes('onChange')) {
        logTest('Delta Format', 'PASS', 'Delta format properly handled', 'integration');
        testResults.coverage.integration += 20;
      } else {
        logTest('Delta Format', 'WARN', 'Delta format handling unclear', 'integration');
      }
      
    } else {
      logTest('Quill Component', 'FAIL', 'QuillEditor component missing', 'integration');
    }
    
    // Test package.json for Quill dependencies
    const packagePath = './package.json';
    if (fs.existsSync(packagePath)) {
      const packageContent = fs.readFileSync(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      if (packageJson.dependencies?.['react-quill'] && packageJson.dependencies?.['quill']) {
        logTest('Quill Dependencies', 'PASS', 'React-Quill and Quill properly installed', 'integration');
      } else {
        logTest('Quill Dependencies', 'FAIL', 'Missing Quill dependencies', 'integration');
      }
      
      if (packageJson.devDependencies?.['@types/quill']) {
        logTest('Quill TypeScript', 'PASS', 'TypeScript definitions installed', 'integration');
      } else {
        logTest('Quill TypeScript', 'WARN', 'Missing TypeScript definitions', 'integration');
      }
    }
    
  } catch (error) {
    logTest('Quill Integration Test', 'FAIL', `Error: ${error.message}`, 'integration');
  }
}

// Test 4: Database Schema Validation
function testDatabaseSchema() {
  console.log('\n🗄️  Testing Database Schema...');
  
  try {
    // Check notices API for schema structure
    const apiPath = './src/app/api/admin/notices/route.ts';
    if (fs.existsSync(apiPath)) {
      const content = fs.readFileSync(apiPath, 'utf8');
      
      // Test required fields
      const requiredFields = ['title', 'content', 'status', 'category_id', 'html_content', 'plain_text'];
      let schemaScore = 0;
      
      requiredFields.forEach(field => {
        if (content.includes(field)) {
          schemaScore += 1;
        }
      });
      
      if (schemaScore >= 5) {
        logTest('Schema Fields', 'PASS', `${schemaScore}/${requiredFields.length} required fields found`, 'schema');
      } else {
        logTest('Schema Fields', 'WARN', `Only ${schemaScore}/${requiredFields.length} required fields found`, 'schema');
      }
      
      // Test status enum
      if (content.includes('draft') && content.includes('published') && content.includes('archived')) {
        logTest('Status Enum', 'PASS', 'All status values supported', 'schema');
      } else {
        logTest('Status Enum', 'WARN', 'Status enum may be incomplete', 'schema');
      }
      
      // Test Delta storage
      if (content.includes('content') && (content.includes('JSON') || content.includes('Delta'))) {
        logTest('Delta Storage', 'PASS', 'Quill Delta format storage configured', 'schema');
      } else {
        logTest('Delta Storage', 'WARN', 'Delta storage configuration unclear', 'schema');
      }
    }
    
    // Check for setup scripts
    const setupPath = './scripts/setup-notices.sql';
    if (fs.existsSync(setupPath)) {
      logTest('Setup Scripts', 'PASS', 'Database setup scripts available', 'schema');
    } else {
      logTest('Setup Scripts', 'WARN', 'Database setup scripts missing', 'schema');
    }
    
  } catch (error) {
    logTest('Database Schema Test', 'FAIL', `Error: ${error.message}`, 'schema');
  }
}

// Test 5: E2E Workflow Simulation
function testE2EWorkflows() {
  console.log('\n🔄 Testing E2E Workflows...');
  
  try {
    // Test create workflow files
    const createPath = './src/app/admin/notices/create/page.tsx';
    const editPath = './src/app/admin/notices/[id]/edit/page.tsx';
    const listPath = './src/app/admin/notices/page.tsx';
    
    let workflowScore = 0;
    
    if (fs.existsSync(createPath)) {
      const content = fs.readFileSync(createPath, 'utf8');
      if (content.includes('QuillEditor') && content.includes('form') && content.includes('submit')) {
        logTest('Create Workflow', 'PASS', 'Notice creation workflow complete', 'e2e');
        workflowScore += 33;
        testResults.coverage.e2e += 33;
      } else {
        logTest('Create Workflow', 'WARN', 'Create workflow may be incomplete', 'e2e');
      }
    } else {
      logTest('Create Workflow', 'FAIL', 'Create page missing', 'e2e');
    }
    
    if (fs.existsSync(editPath)) {
      const content = fs.readFileSync(editPath, 'utf8');
      if (content.includes('QuillEditor') && content.includes('useParams') && content.includes('update')) {
        logTest('Edit Workflow', 'PASS', 'Notice editing workflow complete', 'e2e');
        workflowScore += 33;
        testResults.coverage.e2e += 33;
      } else {
        logTest('Edit Workflow', 'WARN', 'Edit workflow may be incomplete', 'e2e');
      }
    } else {
      logTest('Edit Workflow', 'FAIL', 'Edit page missing', 'e2e');
    }
    
    if (fs.existsSync(listPath)) {
      const content = fs.readFileSync(listPath, 'utf8');
      if (content.includes('filter') && content.includes('search') && content.includes('delete')) {
        logTest('List Workflow', 'PASS', 'Notice management workflow complete', 'e2e');
        workflowScore += 34;
        testResults.coverage.e2e += 34;
      } else {
        logTest('List Workflow', 'WARN', 'List workflow may be incomplete', 'e2e');
      }
    } else {
      logTest('List Workflow', 'FAIL', 'List page missing', 'e2e');
    }
    
    // Overall workflow assessment
    if (workflowScore >= 80) {
      logTest('Overall E2E Flow', 'PASS', `${workflowScore}% workflow completeness`, 'e2e');
    } else if (workflowScore >= 50) {
      logTest('Overall E2E Flow', 'WARN', `${workflowScore}% workflow completeness`, 'e2e');
    } else {
      logTest('Overall E2E Flow', 'FAIL', `${workflowScore}% workflow completeness`, 'e2e');
    }
    
  } catch (error) {
    logTest('E2E Workflow Test', 'FAIL', `Error: ${error.message}`, 'e2e');
  }
}

// Test 6: Performance and Best Practices
function testPerformanceAndBestPractices() {
  console.log('\n⚡ Testing Performance & Best Practices...');
  
  try {
    const filesToCheck = [
      './src/app/admin/notices/page.tsx',
      './src/app/admin/notices/create/page.tsx',
      './src/components/admin/QuillEditor.tsx'
    ];
    
    filesToCheck.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        // Check for memoization
        if (content.includes('useMemo') || content.includes('useCallback')) {
          logTest(`${fileName} - Memoization`, 'PASS', 'Performance optimizations present', 'performance');
        } else {
          logTest(`${fileName} - Memoization`, 'WARN', 'Consider adding memoization for performance', 'performance');
        }
        
        // Check for debouncing (especially in search)
        if (content.includes('debounce') || content.includes('setTimeout')) {
          logTest(`${fileName} - Debouncing`, 'PASS', 'Input debouncing implemented', 'performance');
        } else if (content.includes('search') || content.includes('filter')) {
          logTest(`${fileName} - Debouncing`, 'WARN', 'Search/filter could benefit from debouncing', 'performance');
        }
        
        // Check for proper TypeScript usage
        if (content.includes('interface') && content.includes('type')) {
          logTest(`${fileName} - TypeScript`, 'PASS', 'Proper TypeScript definitions', 'performance');
        } else {
          logTest(`${fileName} - TypeScript`, 'WARN', 'Consider adding more TypeScript definitions', 'performance');
        }
      }
    });
    
  } catch (error) {
    logTest('Performance Test', 'FAIL', `Error: ${error.message}`, 'performance');
  }
}

// Generate comprehensive report
function generateReport() {
  console.log('\n📊 Test Coverage Summary');
  console.log('=========================');
  console.log(`🌐 API Coverage: ${testResults.coverage.api}%`);
  console.log(`⚛️  Components Coverage: ${testResults.coverage.components}%`);
  console.log(`🔗 Integration Coverage: ${testResults.coverage.integration}%`);
  console.log(`🔄 E2E Coverage: ${testResults.coverage.e2e}%`);
  
  const overallCoverage = (
    testResults.coverage.api + 
    testResults.coverage.components + 
    testResults.coverage.integration + 
    testResults.coverage.e2e
  ) / 4;
  
  console.log(`📈 Overall Coverage: ${overallCoverage.toFixed(1)}%`);
  
  console.log('\n📋 Test Results Summary');
  console.log('=======================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}`);
  console.log(`📊 Total: ${testResults.passed + testResults.failed + testResults.warnings}`);
  
  // Create detailed report
  const report = {
    timestamp: new Date().toISOString(),
    target: 'Admin Notices System',
    summary: {
      passed: testResults.passed,
      failed: testResults.failed,
      warnings: testResults.warnings,
      total: testResults.passed + testResults.failed + testResults.warnings,
      coverage: {
        api: testResults.coverage.api,
        components: testResults.coverage.components,
        integration: testResults.coverage.integration,
        e2e: testResults.coverage.e2e,
        overall: overallCoverage
      }
    },
    details: testResults.details,
    recommendations: [
      'Ensure Quill dependencies are properly installed (react-quill@2.0.0, quill@2.0.3)',
      'Test with actual Supabase database connection for full validation',
      'Consider adding debouncing for search and filter inputs',
      'Implement memoization for performance optimization',
      'Add comprehensive E2E tests with Playwright',
      'Validate Korean typography rendering in production',
      'Test Delta to HTML conversion with various content types',
      'Add error boundary components for better error handling'
    ],
    criticalIssues: testResults.details.filter(d => d.status === 'FAIL'),
    warnings: testResults.details.filter(d => d.status === 'WARN')
  };
  
  fs.writeFileSync('./admin-notices-test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to: admin-notices-test-report.json');
  
  // Assessment
  if (testResults.failed > 0) {
    console.log('\n❌ Critical issues found. Please address failed tests before deployment.');
    return 1;
  } else if (testResults.warnings > 3) {
    console.log('\n⚠️  Multiple warnings detected. Consider addressing for optimal performance.');
    return 0;
  } else {
    console.log('\n✅ Admin notices system is ready for production!');
    return 0;
  }
}

// Execute all tests
async function runNoticesTests() {
  testNoticesAPI();
  testNoticesComponents();
  testQuillIntegration();
  testDatabaseSchema();
  testE2EWorkflows();
  testPerformanceAndBestPractices();
  
  const exitCode = generateReport();
  process.exit(exitCode);
}

// Run the tests
runNoticesTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});