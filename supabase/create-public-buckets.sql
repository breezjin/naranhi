-- Supabase Dashboard → SQL Editor에서 실행
-- 퍼블릭 버킷 생성 및 설정

-- editor-images 버킷을 public으로 설정
INSERT INTO storage.buckets (id, name, public)
VALUES ('editor-images', 'editor-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- facility-images 버킷을 public으로 설정
INSERT INTO storage.buckets (id, name, public) 
VALUES ('facility-images', 'facility-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 생성된 버킷 확인
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id IN ('editor-images', 'facility-images');