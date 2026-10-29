/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  actions,
  className = '',
}) => {
  return (
    <header className={`rounded-[1.75rem] bg-accent-tint border border-accent-border px-5 py-6 sm:px-8 sm:py-8 mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          {eyebrow && (
            <div className="inline-flex items-center rounded-md bg-accent-solid px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-white">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1F1B16] dark:text-[#F4EEE4] text-left leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-base sm:text-lg text-[#63584C] dark:text-[#A89E90] leading-relaxed max-w-2xl text-left font-body">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0 flex items-center gap-2.5">{actions}</div>}
      </div>
    </header>
  );
};
