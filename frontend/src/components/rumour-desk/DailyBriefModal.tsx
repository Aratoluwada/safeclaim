/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Calendar,
  Flame,
} from 'lucide-react';
import { DailyBrief } from '../../types/api';
import { downloadMarkdownFile } from '../../utils/briefGenerator';
import { getApiConfig } from '../../api/client';
import { Button } from '../ui/Button';
import { VerdictStamp } from '../common/VerdictStamp';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface DailyBriefModalProps {
  brief: DailyBrief | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DailyBriefModal: React.FC<DailyBriefModalProps> = ({ brief, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = () => {
    if (brief?.markdown) {
      navigator.clipboard.writeText(brief.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!brief) return;
    const { mode, baseUrl } = getApiConfig();
    if (mode === 'live') {
      window.open(`${baseUrl}/rumours/brief/download`, '_blank');
    } else {
      downloadMarkdownFile(brief.markdown, `safeclaim_brief_${brief.date}.md`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && brief && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="brief-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-2xs"
            onClick={onClose}
          />

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="relative z-10 bg-[#FBF7F0] dark:bg-[#1A1612] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-[#D4C5B3] dark:border-[#3D352C] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DFD5] dark:border-[#2D261F] bg-[#F5EFEB] dark:bg-[#201C17]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0A5C36] text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-5 h-5 text-[#FAF4E8]" />
                </div>
                <div>
                  <h2 id="brief-modal-title" className="font-display text-base font-bold text-[#1F1B16] dark:text-[#F4EEE4]">
                    Institutional Intelligence Brief
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#63584C] dark:text-[#A89E90]">
                    <Calendar className="w-3 h-3" />
                    <span>Date: {brief.date}</span>
                    <span>•</span>
                    <span>Broadcast Intelligence</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={handleCopy} className="font-bold">
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </Button>

                <Button variant="primary" size="sm" onClick={handleDownload} className="font-bold">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download (.md)</span>
                </Button>

                <button
                  onClick={onClose}
                  className="cursor-pointer p-1.5 rounded-lg text-[#63584C] hover:text-[#1F1B16] dark:text-[#A89E90] dark:hover:text-[#F4EEE4] transition hover:bg-[#E8DFD5]/50 dark:hover:bg-[#2D261F]/50 focus-ring ml-1"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Document Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-[#1F1B16] dark:text-[#F4EEE4] text-sm">
              {/* Executive Summary */}
              <section className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                  1. Executive Summary
                </h3>
                <p className="p-4 rounded-xl bg-white dark:bg-[#201C17] border border-[#D4C5B3] dark:border-[#3D352C] leading-relaxed font-body text-sm shadow-2xs">
                  {brief.summary}
                </p>
              </section>

              {/* Top Clusters List */}
              <section className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#63584C] dark:text-[#A89E90] font-bold">
                  2. Top Circulating Misinformation Clusters
                </h3>
                <ul className="space-y-2.5 m-0 p-0 list-none">
                  {brief.top_clusters.map((c) => (
                    <li
                      key={c.cluster_id}
                      className="p-3.5 rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="font-bold text-[#1F1B16] dark:text-[#F4EEE4] capitalize">
                            [{c.domain}]
                          </span>
                          <span className="text-[#8E8273]">{c.cluster_id}</span>
                        </div>
                        <p className="font-bold text-[#1F1B16] dark:text-[#F4EEE4] font-body text-sm">{c.claim}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                        <span className="font-bold text-[#1F1B16] dark:text-[#F4EEE4]">{c.count} msgs</span>
                        <VerdictStamp verdict={c.verdict} size="sm" rotate={false} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* High Priority Guidance Gaps */}
              <section className="space-y-3">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#B45309] dark:text-[#FBBF24] uppercase">
                  <Flame className="w-4 h-4 text-[#B45309]" />
                  <h3>3. High-Priority Guidance Gaps (Recommended Actions)</h3>
                </div>
                <ul className="space-y-3 m-0 p-0 list-none">
                  {brief.guidance_gaps.map((g, idx) => (
                    <li
                      key={g.cluster_id}
                      className="p-4 rounded-xl border-2 border-[#FDE68A] dark:border-[#B45309]/50 bg-[#FFFBEB] dark:bg-[#251A0E] space-y-2 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold text-[#92400E] dark:text-[#FCD34D] uppercase">
                          Gap #{idx + 1}: {g.domain}
                        </span>
                        <span className="text-[#B45309] dark:text-[#FBBF24] font-bold">{g.count} messages</span>
                      </div>
                      <p className="font-display font-bold text-[#1F1B16] dark:text-[#F4EEE4] text-sm sm:text-base">{g.claim}</p>
                      <div className="pt-2 border-t border-[#FDE68A] dark:border-[#B45309]/40 text-[#1F1B16] dark:text-[#F4EEE4] leading-relaxed font-body">
                        <strong className="font-mono text-[#92400E] dark:text-[#FCD34D] text-xs uppercase font-bold">Recommended Action:</strong>{' '}
                        {g.suggested_action}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Raw Markdown Accordion */}
              <details className="pt-2">
                <summary className="text-xs font-mono font-bold text-[#63584C] dark:text-[#A89E90] cursor-pointer hover:text-[#1F1B16] dark:hover:text-[#F4EEE4]">
                  [+] View Raw Markdown Output
                </summary>
                <pre className="mt-2.5 p-4 rounded-xl bg-[#1F1B16] text-[#F4EEE4] font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-52 border border-[#3D352C]">
                  {brief.markdown}
                </pre>
              </details>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-[#E8DFD5] dark:border-[#2D261F] bg-[#F5EFEB] dark:bg-[#201C17] flex items-center justify-between text-xs font-mono text-[#8E8273]">
              <span>SafeClaim Institutional Output</span>
              <Button variant="secondary" size="sm" onClick={onClose} className="font-bold">
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
