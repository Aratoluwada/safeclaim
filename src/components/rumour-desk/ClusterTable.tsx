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
  Sparkles,
} from 'lucide-react';
import { ClaimCluster } from '../../types/api';
import { VerdictBadge } from '../common/VerdictBadge';

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
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600">Loading circulating claim clusters...</p>
      </div>
    );
  }

  if (clusters.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No clusters match your filters</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Try resetting the domain or verdict filter, or uncheck "Show Only Guidance Gaps".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3.5 px-4 w-32">
                Volume & Velocity
              </th>
              <th scope="col" className="py-3.5 px-4 w-28">
                Domain
              </th>
              <th scope="col" className="py-3.5 px-4">
                Representative Claim
              </th>
              <th scope="col" className="py-3.5 px-4 w-52">
                Official Verdict
              </th>
              <th scope="col" className="py-3.5 px-4 w-36 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {clusters.map((cluster) => {
              const isPositiveGrowth = cluster.growth_rate_24h?.startsWith('+');
              return (
                <tr
                  key={cluster.cluster_id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    cluster.is_guidance_gap ? 'bg-amber-50/20' : ''
                  }`}
                >
                  {/* Volume & Velocity */}
                  <td className="py-4 px-4 align-top">
                    <div className="font-extrabold text-slate-900 text-sm">
                      {cluster.message_count} msgs
                    </div>
                    {cluster.growth_rate_24h && (
                      <div
                        className={`inline-flex items-center gap-0.5 text-xs font-semibold mt-0.5 ${
                          isPositiveGrowth ? 'text-red-600' : 'text-slate-500'
                        }`}
                      >
                        {isPositiveGrowth ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{cluster.growth_rate_24h} (24h)</span>
                      </div>
                    )}
                  </td>

                  {/* Domain */}
                  <td className="py-4 px-4 align-top">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold capitalize border border-slate-200/60">
                      {cluster.domain.replace('_', ' ')}
                    </span>
                    {cluster.is_guidance_gap && (
                      <span className="block mt-1 text-[10px] font-bold text-amber-700 uppercase tracking-tight flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-amber-600" />
                        Guidance Gap
                      </span>
                    )}
                  </td>

                  {/* Representative Claim */}
                  <td className="py-4 px-4 align-top">
                    <p className="font-bold text-slate-900 leading-snug">
                      {cluster.representative_claim}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {cluster.verdict.short_explanation}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        Last active: {new Date(cluster.last_seen).toLocaleDateString()}
                      </span>
                      <span>&bull;</span>
                      <span>Languages: {cluster.languages_seen.join(', ').toUpperCase()}</span>
                    </div>
                  </td>

                  {/* Verdict Badge */}
                  <td className="py-4 px-4 align-top">
                    <VerdictBadge verdict={cluster.verdict.label} size="sm" />
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 align-top text-right">
                    <button
                      type="button"
                      onClick={() => onInspectCluster(cluster)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-2xs transition cursor-pointer"
                    >
                      <span>Inspect Cluster</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards Alternative */}
      <div className="md:hidden space-y-3">
        {clusters.map((cluster) => (
          <div
            key={cluster.cluster_id}
            className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 ${
              cluster.is_guidance_gap ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold capitalize">
                  {cluster.domain.replace('_', ' ')}
                </span>
                {cluster.is_guidance_gap && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                    <Flame className="w-3 h-3" />
                    Guidance Gap
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="font-extrabold text-slate-900 text-xs">
                  {cluster.message_count} msgs
                </span>
                {cluster.growth_rate_24h && (
                  <span className="block text-[11px] font-semibold text-red-600">
                    {cluster.growth_rate_24h}
                  </span>
                )}
              </div>
            </div>

            <h4 className="font-bold text-sm text-slate-900 leading-snug">
              {cluster.representative_claim}
            </h4>

            <div>
              <VerdictBadge verdict={cluster.verdict.label} size="sm" />
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">
              {cluster.verdict.short_explanation}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {cluster.languages_seen.join(', ').toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => onInspectCluster(cluster)}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                <span>Inspect Cluster</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
