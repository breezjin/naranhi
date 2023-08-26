export interface ReimbursementItem {
  code: string;
  title: string;
  price: string;
  updated: string;
}

export const documents: ReimbursementItem[] = [
  {
    code: 'PDZ010000',
    title: '일반진단서',
    price: '20,000',
    updated: '-',
  },
  {
    code: 'PDZ010002',
    title: '근로능력평가용 진단서',
    price: '20,000',
    updated: '-',
  },
  {
    code: 'PDZ070002',
    title: '장애진단서',
    price: '40,000',
    updated: '-',
  },
  {
    code: 'PDZ080000',
    title: '병무용 진단서',
    price: '30,000',
    updated: '-',
  },
  {
    code: '-',
    title: '소견서',
    price: '20,000',
    updated: '-',
  },
  {
    code: 'PDZ090004',
    title: '통원확인서',
    price: '3,000',
    updated: '-',
  },
  {
    code: 'PDZ090007',
    title: '진료확인서',
    price: '3,000',
    updated: '-',
  },
  {
    code: 'PDZ110101',
    title: '진료기록사본 (1~5매)',
    price: '1,000 (1매당)',
    updated: '-',
  },
  {
    code: 'PDZ110102',
    title: '진료기록사본 (6매 이상)',
    price: '100 (1매당)',
    updated: '-',
  },
  {
    code: 'PDZ160000',
    title: '제증명서 사본',
    price: '1,000',
    updated: '-',
  },
  {
    code: 'PDZ170000',
    title: '장애인증명서',
    price: '1,000',
    updated: '-',
  },
];

export const treatments: ReimbursementItem[] = [
  {
    code: 'FY894',
    title: '자율신경계이상검사 (HRV)',
    price: '30,000',
    updated: '-',
  },
  {
    code: 'FZ690',
    title: 'CAT 주의력검사',
    price: '120,000',
    updated: '-',
  },
  {
    code: 'FY713',
    title: '신경증우울평가',
    price: '100,000',
    updated: '-',
  },
  {
    code: 'FY737',
    title: '이화방어기제',
    price: '100,000',
    updated: '-',
  },
  {
    code: 'FY701',
    title: '불안민감척도',
    price: '50,000~100,000',
    updated: '-',
  },
  {
    code: 'FY705',
    title: '신경증불안평가',
    price: '50,000',
    updated: '-',
  },
  {
    code: 'FZ689',
    title: '언어전반진단검사',
    price: '230,000',
    updated: '-',
  },
  {
    code: 'MZ006',
    title: '언어치료',
    price: '80,000~100,000',
    updated: '-',
  },
];
