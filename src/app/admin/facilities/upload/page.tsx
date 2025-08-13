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
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'

type FacilityCategory = {
  id: string
  name: string
  display_name: string
}

type FormData = {
  title: string
  image_url: string
  thumbnail_url?: string
  alt_text: string
  caption?: string
  category_id: string
  width?: number
  height?: number
  file_size?: number
  mime_type?: string
  display_order: number
}

export default function UploadFacilityPage() {
  const [categories, setCategories] = useState<FacilityCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    image_url: '',
    alt_text: '',
    caption: '',
    category_id: '',
    display_order: 0
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/facility-categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      
      const data = await response.json()
      setCategories(data.data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      setError('카테고리를 불러오는 중 오류가 발생했습니다.')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: '파일 형식 오류',
        description: '이미지 파일만 업로드할 수 있습니다.',
        variant: 'destructive'
      })
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: '파일 크기 오류',
        description: '10MB 이하의 파일만 업로드할 수 있습니다.',
        variant: 'destructive'
      })
      return
    }

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Get image dimensions
    const img = new window.Image()
    img.onload = () => {
      setFormData(prev => ({
        ...prev,
        width: img.width,
        height: img.height,
        file_size: file.size,
        mime_type: file.type
      }))
    }
    img.src = URL.createObjectURL(file)

    // Auto-fill fields if empty
    if (!formData.title) {
      const fileName = file.name.split('.')[0]
      setFormData(prev => ({ ...prev, title: fileName }))
    }
    if (!formData.alt_text) {
      setFormData(prev => ({ ...prev, alt_text: `${file.name} 이미지` }))
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
    
    if (!imageFile) {
      errors.image = '업로드할 이미지를 선택해주세요.'
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
      setLoading(true)

      // 1. 이미지를 Supabase Storage에 업로드
      let imageUrl = ''
      let thumbnailUrl = ''
      
      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        uploadFormData.append('bucket', 'facility-images')
        uploadFormData.append('maxSize', (10 * 1024 * 1024).toString()) // 10MB
        
        const uploadResponse = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: uploadFormData
        })
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || '이미지 업로드에 실패했습니다.')
        }
        
        const uploadResult = await uploadResponse.json()
        imageUrl = uploadResult.data.url
        thumbnailUrl = uploadResult.data.url // 현재는 같은 URL 사용, 향후 썸네일 별도 생성 가능
        
        console.log('이미지 업로드 성공:', uploadResult.data)
      }
      
      const facilityData = {
        ...formData,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl
      }

      const response = await fetch('/api/admin/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(facilityData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create facility photo')
      }

      toast({
        title: '업로드 완료',
        description: `"${formData.title}" 사진이 성공적으로 업로드되었습니다.`
      })

      router.push('/admin/facilities')
    } catch (error: any) {
      console.error('Error uploading photo:', error)
      toast({
        title: '업로드 실패',
        description: error.message || '사진 업로드 중 오류가 발생했습니다.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
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
              <h1 className="text-2xl font-bold text-foreground">시설 사진 업로드</h1>
              <p className="text-muted-foreground">새로운 시설 사진을 업로드합니다</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-2xl">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>사진 정보 입력</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>사진 파일 *</Label>
                  <div className="rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-muted-foreground">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="relative mx-auto w-full max-w-md">
                          <img
                            src={imagePreview}
                            alt="미리보기"
                            className="h-auto w-full rounded-lg shadow-md"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setImagePreview(null)
                            setImageFile(null)
                          }}
                        >
                          다른 사진 선택
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium text-foreground">
                            사진을 업로드하세요
                          </p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, WebP 파일 (최대 10MB)
                          </p>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="mx-auto max-w-xs"
                        />
                      </div>
                    )}
                  </div>
                  {formErrors.image && (
                    <p className="text-sm text-destructive">{formErrors.image}</p>
                  )}
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">사진 제목 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="예: 대기실 전경"
                    />
                    {formErrors.title && (
                      <p className="text-sm text-destructive">{formErrors.title}</p>
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
                      <p className="text-sm text-destructive">{formErrors.category_id}</p>
                    )}
                  </div>
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
                    <p className="text-sm text-destructive">{formErrors.alt_text}</p>
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
                  <p className="text-sm text-muted-foreground/70">
                    숫자가 작을수록 먼저 표시됩니다.
                  </p>
                  {formErrors.display_order && (
                    <p className="text-sm text-destructive">{formErrors.display_order}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/facilities')}
                    disabled={loading}
                  >
                    취소
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || !imageFile}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                        업로드 중...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        사진 업로드
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Development Notice */}
          <Alert className="mt-6">
            <AlertDescription>
              <strong>개발 모드:</strong> 현재는 실제 파일 업로드가 구현되지 않았습니다. 
              실제 사용을 위해서는 Supabase Storage 연동이 필요합니다.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  )
}