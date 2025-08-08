/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { Analytics as NextAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';

import '@/styles/globals.css';

import Analytics from '@/components/layouts/Analytics';
import { AOSInit } from '@/components/layouts/aos';
import Footer from '@/components/layouts/Footer';
import GlobalShortcuts from '@/components/layouts/GlobalShortcuts';
import { TailwindIndicator } from '@/components/layouts/TailwindIndicator';
import { ThemeProvider } from '@/components/layouts/ThemeProvider';
import { ThemeSync } from '@/components/layouts/ThemeSync';
import { SiteHeader } from '@/components/siteHeaders/SiteHeader';

import { defaultMetadata } from '@/lib/defaultMetadata';
import { naranhiFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';

const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY;
const KAKAO_SDK_URL = KAKAO_APP_KEY ? `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&libraries=services,clusterer&autoload=false` : null;
export const metadata: Metadata = defaultMetadata;

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="ko" suppressHydrationWarning>
        <head>
          <AOSInit />
        </head>
        <body
          className={cn(
            'min-h-screen min-w-full bg-background antialiased',
            naranhiFont.className
          )}
        >
          {KAKAO_SDK_URL && (
            <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
          )}
          <Suspense>
            <Analytics />
          </Suspense>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Suspense>
              <ThemeSync />
            </Suspense>
            <GlobalShortcuts />
            <section className="flex w-full flex-col">
              <SiteHeader />
              <section>{children}</section>
              <Footer />
            </section>
            <TailwindIndicator />
          </ThemeProvider>
          <NextAnalytics />
          <SpeedInsights />
        </body>
      </html>
    </>
  );
}
