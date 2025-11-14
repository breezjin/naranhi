'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Plus, Search, Edit, Trash2, User, ArrowUpDown, Move } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import DragDropStaffList from '@/components/admin/DragDropStaffList'

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

type StaffCategory = {
  id: string
  name: string
  display_name: string
}

export default function StaffManagementPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [categories, setCategories] = useState<StaffCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isDragDropMode, setIsDragDropMode] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchStaffData()
    fetchCategories()
  }, [])

  const fetchStaffData = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select(`
          *,
          category:staff_categories!category_id(name, display_name)
        `)
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Staff data fetch error:', error)
        throw error
      }

      setStaffMembers(data || [])
    } catch (error) {
      console.error('Error fetching staff:', error)
      toast({
        title: "오류 발생",
        description: "직원 데이터를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('Categories fetch error:', error)
        // 카테고리 테이블이 없으면 기본값 사용
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.warn('staff_categories table does not exist, using default categories')
          setCategories([
            { id: '1', name: 'medical', display_name: '의료진' },
            { id: '2', name: 'treatment', display_name: '치료진' }
          ])
          return
        }
        throw error
      }

      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      // 폴백으로 기본 카테고리 설정
      setCategories([
        { id: '1', name: 'medical', display_name: '의료진' },
        { id: '2', name: 'treatment', display_name: '치료진' }
      ])
    }
  }

  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`${name} 직원을 삭제하시겠습니까?`)) return

    try {
      // Use API route instead of direct Supabase call to bypass RLS
      const response = await fetch(`/api/admin/staff/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Delete failed')
      }

      setStaffMembers(prev => prev.filter(staff => staff.id !== id))
      toast({
        title: "삭제 완료",
        description: `${name} 직원이 삭제되었습니다.`,
      })
    } catch (error) {
      console.error('Error deleting staff:', error)
      toast({
        title: "삭제 실패",
        description: error instanceof Error ? error.message : "직원 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const filteredStaff = staffMembers
    .filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (staff.specialty && staff.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || 
        (staff.category && staff.category.name === selectedCategory)

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => a.display_order - b.display_order)

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">직원 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">직원 관리</h1>
          <p className="mt-2 text-muted-foreground">
            의료진 및 치료진 정보를 관리합니다
          </p>
        </div>
        <Button onClick={() => router.push('/admin/staff/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          새 직원 추가
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 직원</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffMembers.length}명</div>
          </CardContent>
        </Card>
        
        {categories.map(category => {
          const count = staffMembers.filter(staff => 
            staff.category && staff.category.name === category.name
          ).length
          return (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{category.display_name}</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}명</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search and Category Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="이름, 직책, 전문분야로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    disabled={isDragDropMode}
                  />
                </div>
              </div>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
                disabled={isDragDropMode && searchTerm !== ''}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Drag & Drop Mode Toggle */}
            <div className="flex items-center space-x-3 rounded-lg border bg-muted/20 p-3">
              <Move className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <Label htmlFor="drag-drop-mode" className="font-medium">
                  드래그 & 드롭 모드
                </Label>
                <p className="text-sm text-muted-foreground">
                  직원 순서를 드래그해서 쉽게 변경할 수 있습니다
                </p>
              </div>
              <Switch
                id="drag-drop-mode"
                checked={isDragDropMode}
                onCheckedChange={(checked) => {
                  setIsDragDropMode(checked)
                  if (checked) {
                    setSearchTerm('') // Clear search when entering drag mode
                  }
                }}
              />
            </div>
            
            {isDragDropMode && (
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    드래그 & 드롭 모드가 활성화되었습니다
                  </span>
                </div>
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  좌측 핸들(⋮⋮)을 드래그해서 직원 순서를 변경하세요. 카테고리별로 순서를 관리할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      {isDragDropMode ? (
        <DragDropStaffList
          staffMembers={staffMembers}
          onStaffReorder={setStaffMembers}
          onDeleteStaff={handleDeleteStaff}
          selectedCategory={selectedCategory}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredStaff.map((staff) => (
            <Card key={staff.id} className="transition-shadow hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
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
                        onClick={() => handleDeleteStaff(staff.id, staff.name)}
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
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredStaff.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="py-12 text-center">
              <User className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium">
                {isDragDropMode ? '드래그 가능한 직원이 없습니다' : '검색 결과가 없습니다'}
              </h3>
              <p className="mb-4 text-muted-foreground">
                {isDragDropMode 
                  ? '다른 카테고리를 선택하거나 직원을 추가해보세요'
                  : '다른 검색어나 필터를 시도해보세요'
                }
              </p>
              <Button onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setIsDragDropMode(false)
              }}>
                필터 초기화
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}