/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  BookOpen,
  Copy,
  Check,
  Flame,
  ExternalLink,
  Send,
} from 'lucide-react';
import { ClaimCluster } from '../../types/api';
import { VerdictBadge } from '../common/VerdictBadge';
import { Button } from '../ui/Button';

interface ClusterDrawerProps {
  cluster: ClaimCluster | null;
  onClose: () => void;
}

export const ClusterDrawer: React.FC<ClusterDrawerProps> = ({ cluster, onClose }) => {
  const [copiedReply, setCopiedReply] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && cluster) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cluster, onClose]);

  if (!cluster) return null;

  const handleCopyReply = () => {
    if (cluster.verdict.suggested_reply) {
      navigator.clipboard.writeText(cluster.verdict.suggested_reply);
      setCopiedReply(true);
      setTimeout(() => setCopiedReply(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <aside className="w-screen max-w-lg bg-white dark:bg-neutral-900 shadow-xl flex flex-col h-full border-l border-neutral-200 dark:border-neutral-800">
          {/* Header */}
          <header className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/70 dark:bg-neutral-950/40">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded-[2px] bg-neutral-200 dark:bg-neutral-800">
                {cluster.cluster_id}
              </span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded-[2px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 capitalize">
                {cluster.domain.replace('_', ' ')}
              </span>
              {cluster.is_guidance_gap && (
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-[2px] bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600" aria-hidden="true" />
                  Guidance Gap
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition cursor-pointer focus-ring"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Representative Claim Header */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Representative Claim
              </span>
              <h2 id="drawer-title" className="font-serif text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                {cluster.representative_claim}
              </h2>
              <div className="pt-1">
                <VerdictBadge verdict={cluster.verdict.label} size="md" />
              </div>
            </div>

            {/* Velocity & Timestamps Metadata Tile */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-md bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
              <div>
                <span className="text-neutral-500 block text-[11px]">Volume & Velocity:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {cluster.message_count} msgs ({cluster.growth_rate_24h || '0%'} 24h)
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Languages:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                  {cluster.languages_seen.map((l) => (l === 'pcm' ? 'Naijá Pidgin' : 'English')).join(', ')}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-neutral-500 text-[10px]">
                <span>First: {new Date(cluster.first_seen).toLocaleString()}</span>
                <span>Latest: {new Date(cluster.last_seen).toLocaleString()}</span>
              </div>
            </div>

            {/* Analytical Verdict Explanation */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Analytical Verdict Explanation
              </span>
              <div className="p-3.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                {cluster.verdict.short_explanation}
              </div>
            </div>

            {/* Suggested Broadcast Response with left accent rule */}
            {cluster.verdict.suggested_reply && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#0A5C36] dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Send className="w-3 h-3" />
                    Suggested Broadcast Response
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReply}
                    className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#0A5C36] dark:text-emerald-400 hover:underline cursor-pointer focus-ring"
                  >
                    {copiedReply ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Response</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3.5 rounded-md bg-[#EBF4EF]/60 dark:bg-[#0D2D1E]/40 border-l-3 border-l-[#0A5C36] dark:border-l-emerald-500 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 font-serif leading-relaxed italic">
                  &ldquo;{cluster.verdict.suggested_reply}&rdquo;
                </div>
              </div>
            )}

            {/* Semantic list of 3 Street Sample Messages */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3 text-neutral-400" />
                Circulating Street Phrasing (3 Sample Quotes)
              </span>
              <ul className="space-y-2 m-0 p-0 list-none">
                {cluster.sample_messages.map((msg, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 font-mono leading-relaxed"
                  >
                    <span className="text-neutral-400 font-bold mr-2 text-[10px]">#{idx + 1}</span>
                    &ldquo;{msg}&rdquo;
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Evidence Passages */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-neutral-400" />
                Official Verified Evidence Passages
              </span>
              {cluster.verdict.evidence_passages && cluster.verdict.evidence_passages.length > 0 ? (
                <ul className="space-y-2.5 m-0 p-0 list-none">
                  {cluster.verdict.evidence_passages.map((ev, i) => (
                    <li
                      key={i}
                      className="p-3.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-[11px] uppercase">
                          {ev.publisher}
                        </span>
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-medium text-[#0A5C36] dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Circular</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">{ev.doc_title}</p>
                      <blockquote className="border-l-2 border-[#0A5C36] pl-2.5 py-1 text-neutral-600 dark:text-neutral-400 font-serif italic text-xs">
                        &ldquo;{ev.excerpt}&rdquo;
                      </blockquote>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3.5 rounded-md border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-xs text-amber-900 dark:text-amber-200 font-mono">
                  <strong>Zero Official Guidance on File:</strong> No verified government circulars or clinical bulletins match this rumour yet. Recommended for agency risk communication press release.
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-400">
              SafeClaim Institutional Desk
            </span>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close Drawer
            </Button>
          </footer>
        </aside>
      </div>
    </div>
  );
};
