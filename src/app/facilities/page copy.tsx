/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { wrap } from 'popmotion';
import React from 'react';
import { useRef } from 'react';

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

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Facilities(className?: string) {
  const [[page, direction], setPage] = React.useState([0, 0]);

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  const imageIndex = wrap(0, photos.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={photos[imageIndex].src}
          custom={direction}
          variants={variants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag='x'
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>
      <div className={cn('next')} onClick={() => paginate(1)}>
        {'‣'}
      </div>
      <div className={cn('prev')} onClick={() => paginate(-1)}>
        {'‣'}
      </div>
    </>
  );
}
