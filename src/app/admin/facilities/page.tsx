'use client'

import { useEffect, useState } from 'react'
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
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react'
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

export default function FacilitiesPage() {
  const [photos, setPhotos] = useState<FacilityPhoto[]>([])
  const [categories, setCategories] = useState<FacilityCategory[]>([])
  const [filteredPhotos, setFilteredPhotos] = useState<FacilityPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterPhotos()
  }, [photos, searchTerm, selectedCategory])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch photos and categories in parallel
      const [photosResponse, categoriesResponse] = await Promise.all([
        fetch('/api/admin/facilities'),
        fetch('/api/admin/facility-categories')
      ])

      if (!photosResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const photosData = await photosResponse.json()
      const categoriesData = await categoriesResponse.json()

      setPhotos(photosData.data || [])
      setCategories(categoriesData.data || [])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const filterPhotos = () => {
    let filtered = photos

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(photo =>
        photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.alt_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (photo.caption && photo.caption.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(photo => photo.category.name === selectedCategory)
    }

    setFilteredPhotos(filtered)
  }

  const handleDelete = async (photo: FacilityPhoto) => {
    if (!confirm(`"${photo.title}" 사진을 삭제하시겠습니까?`)) {
      return
    }

    try {
      setDeleteLoading(photo.id)
      
      const response = await fetch(`/api/admin/facilities/${photo.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete photo')
      }

      toast({
        title: '삭제 완료',
        description: `"${photo.title}" 사진이 삭제되었습니다.`
      })

      // Refresh data
      fetchData()
    } catch (error: any) {
      console.error('Error deleting photo:', error)
      toast({
        title: '삭제 실패',
        description: '사진 삭제 중 오류가 발생했습니다.',
        variant: 'destructive'
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '크기 정보 없음'
    
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getCategoryBadgeVariant = (categoryName: string) => {
    switch (categoryName) {
      case 'hospital':
        return 'default'
      case 'center':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>시설 사진을 불러오는 중...</p>
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
      <header className="border-b border-border bg-background">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">시설 사진 관리</h1>
                <p className="text-muted-foreground">병원과 센터 사진을 관리합니다</p>
              </div>
            </div>
            <Button onClick={() => router.push('/admin/facilities/upload')}>
              <Plus className="mr-2 h-4 w-4" />
              사진 업로드
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="사진 제목, 설명으로 검색..."
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
        </div>

        {/* Stats */}
        <div className="mb-6 flex gap-4 text-sm text-muted-foreground">
          <span>전체: {photos.length}개</span>
          <span>검색 결과: {filteredPhotos.length}개</span>
          {selectedCategory !== 'all' && (
            <span>
              카테고리: {categories.find(c => c.name === selectedCategory)?.display_name}
            </span>
          )}
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="py-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium text-foreground">
              사진이 없습니다
            </h3>
            <p className="mb-4 text-muted-foreground">
              {searchTerm || selectedCategory !== 'all' 
                ? '검색 조건에 맞는 사진이 없습니다.' 
                : '첫 번째 사진을 업로드해보세요.'}
            </p>
            <Button onClick={() => router.push('/admin/facilities/upload')}>
              <Plus className="mr-2 h-4 w-4" />
              사진 업로드
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative aspect-square bg-gray-100">
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
                  <div className="absolute left-2 top-2">
                    <Badge variant={getCategoryBadgeVariant(photo.category.name)}>
                      {photo.category.display_name}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="line-clamp-2 font-medium text-foreground">
                        {photo.title}
                      </h3>
                      {photo.caption && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-xs text-muted-foreground/70">
                      {photo.width && photo.height && (
                        <div>{photo.width} × {photo.height}px</div>
                      )}
                      <div>{formatFileSize(photo.file_size)}</div>
                      <div>순서: {photo.display_order}</div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/facilities/${photo.id}/edit`)}
                        className="flex-1"
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(photo)}
                        disabled={deleteLoading === photo.id}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        {deleteLoading === photo.id ? (
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
      </main>
    </div>
  )
}