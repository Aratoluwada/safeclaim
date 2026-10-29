/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Filter,
  Search,
  FileText,
  RefreshCw,
  AlertOctagon,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { DomainType, FilterParams, VerdictLabel } from '../../types/api';

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
    { label: 'Election', value: 'election_procedure' },
  ];

  const verdicts: Array<{ label: string; value: VerdictLabel | 'all' }> = [
    { label: 'All Verdicts', value: 'all' },
    { label: 'Contradicted', value: 'CONTRADICTED_BY_OFFICIAL_SOURCE' },
    { label: 'Supported', value: 'SUPPORTED_BY_OFFICIAL_SOURCE' },
    { label: 'No Official Source', value: 'NO_OFFICIAL_SOURCE_FOUND' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Row: Search + Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="cluster-search" className="sr-only">
            Search claim clusters
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="cluster-search"
            type="text"
            value={filters.search_query || ''}
            onChange={(e) => onFilterChange({ ...filters, search_query: e.target.value })}
            placeholder="Search rumours, explanations, or messages..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        {/* Action Buttons: Generate Daily Brief + Reload Demo */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenBriefModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Generate Daily Brief</span>
          </button>

          <button
            type="button"
            onClick={onReloadDemo}
            disabled={isReloading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition cursor-pointer disabled:opacity-50"
            title="Reload synthetic benchmark clusters"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
            <span>{isReloading ? 'Reloading...' : 'Reload Demo'}</span>
          </button>
        </div>
      </div>

      {/* Second Row: Filters & Toggle */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Domain and Verdict selects / chips */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Domain Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Domain:
            </span>
            <select
              value={filters.domain || 'all'}
              onChange={(e) => onFilterChange({ ...filters, domain: e.target.value as DomainType | 'all' })}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Verdict:
            </span>
            <select
              value={filters.label || 'all'}
              onChange={(e) => onFilterChange({ ...filters, label: e.target.value as VerdictLabel | 'all' })}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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

        {/* Guidance Gap Priority Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={!!filters.guidance_gap_only}
            onClick={() => onFilterChange({ ...filters, guidance_gap_only: !filters.guidance_gap_only })}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              filters.guidance_gap_only
                ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-2xs ring-2 ring-amber-400/30'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
            }`}
          >
            <div
              className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                filters.guidance_gap_only ? 'bg-amber-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  filters.guidance_gap_only ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </div>
            <span className="flex items-center gap-1">
              <Flame className={`w-3.5 h-3.5 ${filters.guidance_gap_only ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>Show Only Guidance Gaps</span>
            </span>
          </button>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            ({totalResultsCount} clusters shown)
          </span>
        </div>
      </div>
    </div>
  );
};
