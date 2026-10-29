/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { HotlineInfo, LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { VerdictBadge } from '../common/VerdictBadge';
import { Button } from '../ui/Button';

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

  const portals = [
    { name: 'NCDC Disease Alerts', url: 'https://ncdc.gov.ng', domain: 'ncdc.gov.ng' },
    { name: 'FCCPC Lending Register', url: 'https://fccpc.gov.ng', domain: 'fccpc.gov.ng' },
    { name: 'NHIA Health Guidelines', url: 'https://nhia.gov.ng', domain: 'nhia.gov.ng' },
  ];

  return (
    <div
      role="region"
      aria-label="Abstention notice"
      className="rounded-md border border-amber-300 dark:border-amber-800 bg-white dark:bg-neutral-900 shadow-2xs overflow-hidden"
    >
      {/* Header */}
      <div className="bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/80 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <VerdictBadge verdict="NO_OFFICIAL_SOURCE_FOUND" size="sm" />
          <span className="text-xs font-mono font-semibold text-amber-900 dark:text-amber-200">
            {t.abstentionHeading}
          </span>
        </div>
        <span className="text-xs font-mono text-amber-800 dark:text-amber-300">
          Database Abstention
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* User Question */}
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Query Submitted:
          </span>
          <p className="font-serif text-lg sm:text-xl font-medium text-neutral-900 dark:text-neutral-100 mt-0.5">
            &ldquo;{question}&rdquo;
          </p>
        </div>

        {/* Abstention Explanation Callout with left accent rule */}
        <div className="rounded-md border border-amber-200 dark:border-amber-800/80 border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/30 p-4 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                {t.abstentionLead}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {explanation}
              </p>
            </div>
          </div>

          <div className="border-t border-amber-200/80 dark:border-amber-800/60 pt-2 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-mono">
            <strong>Fact-Checking Policy:</strong> A missing source in our database is not proof that a claim is false. It indicates that no relevant guidance was found in the verified repository.
          </div>
        </div>

        {/* Semantic list of official portals */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Consult Approved Official Portals:
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 m-0 p-0 list-none">
            {portals.map((portal) => (
              <li key={portal.url} className="m-0 p-0">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-950/60 transition flex items-center justify-between group focus-ring min-h-[44px]"
                >
                  <div>
                    <span className="block text-xs font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-[#0A5C36] dark:group-hover:text-emerald-400">
                      {portal.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">{portal.domain}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="pt-2">
          <Button variant="secondary" size="md" onClick={onAskAnother}>
            {t.askAnotherButton}
          </Button>
        </div>
      </div>
    </div>
  );
};
