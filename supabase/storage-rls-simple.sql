-- 가장 간단한 Storage RLS 정책 생성
-- 하나씩 실행하세요

-- 1. editor-images 읽기 정책
CREATE POLICY "editor-images 공개 읽기"
ON storage.objects FOR SELECT
USING (bucket_id = 'editor-images');

-- 2. editor-images 업로드 정책
CREATE POLICY "editor-images 인증된 사용자 업로드"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'editor-images' AND auth.role() = 'authenticated');

-- 3. editor-images 삭제 정책
CREATE POLICY "editor-images 인증된 사용자 삭제"
ON storage.objects FOR DELETE
USING (bucket_id = 'editor-images' AND auth.role() = 'authenticated');

-- 4. facility-images 읽기 정책
CREATE POLICY "facility-images 공개 읽기"
ON storage.objects FOR SELECT
USING (bucket_id = 'facility-images');

-- 5. facility-images 업로드 정책
CREATE POLICY "facility-images 인증된 사용자 업로드"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'facility-images' AND auth.role() = 'authenticated');

-- 6. facility-images 삭제 정책
CREATE POLICY "facility-images 인증된 사용자 삭제"
ON storage.objects FOR DELETE
USING (bucket_id = 'facility-images' AND auth.role() = 'authenticated');

-- 정책 확인
SELECT policyname, cmd FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
AND (policyname LIKE '%editor-images%' OR policyname LIKE '%facility-images%');