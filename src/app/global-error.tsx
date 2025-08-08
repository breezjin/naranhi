'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Global Error:', error);
    
    // Set document title for better debugging
    if (typeof window !== 'undefined') {
      document.title = '오류 발생 - 나란히정신건강의학과의원';
    }
  }, [error]);

  return (
    <html lang="ko">
      <head>
        <title>오류 발생 - 나란히정신건강의학과의원</title>
      </head>
      <body className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto max-w-md rounded-lg border bg-card p-6 text-center shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-destructive">
            알 수 없는 문제가 발생했습니다
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            페이지를 불러오는 중 오류가 발생했습니다. 
            잠시 후 다시 시도해주세요.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm font-medium">
                개발자 정보
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
          <button 
            onClick={() => reset()}
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
