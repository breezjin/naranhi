# ⚡ Tiptap 에디터 문제 해결방안

## 1. 에디터 컴포넌트 진단
```bash
# 1. Tiptap 관련 파일 확인
ls -la src/components/admin/Tiptap*

# 2. 에디터 의존성 확인
yarn list @tiptap/react @tiptap/starter-kit
```

## 2. 클라이언트 사이드 렌더링 확보
```typescript
// TiptapEditorClient.tsx
'use client'
import dynamic from 'next/dynamic'

const TiptapEditor = dynamic(() => import('./TiptapEditorCore'), {
  ssr: false,
  loading: () => <div className="editor-loading">에디터 로딩 중...</div>
})

export default TiptapEditor
```

## 3. CSS 클래스 확인
```css
/* globals.css에 추가 */
.ProseMirror {
  outline: none;
  min-height: 200px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.ProseMirror:focus {
  border-color: #007cba;
  box-shadow: 0 0 0 2px rgba(0, 124, 186, 0.1);
}
```

## 4. 테스트 선택자 업데이트
```typescript
// 더 안정적인 선택자 사용
const editor = page.locator('[data-testid="tiptap-editor"], .tiptap-editor, .editor-content');
```