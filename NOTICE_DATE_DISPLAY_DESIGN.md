# Notice Date Display Design Improvement

## Problem Statement
사용자가 공지사항 리스트에서 공지일이 표기되지 않아 불편함을 느끼고 있습니다. 현재 데이터베이스 마이그레이션이 완료되지 않아 `notice_date` 필드가 없어서, 다른 레이블("발행일", "작성일")로 표시되고 있어 일관성이 부족합니다.

## Design Goals
1. **일관성**: 모든 공지사항에서 "공지일"이라는 통일된 레이블 사용
2. **투명성**: 실제 날짜의 출처를 명확히 표시
3. **호환성**: 데이터베이스 마이그레이션 전후 모두 동작
4. **사용성**: 사용자가 날짜 정보를 쉽게 이해할 수 있도록 설계

## Solution Design

### 1. Unified Labeling Strategy
모든 공지사항에서 "공지일"이라는 레이블을 사용하되, 실제 데이터 출처를 작은 배지로 표시:

```tsx
공지일: 2025-01-08 [발행일 기준] 
```

### 2. Data Priority Logic
날짜 선택 우선순위:
1. `notice_date` (실제 공지일) - 우선순위 1
2. `published_at` (발행일) - 우선순위 2  
3. `created_at` (작성일) - 우선순위 3

### 3. Visual Design
```tsx
<div className="flex items-center gap-2">
  <Calendar className="h-4 w-4 text-primary" />
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-primary">
      공지일: {selectedDate}
    </span>
    {!notice.notice_date && (
      <span className="px-1.5 py-0.5 bg-muted/50 text-muted-foreground rounded text-[10px]">
        {sourceLabel}
      </span>
    )}
  </div>
</div>
```

### 4. Information Hierarchy
- **Primary**: "공지일" 레이블과 날짜 (Primary 색상으로 강조)
- **Secondary**: 데이터 출처 배지 ("발행일 기준", "작성일 기준")
- **Tertiary**: 추가 날짜 정보 (실제 공지일과 발행일이 다를 경우)

## Implementation Details

### Before (Inconsistent)
```tsx
{notice.notice_date ? (
  <span>공지일: {formatDate(notice.notice_date)}</span>
) : (
  <span>{notice.published_at ? "발행일" : "작성일"}: {date}</span>
)}
```

### After (Consistent)
```tsx
<span className="text-sm font-medium text-primary">
  공지일: {notice.notice_date || notice.published_at || notice.created_at}
</span>
{!notice.notice_date && (
  <span className="source-badge">
    {notice.published_at ? "발행일 기준" : "작성일 기준"}
  </span>
)}
```

## User Experience Benefits

### Before
- ❌ 일관성 없는 레이블 ("공지일", "발행일", "작성일")
- ❌ 사용자 혼란 (같은 의미의 날짜가 다른 레이블로 표시)
- ❌ 불투명한 날짜 출처

### After  
- ✅ 통일된 "공지일" 레이블
- ✅ 명확한 날짜 출처 표시
- ✅ 시각적 일관성
- ✅ 데이터베이스 마이그레이션과 무관하게 동작

## Technical Implementation

### 1. Date Selection Logic
```tsx
const getNoticeDate = (notice: Notice) => {
  return notice.notice_date || 
         (notice.status === 'published' ? notice.published_at : null) || 
         notice.created_at;
};

const getDateSource = (notice: Notice) => {
  if (notice.notice_date) return null;
  return notice.status === 'published' && notice.published_at 
    ? '발행일 기준' 
    : '작성일 기준';
};
```

### 2. Responsive Design
- 모바일에서도 배지가 적절히 표시되도록 반응형 설계
- 긴 텍스트 줄바꿈 방지
- 터치 친화적인 크기

### 3. Accessibility
- 스크린 리더를 위한 적절한 레이블
- 충분한 색상 대비
- 키보드 네비게이션 지원

## Migration Path

### Phase 1: Immediate (Current)
- 모든 공지사항에 "공지일" 레이블 사용
- 데이터 출처 배지 표시
- 기존 데이터 우선순위 로직 활용

### Phase 2: Post-Migration
- `notice_date` 필드 활성화
- 기존 공지사항의 `notice_date` 자동 설정
- 배지 표시 로직 최적화

## Success Metrics
- ✅ 모든 공지사항에서 "공지일" 레이블 표시
- ✅ 날짜 출처의 명확한 표시
- ✅ 사용자 혼란 감소
- ✅ 일관된 사용자 경험 제공

## Conclusion
이 설계는 데이터베이스 마이그레이션 상태와 관계없이 사용자에게 일관된 공지일 정보를 제공합니다. 투명성과 사용성을 모두 고려한 설계로, 즉시 적용 가능한 개선사항입니다.