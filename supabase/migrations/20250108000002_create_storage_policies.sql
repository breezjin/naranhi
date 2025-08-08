-- Create Storage Policies for Image Upload
-- This migration creates RLS policies for storage buckets

-- Insert storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('editor-images', 'editor-images', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('facility-images', 'facility-images', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Note: RLS is already enabled on storage.objects by default in Supabase
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ======================================
-- EDITOR-IMAGES 버킷 정책
-- ======================================

-- 읽기 정책: 모든 사용자가 editor-images 버킷의 파일을 읽을 수 있음
CREATE POLICY "editor-images 공개 읽기"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'editor-images');

-- 업로드 정책: 인증된 사용자만 editor-images 버킷에 파일 업로드 가능
CREATE POLICY "editor-images 인증된 사용자 업로드"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'editor-images' 
    AND auth.role() = 'authenticated'
  );

-- 업데이트 정책: 인증된 사용자만 editor-images 버킷의 파일 업데이트 가능
CREATE POLICY "editor-images 인증된 사용자 업데이트"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'editor-images' 
    AND auth.role() = 'authenticated'
  );

-- 삭제 정책: 인증된 사용자만 editor-images 버킷의 파일 삭제 가능
CREATE POLICY "editor-images 인증된 사용자 삭제"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'editor-images' 
    AND auth.role() = 'authenticated'
  );

-- ======================================
-- FACILITY-IMAGES 버킷 정책
-- ======================================

-- 읽기 정책: 모든 사용자가 facility-images 버킷의 파일을 읽을 수 있음
CREATE POLICY "facility-images 공개 읽기"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'facility-images');

-- 업로드 정책: 인증된 사용자만 facility-images 버킷에 파일 업로드 가능
CREATE POLICY "facility-images 인증된 사용자 업로드"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'facility-images' 
    AND auth.role() = 'authenticated'
  );

-- 업데이트 정책: 인증된 사용자만 facility-images 버킷의 파일 업데이트 가능
CREATE POLICY "facility-images 인증된 사용자 업데이트"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'facility-images' 
    AND auth.role() = 'authenticated'
  );

-- 삭제 정책: 인증된 사용자만 facility-images 버킷의 파일 삭제 가능
CREATE POLICY "facility-images 인증된 사용자 삭제"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'facility-images' 
    AND auth.role() = 'authenticated'
  );

-- ======================================
-- 추가 보안 정책 (선택사항)
-- ======================================

-- 파일 크기 제한을 위한 함수 (선택사항)
CREATE OR REPLACE FUNCTION check_file_size()
RETURNS TRIGGER AS $$
BEGIN
  -- editor-images: 10MB 제한
  IF NEW.bucket_id = 'editor-images' AND NEW.metadata->>'size' IS NOT NULL THEN
    IF (NEW.metadata->>'size')::bigint > 10485760 THEN
      RAISE EXCEPTION 'File size exceeds 10MB limit for editor-images bucket';
    END IF;
  END IF;
  
  -- facility-images: 50MB 제한  
  IF NEW.bucket_id = 'facility-images' AND NEW.metadata->>'size' IS NOT NULL THEN
    IF (NEW.metadata->>'size')::bigint > 52428800 THEN
      RAISE EXCEPTION 'File size exceeds 50MB limit for facility-images bucket';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성 (선택사항)
DROP TRIGGER IF EXISTS check_file_size_trigger ON storage.objects;
CREATE TRIGGER check_file_size_trigger
  BEFORE INSERT OR UPDATE ON storage.objects
  FOR EACH ROW EXECUTE FUNCTION check_file_size();

-- 정책 상태 확인용 뷰 (선택사항)
CREATE OR REPLACE VIEW storage_policies_status AS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;