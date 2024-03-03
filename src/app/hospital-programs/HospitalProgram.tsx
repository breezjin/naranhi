'use client';
import Image from 'next/image';
import { TagCloud } from 'react-tagcloud';

import { cn } from '@/lib/utils';

import { adultClinics, childrenAdolescentsClinics, customRenderer } from './page';

export default function HospitalProgram() {
  return (
    <main
      className={cn(
        'min-h-[calc(100vh-65px)] w-full p-12',
        'flex justify-center space-x-16',
        'max-lg:flex-col max-lg:space-x-0 max-lg:space-y-24'
      )}
    >
      <div className='flex flex-col space-y-4 max-lg:w-full lg:max-w-[650px]'>
        <div className='flex space-x-2 max-lg:justify-center'>
          <Image
            src={'/imgs/naranhi-person-green.png'}
            width={22}
            height={15}
            alt='나란히 초록사람'
          />
          <div className='text-2xl font-bold text-naranhiGreen'>성인클리닉</div>
        </div>
        <TagCloud
          className='w-full'
          minSize={2}
          maxSize={5}
          tags={adultClinics}
          renderer={customRenderer}
          // colorOptions={{
          //   luminosity: 'random',
          //   hue: 'random'
          // }}
          data-aos='fade-zoom-in'
          data-aos-duration='2000'
        />
      </div>
      <div className='flex flex-col space-y-4 max-lg:w-full lg:max-w-[650px]'>
        <div className='flex space-x-2 max-lg:justify-center'>
          <Image
            src={'/imgs/naranhi-person-yellow.png'}
            width={22}
            height={15}
            alt='나란히 초록사람'
          />
          <div className='text-2xl font-bold text-naranhiYellow'>소아청소년클리닉</div>
        </div>
        <TagCloud
          className='w-full'
          minSize={2}
          maxSize={5}
          tags={childrenAdolescentsClinics}
          renderer={customRenderer}
          // colorOptions={{
          //   luminosity: 'random',
          //   hue: 'random'
          // }}
          data-aos='fade-zoom-in'
          data-aos-duration='2000'
        />
      </div>
    </main>
  );
}
