/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'outline' | 'bordered' | 'document';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      padding = 'md',
      ...props
    },
    ref
  ) => {
    const base = 'rounded-2xl transition-colors';

    const variants = {
      default:
        'bg-white dark:bg-[#201C17] border border-[#D4C5B3] dark:border-[#3D352C] text-[#1F1B16] dark:text-[#EDE7DF] shadow-xs',
      subtle:
        'bg-[#F5EFEB] dark:bg-[#1C1814] border border-[#E8DFD5] dark:border-[#332B23] text-[#1F1B16] dark:text-[#EDE7DF]',
      outline:
        'bg-transparent border border-[#D4C5B3] dark:border-[#3D352C] text-[#1F1B16] dark:text-[#EDE7DF]',
      bordered:
        'bg-white dark:bg-[#201C17] border-2 border-[#D4C5B3] dark:border-[#3D352C] text-[#1F1B16] dark:text-[#EDE7DF] shadow-xs',
      document:
        'official-document-sheet text-[#1F1B16] dark:text-[#EDE7DF]',
    }[variant];

    const paddings = {
      none: '',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-5',
      lg: 'p-6 sm:p-7',
    }[padding];

    return (
      <div
        ref={ref}
        className={`${base} ${variants} ${paddings} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
