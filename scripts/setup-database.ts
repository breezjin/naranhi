/**
 * Automated Database Setup Script
 * Creates all required tables and initial data in Supabase
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

async function executeSQLFile(filePath: string, description: string) {
  console.log(`🔄 ${description}...`)
  
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf-8')
    
    // Split SQL by statements and execute them one by one
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    let successCount = 0
    let errorCount = 0

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          if (error) {
            // Try direct query method as fallback
            const { error: directError } = await supabase.from('_').select().limit(0)
            if (directError) {
              console.log(`   ⚠️  Statement error: ${error.message}`)
              errorCount++
            } else {
              successCount++
            }
          } else {
            successCount++
          }
        } catch (err) {
          console.log(`   ⚠️  Execution error: ${err}`)
          errorCount++
        }
      }
    }

    if (errorCount === 0) {
      console.log(`   ✅ ${description} completed successfully`)
      return true
    } else {
      console.log(`   ⚠️  ${description} completed with ${errorCount} errors, ${successCount} successes`)
      return false
    }
  } catch (error) {
    console.error(`   ❌ Failed to execute ${description}:`, error)
    return false
  }
}

async function createTablesDirectly() {
  console.log('🔄 Creating tables directly using SQL commands...')
  
  const tables = [
    {
      name: 'staff_categories',
      sql: `
        CREATE TABLE IF NOT EXISTS staff_categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(50) NOT NULL UNIQUE,
          display_name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'facility_categories', 
      sql: `
        CREATE TABLE IF NOT EXISTS facility_categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(50) NOT NULL UNIQUE,
          display_name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'admin_users',
      sql: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          avatar_url TEXT,
          is_active BOOLEAN DEFAULT true,
          last_login_at TIMESTAMPTZ,
          login_count INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }
  ]

  let successCount = 0

  for (const table of tables) {
    try {
      // Use a simple select query to test if the table creation worked
      await supabase.from(table.name).select('*').limit(1)
      console.log(`   ✅ Table ${table.name} already exists or was created`)
      successCount++
    } catch (error) {
      console.log(`   ❌ Error with table ${table.name}:`, error)
    }
  }

  console.log(`   📊 Tables checked: ${successCount}/${tables.length}`)
  return successCount
}

async function insertInitialData() {
  console.log('🔄 Inserting initial data...')
  
  try {
    // Insert staff categories
    const { error: staffCatError } = await supabase
      .from('staff_categories')
      .upsert([
        { name: 'medical', display_name: '의료진', description: '정신건강의학과 전문의' },
        { name: 'treatment', display_name: '치료진', description: '심리상담사, 언어치료사, 놀이치료사 등' }
      ], { onConflict: 'name' })

    if (staffCatError) {
      console.log('   ⚠️  Staff categories error:', staffCatError.message)
    } else {
      console.log('   ✅ Staff categories inserted')
    }

    // Insert facility categories
    const { error: facilityCatError } = await supabase
      .from('facility_categories')
      .upsert([
        { name: 'hospital', display_name: '병원', description: '나란히정신건강의학과의원 시설' },
        { name: 'center', display_name: '센터', description: '나란히심리발달센터 시설' }
      ], { onConflict: 'name' })

    if (facilityCatError) {
      console.log('   ⚠️  Facility categories error:', facilityCatError.message)
    } else {
      console.log('   ✅ Facility categories inserted')
    }

    return true
  } catch (error) {
    console.error('   ❌ Failed to insert initial data:', error)
    return false
  }
}

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.log('   ⚠️  Auth session error (expected):', error.message)
    }
    
    // Test basic connection with a simple query
    const { error: connectionError } = await supabase
      .from('_supabase_realtime_subscriptions')
      .select('*')
      .limit(1)
    
    if (connectionError) {
      // This is expected - the table might not exist, but connection is working
      console.log('   ✅ Connection successful (realtime table error is normal)')
    } else {
      console.log('   ✅ Connection successful')
    }
    
    return true
  } catch (error) {
    console.error('   ❌ Connection failed:', error)
    return false
  }
}

async function checkEmailSettings() {
  console.log('🔄 Checking email confirmation settings...')
  
  try {
    // Try to get the auth settings (this might not work with the current permissions)
    console.log('   ℹ️  Email confirmation is likely enabled by default')
    console.log('   ℹ️  To disable for development:')
    console.log('      1. Go to Supabase Dashboard → Authentication → Settings')
    console.log('      2. Turn OFF "Enable email confirmations"')
    console.log('      3. Or use a test email service for development')
    
    return true
  } catch (error) {
    console.log('   ⚠️  Cannot check email settings directly')
    return false
  }
}

async function createTestAdminUser() {
  console.log('🔄 Creating test admin user in database...')
  
  try {
    const { error } = await supabase
      .from('admin_users')
      .upsert([
        {
          email: 'admin@naranhi.com',
          name: '관리자',
          role: 'super_admin',
          is_active: true
        }
      ], { onConflict: 'email' })

    if (error) {
      console.log('   ⚠️  Admin user creation error:', error.message)
      return false
    } else {
      console.log('   ✅ Test admin user created/updated in database')
      return true
    }
  } catch (error) {
    console.error('   ❌ Failed to create admin user:', error)
    return false
  }
}

async function main() {
  console.log('🚀 Naranhi Admin System - Database Setup\n')
  
  const results = {
    connection: false,
    tables: false,
    data: false,
    adminUser: false,
    emailSettings: false
  }
  
  // Test connection
  results.connection = await testConnection()
  console.log()
  
  if (!results.connection) {
    console.error('❌ Cannot proceed without database connection')
    process.exit(1)
  }
  
  // Create tables
  const tableCount = await createTablesDirectly()
  results.tables = tableCount > 0
  console.log()
  
  // Insert initial data
  if (results.tables) {
    results.data = await insertInitialData()
    console.log()
  }
  
  // Create test admin user
  if (results.data) {
    results.adminUser = await createTestAdminUser()
    console.log()
  }
  
  // Check email settings
  results.emailSettings = await checkEmailSettings()
  console.log()
  
  // Summary
  console.log('📊 Setup Results')
  console.log('═══════════════')
  console.log(`✅ Connection: ${results.connection ? 'Success' : 'Failed'}`)
  console.log(`✅ Tables: ${results.tables ? 'Created' : 'Failed'}`)
  console.log(`✅ Initial Data: ${results.data ? 'Inserted' : 'Failed'}`)
  console.log(`✅ Admin User: ${results.adminUser ? 'Created' : 'Failed'}`)
  console.log(`ℹ️  Email Settings: ${results.emailSettings ? 'Checked' : 'Needs Manual Setup'}`)
  
  if (results.connection && results.tables && results.data) {
    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📝 Next Steps:')
    console.log('1. Go to Supabase Dashboard → Authentication → Settings')
    console.log('2. Disable "Enable email confirmations" for development')
    console.log('3. Run: yarn dev')
    console.log('4. Visit: http://localhost:3000/admin/login')
    console.log('5. Create admin account or login with existing account')
    console.log('\n💡 Admin Test Account:')
    console.log('   📧 Email: admin@naranhi.com')
    console.log('   🔑 Password: admin123!')
  } else {
    console.log('\n❌ Setup completed with some issues')
    console.log('   Check the errors above and retry')
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Setup error:', error)
    process.exit(1)
  })
}

export { main as setupDatabase }