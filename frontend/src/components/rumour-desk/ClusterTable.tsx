/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Flame,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Layers,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { ClaimCluster } from '../../types/api';
import { VerdictStamp } from '../common/VerdictStamp';
import { Button } from '../ui/Button';

interface ClusterTableProps {
  clusters: ClaimCluster[];
  onInspectCluster: (cluster: ClaimCluster) => void;
  isLoading?: boolean;
}

export const ClusterTable: React.FC<ClusterTableProps> = ({
  clusters,
  onInspectCluster,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#201C17] rounded-2xl border border-[#D4C5B3] dark:border-[#3D352C] p-12 text-center">
        <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-[#63584C] dark:text-[#A89E90]">
          Loading circulating claim clusters...
        </p>
      </div>
    );
  }

  if (clusters.length === 0) {
    return (
      <div className="bg-white dark:bg-[#201C17] rounded-2xl border border-[#D4C5B3] dark:border-[#3D352C] p-10 text-center space-y-2.5">
        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] dark:bg-[#26201A] text-[#8E8273] flex items-center justify-center mx-auto">
          <Layers className="w-5 h-5" />
        </div>
        <h3 className="font-display font-bold text-base text-[#1F1B16] dark:text-[#F4EEE4]">
          No clusters match your active filters
        </h3>
        <p className="text-xs sm:text-sm text-[#63584C] dark:text-[#A89E90] max-w-sm mx-auto font-body">
          Adjust the domain, verdict, or guidance gap toggle to inspect other records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Dense Table View */}
      <div className="hidden md:block bg-white dark:bg-[#201C17] rounded-2xl border border-[#D4C5B3] dark:border-[#3D352C] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF7F2] dark:bg-[#1A1612] border-b border-[#E8DFD5] dark:border-[#2D261F] text-[11px] font-mono uppercase font-bold text-[#63584C] dark:text-[#A89E90]">
              <th scope="col" className="py-3 px-4 w-32">
                Volume & Velocity
              </th>
              <th scope="col" className="py-3 px-4 w-32">
                Domain
              </th>
              <th scope="col" className="py-3 px-4">
                Representative Claim
              </th>
              <th scope="col" className="py-3 px-4 w-48">
                Official Verdict
              </th>
              <th scope="col" className="py-3 px-4 w-28 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8DFD5] dark:divide-[#2D261F] text-xs font-body">
            {clusters.map((cluster) => {
              const isPositiveGrowth = cluster.growth_rate_24h?.startsWith('+');
              return (
                <tr
                  key={cluster.cluster_id}
                  className={`hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] transition-colors ${
                    cluster.is_guidance_gap
                      ? 'bg-[#FFFBEB]/40 dark:bg-[#291F11]/40'
                      : ''
                  }`}
                >
                  {/* Volume & Velocity */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-mono font-bold text-[#1F1B16] dark:text-[#F4EEE4] text-xs">
                      {cluster.message_count} msgs
                    </div>
                    {cluster.growth_rate_24h && (
                      <div
                        className={`inline-flex items-center gap-0.5 text-[11px] font-mono mt-0.5 ${
                          isPositiveGrowth
                            ? 'text-[#B91C1C] dark:text-[#F87171] font-bold'
                            : 'text-[#8E8273]'
                        }`}
                      >
                        {isPositiveGrowth ? (
                          <TrendingUp className="w-3 h-3" aria-hidden="true" />
                        ) : (
                          <TrendingDown className="w-3 h-3" aria-hidden="true" />
                        )}
                        <span>{cluster.growth_rate_24h} (24h)</span>
                      </div>
                    )}
                  </td>

                  {/* Domain */}
                  <td className="py-3.5 px-4 align-top">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#26201A] text-[#1F1B16] dark:text-[#F4EEE4] text-[11px] font-mono font-semibold capitalize border border-[#D4C5B3] dark:border-[#3D352C]">
                      {cluster.domain.replace('_', ' ')}
                    </span>
                    {cluster.is_guidance_gap && (
                      <span className="mt-1 text-[10px] font-mono font-bold text-[#B45309] dark:text-[#FBBF24] uppercase tracking-tight flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#B45309]" aria-hidden="true" />
                        Guidance Gap
                      </span>
                    )}
                  </td>

                  {/* Representative Claim */}
                  <td className="py-3.5 px-4 align-top">
                    <p className="font-bold text-[#1F1B16] dark:text-[#F4EEE4] leading-snug">
                      {cluster.representative_claim}
                    </p>
                    <p className="text-[11px] text-[#63584C] dark:text-[#A89E90] mt-1 line-clamp-2">
                      {cluster.verdict.short_explanation}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-[#8E8273]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Active: {new Date(cluster.last_seen).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{cluster.languages_seen.join(', ').toUpperCase()}</span>
                    </div>
                  </td>

                  {/* Verdict Badge */}
                  <td className="py-3.5 px-4 align-top">
                    <VerdictStamp verdict={cluster.verdict.label} size="sm" rotate={false} />
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 align-top text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onInspectCluster(cluster)}
                      className="text-xs h-8 min-h-[34px] px-2.5 font-bold"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3 h-3 ml-0.5" aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (semantic <ul> with <li>) */}
      <ul className="md:hidden space-y-3 m-0 p-0 list-none">
        {clusters.map((cluster) => (
          <li
            key={cluster.cluster_id}
            className={`bg-white dark:bg-[#201C17] rounded-2xl border p-4 shadow-xs space-y-3 ${
              cluster.is_guidance_gap
                ? 'border-[#B45309] bg-[#FFFBEB]/30 dark:bg-[#291F11]/30'
                : 'border-[#D4C5B3] dark:border-[#3D352C]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-[#26201A] text-[#1F1B16] dark:text-[#F4EEE4] text-[11px] font-mono capitalize border border-[#D4C5B3] dark:border-[#3D352C]">
                  {cluster.domain.replace('_', ' ')}
                </span>
                {cluster.is_guidance_gap && (
                  <span className="px-2 py-0.5 rounded-md bg-[#FFFBEB] dark:bg-[#2A1E0E] text-[#B45309] dark:text-[#FBBF24] text-[10px] font-mono font-bold uppercase flex items-center gap-1 border border-[#B45309]/30">
                    <Flame className="w-3 h-3" aria-hidden="true" />
                    Guidance Gap
                  </span>
                )}
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-[#1F1B16] dark:text-[#F4EEE4] text-xs">
                  {cluster.message_count} msgs
                </span>
                {cluster.growth_rate_24h && (
                  <span className="block text-[10px] text-[#B91C1C] dark:text-[#F87171] font-bold">
                    {cluster.growth_rate_24h}
                  </span>
                )}
              </div>
            </div>

            <h4 className="font-display font-bold text-sm text-[#1F1B16] dark:text-[#F4EEE4] leading-snug">
              {cluster.representative_claim}
            </h4>

            <div>
              <VerdictStamp verdict={cluster.verdict.label} size="sm" rotate={false} />
            </div>

            <p className="text-xs text-[#63584C] dark:text-[#A89E90] line-clamp-2 font-body">
              {cluster.verdict.short_explanation}
            </p>

            <div className="pt-2.5 border-t border-[#E8DFD5] dark:border-[#2D261F] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#8E8273]">
                {cluster.languages_seen.join(', ').toUpperCase()}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onInspectCluster(cluster)}
                className="text-xs h-8 min-h-[36px] font-bold"
              >
                <span>Inspect Cluster</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
