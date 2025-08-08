-- Storage RLS 정책만 생성 (버킷은 이미 존재)
-- Supabase 대시보드 SQL Editor에서 실행

-- 기존 정책이 있다면 먼저 삭제 (선택사항)
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "editor-images 공개 읽기" ON storage.objects;
  DROP POLICY IF EXISTS "editor-images 인증된 사용자 업로드" ON storage.objects;
  DROP POLICY IF EXISTS "editor-images 인증된 사용자 업데이트" ON storage.objects;
  DROP POLICY IF EXISTS "editor-images 인증된 사용자 삭제" ON storage.objects;
  DROP POLICY IF EXISTS "facility-images 공개 읽기" ON storage.objects;
  DROP POLICY IF EXISTS "facility-images 인증된 사용자 업로드" ON storage.objects;
  DROP POLICY IF EXISTS "facility-images 인증된 사용자 업데이트" ON storage.objects;
  DROP POLICY IF EXISTS "facility-images 인증된 사용자 삭제" ON storage.objects;
EXCEPTION WHEN OTHERS THEN
  NULL; -- 정책이 없어도 에러 무시
END $$;

-- ======================================
-- EDITOR-IMAGES 버킷 RLS 정책
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
-- FACILITY-IMAGES 버킷 RLS 정책
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
-- 정책 생성 확인
-- ======================================

-- 생성된 정책 확인
SELECT 
  policyname as "정책명",
  cmd as "작업",
  roles as "대상역할",
  CASE 
    WHEN policyname LIKE '%editor-images%' THEN 'editor-images'
    WHEN policyname LIKE '%facility-images%' THEN 'facility-images'
    ELSE 'other'
  END as "버킷"
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND (policyname LIKE '%editor-images%' OR policyname LIKE '%facility-images%')
ORDER BY "버킷", cmd;