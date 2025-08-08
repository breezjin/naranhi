# Supabase Storage 설정 가이드

이 문서는 Naranhi 프로젝트의 이미지 업로드 기능을 위한 Supabase Storage 설정 방법을 안내합니다.

## 🚀 자동 설정 (권장)

### 1. Supabase CLI로 마이그레이션 실행

```bash
# 로컬 Supabase 개발 환경에서 실행
supabase db reset

# 또는 특정 마이그레이션만 실행
supabase db push
```

### 2. 프로덕션에 배포

```bash
# 프로덕션 데이터베이스에 마이그레이션 적용
supabase db push --linked
```

## 🛠 수동 설정 (대안)

Supabase 대시보드에서 직접 설정하려면:

### 1. SQL Editor에서 실행

Supabase 대시보드 → **SQL Editor** → **New query**에서 다음 쿼리를 순서대로 실행:

#### 단계 1: 버킷 생성
```sql
-- 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('editor-images', 'editor-images', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('facility-images', 'facility-images', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
```

#### 단계 2: RLS 활성화
```sql
-- RLS 활성화
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

#### 단계 3: 정책 생성
```sql
-- EDITOR-IMAGES 정책
CREATE POLICY "editor-images 공개 읽기"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'editor-images');

CREATE POLICY "editor-images 인증된 사용자 업로드"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'editor-images' AND auth.role() = 'authenticated');

CREATE POLICY "editor-images 인증된 사용자 삭제"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'editor-images' AND auth.role() = 'authenticated');

-- FACILITY-IMAGES 정책
CREATE POLICY "facility-images 공개 읽기"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'facility-images');

CREATE POLICY "facility-images 인증된 사용자 업로드"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'facility-images' AND auth.role() = 'authenticated');

CREATE POLICY "facility-images 인증된 사용자 삭제"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'facility-images' AND auth.role() = 'authenticated');
```

### 2. 대시보드에서 확인

**Storage** → **Buckets**에서 버킷이 생성되었는지 확인:
- `editor-images` (10MB 제한)
- `facility-images` (50MB 제한)

**Storage** → **Policies**에서 정책이 생성되었는지 확인

## 🧪 설정 테스트

### 1. 개발 환경 테스트
```bash
yarn dev
```

### 2. 브라우저에서 테스트
1. `http://localhost:3000/admin/notices/create` 접속
2. 에디터에서 이미지 업로드 버튼 클릭
3. 이미지 파일 업로드 테스트

### 3. 문제 해결
업로드 실패 시 브라우저 개발자 도구 → **Network** 탭에서 다음 확인:
- `/api/admin/upload-image` 요청 상태
- Supabase Storage 요청 상태
- 오류 메시지

## 🔍 설정 상태 확인

### SQL로 정책 상태 확인
```sql
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;
```

### 버킷 상태 확인
```sql
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id IN ('editor-images', 'facility-images');
```

## 📁 프로젝트 구조

```
src/
├── lib/services/imageUploadService.ts     # 이미지 업로드 서비스
├── app/api/admin/upload-image/route.ts    # 업로드 API 엔드포인트
├── components/admin/
│   ├── ImageUploadDialog.tsx              # 이미지 업로드 다이얼로그
│   └── TiptapEditorEnhanced.tsx           # 이미지 기능이 통합된 에디터

supabase/
├── config.toml                            # 로컬 개발 환경 설정
└── migrations/
    ├── 20250108000001_create_initial_schema.sql
    └── 20250108000002_create_storage_policies.sql  # Storage 정책 설정
```

## 🔐 보안 고려사항

1. **파일 크기 제한**: 
   - editor-images: 10MB
   - facility-images: 50MB

2. **MIME 타입 제한**: 
   - 이미지 파일만 허용 (PNG, JPEG, WebP, GIF)

3. **인증 요구사항**: 
   - 업로드/삭제는 인증된 사용자만 가능
   - 읽기는 공개 접근 허용

4. **RLS 정책**: 
   - Row Level Security로 접근 제어
   - 버킷별 세분화된 권한 관리

설정 완료 후 이미지 업로드 기능이 정상적으로 작동합니다! 🎉