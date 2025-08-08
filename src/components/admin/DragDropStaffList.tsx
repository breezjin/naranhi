'use client'

import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, User, GripVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

type StaffMember = {
  id: string
  name: string
  position: string
  specialty: string | null
  profile_image_url: string | null
  category: {
    name: string
    display_name: string
  }
  educations: string[]
  certifications: string[]
  experiences: string[]
  display_order: number
  created_at: string
}

interface DragDropStaffListProps {
  staffMembers: StaffMember[]
  onStaffReorder: (staffMembers: StaffMember[]) => void
  onDeleteStaff: (id: string, name: string) => void
  selectedCategory?: string
}

export default function DragDropStaffList({ 
  staffMembers, 
  onStaffReorder, 
  onDeleteStaff,
  selectedCategory = 'all' 
}: DragDropStaffListProps) {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredStaff = staffMembers
    .filter(staff => {
      if (selectedCategory === 'all') return true
      return staff.category && staff.category.name === selectedCategory
    })
    .sort((a, b) => a.display_order - b.display_order)

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(filteredStaff)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update display_order for all items in the filtered category
    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index + 1
    }))

    // Optimistically update UI - ensure proper sorting
    const allStaffUpdated = staffMembers.map(staff => {
      const updatedStaff = updatedItems.find(item => item.id === staff.id)
      return updatedStaff || staff
    }).sort((a, b) => a.display_order - b.display_order)

    onStaffReorder(allStaffUpdated)

    // Update database using API endpoint
    try {
      const updates = updatedItems.map(item => ({
        id: item.id,
        display_order: item.display_order
      }))

      const response = await fetch('/api/admin/staff/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update staff order')
      }

      const result = await response.json()

      toast({
        title: "순서 변경 완료",
        description: `${reorderedItem.name} 직원의 순서가 변경되었습니다.`,
      })
    } catch (error) {
      console.error('Error updating staff order:', error)
      // Revert optimistic update on error
      onStaffReorder(staffMembers)
      toast({
        title: "순서 변경 실패",
        description: error instanceof Error ? error.message : "순서 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  if (!isClient) {
    // Return static list during SSR
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredStaff.map((staff) => (
          <StaffCard
            key={staff.id}
            staff={staff}
            onDeleteStaff={onDeleteStaff}
            isDragging={false}
          />
        ))}
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="staff-list">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid grid-cols-1 gap-6 lg:grid-cols-2 ${
              snapshot.isDraggingOver ? 'rounded-lg bg-muted/20 p-2' : ''
            }`}
          >
            {filteredStaff.map((staff, index) => (
              <Draggable key={staff.id} draggableId={staff.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={provided.draggableProps.style}
                  >
                    <StaffCard
                      staff={staff}
                      onDeleteStaff={onDeleteStaff}
                      isDragging={snapshot.isDragging}
                      dragHandleProps={provided.dragHandleProps}
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

interface StaffCardProps {
  staff: StaffMember
  onDeleteStaff: (id: string, name: string) => void
  isDragging: boolean
  dragHandleProps?: any
}

function StaffCard({ staff, onDeleteStaff, isDragging, dragHandleProps }: StaffCardProps) {
  const router = useRouter()

  return (
    <Card 
      className={`transition-all duration-200 ${
        isDragging 
          ? 'rotate-2 scale-105 border-primary bg-accent shadow-lg' 
          : 'hover:shadow-md'
      }`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="-ml-2 -mt-2 shrink-0 cursor-grab rounded-md p-2 hover:bg-muted active:cursor-grabbing"
            title="드래그해서 순서 변경"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Profile Image */}
          <div className="shrink-0">
            {staff.profile_image_url ? (
              <img
                src={staff.profile_image_url}
                alt={staff.name}
                className="h-16 w-16 rounded-full border-2 border-border object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Staff Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{staff.name}</h3>
                <p className="text-sm text-muted-foreground">{staff.position}</p>
                {staff.specialty && (
                  <p className="mt-1 text-sm text-primary">{staff.specialty}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={staff.category?.name === 'medical' ? 'default' : 'secondary'}>
                  {staff.category?.display_name || '미분류'}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  순서: {staff.display_order}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>학력: {staff.educations.length}개</div>
              <div>자격증: {staff.certifications.length}개</div>
              <div>경력: {staff.experiences.length}개</div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/staff/${staff.id}/edit`)}
                className="gap-1"
              >
                <Edit className="h-3 w-3" />
                수정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteStaff(staff.id, staff.name)}
                className="gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
                삭제
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}