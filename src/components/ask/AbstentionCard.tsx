/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, Share2 } from 'lucide-react';
import { HotlineInfo, LanguageCode } from '../../types/api';
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
}

export const AbstentionCard: React.FC<AbstentionCardProps> = ({
  question,
  abstentionReason,
  explanation,
  hotlineInfo,
  language,
  onAskAnother,
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
          <VerdictStamp
            verdict="NO_OFFICIAL_SOURCE_FOUND"
            size="sm"
            rotate={false}
          />
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
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1F1B16] dark:text-[#EDE7DF] mt-1 text-left leading-snug">
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
            <p className="text-sm text-[#1F1B16] dark:text-[#EDE7DF] leading-relaxed font-body">
              {explanation}
            </p>

            <div className="border-t border-[#FDE68A]/80 dark:border-[#B45309]/40 pt-3 text-xs text-[#92400E] dark:text-[#FCD34D] leading-relaxed font-mono">
              <strong>Institutional Policy:</strong> A missing publication in our repository does not prove that a claim is false. It means no approved government agency has verified or addressed it.
            </div>
          </div>
        </div>

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
                  className="p-3.5 rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] hover:border-[#0A5C36] dark:hover:border-[#34D399] bg-[#FAF7F2] dark:bg-[#1A1612] hover:bg-white dark:hover:bg-[#221C16] transition flex items-center justify-between group focus-ring min-h-[48px] shadow-2xs"
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1F1B16] dark:text-[#EDE7DF] group-hover:text-[#0A5C36] dark:group-hover:text-[#34D399]">
                      {portal.name}
                    </span>
                    <span className="text-[11px] text-[#8E8273] font-mono">{portal.domain}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8E8273] group-hover:text-[#0A5C36] dark:group-hover:text-[#34D399]" aria-hidden="true" />
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
