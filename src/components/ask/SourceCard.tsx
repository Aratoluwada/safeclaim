/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, FileText } from 'lucide-react';
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
      className={`rounded-md border transition-colors ${
        isHighlighted
          ? 'border-[#0A5C36] dark:border-emerald-500 bg-[#EBF4EF]/40 dark:bg-[#0D2D1E]/40 ring-2 ring-[#0A5C36]/30'
          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
      }`}
    >
      <header className="p-3.5 bg-neutral-50/80 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-[2px] bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 font-mono text-[10px] font-bold">
            {index + 1}
          </span>
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase font-mono">
            {citation.publisher}
          </span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[2px] bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
            {citation.passage_id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#0A5C36] dark:text-emerald-400 hover:underline"
            title="Open official government publication"
          >
            <span>Official Circular</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded cursor-pointer focus-ring"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse excerpt' : 'Expand excerpt'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {isExpanded && (
        <div className="p-4 space-y-3">
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0A5C36] dark:hover:text-emerald-400 hover:underline flex items-start gap-1.5"
            >
              <FileText className="w-4 h-4 text-[#0A5C36] dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{citation.doc_title}</span>
            </a>
          </h4>

          {/* Distinct official quote rule making evidence the hero */}
          <blockquote className="border-l-3 border-[#0A5C36] dark:border-emerald-500 bg-neutral-50 dark:bg-neutral-950/60 pl-3.5 py-2.5 pr-3 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-serif italic leading-relaxed">
            <span className="font-mono text-[10px] font-bold text-[#0A5C36] dark:text-emerald-400 not-italic uppercase tracking-wider block mb-1">
              Verbatim Government Passage:
            </span>
            &ldquo;{citation.excerpt}&rdquo;
          </blockquote>
        </div>
      )}
    </article>
  );
};
