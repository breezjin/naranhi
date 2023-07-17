import Image from 'next/image';

import ArrowLink from '@/components/links/ArrowLink';
import UnderlineLink from '@/components/links/UnderlineLink';

export default function Home() {
  return (
    <main className='flex w-full min-h-screen flex-col items-center justify-center'>
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
        <ArrowLink href='https://blog.naver.com/naranhiclinic'>나란히 개원 이야기</ArrowLink>
        <ArrowLink href='https://roasted-beard-5ad.notion.site/cbf11c249d4040a09701ea1b4cf75a87?pvs=4'>채용공고</ArrowLink>
      </div>
      <div className=''>서울특별시 동작구 현충로 75, 3층 2-1호</div>
      <div className='text-xs'>원불교100년기념관 및 역사문화기념관</div>
    </main>
  );
}
