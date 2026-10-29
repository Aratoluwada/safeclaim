/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Share2,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { AskResponse, LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { VerdictBadge } from '../common/VerdictBadge';
import { HotlineAlert } from './HotlineAlert';
import { SourceCard } from './SourceCard';

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
            className={`inline-flex items-center font-mono font-bold text-xs mx-1 px-1.5 py-0.5 rounded-md transition cursor-pointer ${
              isSelected
                ? 'bg-emerald-800 text-white ring-2 ring-emerald-500 ring-offset-1'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
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
      className="rounded-2xl border-2 border-emerald-600/30 bg-white shadow-xl overflow-hidden"
    >
      {/* Top Header */}
      <div className="bg-emerald-50/80 border-b border-emerald-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800 text-white font-bold text-xs shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            {t.groundedHeading}
          </span>
          <span className="text-xs text-emerald-900 font-semibold hidden sm:inline">
            Grounded in Federal Advisories
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 shadow-2xs transition cursor-pointer"
            title="Copy answer to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Answer</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-7">
        {/* User Question Echo */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            User Question:
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {response.question}
          </h2>
        </div>

        {/* Model Answer Body */}
        <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-5 sm:p-6 shadow-inner">
          <div className="text-base sm:text-lg text-slate-800 leading-relaxed space-y-3 font-normal">
            <p>{renderFormattedAnswer(response.answer)}</p>
          </div>
        </div>

        {/* Emergency Hotline Alert if present */}
        {response.hotline_info && (
          <HotlineAlert hotline={response.hotline_info} language={language} />
        )}

        {/* Verified Sources Accordion */}
        {response.citations && response.citations.length > 0 && (
          <section aria-labelledby="citations-section-heading" className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" aria-hidden="true" />
                <h3 id="citations-section-heading" className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  {t.citationsHeading} ({response.citations.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Click any citation tag above to jump to evidence
              </span>
            </div>

            <div className="space-y-3">
              {response.citations.map((citation, index) => (
                <SourceCard
                  key={citation.passage_id || index}
                  citation={citation}
                  index={index}
                  isHighlighted={highlightedPassageId === citation.passage_id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Strict zero-hallucination constraint enforced against official repository.</span>
          </div>

          <button
            type="button"
            onClick={onAskAnother}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition cursor-pointer"
          >
            <span>{t.askAnotherButton}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
