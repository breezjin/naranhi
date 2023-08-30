export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: '나란히정신건강의학과의원',
  description: '함께 서있지만 너무 가깝지 않고, 또 너무 멀지도 않게, 나란히.',
  mainNav: [
    { title: '병원소개', href: '/about-hospital' },
    { title: '병원 진료안내', href: '/hospital-programs' },
    { title: '상담/심리발달센터', href: '/about-center' },
    { title: '내부시설', href: '/facilities' },
    { title: '공지사항', href: '/notice' },
    { title: '예약/오시는 길', href: '/contact-us' },
  ],
  snsNav: [
    {
      title: '네이버 블로그',
      href: 'https://blog.naver.com/naranhiclinic',
      image: '/icons/sns-logo-naver-blog.png',
    },
    {
      title: '카카오 채널',
      href: 'http://pf.kakao.com/_VAAlG',
      image: '/icons/sns-logo-kakao-channel.png',
    },
    {
      title: '인스타그램',
      href: 'https://www.instagram.com/naranhi_clinic',
      image: '/icons/sns-logo-instagram.png',
    },
  ],
  links: {
    naverBlog: 'https://blog.naver.com/naranhiclinic',
    kakao: 'https://github.com/shadcn/ui',
    instagram: 'https://ui.shadcn.com',
  },
};
