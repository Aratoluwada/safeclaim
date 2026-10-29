/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { LanguageCode } from '../types/api';
import { TRANSLATIONS } from '../utils/translations';
import { Database, Search, ShieldCheck, Layers, FileText } from 'lucide-react';

interface HowItWorksPageProps {
  language: LanguageCode;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    document.title = 'How SafeClaim Works — Verification Methodology';
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Continuous Ingestion of Official Gazettes & Advisories',
      description:
        'SafeClaim monitors and parses authoritative Nigerian publications: NCDC outbreak bulletins, FCCPC digital money lending whitelist, NHIA operational circulars, and INEC electoral directives. Unofficial blogs, social media posts, and unverified forwards are strictly excluded from the evidence repository.',
      icon: Database,
    },
    {
      number: '02',
      title: 'Dense Passage Retrieval & Semantic Matching',
      description:
        'When a citizen asks a question or a circulating message enters the system, a high-dimensional vector search retrieves candidate official passages. Every candidate retains its exact immutable passage ID, source document URL, publication date, and originating government entity.',
      icon: Search,
    },
    {
      number: '03',
      title: 'Strict Grounding & Cosine Threshold Gating',
      description:
        'The open-weight model (Mistral-7B-Instruct / Gemma-2-9B-IT) is prompted under zero-hallucination constraints: every assertion must cite a retrieved passage ID (e.g. [ncdc#1]). If candidate passages do not reach the required similarity threshold, SafeClaim triggers an explicit abstention (NO_OFFICIAL_SOURCE_FOUND) rather than guessing.',
      icon: ShieldCheck,
    },
    {
      number: '04',
      title: 'Claim Clustering & Guidance Gap Identification',
      description:
        'Incoming messages are grouped into semantic clusters based on claim similarity and domain (Outbreak, Scam, Benefit, Election Procedure). When a cluster surges in message volume without any matching official publication, it is escalated as a Guidance Gap so agencies know what to clarify.',
      icon: Layers,
    },
    {
      number: '05',
      title: 'Broadcast-Ready Replies & Institutional Briefs',
      description:
        'For refuted or supported claims, SafeClaim provides plain-language public replies in English and Naijá Pidgin for instant dissemination on WhatsApp and radio. Analysts can download compiled Daily Intelligence Briefs (.md) with suggested agency interventions.',
      icon: FileText,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <PageHeader
        eyebrow="Architecture & Methodology"
        title="How SafeClaim AI Works"
        description="A transparent, verifiable pipeline designed to halt public-health panics and predatory scams in Nigeria through official evidence grounding."
      />

      {/* Semantic ordered list <ol> with <li> for steps */}
      <ol className="space-y-4 m-0 p-0 list-none">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <li key={step.number} className="m-0 p-0">
              <Card variant="default" padding="md" className="space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0A5C36] dark:text-emerald-400 bg-[#EBF4EF] dark:bg-[#0D2D1E] px-2 py-0.5 rounded-[2px] border border-[#C2DEC9] dark:border-[#1F4A33]">
                      Step {step.number}
                    </span>
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                      {step.title}
                    </h3>
                  </div>
                  <Icon className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed pt-1">
                  {step.description}
                </p>
              </Card>
            </li>
          );
        })}
      </ol>

      {/* Principles list */}
      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-5 bg-neutral-50 dark:bg-neutral-900/60 space-y-3">
        <h3 className="font-mono text-xs font-semibold uppercase text-neutral-600 dark:text-neutral-400">
          Core Safety Commitments
        </h3>
        <ul className="space-y-2 m-0 p-0 list-none text-xs text-neutral-700 dark:text-neutral-300 font-sans">
          <li className="flex items-start gap-2">
            <span className="text-[#0A5C36] dark:text-emerald-400 font-bold">&bull;</span>
            <span><strong>Never Invent Citations:</strong> Passages must map to an actual gazette or circular URL.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0A5C36] dark:text-emerald-400 font-bold">&bull;</span>
            <span><strong>Absence != Falsity:</strong> If an agency has not spoken on an emerging rumour, it is an unverified guidance gap, not a disproven claim.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#0A5C36] dark:text-emerald-400 font-bold">&bull;</span>
            <span><strong>Verified Hotlines Only:</strong> Helplines like NCDC 6232 are shown only when documented by verified records.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
