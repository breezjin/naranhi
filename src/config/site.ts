export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: '나란히 정신건강의학과의원 & 심리발달센터',
  description: '함께 서있지만 너무 가깝지 않고, 또 너무 멀지도 않게, 나란히.',
  mainNav: [
    { title: '홈', href: '/' },
    { title: '병원소개', href: '/about-hospital' },
    { title: '센터소개', href: '/about-center' },
    { title: '진료과목', href: '/medical-department' },
    { title: '병원 프로그램', href: '/medical-programs' },
    { title: '센터 프로그램', href: '/center-programs' },
    { title: '찾아오시는 길', href: '/contact-us' },
  ],
  links: {
    naverBlog: 'https://twitter.com/shadcn',
    kakao: 'https://github.com/shadcn/ui',
    instagram: 'https://ui.shadcn.com',
  },
};
