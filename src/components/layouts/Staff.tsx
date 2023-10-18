import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { cn } from '@/lib/utils';

interface ProfileProps {
  profileImage?: string;
  position: string;
  name: string;
  specialty?: string;
  educations?: string[];
  works?: string[];
  experiences?: string[];
}

export default function Staff({
  profileImage,
  position,
  name,
  specialty,
  educations,
  works,
  experiences,
}: ProfileProps) {
  return (
    <Card className={cn('flex p-8', 'max-xl:flex-col max-xl:p-4')} data-aos='fade-zoom-in'>
      {profileImage && (
        // <div className='relative mb-4 h-full w-full max-w-[500px]' data-aos='fade-right'>
        <div
          key={name}
          className={cn(
            'flex w-[50%] min-w-[200px] max-w-[500px]',
            'max-xl:mb-4 max-xl:w-full max-xl:max-w-[500px] max-xl:flex-col'
          )}
          data-aos='fade-right'
        >
          <Image
            src={profileImage}
            width='0'
            height='0'
            sizes='(min-width: 100px)'
            className='h-fit w-full'
            loading='lazy'
            alt={name}
          />
        </div>
      )}

      <div className='w-full' data-aos='fade-left'>
        <CardHeader className='pt-1'>
          <CardTitle>
            <span className='mr-2 text-sm text-gray-400'>{position}</span>
            {name}
          </CardTitle>
          {specialty && <CardDescription>{specialty}</CardDescription>}
        </CardHeader>
        {educations && (
          <CardContent className='space-y-1 text-sm'>
            {educations.map((edu, idx) => (
              <div key={idx}>{edu}</div>
            ))}
          </CardContent>
        )}
        {works && (
          <CardContent className='space-y-1 text-sm'>
            {works.map((work, idx) => (
              <div key={idx}>{work}</div>
            ))}
          </CardContent>
        )}
        {experiences && (
          <CardContent className='space-y-1 text-sm'>
            {experiences.map((experience, idx) => (
              <div key={idx}>{experience}</div>
            ))}
          </CardContent>
        )}
      </div>
    </Card>
  );
}
