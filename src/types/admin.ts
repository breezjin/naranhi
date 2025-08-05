// Admin system type definitions

export interface StaffCategory {
  id: string
  name: 'medical' | 'treatment'
  display_name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface StaffMember {
  id: string
  category_id: string
  category?: StaffCategory
  name: string
  position: string
  specialty?: string
  profile_image_url?: string
  profile_image_alt?: string
  educations: string[]
  certifications: string[]
  experiences: string[]
  bio?: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface FacilityCategory {
  id: string
  name: 'hospital' | 'center'
  display_name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface FacilityPhoto {
  id: string
  category_id: string
  category?: FacilityCategory
  title: string
  image_url: string
  thumbnail_url?: string
  alt_text: string
  caption?: string
  width?: number
  height?: number
  file_size?: number
  mime_type?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Notice {
  id: string
  title: string
  slug: string
  content: string
  summary?: string
  notice_date: string
  is_published: boolean
  is_featured: boolean
  display_order: number
  view_count: number
  meta_title?: string
  meta_description?: string
  images?: NoticeImage[]
  created_at: string
  updated_at: string
  published_at?: string
}

export interface NoticeImage {
  id: string
  notice_id: string
  image_url: string
  alt_text?: string
  caption?: string
  display_order: number
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'editor'
  avatar_url?: string
  is_active: boolean
  last_login_at?: string
  login_count: number
  created_at: string
  updated_at: string
}

export interface AdminActivityLog {
  id: string
  admin_user_id: string
  admin_user?: AdminUser
  action: 'create' | 'update' | 'delete' | 'login' | 'logout'
  resource_type?: 'staff' | 'facility' | 'notice' | 'admin'
  resource_id?: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Form input types
export interface StaffCreateInput {
  category_id: string
  name: string
  position: string
  specialty?: string
  educations: string[]
  certifications: string[]
  experiences: string[]
  bio?: string
  display_order?: number
}

export interface StaffUpdateInput extends Partial<StaffCreateInput> {
  id: string
}

export interface FacilityPhotoCreateInput {
  category_id: string
  title: string
  alt_text: string
  caption?: string
  display_order?: number
}

export interface FacilityPhotoUpdateInput extends Partial<FacilityPhotoCreateInput> {
  id: string
}

export interface NoticeCreateInput {
  title: string
  slug?: string
  content: string
  summary?: string
  notice_date: string
  is_published?: boolean
  is_featured?: boolean
  meta_title?: string
  meta_description?: string
}

export interface NoticeUpdateInput extends Partial<NoticeCreateInput> {
  id: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Dashboard stats
export interface DashboardStats {
  total_staff: number
  total_facilities: number
  total_notices: number
  published_notices: number
  recent_activity: AdminActivityLog[]
}

// Filter and sort options
export interface FilterOptions {
  category?: string
  is_active?: boolean
  is_published?: boolean
  search?: string
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

export interface PaginationOptions {
  page: number
  limit: number
}