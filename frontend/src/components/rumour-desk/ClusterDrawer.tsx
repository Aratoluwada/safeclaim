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
import { VerdictStamp } from '../common/VerdictStamp';
import { Button } from '../ui/Button';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface ClusterDrawerProps {
  cluster: ClaimCluster | null;
  onClose: () => void;
}

export const ClusterDrawer: React.FC<ClusterDrawerProps> = ({ cluster, onClose }) => {
  const [copiedReply, setCopiedReply] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && cluster) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cluster, onClose]);

  const handleCopyReply = () => {
    if (cluster?.verdict.suggested_reply) {
      navigator.clipboard.writeText(cluster.verdict.suggested_reply);
      setCopiedReply(true);
      setTimeout(() => setCopiedReply(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {cluster && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-2xs"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 pointer-events-none">
            <motion.aside
              initial={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="w-screen max-w-lg bg-[#FBF7F0] dark:bg-[#1A1612] shadow-2xl flex flex-col h-full border-l-2 border-[#D4C5B3] dark:border-[#3D352C] pointer-events-auto"
            >
              {/* Header */}
              <header className="px-5 py-4 border-b border-[#E8DFD5] dark:border-[#2D261F] flex items-center justify-between bg-[#F5EFEB] dark:bg-[#201C17]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1F1B16] dark:text-[#F4EEE4] px-2 py-0.5 rounded-md bg-white dark:bg-[#2A241E] border border-[#D4C5B3] dark:border-[#3D352C]">
                    {cluster.cluster_id}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#26201A] text-[#63584C] dark:text-[#A89E90] capitalize border border-[#D4C5B3] dark:border-[#3D352C]">
                    {cluster.domain.replace('_', ' ')}
                  </span>
                  {cluster.is_guidance_gap && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FFFBEB] dark:bg-[#2A1E0E] text-[#B45309] dark:text-[#FBBF24] border border-[#B45309]/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#B45309]" aria-hidden="true" />
                      Guidance Gap
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="cursor-pointer p-1.5 rounded-lg text-[#63584C] hover:text-[#1F1B16] dark:text-[#A89E90] dark:hover:text-[#F4EEE4] transition hover:bg-[#E8DFD5]/50 dark:hover:bg-[#2D261F]/50 focus-ring"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* Representative Claim Header */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#63584C] dark:text-[#A89E90] font-bold">
                    Representative Claim
                  </span>
                  <h2 id="drawer-title" className="font-display text-xl sm:text-2xl font-bold text-[#1F1B16] dark:text-[#F4EEE4] leading-snug">
                    {cluster.representative_claim}
                  </h2>
                  <div className="pt-1">
                    <VerdictStamp verdict={cluster.verdict.label} size="md" rotate={false} />
                  </div>
                </div>

                {/* Velocity & Timestamps Metadata Tile */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white dark:bg-[#201C17] border border-[#D4C5B3] dark:border-[#3D352C] text-xs font-mono shadow-2xs">
                  <div>
                    <span className="text-[#63584C] dark:text-[#A89E90] block text-[11px] font-bold">Volume &amp; Velocity:</span>
                    <span className="font-bold text-[#1F1B16] dark:text-[#F4EEE4]">
                      {cluster.message_count} msgs ({cluster.growth_rate_24h || '0%'} 24h)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#63584C] dark:text-[#A89E90] block text-[11px] font-bold">Languages Seen:</span>
                    <span className="font-bold text-[#1F1B16] dark:text-[#F4EEE4] capitalize">
                      {cluster.languages_seen.map((l) => (l === 'pcm' ? 'Naija Pidgin' : 'English')).join(', ')}
                    </span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-[#E8DFD5] dark:border-[#2D261F] flex items-center justify-between text-[#8E8273] text-[10px]">
                    <span>First: {new Date(cluster.first_seen).toLocaleString()}</span>
                    <span>Latest: {new Date(cluster.last_seen).toLocaleString()}</span>
                  </div>
                </div>

                {/* Analytical Verdict Explanation */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#63584C] dark:text-[#A89E90] font-bold">
                    Analytical Verdict Explanation
                  </span>
                  <div className="p-4 rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] text-xs sm:text-sm text-[#1F1B16] dark:text-[#F4EEE4] leading-relaxed font-body shadow-2xs">
                    {cluster.verdict.short_explanation}
                  </div>
                </div>

                {/* Suggested Broadcast Response */}
                {cluster.verdict.suggested_reply && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" />
                        Suggested Broadcast Response
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyReply}
                        className="cursor-pointer inline-flex items-center gap-1 text-xs font-mono font-bold text-accent hover:underline focus-ring"
                      >
                        {copiedReply ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Response</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-accent-tint dark:bg-accent-tint border-l-4 border-l-accent border border-accent-border text-xs sm:text-sm text-[#1F1B16] dark:text-[#F4EEE4] font-body leading-relaxed italic">
                      &ldquo;{cluster.verdict.suggested_reply}&rdquo;
                    </div>
                  </div>
                )}

                {/* Semantic list of 3 Street Sample Messages */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#63584C] dark:text-[#A89E90] font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#8E8273]" />
                    Circulating Street Phrasing (3 Sample Quotes)
                  </span>
                  <ul className="space-y-2.5 m-0 p-0 list-none">
                    {cluster.sample_messages.map((msg, idx) => (
                      <li
                        key={idx}
                        className="p-3.5 rounded-xl bg-white dark:bg-[#201C17] border border-[#D4C5B3] dark:border-[#3D352C] text-xs text-[#1F1B16] dark:text-[#F4EEE4] font-mono leading-relaxed shadow-2xs"
                      >
                        <span className="text-accent font-bold mr-2 text-[11px]">#{idx + 1}</span>
                        &ldquo;{msg}&rdquo;
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Official Evidence Passages */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#63584C] dark:text-[#A89E90] font-bold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#8E8273]" />
                    Official Verified Evidence Passages
                  </span>
                  {cluster.verdict.evidence_passages && cluster.verdict.evidence_passages.length > 0 ? (
                    <ul className="space-y-3 m-0 p-0 list-none">
                      {cluster.verdict.evidence_passages.map((ev, i) => (
                        <li
                          key={i}
                          className="p-4 rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] text-xs space-y-2 shadow-2xs"
                        >
                          <div className="flex items-center justify-between font-mono">
                            <span className="font-bold text-[#1F1B16] dark:text-[#F4EEE4] text-[11px] uppercase">
                              {ev.publisher}
                            </span>
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-accent hover:underline inline-flex items-center gap-1"
                            >
                              <span>Circular</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="font-bold text-[#1F1B16] dark:text-[#F4EEE4] font-body text-sm">{ev.doc_title}</p>
                          <blockquote className="official-document-sheet rounded-lg p-3 text-[#1F1B16] dark:text-[#F4EEE4] font-body italic text-xs leading-relaxed">
                            &ldquo;{ev.excerpt}&rdquo;
                          </blockquote>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 rounded-xl border-2 border-[#FDE68A] dark:border-[#B45309]/50 bg-[#FFFBEB] dark:bg-[#251A0E] text-xs text-[#92400E] dark:text-[#FCD34D] font-mono leading-relaxed">
                      <strong>Zero Official Guidance on File:</strong> No verified government circulars or clinical bulletins match this rumour yet. Recommended for agency risk communication press release.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <footer className="p-4 border-t border-[#E8DFD5] dark:border-[#2D261F] bg-[#F5EFEB] dark:bg-[#201C17] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#8E8273]">
                  SafeClaim Institutional Desk
                </span>
                <Button variant="secondary" size="sm" onClick={onClose} className="font-bold">
                  Close Drawer
                </Button>
              </footer>
            </motion.aside>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
