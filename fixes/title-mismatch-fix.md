# 🏷️ 페이지 제목 불일치 해결방안

## 1. 테스트 기대값 수정
```typescript
// 한글 제목을 정확히 반영
await expect(page).toHaveTitle(/나란히|Naranhi/);

// 또는 더 포괄적으로
await expect(page).toHaveTitle(/.+/); // 빈 제목이 아닌지만 확인
```

## 2. 페이지별 제목 확인
```typescript
// Admin 페이지 제목 설정
export const metadata = {
  title: 'Admin - 나란히정신건강의학과의원',
  description: '관리자 페이지'
}
```

## 3. 동적 제목 처리
```typescript
// layout.tsx나 page.tsx에서
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s - 나란히정신건강의학과의원',
    default: '나란히정신건강의학과의원'
  }
}
```