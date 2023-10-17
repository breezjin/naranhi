import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
    <Card className='flex p-8' data-aos='fade-zoom-in'>
      {profileImage && (
        <div className='relative mb-4 h-96 w-96' data-aos='fade-right'>
          <Image src={profileImage} layout='fill' alt={name} />
        </div>
      )}

      <div data-aos='fade-left'>
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
