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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Messages Analyzed */}
      <StatTile
        label="Messages Analyzed"
        value={stats.total_messages_analyzed.toLocaleString()}
        hint={
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span>Across {stats.total_clusters} claim clusters</span>
            {isDemoMode && <span className="text-[#8E8273]">synthetic testbed</span>}
          </div>
        }
        accent="neutral"
      />

      {/* Contradicted Rumours */}
      <StatTile
        label="Contradicted Rumours"
        value={
          <span className="text-[#B91C1C] dark:text-[#F87171]">
            {stats.verdict_counts.CONTRADICTED_BY_OFFICIAL_SOURCE || 0}
          </span>
        }
        hint={
          <div className="text-[11px] text-[#B91C1C] dark:text-[#FCA5A5] font-mono">
            Directly refuted by NCDC/FCCPC circulars
          </div>
        }
        accent="contradicted"
      />

      {/* Guidance Gaps */}
      <StatTile
        label="Guidance Gaps"
        value={
          <span className="text-[#B45309] dark:text-[#FBBF24]">
            {stats.guidance_gaps_count}
          </span>
        }
        hint={
          <div className="text-[11px] text-[#B45309] dark:text-[#FCD34D] font-bold">
            Viral rumours with zero official guidance
          </div>
        }
        accent="gap"
      />

      {/* Active Domains Breakdown */}
      <div className="bg-white dark:bg-[#201C17] border border-[#D4C5B3] dark:border-[#3D352C] border-t-4 border-t-[#0A5C36] dark:border-t-[#34D399] rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#63584C] dark:text-[#A89E90] mb-2.5">
          Active Domains Breakdown
        </div>
        <ul className="grid grid-cols-2 gap-2 m-0 p-0 list-none text-xs font-mono">
          <li className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#26201A] border border-[#E8DFD5] dark:border-[#3A3228]">
            <span className="text-[#63584C] dark:text-[#A89E90]">Outbreak</span>
            <span className="font-bold text-[#1F1B16] dark:text-[#EDE7DF]">{stats.domains.outbreak || 0}</span>
          </li>
          <li className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#26201A] border border-[#E8DFD5] dark:border-[#3A3228]">
            <span className="text-[#63584C] dark:text-[#A89E90]">Scams</span>
            <span className="font-bold text-[#1F1B16] dark:text-[#EDE7DF]">{stats.domains.scam || 0}</span>
          </li>
          <li className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#26201A] border border-[#E8DFD5] dark:border-[#3A3228]">
            <span className="text-[#63584C] dark:text-[#A89E90]">Benefits</span>
            <span className="font-bold text-[#1F1B16] dark:text-[#EDE7DF]">{stats.domains.benefit || 0}</span>
          </li>
          <li className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF7F2] dark:bg-[#26201A] border border-[#E8DFD5] dark:border-[#3A3228]">
            <span className="text-[#63584C] dark:text-[#A89E90]">Election</span>
            <span className="font-bold text-[#1F1B16] dark:text-[#EDE7DF]">{stats.domains.election_procedure || 0}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
