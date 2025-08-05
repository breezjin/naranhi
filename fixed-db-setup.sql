-- 공지사항 시스템 데이터베이스 테이블 생성 (수정된 버전)
-- Manual Database Setup for Notices System (Fixed Version)

-- 1. Create notice_categories table
CREATE TABLE IF NOT EXISTS notice_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create or replace notices table with full schema (without search_vector for now)
DROP TABLE IF EXISTS notices CASCADE;
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE,
  
  -- Quill editor content storage
  content JSONB NOT NULL,
  html_content TEXT,
  plain_text TEXT,
  
  -- Publishing workflow
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  scheduled_publish_at TIMESTAMPTZ,
  
  -- Categorization and ordering
  category_id UUID REFERENCES notice_categories(id) ON DELETE SET NULL,
  priority INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  
  -- Engagement metrics
  view_count BIGINT DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  -- SEO and metadata
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  featured_image_url TEXT,
  tags TEXT[],
  
  -- Author and timestamps
  author_id UUID, -- Remove reference if admin_users table doesn't exist
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for performance (without search_vector)
CREATE INDEX IF NOT EXISTS idx_notices_status ON notices(status);
CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category_id);
CREATE INDEX IF NOT EXISTS idx_notices_published_at ON notices(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_priority ON notices(priority DESC, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_notices_tags ON notices USING GIN(tags);

-- 4. Create simple text search index using default configuration
CREATE INDEX IF NOT EXISTS idx_notices_title_search ON notices USING GIN(to_tsvector('simple', title));
CREATE INDEX IF NOT EXISTS idx_notices_content_search ON notices USING GIN(to_tsvector('simple', coalesce(plain_text, '')));

-- 5. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_notice_categories_updated_at ON notice_categories;
CREATE TRIGGER update_notice_categories_updated_at 
    BEFORE UPDATE ON notice_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notices_updated_at ON notices;
CREATE TRIGGER update_notices_updated_at 
    BEFORE UPDATE ON notices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert default notice categories
INSERT INTO notice_categories (name, display_name, description, color) VALUES
  ('general', '일반공지', '일반적인 병원 공지사항', '#3b82f6'),
  ('event', '이벤트', '특별 이벤트 및 프로모션', '#10b981'),
  ('medical', '진료안내', '진료 관련 중요 안내', '#f59e0b'),
  ('urgent', '긴급공지', '긴급하게 전달해야 할 내용', '#ef4444')
ON CONFLICT (name) DO NOTHING;

-- 8. Insert sample notices for testing
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
  ),
  (
    '테스트 공지사항',
    '{"ops":[{"insert":"이것은 테스트용 공지사항입니다.\n"}]}',
    '<p>이것은 테스트용 공지사항입니다.</p>',
    '이것은 테스트용 공지사항입니다.',
    'draft',
    NULL,
    (SELECT id FROM notice_categories WHERE name = 'general'),
    1,
    '테스트 공지사항',
    '테스트용 공지사항입니다.',
    ARRAY['테스트']
  )
ON CONFLICT DO NOTHING;

-- 9. Verify table creation
SELECT 'notice_categories' as table_name, count(*) as record_count FROM notice_categories
UNION ALL
SELECT 'notices' as table_name, count(*) as record_count FROM notices;