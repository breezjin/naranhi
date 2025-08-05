-- Create initial admin system schema
-- Admin System for Naranhi Clinic Website

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create staff categories table
CREATE TABLE staff_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 'medical' | 'treatment'
  display_name VARCHAR(100) NOT NULL, -- '의료진' | '치료진'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create staff members table
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

-- Create facility categories table
CREATE TABLE facility_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 'hospital' | 'center'
  display_name VARCHAR(100) NOT NULL, -- '병원' | '센터'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create facility photos table
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

-- Create notices table (replacing Notion)
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

-- Create notice images table (for rich content)
CREATE TABLE notice_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(500),
  caption VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin users table
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

-- Create admin activity log table
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

-- Create indexes for better performance
CREATE INDEX idx_staff_members_category ON staff_members(category_id);
CREATE INDEX idx_staff_members_active ON staff_members(is_active);
CREATE INDEX idx_staff_members_order ON staff_members(display_order);

CREATE INDEX idx_facility_photos_category ON facility_photos(category_id);
CREATE INDEX idx_facility_photos_active ON facility_photos(is_active);
CREATE INDEX idx_facility_photos_order ON facility_photos(display_order);

CREATE INDEX idx_notices_published ON notices(is_published, notice_date DESC);
CREATE INDEX idx_notices_featured ON notices(is_featured);
CREATE INDEX idx_notices_slug ON notices(slug);

CREATE INDEX idx_admin_activity_user ON admin_activity_log(admin_user_id);
CREATE INDEX idx_admin_activity_action ON admin_activity_log(action);
CREATE INDEX idx_admin_activity_created ON admin_activity_log(created_at DESC);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_staff_categories_updated_at BEFORE UPDATE ON staff_categories
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_staff_members_updated_at BEFORE UPDATE ON staff_members
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_facility_categories_updated_at BEFORE UPDATE ON facility_categories
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_facility_photos_updated_at BEFORE UPDATE ON facility_photos
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert initial categories
INSERT INTO staff_categories (name, display_name, description) VALUES 
('medical', '의료진', '정신건강의학과 전문의'),
('treatment', '치료진', '심리상담사, 언어치료사, 놀이치료사 등');

INSERT INTO facility_categories (name, display_name, description) VALUES 
('hospital', '병원', '나란히정신건강의학과의원 시설'),
('center', '센터', '나란히심리발달센터 시설');