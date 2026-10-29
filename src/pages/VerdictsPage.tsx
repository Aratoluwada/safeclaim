/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { VerdictBadge } from '../components/common/VerdictBadge';
import { XCircle, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { LanguageCode } from '../types/api';

interface VerdictsPageProps {
  language: LanguageCode;
}

export const VerdictsPage: React.FC<VerdictsPageProps> = ({ language }) => {
  useEffect(() => {
    document.title = 'Verdicts Taxonomy & Guide — SafeClaim AI';
  }, []);

  const verdicts = [
    {
      label: 'CONTRADICTED_BY_OFFICIAL_SOURCE' as const,
      name: 'Contradicted by Official Source',
      accentColor: 'text-red-700 dark:text-red-400',
      description:
        'The submitted claim or circulating rumour directly conflicts with an explicit statement or finding in an approved official publication.',
      exampleClaim: '“Ebola outbreak has re-emerged in Lagos general hospitals.”',
      officialEvidence:
        'NCDC epidemiological surveillance circular confirms zero confirmed cases nationwide and standard transit biosecurity.',
      actionTaken:
        'A public refutation card is issued with clickable citations and suggested social media copy to halt viral spread.',
    },
    {
      label: 'SUPPORTED_BY_OFFICIAL_SOURCE' as const,
      name: 'Supported by Official Source',
      accentColor: 'text-emerald-700 dark:text-emerald-400',
      description:
        'The claim accurately reflects current official regulations, statutory enactments, or published gazette directives.',
      exampleClaim: '“FCCPC prohibits digital money lenders from contacting borrower contact lists.”',
      officialEvidence:
        'FCCPC Limited Interim Regulatory Framework 2023 expressly forbids third-party defamation and contact scraping.',
      actionTaken:
        'SafeClaim confirms the guidance and provides links to the approved agency whitelist or portal.',
    },
    {
      label: 'NO_OFFICIAL_SOURCE_FOUND' as const,
      name: 'No Official Source Found',
      accentColor: 'text-amber-700 dark:text-amber-400',
      description:
        'No verified publication from approved government bodies (NCDC, FCCPC, NHIA, FMOH, INEC) directly addresses or verifies the claim.',
      exampleClaim: '“Boiled guava leaf tea cures Mpox blisters in 24 hours.”',
      officialEvidence:
        'Zero clinical advisories or gazette bulletins exist on guava leaf concoctions for Mpox viral clearance.',
      actionTaken:
        'SafeClaim abstains from taking a stance, warns users against assuming unproven assertions, and escalates the claim as a Guidance Gap.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <PageHeader
        eyebrow="Verification Standards"
        title="Official Verdicts Guide"
        description="SafeClaim uses three unambiguous verdicts. Color is never used alone; each verdict combines an icon, a machine-readable token, and a formal explanation."
      />

      {/* Semantic list of verdicts */}
      <ul className="space-y-5 m-0 p-0 list-none">
        {verdicts.map((item) => (
          <li key={item.label} className="m-0 p-0">
            <Card variant="default" padding="lg" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <VerdictBadge verdict={item.label} size="md" />
                </div>
                <span className="font-mono text-xs text-neutral-400 uppercase">
                  Token: {item.label}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800">
                  <span className="text-neutral-500 font-bold block mb-1">Example Claim:</span>
                  <span className="text-neutral-800 dark:text-neutral-200">{item.exampleClaim}</span>
                </div>
                <div className="p-3 rounded bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800">
                  <span className="text-neutral-500 font-bold block mb-1">Official Evidence:</span>
                  <span className="text-neutral-800 dark:text-neutral-200">{item.officialEvidence}</span>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      {/* Golden rule callout */}
      <div className="rounded-md border-l-4 border-l-amber-500 border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 p-5 space-y-2">
        <h4 className="font-mono text-xs font-bold uppercase text-amber-950 dark:text-amber-100">
          The Non-Equivalence Principle: Silence != Falsity
        </h4>
        <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
          A fundamental rule in SafeClaim fact-checking is that the absence of official guidance does not automatically prove a rumour is false. It simply means that no approved agency has published verification. When viral rumours surge without official statements, SafeClaim labels them as Guidance Gaps to prioritize institutional risk communication.
        </p>
      </div>
    </div>
  );
};
