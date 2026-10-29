/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  BookOpen,
  Share2,
  Copy,
  Check,
  Calendar,
  Languages,
  Flame,
  ExternalLink,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { ClaimCluster } from '../../types/api';
import { VerdictBadge } from '../common/VerdictBadge';

interface ClusterDrawerProps {
  cluster: ClaimCluster | null;
  onClose: () => void;
}

export const ClusterDrawer: React.FC<ClusterDrawerProps> = ({ cluster, onClose }) => {
  const [copiedReply, setCopiedReply] = useState(false);

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
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-200">
          {/* Top Bar */}
          <header className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-200/80">
                {cluster.cluster_id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                {cluster.domain.replace('_', ' ')}
              </span>
              {cluster.is_guidance_gap && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600" />
                  Guidance Gap
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Representative Claim Header */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Representative Claim
              </span>
              <h2 id="drawer-title" className="text-lg font-bold text-slate-900 leading-snug">
                {cluster.representative_claim}
              </h2>
              <div className="pt-1">
                <VerdictBadge verdict={cluster.verdict.label} size="md" />
              </div>
            </div>

            {/* Velocity & Timestamp Metadata */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Volume & Velocity:</span>
                <span className="font-bold text-slate-900">
                  {cluster.message_count} messages ({cluster.growth_rate_24h || '0%'} 24h)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Languages Monitored:</span>
                <span className="font-bold text-slate-900 capitalize">
                  {cluster.languages_seen.map((l) => (l === 'pcm' ? 'Naijá Pidgin' : 'English')).join(', ')}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-slate-500 font-mono text-[11px]">
                <span>First Seen: {new Date(cluster.first_seen).toLocaleString()}</span>
                <span>Latest: {new Date(cluster.last_seen).toLocaleString()}</span>
              </div>
            </div>

            {/* Official Verdict & Explanation */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Analytical Verdict Explanation
              </span>
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs text-xs sm:text-sm text-slate-800 leading-relaxed">
                {cluster.verdict.short_explanation}
              </div>
            </div>

            {/* Suggested Broadcast Response */}
            {cluster.verdict.suggested_reply && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    Suggested Public Response
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReply}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                  >
                    {copiedReply ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Response</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed italic relative">
                  &ldquo;{cluster.verdict.suggested_reply}&rdquo;
                </div>
              </div>
            )}

            {/* 3 Street Sample Messages */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                Circulating Street Phrasing (Sample Messages)
              </span>
              <div className="space-y-2">
                {cluster.sample_messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-mono"
                  >
                    <span className="text-slate-400 font-bold mr-2 text-[10px]">#{idx + 1}</span>
                    &ldquo;{msg}&rdquo;
                  </div>
                ))}
              </div>
            </div>

            {/* Official Evidence Passages */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                Official Verified Evidence Passages
              </span>
              {cluster.verdict.evidence_passages && cluster.verdict.evidence_passages.length > 0 ? (
                <div className="space-y-2.5">
                  {cluster.verdict.evidence_passages.map((ev, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900">{ev.publisher}</span>
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-emerald-800 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Circular</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="font-semibold text-slate-900">{ev.doc_title}</p>
                      <p className="text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        &ldquo;{ev.excerpt}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900 leading-relaxed">
                  <strong>Zero Official Guidance on File:</strong> No verified government circulars or clinical bulletins match this specific rumour yet. Recommended for agency clarification notice.
                </div>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <footer className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              SafeClaim Institutional Desk
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition cursor-pointer"
            >
              Close Drawer
            </button>
          </footer>
        </aside>
      </div>
    </div>
  );
};
