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
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  switch (verdict) {
    case 'CONTRADICTED_BY_OFFICIAL_SOURCE':
      return (
        <span
          className={`inline-flex items-center rounded-full border border-red-200 bg-red-50 text-red-700 ${sizeClasses}`}
          title="Contradicted by Official Source"
        >
          {showIcon && <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />}
          <span>{customLabel || 'Contradicted by Official Source'}</span>
        </span>
      );

    case 'SUPPORTED_BY_OFFICIAL_SOURCE':
      return (
        <span
          className={`inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 ${sizeClasses}`}
          title="Supported by Official Source"
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          <span>{customLabel || 'Supported by Official Source'}</span>
        </span>
      );

    case 'NO_OFFICIAL_SOURCE_FOUND':
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full border border-amber-300 bg-amber-50 text-amber-900 ${sizeClasses}`}
          title="No Official Source Found"
        >
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          <span>{customLabel || 'No Official Source Found'}</span>
        </span>
      );
  }
};
