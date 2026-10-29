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
import { WobblyUnderline } from '../components/hand/WobblyUnderline';

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
        'The language model is prompted under strict zero-hallucination constraints: every assertion must cite a retrieved passage ID (e.g. [ncdc#1]). If candidate passages do not reach the required similarity threshold, SafeClaim triggers an explicit abstention (NO_OFFICIAL_SOURCE_FOUND) rather than guessing.',
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
        'For refuted or supported claims, SafeClaim provides plain-language public replies in English and Naija Pidgin for instant dissemination on WhatsApp and radio. Analysts can download compiled Daily Intelligence Briefs (.md) with suggested agency interventions.',
      icon: FileText,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <PageHeader
        eyebrow="Architecture & Methodology"
        title={
          <>
            How SafeClaim AI{' '}
            <span className="relative inline-block">
              Works
              <WobblyUnderline className="absolute -bottom-2 left-0 w-full" color="#0A5C36" />
            </span>
          </>
        }
        description="A transparent, verifiable pipeline designed to halt public-health panics and predatory scams in Nigeria through official evidence grounding."
      />

      {/* Semantic ordered list <ol> with <li> for steps */}
      <ol className="space-y-4 m-0 p-0 list-none">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <li key={step.number} className="m-0 p-0">
              <Card variant="bordered" padding="md" className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#2D261F] pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#0A5C36] dark:text-[#34D399] bg-[#EBF4EF] dark:bg-[#1B2F23] px-2.5 py-0.5 rounded-md border border-[#BBD8C3] dark:border-[#2A5239]">
                      Step {step.number}
                    </span>
                    <h3 className="font-display font-bold text-base text-[#1F1B16] dark:text-[#EDE7DF]">
                      {step.title}
                    </h3>
                  </div>
                  <Icon className="w-4 h-4 text-[#8E8273]" aria-hidden="true" />
                </div>
                <p className="text-xs sm:text-sm text-[#63584C] dark:text-[#A89E90] font-body leading-relaxed pt-0.5">
                  {step.description}
                </p>
              </Card>
            </li>
          );
        })}
      </ol>

      {/* Principles list */}
      <div className="rounded-2xl border-2 border-[#D4C5B3] dark:border-[#3D352C] p-6 bg-[#FAF7F2] dark:bg-[#1A1612] space-y-3">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A5C36] dark:text-[#34D399]">
          Core Civic Commitments
        </h3>
        <ul className="space-y-2.5 m-0 p-0 list-none text-xs sm:text-sm text-[#1F1B16] dark:text-[#EDE7DF] font-body">
          <li className="flex items-start gap-2.5">
            <span className="text-[#0A5C36] dark:text-[#34D399] font-bold text-base leading-none">•</span>
            <span><strong>Never Invent Citations:</strong> Passages must map to an actual gazette or circular URL.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#0A5C36] dark:text-[#34D399] font-bold text-base leading-none">•</span>
            <span><strong>Absence != Falsity:</strong> If an agency has not spoken on an emerging rumour, it is an unverified guidance gap, not a disproven claim.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#0A5C36] dark:text-[#34D399] font-bold text-base leading-none">•</span>
            <span><strong>Verified Hotlines Only:</strong> Helplines like NCDC 6232 are shown only when documented by verified records.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
