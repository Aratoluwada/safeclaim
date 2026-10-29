/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VerdictLabel } from '../../types/api';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface VerdictStampProps {
  verdict: VerdictLabel;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showIcon?: boolean;
  customLabel?: string;
  rotate?: boolean;
}

export const VerdictStamp: React.FC<VerdictStampProps> = ({
  verdict,
  size = 'md',
  showIcon = true,
  customLabel,
  rotate = true,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 border-[1.5px]',
    md: 'text-xs px-2.5 py-1 gap-1.5 border-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2 border-2',
    hero: 'text-base sm:text-lg px-4 py-2 gap-2.5 border-[2.5px] tracking-wide',
  }[size];

  const rotationClass = rotate ? 'transform -rotate-1.5 hover:rotate-0 transition-transform' : '';

  switch (verdict) {
    case 'CONTRADICTED_BY_OFFICIAL_SOURCE':
      return (
        <span
          className={`inline-flex items-center font-mono font-bold uppercase rounded-[3px] border-[#B91C1C] text-[#B91C1C] bg-[#FEF2F2] dark:bg-[#2A1515] dark:border-[#EF4444] dark:text-[#FCA5A5] shadow-xs select-none ${rotationClass} ${sizeClasses}`}
          style={{ boxShadow: 'inset 0 0 0 1px rgba(185, 28, 28, 0.25)' }}
          title="Verdict: Contradicted by Official Source"
        >
          {showIcon && <XCircle className="w-4 h-4 shrink-0 stroke-[2.5]" aria-hidden="true" />}
          <span>{customLabel || 'Contradicted by Official Source'}</span>
        </span>
      );

    case 'SUPPORTED_BY_OFFICIAL_SOURCE':
      return (
        <span
          className={`inline-flex items-center font-mono font-bold uppercase rounded-[3px] border-[#15803D] text-[#15803D] bg-[#F0FDF4] dark:bg-accent-tint dark:border-[#22C55E] dark:text-[#86EFAC] shadow-xs select-none ${rotationClass} ${sizeClasses}`}
          style={{ boxShadow: 'inset 0 0 0 1px rgba(21, 128, 61, 0.25)' }}
          title="Verdict: Supported by Official Source"
        >
          {showIcon && <CheckCircle2 className="w-4 h-4 shrink-0 stroke-[2.5]" aria-hidden="true" />}
          <span>{customLabel || 'Supported by Official Source'}</span>
        </span>
      );

    case 'NO_OFFICIAL_SOURCE_FOUND':
    default:
      return (
        <span
          className={`inline-flex items-center font-mono font-bold uppercase rounded-[3px] border-[#B45309] text-[#B45309] bg-[#FFFBEB] dark:bg-[#2B1F0E] dark:border-[#F59E0B] dark:text-[#FCD34D] shadow-xs select-none ${rotationClass} ${sizeClasses}`}
          style={{ boxShadow: 'inset 0 0 0 1px rgba(180, 83, 9, 0.25)' }}
          title="Verdict: No Official Source Found"
        >
          {showIcon && <AlertTriangle className="w-4 h-4 shrink-0 stroke-[2.5]" aria-hidden="true" />}
          <span>{customLabel || 'No Official Source Found'}</span>
        </span>
      );
  }
};
