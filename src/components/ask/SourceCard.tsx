/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, BookmarkCheck, FileText } from 'lucide-react';
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
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isHighlighted
          ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/30'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <header className="p-4 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-800 text-white font-mono text-xs font-bold">
            {index + 1}
          </span>
          <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
            {citation.publisher}
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-semibold">
            {citation.passage_id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
            title="Open official government publication"
          >
            <span>Official Circular</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse excerpt' : 'Expand excerpt'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {isExpanded && (
        <div className="p-4 space-y-2.5">
          <h4 className="text-sm font-bold text-slate-900 leading-snug">
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-800 hover:underline flex items-start gap-1.5"
            >
              <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{citation.doc_title}</span>
            </a>
          </h4>

          <div className="rounded-lg bg-slate-50 border border-slate-200/70 p-3 text-xs sm:text-sm text-slate-700 leading-relaxed italic relative">
            <span className="font-bold text-emerald-800 not-italic uppercase tracking-wider text-[10px] block mb-1">
              Verified Government Passage Excerpt:
            </span>
            &ldquo;{citation.excerpt}&rdquo;
          </div>
        </div>
      )}
    </article>
  );
};
