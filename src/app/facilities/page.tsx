'use client';

import Image from 'next/image';
import React from 'react';
import { Gallery } from 'react-grid-gallery';
import Lightbox from 'react-image-lightbox';

import 'react-image-lightbox/style.css';

import { cn } from '@/lib/utils';

import { photos } from './photos';

interface Photo {
  photoIndex: number;
  original?: string;
  src?: string;
  width?: number;
  height?: number;
  caption?: string;
  alt?: string;
}

export default function Facilities() {
  const [index, setIndex] = React.useState(-1);

  const allPhotos = [...photos.hospitalPhotos, ...photos.centerPhotos];

  const currentImage = allPhotos[index];
  const nextIndex = (index + 1) % allPhotos.length;
  const nextImage = allPhotos[nextIndex] || currentImage;
  const prevIndex = (index + allPhotos.length - 1) % allPhotos.length;
  const prevImage = allPhotos[prevIndex] || currentImage;

  const handleClick = (index: number, item: Photo) => setIndex(item.photoIndex);
  const handleClose = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  return (
    <div className={cn('flex w-full', 'max-md:flex-col')}>
      <div
        className={cn('min-h-[calc(100vh-65px)] w-1/2 p-4', 'max-md:w-full')}
        data-aos='fade-zoon-in'
      >
        <div className={cn('text-naranhiYellow dark:text-naranhiGreen my-4 text-2xl')}>
          병원 시설
        </div>
        {photos.hospitalPhotos.length > 0 && (
          <Gallery
            images={photos.hospitalPhotos}
            onClick={handleClick}
            enableImageSelection={false}
            rowHeight={400}
            margin={4}
          />
        )}
      </div>
      <div
        className={cn('min-h-[calc(100vh-65px)] w-1/2 p-4', 'max-md:w-full')}
        data-aos='fade-zoon-in'
      >
        <div className='text-naranhiYellow dark:text-naranhiGreen my-4 text-2xl'>센터 시설</div>
        {photos.centerPhotos.length > 0 && (
          <Gallery
            images={photos.centerPhotos}
            onClick={handleClick}
            enableImageSelection={false}
            rowHeight={400}
            margin={4}
          />
        )}
      </div>
      {allPhotos.length > 0 && !!currentImage && (
        <Lightbox
          mainSrc={currentImage.original}
          imageTitle={currentImage.caption}
          mainSrcThumbnail={currentImage.src}
          nextSrc={nextImage.original}
          nextSrcThumbnail={nextImage.src}
          prevSrc={prevImage.original}
          prevSrcThumbnail={prevImage.src}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
        />
      )}
      {allPhotos.length === 0 && (
        <div className='flex min-h-[calc(100vh-65px)] w-full items-center justify-center'>
          나란히 내부시설 안내를 준비 중입니다.
        </div>
      )}
    </div>
  );
}
