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
      className="rounded-md border border-emerald-300 dark:border-emerald-800 bg-[#EBF4EF]/70 dark:bg-[#0D2D1E]/60 p-4 border-l-4 border-l-[#0A5C36] dark:border-l-emerald-500"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-[2px] bg-[#0A5C36] text-white">
              {t.hotlineCalloutPrefix}
            </span>
            <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
              Verified Agency Channel
            </span>
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {hotline.name}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            {t.hotlineCalloutAction}
          </p>
        </div>

        {/* Semantic list of hotline contact actions */}
        <ul className="flex flex-wrap items-center gap-2 m-0 p-0 list-none">
          <li className="m-0 p-0">
            <a
              href={`tel:${hotline.number.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#0A5C36] hover:bg-[#074628] text-white text-xs font-semibold shadow-2xs transition focus-ring min-h-[44px]"
              title={`Call toll-free ${hotline.number}`}
            >
              <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Toll-Free: {hotline.number}</span>
            </a>
          </li>

          {hotline.alt_number && (
            <li className="m-0 p-0">
              <a
                href={`https://wa.me/${hotline.alt_number.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold border border-neutral-300 dark:border-neutral-700 shadow-2xs transition focus-ring min-h-[44px]"
                title="Official WhatsApp Channel"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#0A5C36] dark:text-emerald-400" aria-hidden="true" />
                <span>WhatsApp: {hotline.alt_number}</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" aria-hidden="true" />
              </a>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};
