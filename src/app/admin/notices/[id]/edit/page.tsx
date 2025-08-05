'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Save,
  Eye,
  Send,
  Plus,
  X,
  Loader2
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { logError } from '@/utils/logger'
import QuillEditor, { QuillEditorRef } from '@/components/admin/QuillEditor'
import { QuillDelta, QuillEditor as QuillEditorType, QuillSource, QuillChangeHandler } from '@/types/quill'

type NoticeCategory = {
  id: string
  name: string
  display_name: string
  color: string
}

type Notice = {
  id: string
  title: string
  slug?: string | null // URL-friendly version of title
  content: Record<string, any> // Quill Delta format - improved typing
  html_content?: string
  plain_text?: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string | null
  scheduled_publish_at?: string | null
  category_id: string
  priority?: number
  display_order?: number
  view_count?: number
  last_viewed_at?: string | null
  meta_title: string | null
  meta_description: string | null
  featured_image_url?: string | null
  tags: string[]
  author_id?: string | null
  created_at?: string
  updated_at?: string
  search_vector?: string | null // Full-text search vector (read-only)
  category: {
    name: string
    display_name: string
    color: string
  }
}

export default function EditNoticePage() {
  const [notice, setNotice] = useState<Notice | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState<NoticeCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const quillRef = useRef<QuillEditorRef>(null)
  const noticeId = params.id as string

  // Extract fetch functions to prevent webpack-internal errors from nested async functions
  const fetchNotice = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/notices/${noticeId}`)
      if (!response.ok) {
        throw new Error(`공지사항을 찾을 수 없습니다 (HTTP ${response.status}: ${response.statusText})`)
      }
      const data = await response.json()
      return { success: true, data: data.data }
    } catch (error) {
      logError('Error fetching notice', error, { component: 'EditNoticePage', action: 'fetchNotice', noticeId })
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null 
      }
    }
  }, [noticeId])

  const fetchEditCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notice-categories')
      if (!response.ok) {
        throw new Error(`카테고리를 불러오는데 실패했습니다 (HTTP ${response.status}: ${response.statusText})`)
      }
      const data = await response.json()
      return { success: true, data: data.data || [] }
    } catch (error) {
      logError('Error fetching categories', error, { component: 'EditNoticePage', action: 'fetchEditCategories' })
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [
          { id: '1', name: 'general', display_name: '일반', color: '#3b82f6' },
          { id: '2', name: 'important', display_name: '중요', color: '#ef4444' }
        ]
      }
    }
  }, [])

  // Simplified fetchData that coordinates the individual fetch functions
  const fetchData = useCallback(async () => {
    try {
      setInitialLoading(true)
      setError(null)
      
      // Execute both requests in parallel
      const [noticeResult, categoriesResult] = await Promise.all([
        fetchNotice(),
        fetchEditCategories()
      ])

      // Handle notice result - this is critical for edit page
      if (noticeResult.success && noticeResult.data) {
        const fetchedNotice = noticeResult.data
        setNotice(fetchedNotice)
        setTitle(fetchedNotice.title)
        setContent(fetchedNotice.content)
        setSelectedCategoryId(fetchedNotice.category_id)
        setStatus(fetchedNotice.status)
        setMetaTitle(fetchedNotice.meta_title || '')
        setMetaDescription(fetchedNotice.meta_description || '')
        setTags(fetchedNotice.tags || [])
      } else {
        setError(noticeResult.error || '공지사항을 불러올 수 없습니다.')
        return // Critical error - can't proceed without notice data
      }

      // Handle categories result - use fallback on failure
      setCategories(categoriesResult.data)
      
      if (!categoriesResult.success) {
        console.warn('카테고리를 불러오지 못했지만 기본 카테고리를 사용합니다:', categoriesResult.error)
      }
      
    } catch (error: unknown) {
      logError('Critical error in fetchData', error, { component: 'EditNoticePage', action: 'fetchData', noticeId })
      setError(error instanceof Error ? error.message : '데이터를 불러오는 중 예상치 못한 오류가 발생했습니다.')
    } finally {
      setInitialLoading(false)
    }
  }, [fetchNotice, fetchEditCategories]) // Include fetch functions as dependencies

  useEffect(() => {
    if (noticeId) {
      fetchData()
    }
  }, [noticeId, fetchData])

  const handleContentChange = (content: any, delta: any, source: any, editor: any) => {
    setContent(JSON.stringify(content))
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (submitStatus: 'draft' | 'published' | 'archived') => {
    if (!title.trim()) {
      toast({
        title: '입력 오류',
        description: '제목을 입력해주세요.',
        variant: 'destructive'
      })
      return
    }

    if (!content || content.trim() === '' || content === '{"ops":[{"insert":"\\n"}]}') {
      toast({
        title: '입력 오류',
        description: '내용을 입력해주세요.',
        variant: 'destructive'
      })
      return
    }

    if (!selectedCategoryId) {
      toast({
        title: '입력 오류',
        description: '카테고리를 선택해주세요.',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      
      const updateData = {
        title,
        content,
        category_id: selectedCategoryId,
        status: submitStatus,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        tags
      }

      const response = await fetch(`/api/admin/notices/${noticeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update notice')
      }

      const result = await response.json()
      
      toast({
        title: '성공',
        description: `공지사항이 ${submitStatus === 'published' ? '발행' : '저장'}되었습니다.`
      })

      router.push('/admin/notices')
    } catch (error: unknown) {
      logError('Error updating notice', error, { component: 'EditNoticePage', action: 'handleSubmit', noticeId })
      toast({
        title: '오류',
        description: error instanceof Error ? error.message : '공지사항 수정 중 오류가 발생했습니다.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getSelectedCategory = () => {
    return categories.find(c => c.id === selectedCategoryId)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">발행됨</Badge>
      case 'draft':
        return <Badge variant="secondary">초안</Badge>
      case 'archived':
        return <Badge variant="outline">보관됨</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>공지사항을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!notice) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>공지사항을 찾을 수 없습니다.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin/notices')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">공지사항 수정</h1>
                  {getStatusBadge(status)}
                </div>
                <p className="text-gray-600">Quill 에디터로 리치 텍스트 공지사항을 수정합니다</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit('draft')}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                임시저장
              </Button>
              <Button
                onClick={() => handleSubmit('published')}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                발행하기
              </Button>
              {status === 'published' && (
                <Button
                  variant="outline"
                  onClick={() => handleSubmit('archived')}
                  disabled={loading}
                >
                  보관하기
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="공지사항 제목을 입력하세요"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">카테고리 *</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.display_name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getSelectedCategory() && (
                  <div className="mt-2">
                    <Badge 
                      variant="outline"
                      style={{ 
                        backgroundColor: `${getSelectedCategory()?.color}20`, 
                        borderColor: getSelectedCategory()?.color 
                      }}
                    >
                      {getSelectedCategory()?.display_name}
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="status">상태</Label>
                <Select value={status} onValueChange={(value: 'draft' | 'published' | 'archived') => setStatus(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">초안</SelectItem>
                    <SelectItem value="published">발행됨</SelectItem>
                    <SelectItem value="archived">보관됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>내용 *</CardTitle>
            </CardHeader>
            <CardContent>
              <QuillEditor
                ref={quillRef}
                value={content}
                onChange={handleContentChange}
                placeholder="공지사항 내용을 입력하세요..."
                height="400px"
                key={`quill-${noticeId}`}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>태그</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tags">태그 추가</Label>
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="태그를 입력하고 Enter를 누르세요"
                  className="mt-1"
                />
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">SEO 제목</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="검색엔진에 표시될 제목 (60자 이내)"
                  className="mt-1"
                  maxLength={60}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {metaTitle.length}/60자
                </p>
              </div>

              <div>
                <Label htmlFor="meta-description">SEO 설명</Label>
                <Textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="검색엔진에 표시될 설명 (160자 이내)"
                  className="mt-1"
                  maxLength={160}
                  rows={3}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {metaDescription.length}/160자
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}