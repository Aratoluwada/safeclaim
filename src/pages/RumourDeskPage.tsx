/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Flame,
  FileText,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  ClaimCluster,
  DailyBrief,
  FilterParams,
  LanguageCode,
  RumourStats,
} from '../types/api';
import {
  getClusters,
  getDailyBrief,
  getRumourStats,
  reloadSyntheticDemo,
} from '../api/rumours';
import { SyntheticBanner } from '../components/common/SyntheticBanner';
import { StatsOverview } from '../components/rumour-desk/StatsOverview';
import { FilterBar } from '../components/rumour-desk/FilterBar';
import { ClusterTable } from '../components/rumour-desk/ClusterTable';
import { ClusterDrawer } from '../components/rumour-desk/ClusterDrawer';
import { DailyBriefModal } from '../components/rumour-desk/DailyBriefModal';
import { ApiConfig } from '../api/client';
import { DEMO_RUMOUR_STATS } from '../data/demoData';

interface RumourDeskPageProps {
  language: LanguageCode;
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
}

export const RumourDeskPage: React.FC<RumourDeskPageProps> = ({
  language,
  apiConfig,
  onOpenSettings,
}) => {
  const [stats, setStats] = useState<RumourStats>(DEMO_RUMOUR_STATS);
  const [clusters, setClusters] = useState<ClaimCluster[]>([]);
  const [filters, setFilters] = useState<FilterParams>({
    domain: 'all',
    label: 'all',
    guidance_gap_only: false,
    search_query: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Modal / Drawer state
  const [selectedCluster, setSelectedCluster] = useState<ClaimCluster | null>(null);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [dailyBrief, setDailyBrief] = useState<DailyBrief | null>(null);

  // Load stats and clusters
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, clustersData] = await Promise.all([
        getRumourStats(),
        getClusters(filters),
      ]);
      setStats(statsData);
      setClusters(clustersData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch rumour desk data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Reload Synthetic Demo
  const handleReloadDemo = async () => {
    setIsReloading(true);
    try {
      const res = await reloadSyntheticDemo();
      await fetchData();
      setStatusNotification(res.message);
      setTimeout(() => setStatusNotification(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reload demo';
      setError(msg);
    } finally {
      setIsReloading(false);
    }
  };

  // Open Daily Brief Modal
  const handleOpenBrief = async () => {
    try {
      const brief = await getDailyBrief();
      setDailyBrief(brief);
      setIsBriefModalOpen(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load daily brief';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Synthetic Benchmark Banner */}
      <SyntheticBanner
        language={language}
        onReloadDemo={handleReloadDemo}
        isReloading={isReloading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                Institutional Intel
              </span>
              <span className="text-xs text-slate-500 font-medium">
                NCDC &bull; FCCPC &bull; NHIA &bull; INEC
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Rumour Desk Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Inspect circulating misinformation clusters, monitor guidance gaps with zero official advisories, and prepare verified broadcast responses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenBrief}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>Generate Daily Brief</span>
            </button>
          </div>
        </div>

        {/* Temporary Notification Banner */}
        {statusNotification && (
          <div
            role="status"
            className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusNotification}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm space-y-2"
          >
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Backend Communication Notice</span>
            </div>
            <p className="font-mono text-xs text-red-700 bg-white/70 p-2 rounded border border-red-200">
              {error}
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={fetchData}
                className="px-3 py-1 rounded-md bg-red-800 text-white text-xs font-bold"
              >
                Retry
              </button>
              <button
                onClick={onOpenSettings}
                className="px-3 py-1 rounded-md bg-white border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Switch to Demo Mode
              </button>
            </div>
          </div>
        )}

        {/* KPI Metric Overview */}
        <StatsOverview stats={stats} isDemoMode={apiConfig.mode === 'demo'} />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onOpenBriefModal={handleOpenBrief}
          onReloadDemo={handleReloadDemo}
          isReloading={isReloading}
          totalResultsCount={clusters.length}
        />

        {/* Main Cluster Table / Cards */}
        <section aria-label="Circulating claim clusters list">
          <ClusterTable
            clusters={clusters}
            onInspectCluster={setSelectedCluster}
            isLoading={isLoading}
          />
        </section>
      </main>

      {/* Slide-over Inspection Drawer */}
      <ClusterDrawer
        cluster={selectedCluster}
        onClose={() => setSelectedCluster(null)}
      />

      {/* Daily Brief Modal */}
      <DailyBriefModal
        brief={dailyBrief}
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
      />
    </div>
  );
};
