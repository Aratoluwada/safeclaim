/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhoneCall, MessageSquare, ExternalLink } from 'lucide-react';
import { HotlineInfo, LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';

interface HotlineAlertProps {
  hotline: HotlineInfo | null;
  language: LanguageCode;
}

export const HotlineAlert: React.FC<HotlineAlertProps> = ({ hotline, language }) => {
  if (!hotline || !hotline.number) {
    return null;
  }

  const t = TRANSLATIONS[language];

  return (
    <aside
      aria-label="Official emergency helpline advisory"
      className="rounded-2xl border-2 border-[#BBD8C3] dark:border-[#2A4B37] bg-[#EBF4EF]/80 dark:bg-[#12281B]/80 p-4 sm:p-5 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#0A5C36] text-white">
              {t.hotlineCalloutPrefix}
            </span>
            <span className="text-xs font-mono text-[#63584C] dark:text-[#A89E90]">
              Official Rapid Response
            </span>
          </div>
          <h3 className="font-display font-bold text-base text-[#1F1B16] dark:text-[#EDE7DF]">
            {hotline.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#63584C] dark:text-[#A89E90] font-body">
            {t.hotlineCalloutAction}
          </p>
        </div>

        {/* Semantic list of hotline contact actions */}
        <ul className="flex flex-wrap items-center gap-2.5 m-0 p-0 list-none">
          <li className="m-0 p-0">
            <a
              href={`tel:${hotline.number.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A5C36] hover:bg-[#074528] text-white text-xs font-mono font-bold shadow-xs transition focus-ring min-h-[44px]"
              title={`Call toll-free ${hotline.number}`}
            >
              <PhoneCall className="w-4 h-4" aria-hidden="true" />
              <span>Toll-Free: {hotline.number}</span>
            </a>
          </li>

          {hotline.alt_number && (
            <li className="m-0 p-0">
              <a
                href={`https://wa.me/${hotline.alt_number.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-[#201C17] hover:bg-[#F5EFEB] dark:hover:bg-[#2A241F] text-[#1F1B16] dark:text-[#EDE7DF] text-xs font-mono font-bold border border-[#D4C5B3] dark:border-[#3D352C] shadow-2xs transition focus-ring min-h-[44px]"
                title="Official WhatsApp Channel"
              >
                <MessageSquare className="w-4 h-4 text-[#0A5C36] dark:text-[#34D399]" aria-hidden="true" />
                <span>WhatsApp: {hotline.alt_number}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#8E8273]" aria-hidden="true" />
              </a>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};
