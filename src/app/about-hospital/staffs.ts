import { treatments } from './../about-center/items';
interface Profile {
  profileImage?: string;
  position: string;
  name: string;
  specialty?: string;
  educations?: string[];
  works?: string[];
  experiences?: string[];
}

export const medicalStaffs = [
  {
    profileImage: '/imgs/staffs/staff-kimchaeri.png',
    position: '대표원장',
    name: '김채리',
    specialty: '정신건강의학과 전문의',
    educations: [
      '순천향대학교 의과대학 졸업',
      '순천향대학교 서울병원 수련의 수료',
      '순천향대학교 서울병원 정신건강의학과 전공의 수료',
    ],
    works: [
      '대한신경정신의학회 정회원',
      '대한정신건강의학과의사회 정회원',
      '미국 정신의학회(APA) 회원',
      '대한명상의학회 평생회원',
      '대한노인정신의학회 정회원',
      '대한정서인지행동의학회 정회원',
      '대한청소년정신의학회 회원',
      '대한비만연구의사회 정회원',
      '교육부 심리지원단 전문의',
    ],
    experiences: [`전) 새샘병원 정신건강의학과 진료부장`, `전) 금천키다리정신건강의학과 원장`],
  },
];

export const treatmentStaffs = [
  {
    // profileImage: '/imgs/staffs/staff-kimchaeyoung.png',
    position: '언어치료사',
    name: '김채영',
    specialty: '센터장',
    educations: ['나사렛대학교 언어치료학 학사'],
    works: [
      '[보건복지부] 언어재활사 1급',
      '인지학습상담전문가 2급',
      '[보건복지부] 사회복지사 2급',
      '한국언어재활사협회 정회원',
      '한국언어청각임상학회 정회원',
      'Auditory Verbal Therapy and Practice 심화과정 수료',
      '보완대체의사소통 외 다수 전문과정 수료',
      'TCI 수료',
    ],
    experiences: [
      `전) 등촌4종합사회복지관 언어치료사`,
      `전) 소리맘삼성아동발달센터 언어치료사`,
      `전) 풍무열린나무의원 언어치료사`,
      `전) 마곡웰소아청소년과의원 아동발달센터 치료팀장`,
      `전) 서울시장애인의사소통권리증진센터 사례관리`,
      `전) 연세늘봄정신건강의학과의원 부설 심리발달센터 언어치료사`,
      `현) 나란히심리발달센터 언어치료사/센터장`,
    ],
  },
  {
    // profileImage: '/imgs/staffs/staff-kimboram.png',
    position: '인지치료사/심리상담사',
    name: '김보람',
    educations: ['중앙대학교 심리학 학사', '중앙대학교 임상 및 상담심리학 석사'],
    works: [
      '[한국심리학회] 일반심리사',
      '[여성가족부] 청소년상담사 2급',
      '[보건복지부] 임상심리사 2급',
      '[한국상담심리학회] 상담심리사 2급',
    ],
    experiences: [
      `전) 아이코리아 동작아이존 심리상담사`,
      `전) 까리따스 심리상담센터 심리상담사`,
      `전) 1393 자살예방센터 상담사`,
      `전) 한성대학교 학생삼담센터 인턴상담사`,
      `현) 심리상담센터 헤세드 심리상담사/임상심리사`,
      `현) 아동발달센터 인지치료사`,
      `현) 나란히 심리발달센터 인지치료사/심리상담사`,
    ],
  },
  {
    // profileImage: '/imgs/staffs/staff-choiminkyung.png',
    position: '놀이치료사',
    name: '최민경',
    educations: ['이화여자대학교 사회학 학사', '이화여자대학교 아동학 석사'],
    works: [
      '[한국영유아아동정신건강학회] 놀이심리상담사 2급',
      '[여성가족부] 청소년상담사 2급 ',
      'DIRFloortime Certificate of Proficiency',
    ],
    experiences: [
      `전) 초록우산 어린이재단 팀원`,
      `전) 이화여대 SSK 아동가족연구소 참여연구원`,
      `전) 아이코리아 아동발달교육연구원/놀이치료사`,
      `전) 성북우리아이들병원 소아청소년 정신건강의학과 놀이치료사`,
      `현) 나란히 심리발달센터 놀이치료사`,
    ],
  },
  {
    position: '놀이치료사',
    name: '김빛나',
    educations: ['숙명여자대학교 놀이치료전공 석사'],
    works: ['[여성가족부] 청소년상담사 2급', '[한국놀이치료학회] 놀이심리상담사 2급'],
    experiences: [
      `전) 숙명여자대학교 놀이치료실 놀이치료사`,
      `전) 한신플러스케어 놀이치료사`,
      `전) 희망찬 심리발달센터 놀이치료사`,
      `전) 희망가득의원 놀이치료사`,
      `현) 해솔마음클리닉 놀이치료사`,
      `현) 나란히 심리발달센터 놀이치료사`,
    ],
  },
  {
    // profileImage: '',
    position: '심리상담사',
    name: '강한나',
    educations: [
      '서울여자대학교 교육심리학과 상담심리학 석사 수료',
      '한양대학교 상담심리학 박사 수료',
      'World Mission University Graduate Master of Arts Counseling Psychology 졸업',
      'World Mission University Graduate PhD in Spirituality and Counseling Coaching 박사과정',
    ],
    works: [
      '[한국상담심리학회] 상담심리사 2급 ',
      '[한국상담학회] 전문상담사 2급',
      '[한국모래놀이치료학회] 모래놀이치료사 1급',
      '[여성가족부] 청소년상담사 3급',
      '[여성가족부] 가정폭력상담원',
      '[여성가족부] 성폭력상담원',
      '[PREPARE-ENRICH협회] PREPARE-ENRICH 상담사',
    ],
    experiences: [
      `전) 백석대학교 부설 아동가족상담센터 상담사`,
      `전) 서울TOP마음클리닉 네그루심리상담소 상담사`,
      `전) 생각과 느낌의원 집단상담`,
      `전) 초록우산어린이재단 중탑종합사회복지관 상담센터장`,
      `전) 한양아이소리 부원장`,
      `전) LPJ마음건강의원 연구실장`,
      `현) 나란히 정신건강의학과의원/ 나란히 심리발달센터 심리상담사`,
    ],
  },
  {
    // profileImage: '/imgs/staffs/staff-choeune.png',
    position: '심리상담사',
    name: '조은애',
    educations: ['이화여자대학교 기독교학과/심리학과 학사', '이화여자대학교 심리학 석사'],
    works: ['[한국상담심리학회] 상담심리사 1급'],
    experiences: [
      `전) 이화여자대학교 학생상담센터 인턴 과정 수료`,
      `전) SK하이닉스 마음산책 상담실 상담사`,
      `전) 서울과학기술대학교 학생생활상담실 객원 상담사`,
      `전) 동덕여자대학교 학생상담센터 객원 상담사`,
      `전) 내맘애봄 심리상담센터 상담사`,
      `전) 파크심리상담센터 상담사`,
      `전) 경희대학교 심리상담센터 객원 상담사`,
      `현) 나란히 정신건강의학과의원/ 나란히 심리발달센터 심리상담사`,
    ],
  },
  {
    // profileImage: '/imgs/staffs/staff-jungdaheui.png',
    position: '임상심리사',
    name: '정다희',
    educations: ['성신여자대학교 심리학 학사', '성신여자대학교 심리학(임상신경) 석사'],
    works: ['[보건복지부] 정신건강임상심리사 1급', '[한국임상심리학회] 임상심리전문가'],
    experiences: [
      `전) 가천대 길병원 정신건강의학과 임상심리 수련`,
      `전) 명지병원 재활의학과 임상심리사`,
      `전) 한림병원 정신건강의학과/신경과 임상심리사`,
      `전) 강남세브란스병원 소아청소년과 임상심리사`,
      // `현) 금천키다리정신건강의학과의원 임상심리사`,
      `현) 나란히정신건강의학과의원 임상심리사`,
    ],
  },
  {
    // profileImage: '/imgs/staffs/staff-leesukyoung.png',
    position: '임상심리사',
    name: '이숙영',
    educations: ['가톨릭대학교 심리학 석사'],
    works: ['[보건복지부] 정신건강임상심리사 1급', '[한국심리학회] 임상심리전문가'],
    experiences: [
      `전) 가천대 길병원 정신건강의학과 임상심리 수련`,
      `전) 가천대학교 산학협력단 연구원`,
      `전) 가천대 길병원 가천의생명융합 연구원`,
      `전) 의료법인 구로다나병원 임상심리사`,
      // `현) 삼성슬립앤마인드 임상심리사`,
      // `현) 금천키다리정신건강의학과의원 임상심리사`,
      `현) 나란히정신건강의학과의원 임상심리사`,
    ],
  },
];
