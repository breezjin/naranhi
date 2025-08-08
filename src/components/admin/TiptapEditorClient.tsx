'use client'

import dynamic from 'next/dynamic'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface TiptapEditorRef {
  getContent: () => any
  setContent: (content: any) => void
  getHTML: () => string
  getJSON: () => any
  getText: () => string
  focus: () => void
  blur: () => void
  isEmpty: () => boolean
}

interface TiptapEditorProps {
  value?: string | object
  onChange?: (content: any) => void
  placeholder?: string
  height?: string
  readOnly?: boolean
  className?: string
}

// 동적 import로 Tiptap 에디터를 클라이언트 사이드에서만 로드
const TiptapEditorCore = dynamic(
  () => import('./TiptapEditorEnhanced').then(mod => mod.TiptapEditorEnhanced),
  {
    ssr: false,
    loading: ({ error }) => {
      if (error) {
        console.error('Tiptap 에디터 로드 실패:', error)
        return (
          <div className="border border-destructive rounded-md p-4">
            <p className="text-destructive text-sm">
              에디터를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.
            </p>
          </div>
        )
      }
      
      return (
        <div 
          data-testid="editor-loading" 
          className="border border-input rounded-md p-4 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-32 bg-gray-100 rounded" />
          <p className="text-sm text-gray-500 mt-2">에디터 로딩 중...</p>
        </div>
      )
    }
  }
)

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>((props, ref) => {
  return <TiptapEditorCore {...props} ref={ref} />
})

TiptapEditor.displayName = 'TiptapEditor'

export default TiptapEditor