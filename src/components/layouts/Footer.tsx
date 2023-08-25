import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

export default function Footer() {
  return (
    <footer className='w-full min-w-[360px] flex flex-col items-center justify-center bg-black p-8'>
      <div className='flex gap-4 mb-6 text-slate-500'>
        <div>서비스이용약관</div>
        <div>|</div>
        <div>개인정보이용방침</div>
      </div>
      <div className='flex flex-col max-md:gap-4 text-sm'>
        <div className='flex md:flex-col w-full'>
          <div className='flex max-md:flex-col max-md:w-full'>
            <div className='flex w-52'>
              <div className='text-gray-500'>상호</div>
              <div className='text-gray-300 ml-2'>나란히정신건강의학과</div>
            </div>
            <div className='flex'>
              <div className='text-gray-500'>대표</div>
              <div className='text-gray-300 ml-2'>김채리</div>
            </div>
            <div className='flex'>
              <div className='text-gray-500'>사업자등록번호</div>
              <div className='text-gray-300 ml-2'>656-95-01851</div>
            </div>
            <div className='flex'>
              <div className='text-gray-500'>전화번호</div>
              <div className='text-gray-300 ml-2'>02) 6484-8110</div>
            </div>
          </div>
          <div className='flex max-md:flex-col max-md:w-full'>
            <div className='flex w-52'>
              <div className='text-gray-500'>상호</div>
              <div className='text-gray-300 ml-2'>(부설) 나란히 심리발달센터</div>
            </div>
            <div className='flex'>
              <div className='text-gray-500'>대표</div>
              <div className='text-gray-300 ml-2'>김채영</div>
            </div>
            <div className='flex'>
              <div className='text-gray-500'>사업자등록번호</div>
              <div className='text-gray-300 ml-2'>157-31-01236</div>
            </div>
            <div className='flex'>
              <div className='text-gray-500'>전화번호</div>
              <div className='text-gray-300 ml-2'>02) 6484-8111</div>
            </div>
          </div>
        </div>
        <div className='flex'>
          <div className='text-gray-500'>주소</div>
          <div className='flex max-md:flex-col'>
            <div className='text-gray-300 ml-2 flex flex-wrap'>서울특별시 동작구 현충로 75, 3층</div>
            <div className='text-gray-400 ml-2 flex flex-wrap'>(흑석동, 원불교100년기념관 및 역사문화기념관 2-1호)</div>
          </div>
        </div>
      </div>
      <div className='mt-8 px-4 text-xs text-gray-400'>
        <div className='flex max-sm:flex-col gap-2 max-sm:gap-0 justify-center'>
          <div className='max-sm:w-full max-sm:flex max-sm:justify-center'>Since 2023, Copyright ©{new Date().getFullYear()}</div>
          <div className='max-sm:w-full max-sm:flex max-sm:justify-center'>Naranhi Mental Health Clinic. All Right Reserved.</div>
        </div>
      </div>
    </footer>
  );
}
