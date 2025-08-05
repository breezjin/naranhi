'use client';

import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

import photos from './photos';

type Photo = {
  photoIndex: number;
  original?: string;
  src?: string;
  width?: number;
  height?: number;
  caption?: string;
  alt?: string;
};

export default function Facilities() {
  const [selectedImage, setSelectedImage] = React.useState<Photo | null>(null);

  const handleImageClick = (photo: Photo) => {
    setSelectedImage(photo);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const allPhotos = [...photos.hospitalPhotos, ...photos.centerPhotos];
  const currentIndex = selectedImage ? allPhotos.findIndex(p => p.photoIndex === selectedImage.photoIndex) : -1;
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(allPhotos[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allPhotos.length - 1) {
      setSelectedImage(allPhotos[currentIndex + 1]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  React.useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImage, currentIndex]);

  const PhotoGrid = ({ photos, title }: { photos: Photo[], title: string }) => (
    <div className={cn(
      'min-h-[calc(100vh-65px)] w-full lg:w-1/2',
      'p-3 sm:p-4 md:p-6 lg:p-4'
    )} data-aos='fade-zoom-in'>
      <div className={cn(
        'mb-4 sm:mb-6 text-xl sm:text-2xl lg:text-2xl font-bold',
        'text-naranhiYellow dark:text-naranhiGreen'
      )}>
        {title}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {photos.map((photo) => (
          <div
            key={photo.photoIndex}
            className={cn(
              'relative cursor-pointer overflow-hidden rounded-lg border shadow-md',
              'transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
              'aspect-[4/3] sm:aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3]'
            )}
            onClick={() => handleImageClick(photo)}
          >
            <Image
              src={photo.src || ''}
              alt={photo.alt || photo.caption || `사진 ${photo.photoIndex}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 50vw, 33vw"
            />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 text-xs font-medium text-white sm:p-2 sm:text-sm">
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <main className={cn('flex w-full flex-col lg:flex-row', 'min-h-[calc(100vh-65px)]')}>
        <PhotoGrid photos={photos.hospitalPhotos} title="병원 시설" />
        <PhotoGrid photos={photos.centerPhotos} title="센터 시설" />
        
        {allPhotos.length === 0 && (
          <div className='flex min-h-[calc(100vh-65px)] w-full items-center justify-center p-8'>
            <div className="text-center text-gray-500 dark:text-gray-400">
              나란히 내부시설 안내를 준비 중입니다.
            </div>
          </div>
        )}
      </main>

      {/* Enhanced Responsive Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 sm:p-4"
          onClick={handleClose}
        >
          <div className="relative flex max-h-full w-full max-w-7xl items-center justify-center">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className={cn(
                'absolute -top-2 -right-2 sm:-top-4 sm:-right-4 z-20',
                'bg-white hover:bg-gray-100 rounded-full',
                'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center',
                'text-black text-lg sm:text-xl font-bold transition-colors',
                'shadow-lg'
              )}
              aria-label="닫기"
            >
              ×
            </button>
            
            {/* Previous Button */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                className={cn(
                  'absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20',
                  'bg-black/50 hover:bg-black/70 rounded-full',
                  'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center',
                  'text-white text-xl sm:text-2xl transition-colors',
                  'backdrop-blur-sm'
                )}
                aria-label="이전 이미지"
              >
                ‹
              </button>
            )}
            
            {/* Next Button */}
            {currentIndex < allPhotos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className={cn(
                  'absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20',
                  'bg-black/50 hover:bg-black/70 rounded-full',
                  'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center',
                  'text-white text-xl sm:text-2xl transition-colors',
                  'backdrop-blur-sm'
                )}
                aria-label="다음 이미지"
              >
                ›
              </button>
            )}
            
            {/* Image Container */}
            <div className="relative flex h-full w-full items-center justify-center" onClick={e => e.stopPropagation()}>
              <Image
                src={selectedImage.original || selectedImage.src || ''}
                alt={selectedImage.alt || selectedImage.caption || `사진 ${selectedImage.photoIndex}`}
                width={1200}
                height={800}
                className={cn(
                  'max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain',
                  'rounded-lg shadow-2xl'
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                priority
              />
              
              {/* Caption */}
              {selectedImage.caption && (
                <div className={cn(
                  'absolute bottom-0 left-0 right-0',
                  'bg-gradient-to-t from-black/80 to-transparent',
                  'p-3 sm:p-4 text-white text-center rounded-b-lg'
                )}>
                  <p className="text-sm font-medium sm:text-base">
                    {selectedImage.caption}
                  </p>
                  <p className="mt-1 text-xs opacity-75 sm:text-sm">
                    {currentIndex + 1} / {allPhotos.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
