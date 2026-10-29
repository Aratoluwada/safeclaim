/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, ExternalLink, HelpCircle, ShieldAlert, PhoneCall } from 'lucide-react';
import { HotlineInfo, LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { VerdictBadge } from '../common/VerdictBadge';

interface AbstentionCardProps {
  question: string;
  abstentionReason: string | null;
  explanation: string;
  hotlineInfo: HotlineInfo | null;
  language: LanguageCode;
  onAskAnother: () => void;
}

export const AbstentionCard: React.FC<AbstentionCardProps> = ({
  question,
  abstentionReason,
  explanation,
  hotlineInfo,
  language,
  onAskAnother,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div
      role="region"
      aria-label="Abstention notice"
      className="rounded-2xl border-2 border-amber-300 bg-white shadow-md overflow-hidden"
    >
      {/* Top Banner */}
      <div className="bg-amber-500/10 border-b border-amber-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <VerdictBadge verdict="NO_OFFICIAL_SOURCE_FOUND" size="md" />
          <span className="text-xs font-semibold text-amber-900">
            {t.abstentionHeading}
          </span>
        </div>
        <span className="text-xs text-amber-800 font-medium">
          Source Repository Abstention
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* User Question Echo */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Query Submitted:
          </span>
          <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            &ldquo;{question}&rdquo;
          </p>
        </div>

        {/* Abstention Explanation Callout */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-amber-950">
                {t.abstentionLead}
              </h4>
              <p className="text-sm text-amber-900/90 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>

          <div className="border-t border-amber-200/80 pt-3 text-xs text-amber-800 leading-relaxed font-medium">
            <strong>Important Fact-Checking Principle:</strong> A missing official record is <em>not</em> proof that a claim is false, but indicates that no credible federal or state authority has formally validated or published guidance on it.
          </div>
        </div>

        {/* Official Portals Directory */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Consult Official Federal & State Portals:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://ncdc.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 transition group flex items-center justify-between"
            >
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  NCDC Disease Alerts
                </span>
                <span className="text-[11px] text-slate-500 font-mono">ncdc.gov.ng</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
            </a>

            <a
              href="https://fccpc.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 transition group flex items-center justify-between"
            >
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  FCCPC Consumer Portal
                </span>
                <span className="text-[11px] text-slate-500 font-mono">fccpc.gov.ng</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
            </a>

            <a
              href="https://nhia.gov.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 transition group flex items-center justify-between"
            >
              <div>
                <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  NHIA Health Insurance
                </span>
                <span className="text-[11px] text-slate-500 font-mono">nhia.gov.ng</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onAskAnother}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition cursor-pointer shadow-sm"
          >
            {t.askAnotherButton}
          </button>
        </div>
      </div>
    </div>
  );
};
