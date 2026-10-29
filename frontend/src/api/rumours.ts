/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEMO_CLAIM_CLUSTERS, DEMO_DAILY_BRIEF, DEMO_RUMOUR_STATS } from '../data/demoData';
import { ClaimCluster, DailyBrief, FilterParams, RumourStats } from '../types/api';
import { ApiError, getApiConfig } from './client';

// Local store for demo cluster data so user can reload or filter
let activeDemoClusters = [...DEMO_CLAIM_CLUSTERS];

export async function getRumourStats(): Promise<RumourStats> {
  const { mode, baseUrl } = getApiConfig();

  if (mode === 'live') {
    try {
      const res = await fetch(`${baseUrl}/rumours/stats`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new ApiError(`Failed to fetch stats: HTTP ${res.status}`, res.status);
      return await res.json();
    } catch (err: unknown) {
      if (err instanceof ApiError) throw err;
      const msg = err instanceof Error ? err.message : 'Unknown network error';
      throw new ApiError(`Cannot load stats from live backend (${baseUrl}): ${msg}`, undefined, true);
    }
  }

  // Recalculate dynamic stats from active demo clusters
  const totalClusters = activeDemoClusters.length;
  let totalMessages = 0;
  let guidanceGaps = 0;
  const verdictCounts: RumourStats['verdict_counts'] = {
    CONTRADICTED_BY_OFFICIAL_SOURCE: 0,
    SUPPORTED_BY_OFFICIAL_SOURCE: 0,
    NO_OFFICIAL_SOURCE_FOUND: 0,
    NOT_VALIDATED: 0,
  };
  const domains: Record<string, number> = {
    outbreak: 0,
    scam: 0,
    benefit: 0,
    election_procedure: 0,
    other: 0,
  };

  for (const c of activeDemoClusters) {
    totalMessages += c.message_count;
    if (c.is_guidance_gap) guidanceGaps++;
    if (c.verdict?.label) {
      verdictCounts[c.verdict.label] = (verdictCounts[c.verdict.label] || 0) + 1;
    }
    domains[c.domain] = (domains[c.domain] || 0) + c.message_count;
  }

  return {
    total_messages_analyzed: totalMessages,
    total_clusters: totalClusters,
    source_distribution: {
      synthetic: Math.round(totalMessages * 0.88),
      submitted: Math.round(totalMessages * 0.12),
    },
    verdict_counts: verdictCounts,
    guidance_gaps_count: guidanceGaps,
    domains,
  };
}

export async function getClusters(params?: FilterParams): Promise<ClaimCluster[]> {
  const { mode, baseUrl } = getApiConfig();

  if (mode === 'live') {
    try {
      const query = new URLSearchParams();
      if (params?.domain && params.domain !== 'all') query.set('domain', params.domain);
      if (params?.label && params.label !== 'all') query.set('label', params.label);
      if (params?.guidance_gap_only) query.set('guidance_gap_only', 'true');
      if (params?.search_query) {
        query.set('search_query', params.search_query);
        query.set('q', params.search_query);
      }

      const qs = query.toString();
      const res = await fetch(`${baseUrl}/rumours/clusters${qs ? `?${qs}` : ''}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new ApiError(`Failed to fetch clusters: HTTP ${res.status}`, res.status);
      return await res.json();
    } catch (err: unknown) {
      if (err instanceof ApiError) throw err;
      const msg = err instanceof Error ? err.message : 'Unknown network error';
      throw new ApiError(`Cannot load clusters from live backend (${baseUrl}): ${msg}`, undefined, true);
    }
  }

  // DEMO MODE: In-memory filtering
  await new Promise((resolve) => setTimeout(resolve, 150));

  let results = [...activeDemoClusters];

  if (params?.domain && params.domain !== 'all') {
    results = results.filter((c) => c.domain === params.domain);
  }

  if (params?.label && params.label !== 'all') {
    results = results.filter((c) => c.verdict.label === params.label);
  }

  if (params?.guidance_gap_only) {
    results = results.filter((c) => c.is_guidance_gap);
  }

  if (params?.search_query && params.search_query.trim()) {
    const q = params.search_query.toLowerCase();
    results = results.filter(
      (c) =>
        c.representative_claim.toLowerCase().includes(q) ||
        c.verdict.short_explanation.toLowerCase().includes(q) ||
        c.sample_messages.some((msg) => msg.toLowerCase().includes(q))
    );
  }

  return results;
}

export async function getDailyBrief(): Promise<DailyBrief> {
  const { mode, baseUrl } = getApiConfig();

  if (mode === 'live') {
    try {
      const res = await fetch(`${baseUrl}/rumours/brief`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new ApiError(`Failed to fetch daily brief: HTTP ${res.status}`, res.status);
      return await res.json();
    } catch (err: unknown) {
      if (err instanceof ApiError) throw err;
      const msg = err instanceof Error ? err.message : 'Unknown network error';
      throw new ApiError(`Cannot load daily brief from live backend (${baseUrl}): ${msg}`, undefined, true);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 200));
  return DEMO_DAILY_BRIEF;
}

export function getDailyBriefDownloadUrl(): string {
  const { baseUrl } = getApiConfig();
  return `${baseUrl}/rumours/brief/download`;
}

export async function reloadSyntheticDemo(): Promise<{ success: boolean; message: string; count: number }> {
  const { mode, baseUrl, adminToken } = getApiConfig();

  if (mode === 'live') {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (adminToken) {
        headers['X-SafeClaim-Admin-Token'] = adminToken;
      }

      const res = await fetch(`${baseUrl}/rumours/load-synthetic`, {
        method: 'POST',
        headers,
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new ApiError(
            'Admin authorization required (401). Please enter your SAFECLAIM_ADMIN_TOKEN in Settings to reload live clusters.',
            401
          );
        }
        if (res.status === 503) {
          throw new ApiError(
            'Admin token not configured on live backend (503). Ensure SAFECLAIM_ADMIN_TOKEN is defined in backend .env.',
            503
          );
        }
        throw new ApiError(`Failed to reload synthetic clusters on live backend: HTTP ${res.status}`, res.status);
      }

      const data = await res.json();
      return {
        success: true,
        message: `Live backend reloaded: ${data.clusters_loaded} synthetic clusters (${data.messages_loaded} messages) in ${data.load_time_seconds}s.`,
        count: data.clusters_loaded,
      };
    } catch (err: unknown) {
      if (err instanceof ApiError) throw err;
      const msg = err instanceof Error ? err.message : 'Unknown network error';
      throw new ApiError(`Cannot reload synthetic clusters on live backend: ${msg}`, undefined, true);
    }
  }

  // Reset demo clusters to pristine seed state
  activeDemoClusters = [...DEMO_CLAIM_CLUSTERS];
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    success: true,
    message: 'Synthetic demo dataset reloaded with 6 active claim clusters and 326 synthetic messages.',
    count: activeDemoClusters.length,
  };
}
