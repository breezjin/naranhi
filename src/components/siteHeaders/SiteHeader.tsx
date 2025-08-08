import Image from 'next/image';
import Link from 'next/link';

import Icons from '@/components/Icons';
import { ModeToggle } from '@/components/layouts/ThemeToggle';
import { MainNav } from '@/components/siteHeaders/MainNav';
import { buttonVariants } from '@/components/ui/button';
import ShortcutHelp from '@/components/ui/ShortcutHelp';

import { siteConfig } from '@/config/site';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background px-8 max-md:px-4">
      <div className="flex h-16 items-center justify-between">
        <MainNav mainItems={siteConfig.mainNav} snsItems={siteConfig.snsNav} />
        <div className="flex items-center justify-end gap-4 max-md:hidden">
          <nav className="flex items-center gap-4">
            <div className="flex">
              {siteConfig.snsNav?.map(
                (snsItem, index) =>
                  snsItem.href &&
                  snsItem.image && (
                    <Link
                      key={index}
                      href={snsItem.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div
                        key={`d-${index}`}
                        className={buttonVariants({
                          size: 'sm',
                          variant: 'ghost',
                        })}
                      >
                        <Image
                          src={snsItem.image}
                          width={28}
                          height={28}
                          alt={snsItem.title}
                        />
                      </div>
                    </Link>
                  )
              )}
            </div>
            <ShortcutHelp variant="icon" />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
