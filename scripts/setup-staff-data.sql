-- Staff System Database Setup
-- Ensures all required tables and initial data exist

-- Create staff categories table if not exists
CREATE TABLE IF NOT EXISTS staff_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create staff members table if not exists
CREATE TABLE IF NOT EXISTS staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES staff_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  specialty VARCHAR(200),
  profile_image_url TEXT,
  profile_image_alt VARCHAR(500),
  educations JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  experiences JSONB DEFAULT '[]'::jsonb,
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial categories if they don't exist
INSERT INTO staff_categories (name, display_name, description) 
VALUES 
  ('medical', '의료진', '정신건강의학과 전문의'),
  ('treatment', '치료진', '심리상담사, 언어치료사, 놀이치료사 등')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_staff_members_category ON staff_members(category_id);
CREATE INDEX IF NOT EXISTS idx_staff_members_active ON staff_members(is_active);
CREATE INDEX IF NOT EXISTS idx_staff_members_order ON staff_members(display_order);

-- Create function for updated_at timestamps if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_staff_categories_updated_at ON staff_categories;
CREATE TRIGGER update_staff_categories_updated_at BEFORE UPDATE ON staff_categories
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_members_updated_at ON staff_members;
CREATE TRIGGER update_staff_members_updated_at BEFORE UPDATE ON staff_members
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample data for testing (optional)
DO $$
BEGIN
  -- Only insert if no staff members exist
  IF NOT EXISTS (SELECT 1 FROM staff_members LIMIT 1) THEN
    INSERT INTO staff_members (
      category_id, 
      name, 
      position, 
      specialty, 
      educations, 
      certifications, 
      experiences,
      display_order
    ) 
    SELECT 
      sc.id,
      '김나란',
      '원장',
      '정신건강의학과 전문의',
      '["서울대학교 의학과 졸업", "서울대학교 정신건강의학과 전공의"]'::jsonb,
      '["정신건강의학과 전문의", "대한신경정신의학회 정회원"]'::jsonb,
      '["서울대학교병원 정신건강의학과 진료", "10년간 임상 경험"]'::jsonb,
      1
    FROM staff_categories sc 
    WHERE sc.name = 'medical';
    
    INSERT INTO staff_members (
      category_id, 
      name, 
      position, 
      specialty, 
      educations, 
      certifications, 
      experiences,
      display_order
    ) 
    SELECT 
      sc.id,
      '박상담',
      '심리상담사',
      '인지행동치료 전문',
      '["연세대학교 심리학과 졸업", "상담심리 대학원 석사"]'::jsonb,
      '["전문상담사 1급", "인지행동치료 전문가"]'::jsonb,
      '["아동청소년 상담 5년", "성인 개인상담 전문"]'::jsonb,
      2
    FROM staff_categories sc 
    WHERE sc.name = 'treatment';
  END IF;
END $$;