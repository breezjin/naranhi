'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'

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

interface DragDropFacilityListProps {
  photos: FacilityPhoto[]
  onPhotosReorder: (photos: FacilityPhoto[]) => void
  onDeletePhoto: (photo: FacilityPhoto) => void
  selectedCategory?: string
}

export default function DragDropFacilityList({ 
  photos, 
  onPhotosReorder, 
  onDeletePhoto,
  selectedCategory = 'all' 
}: DragDropFacilityListProps) {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredPhotos = photos
    .filter(photo => {
      if (selectedCategory === 'all') return true
      return photo.category && photo.category.name === selectedCategory
    })
    .sort((a, b) => a.display_order - b.display_order)

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(filteredPhotos)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update display_order for all items in the filtered category
    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index + 1
    }))

    // Optimistically update UI - ensure proper sorting
    const allPhotosUpdated = photos.map(photo => {
      const updatedPhoto = updatedItems.find(item => item.id === photo.id)
      return updatedPhoto || photo
    }).sort((a, b) => a.display_order - b.display_order)

    onPhotosReorder(allPhotosUpdated)

    // Update database using API endpoint
    try {
      const updates = updatedItems.map(item => ({
        id: item.id,
        display_order: item.display_order
      }))

      const response = await fetch('/api/admin/facilities/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update photo order')
      }

      const result = await response.json()

      toast({
        title: "순서 변경 완료",
        description: `"${reorderedItem.title}" 사진의 순서가 변경되었습니다.`,
      })
    } catch (error) {
      console.error('Error updating photo order:', error)
      // Revert optimistic update on error
      onPhotosReorder(photos)
      toast({
        title: "순서 변경 실패",
        description: error instanceof Error ? error.message : "순서 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })
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

  if (!isClient) {
    // Return static grid during SSR
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPhotos.map((photo) => (
          <FacilityPhotoCard
            key={photo.id}
            photo={photo}
            onDeletePhoto={onDeletePhoto}
            isDragging={false}
            formatFileSize={formatFileSize}
            getCategoryBadgeVariant={getCategoryBadgeVariant}
          />
        ))}
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="facility-photos-list" direction="horizontal">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
              snapshot.isDraggingOver ? 'bg-muted/20 rounded-lg p-2' : ''
            }`}
          >
            {filteredPhotos.map((photo, index) => (
              <Draggable key={photo.id} draggableId={photo.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={provided.draggableProps.style}
                  >
                    <FacilityPhotoCard
                      photo={photo}
                      onDeletePhoto={onDeletePhoto}
                      isDragging={snapshot.isDragging}
                      dragHandleProps={provided.dragHandleProps}
                      formatFileSize={formatFileSize}
                      getCategoryBadgeVariant={getCategoryBadgeVariant}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

interface FacilityPhotoCardProps {
  photo: FacilityPhoto
  onDeletePhoto: (photo: FacilityPhoto) => void
  isDragging: boolean
  dragHandleProps?: any
  formatFileSize: (bytes: number | null) => string
  getCategoryBadgeVariant: (categoryName: string) => 'default' | 'secondary' | 'outline'
}

function FacilityPhotoCard({ 
  photo, 
  onDeletePhoto, 
  isDragging, 
  dragHandleProps,
  formatFileSize,
  getCategoryBadgeVariant
}: FacilityPhotoCardProps) {
  const router = useRouter()

  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 ${
        isDragging 
          ? 'shadow-lg scale-105 rotate-2 bg-accent border-primary z-10' 
          : 'hover:shadow-md'
      }`}
    >
      <div className="relative">
        {/* Drag Handle - positioned over the image */}
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing p-2 bg-black/50 hover:bg-black/70 rounded-md transition-colors"
            title="드래그해서 순서 변경"
          >
            <GripVertical className="h-4 w-4 text-white" />
          </div>
        )}
        
        {/* Photo */}
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
          <div className="absolute right-2 top-2">
            <Badge variant={getCategoryBadgeVariant(photo.category.name)}>
              {photo.category.display_name}
            </Badge>
          </div>
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
            <div className="flex justify-between items-center">
              <span>순서: {photo.display_order}</span>
              {isDragging && (
                <span className="text-primary font-medium">드래그 중</span>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/admin/facilities/${photo.id}/edit`)}
              className="flex-1 gap-1"
            >
              <Edit className="h-3 w-3" />
              수정
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDeletePhoto(photo)}
              className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
              삭제
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}