# 나란히 Admin System Design Document

> 나란히정신건강의학과의원 관리자 시스템 설계 문서  
> **Version**: 1.0  
> **Last Updated**: 2025-01-08  
> **Author**: Claude Code  

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Current System Analysis](#-current-system-analysis)
3. [Database Schema Design](#-database-schema-design)
4. [System Architecture](#-system-architecture)
5. [API Specifications](#-api-specifications)
6. [Authentication & Security](#-authentication--security)
7. [Component Architecture](#-component-architecture)
8. [Migration Strategy](#-migration-strategy)
9. [Implementation Roadmap](#-implementation-roadmap)
10. [Technical Guidelines](#-technical-guidelines)

---

## 🎯 Project Overview

### Goals
- Create a comprehensive admin system for managing clinic content
- Replace static data files with database-driven content management
- Implement secure authentication and role-based access control
- Provide intuitive interfaces for staff, facility, and notice management

### Scope
- **Staff Management**: Medical staff and treatment staff profiles
- **Facility Management**: Hospital and center photo galleries
- **Notice Management**: Replace Notion API with internal system
- **User Management**: Admin user authentication and permissions

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel
- **Image Management**: Supabase Storage

---

## 🔍 Current System Analysis

### Data Sources & Structure

#### Staff Data (`/src/app/about-hospital/staffs.ts`)
```typescript
// Current Structure
export const medicalStaffs = [
  {
    profileImage: string,
    position: string,
    name: string,
    specialty: string,
    educations: string[],
    works: string[], // → certifications
    experiences: string[]
  }
];

export const treatmentStaffs = [
  // 13 treatment staff members with similar structure
];
```

**Current Count**: 1 medical staff + 13 treatment staff

#### Facility Photos (`/src/app/facilities/photos.ts`)
```typescript
// Current Structure
const photos = {
  hospitalPhotos: [
    {
      photoIndex: number,
      src: string,
      width: number,
      height: number,
      alt: string,
      original: string,
      caption: string
    }
  ],
  centerPhotos: [
    // Similar structure
  ]
};
```

**Current Count**: 10 hospital photos + 5 center photos

#### Notice System
- **Current**: Notion API integration
- **Environment**: `NOTION_SECRET_KEY`, `NOTION_NOTICE_DB_ID`
- **API Routes**: `/api/notice`, `/api/notice/[id]`

### Pain Points
1. **Static Data**: Manual code updates required for staff/facility changes
2. **No Authentication**: Public website only, no admin access
3. **Notion Dependency**: External service dependency for content management
4. **No Image Management**: Static files, no optimization or CDN
5. **No Version Control**: No content versioning or approval workflows

---

## 🗄️ Database Schema Design

### Core Tables

#### 1. Staff Management

```sql
-- Staff Categories
CREATE TABLE staff_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL, -- 'medical' | 'treatment'
  display_name VARCHAR(100) NOT NULL, -- '의료진' | '치료진'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff Members
CREATE TABLE staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES staff_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  specialty VARCHAR(200),
  profile_image_url TEXT,
  profile_image_alt VARCHAR(500),
  educations JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb, -- renamed from 'works'
  experiences JSONB DEFAULT '[]'::jsonb,
  bio TEXT, -- additional biography
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_staff_members_category ON staff_members(category_id);
CREATE INDEX idx_staff_members_active ON staff_members(is_active);
CREATE INDEX idx_staff_members_order ON staff_members(display_order);
```

#### 2. Facility Management

```sql
-- Facility Categories
CREATE TABLE facility_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL, -- 'hospital' | 'center'
  display_name VARCHAR(100) NOT NULL, -- '병원' | '센터'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facility Photos
CREATE TABLE facility_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES facility_categories(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT, -- optimized thumbnail
  alt_text VARCHAR(500) NOT NULL,
  caption VARCHAR(500),
  width INTEGER,
  height INTEGER,
  file_size INTEGER, -- in bytes
  mime_type VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_facility_photos_category ON facility_photos(category_id);
CREATE INDEX idx_facility_photos_active ON facility_photos(is_active);
CREATE INDEX idx_facility_photos_order ON facility_photos(display_order);
```

#### 3. Notice Management

```sql
-- Notices (replacing Notion)
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) UNIQUE, -- URL-friendly identifier
  content TEXT NOT NULL,
  summary TEXT, -- for list display
  notice_date DATE NOT NULL,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  meta_title VARCHAR(200), -- SEO
  meta_description VARCHAR(500), -- SEO
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Notice Images (for rich content)
CREATE TABLE notice_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(500),
  caption VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notices_published ON notices(is_published, notice_date DESC);
CREATE INDEX idx_notices_featured ON notices(is_featured);
CREATE INDEX idx_notices_slug ON notices(slug);
```

#### 4. Admin Authentication

```sql
-- Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- 'super_admin' | 'admin' | 'editor'
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Activity Log
CREATE TABLE admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login'
  resource_type VARCHAR(50), -- 'staff', 'facility', 'notice'
  resource_id UUID,
  details JSONB, -- additional context
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_admin_activity_user ON admin_activity_log(admin_user_id);
CREATE INDEX idx_admin_activity_action ON admin_activity_log(action);
CREATE INDEX idx_admin_activity_created ON admin_activity_log(created_at DESC);
```

### Initial Data Seeding

```sql
-- Insert initial categories
INSERT INTO staff_categories (name, display_name) VALUES 
('medical', '의료진'),
('treatment', '치료진');

INSERT INTO facility_categories (name, display_name) VALUES 
('hospital', '병원'),
('center', '센터');
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read active staff" ON staff_members
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active facilities" ON facility_photos
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read published notices" ON notices
  FOR SELECT USING (is_published = true);

-- Admin-only access for management
CREATE POLICY "Admins can manage staff" ON staff_members
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage facilities" ON facility_photos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage notices" ON notices
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 🏗️ System Architecture

### Application Structure

```
naranhi/
├── src/
│   ├── app/
│   │   ├── admin/                     # Admin-only routes
│   │   │   ├── layout.tsx            # Admin layout with auth
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Admin dashboard
│   │   │   ├── staff/
│   │   │   │   ├── page.tsx          # Staff management
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx      # Edit staff
│   │   │   │   └── new/
│   │   │   │       └── page.tsx      # Add staff
│   │   │   ├── facilities/
│   │   │   │   ├── page.tsx          # Photo management
│   │   │   │   └── upload/
│   │   │   │       └── page.tsx      # Upload photos
│   │   │   ├── notices/
│   │   │   │   ├── page.tsx          # Notice management
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx      # Edit notice
│   │   │   │   └── new/
│   │   │   │       └── page.tsx      # Create notice
│   │   │   ├── settings/
│   │   │   │   └── page.tsx          # Admin settings
│   │   │   └── login/
│   │   │       └── page.tsx          # Admin login
│   │   └── api/
│   │       └── admin/                # Admin API routes
│   │           ├── staff/
│   │           ├── facilities/
│   │           ├── notices/
│   │           └── auth/
│   ├── components/
│   │   └── admin/                    # Admin-specific components
│   │       ├── AdminLayout.tsx
│   │       ├── AdminSidebar.tsx
│   │       ├── AdminHeader.tsx
│   │       ├── staff/
│   │       ├── facilities/
│   │       └── notices/
│   ├── lib/
│   │   ├── supabase/                 # Supabase configuration
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   └── validations/              # Zod schemas
│   │       ├── staff.ts
│   │       ├── facility.ts
│   │       └── notice.ts
│   └── types/
│       └── admin.ts                  # Admin-specific types
└── docs/
    └── admin-system-design.md        # This document
```

### Component Hierarchy

```
AdminLayout
├── AdminHeader
│   ├── UserMenu
│   └── ThemeToggle
├── AdminSidebar
│   ├── Navigation
│   └── UserProfile
└── AdminContent
    ├── Dashboard
    │   ├── StatsCards
    │   ├── RecentActivity
    │   └── QuickActions
    ├── StaffManagement
    │   ├── StaffList
    │   ├── StaffForm
    │   └── StaffCard
    ├── FacilityManagement
    │   ├── PhotoGrid
    │   ├── PhotoUpload
    │   └── PhotoForm
    └── NoticeManagement
        ├── NoticeList
        ├── NoticeEditor
        └── NoticeForm
```

---

## 🔌 API Specifications

### Authentication Endpoints

```typescript
// Admin Authentication
POST   /api/admin/auth/login           # Admin login
POST   /api/admin/auth/logout          # Admin logout
GET    /api/admin/auth/session         # Get current session
POST   /api/admin/auth/refresh         # Refresh session
```

### Staff Management APIs

```typescript
// Staff CRUD Operations
GET    /api/admin/staff                # List all staff
POST   /api/admin/staff                # Create staff member
GET    /api/admin/staff/[id]           # Get staff details
PUT    /api/admin/staff/[id]           # Update staff member
DELETE /api/admin/staff/[id]           # Delete staff member
POST   /api/admin/staff/[id]/upload    # Upload profile image
PUT    /api/admin/staff/reorder        # Reorder staff display

// Request/Response Examples
interface StaffCreateRequest {
  categoryId: string;
  name: string;
  position: string;
  specialty?: string;
  educations: string[];
  certifications: string[];
  experiences: string[];
  bio?: string;
  displayOrder?: number;
}

interface StaffResponse {
  id: string;
  category: {
    id: string;
    name: string;
    displayName: string;
  };
  name: string;
  position: string;
  specialty?: string;
  profileImageUrl?: string;
  educations: string[];
  certifications: string[];
  experiences: string[];
  bio?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

### Facility Management APIs

```typescript
// Facility Photo CRUD Operations  
GET    /api/admin/facilities           # List all photos
POST   /api/admin/facilities           # Upload new photo
GET    /api/admin/facilities/[id]      # Get photo details
PUT    /api/admin/facilities/[id]      # Update photo details
DELETE /api/admin/facilities/[id]      # Delete photo
PUT    /api/admin/facilities/reorder   # Reorder photos
POST   /api/admin/facilities/bulk      # Bulk upload photos

// Request/Response Examples
interface FacilityPhotoCreateRequest {
  categoryId: string;
  title: string;
  altText: string;
  caption?: string;
  file: File; // multipart/form-data
}

interface FacilityPhotoResponse {
  id: string;
  category: {
    id: string;
    name: string;
    displayName: string;
  };
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  altText: string;
  caption?: string;
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Notice Management APIs

```typescript
// Notice CRUD Operations
GET    /api/admin/notices              # List all notices
POST   /api/admin/notices              # Create notice
GET    /api/admin/notices/[id]         # Get notice details
PUT    /api/admin/notices/[id]         # Update notice
DELETE /api/admin/notices/[id]         # Delete notice
POST   /api/admin/notices/[id]/publish # Publish notice
POST   /api/admin/notices/[id]/images  # Upload notice images

// Request/Response Examples
interface NoticeCreateRequest {
  title: string;
  slug?: string; // auto-generated if not provided
  content: string;
  summary?: string;
  noticeDate: string; // ISO date
  isPublished?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

interface NoticeResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  noticeDate: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  viewCount: number;
  metaTitle?: string;
  metaDescription?: string;
  images: NoticeImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
```

### Public API Updates

```typescript
// Updated public APIs to use database
GET    /api/staff                     # Get all active staff (replaces static data)
GET    /api/facilities                # Get all active facilities (replaces static data)
GET    /api/notice                    # Get published notices (replaces Notion API)
GET    /api/notice/[id]               # Get notice details (replaces Notion API)
```

---

## 🔐 Authentication & Security

### Supabase Auth Configuration

```typescript
// /src/lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();

// /src/lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerSupabaseClient = () => {
  return createServerComponentClient({ cookies });
};

// /src/lib/supabase/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Redirect to login if not authenticated
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('email', session.user.email)
      .single();

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

### Role-Based Access Control

```typescript
// /src/lib/auth/permissions.ts
export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
}

export const permissions = {
  // Staff management
  'staff:read': [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR],
  'staff:write': [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],
  'staff:delete': [AdminRole.SUPER_ADMIN],

  // Facility management
  'facilities:read': [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR],
  'facilities:write': [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],
  'facilities:delete': [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],

  // Notice management
  'notices:read': [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR],
  'notices:write': [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR],
  'notices:publish': [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],
  'notices:delete': [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],

  // Admin management
  'admin:read': [AdminRole.SUPER_ADMIN],
  'admin:write': [AdminRole.SUPER_ADMIN],
  'admin:delete': [AdminRole.SUPER_ADMIN],
};

export function hasPermission(userRole: AdminRole, permission: string): boolean {
  return permissions[permission]?.includes(userRole) ?? false;
}
```

### Data Validation

```typescript
// /src/lib/validations/staff.ts
import { z } from 'zod';

export const staffCreateSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(100),
  position: z.string().min(1).max(100),
  specialty: z.string().max(200).optional(),
  educations: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  experiences: z.array(z.string()).default([]),
  bio: z.string().max(2000).optional(),
  displayOrder: z.number().int().min(0).default(0),
});

export const staffUpdateSchema = staffCreateSchema.partial();

export type StaffCreateInput = z.infer<typeof staffCreateSchema>;
export type StaffUpdateInput = z.infer<typeof staffUpdateSchema>;
```

---

## 🧩 Component Architecture

### Admin Layout Components

```typescript
// /src/components/admin/AdminLayout.tsx
interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="text-gray-600 mt-1">{description}</p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Staff Management Components

```typescript
// /src/components/admin/staff/StaffForm.tsx
interface StaffFormProps {
  initialData?: StaffResponse;
  onSubmit: (data: StaffCreateInput | StaffUpdateInput) => Promise<void>;
  loading?: boolean;
}

export function StaffForm({ initialData, onSubmit, loading }: StaffFormProps) {
  const form = useForm<StaffCreateInput>({
    resolver: zodResolver(staffCreateSchema),
    defaultValues: initialData || {
      categoryId: '',
      name: '',
      position: '',
      specialty: '',
      educations: [],
      certifications: [],
      experiences: [],
      bio: '',
      displayOrder: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input placeholder="이름을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Additional fields... */}
        
        <Button type="submit" disabled={loading}>
          {loading ? '저장 중...' : initialData ? '수정' : '등록'}
        </Button>
      </form>
    </Form>
  );
}
```

### Image Upload Components

```typescript
// /src/components/admin/common/ImageUpload.tsx
interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      
      // Validate file
      if (!acceptedTypes.includes(file.type)) {
        throw new Error('지원하지 않는 파일 형식입니다.');
      }
      
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
      }

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(data.path);

      onChange(publicUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      // Handle error
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onRemove}
          >
            제거
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer block text-center"
          >
            <div className="text-gray-400 mb-2">
              📷 이미지 업로드
            </div>
            <div className="text-sm text-gray-500">
              {uploading ? '업로드 중...' : '클릭하여 이미지를 선택하세요'}
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Migration Strategy

### Phase 1: Foundation Setup (Week 1-2)

#### 1.1 Supabase Project Setup
```bash
# Create new Supabase project
# Configure environment variables
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

#### 1.2 Database Schema Creation
```sql
-- Run all schema creation scripts
-- Set up RLS policies
-- Insert initial seed data
```

#### 1.3 Authentication Implementation
- Install Supabase Auth helpers
- Create middleware for route protection
- Implement admin login/logout functionality

### Phase 2: Staff Management (Week 3-4)

#### 2.1 Data Migration Script
```typescript
// /scripts/migrate-staff-data.ts
import { medicalStaffs, treatmentStaffs } from '../src/app/about-hospital/staffs';
import { supabase } from '../src/lib/supabase/client';

async function migrateStaffData() {
  // Get category IDs
  const { data: categories } = await supabase
    .from('staff_categories')
    .select('id, name');

  const medicalCategoryId = categories?.find(c => c.name === 'medical')?.id;
  const treatmentCategoryId = categories?.find(c => c.name === 'treatment')?.id;

  // Migrate medical staff
  for (const staff of medicalStaffs) {
    await supabase.from('staff_members').insert({
      category_id: medicalCategoryId,
      name: staff.name,
      position: staff.position,
      specialty: staff.specialty,
      profile_image_url: staff.profileImage,
      educations: staff.educations,
      certifications: staff.works, // renamed
      experiences: staff.experiences,
      display_order: 0,
    });
  }

  // Migrate treatment staff
  for (const [index, staff] of treatmentStaffs.entries()) {
    await supabase.from('staff_members').insert({
      category_id: treatmentCategoryId,
      name: staff.name,
      position: staff.position,
      specialty: staff.specialty,
      profile_image_url: staff.profileImage,
      educations: staff.educations,
      certifications: staff.works, // renamed
      experiences: staff.experiences,
      display_order: index + 1,
    });
  }
}
```

#### 2.2 API Implementation
- Create staff CRUD endpoints
- Implement image upload functionality
- Add validation and error handling

#### 2.3 Admin Interface
- Build staff management pages
- Create staff form components
- Implement staff list with filtering/sorting

### Phase 3: Facility Management (Week 5)

#### 3.1 Photo Migration Script
```typescript
// /scripts/migrate-facility-data.ts
import photos from '../src/app/facilities/photos';
import { supabase } from '../src/lib/supabase/client';

async function migrateFacilityData() {
  // Get category IDs
  const { data: categories } = await supabase
    .from('facility_categories')
    .select('id, name');

  const hospitalCategoryId = categories?.find(c => c.name === 'hospital')?.id;
  const centerCategoryId = categories?.find(c => c.name === 'center')?.id;

  // Migrate hospital photos
  for (const photo of photos.hospitalPhotos) {
    await supabase.from('facility_photos').insert({
      category_id: hospitalCategoryId,
      title: photo.caption || photo.alt,
      image_url: photo.src,
      alt_text: photo.alt,
      caption: photo.caption,
      width: photo.width,
      height: photo.height,
      display_order: photo.photoIndex,
    });
  }

  // Migrate center photos
  for (const photo of photos.centerPhotos) {
    await supabase.from('facility_photos').insert({
      category_id: centerCategoryId,
      title: photo.caption || photo.alt,
      image_url: photo.src,
      alt_text: photo.alt,
      caption: photo.caption,
      width: photo.width,
      height: photo.height,
      display_order: photo.photoIndex,
    });
  }
}
```

### Phase 4: Notice System Migration (Week 6)

#### 4.1 Notice Data Migration
- Export existing notices from Notion (if needed)
- Transform and import into Supabase
- Update public notice pages to use database

#### 4.2 Rich Text Editor
- Implement rich text editor for notice content
- Add image upload functionality for notices
- Create notice preview functionality

### Phase 5: Public Site Updates (Week 7)

#### 5.1 Update Public Pages
```typescript
// Update /src/app/about-hospital/page.tsx
export async function getStaffData() {
  const { data } = await supabase
    .from('staff_members')
    .select(`
      *,
      category:staff_categories(name, display_name)
    `)
    .eq('is_active', true)
    .order('display_order');
  
  return data;
}

// Update /src/app/facilities/page.tsx
export async function getFacilityPhotos() {
  const { data } = await supabase
    .from('facility_photos')
    .select(`
      *,
      category:facility_categories(name, display_name)
    `)
    .eq('is_active', true)
    .order('display_order');
  
  return data;
}
```

#### 5.2 Remove Static Data Files
- Remove `/src/app/about-hospital/staffs.ts`
- Remove `/src/app/facilities/photos.ts`
- Update imports and references

---

## 📅 Implementation Roadmap

### Week 1-2: Foundation & Setup
- [x] ~~Design documentation~~ ✅
- [ ] Supabase project setup and configuration
- [ ] Database schema creation and seeding
- [ ] Authentication system implementation
- [ ] Admin layout and routing structure

**Deliverables:**
- Working Supabase database with schema
- Admin authentication system
- Basic admin layout structure

### Week 3-4: Staff Management System
- [ ] Staff data migration script
- [ ] Staff CRUD API endpoints
- [ ] Staff management admin interface
- [ ] Image upload functionality for staff profiles
- [ ] Update public staff pages to use database

**Deliverables:**
- Complete staff management system
- Migrated staff data from static files
- Updated public staff display pages

### Week 5-6: Facility & Notice Management
- [ ] Facility photo migration script
- [ ] Facility management admin interface
- [ ] Notice management system (replacing Notion)
- [ ] Rich text editor for notices
- [ ] Update public facility and notice pages

**Deliverables:**
- Complete facility management system
- Notice management system replacing Notion
- Updated public facility and notice pages

### Week 7-8: Testing & Deployment
- [ ] Comprehensive testing (unit, integration, E2E)
- [ ] Performance optimization
- [ ] SEO optimization for public pages
- [ ] Production deployment and monitoring setup
- [ ] Documentation and training materials

**Deliverables:**
- Fully tested and deployed admin system
- Performance-optimized public pages
- Monitoring and analytics setup

---

## 🔧 Technical Guidelines

### Development Standards

#### Code Style
- Use TypeScript for all new code
- Follow existing Prettier and ESLint configurations
- Use shadcn/ui components for consistent design
- Implement proper error handling and loading states

#### Database Practices
- Use UUIDs for all primary keys
- Implement proper foreign key constraints
- Add appropriate indexes for query performance
- Use Row Level Security (RLS) for data protection

#### API Design
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement consistent error response format
- Add request validation using Zod schemas

#### Security Considerations
- Never expose sensitive data in client-side code
- Validate all inputs on both client and server
- Use proper authentication for admin routes
- Implement rate limiting for API endpoints

### Testing Strategy

#### Unit Tests
```typescript
// Example: Staff API endpoint test
describe('/api/admin/staff', () => {
  it('should create staff member with valid data', async () => {
    const response = await POST('/api/admin/staff', {
      categoryId: 'valid-uuid',
      name: 'Test Staff',
      position: 'Test Position',
      // ... other required fields
    });
    
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Test Staff',
      position: 'Test Position',
    });
  });

  it('should reject invalid data', async () => {
    const response = await POST('/api/admin/staff', {
      name: '', // invalid empty name
    });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('validation');
  });
});
```

#### Integration Tests
- Test complete user workflows
- Verify database constraints and relationships
- Test file upload functionality
- Validate authentication and authorization

#### E2E Tests
- Admin login and navigation
- Complete CRUD workflows for each content type
- Image upload and management
- Public page updates after admin changes

### Performance Optimization

#### Database Optimization
- Use appropriate indexes for frequent queries
- Implement pagination for large datasets
- Use database views for complex queries
- Cache frequently accessed data

#### Image Optimization
- Implement automatic image resizing and optimization
- Use WebP format where supported
- Implement lazy loading for images
- Use CDN for image delivery

#### Frontend Optimization
- Implement code splitting for admin routes
- Use React.memo for expensive components
- Implement optimistic updates for better UX
- Use SWR or React Query for data fetching

### Monitoring & Analytics

#### Error Tracking
- Implement Sentry for error monitoring
- Track API errors and performance metrics
- Monitor database query performance
- Set up alerts for critical issues

#### Usage Analytics
- Track admin user activity
- Monitor content creation and updates
- Track public page performance
- Analyze user engagement metrics

---

## 📝 Conclusion

This admin system design provides a comprehensive foundation for managing the naranhi clinic website content. The implementation follows modern web development best practices and provides a scalable architecture for future enhancements.

### Key Benefits
1. **Centralized Content Management**: All content in one secure admin system
2. **Improved Security**: Proper authentication and authorization
3. **Better Performance**: Database-driven content with optimizations
4. **Enhanced UX**: Intuitive admin interfaces with modern components
5. **Scalability**: Architecture supports future feature additions

### Next Steps
1. Review and approve this design document
2. Set up development environment and Supabase project
3. Begin Phase 1 implementation (Foundation & Setup)
4. Regular progress reviews and adjustments as needed

---

**Document Information:**
- **Version**: 1.0
- **Last Updated**: 2025-01-08
- **Review Schedule**: Weekly during implementation
- **Contact**: Development team lead
