/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { VerdictStamp } from '../components/common/VerdictStamp';
import { WobblyUnderline } from '../components/hand/WobblyUnderline';
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
      description:
        'The claim accurately reflects current official regulations, statutory enactments, or published gazette directives.',
      exampleClaim: '“FCCPC prohibits digital money lenders from contacting borrower contact lists.”',
      officialEvidence:
        'FCCPC Limited Interim Regulatory Framework expressly forbids third-party defamation and contact scraping.',
      actionTaken:
        'SafeClaim confirms the guidance and provides links to the approved agency whitelist or portal.',
    },
    {
      label: 'NO_OFFICIAL_SOURCE_FOUND' as const,
      name: 'No Official Source Found',
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
        title={
          <>
            Official Verdicts{' '}
            <span className="relative inline-block">
              Guide
              <WobblyUnderline className="absolute -bottom-2 left-0 w-full" color="#0A5C36" />
            </span>
          </>
        }
        description="SafeClaim uses three unambiguous verdicts. Color is never used alone; each verdict combines an ink stamp, a machine-readable token, and a formal explanation."
      />

      {/* Semantic list of verdicts */}
      <ul className="space-y-6 m-0 p-0 list-none">
        {verdicts.map((item) => (
          <li key={item.label} className="m-0 p-0">
            <Card variant="bordered" padding="lg" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFD5] dark:border-[#2D261F] pb-3.5">
                <div className="flex items-center gap-2">
                  <VerdictStamp verdict={item.label} size="md" rotate={false} />
                </div>
                <span className="font-mono text-xs text-[#8E8273] uppercase font-bold">
                  Token: {item.label}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-[#1F1B16] dark:text-[#F4EEE4]">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#63584C] dark:text-[#A89E90] font-body leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1612] border border-[#E8DFD5] dark:border-[#2D261F]">
                  <span className="text-[#63584C] dark:text-[#A89E90] font-bold block mb-1">Example Claim:</span>
                  <span className="text-[#1F1B16] dark:text-[#F4EEE4] font-body text-xs">{item.exampleClaim}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1612] border border-[#E8DFD5] dark:border-[#2D261F]">
                  <span className="text-[#63584C] dark:text-[#A89E90] font-bold block mb-1">Official Evidence:</span>
                  <span className="text-[#1F1B16] dark:text-[#F4EEE4] font-body text-xs">{item.officialEvidence}</span>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      {/* Golden rule callout */}
      <div className="rounded-2xl border-2 border-[#FDE68A] dark:border-[#B45309]/50 bg-[#FFFBEB] dark:bg-[#251A0E] p-6 space-y-2.5">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#92400E] dark:text-[#FCD34D]">
          The Non-Equivalence Principle: Silence != Falsity
        </h4>
        <p className="text-xs sm:text-sm text-[#1F1B16] dark:text-[#F4EEE4] leading-relaxed font-body">
          A fundamental rule in SafeClaim fact-checking is that the absence of official guidance does not automatically prove a rumour is false. It simply means that no approved agency has published verification. When viral rumours surge without official statements, SafeClaim labels them as Guidance Gaps to prioritize institutional risk communication.
        </p>
      </div>
    </div>
  );
};
