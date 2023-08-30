import { Metadata, ResolvingMetadata } from 'next';

import { siteConfig } from '@/config/site';

export const defaultMetadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    '흑석정신건강의학과',
    '흑석정신건강',
    '흑석정신과',
    '흑석상담',
    '흑석심리',
    '흑석심리상담',
    '흑석언어치료',
    '흑석놀이치료',
    '흑석발달센터',
    '흑석양육',
    '흑석육아종합지원센터',
    '동작정신건강의학과',
    '동작정신건강',
    '동작정신과',
    '동작상담',
    '동작심리',
    '동작심리상담',
    '동작언어치료',
    '동작놀이치료',
    '동작발달센터',
    '동작양육',
    '동작육아종합지원센터',
    '반포정신건강의학과',
    '반포정신건강',
    '반포정신과',
    '반포상담',
    '반포심리',
    '반포심리상담',
    '반포언어치료',
    '반포놀이치료',
    '반포발달센터',
    '반포양육',
    '반포육아종합지원센터',
    '중앙대정신건강의학과',
    '중앙대정신건강',
    '중앙대정신과',
    '중앙대상담',
    '중앙대심리',
    '중앙대심리상담',
    '중앙대언어치료',
    '중앙대놀이치료',
    '중앙대발달센터',
    '중앙대양육',
    '중앙대육아종합지원센터',
    '원불교소태산기념관정신건강의학과',
    '원불교소태산기념관정신건강',
    '원불교소태산기념관정신과',
    '원불교소태산기념관상담',
    '원불교소태산기념관심리',
    '원불교소태산기념관심리상담',
    '원불교소태산기념관언어치료',
    '원불교소태산기념관놀이치료',
    '원불교소태산기념관발달센터',
    '원불교소태산기념관양육',
    '원불교소태산기념관육아종합지원센터',
    '우을증정신건강의학과',
    '우을증정신건강',
    '우을증정신과',
    '우을증상담',
    '우을증심리',
    '우을증심리상담',
    '우을증언어치료',
    '우을증놀이치료',
    '우을증발달센터',
    '우을증양육',
    '우을증육아종합지원센터',
    '우울정신건강의학과',
    '우울정신건강',
    '우울정신과',
    '우울상담',
    '우울심리',
    '우울심리상담',
    '우울언어치료',
    '우울놀이치료',
    '우울발달센터',
    '우울양육',
    '우울육아종합지원센터',
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
