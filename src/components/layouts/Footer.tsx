import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

interface FooterProps {
  username: string;
  userlink: string;
}

export default function Footer({ username, userlink }: FooterProps) {
  return (
    <footer className='fixed bottom-0 z-50 flex h-6 items-center justify-center bg-black'>
      <div className='ml-2 px-2 text-xs text-gray-400'>
        Since 2007, Copyright © {new Date().getFullYear()} BREEZ Communications LLC
      </div>
      <div className='px-2 text-xs text-gray-400'>|</div>
      <UnstyledLink href='/terms-of-service'>
        <div className='flex h-full items-center px-2 text-xs text-white'>Terms Of Service</div>
      </UnstyledLink>
      <div className='px-2 text-xs text-gray-400'>|</div>
      <UnstyledLink href='/privacy-policy'>
        <div className='flex h-full items-center px-2 text-xs text-white'>Privacy Policy</div>
      </UnstyledLink>
      <div className='px-2 text-xs text-gray-400'>|</div>
      <div className='mr-2 flex h-full items-center px-2 text-xs text-gray-400'>
        Photo by
        <span className='mx-2 text-white'>
          <UnstyledLink
            href={`${userlink}?utm_source=breezfm&utm_medium=referral`}
            openNewTab={true}
          >
            {`${username}`}
          </UnstyledLink>
        </span>
        on
        <span className='ml-2 text-white'>
          <UnstyledLink
            href={'https://unsplash.com/?utm_source=breezfm&utm_medium=referral'}
            openNewTab={true}
          >
            {'Unsplash'}
          </UnstyledLink>
        </span>
      </div>
    </footer>
  );
}
