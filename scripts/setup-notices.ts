/**
 * Setup script for notices tables with Quill editor support
 * Part of Phase 2-C: Notice Management System
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQL(sql: string, description: string) {
  console.log(`🔄 ${description}...`)
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.log(`   ⚠️  ${description} error: ${error.message}`)
      return false
    } else {
      console.log(`   ✅ ${description} completed`)
      return true
    }
  } catch (error) {
    console.error(`   ❌ ${description} failed:`, error)
    return false
  }
}

async function setupNoticesSchema() {
  console.log('🚀 Setting up Notices Schema for Quill Editor\n')

  const sqlPath = path.join(__dirname, 'setup-notices-schema.sql')
  const sqlContent = fs.readFileSync(sqlPath, 'utf-8')

  // Split SQL into individual statements
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

  let successCount = 0
  let errorCount = 0

  for (const statement of statements) {
    if (statement.trim()) {
      const success = await executeSQL(statement, 'Executing SQL statement')
      if (success) {
        successCount++
      } else {
        errorCount++
      }
    }
  }

  console.log('\n📊 Setup Results')
  console.log('═══════════════')
  console.log(`✅ Successful statements: ${successCount}`)
  console.log(`❌ Failed statements: ${errorCount}`)

  if (errorCount === 0) {
    console.log('\n🎉 Notices schema setup completed successfully!')
    console.log('\n📝 Created tables:')
    console.log('   📁 notice_categories - Notice categorization')
    console.log('   📄 notices - Main notices with Quill content')
    console.log('\n🔧 Features enabled:')
    console.log('   ✍️  Quill Delta format storage (JSONB)')
    console.log('   🔍 Full-text search (Korean)')
    console.log('   📊 View counting and analytics')
    console.log('   🏷️  Tagging system')
    console.log('   📅 Publishing workflow')
    console.log('   🎯 SEO optimization')
  } else {
    console.log('\n⚠️  Setup completed with some issues')
    console.log('   Please check the errors above')
  }

  return errorCount === 0
}

if (require.main === module) {
  setupNoticesSchema().catch(error => {
    console.error('Setup error:', error)
    process.exit(1)
  })
}

export { setupNoticesSchema }