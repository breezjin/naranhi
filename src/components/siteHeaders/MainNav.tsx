import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/nav';

import ArrowLink from '../links/ArrowLink';

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className='flex gap-6 max-md:w-full max-md:justify-between'>
      <Link href='/' className='flex items-center'>
        <div className='relative w-64 h-7 max-md:w-56 max-md:h-6'>
          <Image src={'/imgs/naranhi-logo-color.png'} fill alt='naranhi-logo' />
        </div>
      </Link>
      {items?.length ? (
        <nav className='flex items-center gap-4 max-xl:hidden'>
          {items?.map(
            (item, index) =>
              item.href && (
                <Link key={index} href={item.href} rel='noreferrer'>
                  <div
                    className={cn(buttonVariants({
                      size: 'sm',
                      variant: 'ghost',
                    }), '')}
                  >
                    {item.title}
                  </div>
                </Link>
              ),
          )}
        </nav>
      ) : null}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' className='xl:hidden'>Menu</Button>
        </SheetTrigger>
        <SheetContent className='min-w-[375px]'>
          <SheetHeader>
            <SheetTitle className='max-sm:text-sm'>Menu</SheetTitle>
            {/* <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription> */}
          </SheetHeader>
          <div className='py-12 space-y-16'>
            {items?.length ? (
              <nav className='flex flex-col gap-4 text-2xl font-bold'>
                {items?.map(
                  (item, index) =>
                    item.href && (
                      <ArrowLink key={index} href={item.href} rel='noreferrer'>
                        <div
                          className={cn(buttonVariants({
                            size: 'sm',
                            variant: 'ghost',
                          }), 'text-lg font-bold')}
                        >
                          {item.title}
                        </div>
                      </ArrowLink>
                    ),
                  )}
              </nav>
              ) : null
            }
          </div>
          <SheetFooter className='w-full p-4'>
            <SheetClose asChild>
              <Button type="submit" className='w-full'>닫기</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
