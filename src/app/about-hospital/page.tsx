'use client'

import { useState, useEffect } from 'react'
import Staff from '@/components/layouts/Staff';
import ArrowLink from '@/components/links/ArrowLink';
import { buttonVariants } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface StaffMember {
  id: string
  name: string
  position: string
  specialty?: string
  profile_image_url?: string
  educations: string[]
  certifications: string[]
  experiences: string[]
  display_order: number
  category: {
    name: string
    display_name: string
  }
}

interface StaffData {
  [key: string]: StaffMember[]
}

export default function AboutHospitalPage() {
  const [medicalStaffs, setMedicalStaffs] = useState<StaffMember[]>([])
  const [treatmentStaffs, setTreatmentStaffs] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaffData()
  }, [])

  const fetchStaffData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/staff')
      if (!response.ok) {
        throw new Error('Failed to fetch staff data')
      }
      
      const data = await response.json()
      setMedicalStaffs(data.data.medical || [])
      setTreatmentStaffs(data.data.treatment || [])
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Fallback to empty arrays on error
      setMedicalStaffs([])
      setTreatmentStaffs([])
    } finally {
      setLoading(false)
    }
  }


  return (
    <main
      className={cn(
        'flex min-h-[calc(100vh-65px)] w-full justify-center gap-8 p-8',
        'max-lg:flex-col-reverse max-lg:items-center max-lg:justify-end'
      )}
    >
      <div className="w-2/5 p-16 max-lg:w-full max-lg:p-8">
        <div className="flex flex-col" data-aos="fade-zoom-in">
          <div className="flex flex-wrap">
            우리가 오랫동안 가장 귀중히 여기는 선물들은 보통 작고 소박한
            것들이다.
          </div>
          <div className="flex flex-wrap">
            가장 중요해 보이는 것들은 어려울 때나 편안할 때 우리 가장 가까이에
            있는 사람들에게 우리가
          </div>
          <div className="flex flex-wrap">
            그들의 요구, 그들의 즐거움, 그리고 그들의 도전에 귀를 기울이고
            있다는 사실을 보여주는 것이다.
          </div>
          <div
            className="mt-4 font-sans italic text-gray-500"
            data-aos="fade-zoom-in"
            data-aos-duration="2000"
          >
            - Fred Rogers, The World According to Mr. Rogers
          </div>
          <div
            className="ml-2 mt-16 flex gap-1 text-lg"
            data-aos="fade-zoom-in"
          >
            <div className="">나란히</div>
            <div className="" data-aos="fade-zoom-in" data-aos-delay="500">
              정신건강의학과의원
            </div>
          </div>
          <div
            className="ml-2 mt-1 flex gap-1 text-xl"
            data-aos="fade-zoom-in"
            data-aos-delay="1000"
          >
            <div className="">
              당신과 <span className="text-naranhiGreen">나란히</span>
            </div>
            <div
              className=""
              data-aos="fade-zoom-in"
              data-aos-delay="1500"
              data-aos-duration="1500"
            >
              걸어 갑니다.
            </div>
          </div>
          <div
            className="mt-4 text-naranhiYellow"
            data-aos="fade-right"
            data-aos-delay="1000"
          >
            <ArrowLink href="/contact-us" rel="noreferrer">
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
      <div className="w-3/5 max-lg:w-full">
        <Tabs
          tabs={[
            {
              title: '의료진 안내',
              value: 'medical-staff',
              content: (
                <div className="space-y-2">
                  {medicalStaffs.map((staff, idx) => (
                    <Staff
                      key={`${staff.name}-${idx}`}
                      profileImage={staff.profile_image_url}
                      position={staff.position}
                      name={staff.name}
                      specialty={staff.specialty}
                      educations={staff.educations}
                      works={staff.certifications}
                      experiences={staff.experiences}
                    />
                  ))}
                </div>
              ),
            },
            {
              title: '치료진 안내',
              value: 'treatment-staff',
              content: (
                <div className="space-y-2">
                  {treatmentStaffs.map((staff, idx) => (
                    <Staff
                      key={`${staff.name}-${idx}`}
                      profileImage={staff.profile_image_url}
                      position={staff.position}
                      name={staff.name}
                      specialty={staff.specialty}
                      educations={staff.educations}
                      works={staff.certifications}
                      experiences={staff.experiences}
                    />
                  ))}
                </div>
              ),
            },
          ]}
          defaultValue="medical-staff"
          className="w-full"
          data-aos="fade-zoom-in"
        />
      </div>
    </main>
  );
}
