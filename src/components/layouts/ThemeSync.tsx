'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'

export function ThemeSync() {
  const searchParams = useSearchParams()
  const { setTheme } = useTheme()
  
  useEffect(() => {
    // URL 파라미터에서 테마 값 읽기
    const themeParam = searchParams.get('theme')
    
    if (themeParam && ['light', 'dark'].includes(themeParam)) {
      // 관리자에서 전달받은 테마로 설정
      setTheme(themeParam)
      
      // URL에서 theme 파라미터 제거 (깔끔한 URL 유지)
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('theme')
        window.history.replaceState({}, '', url.pathname + url.search)
      }
    }
  }, [searchParams, setTheme])

  return null // UI를 렌더링하지 않는 컴포넌트
}