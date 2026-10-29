/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  MessageSquareWarning,
  AlertTriangle,
  FileQuestion,
  Layers,
  TrendingUp,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { RumourStats } from '../../types/api';

interface StatsOverviewProps {
  stats: RumourStats;
  isDemoMode?: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, isDemoMode = true }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Messages Analyzed */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Messages Analyzed
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <MessageSquareWarning className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">
            {stats.total_messages_analyzed.toLocaleString()}
          </span>
          {isDemoMode && (
            <span className="text-[11px] font-semibold text-slate-400">
              (synthetic benchmark)
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Across <strong>{stats.total_clusters}</strong> active circulating clusters</span>
        </p>
      </div>

      {/* Contradicted Rumours */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-b from-red-50/40 to-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700">
            Contradicted Claims
          </span>
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-red-700">
            {stats.verdict_counts.CONTRADICTED_BY_OFFICIAL_SOURCE || 0}
          </span>
          <span className="text-xs font-medium text-red-600/80">
            clusters refuted
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Directly countered by official NCDC / FCCPC publications
        </p>
      </div>

      {/* Guidance Gaps */}
      <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/50 to-white p-5 shadow-xs relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Guidance Gaps
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <FileQuestion className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-amber-800">
            {stats.guidance_gaps_count}
          </span>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
            Action Needed
          </span>
        </div>
        <p className="mt-2 text-xs text-amber-900/90 font-medium">
          Viral rumours with zero published agency rebuttal
        </p>
      </div>

      {/* Domain Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Domain Distribution
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
            <span className="text-slate-600 font-medium">Outbreak</span>
            <span className="font-bold text-slate-900">{stats.domains.outbreak || 0}</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
            <span className="text-slate-600 font-medium">Scams</span>
            <span className="font-bold text-slate-900">{stats.domains.scam || 0}</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
            <span className="text-slate-600 font-medium">Benefit</span>
            <span className="font-bold text-slate-900">{stats.domains.benefit || 0}</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
            <span className="text-slate-600 font-medium">Election</span>
            <span className="font-bold text-slate-900">{stats.domains.election_procedure || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
