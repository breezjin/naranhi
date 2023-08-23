import Image from 'next/image';

import ArrowLink from '@/components/links/ArrowLink';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main className='flex w-full min-h-screen flex-col items-center justify-center'>
      <div className='flex flex-col m-8'>
        <div className='flex flex-wrap'>이곳에서 우리 마음속의 온도는 과연 몇 도쯤 되는 것일까? 생각해 보았다.</div>
        <div className='flex flex-wrap'>너무 뜨거워서 다른 사람이 부담스러워하지도 않고, 너무 차가워서 다른 사람이 상처받지도 않는 온도는</div>
        <div className='flex flex-wrap'>'따뜻한'이라는 온도란 생각이 든다.</div>
        <div className='flex flex-wrap'>보이지 않아도 마음으로 느껴지고, 마음에서 마음으로 전해질 수 있는 따뜻함이기에</div>
        <div className='flex flex-wrap'>사람들은 마음을 나누는 것 같다.</div>
        <div className='mt-4 font-sans italic text-gray-500'>{`- 정여민 그림시집, 마음의 온도는 몇 도일까요?`}</div>
      </div>
      <div className='flex justify-center gap-2'>
        <div className='mt-1'>
          <Image src={'/naranhi.svg'} width={44} height={44} alt='나란히 로고' />
        </div>
        <div className='text-4xl mb-2 font-bold'>나란히</div>
      </div>
      <div className='text-2xl'>정신건강의학과의원</div>
      <div className='text-2xl'>& 심리발달센터</div>
      <div className='m-8 text-2xl text'><span className='text-yellow-600 font-semibold'>9월</span>에 오픈 합니다.</div>
      <div className='flex mb-8 gap-4 text-slate-500'>
        <ArrowLink href='https://blog.naver.com/naranhiclinic/223157652333'>나란히 개원 이야기</ArrowLink>
      </div>
      <div className=''>서울특별시 동작구 현충로 75, 3층 2-1호</div>
      <div className='text-xs'>원불교100년기념관 및 역사문화기념관</div>
    </main>
  );
}
