import Image from 'next/image';
import Link from 'next/link';

import Icons from '@/components/Icons';
import { ModeToggle } from '@/components/layouts/ThemeToggle';
import { MainNav } from '@/components/siteHeaders/MainNav';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background px-8'>
      <div className='flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
        <MainNav items={siteConfig.mainNav} />
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='flex items-center space-x-0'>
            <div className='flex gap-0'>
              <Link href={siteConfig.links.naverBlog} target='_blank' rel='noreferrer'>
                <div
                  className={buttonVariants({
                    size: 'sm',
                    variant: 'ghost',
                  })}
                >
                  <Image src={'/icons/naver_btnG_circle.png'} width={24} height={24} alt='네이버아이콘'/>
                  <span className='sr-only'>GitHub</span>
                </div>
              </Link>
              <Link href={siteConfig.links.naverBlog} target='_blank' rel='noreferrer'>
                <div
                  className={buttonVariants({
                    size: 'sm',
                    variant: 'ghost',
                  })}
                >
                  <Image src={'/icons/kakao.png'} width={24} height={24} alt='카카오아이콘'/>
                  <span className='sr-only'>GitHub</span>
                </div>
              </Link>
            </div>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
