/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Calendar,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { DailyBrief } from '../../types/api';
import { downloadMarkdownFile } from '../../utils/briefGenerator';
import { getApiConfig } from '../../api/client';

interface DailyBriefModalProps {
  brief: DailyBrief | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DailyBriefModal: React.FC<DailyBriefModalProps> = ({ brief, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 id="brief-modal-title" className="text-base font-bold text-slate-900">
                Daily Institutional Intelligence Brief
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published: {brief.date}</span>
                <span>&bull;</span>
                <span>Broadcast-Ready Intelligence</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800">
          {/* Executive Summary */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              1. Executive Summary
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-700">
              {brief.summary}
            </div>
          </section>

          {/* Top Clusters */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Top Circulating Misinformation Clusters
            </h3>
            <div className="space-y-2.5">
              {brief.top_clusters.map((c) => (
                <div
                  key={c.cluster_id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 capitalize px-2 py-0.5 rounded bg-slate-100">
                        {c.domain}
                      </span>
                      <span className="font-mono text-slate-400">{c.cluster_id}</span>
                    </div>
                    <p className="font-semibold text-slate-800">{c.claim}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-extrabold text-slate-900">{c.count} msgs</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        c.verdict === 'CONTRADICTED_BY_OFFICIAL_SOURCE'
                          ? 'bg-red-100 text-red-800'
                          : c.verdict === 'SUPPORTED_BY_OFFICIAL_SOURCE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.verdict === 'CONTRADICTED_BY_OFFICIAL_SOURCE'
                        ? 'Contradicted'
                        : c.verdict === 'SUPPORTED_BY_OFFICIAL_SOURCE'
                        ? 'Supported'
                        : 'No Source'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* High Priority Guidance Gaps */}
          <section className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                3. High-Priority Guidance Gaps (Recommended Actions)
              </h3>
            </div>
            <div className="space-y-3">
              {brief.guidance_gaps.map((g, idx) => (
                <div
                  key={g.cluster_id}
                  className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 uppercase">
                      Gap #{idx + 1}: {g.domain}
                    </span>
                    <span className="font-mono text-amber-800">{g.count} messages</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{g.claim}</p>
                  <div className="pt-2 border-t border-amber-200/80 text-amber-950 leading-relaxed">
                    <strong>Suggested Agency Action:</strong> {g.suggested_action}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Raw Markdown Preview Tab */}
          <details className="pt-2">
            <summary className="text-xs font-semibold text-slate-500 cursor-pointer hover:text-slate-800">
              View Raw Markdown Output
            </summary>
            <pre className="mt-2 p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60">
              {brief.markdown}
            </pre>
          </details>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span>SafeClaim Institutional Intelligence Export</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
