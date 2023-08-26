import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

import { cn } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className='flex w-full flex-col items-center justify-center bg-black p-8 max-md:px-4'>
      <div className='mb-6 flex gap-4 text-sm text-slate-500'>
        <div>서비스이용약관</div>
        <div>|</div>
        <div>개인정보이용방침</div>
      </div>
      <div className={cn('flex w-full flex-col items-center justify-end text-xs')}>
        <div className='w-fit flex-col items-center justify-center'>
          <div className='gap-4 max-sm:flex max-sm:w-full'>
            <div className='flex w-full justify-start space-x-4 max-sm:flex-col max-sm:space-x-0'>
              <div className='flex w-36 min-w-fit'>
                <div className='min-w-fit text-gray-500'>상호</div>
                <div className='ml-2 min-w-fit text-gray-300'>나란히정신건강의학과</div>
              </div>
              <div className='flex'>
                <div className='min-w-fit text-gray-500'>대표</div>
                <div className='ml-2 min-w-fit text-gray-300'>김채리</div>
              </div>
              <div className='flex'>
                <div className='min-w-fit text-gray-500'>사업자등록번호</div>
                <div className='ml-2 min-w-fit text-gray-300'>{'656-95-01851'}</div>
              </div>
              <div className='flex'>
                <div className='min-w-fit text-gray-500'>전화번호</div>
                <div className='ml-2 min-w-fit text-gray-300'>02) 6484-8110</div>
              </div>
            </div>
            <div className='flex w-full justify-start space-x-4 max-sm:flex-col max-sm:space-x-0'>
              <div className='flex w-36 min-w-fit'>
                <div className='min-w-fit text-gray-500'>상호</div>
                <div className='ml-2 min-w-fit text-gray-300'>나란히심리발달센터</div>
              </div>
              <div className='flex'>
                <div className='min-w-fit text-gray-500'>대표</div>
                <div className='ml-2 min-w-fit text-gray-300'>김채영</div>
              </div>
              <div className='flex'>
                <div className='min-w-fit text-gray-500'>사업자등록번호</div>
                <div className='ml-2 min-w-fit text-gray-300'>{'157-31-01236'}</div>
              </div>
              <div className='flex'>
                <div className='min-w-fit text-gray-500'>전화번호</div>
                <div className='ml-2 min-w-fit text-gray-300'>02) 6484-8111</div>
              </div>
            </div>
          </div>
          <div className='flex max-sm:mt-4'>
            <div className='min-w-fit text-gray-500'>주소</div>
            <div className='ml-2 flex w-full gap-2 max-sm:flex-col max-sm:justify-center max-sm:gap-0'>
              <div className='flex min-w-fit text-gray-300 max-sm:ml-0'>
                서울특별시 동작구 현충로 75, 3층
              </div>
              <div className='flex min-w-fit text-gray-400 max-sm:ml-0'>
                (흑석동, 원불교100년기념관 및 역사문화기념관 2-1호)
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8 px-4 text-xs text-gray-400'>
        <div className='flex justify-center gap-2 max-sm:flex-col max-sm:gap-0'>
          <div className='max-sm:flex max-sm:w-full max-sm:justify-center'>
            Since 2023, Copyright ©{new Date().getFullYear()}
          </div>
          <div className='max-sm:flex max-sm:w-full max-sm:justify-center'>
            Naranhi Mental Health Clinic. All Right Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
