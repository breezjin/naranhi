'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Building2,
  Bell,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Shield,
  Zap
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<any>
  badge?: string | number
  description?: string
  children?: NavItem[]
}

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  is_super_admin: boolean
  avatar_url?: string
}

interface AdminSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export default function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const isCollapsed = collapsed
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalFacilities: 0,
    totalNotices: 0,
    draftNotices: 0
  })
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Main navigation items
  const navigationItems: NavItem[] = [
    {
      title: '대시보드',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      description: '전체 현황 및 통계'
    },
    {
      title: '직원 관리',
      href: '/admin/staff',
      icon: Users,
      badge: stats.totalStaff,
      description: '직원 정보 및 프로필 관리'
    },
    {
      title: '시설 관리',
      href: '/admin/facilities',
      icon: Building2,
      badge: stats.totalFacilities,
      description: '시설 사진 및 정보 관리'
    },
    {
      title: '공지사항',
      href: '/admin/notices',
      icon: Bell,
      badge: stats.draftNotices > 0 ? stats.draftNotices : undefined,
      description: '공지사항 작성 및 관리'
    }
  ]



  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          router.push('/admin/login')
          return
        }

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

        // Fetch stats
        await fetchStats()
      } catch (error) {
        console.error('Error initializing user:', error)
      }
    }

    initializeUser()
  }, [])

  const fetchStats = async () => {
    try {
      const [staffResult, facilitiesResult, noticesResult, draftResult] = await Promise.allSettled([
        supabase.from('staff_members').select('id', { count: 'exact' }),
        supabase.from('facility_photos').select('id', { count: 'exact' }),
        supabase.from('notices').select('id', { count: 'exact' }),
        supabase.from('notices').select('id', { count: 'exact' }).eq('status', 'draft')
      ])

      setStats({
        totalStaff: (staffResult.status === 'fulfilled' ? staffResult.value.count : 0) || 0,
        totalFacilities: (facilitiesResult.status === 'fulfilled' ? facilitiesResult.value.count : 0) || 0,
        totalNotices: (noticesResult.status === 'fulfilled' ? noticesResult.value.count : 0) || 0,
        draftNotices: (draftResult.status === 'fulfilled' ? draftResult.value.count : 0) || 0
      })
    } catch (error) {
      console.warn('Stats fetching failed, using defaults:', error)
      setStats({
        totalStaff: 0,
        totalFacilities: 0,
        totalNotices: 0,
        draftNotices: 0
      })
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem, level?: number }) => {
    const isActive = pathname === item.href
    const IconComponent = item.icon

    return (
      <Link href={item.href}>
        <div
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200',
            'hover:bg-accent hover:text-accent-foreground',
            isActive 
              ? 'bg-accent text-accent-foreground shadow-sm border-r-2 border-primary' 
              : 'text-foreground/80 hover:text-foreground',
            level > 0 && 'ml-4 text-sm'
          )}
          style={{ paddingLeft: `${12 + (level * 16)}px` }}
        >
          <IconComponent 
            className={cn(
              'h-5 w-5 transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
            )} 
          />
          
          {!isCollapsed && (
            <>
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                {item.description && (
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {item.description}
                  </div>
                )}
              </div>
              
              {item.badge && typeof item.badge === 'number' && item.badge > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {item.badge}
                </Badge>
              )}
              
              {item.badge && typeof item.badge === 'string' && (
                <Badge variant="default" className="h-5 px-1.5 text-xs">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </div>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 top-16 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] bg-background border-r border-border transition-all duration-300 shadow-lg',
          isCollapsed ? 'w-16' : 'w-64',
          // Mobile: slide in/out, Desktop: always visible with width adjustment
          'lg:translate-x-0',
          isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">나란히</h2>
                <p className="text-xs text-muted-foreground">관리자 시스템</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {/* Quick Actions */}
            {!isCollapsed && (
              <div className="mb-4">
                <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  빠른 작업
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 justify-start text-xs"
                    onClick={() => router.push('/admin/notices/create')}
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    공지작성
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 justify-start text-xs"
                    onClick={() => router.push('/admin/staff/new')}
                  >
                    <Users className="mr-1 h-3 w-3" />
                    직원추가
                  </Button>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            {!isCollapsed && (
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                주요 기능
              </div>
            )}
            
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavItemComponent key={item.href} item={item} />
              ))}
            </div>

          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4">
          {/* User Info */}
          {adminUser && !isCollapsed && (
            <div className="mb-3 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                  <span className="text-sm font-medium text-white">
                    {adminUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {adminUser.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {adminUser.role}
                    {adminUser.is_super_admin && (
                      <Shield className="ml-1 inline h-3 w-3" />
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => router.push('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              {!isCollapsed && '사이트 보기'}
            </Button>
            
            <Button
              variant="outline"
              size="sm" 
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {!isCollapsed && '로그아웃'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}