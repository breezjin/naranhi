# Supabase Storage 버킷별 정책 설정

## 방법 1: Storage 버킷에서 직접 정책 설정

1. **Supabase Dashboard → Storage**
   - 좌측 메뉴에서 "Storage" 클릭

2. **버킷 선택**
   - `editor-images` 버킷을 찾아서 클릭
   - 만약 버킷이 없다면 "Create bucket" 클릭

3. **버킷 설정**
   - 버킷 이름 옆의 ⚙️ 아이콘 클릭
   - 또는 버킷을 선택한 후 상단의 "Settings" 클릭

4. **Public Access 설정**
   - "Public bucket" 토글을 ON으로 설정
   - 이렇게 하면 RLS 없이도 파일에 접근 가능

## 방법 2: SQL Editor에서 버킷 생성 및 설정

Supabase Dashboard → SQL Editor에서 실행:

```sql
-- 버킷이 없다면 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('editor-images', 'editor-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('facility-images', 'facility-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;
```

## 방법 3: 환경변수 확인

현재 `.env` 파일의 키가 올바른지 확인:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`