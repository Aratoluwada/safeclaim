/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VerdictLabel } from '../../types/api';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: VerdictLabel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  customLabel?: string;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  size = 'md',
  showIcon = true,
  customLabel,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  switch (verdict) {
    case 'CONTRADICTED_BY_OFFICIAL_SOURCE':
      return (
        <span
          className={`inline-flex items-center rounded-[4px] border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/70 text-red-800 dark:text-red-200 font-medium ${sizeClasses}`}
          title="Contradicted by Official Source"
        >
          {showIcon && <XCircle className="w-3.5 h-3.5 text-red-700 dark:text-red-400 shrink-0" aria-hidden="true" />}
          <span>{customLabel || 'Contradicted by Official Source'}</span>
        </span>
      );

    case 'SUPPORTED_BY_OFFICIAL_SOURCE':
      return (
        <span
          className={`inline-flex items-center rounded-[4px] border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 font-medium ${sizeClasses}`}
          title="Supported by Official Source"
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />}
          <span>{customLabel || 'Supported by Official Source'}</span>
        </span>
      );

    case 'NO_OFFICIAL_SOURCE_FOUND':
    default:
      return (
        <span
          className={`inline-flex items-center rounded-[4px] border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 font-medium ${sizeClasses}`}
          title="No Official Source Found"
        >
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />}
          <span>{customLabel || 'No Official Source Found'}</span>
        </span>
      );
  }
};
