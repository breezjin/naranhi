'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className='flex size-full items-center justify-center'>
        <h2>알 수 없는 문제가 발생했습니다.</h2>
        <button onClick={() => reset()}>다시 시도해 주세요.</button>
        {/* <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button> */}
      </body>
    </html>
  );
}
