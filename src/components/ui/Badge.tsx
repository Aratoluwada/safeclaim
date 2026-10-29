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
      'bg-[#F5EFEB] dark:bg-[#2D261F] text-[#2D261F] dark:text-[#E8DFD5] border border-[#E8DFD5] dark:border-[#3D352C]',
    brand:
      'bg-accent-tint dark:bg-accent-tint text-accent dark:text-[#6EE7B7] border border-accent-border font-semibold',
    outline:
      'bg-transparent text-[#4A4036] dark:text-[#CFC6B8] border border-[#D4C5B3] dark:border-[#3D352C]',
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
