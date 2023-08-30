/* eslint-disable tailwindcss/no-custom-classname */
import * as React from 'react';

import UnstyledLink, { UnstyledLinkProps } from '@/components/links/UnstyledLink';

import { cn } from '@/lib/utils';

const PrimaryLink = React.forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={cn(
          'inline-flex items-center',
          'text-primary-600 hover:text-primary-500 font-medium',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:rounded focus-visible:ring focus-visible:ring-offset-2',
          className
        )}
      >
        {children}
      </UnstyledLink>
    );
  }
);

PrimaryLink.displayName = 'PrimaryLink';
export default PrimaryLink;
