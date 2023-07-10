import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import Icons from '@/components/Icons';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/nav';

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className='flex gap-8 md:gap-10'>
      <Link href='/' className='flex items-center gap-3'>
        {/* <Icons.logo className="h-6 w-6" /> */}
        <span className='flex items-center text-lg'>{siteConfig.name}</span>
        {/* <span className="inline-block font-breez text-2xl">{siteConfig.name}</span> */}
      </Link>
      {items?.length ? (
        <nav className='flex items-center gap-6'>
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'flex items-center text-sm font-medium text-muted-foreground',
                    item.disabled && 'cursor-not-allowed opacity-80',
                  )}
                >
                  {item.title}
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  );
}
