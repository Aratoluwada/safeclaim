/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, FileText, Landmark } from 'lucide-react';
import { Citation } from '../../types/api';

interface SourceCardProps {
  citation: Citation;
  index: number;
  isHighlighted?: boolean;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  citation,
  index,
  isHighlighted = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <article
      id={`source-${citation.passage_id}`}
      className={`rounded-2xl transition-all ${
        isHighlighted
          ? 'border-2 border-accent bg-accent-tint/60 dark:bg-accent-tint/60 ring-4 ring-accent/20'
          : 'border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17]'
      } shadow-xs overflow-hidden`}
    >
      <header className="p-3.5 sm:p-4 bg-[#F5EFEB] dark:bg-[#1C1814] border-b border-[#E8DFD5] dark:border-[#2D261F] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#0A5C36] text-white font-mono text-xs font-bold shadow-2xs">
            {index + 1}
          </span>
          <div className="flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F1B16] dark:text-[#F4EEE4]">
              {citation.publisher}
            </span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-[#2A241E] border border-[#D4C5B3] dark:border-[#3D352C] text-[#63584C] dark:text-[#A89E90]">
            Passage: {citation.passage_id}
          </span>
          <span className={`font-mono text-[11px] px-2 py-0.5 rounded-md border font-semibold ${
            citation.verification_status === 'verified'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
          }`}>
            Provenance: {citation.verification_status || 'unverified'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-accent hover:underline"
            title="Open the source URL recorded in the corpus manifest"
          >
            <span>Source URL</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer p-1.5 text-[#63584C] hover:text-[#1F1B16] dark:text-[#A89E90] dark:hover:text-[#F4EEE4] rounded-lg hover:bg-[#E8DFD5]/50 dark:hover:bg-[#2D261F]/50 focus-ring"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse excerpt' : 'Expand excerpt'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-3.5">
          <h4 className="font-display font-bold text-base text-[#1F1B16] dark:text-[#F4EEE4] leading-snug">
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent hover:underline flex items-start gap-2"
            >
              <FileText className="w-4 h-4 text-accent shrink-0 mt-1" aria-hidden="true" />
              <span>{citation.doc_title}</span>
            </a>
          </h4>

          {/* Authentic pulled excerpt blockquote */}
          <blockquote className="official-document-sheet rounded-xl p-4 sm:p-4.5 border-l-4 border-l-accent text-sm text-[#1F1B16] dark:text-[#F4EEE4] font-body italic leading-relaxed">
            <div className="font-mono text-[10px] font-bold text-accent not-italic uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Indexed passage excerpt (unverified source provenance):</span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 uppercase">
                {citation.verification_status || 'unverified'}
              </span>
            </div>
            &ldquo;{citation.excerpt}&rdquo;
          </blockquote>
        </div>
      )}
    </article>
  );
};
