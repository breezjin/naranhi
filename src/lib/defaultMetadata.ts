import { Metadata } from 'next';

import { siteConfig } from '@/config/site';

export const defaultMetadata: Metadata = {
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