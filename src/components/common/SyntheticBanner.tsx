/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, Sparkles, RefreshCw } from 'lucide-react';
import { TRANSLATIONS } from '../../utils/translations';
import { LanguageCode } from '../../types/api';

interface SyntheticBannerProps {
  language: LanguageCode;
  onReloadDemo?: () => void;
  isReloading?: boolean;
}

export const SyntheticBanner: React.FC<SyntheticBannerProps> = ({
  language,
  onReloadDemo,
  isReloading = false,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div
      role="region"
      aria-label="Synthetic dataset alert"
      className="bg-slate-900 text-slate-200 border-b border-slate-800 px-4 py-2.5 text-xs sm:text-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Synthetic Testbed
          </span>
          <p className="font-medium text-slate-200">
            {t.syntheticDemoBanner}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline text-xs text-slate-400">
            Zero PII &bull; Deterministic Benchmark Clusters &bull; Grounded Official Citations
          </span>
          {onReloadDemo && (
            <button
              onClick={onReloadDemo}
              disabled={isReloading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Reset sample records to initial pristine state"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isReloading ? 'Resetting...' : 'Reload Synthetic Demo'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
