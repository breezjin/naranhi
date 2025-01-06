'use client';

import Image from 'next/image';

import { Tabs } from '@/components/ui/animatedTabs';

import programList from '@/app/about-center/programs';
import { cn } from '@/lib/utils';

export default function Programs() {
  return (
    <main
      className={cn(
        'min-h-[calc(100vh-65px)] w-full p-8',
        'flex flex-col flex-wrap gap-8',
        'max-lg:flex-col'
      )}
    >
      <div
        className={cn(
          'relative mx-auto mt-12 flex h-fit w-full max-w-5xl flex-col items-start justify-start [perspective:1000px]',
          'max-lg:mt-4 md:h-[40rem]'
        )}
      >
        <Tabs tabs={programList} />
      </div>
    </main>
  );
}

const DummyContent = () => {
  return (
    <Image
      src='/linear.webp'
      alt='dummy image'
      width='1000'
      height='1000'
      className='absolute inset-x-0 -bottom-10  mx-auto h-3/5 w-[90%] rounded-xl object-cover object-left-top md:h-[90%]'
    />
  );
};
