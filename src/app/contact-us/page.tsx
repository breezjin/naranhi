'use client'

import Image from 'next/image';
import Link from 'next/link';

import Icons from '@/components/Icons';
import KakaoMap from '@/components/KakaoMap';

export default function Home() {
  return (
    <main className='flex max-lg:flex-col-reverse w-full min-h-[calc(100vh-65px)] max-lg:min-h-fit items-center dark:bg-slate-600'>
      <div className='w-[75%] max-lg:w-full h-[calc(100vh-65px)] max-lg:h-[360px]'>
        <KakaoMap />
      </div>
      <div
        className='w-[25%] min-w-[560px] max-lg:w-full h-[calc(100vh-65px)] max-lg:h-fit bg-white dark:bg-slate-600 flex flex-col p-16 gap-12'
        data-aos='fade-left'
      >
        <div className='flex flex-col'>
          <div className='text-3xl text-naranhiGreen font-bold'>오시는 길</div>
          <div className='mt-4 text-xl text-naranhiYellow font-bold'>원불교100년기념관 3층</div>
          <div className=''>서울시 동작구 현충로 75</div>
          <div className='mt-4 '>지하철 9호선 흑석역 1번출구 바로 앞 입니다.</div>
          <div className=''>자동차로 내원 시 지하주차장 이용이 가능하며,</div>
          <div className=''>주차권은 데스크에서 발급을 도와드리고 있습니다.</div>
        </div>
        <div>
          <div className='text-3xl text-naranhiGreen font-bold'>예약문의</div>
          <div className='mt-4 text-xl text-naranhiYellow font-bold'>
            <Link href='tel:0264848110' className='flex items-center gap-4'>
              <Icons.phoneCall />
              02) 6484-8110
            </Link>
          </div>
          <div className='mt-4 '>예약하신 분을 우선으로 진료하며,</div>
          <div className=''>예약 없이 방문 시 대기시간이 길어질 수 있습니다.</div>
          <div className=''>방문하시기 전에 전화 주시면</div>
          <div className=''>안내와 예약을 도와드리겠습니다.</div>
        </div>
        <div>
          <div className='text-3xl text-naranhiGreen font-bold'>진료시간</div>
          <div className='mt-4 flex max-sm:flex-col gap-4 max-sm:gap-1 items-start'>
            <div className='text-lg font-bold w-24'>월, 화, 목, 금</div>
            <div>
              <div className='font-bold'>10:00 ~ 19:00 (오전 10시부터 저녁 7시 까지)</div>
              <div className='text-sm'>점심시간: 13:00 ~ 14:00</div>
            </div>
          </div>
          <div className='mt-4 flex max-sm:flex-col gap-4 max-sm:gap-1 items-start'>
            <div className='text-lg font-bold w-24'>수, 토</div>
            <div>
              <div className='font-bold'>10:00 ~ 14:00 (오전 10시부터 오후 2시 까지)</div>
              <div className='text-sm'>점심시간: 없음</div>
            </div>
          </div>
          <div className='mt-8 flex items-start flex-wrap text-sm'>
            <div className=''>일요일과 공휴일에는 휴진 합니다.</div>
            <div className=''>특정 진료일정에 대한 안내는 공지사항을 확인해 주세요.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
