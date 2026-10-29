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
  accent?: 'neutral' | 'brand' | 'contradicted' | 'gap';
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
    neutral: 'border-t-neutral-300 dark:border-t-neutral-700',
    brand: 'border-t-[#0A5C36] dark:border-t-emerald-500',
    contradicted: 'border-t-red-600 dark:border-t-red-500',
    gap: 'border-t-amber-500 dark:border-t-amber-400',
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
      className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-t-2 ${accentTopBorder} rounded-md p-4 transition-colors ${className}`}
    >
      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 tabular-nums">
          {numericVal !== null ? (shouldReduceMotion ? numericVal : displayNum) : value}
        </span>
      </div>
      {hint && (
        <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-400">
          {hint}
        </div>
      )}
    </div>
  );
};

