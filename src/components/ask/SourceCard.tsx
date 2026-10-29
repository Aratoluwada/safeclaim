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
          ? 'border-2 border-[#0A5C36] dark:border-[#34D399] bg-[#EBF4EF]/60 dark:bg-[#12281B]/60 ring-4 ring-[#0A5C36]/20'
          : 'border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17]'
      } shadow-xs overflow-hidden`}
    >
      <header className="p-3.5 sm:p-4 bg-[#F5EFEB] dark:bg-[#1C1814] border-b border-[#E8DFD5] dark:border-[#2D261F] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#0A5C36] text-white font-mono text-xs font-bold shadow-2xs">
            {index + 1}
          </span>
          <div className="flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-[#0A5C36] dark:text-[#34D399]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1F1B16] dark:text-[#EDE7DF]">
              {citation.publisher}
            </span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-[#2A241E] border border-[#D4C5B3] dark:border-[#3D352C] text-[#63584C] dark:text-[#A89E90]">
            Passage: {citation.passage_id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#0A5C36] dark:text-[#34D399] hover:underline"
            title="Open official government publication"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer p-1.5 text-[#63584C] hover:text-[#1F1B16] dark:text-[#A89E90] dark:hover:text-[#EDE7DF] rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50 focus-ring"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse excerpt' : 'Expand excerpt'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-3.5">
          <h4 className="font-display font-bold text-base text-[#1F1B16] dark:text-[#EDE7DF] leading-snug">
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0A5C36] dark:hover:text-[#34D399] hover:underline flex items-start gap-2"
            >
              <FileText className="w-4 h-4 text-[#0A5C36] dark:text-[#34D399] shrink-0 mt-1" aria-hidden="true" />
              <span>{citation.doc_title}</span>
            </a>
          </h4>

          {/* Authentic pulled excerpt blockquote */}
          <blockquote className="official-document-sheet rounded-xl p-4 sm:p-4.5 border-l-4 border-l-[#0A5C36] dark:border-l-[#34D399] text-sm text-[#1F1B16] dark:text-[#EDE7DF] font-body italic leading-relaxed">
            <div className="font-mono text-[10px] font-bold text-[#0A5C36] dark:text-[#34D399] not-italic uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Verbatim Official Circular Excerpt:</span>
              <span className="font-hand text-sm text-[#24306E] dark:text-[#8BA0E8]">Direct Official Receipt</span>
            </div>
            &ldquo;{citation.excerpt}&rdquo;
          </blockquote>
        </div>
      )}
    </article>
  );
};
