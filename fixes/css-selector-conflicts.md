# 🎯 CSS 선택자 충돌 해결방안

## 1. 더 구체적인 선택자 사용
```typescript
// 수정 전 (너무 광범위)
const navigation = page.locator('nav, .nav, .sidebar, [role="navigation"]');

// 수정 후 (더 구체적)
const mainNavigation = page.locator('nav.main-nav, [data-testid="main-navigation"]');
const adminSidebar = page.locator('[data-testid="admin-sidebar"]');
```

## 2. first() 또는 nth() 사용
```typescript
const hasNavigation = await navigation.first().isVisible();
```

## 3. 테스트용 데이터 속성 추가
```tsx
// 컴포넌트에 test-id 추가
<nav data-testid="main-navigation" className="flex items-center gap-4">
<aside data-testid="admin-sidebar" className="sidebar">
```

## 4. 조건부 선택자
```typescript
const navigationElements = await page.locator('nav').count();
if (navigationElements > 1) {
  // 특정 네비게이션 선택
  const mainNav = page.locator('nav').first();
} else {
  const mainNav = page.locator('nav');
}
```