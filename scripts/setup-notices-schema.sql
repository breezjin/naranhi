-- Notices Management Tables for Quill Editor
-- Part of Phase 2-C: Notice Management System

-- Create notice categories table
CREATE TABLE IF NOT EXISTS notice_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3b82f6', -- Tailwind blue-500
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notices table with Quill editor support
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE, -- URL-friendly version of title
  
  -- Quill editor content storage
  content JSONB NOT NULL, -- Quill Delta format
  html_content TEXT, -- Rendered HTML for SEO and display
  plain_text TEXT, -- Plain text for search
  
  -- Publishing workflow
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMPTZ,
  scheduled_publish_at TIMESTAMPTZ,
  
  -- Categorization and ordering
  category_id UUID REFERENCES notice_categories(id) ON DELETE SET NULL,
  priority INTEGER DEFAULT 0, -- Higher numbers = higher priority
  display_order INTEGER DEFAULT 0,
  
  -- Engagement metrics
  view_count BIGINT DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  -- SEO and metadata
  meta_title VARCHAR(60), -- SEO title
  meta_description VARCHAR(160), -- SEO description
  featured_image_url TEXT,
  tags TEXT[], -- Array of tags
  
  -- Author and timestamps
  author_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('korean', coalesce(title, '') || ' ' || coalesce(plain_text, '') || ' ' || coalesce(array_to_string(tags, ' '), ''))
  ) STORED
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notices_status ON notices(status);
CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category_id);
CREATE INDEX IF NOT EXISTS idx_notices_published_at ON notices(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_priority ON notices(priority DESC, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_notices_search ON notices USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_notices_tags ON notices USING GIN(tags);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_notice_categories_updated_at ON notice_categories;
CREATE TRIGGER update_notice_categories_updated_at 
    BEFORE UPDATE ON notice_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notices_updated_at ON notices;
CREATE TRIGGER update_notices_updated_at 
    BEFORE UPDATE ON notices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default notice categories
INSERT INTO notice_categories (name, display_name, description, color) VALUES
  ('general', '일반공지', '일반적인 병원 공지사항', '#3b82f6'),
  ('event', '이벤트', '특별 이벤트 및 프로모션', '#10b981'),
  ('medical', '진료안내', '진료 관련 중요 안내', '#f59e0b'),
  ('urgent', '긴급공지', '긴급하게 전달해야 할 내용', '#ef4444')
ON CONFLICT (name) DO NOTHING;

-- Insert sample notices for testing
INSERT INTO notices (
  title, 
  content, 
  html_content, 
  plain_text,
  status,
  published_at,
  category_id,
  priority,
  meta_title,
  meta_description,
  tags
) VALUES
  (
    '나란히 정신건강의학과 개원 안내',
    '{"ops":[{"insert":"안녕하세요. 나란히 정신건강의학과가 새롭게 개원하였습니다.\n\n"},{"attributes":{"bold":true},"insert":"진료 시간"},{"insert":"\n월-금: 오전 9시 - 오후 6시\n토요일: 오전 9시 - 오후 1시\n\n"},{"attributes":{"bold":true},"insert":"예약 문의"},{"insert":"\n전화: 02-6484-8110\n온라인 예약도 가능합니다.\n"}]}',
    '<p>안녕하세요. 나란히 정신건강의학과가 새롭게 개원하였습니다.</p><p><strong>진료 시간</strong></p><p>월-금: 오전 9시 - 오후 6시<br>토요일: 오전 9시 - 오후 1시</p><p><strong>예약 문의</strong></p><p>전화: 02-6484-8110<br>온라인 예약도 가능합니다.</p>',
    '안녕하세요. 나란히 정신건강의학과가 새롭게 개원하였습니다. 진료 시간 월-금: 오전 9시 - 오후 6시 토요일: 오전 9시 - 오후 1시 예약 문의 전화: 02-6484-8110 온라인 예약도 가능합니다.',
    'published',
    NOW() - INTERVAL '1 day',
    (SELECT id FROM notice_categories WHERE name = 'general'),
    10,
    '나란히 정신건강의학과 개원 안내',
    '나란히 정신건강의학과가 새롭게 개원하였습니다. 진료시간 및 예약 문의 안내',
    ARRAY['개원', '진료시간', '예약']
  ),
  (
    '신규 놀이치료 프로그램 안내',
    '{"ops":[{"insert":"어린이를 위한 새로운 놀이치료 프로그램을 시작합니다.\n\n"},{"attributes":{"bold":true},"insert":"대상"},{"insert":"\n만 3세 - 12세 어린이\n\n"},{"attributes":{"bold":true},"insert":"치료 내용"},{"insert":"\n• 개별 놀이치료\n• 집단 놀이치료\n• 부모 상담\n\n상담 문의: 02-6484-8111\n"}]}',
    '<p>어린이를 위한 새로운 놀이치료 프로그램을 시작합니다.</p><p><strong>대상</strong></p><p>만 3세 - 12세 어린이</p><p><strong>치료 내용</strong></p><ul><li>개별 놀이치료</li><li>집단 놀이치료</li><li>부모 상담</li></ul><p>상담 문의: 02-6484-8111</p>',
    '어린이를 위한 새로운 놀이치료 프로그램을 시작합니다. 대상 만 3세 - 12세 어린이 치료 내용 개별 놀이치료 집단 놀이치료 부모 상담 상담 문의: 02-6484-8111',
    'published',
    NOW() - INTERVAL '2 hours',
    (SELECT id FROM notice_categories WHERE name = 'event'),
    5,
    '신규 놀이치료 프로그램 안내',
    '만 3세-12세 어린이를 위한 새로운 놀이치료 프로그램이 시작됩니다.',
    ARRAY['놀이치료', '어린이', '프로그램']
  )
ON CONFLICT DO NOTHING;