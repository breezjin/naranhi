import Image from 'next/image';

import ArrowLink from '@/components/links/ArrowLink';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { siteConfig } from '@/config/site';
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
            <Card data-aos='fade-zoom-in'>
              <CardHeader>
                <CardTitle>
                  <span className='mr-2 text-sm text-gray-400'>대표원장</span>김채리
                </CardTitle>
                <CardDescription>정신건강의학과 전문의</CardDescription>
              </CardHeader>
              <CardContent className='space-y-1 text-sm'>
                <div>순천향대학교 의과대학 졸업</div>
                <div>순천향대학교 서울병원 수련의 수료</div>
                <div>순천향대학교 서울병원 정신건강의학과 전공의 수료</div>
              </CardContent>
              <CardContent className='space-y-1 text-sm'>
                <div>대한신경정신의학회 정회원</div>
                <div>대한정신건강의학과의사회 정회원</div>
                <div>미국 정신의학회(APA) 회원</div>
                <div>대한명상의학회 평생회원</div>
                <div>대한노인정신의학회 정회원</div>
                <div>대한정서인지행동의학회 정회원</div>
                <div>대한청소년정신의학회 회원</div>
                <div>대한비만연구의사회 정회원</div>
                <div>교육부 심리지원단 전문의</div>
              </CardContent>
              <CardContent className='space-y-1 text-sm'>
                <div>{`전) 새샘병원 정신건강의학과 진료부장`}</div>
                <div>{`전) 금천키다리정신건강의학과 원장`}</div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value='treatment-staff' className='space-y-2'>
            {/* <Card data-aos='fade-zoom-in'>
              <CardHeader>
                <CardTitle><span className='mr-2 text-sm text-gray-400'>언어치료사/센터장</span>김채영</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>나사렛대학교 언어치료학 학사 </div>
                <div>[보건복지부] 언어재활사 1급</div>
                <div>인지학습상담전문가 2급</div>
                <div>[보건복지부] 사회복지사 2급</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>한국언어재활사협회 정회원</div>
                <div>한국언어청각임상학회 정회원</div>
                <div>Auditory Verbal Therapy and Practice 심화과정 수료</div>
                <div>보완대체의사소통 외 다수 전문과정 수료</div>
                <div>TCI 수료</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>{`전) 등촌4종합사회복지관 언어치료사`}</div>
                <div>{`전) 소리맘삼성아동발달센터 언어치료사`}</div>
                <div>{`전) 풍무열린나무의원 언어치료사`}</div>
                <div>{`전) 마곡웰소아청소년과의원 아동발달센터 치료팀장`}</div>
                <div>{`전) 서울시장애인의사소통권리증진센터 사례관리`}</div>
                <div>{`전) 연세늘봄정신건강의학과의원 부설 심리발달센터 언어치료사`}</div>
              </CardContent>
            </Card>
            <Card data-aos='fade-zoom-in'>
              <CardHeader>
                <CardTitle><span className='mr-2 text-sm text-gray-400'>놀이치료사</span>이민아</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>영남대학교 아동학 학사</div>
                <div>영남대학교 아동학 석사</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>[한국놀이치료학회] 놀이심리상담사 1급</div>
                <div>[여성가족부] 놀이심리상담사 1급</div>
                <div>보육교사 1급</div>
              </CardContent>
            </Card>
            <Card data-aos='fade-zoom-in'>
              <CardHeader>
                <CardTitle><span className='mr-2 text-sm text-gray-400'>놀이치료사</span>최민경</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>이화여자대학교 사회학 학사</div>
                <div>이화여자대학교 사회학 석사</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>[한국영유아아동정신건강학회] 놀이심리상담사 2급</div>
                <div>[여성가족부] 청소년상담사 2급</div>
                <div>DIRFloortime Certificate of Proficiency</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>{`전) 초록우산 어린이재단 팀원`}</div>
                <div>{`전) 이화여대 SSK 아동가족연구소 참여연구원`}</div>
                <div>{`전) 아이코리아 아동발달교육연구원/놀이치료사`}</div>
                <div>{`전) 성북우리아이들병원 소아청소년 정신건강의학과 놀이치료사`}</div>
              </CardContent>
            </Card>
            <Card data-aos='fade-zoom-in'>
              <CardHeader>
                <CardTitle><span className='mr-2 text-sm text-gray-400'>놀이치료사</span>김빛나</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>숙명여자대학교 놀이치료 석사</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>[한국놀이치료학회] 놀이심리상담사 2급</div>
                <div>[여성가족부] 청소년상담사 2급</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>{`전) 숙명여자대학교 놀이치료실 놀이치료사`}</div>
                <div>{`전) 한신플러스케어 놀이치료사`}</div>
                <div>{`전) 희망찬심리발달센터 놀이치료사`}</div>
                <div>{`전) 해솔마음클리닉 놀이치료사`}</div>
                <div>{`전) 희망가득의원 놀이치료사`}</div>
                <div>{`현) 허그맘 놀이치료사`}</div>
              </CardContent>
            </Card>
            <Card data-aos='fade-zoom-in'>
              <CardHeader>
                <CardTitle><span className='mr-2 text-sm text-gray-400'>놀이치료사</span>조민지</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>숙명여자대학교 아동심리치료 학사</div>
                <div>숙명여자대학교 아동심리치료 석사</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>[한국놀이치료학회] 놀이심리상담사 2급</div>
                <div>[여성가족부] 청소년상담사 2급</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>{`전) 숙명여자대학교 놀이치료실 놀이치료사`}</div>
                <div>{`전) 국방부 어린이집 놀이치료실 놀이치료사`}</div>
                <div>{`전) 웰봄병원 심리발달클리닉 놀이치료사`}</div>
                <div>{`전) 미래365소아청소년과의원 발달클리닉 놀이치료사`}</div>
                <div>{`현) 아이들세상의원 놀이치료`}</div>
                <div>{`현) 연세소울정신건강의학과의원 놀이치료사`}</div>
                <div>{`현) 위례삼성정신건강의학과의원 놀이치료사`}</div>
              </CardContent>
            </Card>
            <Card data-aos='fade-zoom-in'>
              <CardHeader>
                <CardTitle><span className='mr-2 text-sm text-gray-400'>심리상담사</span>강한나</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>서울여자대학교 교육심리학과 상담심리학 석사</div>
                <div>한양대학교 상담심리학 박사</div>
                <div>World Mission University Graduate Master of Arts Counseling Psychology (상담심리학 석사)</div>
                <div>World Mission University Graduate 영성과 상담코칭 박사과정</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>[한국상담심리학회] 상담심리사 2급</div>
                <div>[한국상담학회] 전문상담사 2급</div>
                <div>[한국모래놀이치료학회] 모래놀이치료사 1급</div>
                <div>[여성가족부] 청소년상담사 3급</div>
                <div>[여성가족부] 가정폭력상담원</div>
                <div>[여성가족부] 성폭력상담원</div>
                <div>[한국코치협회] Korea Associate Coach 수련 과정</div>
              </CardContent>
            </Card>
            <Card data-aos='fade-zoom-in'>
              <CardHeader>
                <CardTitle><span className='mr-2 text-sm text-gray-400'>심리상담사</span>조은애</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>이화여자대학교 기독교학과/심리학과 학사</div>
                <div>이화여자대학교 심리학 석사</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>[한국상담심리학회] 상담심리사 2급</div>
              </CardContent>
              <CardContent className="space-y-1 text-sm">
                <div>{`전) 인천연성중학교 Wee Class`}</div>
                <div>{`전) 이화여자대학교 학생상담센터 인턴상담사`}</div>
                <div>{`전) SK하이닉스 마음산책 상담실 객원 상담사`}</div>
                <div>{`전) 서울과학기술대학교 학생생활상담실 객원 상담원`}</div>
                <div>{`전) 동덕여자대학교 학생상담센터 객원 상담원`}</div>
                <div>{`전) 내맘애봄 심리상담센터 객원 상담원`}</div>
                <div>{`전) 파크심리상담센터 객원 상담원`}</div>
                <div>{`전) 경희대학교 심리상담센터 객원 상담원 `}</div>
              </CardContent>
            </Card> */}
            <Card data-aos='fade-zoom-in'>
              <CardHeader>
                <CardTitle>
                  <span className='mr-2 text-sm text-gray-400'>임상심리사</span>정다희
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-1 text-sm'>
                <div>가천대 길병원 정신건강의학과 임상심리 수련과정(3년)</div>
              </CardContent>
              <CardContent className='space-y-1 text-sm'>
                <div>정신건강임상심리사 1급 (보건복지부)</div>
                <div>임상심리전문가 (한국임상심리학회)</div>
              </CardContent>
              <CardContent className='space-y-1 text-sm'>
                <div>{`전) 명지병원 재활의학과 임상심리사`}</div>
                <div>{`전) 한림병원 정신건강의학과/신경과 임상심리사`}</div>
                <div>{`전) 강남세브란스병원 소아청소년과 임상심리사`}</div>
              </CardContent>
            </Card>
            <Card data-aos='fade-zoom-in'>
              <CardHeader>
                <CardTitle>
                  <span className='mr-2 text-sm text-gray-400'>임상심리사</span>이숙영
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-1 text-sm'>
                <div>가천대 길병원 정신건강의학과 임상심리 수련과정(3년)</div>
              </CardContent>
              <CardContent className='space-y-1 text-sm'>
                <div>정신건강임상심리사 1급 (보건복지부)</div>
                <div>임상심리전문가 (한국임상심리학회)</div>
                <div>놀이심리상담사 1급 (한국놀이치료학회공인)</div>
                <div>청소년상담사 2급 (여성가족부)</div>
                <div>보육교사 1급 (여성가족부)</div>
                <div>느린학습자 인지학습상담사 1급 ((주)대교)</div>
              </CardContent>
              <CardContent className='space-y-1 text-sm'>
                <div>{`전) 구로다나병원 임상심리사`}</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
