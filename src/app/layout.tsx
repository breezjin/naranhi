import '@/styles/globals.css';

import { Metadata } from 'next';

import { TailwindIndicator } from '@/components/layouts/TailwindIndicator';
import { ThemeProvider } from '@/components/layouts/ThemeProvider';
import { SiteHeader } from '@/components/siteHeaders/SiteHeader';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: 'favicon/favicon.ico',
    shortcut: 'favicon/favicon-16x16.png',
    apple: 'favicon/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang='ko' suppressHydrationWarning>
        <head />
        <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <div className='flex w-full flex-col'>
              <section className=''>{children}</section>
            </div>
            {/* <TailwindIndicator /> */}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
