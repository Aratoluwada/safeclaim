/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';

interface DisclaimerBannerProps {
  language: LanguageCode;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <div
      role="note"
      aria-label="Public service disclaimer"
      className="bg-emerald-950 text-emerald-100 border-b border-emerald-900/60 px-4 py-2.5 text-xs sm:text-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <p className="font-medium text-emerald-100">
            <span className="font-bold text-white uppercase tracking-wide text-[11px] mr-1.5 px-1.5 py-0.5 rounded bg-emerald-900 border border-emerald-700/60">
              Official Verification
            </span>
            {t.disclaimer}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-emerald-300 text-xs shrink-0 font-medium">
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Grounded in NCDC, FCCPC, NHIA, FMOH</span>
        </div>
      </div>
    </div>
  );
};
