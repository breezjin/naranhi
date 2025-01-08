import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

import { ModeToggle } from '../layouts/ThemeToggle';
import ArrowLink from '../links/ArrowLink';

import { NavItem } from '@/types/nav';

interface MainNavProps {
  mainItems?: NavItem[];
  snsItems?: NavItem[];
}

export function MainNav({ mainItems, snsItems }: MainNavProps) {
  return (
    <div className="flex gap-6 max-md:w-full max-md:justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative h-7 w-64 max-md:h-6 max-md:w-56">
          <Image
            src={'/imgs/naranhi-logo-color.png'}
            fill
            priority
            alt="naranhi-logo"
          />
        </div>
      </Link>
      {mainItems?.length ? (
        <nav className="flex items-center gap-4 max-xl:hidden">
          {mainItems?.map(
            (mainItem, index) =>
              mainItem.href && (
                <Link key={index} href={mainItem.href} rel="noreferrer">
                  <div
                    className={cn(
                      buttonVariants({
                        size: 'sm',
                        variant: 'ghost',
                      }),
                      ''
                    )}
                  >
                    {mainItem.title}
                  </div>
                </Link>
              )
          )}
        </nav>
      ) : null}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="xl:hidden">
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent className="min-w-[375px]">
          <SheetHeader>
            <SheetTitle className="max-sm:text-sm">Menu</SheetTitle>
            {/* <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription> */}
          </SheetHeader>
          <div className="space-y-8 py-12">
            {mainItems?.length ? (
              <nav className="flex flex-col gap-4 text-2xl font-bold">
                {mainItems?.map(
                  (mainItem, index) =>
                    mainItem.href && (
                      <SheetClose key={index} asChild>
                        <ArrowLink
                          key={index}
                          href={mainItem.href}
                          rel="noreferrer"
                        >
                          <div
                            className={cn(
                              buttonVariants({
                                size: 'sm',
                                variant: 'ghost',
                              }),
                              'text-lg font-bold'
                            )}
                          >
                            {mainItem.title}
                          </div>
                        </ArrowLink>
                      </SheetClose>
                    )
                )}
              </nav>
            ) : null}
            <nav className="flex justify-between text-2xl">
              <div className="flex">
                {snsItems?.map(
                  (snsItem, index) =>
                    snsItem.href &&
                    snsItem.image && (
                      <>
                        <Link
                          href={snsItem.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div
                            className={buttonVariants({
                              size: 'sm',
                              variant: 'ghost',
                            })}
                          >
                            <Image
                              src={snsItem.image}
                              width={32}
                              height={32}
                              alt={snsItem.title}
                            />
                          </div>
                        </Link>
                      </>
                    )
                )}
              </div>
              <ModeToggle />
            </nav>
          </div>
          <SheetFooter className="w-full p-4">
            <SheetClose asChild>
              <Button type="submit" className="w-full">
                닫기
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
