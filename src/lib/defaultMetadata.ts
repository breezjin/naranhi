import { Metadata, ResolvingMetadata } from 'next';

import { siteConfig } from '@/config/site';

export const defaultMetadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    '흑석상담',
    '동작정신과',
    '동작상담',
    '흑석심리상담',
    '동작심리상담',
    '흑석언어치료',
    '흑석놀이치료',
    '흑석발달센터',
    '정신분석',
    '나란히',
    '원불교소태산기념관',
    '동작발달센터',
    '동작정신과',
    '동작심리발달센터',
    '동작심리상담',
    '동작언어치료',
    '동작놀이치료',
    '흑석정신과',
    '흑석심리발달센터',
    '나란히',
    '원불교소태산기념관',
    '흑석언어치료',
    '흑석놀이치료',
    '흑석양육',
    '동작육아종합지원센터',
    '흑석정신건강의학과',
    '나란히정신건강의학과',
    '흑석',
    '원불교소태산기념관',
    '흑석뚜스뚜스',
    '동작정신과',
    '흑석정신과',
    '동작심리',
    '흑석심리',
    '언어치료',
    '흑석정신과',
    '놀이치료',
    '인지치료',
    '나란히심리발달센터',
    '나란히정신건강의학과의원',
    '흑석심리발달센터',
    '원불교소태산기념관',
    '흑석발달',
    '흑석심리',
    '흑석인지치료',
    '동작언어치료',
    '동작인지치료',
    '동작놀이치료',
    '동작심리',
    '흑석정신건강의학과',
    '흑석정신과',
    '동작구정신과',
    '나란히',
    '정신건강',
    '우울증',
    '심리상담',
    '심리치료',
    '우울',
    '정신건강의학과',
    '동작',
    '흑석',
    '흑석놀이치료',
    '흑석언어치료',
    '중앙대',
  ],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: 'favicon/favicon.ico',
    shortcut: 'favicon/favicon-16x16.png',
    apple: 'favicon/apple-touch-icon.png',
  },
  openGraph: {
    description: siteConfig.description,
    images: ['/imgs/meta/large-og.png', '/imgs/meta/large-og2.png'],
    writers: '',
  },
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
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

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
