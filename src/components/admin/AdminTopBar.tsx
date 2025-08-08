'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  User,
  Menu,
  Home,
  Shield
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  is_super_admin: boolean
  avatar_url?: string
}

interface AdminTopBarProps {
  onToggleSidebar?: () => void
}

export default function AdminTopBar({ onToggleSidebar }: AdminTopBarProps) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const pathname = usePathname()
  const supabase = createClient()
  const { actualTheme } = useTheme()

  useEffect(() => {
    initializeUser()
  }, [])

  const initializeUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) return

      // Get admin user info
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .single()

      if (adminData) {
        setAdminUser({
          id: adminData.id,
          email: adminData.email,
          name: adminData.name || adminData.email,
          role: adminData.role || 'admin',
          is_super_admin: adminData.is_super_admin || false,
          avatar_url: adminData.avatar_url
        })
      }
    } catch (error) {
      console.error('Error initializing user:', error)
    }
  }


  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    
    if (pathSegments.length < 2) return '관리자 대시보드'
    
    const pageMap: Record<string, string> = {
      'dashboard': '대시보드',
      'staff': '직원 관리',
      'facilities': '시설 관리', 
      'notices': '공지사항 관리',
      'analytics': '분석 리포트',
      'bookings': '예약 관리',
      'feedback': '사용자 피드백',
      'settings': '시스템 설정',
      'users': '사용자 관리',
      'database': '데이터베이스'
    }

    const currentPage = pathSegments[1]
    return pageMap[currentPage] || '관리자'
  }

  const handleSiteVisit = () => {
    // 현재 테마를 URL 파라미터로 전달하여 새 탭에서 사이트 열기
    const siteUrl = `/?theme=${actualTheme}`
    window.open(siteUrl, '_blank')
  }


  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page Title & Breadcrumb */}
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-foreground">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Home className="h-3 w-3" />
            <span>관리자</span>
            <span>→</span>
            <span>{getPageTitle()}</span>
          </div>
        </div>
      </div>

      {/* Center Section - Empty */}
      <div className="mx-4 flex-1"></div>

      {/* Right Section */}
      <div className="flex items-center gap-2">

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
                {adminUser?.avatar_url ? (
                  <img
                    src={adminUser.avatar_url}
                    alt={adminUser.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-white">
                    {adminUser?.name.charAt(0).toUpperCase() || 'A'}
                  </span>
                )}
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-sm font-medium text-foreground">
                  {adminUser?.name || '관리자'}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {adminUser?.role}
                  {adminUser?.is_super_admin && (
                    <Shield className="h-3 w-3" />
                  )}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {adminUser?.name || '관리자'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {adminUser?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>프로필 설정</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSiteVisit}>
              <Home className="mr-2 h-4 w-4" />
              <span>사이트 보기</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}