'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  
  // 로그인 페이지에서는 헤더와 사이드바를 숨김
  const isLoginPage = pathname === '/admin/login'

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  if (isLoginPage) {
    return (
      <ThemeProvider defaultTheme="system">
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-background transition-colors">
        {/* Admin Layout Structure */}
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
          
          {/* Main Content Area */}
          <div className="flex min-h-screen flex-1 flex-col">
            {/* Top Navigation Bar */}
            <AdminTopBar onToggleSidebar={toggleSidebar} />
            
            {/* Page Content */}
            <main className={`flex-1 p-4 transition-all duration-300 lg:p-6 ${
              sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
            }`}>
              {children}
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}