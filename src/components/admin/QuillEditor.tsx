'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle, useMemo, useCallback, useState, memo } from 'react'
import dynamic from 'next/dynamic'

// Optimized dynamic import with better loading state
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        에디터 로딩 중...
      </div>
    </div>
  )
})

import 'react-quill/dist/quill.snow.css'

// Import Quill modules for enhanced functionality
let quillTable: any
let ImageResize: any
let ImageDropModule: any

if (typeof window !== 'undefined') {
  // Dynamically import Quill modules on client side
  import('quill-table').then((module) => {
    quillTable = module.default
  })
  import('quill-image-resize').then((module) => {
    ImageResize = module.default
  })
  import('quill-image-drop-module').then((module) => {
    ImageDropModule = module.default
  })
}

export interface QuillEditorRef {
  getContent: () => any
  setContent: (content: any) => void
  focus: () => void
  // SEO support methods
  getHTML: () => string
  getPlainText: () => string
  getWordCount: () => number
  getCharacterCount: () => number
}

interface QuillEditorProps {
  value?: Record<string, any> | string | null // Quill Delta format or HTML string
  onChange?: (content: Record<string, any>, delta: Record<string, any>, source: string, editor: any) => void
  placeholder?: string
  readOnly?: boolean
  theme?: 'snow' | 'bubble'
  className?: string
  height?: string
  onError?: (error: Error) => void
}

// Enhanced toolbar configuration for Korean content with table support
const koreanOptimizedToolbar = [
  [{ 'header': [1, 2, 3, 4, false] }],
  ['bold', 'italic', 'underline'],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'align': [] }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  ['table'],
  ['clean']
]

// Custom image handler for upload functionality
function imageHandler(this: any) {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = () => {
    const file = input.files?.[0]
    if (file) {
      // For now, we'll create a data URL - in production you'd upload to server
      const reader = new FileReader()
      reader.onload = (e) => {
        const range = this.quill.getSelection()
        if (range) {
          this.quill.insertEmbed(range.index, 'image', e.target?.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }
}

const QuillEditor = memo(forwardRef<QuillEditorRef, QuillEditorProps>(({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  readOnly = false,
  theme = 'snow',
  className = '',
  height = '300px',
  onError
}, ref) => {
  const quillRef = useRef<any>(null)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)

  // Error handler with user feedback
  const handleError = useCallback((error: Error) => {
    console.error('QuillEditor Error:', error)
    setHasError(true)
    setErrorMessage(error.message || '에디터에서 오류가 발생했습니다.')
    onError?.(error)
  }, [onError])

  // Enhanced onChange handler with error handling and debouncing
  const handleChange = useCallback((content: any, delta: any, source: any, editor: any) => {
    try {
      setHasError(false)
      setErrorMessage('')
      onChange?.(content, delta, source, editor)
    } catch (error) {
      handleError(error as Error)
    }
  }, [onChange, handleError])

  // Handle Quill ready state
  const handleQuillReady = useCallback(() => {
    setIsLoaded(true)
  }, [])

  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor()
        return editor.getContents()
      }
      return null
    },
    setContent: (content: any) => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor()
        editor.setContents(content)
      }
    },
    focus: () => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor()
        editor.focus()
      }
    },
    // SEO support methods
    getHTML: () => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor()
        const html = editor.root.innerHTML
        // Korean text optimization for SEO
        return html
          .replace(/[，]/g, ',')  // Full-width comma to regular comma
          .replace(/[。]/g, '.')  // Full-width period to regular period
          .replace(/[（]/g, '(')  // Full-width parentheses
          .replace(/[）]/g, ')')
          .replace(/[「]/g, '"')  // Korean quotation marks
          .replace(/[」]/g, '"')
          .replace(/>\s+([가-힣])/g, '>$1')  // Remove extra space after tags before Korean
          .replace(/([가-힣])\s+</g, '$1<')  // Remove extra space after Korean before tags
      }
      return ''
    },
    getPlainText: () => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor()
        const text = editor.getText()
        // Korean text optimization
        return text
          .replace(/[，]/g, ',')  // Full-width comma to regular comma
          .replace(/[。]/g, '.')  // Full-width period to regular period
          .replace(/[（]/g, '(')  // Full-width parentheses
          .replace(/[）]/g, ')')
          .replace(/[「]/g, '"')  // Korean quotation marks
          .replace(/[」]/g, '"')
          .replace(/\s+([가-힣])/g, ' $1')  // Single space before Korean
          .replace(/([가-힣])\s+/g, '$1 ')  // Single space after Korean
          .replace(/\s+/g, ' ')  // Multiple spaces to single space
          .trim()
      }
      return ''
    },
    getWordCount: () => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor()
        const text = editor.getText().trim()
        if (!text) return 0
        
        // Korean word counting: count Korean characters + space-separated words
        const koreanChars = (text.match(/[가-힣]/g) || []).length
        const nonKoreanWords = text
          .replace(/[가-힣]/g, '')  // Remove Korean characters
          .split(/\s+/)  // Split by whitespace
          .filter((word: string) => word.length > 0).length
        
        return koreanChars + nonKoreanWords
      }
      return 0
    },
    getCharacterCount: () => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor()
        const text = editor.getText().trim()
        return text.length
      }
      return 0
    }
  }))

  // Memoized modules configuration for performance with enhanced features
  const modules = useMemo(() => {
    const baseModules: any = {
      toolbar: readOnly ? false : {
        container: koreanOptimizedToolbar,
        handlers: {
          image: imageHandler,
          table: function(this: any) {
            if (quillTable) {
              const table = this.quill.getModule('table')
              table.insertTable(3, 3)
            }
          }
        }
      },
      clipboard: {
        // Optimized for Korean text pasting
        matchVisual: false,
        keepSelection: true
      },
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: true
      }
    }

    // Add table module if available
    if (typeof window !== 'undefined' && quillTable) {
      baseModules.table = quillTable
    }

    // Add image modules if available
    if (typeof window !== 'undefined') {
      if (ImageResize) {
        baseModules.imageResize = {
          displaySize: true,
          modules: ['Resize', 'DisplaySize']
        }
      }
      if (ImageDropModule) {
        baseModules.imageDropModule = true
      }
    }

    return baseModules
  }, [readOnly])

  // Enhanced formats array with table support
  const formats = useMemo(() => [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'code-block',
    'table', 'table-cell-line'
  ], [])

  // Error boundary UI
  if (hasError) {
    return (
      <div className={`quill-editor-error ${className}`} style={{ minHeight: height }}>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-center">
          <div className="mb-2 font-medium text-red-600">
            에디터 오류가 발생했습니다
          </div>
          <div className="mb-3 text-sm text-red-500">
            {errorMessage}
          </div>
          <button
            onClick={() => {
              setHasError(false)
              setErrorMessage('')
            }}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`quill-editor-wrapper ${className}`}>
      <style jsx global>{`
        .quill-editor-wrapper .ql-container {
          min-height: ${height};
          font-family: inherit;
        }
        
        .quill-editor-wrapper .ql-editor {
          min-height: ${height};
          font-size: 14px;
          line-height: 1.6;
        }
        
        .quill-editor-wrapper .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          background-color: #f8f9fa;
        }
        
        .quill-editor-wrapper .ql-container {
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
        }
        
        .quill-editor-wrapper .ql-editor.ql-blank::before {
          color: #6b7280;
          font-style: normal;
        }
        
        /* Focus styles */
        .quill-editor-wrapper .ql-toolbar:focus-within {
          border-color: #3b82f6;
        }
        .quill-editor-wrapper .ql-container.ql-focused {
          border-color: #3b82f6;
        }
        
        /* Enhanced Korean typography */
        .quill-editor-wrapper .ql-editor {
          font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Pretendard Variable', Pretendard, Roboto, 'Noto Sans KR', 'Segoe UI', 'Malgun Gothic', sans-serif;
          line-height: 1.8;
          letter-spacing: -0.01em;
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        
        .quill-editor-wrapper .ql-editor p {
          margin-bottom: 1em;
          line-height: 1.8;
        }
        
        .quill-editor-wrapper .ql-editor h1 {
          font-size: 1.75em;
          font-weight: 700;
          margin: 1.2em 0 0.8em 0;
          line-height: 1.4;
          color: #1f2937;
        }
        
        .quill-editor-wrapper .ql-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 1em 0 0.7em 0;
          line-height: 1.4;
          color: #374151;
        }
        
        .quill-editor-wrapper .ql-editor h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 0.8em 0 0.6em 0;
          line-height: 1.4;
          color: #4b5563;
        }
        
        .quill-editor-wrapper .ql-editor h4 {
          font-size: 1.1em;
          font-weight: 600;
          margin: 0.7em 0 0.5em 0;
          line-height: 1.4;
          color: #6b7280;
        }
        
        /* Enhanced Lists for Korean content */
        .quill-editor-wrapper .ql-editor ul,
        .quill-editor-wrapper .ql-editor ol {
          margin: 0.75em 0;
          padding-left: 1.8em;
        }
        
        .quill-editor-wrapper .ql-editor li {
          margin-bottom: 0.4em;
          line-height: 1.7;
        }
        
        .quill-editor-wrapper .ql-editor ul li {
          list-style-type: disc;
        }
        
        .quill-editor-wrapper .ql-editor ol li {
          list-style-type: decimal;
        }
        
        /* Blockquotes */
        .quill-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
        }
        
        /* Enhanced Code blocks */
        .quill-editor-wrapper .ql-editor pre.ql-syntax {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1.5em 0;
          font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875em;
          line-height: 1.6;
          overflow-x: auto;
        }
        
        /* Table styles */
        .quill-editor-wrapper .ql-editor table {
          border-collapse: collapse;
          border: 1px solid #e5e7eb;
          margin: 1em 0;
          table-layout: fixed;
          width: 100%;
        }
        
        .quill-editor-wrapper .ql-editor table td,
        .quill-editor-wrapper .ql-editor table th {
          border: 1px solid #e5e7eb;
          padding: 0.5em 0.75em;
          vertical-align: top;
        }
        
        .quill-editor-wrapper .ql-editor table th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        .quill-editor-wrapper .ql-editor table tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        /* Image resize handles */
        .quill-editor-wrapper .ql-editor img {
          max-width: 100%;
          height: auto;
        }
        
        .image-resize-handle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border: 1px solid #fff;
          border-radius: 50%;
        }
        
        /* Performance optimizations */
        .quill-editor-wrapper .ql-editor {
          contain: layout style;
        }
        
        .quill-editor-wrapper .ql-toolbar {
          will-change: transform;
        }
      `}</style>
      
      <ReactQuill
        theme={theme}
        value={typeof value === 'string' ? value : ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  )
}))

QuillEditor.displayName = 'QuillEditor'

export default QuillEditor