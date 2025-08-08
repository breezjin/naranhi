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
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import HardBreak from '@tiptap/extension-hard-break'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { common, createLowlight } from 'lowlight'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  Code,
  FileCode,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  CornerDownLeft,
  ImageIcon,
  Table as TableIcon,
  Plus,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ImageUploadDialog, ImageUploadResult } from './ImageUploadDialog'

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

// lowlight 인스턴스 생성 (한 번만 생성되도록)
const lowlight = createLowlight(common)

export const TiptapEditorEnhanced = forwardRef<TiptapEditorRef, TiptapEditorProps>(({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  height = '300px',
  readOnly = false,
  className
}, ref) => {
  const [isMounted, setIsMounted] = useState(false)
  const [imageUploadOpen, setImageUploadOpen] = useState(false)
  
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
          HTMLAttributes: {
            class: 'tiptap-bullet-list'
          }
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'tiptap-ordered-list'
          }
        },
        listItem: {
          HTMLAttributes: {
            class: 'tiptap-list-item'
          }
        },
        blockquote: {
          HTMLAttributes: {
            class: 'tiptap-blockquote'
          }
        },
        codeBlock: false, // StarterKit의 기본 코드블록 비활성화 (lowlight 버전 사용)
        code: {
          HTMLAttributes: {
            class: 'tiptap-inline-code'
          }
        }
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
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
        HTMLAttributes: {
          class: 'tiptap-code-block'
        }
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'tiptap-horizontal-rule'
        }
      }),
      HardBreak,
      TaskList.configure({
        HTMLAttributes: {
          class: 'tiptap-task-list'
        }
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'tiptap-task-item'
        },
        nested: true,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'tiptap-image'
        },
        inline: true,
        allowBase64: false,
      }),
      Table.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 50,
        View: null,
        lastColumnResizable: true,
        allowTableNodeSelection: true
      }),
      TableRow,
      TableHeader,
      TableCell,
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
          // 코드블록 스타일링
          '[&_.tiptap-code-block]:bg-slate-100 [&_.tiptap-code-block]:p-4 [&_.tiptap-code-block]:rounded-md [&_.tiptap-code-block]:font-mono [&_.tiptap-code-block]:text-sm [&_.tiptap-code-block]:overflow-x-auto',
          // 인라인 코드 스타일링  
          '[&_.tiptap-inline-code]:bg-slate-100 [&_.tiptap-inline-code]:px-1 [&_.tiptap-inline-code]:py-0.5 [&_.tiptap-inline-code]:rounded [&_.tiptap-inline-code]:font-mono [&_.tiptap-inline-code]:text-sm',
          // 리스트 스타일링
          '[&_.tiptap-bullet-list]:list-disc [&_.tiptap-bullet-list]:pl-6 [&_.tiptap-bullet-list]:my-2',
          '[&_.tiptap-ordered-list]:list-decimal [&_.tiptap-ordered-list]:pl-6 [&_.tiptap-ordered-list]:my-2',
          '[&_.tiptap-list-item]:mb-1',
          // 인용문 스타일링
          '[&_.tiptap-blockquote]:border-l-4 [&_.tiptap-blockquote]:border-gray-300 [&_.tiptap-blockquote]:pl-4 [&_.tiptap-blockquote]:italic [&_.tiptap-blockquote]:my-4',
          // 수평선 스타일링
          '[&_.tiptap-horizontal-rule]:border-t [&_.tiptap-horizontal-rule]:border-gray-300 [&_.tiptap-horizontal-rule]:my-6',
          // 작업 목록 스타일링
          '[&_.tiptap-task-list]:list-none [&_.tiptap-task-list]:pl-0 [&_.tiptap-task-list]:my-2',
          '[&_.tiptap-task-item]:flex [&_.tiptap-task-item]:items-start [&_.tiptap-task-item]:gap-2 [&_.tiptap-task-item]:mb-1',
          // 이미지 스타일링
          '[&_.tiptap-image]:max-w-full [&_.tiptap-image]:h-auto [&_.tiptap-image]:rounded-md [&_.tiptap-image]:my-2',
          // 테이블 스타일링
          '[&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 [&_table]:rounded-md [&_table]:my-4 [&_table]:min-w-full',
          '[&_tr]:border-b [&_tr]:border-gray-200',
          '[&_th]:border [&_th]:border-gray-300 [&_th]:px-4 [&_th]:py-3 [&_th]:bg-gray-50 [&_th]:font-semibold [&_th]:text-left',
          '[&_td]:border [&_td]:border-gray-300 [&_td]:px-4 [&_td]:py-2',
          // 테이블 선택 및 컨트롤 스타일링
          '[&_.selectedCell]:bg-blue-100',
          '[&_.column-resize-handle]:bg-blue-500 [&_.column-resize-handle]:w-1',
          '[&_table]:relative [&_table]:overflow-hidden',
          className
        ),
      },
      handleKeyDown(view, event) {
        // Shift+Enter로 하드 브레이크 (줄바꿈) 입력
        if (event.key === 'Enter' && event.shiftKey) {
          return view.state.tr.insertText('\n') && true
        }
        return false
      }
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

  // 이미지 업로드 핸들러
  const handleImageUpload = (result: ImageUploadResult) => {
    if (editor) {
      editor.chain().focus().setImage({
        src: result.url,
        alt: result.alt,
        title: result.title
      }).run()
    }
  }

  // SSR/CSR 안정성을 위한 마운트 체크
  if (!isMounted) {
    return (
      <div 
        className={cn('border border-input rounded-md p-4 animate-pulse', className)}
        style={{ height }}
      >
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    )
  }

  if (!editor) {
    return (
      <div 
        data-testid="editor-initializing"
        className={cn('border border-input rounded-md p-4', className)}
        style={{ height }}
      >
        <div className="text-center text-muted-foreground">
          에디터를 초기화하는 중...
        </div>
      </div>
    )
  }

  const ToolbarButton = ({ onClick, isActive, children, title, disabled }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
    disabled?: boolean
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  )

  return (
    <div className="space-y-2">
      {/* Enhanced Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap gap-1 p-2 border border-input rounded-md bg-muted/30">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-border pr-2 mr-2">
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
          </div>

          {/* Code */}
          <div className="flex gap-1 border-r border-border pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title="인라인 코드 (`코드`)"
            >
              <Code className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive('codeBlock')}
              title="코드 블록"
            >
              <FileCode className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r border-border pr-2 mr-2">
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

          {/* Enhanced Lists */}
          <div className="flex gap-1 border-r border-border pr-2 mr-2">
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
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              isActive={editor.isActive('taskList')}
              title="체크리스트"
            >
              <CheckSquare className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="인용문"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Alignment and Other */}
          <div className="flex gap-1 border-r border-border pr-2 mr-2">
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

          {/* Table Tools */}
          <div className="flex gap-1 border-r border-border pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              title="표 삽입 (3x3)"
              disabled={editor.isActive('table')}
            >
              <TableIcon className="h-4 w-4" />
            </ToolbarButton>
            {editor.isActive('table') && (
              <>
                <ToolbarButton
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  title="위에 행 추가"
                >
                  <Plus className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  title="아래에 행 추가"
                >
                  <Plus className="h-4 w-4 rotate-180" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  title="왼쪽에 열 추가"
                >
                  <Plus className="h-4 w-4 rotate-90" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  title="오른쪽에 열 추가"
                >
                  <Plus className="h-4 w-4 -rotate-90" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  title="행 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  title="열 삭제"
                >
                  <Trash2 className="h-4 w-4 rotate-90" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  title="표 삭제"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                  title="헤더 행 토글"
                  isActive={editor.isActive('table') && editor.getAttributes('table').withHeaderRow}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </ToolbarButton>
              </>
            )}
          </div>

          {/* Special Elements */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => setImageUploadOpen(true)}
              title="이미지 업로드"
            >
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="수평선"
            >
              <Minus className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHardBreak().run()}
              title="줄바꿈 (Shift+Enter)"
            >
              <CornerDownLeft className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>
      )}

      {/* Editor */}
      <div 
        className="relative border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        style={{ height }}
      >
        <EditorContent 
          editor={editor} 
          className="h-full overflow-y-auto"
          data-testid="tiptap-editor"
        />
      </div>

      {/* Enhanced Status Bar */}
      {!readOnly && (
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div>
            {editor.getText().length}자
            {editor.isActive('codeBlock') && ' | 코드 블록'}
            {editor.isActive('bulletList') && ' | 목록'}
            {editor.isActive('orderedList') && ' | 번호 목록'}
            {editor.isActive('taskList') && ' | 체크리스트'}
            {editor.isActive('table') && ' | 표 편집 중'}
          </div>
          <div className="text-xs opacity-60">
            Shift+Enter: 줄바꿈 | Tab: 들여쓰기
          </div>
        </div>
      )}

      {/* Image Upload Dialog */}
      <ImageUploadDialog
        open={imageUploadOpen}
        onOpenChange={setImageUploadOpen}
        onImageUploaded={handleImageUpload}
      />
    </div>
  )
})

TiptapEditorEnhanced.displayName = 'TiptapEditorEnhanced'