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
  PhoneCall,
  Sparkles,
  Layers,
  Building2,
} from 'lucide-react';
import { LanguageCode } from '../types/api';
import { TRANSLATIONS } from '../utils/translations';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { VerdictStamp } from '../components/common/VerdictStamp';
import { WobblyUnderline } from '../components/hand/WobblyUnderline';
import { HandArrow } from '../components/hand/HandArrow';
import { HandCircle } from '../components/hand/HandCircle';
import { SquiggleDivider } from '../components/hand/SquiggleDivider';
import { PhoneFrame } from '../components/mockups/PhoneFrame';
import { DashboardFrame } from '../components/mockups/DashboardFrame';
import { CitationFrame } from '../components/mockups/CitationFrame';
import { Photo } from '../components/common/Photo';

interface HomePageProps {
  language: LanguageCode;
}

export const HomePage: React.FC<HomePageProps> = ({ language }) => {
  const navigate = useNavigate();
  const [quickQuery, setQuickQuery] = useState('');
  const t = TRANSLATIONS[language];

  React.useEffect(() => {
    document.title = `${t.appName} — ${t.tagline}`;
  }, [t.appName, t.tagline]);

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
      agency: 'NCDC Advisory #24',
    },
    {
      label: 'SUPPORTED_BY_OFFICIAL_SOURCE' as const,
      claim: 'Under FCCPC directives, digital loan apps cannot blast your contact list or publish defamatory photos.',
      summary: 'FCCPC Limited Interim Framework expressly prohibits contact scraping and consumer harassment.',
      passageId: 'fccpc#3',
      agency: 'FCCPC Order 127',
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
    <div className="space-y-16 sm:space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Hero: The Neighbour with the Receipts */}
      <section className="pt-4 sm:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-soft text-indigo-ink font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-indigo-solid motion-safe:animate-pulse" />
            <span>Civic Fact-Checking Engine • Nigeria</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F1B16] dark:text-[#F4EEE4] leading-[1.1]">
            {language === 'pcm' ? (
              <>
                Di trusted neighbour wey hold di{' '}
                <span className="relative inline-block">
                  official receipts.
                  <WobblyUnderline className="absolute -bottom-2 left-0 w-full" color="#8A2F7D" />
                </span>
              </>
            ) : (
              <>
                The trusted neighbour with the{' '}
                <span className="relative inline-block">
                  receipts.
                  <WobblyUnderline className="absolute -bottom-2 left-0 w-full" color="#8A2F7D" />
                </span>
              </>
            )}
          </h1>

          <p className="font-body text-lg sm:text-xl text-[#63584C] dark:text-[#A89E90] leading-relaxed max-w-2xl">
            {language === 'pcm'
              ? 'SafeClaim AI dey help you check WhatsApp forwarded rumours, loan app wahala, and fake grant links against real government gazettes (NCDC, FCCPC, NHIA). If government never talk am, we go tell you say no proof dey.'
              : 'SafeClaim AI evaluates public-health panics, predatory digital loan apps, and suspicious benefit announcements using official circulars and gazettes. Evidence is the hero: we show the exact pulled passage, or abstain clearly.'}
          </p>

          {/* Search dispatch box */}
          <form onSubmit={handleQuickSubmit} className="pt-2 max-w-xl">
            <div className="rounded-2xl bg-white dark:bg-[#201C17] border-2 border-[#D4C5B3] dark:border-[#3D352C] focus-within:border-accent p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch gap-2 shadow-sm">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-[#8E8273] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base text-[#1F1B16] dark:text-[#F4EEE4] placeholder:text-[#8E8273] bg-transparent focus:outline-none min-h-[44px]"
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="shrink-0 font-bold px-6 min-h-[44px]">
                <span>{t.homeSearchAction}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Quick test prompt row */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-[#63584C] dark:text-[#A89E90] font-mono">
              <span className="font-bold text-[#1F1B16] dark:text-[#F4EEE4]">Test a Rumour:</span>
              <button
                type="button"
                onClick={() => handlePromptClick('Is Ebola confirmed in Lagos right now?')}
                className="cursor-pointer underline hover:text-accent"
              >
                Ebola in Lagos
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handlePromptClick('Does drinking salt water prevent Ebola?')}
                className="cursor-pointer underline hover:text-accent"
              >
                Salt Water Myth
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handlePromptClick('How can I check if a loan app is registered by FCCPC?')}
                className="cursor-pointer underline hover:text-accent"
              >
                FCCPC Loan Apps
              </button>
            </div>
          </form>
        </div>

        {/* Code-built WhatsApp phone preview mockup */}
        <div className="lg:col-span-5 flex justify-center relative rounded-[2rem] bg-sky-soft px-4 py-10 sm:px-8">
          <div className="absolute top-2 right-5 hidden sm:block font-hand text-xl text-sky-ink transform rotate-3 z-10">
            <span>Direct WhatsApp receipts ↓</span>
          </div>
          <PhoneFrame className="transform sm:rotate-1 hover:rotate-0 transition-transform" />
        </div>
      </section>

      <SquiggleDivider color="#D4C5B3" />

      {/* 2. Three Transparent Verdict Stamps */}
      <section className="space-y-6">
        <div className="text-center sm:text-left space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-orchid-ink">
            Verification Taxonomy
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1B16] dark:text-[#F4EEE4]">
            Three Transparent Verdicts. Never AI Hallucinations.
          </h2>
          <p className="text-sm sm:text-base text-[#63584C] dark:text-[#A89E90] max-w-2xl font-body">
            SafeClaim AI never guesses or makes things up. If a claim contradicts official guidance, it gets stamped Contradicted. If confirmed, Supported. If no agency has published guidance, it abstains honestly.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 m-0 p-0 list-none">
          {sampleVerdicts.map((item, idx) => (
            <li key={idx} className="m-0 p-0">
              <Card
                variant="bordered"
                padding="md"
                className="h-full flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <VerdictStamp verdict={item.label} size="sm" rotate={true} />
                    <span className="font-mono text-[11px] text-[#63584C] dark:text-[#A89E90] font-bold">
                      {item.agency}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-[#1F1B16] dark:text-[#F4EEE4] leading-snug">
                    &ldquo;{item.claim}&rdquo;
                  </h3>
                  <p className="text-xs sm:text-sm text-[#63584C] dark:text-[#A89E90] font-body leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8DFD5] dark:border-[#2D261F] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8E8273]">Passage: [{item.passageId}]</span>
                  <button
                    type="button"
                    onClick={() => handlePromptClick(item.claim)}
                    className="cursor-pointer text-accent hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Evidence Grounding Mockup: CitationFrame */}
      <section className="space-y-4 rounded-[2rem] bg-violet-soft px-5 py-8 sm:px-8 sm:py-10">
        <div className="text-center sm:text-left space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-violet-ink">
            Evidence As Hero
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1F1B16] dark:text-[#F4EEE4]">
            How Official Passages Are Pulled & Cited
          </h2>
          <p className="text-sm sm:text-base text-[#63584C] dark:text-[#A89E90] max-w-2xl font-body">
            Every sentence in a SafeClaim answer maps to a verifiable government passage ID. Click any badge to view the pulled excerpt and open the official gazette.
          </p>
        </div>

        <CitationFrame />
      </section>

      {/* 4. Community Pillars & Hotline (Photo + Helpline) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Civic photo asset */}
        <div className="rounded-3xl border border-[#E8DFD5] dark:border-[#3D352C] bg-cream-soft p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase text-orchid-ink">
              Community Civic Archives
            </div>
            <h3 className="font-display font-bold text-xl text-[#1F1B16] dark:text-[#F4EEE4]">
              Rooted in Nigerian Community Reality
            </h3>
            <p className="text-xs sm:text-sm text-[#63584C] dark:text-[#A89E90] font-body leading-relaxed">
              From market radio broadcasts to WhatsApp church and school groups, rumours spread fast. SafeClaim equips citizens with authoritative receipts in both clear English and authentic Naija Pidgin.
            </p>
          </div>

          <Photo id="heroNeighbour" language={language} className="rounded-xl shadow-xs" />
        </div>

        {/* Toll-Free Hotline Tile */}
        <div className="rounded-3xl bg-forest-solid text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white text-[#0A5C36]">
                Emergency Hotline
              </span>
              <span className="text-xs font-mono text-[#CFE9D8] font-bold">
                Toll-Free Across Nigeria
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Need Immediate Disease or Public Health Verification?
            </h3>
            <p className="text-sm text-[#E4F2E9] font-body leading-relaxed">
              When symptoms arise or an outbreak rumour spikes in your area, contact the Nigeria Centre for Disease Control (NCDC) directly. No airtime needed.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-white text-[#1F1B16] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-mono text-[#63584C] font-bold">
                  NCDC Toll-Free Call Centre
                </span>
                <span className="font-mono text-2xl font-bold text-[#0A5C36]">
                  6232
                </span>
              </div>
              <a
                href="tel:6232"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A5C36] hover:bg-[#074528] text-white font-mono font-bold text-xs shadow-xs transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 6232 Now</span>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-white text-[#1F1B16] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-mono text-[#63584C] font-bold">
                  Official WhatsApp Verification
                </span>
                <span className="font-mono text-base font-bold text-[#1F1B16]">
                  0809 955 5577
                </span>
              </div>
              <a
                href="https://wa.me/2348099555577"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D4C5B3] bg-white hover:bg-[#F5EFEB] text-[#1F1B16] text-xs font-mono font-bold transition"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Rumour Desk for Institutions: DashboardFrame */}
      <section className="space-y-6 rounded-[2rem] bg-indigo-soft px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-ink uppercase tracking-wider">
              <LayoutDashboard className="w-4 h-4" />
              <span>Institutional Intelligence Desk</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1F1B16] dark:text-[#F4EEE4]">
              Built for Newsrooms, Fact-Checkers &amp; Public Agencies
            </h2>
            <p className="text-sm sm:text-base text-[#63584C] dark:text-[#A89E90] font-body">
              Monitor viral clusters in real-time. Detect Guidance Gaps where citizens are desperate for clarity but zero government circulars exist. Generate broadcast-ready daily briefs in seconds.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/desk')}
            className="shrink-0 font-bold"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Open Rumour Desk</span>
          </Button>
        </div>

        <DashboardFrame />
      </section>

      {/* 6. Approved Portals Registry */}
      <section className="rounded-[2rem] bg-cream-soft border border-[#E8DFD5] dark:border-[#3D352C] p-6 sm:p-8 space-y-5">
        <div className="space-y-1.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-ink">
            Source Integrity
          </span>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-[#1F1B16] dark:text-[#F4EEE4]">
            Official Grounding Repositories
          </h3>
          <p className="text-xs sm:text-sm text-[#63584C] dark:text-[#A89E90] font-body">
            SafeClaim indexes verified circulars, advisories, and gazettes published by accredited federal authorities:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-sage-soft p-4 rounded-xl space-y-1">
            <div className="font-mono font-bold text-xs text-sage-ink">NCDC</div>
            <div className="font-semibold text-xs text-[#1F1B16] dark:text-[#F4EEE4]">Disease Control &amp; Prevention</div>
            <div className="text-[11px] font-mono text-[#8E8273]">Toll-Free 6232 • ncdc.gov.ng</div>
          </div>

          <div className="bg-indigo-soft p-4 rounded-xl space-y-1">
            <div className="font-mono font-bold text-xs text-indigo-ink">FCCPC</div>
            <div className="font-semibold text-xs text-[#1F1B16] dark:text-[#F4EEE4]">Consumer Protection &amp; Lending</div>
            <div className="text-[11px] font-mono text-[#8E8273]">Loan App Registry • fccpc.gov.ng</div>
          </div>

          <div className="bg-sky-soft p-4 rounded-xl space-y-1">
            <div className="font-mono font-bold text-xs text-sky-ink">NHIA / NHIS</div>
            <div className="font-semibold text-xs text-[#1F1B16] dark:text-[#F4EEE4]">National Health Insurance</div>
            <div className="text-[11px] font-mono text-[#8E8273]">Enrolment Guidelines • nhia.gov.ng</div>
          </div>

          <div className="bg-violet-soft p-4 rounded-xl space-y-1">
            <div className="font-mono font-bold text-xs text-violet-ink">INEC</div>
            <div className="font-semibold text-xs text-[#1F1B16] dark:text-[#F4EEE4]">Electoral Commission</div>
            <div className="text-[11px] font-mono text-[#8E8273]">Official Gazettes • inecnigeria.org</div>
          </div>
        </div>
      </section>

      {/* 7. Closing CTA */}
      <section className="text-center rounded-[2rem] bg-indigo-solid text-white px-6 py-12 sm:py-16 space-y-4">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
          Got a rumour forwarding in your family group?
        </h2>
        <p className="text-base text-[#DDE3FA] max-w-xl mx-auto font-body">
          Do not guess or forward blindly. Get the verified official guidance in seconds.
        </p>
        <div className="pt-2 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/ask')}
            className="font-bold px-8 !bg-white !text-[#27358F] !border-white hover:!bg-[#E3E8F8]"
          >
            <span>Verify a Claim Now</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  );
};
