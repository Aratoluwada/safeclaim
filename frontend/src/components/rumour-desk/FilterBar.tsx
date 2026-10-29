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
    <div className="bg-white dark:bg-[#201C17] rounded-2xl border border-[#D4C5B3] dark:border-[#3D352C] p-4 sm:p-5 space-y-4 shadow-xs">
      {/* Top Row: Search Input + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="cluster-search" className="sr-only">
            Search claim clusters
          </label>
          <Search className="w-4 h-4 text-[#8E8273] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            id="cluster-search"
            type="text"
            value={filters.search_query || ''}
            onChange={(e) => onFilterChange({ ...filters, search_query: e.target.value })}
            placeholder="Search rumours, explanations, or messages..."
            className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] bg-[#FAF7F2] dark:bg-[#1A1612] text-[#1F1B16] dark:text-[#F4EEE4] placeholder:text-[#8E8273] focus-ring min-h-[42px]"
          />
        </div>

        {/* Action Buttons: Generate Daily Brief + Reload Demo */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenBriefModal}
            className="font-bold text-xs h-10 min-h-[40px] px-4"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Generate Daily Brief</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onReloadDemo}
            disabled={isReloading}
            className="text-xs h-10 min-h-[40px] px-3.5"
            title="Reload synthetic benchmark clusters"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-accent' : 'text-[#8E8273]'}`} aria-hidden="true" />
            <span>{isReloading ? 'Reloading...' : 'Reload Demo'}</span>
          </Button>
        </div>
      </div>

      {/* Second Row: Filters, Guidance Gap Switch & Count */}
      <div className="pt-3 border-t border-[#E8DFD5] dark:border-[#2D261F] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Domain Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-[#63584C] dark:text-[#A89E90] uppercase tracking-wider">
              Domain:
            </span>
            <select
              value={filters.domain || 'all'}
              onChange={(e) => onFilterChange({ ...filters, domain: e.target.value as DomainType | 'all' })}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] text-[#1F1B16] dark:text-[#F4EEE4] focus-ring cursor-pointer"
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
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-[#63584C] dark:text-[#A89E90] uppercase tracking-wider">
              Verdict:
            </span>
            <select
              value={filters.label || 'all'}
              onChange={(e) => onFilterChange({ ...filters, label: e.target.value as VerdictLabel | 'all' })}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] text-[#1F1B16] dark:text-[#F4EEE4] focus-ring cursor-pointer"
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
            className={`cursor-pointer inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition focus-ring min-h-[38px] ${
              filters.guidance_gap_only
                ? 'bg-[#FFFBEB] dark:bg-[#2A1E0E] text-[#B45309] dark:text-[#FBBF24] border-[#B45309] font-bold'
                : 'bg-white dark:bg-[#201C17] text-[#1F1B16] dark:text-[#F4EEE4] border-[#D4C5B3] dark:border-[#3D352C] hover:border-[#8E8273]'
            }`}
          >
            <div
              className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                filters.guidance_gap_only ? 'bg-[#B45309]' : 'bg-[#D4C5B3] dark:bg-[#3D352C]'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  filters.guidance_gap_only ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Flame className={`w-3.5 h-3.5 ${filters.guidance_gap_only ? 'text-[#B45309] dark:text-[#FBBF24]' : 'text-[#7A6F62]'}`} aria-hidden="true" />
              <span>Show Only Guidance Gaps</span>
            </span>
          </button>

          <span className="font-mono text-[11px] text-[#8E8273] hidden sm:inline">
            ({totalResultsCount} clusters)
          </span>
        </div>
      </div>
    </div>
  );
};
