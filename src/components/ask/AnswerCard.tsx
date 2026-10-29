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
} from 'lucide-react';
import { AskResponse, LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { HotlineAlert } from './HotlineAlert';
import { SourceCard } from './SourceCard';
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
            className={`inline-flex items-center font-mono font-semibold text-xs mx-1 px-1.5 py-0.5 rounded-[3px] transition cursor-pointer focus-ring ${
              isSelected
                ? 'bg-[#0A5C36] text-white ring-2 ring-[#0A5C36]/50'
                : 'bg-[#EBF4EF] dark:bg-[#0D2D1E] hover:bg-[#d5ebd9] text-[#0A5C36] dark:text-emerald-300 border border-[#C2DEC9] dark:border-[#1F4A33]'
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
      aria-label="Verified grounded response"
      className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs overflow-hidden"
    >
      {/* Header bar */}
      <div className="bg-[#EBF4EF]/70 dark:bg-[#0D2D1E]/40 border-b border-[#C2DEC9]/80 dark:border-neutral-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-[#0A5C36] text-white font-medium text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
            {t.groundedHeading}
          </span>
          <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 hidden sm:inline">
            Official Public Record
          </span>
        </div>

        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-500" aria-hidden="true" />
              <span>Copy Answer</span>
            </>
          )}
        </Button>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* User Question */}
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            User Question:
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mt-1 text-left">
            {response.question}
          </h2>
        </div>

        {/* Answer body in Newsreader serif for editorial clarity */}
        <div className="rounded-md bg-neutral-50/70 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 p-5">
          <div className="font-serif text-base sm:text-lg text-neutral-900 dark:text-neutral-100 leading-relaxed space-y-3 font-normal text-left">
            <p>{renderFormattedAnswer(response.answer)}</p>
          </div>
        </div>

        {/* Emergency Hotline Alert if present */}
        {response.hotline_info && (
          <HotlineAlert hotline={response.hotline_info} language={language} />
        )}

        {/* Semantic list of citations */}
        {response.citations && response.citations.length > 0 && (
          <section aria-labelledby="citations-section-heading" className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0A5C36] dark:text-emerald-400" aria-hidden="true" />
                <h3 id="citations-section-heading" className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                  {t.citationsHeading} ({response.citations.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                Click [citation] tags above to jump to evidence
              </span>
            </div>

            <ul className="space-y-3 m-0 p-0 list-none">
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
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#0A5C36] dark:text-emerald-400" aria-hidden="true" />
            <span>Strict zero-hallucination constraint applied against official repository.</span>
          </div>

          <Button variant="primary" size="md" onClick={onAskAnother}>
            <span>{t.askAnotherButton}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
