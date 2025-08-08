# 🔧 Admin 라우팅 문제 해결방안

## 1. Admin 미들웨어 수정
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Admin 라우트 보호
  if (pathname.startsWith('/admin')) {
    // 로그인 체크 로직 또는 임시 허용
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
```

## 2. Admin Layout 확인
```typescript
// src/app/admin/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      <nav>Admin Navigation</nav>
      <main>{children}</main>
    </div>
  )
}
```

## 3. 페이지 존재 여부 확인
- ✅ `/src/app/admin/notices/page.tsx`
- ✅ `/src/app/admin/notices/create/page.tsx`
- ❓ `/src/app/admin/page.tsx` (대시보드)