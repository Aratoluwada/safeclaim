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
import { VerdictBadge } from '../common/VerdictBadge';
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
      <div className="bg-white dark:bg-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-800 p-12 text-center">
        <div className="w-6 h-6 border-2 border-[#0A5C36] dark:border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
          Loading circulating claim clusters...
        </p>
      </div>
    );
  }

  if (clusters.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-800 p-10 text-center space-y-2">
        <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
          <Layers className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          No clusters match your active filters
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Adjust the domain, verdict, or guidance gap toggle to inspect other records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Desktop Dense Table View */}
      <div className="hidden md:block bg-white dark:bg-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/80 dark:bg-neutral-950/60 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-mono uppercase font-semibold text-neutral-500 dark:text-neutral-400">
              <th scope="col" className="py-2.5 px-3.5 w-32">
                Volume & Velocity
              </th>
              <th scope="col" className="py-2.5 px-3.5 w-28">
                Domain
              </th>
              <th scope="col" className="py-2.5 px-3.5">
                Representative Claim
              </th>
              <th scope="col" className="py-2.5 px-3.5 w-48">
                Official Verdict
              </th>
              <th scope="col" className="py-2.5 px-3.5 w-32 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-xs font-sans">
            {clusters.map((cluster) => {
              const isPositiveGrowth = cluster.growth_rate_24h?.startsWith('+');
              return (
                <tr
                  key={cluster.cluster_id}
                  className={`hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors ${
                    cluster.is_guidance_gap
                      ? 'bg-amber-50/30 dark:bg-amber-950/20'
                      : ''
                  }`}
                >
                  {/* Volume & Velocity */}
                  <td className="py-3 px-3.5 align-top">
                    <div className="font-mono font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                      {cluster.message_count} msgs
                    </div>
                    {cluster.growth_rate_24h && (
                      <div
                        className={`inline-flex items-center gap-0.5 text-[11px] font-mono mt-0.5 ${
                          isPositiveGrowth
                            ? 'text-red-700 dark:text-red-400 font-semibold'
                            : 'text-neutral-500'
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
                  <td className="py-3 px-3.5 align-top">
                    <span className="inline-block px-1.5 py-0.5 rounded-[3px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-mono font-medium capitalize border border-neutral-200/80 dark:border-neutral-700/80">
                      {cluster.domain.replace('_', ' ')}
                    </span>
                    {cluster.is_guidance_gap && (
                      <span className="block mt-1 text-[10px] font-mono font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-tight flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-amber-600" aria-hidden="true" />
                        Guidance Gap
                      </span>
                    )}
                  </td>

                  {/* Representative Claim */}
                  <td className="py-3 px-3.5 align-top">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
                      {cluster.representative_claim}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                      {cluster.verdict.short_explanation}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        Active: {new Date(cluster.last_seen).toLocaleDateString()}
                      </span>
                      <span>&bull;</span>
                      <span>{cluster.languages_seen.join(', ').toUpperCase()}</span>
                    </div>
                  </td>

                  {/* Verdict Badge */}
                  <td className="py-3 px-3.5 align-top">
                    <VerdictBadge verdict={cluster.verdict.label} size="sm" />
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3.5 align-top text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onInspectCluster(cluster)}
                      className="text-xs h-7 py-0 px-2"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (semantic <ul> with <li>) */}
      <ul className="md:hidden space-y-2.5 m-0 p-0 list-none">
        {clusters.map((cluster) => (
          <li
            key={cluster.cluster_id}
            className={`bg-white dark:bg-neutral-900 rounded-md border p-3.5 shadow-2xs space-y-2.5 ${
              cluster.is_guidance_gap
                ? 'border-amber-300 dark:border-amber-700 bg-amber-50/20 dark:bg-amber-950/20'
                : 'border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded-[3px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-mono capitalize">
                  {cluster.domain.replace('_', ' ')}
                </span>
                {cluster.is_guidance_gap && (
                  <span className="px-1.5 py-0.5 rounded-[3px] bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-mono font-semibold uppercase flex items-center gap-0.5">
                    <Flame className="w-3 h-3" aria-hidden="true" />
                    Guidance Gap
                  </span>
                )}
              </div>
              <div className="text-right font-mono">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs">
                  {cluster.message_count} msgs
                </span>
                {cluster.growth_rate_24h && (
                  <span className="block text-[10px] text-red-600 font-medium">
                    {cluster.growth_rate_24h}
                  </span>
                )}
              </div>
            </div>

            <h4 className="font-medium text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 leading-snug">
              {cluster.representative_claim}
            </h4>

            <div>
              <VerdictBadge verdict={cluster.verdict.label} size="sm" />
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
              {cluster.verdict.short_explanation}
            </p>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400">
                {cluster.languages_seen.join(', ').toUpperCase()}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onInspectCluster(cluster)}
                className="text-xs h-8 min-h-[36px]"
              >
                <span>Inspect Cluster</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
