import { Inter as FontSans, JetBrains_Mono as FontMono } from 'next/font/google';
import localFont from 'next/font/local';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const naranhiFont = localFont({
  src: './ridibatang.woff2',
  display: 'swap'
})
