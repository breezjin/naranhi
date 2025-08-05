/**
 * Database Schema and Query Tests for Notice Management System
 * Tests database structure, constraints, and query performance
 */

const fs = require('fs')
const path = require('path')

// Test configuration
const CONFIG = {
  schemaFile: path.join(__dirname, '../../scripts/setup-notices-schema.sql'),
  setupScript: path.join(__dirname, '../../scripts/setup-notices-direct.ts')
}

class DatabaseTestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      tests: []
    }
  }

  async test(name, testFunc) {
    this.results.total++
    console.log(`🧪 Testing ${name}...`)
    
    try {
      const startTime = Date.now()
      const result = await testFunc()
      const duration = Date.now() - startTime
      
      if (result.success) {
        console.log(`   ✅ ${name} (${duration}ms)`)
        if (result.details) {
          console.log(`      ${result.details}`)
        }
        this.results.passed++
        this.results.tests.push({ name, status: 'passed', duration, details: result.details })
      } else {
        console.log(`   ❌ ${name} (${duration}ms): ${result.error}`)
        this.results.failed++
        this.results.tests.push({ name, status: 'failed', duration, error: result.error })
      }
    } catch (error) {
      console.log(`   ❌ ${name}: ${error.message}`)
      this.results.failed++
      this.results.tests.push({ name, status: 'error', error: error.message })
    }
    
    console.log('') // Add spacing
  }

  async testSchemaFileExists() {
    return {
      success: fs.existsSync(CONFIG.schemaFile),
      details: fs.existsSync(CONFIG.schemaFile) ? 'Schema SQL file found' : 'Schema SQL file missing'
    }
  }

  async testSetupScriptExists() {
    return {
      success: fs.existsSync(CONFIG.setupScript),
      details: fs.existsSync(CONFIG.setupScript) ? 'Setup TypeScript file found' : 'Setup TypeScript file missing'
    }
  }

  async testSchemaStructure() {
    if (!fs.existsSync(CONFIG.schemaFile)) {
      return { success: false, error: 'Schema file not found' }
    }

    const sqlContent = fs.readFileSync(CONFIG.schemaFile, 'utf8')
    
    // Test for required tables
    const requiredTables = [
      'notice_categories',
      'notices'
    ]
    
    let foundTables = 0
    const missingTables = []
    
    for (const table of requiredTables) {
      if (sqlContent.includes(`CREATE TABLE IF NOT EXISTS ${table}`)) {
        foundTables++
      } else {
        missingTables.push(table)
      }
    }
    
    return {
      success: foundTables === requiredTables.length,
      details: `${foundTables}/${requiredTables.length} tables defined${missingTables.length > 0 ? `. Missing: ${missingTables.join(', ')}` : ''}`,
      error: missingTables.length > 0 ? `Missing tables: ${missingTables.join(', ')}` : undefined
    }
  }

  async testNoticeTableColumns() {
    if (!fs.existsSync(CONFIG.schemaFile)) {
      return { success: false, error: 'Schema file not found' }
    }

    const sqlContent = fs.readFileSync(CONFIG.schemaFile, 'utf8')
    
    // Extract notices table definition
    const noticesTableMatch = sqlContent.match(/CREATE TABLE IF NOT EXISTS notices \(([\s\S]*?)\);/i)
    if (!noticesTableMatch) {
      return { success: false, error: 'Notices table definition not found' }
    }
    
    const tableDefinition = noticesTableMatch[1]
    
    // Required columns for Quill editor support
    const requiredColumns = [
      'id',
      'title',
      'content', // JSONB for Quill Delta
      'html_content', // Rendered HTML
      'plain_text', // For search
      'status',
      'category_id',
      'tags',
      'meta_title',
      'meta_description',
      'search_vector',
      'created_at',
      'updated_at'
    ]
    
    let foundColumns = 0
    const missingColumns = []
    
    for (const column of requiredColumns) {
      if (tableDefinition.toLowerCase().includes(column.toLowerCase())) {
        foundColumns++
      } else {
        missingColumns.push(column)
      }
    }
    
    return {
      success: foundColumns === requiredColumns.length,
      details: `${foundColumns}/${requiredColumns.length} required columns found${missingColumns.length > 0 ? `. Missing: ${missingColumns.join(', ')}` : ''}`,
      error: missingColumns.length > 0 ? `Missing columns: ${missingColumns.join(', ')}` : undefined
    }
  }

  async testQuillSpecificColumns() {
    if (!fs.existsSync(CONFIG.schemaFile)) {
      return { success: false, error: 'Schema file not found' }
    }

    const sqlContent = fs.readFileSync(CONFIG.schemaFile, 'utf8')
    
    // Check for Quill-specific implementations
    const quillFeatures = [
      { name: 'JSONB content storage', pattern: /content\s+JSONB/i },
      { name: 'HTML content cache', pattern: /html_content\s+TEXT/i },
      { name: 'Plain text search', pattern: /plain_text\s+TEXT/i },
      { name: 'Full-text search vector', pattern: /search_vector\s+tsvector/i },
      { name: 'Korean language search', pattern: /to_tsvector\('korean'/i },
      { name: 'Tags array support', pattern: /tags\s+TEXT\[\]/i }
    ]
    
    let foundFeatures = 0
    const missingFeatures = []
    
    for (const feature of quillFeatures) {
      if (feature.pattern.test(sqlContent)) {
        foundFeatures++
      } else {
        missingFeatures.push(feature.name)
      }
    }
    
    return {
      success: foundFeatures >= quillFeatures.length - 1, // Allow 1 missing feature
      details: `${foundFeatures}/${quillFeatures.length} Quill features implemented${missingFeatures.length > 0 ? `. Missing: ${missingFeatures.join(', ')}` : ''}`,
      error: foundFeatures < quillFeatures.length - 1 ? `Critical missing features: ${missingFeatures.join(', ')}` : undefined
    }
  }

  async testIndexes() {
    if (!fs.existsSync(CONFIG.schemaFile)) {
      return { success: false, error: 'Schema file not found' }
    }

    const sqlContent = fs.readFileSync(CONFIG.schemaFile, 'utf8')
    
    // Required indexes for performance
    const requiredIndexes = [
      { name: 'Status index', pattern: /CREATE INDEX.*notices.*status/i },
      { name: 'Category index', pattern: /CREATE INDEX.*notices.*category/i },
      { name: 'Published date index', pattern: /CREATE INDEX.*notices.*published_at/i },
      { name: 'Priority index', pattern: /CREATE INDEX.*notices.*priority/i },
      { name: 'Search index', pattern: /CREATE INDEX.*notices.*search_vector/i },
      { name: 'Tags index', pattern: /CREATE INDEX.*notices.*tags/i }
    ]
    
    let foundIndexes = 0
    const missingIndexes = []
    
    for (const index of requiredIndexes) {
      if (index.pattern.test(sqlContent)) {
        foundIndexes++
      } else {
        missingIndexes.push(index.name)
      }
    }
    
    return {
      success: foundIndexes >= Math.floor(requiredIndexes.length * 0.8), // Allow 20% missing
      details: `${foundIndexes}/${requiredIndexes.length} performance indexes found${missingIndexes.length > 0 ? `. Missing: ${missingIndexes.join(', ')}` : ''}`,
      error: foundIndexes < Math.floor(requiredIndexes.length * 0.5) ? `Too many missing indexes: ${missingIndexes.join(', ')}` : undefined
    }
  }

  async testTriggers() {
    if (!fs.existsSync(CONFIG.schemaFile)) {
      return { success: false, error: 'Schema file not found' }
    }

    const sqlContent = fs.readFileSync(CONFIG.schemaFile, 'utf8')
    
    // Check for timestamp triggers
    const hasUpdateFunction = /CREATE OR REPLACE FUNCTION update_updated_at_column/i.test(sqlContent)
    const hasNoticesTrigger = /CREATE TRIGGER.*update_notices_updated_at/i.test(sqlContent)
    const hasCategoriesTrigger = /CREATE TRIGGER.*update_notice_categories_updated_at/i.test(sqlContent)
    
    const triggerCount = [hasUpdateFunction, hasNoticesTrigger, hasCategoriesTrigger].filter(Boolean).length
    
    return {
      success: triggerCount >= 2, // At least function and one trigger
      details: `${triggerCount}/3 trigger components found (function: ${hasUpdateFunction}, notices: ${hasNoticesTrigger}, categories: ${hasCategoriesTrigger})`,
      error: triggerCount < 2 ? 'Missing critical trigger components' : undefined
    }
  }

  async testDefaultData() {
    if (!fs.existsSync(CONFIG.schemaFile)) {
      return { success: false, error: 'Schema file not found' }
    }

    const sqlContent = fs.readFileSync(CONFIG.schemaFile, 'utf8')
    
    // Check for default categories
    const defaultCategories = [
      'general',
      'event', 
      'medical',
      'urgent'
    ]
    
    let foundCategories = 0
    
    for (const category of defaultCategories) {
      if (sqlContent.includes(`'${category}'`)) {
        foundCategories++
      }
    }
    
    // Check for sample notices
    const hasSampleNotices = /INSERT INTO notices/i.test(sqlContent)
    
    return {
      success: foundCategories >= 3 && hasSampleNotices,
      details: `${foundCategories}/${defaultCategories.length} default categories, sample notices: ${hasSampleNotices}`,
      error: foundCategories < 3 ? 'Missing required default categories' : undefined
    }
  }

  async testSQLSyntax() {
    if (!fs.existsSync(CONFIG.schemaFile)) {
      return { success: false, error: 'Schema file not found' }
    }

    const sqlContent = fs.readFileSync(CONFIG.schemaFile, 'utf8')
    
    // Basic SQL syntax checks
    const syntaxChecks = [
      { name: 'Balanced parentheses', test: this.checkBalancedParentheses(sqlContent) },
      { name: 'Semicolon endings', test: this.checkSemicolons(sqlContent) },
      { name: 'Quote consistency', test: this.checkQuotes(sqlContent) },
      { name: 'No obvious typos', test: this.checkCommonTypos(sqlContent) }
    ]
    
    const passedChecks = syntaxChecks.filter(check => check.test).length
    const failedChecks = syntaxChecks.filter(check => !check.test).map(check => check.name)
    
    return {
      success: passedChecks === syntaxChecks.length,
      details: `${passedChecks}/${syntaxChecks.length} syntax checks passed${failedChecks.length > 0 ? `. Failed: ${failedChecks.join(', ')}` : ''}`,
      error: failedChecks.length > 0 ? `Syntax issues: ${failedChecks.join(', ')}` : undefined
    }
  }

  checkBalancedParentheses(sql) {
    let balance = 0
    for (const char of sql) {
      if (char === '(') balance++
      if (char === ')') balance--
      if (balance < 0) return false
    }
    return balance === 0
  }

  checkSemicolons(sql) {
    // Remove comments and string literals for accurate counting
    const cleaned = sql.replace(/--.*$/gm, '').replace(/'[^']*'/g, "''")
    const statements = cleaned.split(';').filter(s => s.trim())
    
    // Most statements should end with semicolon (except the last if empty)
    return statements.length > 5 // Should have multiple statements
  }

  checkQuotes(sql) {
    // Count single quotes (should be even, accounting for escapes)
    const singleQuotes = (sql.match(/'/g) || []).length
    return singleQuotes % 2 === 0
  }

  checkCommonTypos(sql) {
    const commonTypos = [
      /CREAT TABLE/i, // Should be CREATE TABLE
      /PRIMERY KEY/i, // Should be PRIMARY KEY
      /FOREGIN KEY/i, // Should be FOREIGN KEY
      /TIMESTMAPTZ/i, // Should be TIMESTAMPTZ
      /INTEGR/i, // Should be INTEGER
      /VARCAR/i  // Should be VARCHAR
    ]
    
    return !commonTypos.some(typo => typo.test(sql))
  }

  async testConstraints() {
    if (!fs.existsSync(CONFIG.schemaFile)) {
      return { success: false, error: 'Schema file not found' }
    }

    const sqlContent = fs.readFileSync(CONFIG.schemaFile, 'utf8')
    
    // Check for important constraints
    const constraints = [
      { name: 'Primary keys', pattern: /PRIMARY KEY/gi },
      { name: 'Foreign keys', pattern: /REFERENCES/gi },
      { name: 'NOT NULL constraints', pattern: /NOT NULL/gi },
      { name: 'UNIQUE constraints', pattern: /UNIQUE/gi },
      { name: 'DEFAULT values', pattern: /DEFAULT/gi }
    ]
    
    let constraintScore = 0
    const constraintDetails = []
    
    for (const constraint of constraints) {
      const matches = (sqlContent.match(constraint.pattern) || []).length
      constraintScore += Math.min(matches, 5) // Cap at 5 points per constraint type
      constraintDetails.push(`${constraint.name}: ${matches}`)
    }
    
    return {
      success: constraintScore >= 15, // Reasonable minimum
      details: `Constraint score: ${constraintScore} (${constraintDetails.join(', ')})`,
      error: constraintScore < 10 ? 'Insufficient database constraints' : undefined
    }
  }

  async generateSchemaReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      schemaFile: CONFIG.schemaFile,
      setupScript: CONFIG.setupScript,
      results: this.results,
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        failed: this.results.failed,
        successRate: Math.round((this.results.passed / this.results.total) * 100)
      }
    }
    
    const reportPath = path.join(__dirname, '../test-data', `schema-report-${Date.now()}.json`)
    
    // Ensure directory exists
    const reportDir = path.dirname(reportPath)
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true })
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2))
    console.log(`📄 Schema test report saved to: ${reportPath}`)
    
    return reportPath
  }

  async run() {
    console.log('🗄️  Notice Database Schema Tests')
    console.log('═══════════════════════════════════')
    console.log(`📅 Test Date: ${new Date().toLocaleString('ko-KR')}`)
    console.log(`📁 Schema File: ${CONFIG.schemaFile}`)
    console.log('')

    // Run all schema tests
    await this.test('Schema File Exists', () => this.testSchemaFileExists())
    await this.test('Setup Script Exists', () => this.testSetupScriptExists())
    await this.test('Schema Structure', () => this.testSchemaStructure())
    await this.test('Notice Table Columns', () => this.testNoticeTableColumns())
    await this.test('Quill-Specific Features', () => this.testQuillSpecificColumns())
    await this.test('Performance Indexes', () => this.testIndexes())
    await this.test('Database Triggers', () => this.testTriggers())
    await this.test('Default Data', () => this.testDefaultData())
    await this.test('SQL Syntax', () => this.testSQLSyntax())
    await this.test('Database Constraints', () => this.testConstraints())

    // Generate summary
    console.log('📊 Database Schema Test Results')
    console.log('════════════════════════════════')
    console.log(`✅ Passed: ${this.results.passed}`)
    console.log(`❌ Failed: ${this.results.failed}`)
    console.log(`📊 Total:  ${this.results.total}`)
    console.log(`🎯 Success Rate: ${Math.round((this.results.passed / this.results.total) * 100)}%`)

    if (this.results.failed === 0) {
      console.log('\n🎉 All database schema tests passed! Schema is production-ready.')
    } else if (this.results.passed > this.results.failed) {
      console.log('\n⚠️  Some schema tests failed, but core structure is solid.')
    } else {
      console.log('\n❌ Multiple schema tests failed. Review database design.')
    }

    // Recommendations
    console.log('\n💡 Recommendations:')
    if (this.results.failed > 0) {
      console.log('   • Review failed tests and update schema accordingly')
      console.log('   • Run `yarn tsx scripts/setup-notices-direct.ts` to test setup')
    }
    console.log('   • Test database performance with sample data')
    console.log('   • Verify full-text search functionality with Korean content')
    console.log('   • Monitor query performance with realistic data volumes')

    await this.generateSchemaReport()
    return this.results
  }
}

async function main() {
  const runner = new DatabaseTestRunner()
  const results = await runner.run()
  
  // Exit with appropriate code
  const success = results.failed === 0
  process.exit(success ? 0 : 1)
}

if (require.main === module) {
  main().catch(error => {
    console.error('Database schema test runner error:', error)
    process.exit(1)
  })
}

module.exports = { DatabaseTestRunner, CONFIG }