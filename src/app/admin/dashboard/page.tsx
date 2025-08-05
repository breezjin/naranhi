'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DashboardStats {
  totalStaff: number
  totalFacilities: number
  totalNotices: number
  publishedNotices: number
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          router.push('/admin/login')
          return
        }

        setUser(user)

        // Get admin user info
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', user.email)
          .single()

        if (adminError || !adminData || !adminData.is_active) {
          await supabase.auth.signOut()
          router.push('/admin/login')
          return
        }

        setAdminUser(adminData)

        // Get dashboard stats with error handling
        try {
          const [
            staffResult,
            facilityResult,
            noticeResult,
            publishedResult
          ] = await Promise.allSettled([
            supabase.from('staff_members').select('*', { count: 'exact', head: true }),
            supabase.from('facility_photos').select('*', { count: 'exact', head: true }),
            supabase.from('notices').select('*', { count: 'exact', head: true }),
            supabase.from('notices').select('*', { count: 'exact', head: true }).eq('status', 'published')
          ])

          setStats({
            totalStaff: (staffResult.status === 'fulfilled' ? staffResult.value.count : 0) || 0,
            totalFacilities: (facilityResult.status === 'fulfilled' ? facilityResult.value.count : 0) || 0,
            totalNotices: (noticeResult.status === 'fulfilled' ? noticeResult.value.count : 0) || 0,
            publishedNotices: (publishedResult.status === 'fulfilled' ? publishedResult.value.count : 0) || 0
          })
        } catch (statsError) {
          console.warn('Some stats could not be loaded:', statsError)
          setStats({
            totalStaff: 0,
            totalFacilities: 0,
            totalNotices: 0,
            publishedNotices: 0
          })
        }

      } catch (error: any) {
        console.error('Auth check error:', error)
        setError('인증 확인 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (error: any) {
      console.error('Logout error:', error)
      setError('로그아웃 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p>로딩 중...</p>
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
      {/* Welcome Section */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          {adminUser?.name}님, 환영합니다!
        </h2>
        <p className="text-gray-600">
          나란히 관리자 시스템에서 사이트를 효율적으로 관리하세요.
        </p>
      </div>
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">총 직원</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStaff || 0}</div>
              <p className="text-xs text-gray-600">의료진 + 치료진</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">시설 사진</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalFacilities || 0}</div>
              <p className="text-xs text-gray-600">병원 + 센터</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">총 공지사항</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalNotices || 0}</div>
              <p className="text-xs text-gray-600">작성된 공지사항</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">게시된 공지</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.publishedNotices || 0}</div>
              <p className="text-xs text-gray-600">공개된 공지사항</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>직원 관리</CardTitle>
              <CardDescription>의료진과 치료진 정보를 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/admin/staff')}
                  className="w-full"
                >
                  직원 관리하기
                </Button>
                <Button 
                  onClick={() => router.push('/admin/staff/new')}
                  variant="outline" 
                  className="w-full"
                >
                  새 직원 추가
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>시설 관리</CardTitle>
              <CardDescription>병원과 센터 사진을 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/admin/facilities')}
                  className="w-full"
                >
                  시설 관리하기
                </Button>
                <Button 
                  onClick={() => router.push('/admin/facilities/upload')}
                  variant="outline" 
                  className="w-full"
                >
                  사진 업로드
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>공지사항 관리</CardTitle>
              <CardDescription>공지사항을 작성하고 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/admin/notices')}
                  className="w-full"
                >
                  공지사항 관리하기
                </Button>
                <Button 
                  onClick={() => router.push('/admin/notices/new')}
                  variant="outline" 
                  className="w-full"
                >
                  새 공지사항 작성
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Development Notice */}
        <Alert>
          <AlertDescription>
            🚧 <strong>개발 중인 시스템입니다.</strong> 
            실제 사용을 위해서는 Supabase 프로젝트를 설정하고 환경변수를 업데이트해주세요.
            <br />
            <br />
            <strong>다음 단계:</strong>
            <br />
            1. Supabase 프로젝트 생성 및 API 키 설정
            <br />
            2. 데이터베이스 스키마 생성: <code>yarn db:setup</code>
            <br />
            3. 기존 데이터 마이그레이션
          </AlertDescription>
        </Alert>
    </div>
  )
}