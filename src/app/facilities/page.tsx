'use client';

import Image from 'next/image';
import React from 'react';
import { Gallery } from 'react-grid-gallery';
import Lightbox from 'react-image-lightbox';

import 'react-image-lightbox/style.css';

import { photos } from './photos';

interface Photo {
  original?: string;
  src?: string;
  width?: number;
  height?: number;
  caption?: string;
  alt?: string;
}

export default function Facilities() {
  const [index, setIndex] = React.useState(-1);

  const currentImage = photos[index];
  const nextIndex = (index + 1) % photos.length;
  const nextImage = photos[nextIndex] || currentImage;
  const prevIndex = (index + photos.length - 1) % photos.length;
  const prevImage = photos[prevIndex] || currentImage;

  const handleClick = (index: number, item: Photo) => setIndex(index);
  const handleClose = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  return (
    <div className='min-h-[calc(100vh-65px)] p-4' data-aos='fade-zoon-in'>
      {photos.length > 0 && (
        <Gallery
          images={photos}
          onClick={handleClick}
          enableImageSelection={false}
          rowHeight={400}
          margin={4}
        />
      )}
      {photos.length === 0 && (
        <div className='flex min-h-[calc(100vh-65px)] w-full items-center justify-center'>
          나란히 내부시설 안내를 준비 중입니다.
        </div>
      )}
      {photos.length > 0 && !!currentImage && (
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
    </div>
  );
}
