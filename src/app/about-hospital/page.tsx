import Staff from '@/components/layouts/Staff';
import ArrowLink from '@/components/links/ArrowLink';
import { Button, buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { medicalStaffs, treatmentStaffs } from '@/app/about-hospital/staffs';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main
      className={cn(
        'flex min-h-[calc(100vh-65px)] w-full justify-center gap-8 p-8',
        'max-lg:flex-col-reverse max-lg:items-center max-lg:justify-end'
      )}
    >
      <div className='w-[40%] p-16 max-lg:w-full max-lg:p-8'>
        <div className='flex flex-col' data-aos='fade-zoom-in'>
          <div className='flex flex-wrap'>
            우리가 오랫동안 가장 귀중히 여기는 선물들은 보통 작고 소박한 것들이다.
          </div>
          <div className='flex flex-wrap'>
            가장 중요해 보이는 것들은 어려울 때나 편안할 때 우리 가장 가까이에 있는 사람들에게
            우리가
          </div>
          <div className='flex flex-wrap'>
            그들의 요구, 그들의 즐거움, 그리고 그들의 도전에 귀를 기울이고 있다는 사실을 보여주는
            것이다.
          </div>
          <div
            className='mt-4 font-sans italic text-gray-500'
            data-aos='fade-zoom-in'
            data-aos-duration='2000'
          >
            - Fred Rogers, The World According to Mr. Rogers
          </div>
          <div className='ml-2 mt-16 flex gap-1 text-lg' data-aos='fade-zoom-in'>
            <div className=''>나란히</div>
            <div className='' data-aos='fade-zoom-in' data-aos-delay='500'>
              정신건강의학과의원
            </div>
          </div>
          <div
            className='ml-2 mt-1 flex gap-1 text-xl'
            data-aos='fade-zoom-in'
            data-aos-delay='1000'
          >
            <div className=''>
              당신과 <span className='text-naranhiGreen'>나란히</span>
            </div>
            <div
              className=''
              data-aos='fade-zoom-in'
              data-aos-delay='1500'
              data-aos-duration='1500'
            >
              걸어 갑니다.
            </div>
          </div>
          <div className='mt-4 text-naranhiYellow' data-aos='fade-right' data-aos-delay='1000'>
            <ArrowLink href='/contact-us' rel='noreferrer'>
              <div
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                })}
              >
                예약 및 진료시간 안내
              </div>
            </ArrowLink>
          </div>
        </div>
      </div>
      <div className='w-[60%] max-lg:w-full'>
        <Tabs defaultValue='medical-staff' className='w-full' data-aos='fade-zoom-in'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='medical-staff'>의료진 안내</TabsTrigger>
            <TabsTrigger value='treatment-staff'>치료진 안내</TabsTrigger>
          </TabsList>
          <TabsContent value='medical-staff' className='space-y-2'>
            {medicalStaffs &&
              medicalStaffs.map((staff, idx) => (
                <Staff
                  key={`${staff.name}+${idx}`}
                  profileImage={staff.profileImage}
                  position={staff.position}
                  name={staff.name}
                  specialty={staff.specialty}
                  educations={staff.educations}
                  works={staff.works}
                  experiences={staff.experiences}
                />
              ))}
          </TabsContent>
          <TabsContent value='treatment-staff' className='space-y-2'>
            {treatmentStaffs &&
              treatmentStaffs.map((staff, idx) => (
                <Staff
                  key={`${staff.name}+${idx}`}
                  // profileImage={staff.profileImage}
                  position={staff.position}
                  name={staff.name}
                  specialty={staff.specialty}
                  educations={staff.educations}
                  works={staff.works}
                  experiences={staff.experiences}
                />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
