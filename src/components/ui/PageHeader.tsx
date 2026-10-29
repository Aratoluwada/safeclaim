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
    <header className={`border-b border-[#E8DFD5] dark:border-[#2D261F] pb-6 mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          {eyebrow && (
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A5C36] dark:text-[#34D399]">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1F1B16] dark:text-[#EDE7DF] text-left leading-tight">
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
