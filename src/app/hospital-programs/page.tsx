'use client'

import { TagCloud } from 'react-tagcloud';

const data = [
  { value: 'JavaScript', count: 38 },
  { value: 'React', count: 30 },
  { value: 'Nodejs', count: 28 },
  { value: 'Express.js', count: 25 },
  { value: 'HTML5', count: 33 },
  { value: 'MongoDB', count: 18 },
  { value: 'CSS3', count: 20 },
]

export default function HospitalProgram() {
  return (
    <main className='pt-52 flex w-full min-h-[calc(100vh-65px)] flex-col items-center'>
      <div>병원 프로그램</div>
      <TagCloud
        minSize={12}
        maxSize={35}
        tags={data}
      />
    </main>
  );
}
