import React, { useState } from 'react';
import { ExternalLink, FileCheck2, Sparkles, Building2 } from 'lucide-react';

interface CitationFrameProps {
  className?: string;
}

export const CitationFrame: React.FC<CitationFrameProps> = ({ className = '' }) => {
  const [activeCitation, setActiveCitation] = useState<'ncdc#1' | 'fccpc#1'>('ncdc#1');

  return (
    <div
      className={`rounded-2xl border-2 border-[#D4C5B3] dark:border-[#3D352C] bg-[#FAF7F2] dark:bg-[#1A1713] p-5 shadow-lg space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#2D261F] pb-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-[#0A5C36] dark:text-[#34D399]" />
          <span className="font-display font-bold text-base text-[#1F1B16] dark:text-[#EDE7DF]">
            Evidence-Grounded Explanation & Receipts
          </span>
        </div>
        <span className="font-hand text-lg text-[#24306E] dark:text-[#8BA0E8] transform -rotate-2">
          Click citation chip to pull circular ↓
        </span>
      </div>

      {/* Model explanation with inline citation chips */}
      <div className="bg-white dark:bg-[#231F1A] p-4 rounded-xl border border-[#E8DFD5] dark:border-[#3D352C] space-y-2.5">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0A5C36] dark:text-[#34D399] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clear Human Explanation</span>
        </div>
        <p className="text-sm leading-relaxed text-[#1F1B16] dark:text-[#EDE7DF]">
          No approved government agency has endorsed salt water as a cholera remedy. According to the Nigeria Centre for Disease Control (NCDC) public advisory{' '}
          <button
            onClick={() => setActiveCitation('ncdc#1')}
            className={`cursor-pointer inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded transition-all ${
              activeCitation === 'ncdc#1'
                ? 'bg-[#0A5C36] text-white shadow-xs'
                : 'bg-[#EBF4EF] dark:bg-[#1C3225] text-[#0A5C36] dark:text-[#34D399] hover:bg-[#D4E8DC]'
            }`}
          >
            [ncdc#1]
          </button>
          , cholera is caused by ingesting contaminated water or food containing Vibrio cholerae bacteria. The Federal Competition & Consumer Protection Commission (FCCPC){' '}
          <button
            onClick={() => setActiveCitation('fccpc#1')}
            className={`cursor-pointer inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded transition-all ${
              activeCitation === 'fccpc#1'
                ? 'bg-[#24306E] text-white shadow-xs'
                : 'bg-[#EEF1FA] dark:bg-[#1E2540] text-[#24306E] dark:text-[#8BA0E8] hover:bg-[#D8DEFA]'
            }`}
          >
            [fccpc#1]
          </button>{' '}
          also cautions against unverified online merchants exploiting health panics to market bogus remedies.
        </p>
      </div>

      {/* Physical Pulled Official Circular */}
      <div className="official-document-sheet p-4 sm:p-5 rounded-xl border-l-4 border-l-[#0A5C36] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0A5C36] dark:text-[#34D399]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1F1B16] dark:text-[#EDE7DF]">
              {activeCitation === 'ncdc#1'
                ? 'Nigeria Centre for Disease Control (NCDC)'
                : 'Federal Competition & Consumer Protection Commission (FCCPC)'}
            </span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
            Passage: {activeCitation}
          </span>
        </div>

        <div>
          <h4 className="font-display font-bold text-base text-[#1F1B16] dark:text-[#EDE7DF] mb-1">
            {activeCitation === 'ncdc#1'
              ? 'Public Health Advisory: Prevention and Management of Cholera Outbreaks'
              : 'Regulatory Warning on Deceptive Health Products & Unregistered Health Claims'}
          </h4>
          <a
            href={
              activeCitation === 'ncdc#1'
                ? 'https://ncdc.gov.ng/advisories/cholera'
                : 'https://fccpc.gov.ng/advisories'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#0A5C36] dark:text-[#34D399] hover:underline font-mono"
          >
            <span>{activeCitation === 'ncdc#1' ? 'ncdc.gov.ng/advisories/cholera' : 'fccpc.gov.ng/advisories'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <blockquote className="p-3 bg-white/70 dark:bg-[#25201A]/70 rounded-lg border-l-2 border-[#D4C5B3] dark:border-[#3D352C] text-xs sm:text-sm italic leading-relaxed text-[#1F1B16] dark:text-[#EDE7DF]">
          {activeCitation === 'ncdc#1'
            ? '“Drinking high-concentration salt solutions or bathing in saltwater is completely ineffective in preventing or treating cholera. Such practices have led to acute salt poisoning, hypertension crises, and fatalities during past epidemics. Members of the public are strictly urged to boil drinking water, use certified chlorine tablets, and report symptoms immediately to 6232.”'
            : '“The Commission will prosecute any platform or vendor selling purported miracle cures, saltwater concoctions, or unauthorized health concoctions capitalizing on disease outbreaks under Section 127 of the FCCPA 2018.”'}
        </blockquote>
      </div>
    </div>
  );
};
