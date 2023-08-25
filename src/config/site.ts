export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: '나란히정신건강의학과의원',
  description: '함께 서있지만 너무 가깝지 않고, 또 너무 멀지도 않게, 나란히.',
  mainNav: [
    { title: '병원소개', href: '/about-hospital' },
    { title: '심리발달센터', href: '/about-center' },
    { title: '내부시설', href: '/facilities' },
    { title: '병원 프로그램', href: '/hospital-programs' },
    { title: '센터 프로그램', href: '/center-programs' },
    { title: '공지사항', href: '/notice' },
    { title: '오시는 길', href: '/contact-us' },
  ],
  links: {
    naverBlog: 'https://blog.naver.com/naranhiclinic',
    kakao: 'https://github.com/shadcn/ui',
    instagram: 'https://ui.shadcn.com',
  },
};
