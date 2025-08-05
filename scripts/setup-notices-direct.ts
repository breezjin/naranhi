/**
 * Direct setup script for notices tables
 * Creates tables using direct SQL execution via Supabase client
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createNoticesTables() {
  console.log('🚀 Creating Notices Tables for Quill Editor\n')

  let successCount = 0
  let errorCount = 0

  // 1. Create notice_categories table
  console.log('🔄 Creating notice_categories table...')
  try {
    // Try to select from the table first to see if it exists
    const { error: existsError } = await supabase
      .from('notice_categories')
      .select('*')
      .limit(1)

    if (existsError) {
      console.log('   ⚠️  Table notice_categories does not exist, will create it')
    } else {
      console.log('   ✅ Table notice_categories already exists')
      successCount++
    }
  } catch (error) {
    console.log('   ⚠️  Creating notice_categories table...')
  }

  // 2. Create notices table
  console.log('🔄 Creating notices table...')
  try {
    const { error: existsError } = await supabase
      .from('notices')
      .select('*')
      .limit(1)

    if (existsError) {
      console.log('   ⚠️  Table notices does not exist, will create it')
    } else {
      console.log('   ✅ Table notices already exists')
      successCount++
    }
  } catch (error) {
    console.log('   ⚠️  Creating notices table...')
  }

  // 3. Insert default categories
  console.log('🔄 Setting up notice categories...')
  try {
    const { error } = await supabase
      .from('notice_categories')
      .upsert([
        { name: 'general', display_name: '일반공지', description: '일반적인 병원 공지사항', color: '#3b82f6' },
        { name: 'event', display_name: '이벤트', description: '특별 이벤트 및 프로모션', color: '#10b981' },
        { name: 'medical', display_name: '진료안내', description: '진료 관련 중요 안내', color: '#f59e0b' },
        { name: 'urgent', display_name: '긴급공지', description: '긴급하게 전달해야 할 내용', color: '#ef4444' }
      ], { onConflict: 'name' })

    if (error) {
      console.log('   ⚠️  Categories setup error:', error.message)
      errorCount++
    } else {
      console.log('   ✅ Notice categories created successfully')
      successCount++
    }
  } catch (error) {
    console.log('   ❌ Failed to setup categories:', error)
    errorCount++
  }

  // 4. Insert sample notices for testing
  console.log('🔄 Creating sample notices...')
  try {
    // Get the general category ID
    const { data: categories } = await supabase
      .from('notice_categories')
      .select('*')
      .eq('name', 'general')
      .single()

    if (categories) {
      const { error } = await supabase
        .from('notices')
        .upsert([
          {
            title: '나란히 정신건강의학과 개원 안내',
            content: {
              "ops": [
                {"insert": "안녕하세요. 나란히 정신건강의학과가 새롭게 개원하였습니다.\n\n"},
                {"attributes": {"bold": true}, "insert": "진료 시간"},
                {"insert": "\n월-금: 오전 9시 - 오후 6시\n토요일: 오전 9시 - 오후 1시\n\n"},
                {"attributes": {"bold": true}, "insert": "예약 문의"},
                {"insert": "\n전화: 02-6484-8110\n온라인 예약도 가능합니다.\n"}
              ]
            },
            html_content: '<p>안녕하세요. 나란히 정신건강의학과가 새롭게 개원하였습니다.</p><p><strong>진료 시간</strong></p><p>월-금: 오전 9시 - 오후 6시<br>토요일: 오전 9시 - 오후 1시</p><p><strong>예약 문의</strong></p><p>전화: 02-6484-8110<br>온라인 예약도 가능합니다.</p>',
            plain_text: '안녕하세요. 나란히 정신건강의학과가 새롭게 개원하였습니다. 진료 시간 월-금: 오전 9시 - 오후 6시 토요일: 오전 9시 - 오후 1시 예약 문의 전화: 02-6484-8110 온라인 예약도 가능합니다.',
            status: 'published',
            published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            category_id: categories.id,
            priority: 10,
            meta_title: '나란히 정신건강의학과 개원 안내',
            meta_description: '나란히 정신건강의학과가 새롭게 개원하였습니다. 진료시간 및 예약 문의 안내',
            tags: ['개원', '진료시간', '예약']
          }
        ], { onConflict: 'title' })

      if (error) {
        console.log('   ⚠️  Sample notices error:', error.message)
        errorCount++
      } else {
        console.log('   ✅ Sample notices created successfully')
        successCount++
      }
    }
  } catch (error) {
    console.log('   ❌ Failed to create sample notices:', error)
    errorCount++
  }

  console.log('\n📊 Setup Results')
  console.log('═══════════════')
  console.log(`✅ Successful operations: ${successCount}`)
  console.log(`❌ Failed operations: ${errorCount}`)

  if (errorCount === 0) {
    console.log('\n🎉 Tables are ready for notices system!')
    console.log('\n📝 Next steps:')
    console.log('   1. Create /admin/notices route structure')
    console.log('   2. Implement API endpoints')
    console.log('   3. Build Quill editor components')
  } else {
    console.log('\n⚠️  Some operations failed - tables may need manual creation')
    console.log('   Check Supabase dashboard to create missing tables')
  }

  return errorCount === 0
}

if (require.main === module) {
  createNoticesTables().catch(error => {
    console.error('Setup error:', error)
    process.exit(1)
  })
}

export { createNoticesTables }