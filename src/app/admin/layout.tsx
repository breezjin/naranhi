'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
  )
}