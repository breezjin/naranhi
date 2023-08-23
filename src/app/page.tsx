import Image from 'next/image';

import ArrowLink from '@/components/links/ArrowLink';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main className='pt-52 flex w-full min-h-[calc(100vh-65px)] flex-col items-center'>
      <div className='flex flex-col naranhi-fade-in'>
        <div className='flex flex-wrap'>이곳에서 우리 마음속의 온도는 과연 몇 도쯤 되는 것일까? 생각해 보았다.</div>
        <div className='flex flex-wrap'>너무 뜨거워서 다른 사람이 부담스러워하지도 않고, 너무 차가워서 다른 사람이 상처받지도 않는 온도는</div>
        <div className='flex flex-wrap'>'따뜻한'이라는 온도란 생각이 든다.</div>
        <div className='flex flex-wrap'>보이지 않아도 마음으로 느껴지고, 마음에서 마음으로 전해질 수 있는 따뜻함이기에</div>
        <div className='flex flex-wrap'>사람들은 마음을 나누는 것 같다.</div>
        <div className='mt-4 font-sans italic text-gray-500 naranhi-fade-in duration-2000'>{`- 정여민 그림시집, 마음의 온도는 몇 도일까요?`}</div>
      </div>
      <div className='mt-32 flex gap-1 text-lg naranhi-fade-in delay-1000'>
        <div className=''>나란히</div>
        <div className='naranhi-fade-in delay-1000 duration-2000'>정신건강의학과의원</div>
      </div>
      <div className='mt-4 flex gap-1 text-xl naranhi-fade-in delay-2000'>
        <div className='text-naranhiYellow'>8월29일 부터</div>
        <div className='naranhi-fade-in delay-1000 duration-2000'>진료를 시작 합니다.</div>
      </div>
      <div className='flex flex-col' data-aos='fade-zoom-in'>
        <div className='flex flex-wrap'>이곳에서 우리 마음속의 온도는 과연 몇 도쯤 되는 것일까? 생각해 보았다.</div>
        <div className='flex flex-wrap'>너무 뜨거워서 다른 사람이 부담스러워하지도 않고, 너무 차가워서 다른 사람이 상처받지도 않는 온도는</div>
        <div className='flex flex-wrap'>'따뜻한'이라는 온도란 생각이 든다.</div>
        <div className='flex flex-wrap'>보이지 않아도 마음으로 느껴지고, 마음에서 마음으로 전해질 수 있는 따뜻함이기에</div>
        <div className='flex flex-wrap'>사람들은 마음을 나누는 것 같다.</div>
        <div className='mt-4 font-sans italic text-gray-500'>{`- 정여민 그림시집, 마음의 온도는 몇 도일까요?`}</div>
      </div>
      <div className='mt-32 flex gap-1 text-lg'>
        <div className=''>나란히</div>
        <div className=''>정신건강의학과의원</div>
      </div>
      <div className='mt-4 flex gap-1 text-xl'>
        <div className='text-naranhiYellow'>8월29일 부터</div>
        <div className=''>진료를 시작 합니다.</div>
      </div>
    </main>
  );
}
