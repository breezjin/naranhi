import * as React from 'react';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/links/UnstyledLink';

import { cn } from '@/lib/utils';

enum ButtonVariant {
  'primary',
  'outline',
  'ghost',
  'light',
  'dark',
}

type ButtonLinkProps = {
  isDarkBg?: boolean;
  variant?: keyof typeof ButtonVariant;
} & UnstyledLinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    { children, className, variant = 'primary', isDarkBg = false, ...rest },
    ref
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={cn(
          'inline-flex items-center rounded px-4 py-2 font-semibold',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-primary-500 text-white',
              'border-primary-600 border',
              'hover:bg-primary-600 hover:text-white',
              'active:bg-primary-500',
              'disabled:bg-primary-400 disabled:hover:bg-primary-400',
            ],
            variant === 'outline' && [
              'text-primary-500',
              'border-primary-500 border',
              'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'text-primary-500',
              'shadow-none',
              'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'light' && [
              'text-dark bg-white',
              'border border-gray-300',
              'hover:text-dark hover:bg-gray-100',
              'active:bg-white/80 disabled:bg-gray-200',
            ],
            variant === 'dark' && [
              'bg-gray-900 text-white',
              'border border-gray-600',
              'hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
            ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          className
        )}
      >
        {children}
      </UnstyledLink>
    );
  }
);

ButtonLink.displayName = 'ButtonLink';
export default ButtonLink;
