/**
 * Simple database setup script for Naranhi Admin System
 * This script creates basic tables and tests the connection
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test basic connection by trying to access auth users
    const { data, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Connection test failed:', error.message)
      return false
    }
    
    console.log('✅ Connection successful')
    console.log(`📊 Found ${data.users.length} auth users`)
    return true
  } catch (error: any) {
    console.error('❌ Connection test failed:', error.message)
    return false
  }
}

async function createBasicTables() {
  console.log('📊 Creating basic tables...')
  
  const tables = [
    'staff_categories',
    'staff_members', 
    'facility_categories',
    'facility_photos',
    'notices',
    'admin_users',
    'admin_activity_log'
  ]
  
  const tableStatus = []
  
  for (const table of tables) {
    try {
      console.log(`  🔍 Checking table: ${table}`)
      const { data, error } = await supabase.from(table).select('id').limit(1)
      
      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          tableStatus.push(`❌ ${table}: Table does not exist`)
        } else {
          tableStatus.push(`⚠️  ${table}: ${error.message}`)
        }
      } else {
        tableStatus.push(`✅ ${table}: Table exists`)
      }
    } catch (err: any) {
      tableStatus.push(`❌ ${table}: ${err.message}`)
    }
  }
  
  console.log('\n📋 Table Status:')
  tableStatus.forEach(status => console.log(`  ${status}`))
  
  return tableStatus
}

async function setupInstructions() {
  console.log('\n📝 Setup Instructions:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  console.log('\n1. 🌐 Supabase SQL Editor로 이동:')
  console.log(`   ${supabaseUrl.replace('/rest/v1', '')}/project/default/sql`)
  
  console.log('\n2. 📄 다음 SQL을 실행하세요:')
  console.log('   supabase/migrations/20250108000001_create_initial_schema.sql 파일 내용을 복사해서 실행')
  
  console.log('\n3. 🌱 시드 데이터 추가:')
  console.log('   supabase/seed.sql 파일 내용을 복사해서 실행')
  
  console.log('\n4. ✅ 설정 완료 후:')
  console.log('   - yarn dev 로 개발 서버 시작')
  console.log('   - http://localhost:3000/admin/test 에서 연결 테스트')
  console.log('   - http://localhost:3000/admin/login 에서 관리자 계정 생성')
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

async function main() {
  console.log('🚀 Naranhi Admin System - Simple Setup\n')
  
  // Test connection
  const connected = await testConnection()
  if (!connected) {
    console.log('\n❌ Setup failed due to connection issues')
    process.exit(1)
  }
  
  // Check existing tables
  await createBasicTables()
  
  // Show setup instructions
  await setupInstructions()
  
  console.log('\n🎉 Setup check completed!')
  console.log('   Follow the instructions above to complete the database setup.')
}

// Run the setup
main().catch(error => {
  console.error('\n❌ Setup failed:', error)
  process.exit(1)
})