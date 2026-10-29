import React from 'react';
import { VerdictStamp } from '../common/VerdictStamp';
import { Radio, AlertCircle, FileText, ChevronRight } from 'lucide-react';

interface DashboardFrameProps {
  className?: string;
}

export const DashboardFrame: React.FC<DashboardFrameProps> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-2xl border-2 border-[#D4C5B3] dark:border-[#3D352C] bg-[#FAF7F2] dark:bg-[#1A1713] p-4 sm:p-5 shadow-lg ${className}`}
    >
      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8DFD5] dark:border-[#2D261F] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0A5C36]"></span>
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1F1B16] dark:text-[#EDE7DF]">
            Live Institutional Intelligence
          </span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF4E8] dark:bg-[#25201A] border border-[#D4C5B3] dark:border-[#3D352C] text-[#63584C] dark:text-[#A89E90]">
          OSCA OPEN//BUILD 2026
        </span>
      </div>

      {/* Mini KPI tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <div className="bg-white dark:bg-[#231F1A] p-2.5 rounded-xl border border-[#E8DFD5] dark:border-[#3D352C]">
          <div className="text-[10px] font-mono text-[#63584C] dark:text-[#A89E90] uppercase">
            Messages Analyzed
          </div>
          <div className="text-xl font-display font-bold text-[#1F1B16] dark:text-[#EDE7DF]">
            1,420
          </div>
        </div>

        <div className="bg-white dark:bg-[#231F1A] p-2.5 rounded-xl border border-red-200 dark:border-red-950">
          <div className="text-[10px] font-mono text-[#B91C1C] dark:text-[#F87171] uppercase">
            Contradicted
          </div>
          <div className="text-xl font-display font-bold text-[#B91C1C] dark:text-[#F87171]">
            84
          </div>
        </div>

        <div className="bg-[#FFFBEB] dark:bg-[#2A1E0E] p-2.5 rounded-xl border-2 border-[#B45309] dark:border-[#D97706]">
          <div className="text-[10px] font-mono font-bold text-[#B45309] dark:text-[#FBBF24] uppercase flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Guidance Gaps</span>
          </div>
          <div className="text-xl font-display font-bold text-[#B45309] dark:text-[#FBBF24]">
            31
          </div>
        </div>

        <div className="bg-white dark:bg-[#231F1A] p-2.5 rounded-xl border border-[#E8DFD5] dark:border-[#3D352C]">
          <div className="text-[10px] font-mono text-[#63584C] dark:text-[#A89E90] uppercase">
            Outbreak Clusters
          </div>
          <div className="text-xl font-display font-bold text-[#0A5C36] dark:text-[#34D399]">
            5
          </div>
        </div>
      </div>

      {/* Cluster preview list */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-[#63584C] dark:text-[#A89E90] uppercase tracking-wider font-mono">
          Priority Rumour Clusters Detected
        </div>

        {/* Row 1: Guidance Gap */}
        <div className="bg-white dark:bg-[#221E19] p-3 rounded-xl border border-amber-300 dark:border-amber-900/60 flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <VerdictStamp
                verdict="NO_OFFICIAL_SOURCE_FOUND"
                size="sm"
                rotate={false}
                customLabel="Guidance Gap"
              />
              <span className="text-[10px] font-mono text-stone-400">Viral: 340+ mentions</span>
            </div>
            <p className="text-xs font-semibold text-[#1F1B16] dark:text-[#EDE7DF] truncate">
              "Federal Civil Service Commission 2026 Batch D Replacement Portal open on Facebook"
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
        </div>

        {/* Row 2: Contradicted */}
        <div className="bg-white dark:bg-[#221E19] p-3 rounded-xl border border-red-200 dark:border-red-950/60 flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <VerdictStamp
                verdict="CONTRADICTED_BY_OFFICIAL_SOURCE"
                size="sm"
                rotate={false}
                customLabel="Contradicted"
              />
              <span className="text-[10px] font-mono text-stone-400">NCDC Clarification</span>
            </div>
            <p className="text-xs font-semibold text-[#1F1B16] dark:text-[#EDE7DF] truncate">
              "Ebola case confirmed at General Hospital Lagos Island"
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
        </div>
      </div>
    </div>
  );
};
