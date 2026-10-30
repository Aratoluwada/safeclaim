/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { AskResponse, LanguageCode, VerdictLabel } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { HotlineAlert } from './HotlineAlert';
import { SourceCard } from './SourceCard';
import { VerdictStamp } from '../common/VerdictStamp';
import { ShareVerdictModal } from './ShareVerdictModal';
import { Button } from '../ui/Button';

interface AnswerCardProps {
  response: AskResponse;
  language: LanguageCode;
  onAskAnother: () => void;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  response,
  language,
  onAskAnother,
}) => {
  const [copied, setCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [highlightedPassageId, setHighlightedPassageId] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  const handleCopy = () => {
    navigator.clipboard.writeText(`${response.question}\n\nSafeClaim AI Answer:\n${response.answer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCitationClick = (passageId: string) => {
    setHighlightedPassageId(passageId);
    const element = document.getElementById(`source-${passageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Determine verdict label
  const verdictLabel: VerdictLabel =
    response.verdict || (response.grounded ? 'SUPPORTED_BY_OFFICIAL_SOURCE' : 'NOT_VALIDATED');

  // Render text with clickable citation badges, e.g. [ncdc#1]
  const renderFormattedAnswer = (text: string) => {
    const parts = text.split(/(\[[a-zA-Z0-9#_\-]+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[([a-zA-Z0-9#_\-]+)\]$/);
      if (match) {
        const passageId = match[1];
        const isSelected = highlightedPassageId === passageId;
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleCitationClick(passageId)}
            className={`cursor-pointer inline-flex items-center font-mono font-bold text-xs mx-1 px-2 py-0.5 rounded-md transition-all focus-ring ${
              isSelected
                ? 'bg-[#0A5C36] text-white ring-2 ring-accent/50 shadow-xs'
                : 'bg-accent-tint dark:bg-accent-tint text-accent border border-accent-border hover:bg-accent-tint-strong'
            }`}
            title={`View official citation for ${passageId}`}
          >
            [{passageId}]
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      role="region"
      aria-label="Retrieved evidence response"
      className="rounded-2xl border-2 border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] shadow-sm overflow-hidden"
    >
      {/* Header bar */}
      <div className="bg-[#FAF7F2] dark:bg-[#1A1612] border-b border-[#E8DFD5] dark:border-[#2D261F] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0A5C36] text-white font-mono font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
            <span>{t.groundedHeading}</span>
          </span>
          <VerdictStamp
            verdict={verdictLabel}
            size="sm"
            rotate={false}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsShareOpen(true)} className="font-bold">
            <Share2 className="w-3.5 h-3.5 text-accent" />
            <span>Share Receipt</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleCopy} className="font-bold">
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#63584C]" aria-hidden="true" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* User Question */}
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#63584C] dark:text-[#A89E90]">
            Claim / Question Evaluated:
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1F1B16] dark:text-[#F4EEE4] mt-1 text-left leading-snug">
            {response.question}
          </h2>
        </div>

        {/* Model's Neighbourly Explanation */}
        <div className="rounded-xl bg-[#FAF7F2] dark:bg-[#1A1612] border border-[#E8DFD5] dark:border-[#2D261F] p-5 sm:p-6 relative">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent mb-2 flex items-center justify-between">
            <span>Official Grounded Summary</span>
            <span className="font-hand text-sm text-[#27358F] dark:text-[#AEB9FF]">
              {language === 'pcm' ? 'As di official paper talk am:' : 'Neighbourly explanation with receipts:'}
            </span>
          </div>
          <div className="font-body text-base sm:text-lg text-[#1F1B16] dark:text-[#F4EEE4] leading-relaxed space-y-3 font-normal text-left">
            <p>{renderFormattedAnswer(response.answer)}</p>
          </div>
        </div>

        {/* Emergency Hotline Alert if present */}
        {response.hotline_info && (
          <HotlineAlert hotline={response.hotline_info} language={language} />
        )}

        {/* Semantic list of citations */}
        {response.citations && response.citations.length > 0 && (
          <section aria-labelledby="citations-section-heading" className="space-y-3.5 pt-2">
            <div className="flex flex-wrap items-center justify-between border-b border-[#E8DFD5] dark:border-[#2D261F] pb-2.5 gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" aria-hidden="true" />
                <h3 id="citations-section-heading" className="font-mono text-xs font-bold text-[#1F1B16] dark:text-[#F4EEE4] uppercase tracking-wider">
                  {t.citationsHeading} ({response.citations.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-[#63584C] dark:text-[#A89E90]">
                Click any [passage] tag above to inspect document
              </span>
            </div>

            <ul className="space-y-3.5 m-0 p-0 list-none">
              {response.citations.map((citation, index) => (
                <li key={citation.passage_id || index} className="m-0 p-0">
                  <SourceCard
                    citation={citation}
                    index={index}
                    isHighlighted={highlightedPassageId === citation.passage_id}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Bottom bar */}
        <div className="pt-4 border-t border-[#E8DFD5] dark:border-[#2D261F] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#63584C] dark:text-[#A89E90] font-mono">
            <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>Answers strictly derived from approved Nigerian government publications.</span>
          </div>

          <Button variant="primary" size="md" onClick={onAskAnother} className="font-bold">
            <span>{t.askAnotherButton}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Share to WhatsApp modal */}
      <ShareVerdictModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        query={response.question}
        response={response}
        language={language}
      />
    </div>
  );
};
