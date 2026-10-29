/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  AlertTriangle,
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
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';

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

  // Set document title
  useEffect(() => {
    document.title = 'Rumour Desk Dashboard — SafeClaim Institutional Intelligence';
  }, []);

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
    <div className="space-y-6">
      {/* Synthetic Benchmark Banner */}
      <SyntheticBanner
        language={language}
        onReloadDemo={handleReloadDemo}
        isReloading={isReloading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <PageHeader
          eyebrow="Institutional Intelligence Console"
          title="Rumour Desk Dashboard"
          description="Inspect circulating misinformation clusters, monitor guidance gaps with zero official advisories, and prepare verified broadcast responses."
          actions={
            <Button variant="primary" size="md" onClick={handleOpenBrief}>
              <FileText className="w-4 h-4" />
              <span>Generate Daily Brief</span>
            </Button>
          }
        />

        {/* Temporary Notification Banner */}
        {statusNotification && (
          <div
            role="status"
            className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-mono flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusNotification}</span>
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div
            role="alert"
            className="p-4 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs space-y-2 font-mono"
          >
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Backend Error: Failed to contact live server</span>
            </div>
            <p className="bg-white dark:bg-neutral-900 p-2 rounded border border-red-200 dark:border-red-900">
              {error}
            </p>
            <div className="flex gap-2 pt-1 font-sans">
              <Button variant="danger" size="sm" onClick={fetchData}>
                Retry
              </Button>
              <Button variant="secondary" size="sm" onClick={onOpenSettings}>
                Configure Backend / Switch Mode
              </Button>
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

        {/* Main Cluster Table */}
        <section aria-label="Circulating claim clusters list">
          <ClusterTable
            clusters={clusters}
            onInspectCluster={setSelectedCluster}
            isLoading={isLoading}
          />
        </section>
      </div>

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
