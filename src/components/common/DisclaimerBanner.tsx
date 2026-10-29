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
      className="bg-[#0A5C36] text-white border-b border-[#074628] px-4 py-2 text-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" aria-hidden="true" />
          <p className="font-medium">
            <span className="font-semibold text-emerald-200 mr-1.5 uppercase font-mono text-[10px] tracking-wider px-1 py-0.2 border border-emerald-500/50 rounded-[2px]">
              Notice
            </span>
            {t.disclaimer}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-emerald-200 text-xs shrink-0 font-mono">
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          <span>NCDC &bull; FCCPC &bull; NHIA &bull; FMOH</span>
        </div>
      </div>
    </div>
  );
};
