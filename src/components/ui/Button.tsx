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
      'inline-flex items-center justify-center font-medium transition-all select-none cursor-pointer focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-xl active:scale-[0.98]';

    const sizes = {
      sm: 'text-xs h-8 px-3 gap-1.5 min-h-[36px] sm:min-h-[32px]',
      md: 'text-sm h-10 px-4 gap-2 min-h-[44px] sm:min-h-[40px]',
      lg: 'text-base h-11 px-5 gap-2.5 min-h-[44px]',
    }[size];

    const variants = {
      primary:
        'bg-[#0A5C36] hover:bg-[#074528] active:bg-[#05331E] text-[#FAF4E8] border border-[#0A5C36] shadow-xs font-semibold',
      secondary:
        'bg-white dark:bg-[#25201A] hover:bg-[#F5EFEB] dark:hover:bg-[#2F2821] text-[#1F1B16] dark:text-[#EDE7DF] border border-[#D4C5B3] dark:border-[#3D352C] shadow-xs',
      outline:
        'bg-transparent hover:bg-[#F5EFEB] dark:hover:bg-[#25201A] text-[#1F1B16] dark:text-[#EDE7DF] border border-[#D4C5B3] dark:border-[#3D352C]',
      ghost:
        'bg-transparent hover:bg-[#F5EFEB] dark:hover:bg-[#25201A] text-[#63584C] dark:text-[#A89E90] hover:text-[#1F1B16] dark:hover:text-[#EDE7DF] border border-transparent',
      danger:
        'bg-[#B91C1C] hover:bg-[#991B1B] text-white border border-[#B91C1C] shadow-xs',
      subtle:
        'bg-[#EBF4EF] hover:bg-[#D4E8DC] text-[#0A5C36] dark:bg-[#192E22] dark:hover:bg-[#233F2E] dark:text-[#6EE7B7] border border-[#BBD8C3] dark:border-[#2D563D] font-semibold',
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
