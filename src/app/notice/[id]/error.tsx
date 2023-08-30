'use client';

import ButtonLink from '@/components/links/ButtonLink';

import { cn } from '@/lib/utils';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main
      className='flex min-h-[calc(100vh-65px)] w-full flex-col items-center gap-8 p-8 pt-16 max-xl:pt-8'
      data-aos='fade-zoon-in'
    >
      <section
        className={cn(
          'flex min-w-[500px] max-w-[40%] flex-col gap-4',
          'max-xl:min-w-full max-xl:max-w-full'
        )}
      >
        <div className='flex flex-col items-center justify-center'>
          <div className=''>없는 페이지이거나</div>
          <div className=''>네트워크 문제가 발생했습니다.</div>
        </div>
      </section>
      <section
        className={cn(
          'flex min-w-[500px] max-w-[40%] flex-col gap-4',
          'max-xl:min-w-full max-xl:max-w-full'
        )}
      >
        <div className='flex items-center justify-center text-sm text-gray-500'>
          <ButtonLink href='/notice' variant='outline'>
            공지사항 목록으로 &gt;
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
