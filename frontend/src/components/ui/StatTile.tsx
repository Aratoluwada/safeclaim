/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export interface StatTileProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  accent?: 'neutral' | 'brand' | 'indigo' | 'sky' | 'violet' | 'orchid' | 'contradicted' | 'gap';
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  hint,
  accent = 'neutral',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const accentTopBorder = {
    neutral: 'border-t-[#D4C5B3] dark:border-t-[#3D352C]',
    brand: 'border-t-accent',
    indigo: 'border-t-[#27358F] dark:border-t-[#AEB9FF]',
    sky: 'border-t-[#0B5F8A] dark:border-t-[#8FD3F4]',
    violet: 'border-t-[#5B3FA6] dark:border-t-[#C5B3F5]',
    orchid: 'border-t-[#8A2F7D] dark:border-t-[#E9A6DD]',
    contradicted: 'border-t-[#B91C1C] dark:border-t-[#EF4444]',
    gap: 'border-t-[#B45309] dark:border-t-[#F59E0B]',
  }[accent];

  // Non-verdict tiles get a soft tinted fill; verdict tiles (contradicted / gap) stay on neutral surfaces
  const accentFill = {
    neutral: 'bg-white dark:bg-[#201C17]',
    brand: 'bg-sage-soft',
    indigo: 'bg-indigo-soft',
    sky: 'bg-sky-soft',
    violet: 'bg-violet-soft',
    orchid: 'bg-orchid-soft',
    contradicted: 'bg-white dark:bg-[#201C17]',
    gap: 'bg-white dark:bg-[#201C17]',
  }[accent];

  const numericVal = typeof value === 'number' ? value : null;
  const [displayNum, setDisplayNum] = useState<number>(numericVal ?? 0);

  useEffect(() => {
    if (numericVal === null || shouldReduceMotion) {
      return;
    }
    const duration = 500;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayNum(Math.round(eased * numericVal));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    const reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [numericVal, shouldReduceMotion]);

  return (
    <div
      className={`${accentFill} border border-[#D4C5B3] dark:border-[#3D352C] border-t-4 ${accentTopBorder} rounded-2xl p-4 sm:p-5 shadow-xs transition-colors ${className}`}
    >
      <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#63584C] dark:text-[#A89E90]">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1B16] dark:text-[#F4EEE4] tabular-nums">
          {numericVal !== null ? (shouldReduceMotion ? numericVal : displayNum) : value}
        </span>
      </div>
      {hint && (
        <div className="mt-2.5 pt-2 border-t border-[#E8DFD5] dark:border-[#2D261F] text-xs text-[#63584C] dark:text-[#A89E90] font-body">
          {hint}
        </div>
      )}
    </div>
  );
};
