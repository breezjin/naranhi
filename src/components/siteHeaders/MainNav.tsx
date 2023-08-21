import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { buttonVariants } from '@/components/ui/button';
import narahiLogo from '@/imgs/naranhi-logo-color.png';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/nav';

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className='flex gap-8 md:gap-10'>
      <Link href='/' className='flex items-center gap-3'>
        <div className='relative w-64 h-7'>
          <Image src={narahiLogo} fill alt='naranhi-logo' />
        </div>
      </Link>
      {items?.length ? (
        <nav className='flex items-center gap-6'>
          {items?.map(
            (item, index) =>
              item.href && (
                <Link key={index} href={item.href} rel='noreferrer'>
                  <div
                    className={buttonVariants({
                      size: 'sm',
                      variant: 'ghost',
                    })}
                  >
                    {item.title}
                  </div>
                </Link>
              ),
          )}
        </nav>
      ) : null}
    </div>
  );
}
