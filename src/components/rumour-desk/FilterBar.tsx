/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Search,
  FileText,
  RefreshCw,
  Flame,
} from 'lucide-react';
import { DomainType, FilterParams, VerdictLabel } from '../../types/api';
import { Button } from '../ui/Button';

interface FilterBarProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  onOpenBriefModal: () => void;
  onReloadDemo: () => void;
  isReloading?: boolean;
  totalResultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onOpenBriefModal,
  onReloadDemo,
  isReloading = false,
  totalResultsCount,
}) => {
  const domains: Array<{ label: string; value: DomainType | 'all' }> = [
    { label: 'All Domains', value: 'all' },
    { label: 'Outbreak', value: 'outbreak' },
    { label: 'Scams', value: 'scam' },
    { label: 'Benefits', value: 'benefit' },
    { label: 'Election Procedure', value: 'election_procedure' },
  ];

  const verdicts: Array<{ label: string; value: VerdictLabel | 'all' }> = [
    { label: 'All Verdicts', value: 'all' },
    { label: 'Contradicted', value: 'CONTRADICTED_BY_OFFICIAL_SOURCE' },
    { label: 'Supported', value: 'SUPPORTED_BY_OFFICIAL_SOURCE' },
    { label: 'No Official Source', value: 'NO_OFFICIAL_SOURCE_FOUND' },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-800 p-3.5 sm:p-4 space-y-3 shadow-2xs">
      {/* Top Row: Search Input + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="cluster-search" className="sr-only">
            Search claim clusters
          </label>
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            id="cluster-search"
            type="text"
            value={filters.search_query || ''}
            onChange={(e) => onFilterChange({ ...filters, search_query: e.target.value })}
            placeholder="Search rumours, explanations, or messages..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-950/60 text-neutral-900 dark:text-neutral-100 focus-ring min-h-[38px]"
          />
        </div>

        {/* Action Buttons: Generate Daily Brief + Reload Demo */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenBriefModal}
            className="font-medium text-xs h-9 min-h-[38px]"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Generate Daily Brief</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onReloadDemo}
            disabled={isReloading}
            className="text-xs h-9 min-h-[38px]"
            title="Reload synthetic benchmark clusters"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-emerald-600' : 'text-neutral-500'}`} aria-hidden="true" />
            <span>{isReloading ? 'Reloading...' : 'Reload Demo'}</span>
          </Button>
        </div>
      </div>

      {/* Second Row: Filters, Guidance Gap Switch & Count */}
      <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Domain Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
              Domain:
            </span>
            <select
              value={filters.domain || 'all'}
              onChange={(e) => onFilterChange({ ...filters, domain: e.target.value as DomainType | 'all' })}
              className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus-ring cursor-pointer"
              aria-label="Filter by domain"
            >
              {domains.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Verdict Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
              Verdict:
            </span>
            <select
              value={filters.label || 'all'}
              onChange={(e) => onFilterChange({ ...filters, label: e.target.value as VerdictLabel | 'all' })}
              className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus-ring cursor-pointer"
              aria-label="Filter by official verdict"
            >
              {verdicts.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Guidance Gap Priority Toggle Switch */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={!!filters.guidance_gap_only}
            onClick={() => onFilterChange({ ...filters, guidance_gap_only: !filters.guidance_gap_only })}
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-medium transition cursor-pointer focus-ring min-h-[36px] ${
              filters.guidance_gap_only
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700 font-semibold'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
            }`}
          >
            <div
              className={`w-6 h-3.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                filters.guidance_gap_only ? 'bg-amber-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                  filters.guidance_gap_only ? 'translate-x-2.5' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Flame className={`w-3.5 h-3.5 ${filters.guidance_gap_only ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-400'}`} aria-hidden="true" />
              <span>Show Only Guidance Gaps</span>
            </span>
          </button>

          <span className="font-mono text-[11px] text-neutral-500 hidden sm:inline">
            ({totalResultsCount} clusters)
          </span>
        </div>
      </div>
    </div>
  );
};
