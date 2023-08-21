import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex w-full min-h-screen flex-col items-center justify-center p-24'>
      <div>우리가 오랫동안 가장 귀중히 여기는 선물들은 보통 작고 소박한 것들이다.</div>
      <div>가장 중요해 보이는 것들은 어려울 때나 편안할 때 우리 가장 가까이에 있는 사람들에게 우리가</div>
      <div>그들의 요구, 그들의 즐거움, 그리고 그들의 도전에 귀를 기울이고 있다는 사실을 보여주는 것이다.</div>
      <div className='mt-4 font-sans italic text-gray-500'>- Fred Rogers, The World According to Mr. Rogers</div>
      <div className='mt-16 text-lg text-primary'>나란히 정신건강의학과의원.</div>
      <div className='text-lg text-primary'>당신과 나란히 걸어 갑니다.</div>
      {/* <div className='mt-8 text-lg text-primary'>나란한 발걸음으로 함께 걷고자 합니다.</div> */}
    </main>
  );
}
