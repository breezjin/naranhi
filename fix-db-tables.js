#!/usr/bin/env node
/**
 * 공지사항 데이터베이스 테이블 수정 스크립트
 * Fix notices database tables
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixTables() {
  console.log('🔧 Fixing notices database tables...\n')

  try {
    // 1. Check current table structure
    console.log('1️⃣ Checking current table structure...')
    
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['notices', 'notice_categories'])

    if (tablesError) {
      console.error('Error checking tables:', tablesError)
    } else {
      console.log('   Existing tables:', tablesData?.map(t => t.table_name))
    }

    // 2. Create notice_categories table if not exists
    console.log('\n2️⃣ Creating notice_categories table...')
    
    const createCategoriesSQL = `
      CREATE TABLE IF NOT EXISTS notice_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL UNIQUE,
        display_name VARCHAR(100) NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#3b82f6',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    
    const { error: createCategoriesError } = await supabase.rpc('exec_sql', {
      sql: createCategoriesSQL
    })

    if (createCategoriesError) {
      console.log('   ⚠️ Categories table creation result:', createCategoriesError.message)
    } else {
      console.log('   ✅ Categories table ready')
    }

    // 3. Insert default categories
    console.log('\n3️⃣ Setting up default categories...')
    
    const defaultCategories = [
      { name: 'general', display_name: '일반공지', description: '일반적인 병원 공지사항', color: '#3b82f6' },
      { name: 'event', display_name: '이벤트', description: '특별 이벤트 및 프로모션', color: '#10b981' },
      { name: 'medical', display_name: '진료안내', description: '진료 관련 중요 안내', color: '#f59e0b' },
      { name: 'urgent', display_name: '긴급공지', description: '긴급하게 전달해야 할 내용', color: '#ef4444' }
    ]

    for (const category of defaultCategories) {
      const { error: insertError } = await supabase
        .from('notice_categories')
        .upsert(category, { onConflict: 'name' })

      if (insertError) {
        console.log(`   ⚠️ Category '${category.name}': ${insertError.message}`)
      } else {
        console.log(`   ✅ Category '${category.name}' ready`)
      }
    }

    // 4. Test API endpoints
    console.log('\n4️⃣ Testing API endpoints...')
    
    // Test categories
    const { data: categoriesData, error: categoriesTestError } = await supabase
      .from('notice_categories')
      .select('*')
      .limit(5)

    if (categoriesTestError) {
      console.log('   ❌ Categories test failed:', categoriesTestError.message)
    } else {
      console.log(`   ✅ Categories test passed (${categoriesData?.length} categories)`)
    }

    // Test notices
    const { data: noticesData, error: noticesTestError } = await supabase
      .from('notices')
      .select(`
        *,
        category:notice_categories(name, display_name, color)
      `)
      .limit(5)

    if (noticesTestError) {
      console.log('   ❌ Notices test failed:', noticesTestError.message)
    } else {
      console.log(`   ✅ Notices test passed (${noticesData?.length} notices)`)
    }

    console.log('\n🎉 Database fix completed!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

fixTables()