import UnstyledLink from '@/components/links/UnstyledLink';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const programList = [
  {
    title: '언어치료',
    value:
      '전반적인 의사소통에 어려움을 겪는 아동이 의사소통을 원활하게 할 수 있도록 돕는 치료프로그램입니다.',
    content: (
      <Card
        key="언어치료"
        className="min-h-full bg-slate-200 dark:bg-slate-800 max-lg:min-h-fit max-lg:max-w-full max-lg:p-0 lg:w-full lg:p-8"
        data-aos="fade-zoom-in"
      >
        <CardHeader>
          <CardTitle className="text-naranhiYellow dark:text-naranhiGreen">
            언어치료
          </CardTitle>
          <CardDescription>
            <span>&ldquo;그늘의 나무도 때가 오면 꽃이 핀다.&rdquo;</span>
            <br />
            <span>언어 발달의 지연, 조음 장애, 질적인 의사소통 문제, 말더듬 등</span>
            <br />
            <span>
              전반적인 의사소통에 어려움을 겪는 아동이 의사소통을 원활하게 할 수 있도록 돕는
              치료프로그램입니다.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">치료대상</div>
          <div>
            <ol className="list-decimal">
              <li>또래에 비해 언어 발달이 느리다고 판단되는 경우</li>
              <li>발음이 부정확한 경우</li>
              <li>읽고 쓰기에 어려움을 겪는 경우</li>
              <li>
                말을 더듬거나 부적절한 속도 및 리듬으로 인해 말의 흐름이
                부드럽지 않은 경우
              </li>
              <li>
                지적장애, 자폐성 범주장애, 정서장애, 발달장애 등으로 의사소통에
                어려움을 겪는 경우
              </li>
            </ol>
          </div>
        </CardContent>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">언어발달 평가 및 치료 절차</div>
          <div>
            <ol className="list-decimal">
              <li>정신과 전문의 초진 후 언어치료 필요 여부 결정합니다.</li>
              <li>
                전문적 지식을 갖춘 언어치료사가 언어발달 평가 및 진단을 통하여
                아동을 정확히 파악합니다.
              </li>
              <li>
                정신과 전문의의 언어평가 결과 해석 상담 후 치료에 대한 계획을
                수립합니다.
              </li>
              <li>
                아동 맞춤{' '}
                <span className="italic">Individual Education Plan</span> 장단기
                계획 수및 치료 목표 설정합니다.
              </li>
              <li>
                치료 프로그램 진행 : 회기당 40분(치료) + 10분(보호자 면담){' '}
              </li>
              <li>필요에 의해 중간평가를 실시 할 수 있습니다.</li>
              <li>보호자 면담을 통한 치료 프로그램 종결</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    title: '놀이치료',
    value:
      '아동에게 가장 친숙한 활동인 놀이를 통해 정서적 문제를 해결하고 성장과 발달을 촉진시키기 위해 활용되는 상담치료기법입니다.',
    content: (
      <Card
        key="놀이치료"
        className="min-h-full bg-slate-200 dark:bg-slate-800 max-lg:min-h-fit max-lg:max-w-full max-lg:p-0 lg:w-full lg:p-8"
        data-aos="fade-zoom-in"
      >
        <CardHeader>
          <CardTitle className="text-naranhiYellow dark:text-naranhiGreen">
            놀이치료
          </CardTitle>
          <CardDescription>
            <span>
              &ldquo;새는 날아다니고, 물고기는 헤엄치며, 아동은 놀이를 한다.&rdquo;
              <span className='font-sans italic text-gray-500'> - Garry Landreth</span>
            </span>
            <br />
            <span>
              아동에게 가장 친숙한 활동인 놀이를 통해 정서적 문제를 해결하고 성장과 발달을
              촉진시키기 위해 활용되는 상담치료기법입니다.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">놀이치료 대상</div>
          <div>
            <ol className="list-decimal">
              <li>산만하고 충동적이며 학교 생활에 잘 적응하지 못하는 경우</li>
              <li>불안하거나 무기력하여 등교하기를 거부하는 경우</li>
              <li>또래와의 관계에서 어려움을 겪거나 사회성이 부족한 경우 </li>
              <li>게임, 컴퓨터, 핸드폰 등에 지나치게 몰두하는 경우</li>
              <li>가족과의 애착 형성이 어렵고 분리불안을 보이는 경우</li>
              <li>내성적이거나 자기표현에 어려움이 있는 경우</li>
              <li>
                강박적인 습관이나 화, 부정적인 감정을 조절하는데 어려움을 겪는
                경우
              </li>
              <li>주의력이 부족하고 집중력이 낮은 경우</li>
              <li>발달이 지연되는 경우</li>
            </ol>
          </div>
        </CardContent>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">놀이치료 효과</div>
          <div>
            <ol className="list-decimal">
              <li>
                자신감은 물론 주위환경에 보다 잘 대처해나갈 수 있는 능력을
                증진시켜 줍니다.
              </li>
              <li>
                훈련된 상담자와의 놀이를 통해 새로운 대인관계의 어려움을
                극복시켜 줍니다.
              </li>
              <li>
                충동적이며 산만함을 조절할 수 있는 방법을 배우게 되고 긍정적인
                사고를 할 수 있게 도와줍니다.
              </li>
              <li>
                새로운 역할과 행동을 경험하게 하여 바람직한 사회화를 촉진하도록
                도와줍니다.
              </li>
              <li>
                아동의 내적인 문제뿐 아니라 아동의 행동이 잘 변화될 수 있도록
                부모양육상담 코칭을 제공합니다.
              </li>
              <li>
                발달이 늦은 아동들은 여러 자극을 통해 전반적인 기능이 향상되는
                경험을 하게 해줍니다.
              </li>
            </ol>
          </div>
        </CardContent>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">놀이치료 절차</div>
          <div>
            <ol className="list-decimal">
              <li>정신과 전문의 진료 후 놀이치료 필요 여부 결정합니다.</li>
              <li>스케쥴 예약 및 선결제 진행(필요시 놀이평가를 진행합니다.)</li>
              <li>
                전문의의 심리 검사(놀이 평가) 및 해석 상담이 이루어집니다.
              </li>
              <li>
                치료 프로그램 진행 : 회기당 40분(치료) + 10분(보호자 상담){' '}
              </li>
              <li>
                필요시, 부모양육 코칭, history taking 상담 약 5~10회가
                진행됩니다.
              </li>
              <li>보호자 면담을 통한 치료 프로그램 종결</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    title: '인지치료',
    value:
      '아동의 지적 수준과 주의력 등의 학습에 저해를 주는 인지적인 요인들을 인지학습치료적 접근 방법을 통하여 아동의 인지 발달을 촉진시키는 치료입니다.',
    content: (
      <Card
        key="인지치료"
        className="min-h-full bg-slate-200 dark:bg-slate-800 max-lg:min-h-fit max-lg:max-w-full max-lg:p-0 lg:w-full lg:p-8"
        data-aos="fade-zoom-in"
        data-aos-delay="200"
      >
        <CardHeader>
          <CardTitle className="text-naranhiYellow dark:text-naranhiGreen">
            인지치료
          </CardTitle>
          <CardDescription>
            <span>
              &ldquo;방법을 가르치지 말고 방향을 가리켜라.&rdquo;
              <span className='font-sans italic text-gray-500'> - Dave Burgess</span>
            </span>
            <br />
            <span>
              아동의 지적 수준과 주의력 등의 학습에 저해를 주는 인지적인 요인들을 인지학습치료적
              접근 방법을 통하여 아동의 인지 발달을 촉진시키는 치료입니다.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">인지치료 대상</div>
          <div>
            <ol className="list-decimal">
              <li>지적인 능력에 비해 학습이 부진한 경우</li>
              <li>또래에 비해 학습 능력 수준이 떨어지는 경우</li>
              <li>
                ADHD, 언어발달 지연, 발달장애 등의 문제로 학습 능력 수준이 낮은
                경우
              </li>
              <li>읽기장애, 쓰기장애, 산수학습장애가 나타나는 경우</li>
              <li>
                우울, 불안 등의 정서 장애를 동반하여 학교 생활이나 또래 관계에서
                어려움을 겪는 경우
              </li>
            </ol>
          </div>
        </CardContent>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">인지치료 절차</div>
          <div>
            <ol className="list-decimal">
              <li>
                정신과 전문의 진료 후 필요한 검사(종합심리검사, 발달평가,
                지능검사, 언어평가 등)를 시행합니다.
              </li>
              <li>
                전문의의 검사 해석 상담, 아이에게 필요한 치료를 권고합니다.
              </li>
              <li>스케쥴 예약 및 선결제를 진행합니다.</li>
              <li>
                아동 맞춤{' '}
                <span className="italic">Individual Education Plan</span> 장단기
                계획 수및 치료 목표 설정합니다.
              </li>
              <li>치료프로그램 진행 : 회기당 40분(치료) + 10분(보호자면담)</li>
              <li>
                읽기 및 쓰기 능력, 주의집중, 개념형성, 수리 및 추리능력의 발달,
                기억력을 향상시킵니다.
              </li>
              <li>보호자 면담을 통한 치료 종결</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    title: '청소년 상담',
    value:
      '청소년기는 가치관, 정체성을 세워나가는 시기로, 신체적, 정신적으로 급격히 성장하는 과정을 겪으며 어려움을 겪기 쉽습니다. 상담을 통해 어려움을 함께 겪어 나가고 더불어 성장의 기회로 삼는 것을 목표로 합니다.',
    content: (
      <Card
        key="청소년 상담"
        className="min-h-full bg-slate-200 dark:bg-slate-800 max-lg:min-h-fit max-lg:max-w-full max-lg:p-0 lg:w-full lg:p-8"
        data-aos="fade-zoom-in"
        data-aos-delay="300"
      >
        <CardHeader>
          <CardTitle className="text-naranhiYellow dark:text-naranhiGreen">
            청소년 상담
          </CardTitle>
          <CardDescription>
            <span>
              &ldquo;내 속엔 여러가지 앤이 들어있나봐. 가끔씩은 난 왜 이렇게 골치 아픈 존재인가 하는
              생각이 들기도 해. 내가 한결 같은 앤이라면 훨씬 더 편하겠지만 재미는 지금의 절반밖에
              되지 않을거야.&rdquo;
              <span className='font-sans italic text-gray-500'> - 빨강머리 앤</span>
            </span>
            <br />
            <span>
              청소년기는 가치관, 정체성을 세워나가는 시기로, 신체적, 정신적으로 급격히 성장하는
              과정을 겪으며 어려움을 겪기 쉽습니다. 상담을 통해 어려움을 함께 겪어 나가고 더불어
              성장의 기회로 삼는 것을 목표로 합니다.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">청소년 상담의 주 호소 내용</div>
          <div>
            <ol className="list-decimal">
              <li>또래 관계, 사회성</li>
              <li>학교 폭력</li>
              <li>반항, 비행</li>
              <li>자해, 자살 충동 등</li>
              <li>게임, 스마트폰 중독 등 조절의 어려움</li>
              <li>주의력 및 학습</li>
              <li>청소년기 우울증</li>
              <li>부모 자녀관계 어려움</li>
              <li>기타 발달상의 어려움 및 과한 스트레스 자극 요인</li>
            </ol>
          </div>
        </CardContent>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">청소년 상담 절차</div>
          <div>
            <ol className="list-decimal">
              <li>정신과 전문의 진료 후 청소년 상담 결정합니다.</li>
              <li>검사 혹은 상담 스케쥴 예약 및 선결제 진행합니다.</li>
              <li>검사 이후 전문의의 해석 상담이 이루어집니다.</li>
              <li>청소년 상담 진행 : 회기당 40분(치료) + 10분(보호자면담)</li>
              <li>필요시 부모 상담이 추가적으로 진행됩니다.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    title: '성인 상담',
    value:
      '현대 사회에서 성인이 된 우리는 수많은 역할과 책임을 가지게 됩니다. 그 속에서 갈등과 스트레스, 어려움을 겪을 수 있습니다. 상담을 통하여 어려움을 나누고 자기 돌봄과 성장의 기회가 되는 것을 목표로 삼습니다.',
    content: (
      <Card
        key="성인 상담"
        className="min-h-full bg-slate-200 dark:bg-slate-800 max-lg:min-h-fit max-lg:max-w-full max-lg:p-0 lg:w-full lg:p-8"
        data-aos="fade-zoom-in"
        data-aos-delay="400"
      >
        <CardHeader>
          <CardTitle className="text-naranhiYellow dark:text-naranhiGreen">
            성인 상담
          </CardTitle>
          <CardDescription>
            <span>
              &ldquo;다들 평생을 뭘 가져 보겠다고 고생 고생을 하면서
              <span className='font-semibold'> &apos;나는 어떤 인간이다&apos;</span> 라는 걸 위해서
              아등바등 사는데 뭘 갖는 건지도 모르겠고, 어떻게 원하는 걸 갖는다고 해도{` `}
              <span className='font-semibold'>
                나를 안전하게 만들어 준다고 생각했던 것들에, 나라고 생각했던 것들
              </span>
              에 금이 가기 시작하면 못견디고 무너지고...&rdquo;
              <span className='font-sans italic text-gray-500'> - 나의 아저씨</span>
            </span>
            <br />
            <span>
              현대 사회에서 성인이 된 우리는 수많은 역할과 책임을 가지게 됩니다. 그 속에서 갈등과
              스트레스, 어려움을 겪을 수 있습니다. 상담을 통하여 어려움을 나누고 자기 돌봄과 성장의
              기회가 되는 것을 목표로 삼습니다.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">성인 상담 절차</div>
          <div>
            <ol className="list-decimal">
              <li>정신과 전문의 진료 후 성인 상담 결정합니다.</li>
              <li>검사 혹은 상담 스케쥴 예약 및 선결제 진행합니다.</li>
              <li>검사 이후 전문의의 해석 상담이 이루어집니다.</li>
              <li>성인 상담 진행 : 회기당 50분(치료)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    title: '검사 프로그램',
    value: '각 개인의 어려움과 상황에 맞는 다양한 평가 및 검사를 진행합니다.',
    content: (
      <Card
        key="검사 프로그램"
        className="min-h-full bg-slate-200 dark:bg-slate-800 max-lg:min-h-fit max-lg:max-w-full max-lg:p-0 lg:w-full lg:p-8"
        data-aos="fade-zoom-in"
        data-aos-delay="500"
      >
        <CardHeader>
          <CardTitle className="text-naranhiYellow dark:text-naranhiGreen">
            검사 프로그램
          </CardTitle>
          <CardDescription>
            <span>각 개인의 어려움과 상황에 맞는 다양한 평가 및 검사를 진행합니다.</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="font-bold">검사 항목</div>
          <div>
            <ul className="list-disc">
              <li>언어 평가</li>
              <li>놀이 평가</li>
              <li>지능 평가</li>
              <li>발달 검사</li>
              <li>정서 특화 검사</li>
              <li>종합심리검사</li>
              <li>신경심리평가</li>
              <li>종합주의력검사 (CAT)</li>
              <li>스트레스 검사 (HRV)</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <UnstyledLink
            href={'/about-center/non-reimbursement'}
            className="text-sm text-gray-500"
          >
            기타 비급여항목 안내
          </UnstyledLink>
        </CardFooter>
      </Card>
    ),
  },
];

export default programList;
