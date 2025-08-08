'use client'

import { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'
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

// 한글 텍스트 정규화 함수
const normalizeKoreanText = (text: string): string => {
  return text
    .replace(/[，]/g, ',')  // 전각 쉼표 → 반각 쉼표
    .replace(/[。]/g, '.')  // 전각 마침표 → 반각 마침표
    .replace(/[：]/g, ':')  // 전각 콜론 → 반각 콜론
    .replace(/[；]/g, ';')  // 전각 세미콜론 → 반각 세미콜론
    .replace(/[！]/g, '!')  // 전각 느낌표 → 반각 느낌표
    .replace(/[？]/g, '?')  // 전각 물음표 → 반각 물음표
    .normalize('NFC')       // Unicode 정규화 (조합형)
}

export const TiptapEditorCore = forwardRef<TiptapEditorRef, TiptapEditorProps>(({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  height = '300px',
  readOnly = false,
  className
}, ref) => {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 초기 컨텐츠 파싱
  const getInitialContent = () => {
    if (!value) return ''
    
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return parsed
      } catch {
        return value
      }
    }
    
    return value
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
    ],
    content: getInitialContent(),
    editable: !readOnly,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    onUpdate: ({ editor }) => {
      if (onChange && isMounted) {
        try {
          const json = editor.getJSON()
          onChange(json)
        } catch (error) {
          console.error('Tiptap onChange error:', error)
        }
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
          'min-h-[200px] p-4 border-0',
          '[font-family:system-ui,sans-serif]',
          className
        ),
      },
    },
  })

  // 컨텐츠가 변경되면 에디터 업데이트
  useEffect(() => {
    if (editor && value && isMounted) {
      const currentContent = editor.getJSON()
      const newContent = getInitialContent()
      
      // 내용이 실제로 다를 때만 업데이트
      if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
        editor.commands.setContent(newContent)
      }
    }
  }, [editor, value, isMounted])

  useImperativeHandle(ref, () => ({
    getContent: () => editor?.getJSON() || null,
    setContent: (content: any) => {
      if (editor && content && isMounted) {
        editor.commands.setContent(content)
      }
    },
    getHTML: () => editor?.getHTML() || '',
    getJSON: () => editor?.getJSON() || null,
    getText: () => editor?.getText() || '',
    focus: () => {
      if (editor && isMounted) {
        editor.commands.focus()
      }
    },
    blur: () => {
      if (editor && isMounted) {
        editor.commands.blur()
      }
    },
    isEmpty: () => editor?.isEmpty ?? true,
  }), [editor, isMounted])

  // SSR/CSR 안정성을 위한 마운트 체크
  if (!isMounted) {
    return (
      <div 
        className={cn('border border-input rounded-md p-4 animate-pulse', className)}
        style={{ height }}
      >
        <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
    )
  }

  if (!editor) {
    return (
      <div 
        className={cn('border border-input rounded-md p-4', className)}
        style={{ height }}
      >
        <div className="text-center text-muted-foreground">
          에디터를 초기화하는 중...
        </div>
      </div>
    )
  }

  const ToolbarButton = ({ onClick, isActive, children, title }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  )

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap gap-1 rounded-md border border-input bg-muted/30 p-2">
          {/* Text Formatting */}
          <div className="mr-2 flex gap-1 border-r border-border pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="굵게 (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="기울임 (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="밑줄 (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="취소선"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title="인라인 코드"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="mr-2 flex gap-1 border-r border-border pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="제목 1"
            >
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="제목 2"
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="제목 3"
            >
              <Heading3 className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="mr-2 flex gap-1 border-r border-border pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="글머리 기호 목록"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="번호 목록"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="인용문"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Alignment */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title="왼쪽 정렬"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="가운데 정렬"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="오른쪽 정렬"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>
      )}

      {/* Editor */}
      <div 
        className="relative rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        style={{ height }}
      >
        <EditorContent 
          editor={editor} 
          className="h-full overflow-y-auto"
        />
      </div>

      {/* Character count for Korean text */}
      {!readOnly && (
        <div className="text-right text-xs text-muted-foreground">
          {editor.getText().length}자
        </div>
      )}
    </div>
  )
})

TiptapEditorCore.displayName = 'TiptapEditorCore'