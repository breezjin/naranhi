"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, X, Upload, User } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

type StaffMember = {
  id: string
  name: string
  position: string
  specialty: string | null
  profile_image_url: string | null
  category_id: string
  educations: string[]
  certifications: string[]
  experiences: string[]
  display_order: number
}

type StaffCategory = {
  id: string
  name: string
  display_name: string
}

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<StaffCategory[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    specialty: '',
    category_id: '',
    profile_image_url: '',
    educations: [''],
    certifications: [''],
    experiences: [''],
    display_order: 0
  })

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCategories()
    fetchStaffMember()
  }, [resolvedParams.id])

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

  const fetchStaffMember = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          name: data.name || '',
          position: data.position || '',
          specialty: data.specialty || '',
          category_id: data.category_id || '',
          profile_image_url: data.profile_image_url || '',
          educations: data.educations && data.educations.length > 0 ? data.educations : [''],
          certifications: data.certifications && data.certifications.length > 0 ? data.certifications : [''],
          experiences: data.experiences && data.experiences.length > 0 ? data.experiences : [''],
          display_order: data.display_order || 0
        })

        if (data.profile_image_url) {
          setImagePreview(data.profile_image_url)
        }
      }
    } catch (error) {
      console.error('Error fetching staff member:', error)
      toast({
        title: "오류 발생",
        description: "직원 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
      router.push('/admin/staff')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayFieldChange = (field: 'educations' | 'certifications' | 'experiences', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayField = (field: 'educations' | 'certifications' | 'experiences') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayField = (field: 'educations' | 'certifications' | 'experiences', index: number) => {
    if (formData[field].length <= 1) return
    
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      setFormData(prev => ({
        ...prev,
        profile_image_url: `/imgs/staffs/${file.name}`
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.position || !formData.category_id) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const cleanedData = {
        ...formData,
        educations: formData.educations.filter(item => item.trim() !== ''),
        certifications: formData.certifications.filter(item => item.trim() !== ''),
        experiences: formData.experiences.filter(item => item.trim() !== ''),
        specialty: formData.specialty || null
      }

      const { error } = await supabase
        .from('staff_members')
        .update(cleanedData)
        .eq('id', resolvedParams.id)

      if (error) throw error

      toast({
        title: "수정 완료",
        description: `${formData.name} 직원 정보가 성공적으로 수정되었습니다.`,
      })

      router.push('/admin/staff')
    } catch (error) {
      console.error('Error updating staff:', error)
      toast({
        title: "수정 실패",
        description: "직원 정보 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">직원 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </Button>
        <div>
          <h1 className="text-3xl font-bold">직원 정보 수정</h1>
          <p className="mt-2 text-muted-foreground">
            {formData.name} 직원의 정보를 수정하세요
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Image */}
            <div>
              <Label htmlFor="profile-image">프로필 사진</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="프로필 미리보기"
                      className="h-20 w-20 rounded-full border-2 border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('profile-image')?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    사진 변경
                  </Button>
                  <p className="mt-1 text-sm text-muted-foreground">
                    JPG, PNG 파일 (최대 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="직원 이름을 입력하세요"
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">직책 *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="예: 언어치료사, 심리상담사"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="category">카테고리 *</Label>
                <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="specialty">전문분야</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  placeholder="예: 정신건강의학과 전문의, 센터장"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="display_order">표시 순서</Label>
              <Input
                id="display_order"
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader>
            <CardTitle>학력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.educations.map((education, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={education}
                  onChange={(e) => handleArrayFieldChange('educations', index, e.target.value)}
                  placeholder="예: 서울대학교 심리학과 학사"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayField('educations', index)}
                  disabled={formData.educations.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayField('educations')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              학력 추가
            </Button>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>자격증 및 면허</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.certifications.map((certification, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={certification}
                  onChange={(e) => handleArrayFieldChange('certifications', index, e.target.value)}
                  placeholder="예: [보건복지부] 언어재활사 1급"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayField('certifications', index)}
                  disabled={formData.certifications.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayField('certifications')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              자격증 추가
            </Button>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader>
            <CardTitle>경력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.experiences.map((experience, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={experience}
                  onChange={(e) => handleArrayFieldChange('experiences', index, e.target.value)}
                  placeholder="예: 전) 서울대학교병원 언어치료사"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayField('experiences', index)}
                  disabled={formData.experiences.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayField('experiences')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              경력 추가
            </Button>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? '저장 중...' : '수정 완료'}
          </Button>
        </div>
      </form>
    </div>
  )
}