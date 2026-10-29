/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RumourStats } from '../../types/api';
import { StatTile } from '../ui/StatTile';

interface StatsOverviewProps {
  stats: RumourStats;
  isDemoMode?: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, isDemoMode = true }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Messages Analyzed */}
      <StatTile
        label="Messages Analyzed"
        value={stats.total_messages_analyzed.toLocaleString()}
        hint={
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span>Across {stats.total_clusters} claim clusters</span>
            {isDemoMode && <span className="text-neutral-400">synthetic testbed</span>}
          </div>
        }
        accent="neutral"
      />

      {/* Contradicted Rumours */}
      <StatTile
        label="Contradicted Rumours"
        value={
          <span className="text-red-700 dark:text-red-400">
            {stats.verdict_counts.CONTRADICTED_BY_OFFICIAL_SOURCE || 0}
          </span>
        }
        hint={
          <div className="text-[11px] text-red-800 dark:text-red-300 font-mono">
            Directly refuted by NCDC/FCCPC circulars
          </div>
        }
        accent="contradicted"
      />

      {/* Guidance Gaps */}
      <StatTile
        label="Guidance Gaps"
        value={
          <span className="text-amber-700 dark:text-amber-400">
            {stats.guidance_gaps_count}
          </span>
        }
        hint={
          <div className="text-[11px] text-amber-900 dark:text-amber-300 font-medium">
            Viral rumours with zero official guidance
          </div>
        }
        accent="gap"
      />

      {/* Active Domains Breakdown */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-t-2 border-t-[#0A5C36] dark:border-t-emerald-500 rounded-md p-4 transition-colors">
        <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          Active Domains Breakdown
        </div>
        <ul className="grid grid-cols-2 gap-1.5 m-0 p-0 list-none text-xs font-mono">
          <li className="flex items-center justify-between p-1 rounded bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-neutral-600 dark:text-neutral-400">Outbreak</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">{stats.domains.outbreak || 0}</span>
          </li>
          <li className="flex items-center justify-between p-1 rounded bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-neutral-600 dark:text-neutral-400">Scams</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">{stats.domains.scam || 0}</span>
          </li>
          <li className="flex items-center justify-between p-1 rounded bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-neutral-600 dark:text-neutral-400">Benefits</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">{stats.domains.benefit || 0}</span>
          </li>
          <li className="flex items-center justify-between p-1 rounded bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-neutral-600 dark:text-neutral-400">Election</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">{stats.domains.election_procedure || 0}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
