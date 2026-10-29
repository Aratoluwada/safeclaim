/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'brand' | 'outline' | 'contradicted' | 'supported' | 'gap';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'neutral',
  size = 'md',
  ...props
}) => {
  const base =
    'inline-flex items-center font-medium select-none rounded-[4px] tracking-normal';

  const sizes = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
  }[size];

  const variants = {
    neutral:
      'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700',
    brand:
      'bg-[#EBF4EF] dark:bg-[#0D2D1E] text-[#0A5C36] dark:text-[#6EE7B7] border border-[#C2DEC9] dark:border-[#1F4A33] font-semibold',
    outline:
      'bg-transparent text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700',
    contradicted:
      'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 font-semibold',
    supported:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-semibold',
    gap:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-semibold',
  }[variant];

  return (
    <span className={`${base} ${sizes} ${variants} ${className}`} {...props}>
      {children}
    </span>
  );
};
