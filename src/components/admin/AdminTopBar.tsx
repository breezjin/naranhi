'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Search,
  Bell,
  Settings,
  User,
  Menu,
  Home,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  created_at: string
  read: boolean
}

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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    initializeUser()
    loadNotifications()
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

  const loadNotifications = async () => {
    // Mock notifications for now - replace with actual Supabase query when notifications table is implemented
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: '새로운 공지사항 작성됨',
        message: '관리자가 새로운 공지사항을 작성했습니다.',
        type: 'info',
        created_at: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        title: '시스템 백업 완료',
        message: '일일 백업이 성공적으로 완료되었습니다.',
        type: 'success',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        read: false
      },
      {
        id: '3',
        title: '주의: 높은 트래픽 감지',
        message: '현재 사이트 트래픽이 평소보다 높습니다.',
        type: 'warning',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        read: true
      }
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.read).length)
  }

  const markNotificationAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'success':
        return <Shield className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`
    return `${Math.floor(diffInMinutes / 1440)}일 전`
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
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
          <h1 className="text-lg font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Home className="h-3 w-3" />
            <span>관리자</span>
            <span>→</span>
            <span>{getPageTitle()}</span>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="mx-4 max-w-md flex-1">
        {showSearch ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="페이지, 직원, 공지사항 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => {
                if (!searchQuery) setShowSearch(false)
              }}
              className="pl-9 pr-4"
              autoFocus
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowSearch(true)}
            className="hidden w-full justify-start text-gray-500 hover:text-gray-700 sm:flex"
          >
            <Search className="mr-2 h-4 w-4" />
            검색...
          </Button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Mobile Search */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSearch(true)}
          className="sm:hidden"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              알림
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}개
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                새로운 알림이 없습니다
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex cursor-pointer items-start gap-3 p-3"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`truncate text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {notification.message}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
            
            {notifications.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm text-blue-600 hover:text-blue-700">
                  모든 알림 보기
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>

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
                <div className="text-sm font-medium text-gray-900">
                  {adminUser?.name || '관리자'}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
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
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>계정 설정</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Home className="mr-2 h-4 w-4" />
              <span>사이트 보기</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}