#!/usr/bin/env node
/**
 * 직접 SQL로 테이블 생성
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('🔨 Creating tables directly...\n')

  try {
    // 1. Create notice_categories table
    console.log('1️⃣ Creating notice_categories table...')
    
    const { data: categoriesResult, error: categoriesError } = await supabase
      .from('notice_categories')
      .insert([
        { name: 'general', display_name: '일반공지', description: '일반적인 병원 공지사항', color: '#3b82f6' }
      ])
      .select()

    if (categoriesError) {
      if (categoriesError.code === '42P01') {
        console.log('   ❌ Table notice_categories does not exist')
        console.log('   📋 Please create the table manually in Supabase dashboard:')
        console.log(`
CREATE TABLE notice_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
        `)
      } else {
        console.log('   ⚠️ Error:', categoriesError.message)
      }
    } else {
      console.log('   ✅ Table notice_categories working')
    }

    // 2. Test notices table
    console.log('\n2️⃣ Testing notices table...')
    
    const { data: noticesResult, error: noticesError } = await supabase
      .from('notices')
      .select('id, title, status')
      .limit(1)

    if (noticesError) {
      if (noticesError.code === '42P01') {
        console.log('   ❌ Table notices does not exist')
        console.log('   📋 Please create the table manually in Supabase dashboard - check setup-notices-schema.sql')
      } else {
        console.log('   ⚠️ Error:', noticesError.message)
      }
    } else {
      console.log('   ✅ Table notices working')
    }

    // 3. If tables exist, insert default data
    if (!categoriesError && !noticesError) {
      console.log('\n3️⃣ Setting up default data...')
      
      const defaultCategories = [
        { name: 'event', display_name: '이벤트', description: '특별 이벤트 및 프로모션', color: '#10b981' },
        { name: 'medical', display_name: '진료안내', description: '진료 관련 중요 안내', color: '#f59e0b' },
        { name: 'urgent', display_name: '긴급공지', description: '긴급하게 전달해야 할 내용', color: '#ef4444' }
      ]

      for (const category of defaultCategories) {
        const { error } = await supabase
          .from('notice_categories')
          .upsert(category, { onConflict: 'name' })

        if (!error) {
          console.log(`   ✅ Category '${category.name}' ready`)
        }
      }
    }

    console.log('\n📋 Manual Setup Required:')
    console.log('1. Go to Supabase Dashboard')
    console.log('2. Run the SQL from scripts/setup-notices-schema.sql')
    console.log('3. Enable RLS policies if needed')
    console.log('4. Test the API endpoints')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

createTables()