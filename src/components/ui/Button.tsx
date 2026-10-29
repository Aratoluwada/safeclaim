/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'secondary',
      size = 'md',
      disabled,
      isLoading = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-medium transition-colors select-none cursor-pointer focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-md';

    const sizes = {
      sm: 'text-xs h-8 px-2.5 gap-1.5 min-h-[36px] sm:min-h-[32px]',
      md: 'text-sm h-10 px-3.5 gap-2 min-h-[44px] sm:min-h-[40px]',
      lg: 'text-base h-11 px-4.5 gap-2.5 min-h-[44px]',
    }[size];

    const variants = {
      primary:
        'bg-[#0A5C36] hover:bg-[#074628] active:bg-[#05331E] text-white border border-[#0A5C36] dark:bg-[#0A5C36] dark:hover:bg-[#0c6b3f] shadow-xs',
      secondary:
        'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 shadow-2xs',
      outline:
        'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700',
      ghost:
        'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-transparent',
      danger:
        'bg-red-700 hover:bg-red-800 text-white border border-red-700 dark:bg-red-800 dark:hover:bg-red-700 shadow-xs',
      subtle:
        'bg-[#EBF4EF] hover:bg-[#D9EBDF] text-[#0A5C36] dark:bg-[#0D2D1E] dark:hover:bg-[#123B28] dark:text-[#6EE7B7] border border-[#C2DEC9] dark:border-[#1F4A33]',
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${base} ${sizes} ${variants} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <span
              className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
              aria-hidden="true"
            />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
