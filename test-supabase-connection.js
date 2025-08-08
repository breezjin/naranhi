// Supabase 연결 테스트 스크립트
// Node.js에서 실행: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔗 Supabase 연결 테스트 시작...')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? '✅ 설정됨' : '❌ 누락')
console.log('Service Key:', supabaseServiceKey ? '✅ 설정됨' : '❌ 누락')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.')
  process.exit(1)
}

// Service Role Key로 테스트 (더 높은 권한)
console.log('\n🔑 Service Role Key로 테스트 중...')
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Anon Key로도 테스트
console.log('🔑 Anon Key로 테스트 중...')
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  // Service Role Key로 먼저 테스트
  try {
    console.log('\n📊 Service Role로 버킷 목록 조회 중...')
    const { data: adminBuckets, error: adminBucketError } = await supabaseAdmin.storage.listBuckets()
    
    if (adminBucketError) {
      console.error('❌ Service Role 버킷 조회 실패:', adminBucketError)
    } else {
      console.log('✅ Service Role 버킷 목록:', adminBuckets.map(b => `${b.id} (public: ${b.public})`))
    }
    
    console.log('\n📊 Anon Key로 버킷 목록 조회 중...')
    const { data: buckets, error: bucketError } = await supabaseAnon.storage.listBuckets()
    
    if (bucketError) {
      console.error('❌ 버킷 조회 실패:', bucketError)
      return
    }
    
    console.log('✅ Anon Key 버킷 목록:', buckets.map(b => `${b.id} (public: ${b.public})`))
    
    // 실제로 사용할 버킷으로 테스트 (adminBuckets 사용)
    const testBuckets = adminBuckets || buckets
    const editorBucket = testBuckets.find(b => b.id === 'editor-images')
    
    if (editorBucket) {
      console.log('✅ editor-images 버킷 찾음:', editorBucket)
      
      // Service Role로 파일 목록 조회
      console.log('\n📁 Service Role로 editor-images 버킷 내 파일 목록...')
      const { data: adminFiles, error: adminListError } = await supabaseAdmin.storage
        .from('editor-images')
        .list()
      
      if (adminListError) {
        console.error('❌ Service Role 파일 목록 조회 실패:', adminListError)
      } else {
        console.log('✅ Service Role 파일 개수:', adminFiles.length)
      }
      
      // Anon Key로 파일 목록 조회
      console.log('\n📁 Anon Key로 editor-images 버킷 내 파일 목록...')
      const { data: files, error: listError } = await supabaseAnon.storage
        .from('editor-images')
        .list()
      
      if (listError) {
        console.error('❌ Anon Key 파일 목록 조회 실패:', listError)
      } else {
        console.log('✅ Anon Key 파일 개수:', files.length)
        if (files.length > 0) {
          console.log('파일 목록:', files.slice(0, 3).map(f => f.name))
        }
      }
    } else {
      console.error('❌ editor-images 버킷을 찾을 수 없습니다.')
      console.log('사용 가능한 버킷:', testBuckets.map(b => b.id))
    }
    
  } catch (error) {
    console.error('❌ 연결 테스트 실패:', error)
  }
}

testConnection().then(() => {
  console.log('\n🔚 테스트 완료')
})