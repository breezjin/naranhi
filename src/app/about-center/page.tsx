'use client';

import {
  Heart,
  Users,
  Brain,
  MessageCircle,
  User,
  ClipboardCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AOS from 'aos';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// 치료 프로그램 데이터 (인용구 포함)
const therapyPrograms = [
  {
    id: 'speech',
    title: '언어치료',
    subtitle: '그늘의 나무도 때가 오면 꽃이 핀다',
    quote: '"그늘의 나무도 때가 오면 꽃이 핀다."',
    description:
      '전반적인 의사소통에 어려움을 겪는 아동이<br class="md:hidden" /> 의사소통을 원활하게 할 수 있도록<br class="md:hidden" /> 돕는 치료프로그램입니다.',
    icon: MessageCircle,
    color: 'from-blue-400 to-blue-500',
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
    quote: '"새는 날아다니고, 물고기는 헤엄치며, 아동은 놀이를 한다."',
    quoteAuthor: 'Garry Landreth',
    description:
      '아동에게 가장 친숙한 활동인 놀이를 통해<br class="md:hidden" /> 정서적 문제를 해결하고<br class="md:hidden" /> 성장과 발달을 촉진시키기 위해<br class="md:hidden" /> 활용되는 상담치료기법입니다.',
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
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
    quote: '"방법을 가르치지 말고 방향을 가리켜라."',
    quoteAuthor: 'Dave Burgess',
    description:
      '아동의 지적 수준과 주의력 등<br class="md:hidden" /> 학습에 저해를 주는 인지적 요인들을<br class="md:hidden" /> 인지학습치료적 접근으로<br class="md:hidden" /> 아동의 인지 발달을 촉진시키는 치료입니다.',
    icon: Brain,
    color: 'from-purple-400 to-indigo-500',
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
    quote:
      '"내 속엔 여러가지 앤이 들어있나봐. 가끔씩은 난 왜 이렇게 골치 아픈 존재인가 하는 생각이 들기도 해. 내가 한결 같은 앤이라면 훨씬 더 편하겠지만 재미는 지금의 절반밖에 되지 않을거야."',
    quoteAuthor: '빨강머리 앤',
    description:
      '청소년기 가치관과 정체성을 세워나가며<br class="md:hidden" /> 신체적, 정신적 급격한 성장 과정의<br class="md:hidden" /> 어려움을 상담을 통해 함께 겪어나가고<br class="md:hidden" /> 성장의 기회로 삼는 것을 목표로 합니다.',
    icon: Users,
    color: 'from-green-400 to-emerald-500',
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
    quote:
      '"다들 평생을 뭘 가져 보겠다고 고생 고생을 하면서 \"나는 어떤 인간이다\" 라는 걸 위해서 아등바등 사는데 뭘 갖는 건지도 모르겠고, 어떻게 원하는 걸 갖는다고 해도 나를 안전하게 만들어 준다고 생각했던 것들에, 나라고 생각했던 것들에 금이 가기 시작하면 못견디고 무너지고..."',
    quoteAuthor: '나의 아저씨',
    description:
      '현대 사회 성인의 수많은 역할과 책임 속<br class="md:hidden" /> 갈등과 스트레스, 어려움을<br class="md:hidden" /> 상담을 통해 나누고<br class="md:hidden" /> 자기 돌봄과 성장의 기회가 되는 것을<br class="md:hidden" /> 목표로 삼습니다.',
    icon: User,
    color: 'from-orange-400 to-amber-500',
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
      '각 개인의 어려움과 상황에 맞는<br class="md:hidden" /> 다양한 평가 및 검사를 진행합니다.',
    icon: ClipboardCheck,
    color: 'from-teal-400 to-cyan-500',
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

export default function AboutCenter() {
  const [activeProgram, setActiveProgram] = useState(therapyPrograms[0]);

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
      <section className="relative overflow-hidden bg-gradient-to-r from-naranhiGreen/10 via-naranhiYellow/10 to-naranhiGreen/10 py-12 lg:py-16">
        <div className="absolute inset-0">
          <div className="absolute left-4 top-4 h-24 w-24 rounded-full bg-naranhiYellow/20 blur-xl" />
          <div className="absolute right-8 top-16 h-32 w-32 rounded-full bg-naranhiGreen/20 blur-xl" />
          <div className="absolute bottom-8 left-1/3 h-20 w-20 rounded-full bg-blue-400/20 blur-xl" />
        </div>

        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 border-naranhiGreen/30 bg-naranhiGreen/10 text-naranhiGreen shadow-sm backdrop-blur-sm"
              data-aos="fade-up"
            >
              나란히 상담센터
            </Badge>

            <h1
              className="mb-6 text-2xl font-bold leading-tight text-slate-900 dark:text-white lg:text-4xl"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              마음을 치유하고
              <br className="sm:hidden" />{' '}
              <span className="bg-gradient-to-r from-naranhiGreen to-naranhiYellow bg-clip-text text-transparent">
                함께 성장
              </span>
              하는 공간
            </h1>

            <p
              className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              개인의 어려움과 상황에 맞는
              <br className="sm:hidden" /> 전문적인 치료와 상담을 통해
              <br />
              건강한 정신적 성장을
              <br className="sm:hidden" /> 지원합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Program Selection Section */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8 text-center">
            <h2
              className="mb-3 text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl"
              data-aos="fade-up"
            >
              전문 치료 프로그램
            </h2>
            <p
              className="text-slate-600 dark:text-slate-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              원하는 프로그램을 선택하여
              <br className="sm:hidden" /> 자세한 내용을 확인해보세요
            </p>
          </div>

          {/* Program Selection Tabs */}
          <div className="mb-8" data-aos="fade-up" data-aos-delay="200">
            <div className="flex flex-wrap justify-center gap-2 lg:gap-4">
              {therapyPrograms.map((program) => {
                const Icon = program.icon;
                const isActive = activeProgram.id === program.id;

                return (
                  <button
                    key={program.id}
                    onClick={() => setActiveProgram(program)}
                    className={cn(
                      'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                      'border hover:scale-105',
                      isActive
                        ? cn(
                            'border-transparent text-white shadow-md',
                            `bg-gradient-to-r ${program.color}`
                          )
                        : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{program.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Program Content */}
          <div
            className="mx-auto max-w-4xl"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Card
              className={cn(
                'overflow-hidden border-0 shadow-lg transition-all duration-500',
                activeProgram.bgColor
              )}
            >
              {/* Program Header */}
              <div
                className={cn(
                  'p-6 text-center lg:p-8',
                  `bg-gradient-to-br ${activeProgram.color}`,
                  'text-white'
                )}
              >
                <div className="mb-4 flex items-center justify-center">
                  {(() => {
                    const Icon = activeProgram.icon;
                    return <Icon className="h-12 w-12 opacity-90" />;
                  })()}
                </div>

                <h3 className="mb-2 text-2xl font-bold lg:text-3xl">
                  {activeProgram.title}
                </h3>

                <p
                  className="mx-auto max-w-2xl leading-relaxed text-white/90"
                  dangerouslySetInnerHTML={{
                    __html: activeProgram.description,
                  }}
                />
              </div>

              {/* Quote Section - Distinctive Area */}
              {activeProgram.quote && (
                <div className="relative bg-gradient-to-r from-slate-50/50 via-white to-slate-50/50 dark:from-slate-800/50 dark:via-slate-700/50 dark:to-slate-800/50">
                  {/* Decorative border */}
                  <div
                    className={cn(
                      'absolute bottom-0 left-6 top-0 w-1 opacity-30',
                      `bg-gradient-to-b ${activeProgram.color}`
                    )}
                  />

                  <div className="px-8 py-6 lg:px-12 lg:py-8">
                    <div className="relative">
                      {/* Quote mark decoration */}
                      <div
                        className={cn(
                          'absolute -left-2 -top-2 font-serif text-4xl opacity-30',
                          `bg-gradient-to-r ${activeProgram.color} bg-clip-text text-transparent`
                        )}
                      >
                        &ldquo;
                      </div>

                      <blockquote
                        className={cn(
                          'break-keep pl-6 text-base font-medium italic leading-relaxed sm:text-lg',
                          'text-slate-800 dark:text-slate-100'
                        )}
                        dangerouslySetInnerHTML={{
                          __html: activeProgram.quote
                            .replace(/^"|"$/g, '')
                            .replace(/\. /g, '.<br class="sm:hidden" /> '),
                        }}
                      />

                      {activeProgram.quoteAuthor && (
                        <div className="mt-4 flex justify-end">
                          <cite
                            className={cn(
                              'rounded-full px-3 py-1 text-sm font-medium',
                              activeProgram.bgColor,
                              activeProgram.textColor
                            )}
                          >
                            {activeProgram.quoteAuthor}
                          </cite>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Program Details */}
              <CardContent className="p-6 lg:p-8">
                <div className="grid gap-6 lg:gap-8">
                  {/* Treatment Targets */}
                  {activeProgram.targets && (
                    <div>
                      <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                        치료 대상
                      </h4>
                      <div className="grid gap-3">
                        {activeProgram.targets.map((target, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-2 h-2 w-2 flex-shrink-0 rounded-full',
                                `bg-gradient-to-r ${activeProgram.color}`
                              )}
                            />
                            <span className="leading-relaxed text-slate-600 dark:text-slate-300">
                              {target}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits (for play therapy) */}
                  {activeProgram.benefits && (
                    <div>
                      <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                        치료 효과
                      </h4>
                      <div className="grid gap-3">
                        {activeProgram.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div
                              className={cn(
                                'mt-2 h-2 w-2 flex-shrink-0 rounded-full',
                                `bg-gradient-to-r ${activeProgram.color}`
                              )}
                            />
                            <span className="leading-relaxed text-slate-600 dark:text-slate-300">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Issues (for adolescent) */}
                  {activeProgram.issues && (
                    <div>
                      <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                        주요 호소 내용
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeProgram.issues.map((issue, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className={cn(
                              'px-3 py-1 text-sm',
                              activeProgram.bgColor,
                              activeProgram.textColor,
                              activeProgram.borderColor,
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
                  {activeProgram.tests && (
                    <div>
                      <h4 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                        검사 항목
                      </h4>
                      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                        {activeProgram.tests.map((test, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div
                              className={cn(
                                'h-2 w-2 rounded-full',
                                `bg-gradient-to-r ${activeProgram.color}`
                              )}
                            />
                            <span className="text-slate-600 dark:text-slate-300">
                              {test}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Session Info */}
                  <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                    <div
                      className={cn(
                        'inline-flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium',
                        activeProgram.bgColor,
                        activeProgram.textColor
                      )}
                    >
                      <div
                        className={cn(
                          'h-3 w-3 rounded-full',
                          `bg-gradient-to-r ${activeProgram.color}`
                        )}
                      />
                      {activeProgram.sessionTime ||
                        '회기당 40분(치료) + 10분(보호자 면담)'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
