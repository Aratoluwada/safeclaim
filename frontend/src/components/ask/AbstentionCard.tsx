/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, Share2 } from 'lucide-react';
import { Citation, HotlineInfo, LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { VerdictStamp } from '../common/VerdictStamp';
import { GuidanceGapIllustration } from '../illustrations';
import { ShareVerdictModal } from './ShareVerdictModal';
import { Button } from '../ui/Button';

interface AbstentionCardProps {
  question: string;
  abstentionReason: string | null;
  explanation: string;
  hotlineInfo: HotlineInfo | null;
  language: LanguageCode;
  onAskAnother: () => void;
  citations?: Citation[];
  isIllustrative?: boolean;
  retrieval?: { top_score: number; threshold: number; passages_evaluated: number };
}

export const AbstentionCard: React.FC<AbstentionCardProps> = ({
  question,
  abstentionReason,
  explanation,
  hotlineInfo,
  language,
  onAskAnother,
  citations = [],
  isIllustrative = false,
  retrieval,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
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
      className="rounded-2xl border-2 border-[#FDE68A] dark:border-[#B45309]/50 bg-white dark:bg-[#201C17] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-[#FFFBEB] dark:bg-[#291F11] border-b border-[#FDE68A] dark:border-[#B45309]/40 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {isIllustrative || citations.length > 0 ? (
            <VerdictStamp verdict="NOT_VALIDATED" size="sm" rotate={false} />
          ) : (
            <VerdictStamp verdict="NO_OFFICIAL_SOURCE_FOUND" size="sm" rotate={false} />
          )}
          <span className="text-xs font-mono font-bold text-[#B45309] dark:text-[#FCD34D]">
            {t.abstentionHeading}
          </span>
        </div>

        <Button variant="secondary" size="sm" onClick={() => setIsShareOpen(true)} className="font-bold">
          <Share2 className="w-3.5 h-3.5 text-[#B45309] dark:text-[#FCD34D]" />
          <span>Share Alert</span>
        </Button>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* User Question */}
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#63584C] dark:text-[#A89E90]">
            Claim Evaluated:
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1F1B16] dark:text-[#F4EEE4] mt-1 text-left leading-snug">
            &ldquo;{question}&rdquo;
          </h2>
        </div>

        {/* Guidance Gap Explanation with spot illustration */}
        <div className="rounded-xl border-2 border-[#FDE68A] dark:border-[#B45309]/50 bg-[#FFFBEB]/70 dark:bg-[#251A0E]/60 p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="shrink-0">
            <GuidanceGapIllustration size={80} />
          </div>

          <div className="space-y-3 flex-1 text-center sm:text-left">
            <h3 className="font-display font-bold text-lg text-[#92400E] dark:text-[#FDE68A]">
              {t.abstentionLead}
            </h3>
            <p className="text-sm text-[#1F1B16] dark:text-[#F4EEE4] leading-relaxed font-body">
              {explanation}
            </p>

            {retrieval && (
              <p className="text-xs font-mono text-[#63584C] dark:text-[#A89E90]">
                Raw TF-IDF match: {retrieval.top_score.toFixed(3)} / threshold {retrieval.threshold.toFixed(3)}; not a confidence score.
              </p>
            )}

            <div className="border-t border-[#FDE68A]/80 dark:border-[#B45309]/40 pt-3 text-xs text-[#92400E] dark:text-[#FCD34D] leading-relaxed font-mono">
              <strong>Limit:</strong> {isIllustrative ? 'Demo Mode is a UI preview and does not search sources.' : citations.length > 0 ? 'Retrieved passages are potentially relevant only; their support for this question has not been validated.' : 'No matching passage in this index does not prove that no official guidance exists or that the claim is false.'}
            </div>
          </div>
        </div>

        {citations.length > 0 && (
          <section className="space-y-3" aria-label="Retrieved source passages">
            <h3 className="text-xs font-mono font-bold uppercase">Retrieved passages (not validated)</h3>
            {citations.map((citation) => (
              <article key={citation.passage_id} className="border rounded-lg p-3 space-y-1">
                <p className="text-xs font-bold">{citation.publisher}: {citation.doc_title}</p>
                <p className="text-sm">{citation.excerpt}</p>
                <a href={citation.url} target="_blank" rel="noopener noreferrer" className="text-xs underline">Open source</a>
              </article>
            ))}
          </section>
        )}

        {/* Semantic list of official portals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#63584C] dark:text-[#A89E90]">
              Direct Official Portals to Monitor:
            </h4>
            <span className="text-xs font-mono text-[#8E8273]">
              Toll-Free Emergency: 6232
            </span>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 m-0 p-0 list-none">
            {portals.map((portal) => (
              <li key={portal.url} className="m-0 p-0">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] hover:border-accent bg-[#FAF7F2] dark:bg-[#1A1612] hover:bg-white dark:hover:bg-[#221C16] transition flex items-center justify-between group focus-ring min-h-[48px] shadow-2xs"
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1F1B16] dark:text-[#F4EEE4] group-hover:text-accent">
                      {portal.name}
                    </span>
                    <span className="text-[11px] text-[#8E8273] font-mono">{portal.domain}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8E8273] group-hover:text-accent" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="pt-2">
          <Button variant="secondary" size="md" onClick={onAskAnother} className="font-bold">
            {t.askAnotherButton}
          </Button>
        </div>
      </div>

      {/* Share modal */}
      <ShareVerdictModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        query={question}
        response={{
          question,
          language,
          grounded: false,
          abstention_reason: abstentionReason,
          answer: explanation,
          hotline_info: hotlineInfo,
          citations: [],
        }}
        language={language}
      />
    </div>
  );
};
