'use client'

import { count } from 'console';
import { TagCloud } from 'react-tagcloud';

const randomNumber = () => {
  return Math.random() * 10
}

const adultClinics = [
  { value: '불안', count: randomNumber() },
  { value: '공황장애', count: randomNumber() },
  { value: '강박증', count: randomNumber() },
  { value: 'ADHD', count: randomNumber() },
  { value: '우울증', count: randomNumber() },
  { value: '조울증', count: randomNumber() },
  { value: '화병', count: randomNumber() },
  { value: '만성피로', count: randomNumber() },
  { value: '스트레스', count: randomNumber() },
  { value: '불면', count: randomNumber() },
  { value: '수면장애 ', count: randomNumber() },
  { value: '식이장애', count: randomNumber() },
  { value: '폭식증', count: randomNumber() },
  { value: '알코올 및 약물 의존 ', count: randomNumber() },
  { value: '기억력 저하', count: randomNumber() },
  { value: '치매', count: randomNumber() },
  { value: '조현병 및 정신증', count: randomNumber() },
  { value: '부부상담', count: randomNumber() },
  { value: '연인문제 ', count: randomNumber() },
  { value: '개인심리상담', count: randomNumber() },
  { value: '가족상담', count: randomNumber() },
  { value: '정신분석', count: randomNumber() },
  { value: '인지행동치료', count: randomNumber() },
]

const childrenAdolescentsClinics = [
  { value: 'ADHD', count: randomNumber() },
  { value: '학습문제', count: randomNumber() },
  { value: '틱', count: randomNumber() },
  { value: '불안', count: randomNumber() },
  { value: '우울', count: randomNumber() },
  { value: '정서-행동문제', count: randomNumber() },
  { value: '아스퍼거 및 발달장애 ', count: randomNumber() },
  { value: '애착문제', count: randomNumber() },
  { value: '부모-자녀 관계 갈등 ', count: randomNumber() },
  { value: '학교 부적응', count: randomNumber() },
  { value: '언어치료', count: randomNumber() },
  { value: '놀이치료', count: randomNumber() },
  { value: '인지치료', count: randomNumber() },
  { value: '청소년상담', count: randomNumber() },
  { value: '인지행동치료', count: randomNumber() },
]

const customRenderer = (adultClinics: any, size: number, color: any) => (
  <span
    key={adultClinics.value}
    style={{
      animation: 'blinker 5s linear infinite',
      animationDelay: `${Math.random() * 2}s`,
      fontSize: `${size / 2}em`,
      // border: `2px solid ${color}`,
      margin: '3px',
      padding: '3px',
      display: 'inline-block',
      color: color,
    }}
  >
    {adultClinics.value}
  </span>
)

export default function HospitalProgram() {
  return (
    <main className='pt-52 max-lg:p-16 flex max-lg:flex-col w-full min-h-[calc(100vh-65px)] justify-center max-lg:items-center gap-8 max-lg:gap-32' data-aos='fade-zoom-in'>
      <div className='pr-28 w-[45%] max-lg:w-full max-w-full min-w-[360px]'>
        <div className='mb-8 text-2xl text-naranhiGreen font-bold'>성인클리닉</div>
        <TagCloud
          minSize={3}
          maxSize={7}
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
      <div className='pr-28 w-[45%] max-lg:w-full max-w-full min-w-[360px]'>
        <div className='mb-8 text-2xl text-naranhiYellow font-bold'>소아청소년클리닉</div>
        <TagCloud
          minSize={3}
          maxSize={7}
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
