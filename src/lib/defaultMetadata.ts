import { Metadata, ResolvingMetadata } from 'next';

import { siteConfig } from '@/config/site';

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://www.naranhi.com'),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    '흑석 정신건강의학과',
    '흑석 정신건강',
    '흑석 정신과',
    '흑석 상담',
    '흑석 심리',
    '흑석 심리상담',
    '흑석 언어치료',
    '흑석 놀이치료',
    '흑석 발달센터',
    '흑석 양육',
    '흑석 육아종합지원센터',
    '동작 정신건강의학과',
    '동작 정신건강',
    '동작 정신과',
    '동작 상담',
    '동작 심리',
    '동작 심리상담',
    '동작 언어치료',
    '동작 놀이치료',
    '동작 발달센터',
    '동작 양육',
    '동작 육아종합지원센터',
    '반포 정신건강의학과',
    '반포 정신건강',
    '반포 정신과',
    '반포 상담',
    '반포 심리',
    '반포 심리상담',
    '반포 언어치료',
    '반포 놀이치료',
    '반포 발달센터',
    '반포 양육',
    '반포 육아종합지원센터',
    '중앙대 정신건강의학과',
    '중앙대 정신건강',
    '중앙대 정신과',
    '중앙대 상담',
    '중앙대 심리',
    '중앙대 심리상담',
    '중앙대 언어치료',
    '중앙대 놀이치료',
    '중앙대 발달센터',
    '중앙대 양육',
    '중앙대 육아종합지원센터',
    '원불교소태산기념관 정신건강의학과',
    '원불교소태산기념관 정신건강',
    '원불교소태산기념관 정신과',
    '원불교소태산기념관 상담',
    '원불교소태산기념관 심리',
    '원불교소태산기념관 심리상담',
    '원불교소태산기념관 언어치료',
    '원불교소태산기념관 놀이치료',
    '원불교소태산기념관 발달센터',
    '원불교소태산기념관 양육',
    '원불교소태산기념관 육아종합지원센터',
    '우을증 정신건강의학과',
    '우을증 정신건강',
    '우을증 정신과',
    '우을증 상담',
    '우을증 심리',
    '우을증 심리상담',
    '우을증 언어치료',
    '우을증 놀이치료',
    '우을증 발달센터',
    '우을증 양육',
    '우을증 육아종합지원센터',
    '우울 정신건강의학과',
    '우울 정신건강',
    '우울 정신과',
    '우울 상담',
    '우울 심리',
    '우울 심리상담',
    '우울 언어치료',
    '우울 놀이치료',
    '우울 발달센터',
    '우울 양육',
    '우울 육아종합지원센터',
  ],
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: 'white' },
  //   { media: '(prefers-color-scheme: dark)', color: 'black' },
  // ],
  icons: {
    icon: '/imgs/meta/favicon-96x96.png',
    shortcut: '/imgs/meta/favicon-16x16.png',
    apple: '/imgs/meta/apple-icon.png',
  },
  openGraph: {
    url: siteConfig.url,
    description: siteConfig.description,
    images: ['/imgs/meta/large-og.png', '/imgs/meta/large-og2.png'],
    writers: '',
  },
  creator: 'Mike(Jinho) Yoon',
  publisher: 'BREEZ Communications LLC',
};

// export const defaultMetadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s - ${siteConfig.name}`,
//   },
//   description: siteConfig.description,
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: 'white' },
//     { media: '(prefers-color-scheme: dark)', color: 'black' },
//   ],
//   icons: {
//     icon: 'favicon/favicon.ico',
//     shortcut: 'favicon/favicon-16x16.png',
//     apple: 'favicon/apple-touch-icon.png',
//   },
// };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { id } = await params;

  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json());

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  };
}
