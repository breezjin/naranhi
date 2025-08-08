-- 가장 간단한 RLS 설정 (테스트용)
-- Supabase 대시보드 SQL Editor에서 실행

-- 1. RLS 비활성화 (개발 테스트용)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 2. 또는 모든 사용자에게 권한 부여 (개발 테스트용)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "모든 사용자 읽기 허용"
--   ON storage.objects FOR SELECT
--   USING (true);
-- 
-- CREATE POLICY "모든 사용자 업로드 허용"
--   ON storage.objects FOR INSERT
--   WITH CHECK (true);
-- 
-- CREATE POLICY "모든 사용자 삭제 허용"
--   ON storage.objects FOR DELETE
--   USING (true);

-- 테스트 완료 후에는 다시 적절한 RLS 정책을 설정해주세요.