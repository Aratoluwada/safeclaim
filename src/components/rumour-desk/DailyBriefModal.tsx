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

interface DailyBriefModalProps {
  brief: DailyBrief | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DailyBriefModal: React.FC<DailyBriefModalProps> = ({ brief, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !brief) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(brief.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const { mode, baseUrl } = getApiConfig();
    if (mode === 'live') {
      window.open(`${baseUrl}/rumours/brief/download`, '_blank');
    } else {
      downloadMarkdownFile(brief.markdown, `safeclaim_brief_${brief.date}.md`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="brief-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    >
      <div className="bg-white dark:bg-neutral-900 rounded-md max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-300 dark:border-neutral-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#0A5C36] text-white flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 id="brief-modal-title" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Institutional Intelligence Brief
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                <Calendar className="w-3 h-3" />
                <span>Date: {brief.date}</span>
                <span>&bull;</span>
                <span>Broadcast Intelligence</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Copy Markdown</span>
                </>
              )}
            </Button>

            <Button variant="primary" size="sm" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition cursor-pointer focus-ring ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-neutral-800 dark:text-neutral-200 text-sm">
          {/* Executive Summary */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#0A5C36] dark:text-emerald-400 font-semibold">
              1. Executive Summary
            </h3>
            <p className="p-4 rounded-md bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 leading-relaxed font-sans text-xs sm:text-sm">
              {brief.summary}
            </p>
          </section>

          {/* Top Clusters List */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              2. Top Circulating Misinformation Clusters
            </h3>
            <ul className="space-y-2 m-0 p-0 list-none">
              {brief.top_clusters.map((c) => (
                <li
                  key={c.cluster_id}
                  className="p-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200 capitalize">
                        [{c.domain}]
                      </span>
                      <span className="text-neutral-400">{c.cluster_id}</span>
                    </div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">{c.claim}</p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 font-mono text-xs">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{c.count} msgs</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-[2px] font-semibold text-[10px] ${
                        c.verdict === 'CONTRADICTED_BY_OFFICIAL_SOURCE'
                          ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                          : c.verdict === 'SUPPORTED_BY_OFFICIAL_SOURCE'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                      }`}
                    >
                      {c.verdict === 'CONTRADICTED_BY_OFFICIAL_SOURCE'
                        ? 'Contradicted'
                        : c.verdict === 'SUPPORTED_BY_OFFICIAL_SOURCE'
                        ? 'Supported'
                        : 'No Source'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* High Priority Guidance Gaps */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <h3>3. High-Priority Guidance Gaps (Recommended Actions)</h3>
            </div>
            <ul className="space-y-2.5 m-0 p-0 list-none">
              {brief.guidance_gaps.map((g, idx) => (
                <li
                  key={g.cluster_id}
                  className="p-3.5 rounded-md border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-amber-950 dark:text-amber-200 uppercase">
                      Gap #{idx + 1}: {g.domain}
                    </span>
                    <span className="text-amber-800 dark:text-amber-300">{g.count} messages</span>
                  </div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{g.claim}</p>
                  <div className="pt-1.5 border-t border-amber-200/80 dark:border-amber-800/60 text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                    <strong className="font-mono text-amber-900 dark:text-amber-200 text-xs">Recommended Action:</strong>{' '}
                    {g.suggested_action}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Raw Markdown Accordion */}
          <details className="pt-2">
            <summary className="text-xs font-mono text-neutral-500 cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200">
              [+] View Raw Markdown Output
            </summary>
            <pre className="mt-2 p-3 rounded-md bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-52">
              {brief.markdown}
            </pre>
          </details>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40 flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>SafeClaim Institutional Output</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
