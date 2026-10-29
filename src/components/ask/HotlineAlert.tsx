/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhoneCall, MessageSquare, AlertOctagon, ExternalLink } from 'lucide-react';
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
      aria-label="Official emergency hotline advisory"
      className="rounded-2xl border-2 border-emerald-600/30 bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-teal-50 p-4 sm:p-5 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
            <PhoneCall className="w-5 h-5 text-emerald-300" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded">
                {t.hotlineCalloutPrefix}
              </span>
              <span className="text-xs text-emerald-800 font-medium">Verified Agency Channel</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              {hotline.name}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.hotlineCalloutAction}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
          {/* Primary Toll-Free Call button */}
          <a
            href={`tel:${hotline.number.replace(/\s+/g, '')}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-sm transition cursor-pointer"
            title={`Call toll-free ${hotline.number}`}
          >
            <PhoneCall className="w-4 h-4 text-emerald-300" />
            <span>Toll-Free: {hotline.number}</span>
          </a>

          {/* Alternate number or WhatsApp */}
          {hotline.alt_number && (
            <a
              href={`https://wa.me/${hotline.alt_number.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-300 shadow-xs transition cursor-pointer"
              title="Official WhatsApp Channel"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp: {hotline.alt_number}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
};
