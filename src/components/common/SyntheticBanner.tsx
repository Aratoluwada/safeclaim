/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, Database } from 'lucide-react';
import { TRANSLATIONS } from '../../utils/translations';
import { LanguageCode } from '../../types/api';
import { Button } from '../ui/Button';

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
      className="bg-[#1F1B16] text-[#E8DFD5] border-b border-[#3D352C] px-4 py-2 text-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-[2px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Synthetic Benchmark
          </span>
          <p className="font-medium text-[#E8DFD5]">
            {t.syntheticDemoBanner}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline text-xs font-mono text-[#A89E90]">
            Zero PII &bull; 6 Benchmark Clusters &bull; Grounded Citations
          </span>
          {onReloadDemo && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onReloadDemo}
              disabled={isReloading}
              className="text-xs h-7 py-0 px-2 !bg-[#2D261F] hover:!bg-[#3D352C] !text-[#E8DFD5] !border-[#52473B]"
              title="Reset sample records to initial pristine state"
            >
              <RefreshCw className={`w-3 h-3 ${isReloading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isReloading ? 'Resetting...' : 'Reload Synthetic Demo'}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
