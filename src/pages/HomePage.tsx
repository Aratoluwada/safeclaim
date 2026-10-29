/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import { LanguageCode } from '../types/api';
import { TRANSLATIONS } from '../utils/translations';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { VerdictBadge } from '../components/common/VerdictBadge';

interface HomePageProps {
  language: LanguageCode;
}

export const HomePage: React.FC<HomePageProps> = ({ language }) => {
  const navigate = useNavigate();
  const [quickQuery, setQuickQuery] = useState('');
  const t = TRANSLATIONS[language];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/ask?q=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      navigate('/ask');
    }
  };

  const handlePromptClick = (query: string) => {
    navigate(`/ask?q=${encodeURIComponent(query)}`);
  };

  const sampleVerdicts = [
    {
      label: 'CONTRADICTED_BY_OFFICIAL_SOURCE' as const,
      claim: 'Viral audio claiming Ebola outbreak has re-emerged in Lagos general hospitals.',
      summary: 'NCDC epidemiological surveillance confirms zero confirmed cases in Lagos or nationwide.',
      passageId: 'ncdc#1',
      agency: 'NCDC',
    },
    {
      label: 'SUPPORTED_BY_OFFICIAL_SOURCE' as const,
      claim: 'Under FCCPC directives, digital loan apps cannot blast your contact list or publish defamatory photos.',
      summary: 'FCCPC Limited Interim Framework expressly prohibits contact scraping and consumer harassment.',
      passageId: 'fccpc#3',
      agency: 'FCCPC',
    },
    {
      label: 'NO_OFFICIAL_SOURCE_FOUND' as const,
      claim: 'Boiled guava leaves and ginger immediately cleanse suspected Mpox blisters within 24 hours.',
      summary: 'No clinical guide or NCDC bulletin validates guava concoctions. Classified as a critical guidance gap.',
      passageId: 'guidance-gap',
      agency: 'Advisory Needed',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Editorial Hero Banner */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 pb-10">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#0A5C36] dark:text-emerald-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#0A5C36] dark:bg-emerald-400"></span>
            <span>Public Evidence Grounding Engine &bull; Nigeria</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.15] text-left">
            {t.homeHeroTitle}
          </h1>

          <p className="font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl text-left">
            {t.homeHeroLead}
          </p>

          {/* Quick Query Box */}
          <form onSubmit={handleQuickSubmit} className="pt-4 max-w-2xl">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md p-1.5 focus-within:border-[#0A5C36] focus-within:ring-2 focus-within:ring-[#0A5C36]/20 shadow-2xs">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 bg-transparent focus:outline-none min-h-[44px]"
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="shrink-0 min-h-[44px]">
                <span>{t.homeSearchAction}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Semantic prompt list */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 font-mono">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">Quick Test:</span>
              <ul className="flex flex-wrap gap-1.5 m-0 p-0 list-none">
                <li>
                  <button
                    type="button"
                    onClick={() => handlePromptClick('Is Ebola confirmed in Lagos right now?')}
                    className="underline hover:text-[#0A5C36] dark:hover:text-emerald-400 cursor-pointer"
                  >
                    Ebola in Lagos
                  </button>
                  <span className="mx-1 text-neutral-300">&bull;</span>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handlePromptClick('How can I check if a loan app is registered by FCCPC?')}
                    className="underline hover:text-[#0A5C36] dark:hover:text-emerald-400 cursor-pointer"
                  >
                    FCCPC Loan Apps
                  </button>
                  <span className="mx-1 text-neutral-300">&bull;</span>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handlePromptClick('How do I register for the National Health Insurance Scheme?')}
                    className="underline hover:text-[#0A5C36] dark:hover:text-emerald-400 cursor-pointer"
                  >
                    NHIA Registration
                  </button>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </section>

      {/* The Three Official Verdicts in Action */}
      <section className="space-y-4">
        <div>
          <span className="font-mono text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 tracking-wider">
            Verification Taxonomy
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
            How SafeClaim Evaluates Circulating Claims
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl font-sans mt-1">
            SafeClaim never relies on intuition or language model tone. Every conclusion maps strictly to one of three transparent verdicts backed by official records.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 m-0 p-0 list-none">
          {sampleVerdicts.map((item, idx) => (
            <li key={idx} className="m-0 p-0">
              <Card variant="default" padding="md" className="h-full flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <VerdictBadge verdict={item.label} size="sm" />
                    <span className="font-mono text-[10px] text-neutral-400 font-semibold uppercase">
                      {item.agency}
                    </span>
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 leading-snug">
                    &ldquo;{item.claim}&rdquo;
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Passage: [{item.passageId}]</span>
                  <button
                    type="button"
                    onClick={() => handlePromptClick(item.claim)}
                    className="text-[#0A5C36] dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* Institutional Teaser Card */}
      <section className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
              <LayoutDashboard className="w-4 h-4 text-[#0A5C36] dark:text-emerald-400" />
              <span>For Public Health & Fact-Checking Desks</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t.homeDeskTeaserTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
              {t.homeDeskTeaserLead}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-2.5">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/desk')}
              className="font-semibold"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.homeViewDeskAction}</span>
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/how-it-works')}
            >
              <span>Methodology & Architecture</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
