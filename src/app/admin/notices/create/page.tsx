'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
import TiptapEditor, { TiptapEditorRef } from '@/components/admin/TiptapEditorClient'

type NoticeCategory = {
  id: string
  name: string
  display_name: string
  color: string
}

export default function CreateNoticePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState<NoticeCategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()
  const editorRef = useRef<TiptapEditorRef>(null)

  // Move fetchCategories before useEffect to prevent hoisting issues
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/notice-categories')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      const categories = data.data || []
      
      if (categories.length === 0) {
        // Provide fallback categories if none exist
        const fallbackCategories = [
          { id: '1', name: 'general', display_name: '일반', color: '#3b82f6' },
          { id: '2', name: 'important', display_name: '중요', color: '#ef4444' }
        ]
        setCategories(fallbackCategories)
        setSelectedCategoryId(fallbackCategories[0].id)
        console.warn('No categories found, using fallback categories')
      } else {
        setCategories(categories)
        setSelectedCategoryId(categories[0].id)
      }
    } catch (error: unknown) {
      logError('Error fetching categories', error, { component: 'CreateNoticePage', action: 'fetchCategories' })
      
      // Set fallback categories on error
      const fallbackCategories = [
        { id: '1', name: 'general', display_name: '일반', color: '#3b82f6' },
        { id: '2', name: 'important', display_name: '중요', color: '#ef4444' }
      ]
      setCategories(fallbackCategories)
      setSelectedCategoryId(fallbackCategories[0].id)
      
      setError(`카테고리를 불러오는 중 오류가 발생했지만 기본 카테고리를 사용합니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setCategoriesLoading(false)
    }
  }, []) // Empty dependency array since fetchCategories doesn't depend on any props/state

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleContentChange = (content: any) => {
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

  const handleSubmit = async (submitStatus: 'draft' | 'published') => {
    if (!title.trim()) {
      toast({
        title: '입력 오류',
        description: '제목을 입력해주세요.',
        variant: 'destructive'
      })
      return
    }

    if (!content || content.trim() === '' || content === '{"type":"doc","content":[{"type":"paragraph","content":[]}]}') {
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
      
      const noticeData = {
        title,
        content,
        category_id: selectedCategoryId,
        status: submitStatus,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        tags,
        priority: 0
      }

      const response = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noticeData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create notice')
      }

      const result = await response.json()
      
      toast({
        title: '성공',
        description: `공지사항이 ${submitStatus === 'published' ? '발행' : '저장'}되었습니다.`
      })

      router.push('/admin/notices')
    } catch (error: unknown) {
      logError('Error creating notice', error, { component: 'CreateNoticePage', action: 'handleSubmit' })
      toast({
        title: '오류',
        description: error instanceof Error ? error.message : '공지사항 생성 중 오류가 발생했습니다.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getSelectedCategory = () => {
    return categories.find(c => c.id === selectedCategoryId)
  }

  if (categoriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>카테고리를 불러오는 중...</p>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background">
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
                <h1 className="text-2xl font-bold text-foreground">공지사항 작성</h1>
                <p className="text-muted-foreground">Tiptap 에디터로 리치 텍스트 공지사항을 작성합니다</p>
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
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>내용 *</CardTitle>
            </CardHeader>
            <CardContent>
              <TiptapEditor
                ref={editorRef}
                value={content}
                onChange={handleContentChange}
                placeholder="공지사항 내용을 입력하세요..."
                height="400px"
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
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
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
                <p className="mt-1 text-xs text-muted-foreground">
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
                <p className="mt-1 text-xs text-muted-foreground">
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