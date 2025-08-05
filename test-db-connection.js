#!/usr/bin/env node
/**
 * 데이터베이스 연결 및 테이블 테스트
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  console.log('🔍 데이터베이스 연결 테스트...\n')

  try {
    // 1. Test notice_categories
    console.log('1️⃣ Notice Categories 테스트...')
    const { data: categories, error: categoriesError } = await supabase
      .from('notice_categories')
      .select('*')
      .limit(5)

    if (categoriesError) {
      console.log('   ❌ Categories 에러:', categoriesError.message)
    } else {
      console.log(`   ✅ Categories 성공 (${categories?.length}개)`)
      categories?.forEach(cat => {
        console.log(`      - ${cat.display_name} (${cat.name})`)
      })
    }

    // 2. Test notices
    console.log('\n2️⃣ Notices 테스트...')
    const { data: notices, error: noticesError } = await supabase
      .from('notices')
      .select(`
        id,
        title,
        status,
        category:notice_categories(name, display_name, color)
      `)
      .limit(5)

    if (noticesError) {
      console.log('   ❌ Notices 에러:', noticesError.message)
    } else {
      console.log(`   ✅ Notices 성공 (${notices?.length}개)`)
      notices?.forEach(notice => {
        console.log(`      - ${notice.title} [${notice.status}]`)
      })
    }

    // 3. Test API endpoints directly
    console.log('\n3️⃣ API 엔드포인트 테스트...')
    
    try {
      const response = await fetch('http://localhost:3002/api/admin/notices')
      const data = await response.json()
      
      if (response.ok) {
        console.log(`   ✅ API 성공 (${data.data?.length || 0}개 공지사항)`)
      } else {
        console.log(`   ❌ API 에러 (${response.status}):`, data.error)
      }
    } catch (fetchError) {
      console.log('   ⚠️ API 테스트 스킵 (서버 미실행)')
    }

    console.log('\n📋 결과 요약:')
    console.log(`Categories: ${categoriesError ? '❌' : '✅'}`)
    console.log(`Notices: ${noticesError ? '❌' : '✅'}`)
    
    if (!categoriesError && !noticesError) {
      console.log('\n🎉 데이터베이스 준비 완료!')
    } else {
      console.log('\n⚠️ fixed-db-setup.sql을 Supabase에서 실행해주세요.')
    }

  } catch (error) {
    console.error('❌ 연결 에러:', error.message)
  }
}

testConnection()