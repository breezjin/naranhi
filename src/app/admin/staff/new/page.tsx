"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, X, Upload, User } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

type StaffCategory = {
  id: string
  name: string
  display_name: string
}

export default function NewStaffPage() {
  const [loading, setLoading] = useState(false)
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

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Error fetching categories from Supabase:', error)
        throw error
      }

      if (data && data.length > 0) {
        // 데이터베이스에서 성공적으로 가져온 경우 id를 문자열로 변환
        const formattedData = data.map(category => ({
          ...category,
          id: category.id.toString()
        }))
        setCategories(formattedData)
        console.log('✅ Categories loaded from database:', formattedData)
      } else {
        // 데이터가 없는 경우 기본값 사용
        console.warn('No categories found in database, using defaults')
        setCategories([
          { id: '1', name: 'medical', display_name: '의료진' },
          { id: '2', name: 'therapeutic', display_name: '치료진' }
        ])
      }
    } catch (error: any) {
      console.error('Failed to fetch categories:', error)
      
      // 에러 타입에 따른 적절한 폴백 처리
      if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
        console.warn('staff_categories table does not exist, using default categories')
      } else if (error?.message?.includes('connection')) {
        console.warn('Database connection issue, using default categories')
      }
      
      // 모든 경우에 기본 카테고리 설정
      setCategories([
        { id: '1', name: 'medical', display_name: '의료진' },
        { id: '2', name: 'therapeutic', display_name: '치료진' }
      ])
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

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
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // For now, we'll just store the file name
      // In a real implementation, you'd upload to Supabase Storage
      setFormData(prev => ({
        ...prev,
        profile_image_url: `/imgs/staffs/${file.name}`
      }))
    }
  }

  // 데이터 검증 함수
  const validateFormData = () => {
    const errors: string[] = []
    
    if (!formData.name.trim()) {
      errors.push('이름을 입력해주세요.')
    } else if (formData.name.length > 100) {
      errors.push('이름은 100자 이하로 입력해주세요.')
    }
    
    if (!formData.position.trim()) {
      errors.push('직책을 입력해주세요.')
    } else if (formData.position.length > 100) {
      errors.push('직책은 100자 이하로 입력해주세요.')
    }
    
    if (!formData.category_id) {
      errors.push('카테고리를 선택해주세요.')
    }
    
    if (formData.specialty && formData.specialty.length > 200) {
      errors.push('전문분야는 200자 이하로 입력해주세요.')
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 폼 데이터 검증
    const validationErrors = validateFormData()
    if (validationErrors.length > 0) {
      toast({
        title: "입력 오류",
        description: validationErrors[0],
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // 데이터 정제 및 타입 변환
      const cleanedData = {
        name: formData.name.trim(),
        position: formData.position.trim(),
        category_id: parseInt(formData.category_id),
        specialty: formData.specialty?.trim() || null,
        profile_image_url: formData.profile_image_url || null,
        educations: formData.educations.filter(item => item.trim() !== ''),
        certifications: formData.certifications.filter(item => item.trim() !== ''),
        experiences: formData.experiences.filter(item => item.trim() !== ''),
        display_order: formData.display_order
      }

      // Use API route instead of direct Supabase call to bypass RLS
      const response = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create staff')
      }

      toast({
        title: "✅ 직원 추가 완료",
        description: `${cleanedData.name} 직원이 성공적으로 추가되었습니다.`,
        variant: "default",
      })

      router.push('/admin/staff')
    } catch (error: any) {
      console.error('Error creating staff:', error)

      // 구체적인 에러 메시지 처리
      let errorMessage = "직원 추가 중 오류가 발생했습니다."
      let errorTitle = "추가 실패"

      if (error?.message?.includes('카테고리')) {
        errorTitle = "카테고리 오류"
        errorMessage = "선택한 카테고리가 유효하지 않습니다. 다시 선택해주세요."
      } else if (error?.message?.includes('duplicate')) {
        errorTitle = "중복 데이터"
        errorMessage = "이미 존재하는 직원 정보입니다."
      } else if (error?.message?.includes('connection')) {
        errorTitle = "연결 오류"
        errorMessage = "데이터베이스 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요."
      } else {
        errorMessage = error?.message || errorMessage
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold">새 직원 추가</h1>
          <p className="mt-2 text-muted-foreground">
            새로운 직원 정보를 입력하세요
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
                    사진 업로드
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
                placeholder="0"
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
          <Button type="submit" disabled={loading}>
            {loading ? '저장 중...' : '직원 추가'}
          </Button>
        </div>
      </form>
    </div>
  )
}