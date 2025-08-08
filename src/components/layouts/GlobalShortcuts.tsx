'use client'

import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts'

/**
 * 전역 단축키 컴포넌트
 * 페이지 전체에서 사용할 수 있는 키보드 단축키를 제공합니다.
 * 
 * 현재 지원하는 단축키:
 * - q: Admin 페이지로 이동
 * - h: 홈페이지로 이동  
 * - n: 공지사항으로 이동
 * - f: 시설안내로 이동
 * - c: 문의하기로 이동
 */
export function GlobalShortcuts() {
  // 전역 단축키 훅 초기화
  useGlobalShortcuts()
  
  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null
}

export default GlobalShortcuts