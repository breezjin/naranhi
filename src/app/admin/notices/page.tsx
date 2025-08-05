'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  ArrowLeft,
  Eye,
  Calendar,
  Tag
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { logError } from '@/utils/logger'

// Enhanced TypeScript interfaces
interface NoticeCategory {
  id: string
  name: string
  display_name: string
  color: string
  created_at?: string
  updated_at?: string
}

interface Notice {
  id: string
  title: string
  slug?: string | null // URL-friendly version of title
  content: Record<string, any> // Quill Delta format
  html_content: string
  plain_text: string
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  scheduled_publish_at: string | null
  category_id: string
  priority: number
  display_order: number
  view_count: number
  last_viewed_at: string | null
  meta_title: string | null
  meta_description: string | null
  featured_image_url: string | null
  tags: string[]
  author_id: string | null
  created_at: string
  updated_at: string
  search_vector?: string | null // Full-text search vector (read-only)
  category: {
    name: string
    display_name: string
    color: string
  }
}

interface NoticesResponse {
  data: Notice[]
  success: boolean
  message?: string
}

interface CategoriesResponse {
  data: NoticeCategory[]
  success: boolean
  message?: string
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [categories, setCategories] = useState<NoticeCategory[]>([])
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  
  const router = useRouter()
  const { toast } = useToast()

  // Extract fetch functions to prevent webpack-internal errors from nested async functions
  const fetchNotices = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notices')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      
      // Handle setup required error
      if (data.setupRequired) {
        return {
          success: false,
          error: '데이터베이스 테이블이 초기화되지 않았습니다. 관리자에게 문의하세요.',
          data: [],
          setupRequired: true
        }
      }
      
      return { success: true, data: data.data || [] }
    } catch (error) {
      logError('Error fetching notices', error, { component: 'NoticesPage', action: 'fetchNotices' })
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [] 
      }
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notice-categories')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      
      // Handle setup required error
      if (data.setupRequired) {
        return {
          success: false,
          error: '데이터베이스 테이블이 초기화되지 않았습니다. 관리자에게 문의하세요.',
          data: [
            { id: '1', name: 'general', display_name: '일반', color: '#3b82f6' },
            { id: '2', name: 'important', display_name: '중요', color: '#ef4444' }
          ],
          setupRequired: true
        }
      }
      
      return { success: true, data: data.data || [] }
    } catch (error) {
      logError('Error fetching categories', error, { component: 'NoticesPage', action: 'fetchCategories' })
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
      setLoading(true)
      setError(null)
      
      // Execute both requests in parallel
      const [noticesResult, categoriesResult] = await Promise.all([
        fetchNotices(),
        fetchCategories()
      ])

      // Set notices data
      setNotices(noticesResult.data)
      
      // Set categories data  
      setCategories(categoriesResult.data)

      // Show error only if both requests failed completely
      if (!noticesResult.success && !categoriesResult.success) {
        setError(`데이터를 불러오는 중 오류가 발생했습니다. 공지사항: ${noticesResult.error}, 카테고리: ${categoriesResult.error}`)
      } else if (!noticesResult.success) {
        console.warn('공지사항 데이터를 불러오지 못했습니다:', noticesResult.error)
      } else if (!categoriesResult.success) {
        console.warn('카테고리 데이터를 불러오지 못했지만 기본 카테고리를 사용합니다:', categoriesResult.error)
      }
    } catch (error: unknown) {
      logError('Critical error in fetchData', error, { component: 'NoticesPage', action: 'fetchData' })
      setError('예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.')
      // Set fallback data to prevent app crash
      setNotices([])
      setCategories([
        { id: '1', name: 'general', display_name: '일반', color: '#3b82f6' },
        { id: '2', name: 'important', display_name: '중요', color: '#ef4444' }
      ])
    } finally {
      setLoading(false)
    }
  }, [fetchNotices, fetchCategories]) // Include fetch functions as dependencies

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    filterNotices()
  }, [notices, debouncedSearchTerm, selectedCategory, selectedStatus])

  // Enhanced filtering with performance optimization
  const filterNotices = useCallback(() => {
    let filtered = notices

    // Optimized search with early return for empty search
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(notice => {
        // Early return if title matches (most common case)
        if (notice.title.toLowerCase().includes(searchLower)) return true
        
        // Check plain text content
        if (notice.plain_text.toLowerCase().includes(searchLower)) return true
        
        // Check tags (if any exist)
        if (notice.tags.length > 0) {
          return notice.tags.some(tag => tag.toLowerCase().includes(searchLower))
        }
        
        return false
      })
    }

    // Filter by category with optimized comparison
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(notice => notice.category.name === selectedCategory)
    }

    // Filter by status with optimized comparison
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(notice => notice.status === selectedStatus)
    }

    setFilteredNotices(filtered)
  }, [notices, debouncedSearchTerm, selectedCategory, selectedStatus])

  // Memoized filtered notices for performance
  const memoizedFilteredNotices = useMemo(() => {
    return filteredNotices
  }, [filteredNotices])

  const handleDelete = async (notice: Notice) => {
    if (!confirm(`"${notice.title}" 공지사항을 삭제하시겠습니까?`)) {
      return
    }

    try {
      setDeleteLoading(notice.id)
      
      const response = await fetch(`/api/admin/notices/${notice.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete notice')
      }

      toast({
        title: '삭제 완료',
        description: `"${notice.title}" 공지사항이 삭제되었습니다.`
      })

      // Refresh data
      fetchData()
    } catch (error: unknown) {
      logError('Error deleting notice', error, { component: 'NoticesPage', action: 'handleDelete', noticeId: notice.id })
      toast({
        title: '삭제 실패',
        description: '공지사항 삭제 중 오류가 발생했습니다.',
        variant: 'destructive'
      })
    } finally {
      setDeleteLoading(null)
    }
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

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">공지사항 관리</h2>
          <p className="mt-1 text-gray-600">Quill 에디터로 리치 텍스트 공지사항을 관리합니다</p>
        </div>
        <Button onClick={() => router.push('/admin/notices/create')}>
          <Plus className="mr-2 h-4 w-4" />
          공지사항 작성
        </Button>
      </div>
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="제목, 내용, 태그로 검색..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="published">발행됨</SelectItem>
              <SelectItem value="draft">초안</SelectItem>
              <SelectItem value="archived">보관됨</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="mb-6 flex gap-4 text-sm text-gray-600">
          <span>전체: {notices.length}개</span>
          <span>검색 결과: {memoizedFilteredNotices.length}개</span>
          {selectedCategory !== 'all' && (
            <span>
              카테고리: {categories.find(c => c.name === selectedCategory)?.display_name}
            </span>
          )}
          {selectedStatus !== 'all' && (
            <span>상태: {selectedStatus === 'published' ? '발행됨' : selectedStatus === 'draft' ? '초안' : '보관됨'}</span>
          )}
        </div>

        {/* Notices List */}
        {memoizedFilteredNotices.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              공지사항이 없습니다
            </h3>
            <p className="mb-4 text-gray-600">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? '검색 조건에 맞는 공지사항이 없습니다.' 
                : '첫 번째 공지사항을 작성해보세요.'}
            </p>
            <Button onClick={() => router.push('/admin/notices/create')}>
              <Plus className="mr-2 h-4 w-4" />
              공지사항 작성
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {memoizedFilteredNotices.map((notice) => (
              <Card key={notice.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notice.title}
                        </h3>
                        {getStatusBadge(notice.status)}
                        <Badge 
                          variant="outline" 
                          style={{ backgroundColor: `${notice.category.color}20`, borderColor: notice.category.color }}
                        >
                          {notice.category.display_name}
                        </Badge>
                      </div>
                      
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                        {notice.plain_text.substring(0, 150)}
                        {notice.plain_text.length > 150 && '...'}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {notice.status === 'published' && notice.published_at 
                            ? `발행: ${formatDate(notice.published_at)}`
                            : `작성: ${formatDate(notice.created_at)}`}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {notice.view_count}회
                        </div>
                        {notice.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {notice.tags.slice(0, 3).join(', ')}
                            {notice.tags.length > 3 && ` +${notice.tags.length - 3}`}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/notices/${notice.id}/edit`)}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(notice)}
                        disabled={deleteLoading === notice.id}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        {deleteLoading === notice.id ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-b border-current" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </div>
  )
}