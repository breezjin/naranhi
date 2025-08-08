# Supabase Dashboard에서 RLS 설정 방법

## 방법 1: Storage 설정에서 직접 설정

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **Storage → Settings 이동**
   - 좌측 메뉴에서 "Storage" 클릭
   - 상단 "Settings" 탭 클릭

3. **RLS 정책 관리**
   - "RLS Policies" 섹션에서 정책 추가
   - 또는 "Disable RLS" 체크박스로 개발 중 RLS 비활성화

## 방법 2: Authentication에서 설정

1. **Authentication → Policies 이동**
   - 좌측 메뉴에서 "Authentication" 클릭
   - "Policies" 탭 클릭

2. **storage.objects 테이블 찾기**
   - 테이블 목록에서 "storage.objects" 선택

3. **새 정책 추가**
   - "New Policy" 버튼 클릭
   - Policy name: "Allow all for editor-images"
   - Allowed operations: SELECT, INSERT, DELETE 체크
   - Policy definition: `bucket_id = 'editor-images'`

## 방법 3: 임시로 Service Role Key 사용

현재 `.env` 파일에 `SUPABASE_SERVICE_ROLE_KEY`가 있으므로, 서버사이드에서는 이미 충분한 권한을 가지고 있습니다.

## 추천: 개발 단계에서는 RLS 비활성화

개발 및 테스트 단계에서는:
1. Storage → Settings → "Disable RLS for development" 체크
2. 테스트 완료 후 다시 활성화하고 적절한 정책 설정