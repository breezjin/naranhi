# Supabase Dashboard에서 수동으로 버킷 생성

## 단계별 가이드

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택: zdthxekwgqcsqryszavw

2. **Storage 메뉴 이동**
   - 좌측 사이드바에서 "Storage" 클릭

3. **새 버킷 생성**
   - "Create bucket" 또는 "New bucket" 버튼 클릭

4. **editor-images 버킷 설정**
   - Bucket name: `editor-images`
   - Public bucket: **✅ 체크** (중요!)
   - File size limit: `10MB`
   - Allowed MIME types: `image/png, image/jpeg, image/webp, image/gif`

5. **facility-images 버킷도 동일하게 생성**
   - Bucket name: `facility-images`
   - Public bucket: **✅ 체크**
   - File size limit: `10MB`
   - Allowed MIME types: `image/png, image/jpeg, image/webp, image/gif`

## 생성 후 확인

버킷 생성 후 다시 터미널에서 확인:
```bash
node test-supabase-connection.js
```

버킷이 정상적으로 생성되면 다음과 같이 표시됩니다:
```
✅ 버킷 목록: editor-images (public: true), facility-images (public: true)
```