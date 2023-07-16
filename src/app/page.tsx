import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex w-full min-h-screen flex-col items-center justify-center p-24'>
      <div className='text-3xl'>나란히</div>
      <div className='text-3xl'>정신건강의학과의원</div>
      <div className='text-3xl'>& 심리발달센터</div>
      <div className='m-12 text-3xl'><span className='text-yellow-600'>9월</span>에 오픈 합니다.</div>
      <div className=''>서울특별시 동작구 현충로 75, 3층 2-1호</div>
      <div className=''>원불교100년기념관 및 역사문화기념관</div>
      
    </main>
  );
}
