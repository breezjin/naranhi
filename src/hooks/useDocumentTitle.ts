'use client'

import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prevTitle = document.title
      document.title = title
      return () => {
        document.title = prevTitle
      }
    }
  }, [title])
}