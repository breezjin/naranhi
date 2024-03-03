'use client';

import Image from 'next/image';
import React from 'react';
import SwiperCore from 'swiper';
import {
  A11y,
  EffectCards,
  EffectCoverflow,
  EffectFade,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
// import 'swiper/css/scrollbar';
import 'swiper/css/pagination';

// import 'swiper/css/effect-cards';
// import 'react-image-lightbox/style.css';
import { cn } from '@/lib/utils';

import { photos } from './photos';

interface Photo {
  original?: string;
  src: string;
  width?: number;
  height?: number;
  caption?: string;
  alt: string;
}

export default function Facilities() {
  SwiperCore.use([EffectCoverflow, Navigation, Mousewheel, Keyboard]);
  return (
    <main
      className={cn(
        'flex min-h-[calc(100vh-65px)] w-full min-w-fit justify-center gap-8 p-8 pt-12',
        'max-lg:flex-col-reverse max-lg:items-center max-lg:justify-end'
      )}
    >
      <Swiper
        cssMode
        navigation
        pagination
        mousewheel
        keyboard
        modules={[EffectCoverflow, Navigation, Mousewheel, Keyboard]}
        effect='coverflow'
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        // className={cn('mySwiper')}
      >
        {photos.map((photo: Photo, idx) => (
          <>
            <SwiperSlide key={idx}>
              <div className='relative h-full w-full'>
                <Image
                  src={photo.src}
                  width={700}
                  height={475}
                  sizes='80vw'
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  alt={photo.alt}
                />
              </div>
            </SwiperSlide>
          </>
        ))}
      </Swiper>
    </main>
  );
}
