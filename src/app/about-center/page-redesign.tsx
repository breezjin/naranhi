'use client';

import {
  Heart,
  Users,
  Brain,
  MessageCircle,
  User,
  ClipboardCheck,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import AOS from 'aos';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UnstyledLink from '@/components/links/UnstyledLink';
import { cn } from '@/lib/utils';

// 치료 프로그램 데이터
const therapyPrograms = [
  {
    id: 'speech',
    title: '언어치료',
    subtitle: '그늘의 나무도 때가 오면 꽃이 핀다',
    description:
      '전반적인 의사소통에 어려움을 겪는 아동이 의사소통을 원활하게 할 수 있도록 돕는 치료프로그램입니다.',
    icon: MessageCircle,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
    targets: [
      '또래에 비해 언어 발달이 느리다고 판단되는 경우',
      '발음이 부정확한 경우',
      '읽고 쓰기에 어려움을 겪는 경우',
      '말더듬이나 부적절한 속도로 말의 흐름이 부드럽지 않은 경우',
      '지적장애, 자폐성 범주장애 등으로 의사소통에 어려움을 겪는 경우',
    ],
    process: [
      '정신과 전문의 초진 후 언어치료 필요 여부 결정',
      '전문 언어치료사가 언어발달 평가 및 진단 수행',
      '전문의 검사 해석 상담 후 치료 계획 수립',
      '아동 맞춤 Individual Education Plan 장단기 계획 수립',
      '치료 프로그램 진행: 회기당 40분(치료) + 10분(보호자 면담)',
      '필요시 중간평가 실시',
      '보호자 면담을 통한 치료 프로그램 종결',
    ],
  },
  {
    id: 'play',
    title: '놀이치료',
    subtitle: '새는 날아다니고, 물고기는 헤엄치며, 아동은 놀이를 한다',
    description:
      '아동에게 가장 친숙한 활동인 놀이를 통해 정서적 문제를 해결하고 성장과 발달을 촉진시키기 위해 활용되는 상담치료기법입니다.',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950/20',
    borderColor: 'border-pink-200 dark:border-pink-800',
    textColor: 'text-pink-700 dark:text-pink-300',
    targets: [
      '산만하고 충동적이며 학교 생활에 잘 적응하지 못하는 경우',
      '불안하거나 무기력하여 등교하기를 거부하는 경우',
      '또래와의 관계에서 어려움을 겪거나 사회성이 부족한 경우',
      '게임, 컴퓨터, 핸드폰 등에 지나치게 몰두하는 경우',
      '가족과의 애착 형성이 어렵고 분리불안을 보이는 경우',
    ],
    benefits: [
      '자신감과 환경 대처 능력 증진',
      '새로운 대인관계 어려움 극복',
      '충동성과 산만함 조절 능력 향상',
      '바람직한 사회화 촉진',
      '부모양육상담 코칭 제공',
      '발달 지연 아동의 전반적 기능 향상',
    ],
  },
  {
    id: 'cognitive',
    title: '인지치료',
    subtitle: '방법을 가르치지 말고 방향을 가리켜라',
    description:
      '아동의 지적 수준과 주의력 등 학습에 저해를 주는 인지적 요인들을 인지학습치료적 접근으로 아동의 인지 발달을 촉진시키는 치료입니다.',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
    targets: [
      '지적인 능력에 비해 학습이 부진한 경우',
      '또래에 비해 학습 능력 수준이 떨어지는 경우',
      'ADHD, 언어발달 지연, 발달장애로 학습 능력이 낮은 경우',
      '읽기장애, 쓰기장애, 산수학습장애가 나타나는 경우',
      '우울, 불안 등 정서 장애로 학교생활에 어려움을 겪는 경우',
    ],
  },
  {
    id: 'adolescent',
    title: '청소년 상담',
    subtitle: '다양한 내면의 나와 함께 성장하는 시간',
    description:
      '청소년기 가치관과 정체성을 세워나가며 신체적, 정신적 급격한 성장 과정의 어려움을 상담을 통해 함께 겪어나가고 성장의 기회로 삼는 것을 목표로 합니다.',
    icon: Users,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-300',
    issues: [
      '또래 관계, 사회성',
      '학교 폭력',
      '반항, 비행',
      '자해, 자살 충동',
      '게임, 스마트폰 중독',
      '주의력 및 학습',
      '청소년기 우울증',
      '부모 자녀관계 어려움',
      '발달상의 어려움 및 과한 스트레스',
    ],
  },
  {
    id: 'adult',
    title: '성인 상담',
    subtitle: '자기 돌봄과 성장의 시간',
    description:
      '현대 사회 성인의 수많은 역할과 책임 속 갈등과 스트레스, 어려움을 상담을 통해 나누고 자기 돌봄과 성장의 기회가 되는 것을 목표로 삼습니다.',
    icon: User,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-300',
    sessionTime: '회기당 50분(치료)',
  },
  {
    id: 'assessment',
    title: '검사 프로그램',
    subtitle: '개인 맞춤형 평가와 검사',
    description:
      '각 개인의 어려움과 상황에 맞는 다양한 평가 및 검사를 진행합니다.',
    icon: ClipboardCheck,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50 dark:bg-teal-950/20',
    borderColor: 'border-teal-200 dark:border-teal-800',
    textColor: 'text-teal-700 dark:text-teal-300',
    tests: [
      '언어 평가',
      '놀이 평가',
      '지능 평가',
      '발달 검사',
      '정서 특화 검사',
      '종합심리검사',
      '신경심리평가',
      '종합주의력검사 (CAT)',
      '스트레스 검사 (HRV)',
    ],
  },
];

export default function AboutCenterRedesigned() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-naranhiGreen/10 via-naranhiYellow/10 to-naranhiGreen/10 py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute left-4 top-4 h-24 w-24 rounded-full bg-naranhiYellow/20 blur-xl" />
          <div className="absolute right-8 top-16 h-32 w-32 rounded-full bg-naranhiGreen/20 blur-xl" />
          <div className="absolute bottom-8 left-1/3 h-20 w-20 rounded-full bg-blue-400/20 blur-xl" />
        </div>

        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 border-naranhiGreen/20 bg-white/80 text-naranhiGreen"
              data-aos="fade-up"
            >
              나란히 상담센터
            </Badge>

            <h1
              className="mb-6 text-4xl font-bold leading-tight text-slate-900 dark:text-white lg:text-6xl"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              마음을 치유하고{' '}
              <span className="bg-gradient-to-r from-naranhiGreen to-naranhiYellow bg-clip-text text-transparent">
                함께 성장
              </span>
              하는 공간
            </h1>

            <p
              className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              개인의 어려움과 상황에 맞는 전문적인 치료와 상담을 통해 건강한
              정신적 성장을 지원합니다.
            </p>

            <div
              className="flex flex-col justify-center gap-4 sm:flex-row"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <Button
                size="lg"
                className="bg-naranhiGreen hover:bg-naranhiGreen/90"
              >
                상담 예약하기
              </Button>
              <Button variant="outline" size="lg">
                프로그램 둘러보기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2
              className="mb-4 text-3xl font-bold text-slate-900 dark:text-white lg:text-4xl"
              data-aos="fade-up"
            >
              전문 치료 프로그램
            </h2>
            <p
              className="text-lg text-slate-600 dark:text-slate-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              각 개인의 필요에 맞는 맞춤형 치료와 상담 서비스를 제공합니다
            </p>
          </div>

          <div className="grid gap-8 lg:gap-12">
            {therapyPrograms.map((program, index) => {
              const Icon = program.icon;

              return (
                <Card
                  key={program.id}
                  className={cn(
                    'group overflow-hidden border-0 shadow-lg transition-all duration-500 hover:shadow-xl',
                    program.bgColor,
                    index % 2 === 1 && 'lg:flex-row-reverse'
                  )}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="grid lg:grid-cols-5 lg:gap-0">
                    {/* Icon & Title Section */}
                    <div
                      className={cn(
                        'flex flex-col justify-center p-8 lg:col-span-2',
                        `bg-gradient-to-br ${program.color}`,
                        'text-white'
                      )}
                    >
                      <div className="mb-4">
                        <Icon className="mb-4 h-12 w-12 opacity-90" />
                        <h3 className="text-2xl font-bold lg:text-3xl">
                          {program.title}
                        </h3>
                        <p className="mt-2 text-sm italic opacity-90">
                          {program.subtitle}
                        </p>
                      </div>
                      <p className="leading-relaxed text-white/90">
                        {program.description}
                      </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 lg:col-span-3">
                      <div className="space-y-6">
                        {/* Treatment Targets */}
                        {program.targets && (
                          <div>
                            <h4 className="mb-3 font-semibold text-slate-900 dark:text-white">
                              치료 대상
                            </h4>
                            <ul className="space-y-2">
                              {program.targets
                                .slice(0, 3)
                                .map((target, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                                  >
                                    <div
                                      className={cn(
                                        'mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full',
                                        `bg-gradient-to-r ${program.color}`
                                      )}
                                    />
                                    {target}
                                  </li>
                                ))}
                              {program.targets.length > 3 && (
                                <li className="text-sm italic text-slate-500 dark:text-slate-400">
                                  외 {program.targets.length - 3}가지 더...
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Benefits (for play therapy) */}
                        {program.benefits && (
                          <div>
                            <h4 className="mb-3 font-semibold text-slate-900 dark:text-white">
                              치료 효과
                            </h4>
                            <ul className="space-y-2">
                              {program.benefits
                                .slice(0, 3)
                                .map((benefit, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                                  >
                                    <div
                                      className={cn(
                                        'mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full',
                                        `bg-gradient-to-r ${program.color}`
                                      )}
                                    />
                                    {benefit}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                        {/* Issues (for adolescent) */}
                        {program.issues && (
                          <div>
                            <h4 className="mb-3 font-semibold text-slate-900 dark:text-white">
                              주요 호소 내용
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {program.issues.slice(0, 6).map((issue, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className={cn(
                                    'text-xs',
                                    program.bgColor,
                                    program.textColor,
                                    program.borderColor,
                                    'border'
                                  )}
                                >
                                  {issue}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tests (for assessment) */}
                        {program.tests && (
                          <div>
                            <h4 className="mb-3 font-semibold text-slate-900 dark:text-white">
                              검사 항목
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {program.tests.map((test, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                                >
                                  <div
                                    className={cn(
                                      'h-1.5 w-1.5 rounded-full',
                                      `bg-gradient-to-r ${program.color}`
                                    )}
                                  />
                                  {test}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Session Info */}
                        <div className="pt-4">
                          <div
                            className={cn(
                              'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
                              program.bgColor,
                              program.textColor
                            )}
                          >
                            <div
                              className={cn(
                                'h-2 w-2 rounded-full',
                                `bg-gradient-to-r ${program.color}`
                              )}
                            />
                            {program.sessionTime ||
                              '회기당 40분(치료) + 10분(보호자 면담)'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
