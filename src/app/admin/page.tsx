'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, Building2, Plus } from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">관리자 페이지 - 전체 현황 및 빠른 작업</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => router.push('/admin/notices/create')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              공지사항 작성
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">새 공지사항을 작성합니다</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => router.push('/admin/staff/new')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              직원 추가
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">새 직원 정보를 추가합니다</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => router.push('/admin/facilities')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              시설 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">시설 사진을 관리합니다</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>공지사항 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/notices')}
              >
                목록 보기
              </Button>
              <Button 
                onClick={() => router.push('/admin/notices/create')}
              >
                <Plus className="h-4 w-4 mr-1" />
                새 공지 작성
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>직원 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/staff')}
              >
                직원 목록
              </Button>
              <Button 
                onClick={() => router.push('/admin/staff/new')}
              >
                <Plus className="h-4 w-4 mr-1" />
                직원 추가
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}