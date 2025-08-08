import ArrowLink from '@/components/links/ArrowLink';
import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main
      className={cn(
        'flex min-h-[calc(100vh-65px)] w-full flex-col items-center p-8 lg:justify-center'
      )}
    >
      <div className="flex flex-col" data-aos="fade-zoom-in">
        <p className="flex flex-wrap">
          이곳에서 우리 마음속의 온도는
          <br className="sm:hidden" /> 과연 몇 도쯤 되는 것일까?
          <br className="sm:hidden" /> 생각해 보았다.
        </p>
        <p>
          <br className="sm:hidden" />
        </p>
        <p className="flex flex-wrap">
          너무 뜨거워서
          <br className="sm:hidden" /> 다른 사람이 부담스러워하지도 않고
        </p>
        <p className="flex flex-wrap">
          너무 차가워서
          <br className="sm:hidden" /> 다른 사람이 상처받지도 않는 온도는
        </p>
        <p className="flex flex-wrap">
          &quot;따뜻한&quot;이라는 온도란
          <br className="sm:hidden" /> 생각이 든다.
        </p>
        <p>
          <br className="sm:hidden" />
        </p>
        <p className="flex flex-wrap">
          보이지 않아도 마음으로 느껴지고,
          <br className="sm:hidden" /> 마음에서 마음으로 전해질 수 있는
          <br className="sm:hidden" />
          따뜻함이기에
        </p>
        <p className="flex flex-wrap">사람들은 마음을 나누는 것 같다.</p>
        <p className="mt-4 font-sans italic text-gray-500 max-lg:text-sm">{`- 정여민 그림시집, 마음의 온도는 몇 도일까요?`}</p>
      </div>
      <div
        className="mt-32 flex justify-center gap-1 text-lg max-lg:mt-16"
        data-aos="fade-zoom-in"
        data-aos-delay="1000"
      >
        <p className="">나란히</p>
        <p
          className=""
          data-aos="fade-zoom-in"
          data-aos-delay="1000"
          data-aos-duration="2000"
        >
          정신건강의학과의원
        </p>
      </div>
      <div
        className="mt-4 flex gap-1 text-xl text-naranhiYellow"
        data-aos-duration="1500"
        data-aos-delay="1800"
        data-aos="fade-right"
      >
        <ArrowLink href="/contact-us" rel="noreferrer">
          <div
            className={buttonVariants({
              size: 'sm',
              variant: 'ghost',
            })}
          >
            예약 및 진료시간 안내
          </div>
        </ArrowLink>
      </div>
    </main>
  );
}
