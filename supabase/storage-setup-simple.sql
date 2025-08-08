-- 간단한 Storage 설정 (Supabase 대시보드에서 실행)
-- 이 SQL문은 권한 문제를 피해 필수 설정만 포함

-- 1단계: 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('editor-images', 'editor-images', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('facility-images', 'facility-images', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2단계: Storage 정책 생성
-- editor-images 버킷 정책
CREATE POLICY IF NOT EXISTS "editor-images 공개 읽기"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'editor-images');

CREATE POLICY IF NOT EXISTS "editor-images 인증된 사용자 업로드"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'editor-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY IF NOT EXISTS "editor-images 인증된 사용자 업데이트"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'editor-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY IF NOT EXISTS "editor-images 인증된 사용자 삭제"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'editor-images' 
    AND auth.role() = 'authenticated'
  );

-- facility-images 버킷 정책
CREATE POLICY IF NOT EXISTS "facility-images 공개 읽기"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'facility-images');

CREATE POLICY IF NOT EXISTS "facility-images 인증된 사용자 업로드"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'facility-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY IF NOT EXISTS "facility-images 인증된 사용자 업데이트"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'facility-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY IF NOT EXISTS "facility-images 인증된 사용자 삭제"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'facility-images' 
    AND auth.role() = 'authenticated'
  );

-- 설정 확인용 쿼리
SELECT 
  'Buckets Created' as status,
  id,
  name,
  public,
  file_size_limit
FROM storage.buckets 
WHERE id IN ('editor-images', 'facility-images');

SELECT 
  'Policies Created' as status,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%editor-images%' 
  OR policyname LIKE '%facility-images%';