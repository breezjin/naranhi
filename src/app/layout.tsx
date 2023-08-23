import '@/styles/globals.css';

import { Metadata } from 'next';

import { AOSInit } from '@/components/layouts/aos';
import Footer from '@/components/layouts/Footer';
import { TailwindIndicator } from '@/components/layouts/TailwindIndicator';
import { ThemeProvider } from '@/components/layouts/ThemeProvider';
import { SiteHeader } from '@/components/siteHeaders/SiteHeader';
import { defaultMetadata } from '@/lib/defaultMetadata';
import { naranhiFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';

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
        <body className={cn('min-h-screen min-w-[360px] bg-background antialiased', naranhiFont.className)}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <div className='flex w-full flex-col'>
              <SiteHeader />
              <section className='p-8'>{children}</section>
              <Footer />
            </div>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
