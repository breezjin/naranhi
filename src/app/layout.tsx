/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';

import '@/styles/globals.css';

import Analytics from '@/components/layouts/Analytics';
import { AOSInit } from '@/components/layouts/aos';
import Footer from '@/components/layouts/Footer';
import { TailwindIndicator } from '@/components/layouts/TailwindIndicator';
import { ThemeProvider } from '@/components/layouts/ThemeProvider';
import { SiteHeader } from '@/components/siteHeaders/SiteHeader';

import { defaultMetadata } from '@/lib/defaultMetadata';
import { naranhiFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services,clusterer&autoload=false`;
export const metadata: Metadata = defaultMetadata;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang='ko' suppressHydrationWarning>
        <AOSInit />
        <head />
        <body
          className={cn('min-h-screen min-w-full bg-background antialiased', naranhiFont.className)}
        >
          <Script src={KAKAO_SDK_URL} strategy='beforeInteractive' />
          <Suspense>
            <Analytics />
          </Suspense>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <div className='flex w-full flex-col'>
              <SiteHeader />
              <section>{children}</section>
              <Footer />
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
