import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 환경변수가 없는 경우 개발용 더미 클라이언트 반환
  if (!url || !key) {
    console.warn('Supabase 환경변수가 설정되지 않았습니다. 더미 클라이언트를 사용합니다.')
    return createBrowserClient(
      'https://dummy.supabase.co', 
      'dummy-anon-key'
    )
  }

  return createBrowserClient(url, key)
}