'use client'

import { useEffect, useState } from 'react'
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
import { ArrowLeft, Save } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'

type FacilityCategory = {
  id: string
  name: string
  display_name: string
}

type FacilityPhoto = {
  id: string
  title: string
  image_url: string
  thumbnail_url: string | null
  alt_text: string
  caption: string | null
  width: number | null
  height: number | null
  file_size: number | null
  mime_type: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  category: {
    name: string
    display_name: string
  }
}

type FormData = {
  title: string
  alt_text: string
  caption?: string
  category_id: string
  display_order: number
}

export default function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const [photo, setPhoto] = useState<FacilityPhoto | null>(null)
  const [categories, setCategories] = useState<FacilityCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [id, setId] = useState<string>('')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    alt_text: '',
    caption: '',
    category_id: '',
    display_order: 0
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    initializeParams()
  }, [params])

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch photo and categories in parallel
      const [photoResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/admin/facilities/${id}`),
        fetch('/api/admin/facility-categories')
      ])

      if (!photoResponse.ok) {
        if (photoResponse.status === 404) {
          throw new Error('사진을 찾을 수 없습니다.')
        }
        throw new Error('Failed to fetch photo')
      }

      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories')
      }

      const photoData = await photoResponse.json()
      const categoriesData = await categoriesResponse.json()

      const fetchedPhoto = photoData.data
      setPhoto(fetchedPhoto)
      setCategories(categoriesData.data || [])

      // Find category ID
      const categoryId = categoriesData.data.find(
        (cat: FacilityCategory) => cat.name === fetchedPhoto.category.name
      )?.id

      // Populate form
      setFormData({
        title: fetchedPhoto.title,
        alt_text: fetchedPhoto.alt_text,
        caption: fetchedPhoto.caption || '',
        category_id: categoryId || '',
        display_order: fetchedPhoto.display_order
      })

    } catch (error: any) {
      console.error('Error fetching data:', error)
      setError(error.message || '데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      errors.title = '사진 제목을 입력해주세요.'
    }
    
    if (!formData.alt_text.trim()) {
      errors.alt_text = '대체 텍스트를 입력해주세요.'
    }
    
    if (!formData.category_id) {
      errors.category_id = '카테고리를 선택해주세요.'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)

      const response = await fetch(`/api/admin/facilities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update facility photo')
      }

      toast({
        title: '수정 완료',
        description: `"${formData.title}" 사진 정보가 수정되었습니다.`
      })

      router.push('/admin/facilities')
    } catch (error: any) {
      console.error('Error updating photo:', error)
      toast({
        title: '수정 실패',
        description: error.message || '사진 정보 수정 중 오류가 발생했습니다.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '크기 정보 없음'
    
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p>사진 정보를 불러오는 중...</p>
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

  if (!photo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>사진을 찾을 수 없습니다.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/facilities')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">시설 사진 수정</h1>
              <p className="text-gray-600">&quot;{photo.title}&quot; 정보를 수정합니다</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Image Preview */}
            <Card>
              <CardHeader>
                <CardTitle>현재 사진</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={photo.thumbnail_url || photo.image_url}
                      alt={photo.alt_text}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-image.jpg'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="grid grid-cols-2 gap-4">
                      {photo.width && photo.height && (
                        <div>
                          <span className="font-medium">크기:</span><br />
                          {photo.width} × {photo.height}px
                        </div>
                      )}
                      <div>
                        <span className="font-medium">파일 크기:</span><br />
                        {formatFileSize(photo.file_size)}
                      </div>
                    </div>
                    {photo.mime_type && (
                      <div>
                        <span className="font-medium">파일 형식:</span> {photo.mime_type}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">업로드 날짜:</span><br />
                      {new Date(photo.created_at).toLocaleString('ko-KR')}
                    </div>
                    {photo.updated_at !== photo.created_at && (
                      <div>
                        <span className="font-medium">수정 날짜:</span><br />
                        {new Date(photo.updated_at).toLocaleString('ko-KR')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Form */}
            <Card>
              <CardHeader>
                <CardTitle>사진 정보 수정</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">사진 제목 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="예: 대기실 전경"
                    />
                    {formErrors.title && (
                      <p className="text-sm text-red-600">{formErrors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category_id">카테고리 *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.category_id && (
                      <p className="text-sm text-red-600">{formErrors.category_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alt_text">대체 텍스트 *</Label>
                    <Input
                      id="alt_text"
                      value={formData.alt_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                      placeholder="시각 장애인을 위한 이미지 설명"
                    />
                    {formErrors.alt_text && (
                      <p className="text-sm text-red-600">{formErrors.alt_text}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caption">캡션</Label>
                    <Textarea
                      id="caption"
                      value={formData.caption}
                      onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                      placeholder="사진에 대한 간단한 설명 (선택사항)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_order">표시 순서</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                    <p className="text-sm text-gray-500">
                      숫자가 작을수록 먼저 표시됩니다.
                    </p>
                    {formErrors.display_order && (
                      <p className="text-sm text-red-600">{formErrors.display_order}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin/facilities')}
                      disabled={saving}
                    >
                      취소
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="flex-1"
                    >
                      {saving ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                          저장 중...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          수정 완료
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}