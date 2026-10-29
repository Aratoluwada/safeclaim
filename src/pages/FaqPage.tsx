/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { WobblyUnderline } from '../components/hand/WobblyUnderline';
import { LanguageCode } from '../types/api';

interface FaqPageProps {
  language: LanguageCode;
}

export const FaqPage: React.FC<FaqPageProps> = ({ language }) => {
  useEffect(() => {
    document.title = 'Frequently Asked Questions — SafeClaim AI';
  }, []);

  const [expandedId, setExpandedId] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Which official government entities are indexed in SafeClaim?',
      a: 'SafeClaim indexes publications from verified Nigerian public service bodies, including the Nigeria Centre for Disease Control and Prevention (NCDC), Federal Competition and Consumer Protection Commission (FCCPC), National Health Insurance Authority (NHIA), Federal Ministry of Health (FMOH), and Independent National Electoral Commission (INEC). Third-party tabloids, partisan websites, and forwarded social media texts are excluded from the grounding index.',
    },
    {
      q: 'What happens when a question cannot be answered from official records?',
      a: 'The system triggers an explicit abstention (NO_OFFICIAL_SOURCE_FOUND). SafeClaim explains that no official circular exists in the verified database and provides direct links to agency portals and official emergency hotlines (e.g. NCDC Toll-Free 6232). SafeClaim refuses to hallucinate plausible-sounding answers.',
    },
    {
      q: 'How does SafeClaim handle questions submitted in Nigerian Pidgin (pcm)?',
      a: 'SafeClaim provides first-class localization in Naija Pidgin. You can toggle the language switch at the top of any page to view both interface prompts and generated grounded explanations written in natural Nigerian Pidgin phrasing.',
    },
    {
      q: 'What is a "Guidance Gap" on the Rumour Desk?',
      a: 'A Guidance Gap occurs when a rumour circulates with high velocity or volume across messaging channels, but zero formal circulars or advisories exist from the responsible government agency. The Rumour Desk highlights these gaps so communications teams at the NCDC or FCCPC can quickly publish targeted press releases before harmful misinformation leads to hospitalizations or financial loss.',
    },
    {
      q: 'How do Demo Mode and Live Mode differ?',
      a: 'Demo Mode operates offline with a deterministic, verified benchmark dataset designed for hackathon reviews and offline auditing. Live Mode connects to a companion backend server (e.g. at /api/v1). If the live backend is unreachable, SafeClaim displays a clear diagnostic error and never silently falls back to synthetic data pretending to be live.',
    },
    {
      q: 'Can SafeClaim be used as medical or legal advice?',
      a: 'No. SafeClaim is strictly an evidence-retrieval and fact-checking tool referencing official public announcements and gazettes. It is not a substitute for clinical diagnosis by a licensed physician or legal advice from a qualified practitioner.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <PageHeader
        eyebrow="Frequently Asked Questions"
        title={
          <>
            Questions &amp; Operating{' '}
            <span className="relative inline-block">
              Principles
              <WobblyUnderline className="absolute -bottom-2 left-0 w-full" color="#0A5C36" />
            </span>
          </>
        }
        description="Learn how SafeClaim grounds citizen inquiries in verified gazettes, prevents model hallucinations, and flags critical institutional guidance gaps."
      />

      {/* Semantic list of FAQs */}
      <ul className="space-y-3.5 m-0 p-0 list-none">
        {faqs.map((faq, index) => {
          const isOpen = expandedId === index;
          return (
            <li key={index} className="m-0 p-0">
              <Card variant="bordered" padding="none" className="overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 transition cursor-pointer hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] focus-ring min-h-[48px]"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-display font-bold text-sm sm:text-base text-[#1F1B16] dark:text-[#EDE7DF] flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#0A5C36] dark:text-[#34D399] shrink-0" aria-hidden="true" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#8E8273] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8E8273] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-4 pb-5 sm:px-5 sm:pb-6 pt-2 text-xs sm:text-sm text-[#63584C] dark:text-[#A89E90] font-body leading-relaxed border-t border-[#E8DFD5] dark:border-[#2D261F] bg-[#FAF7F2]/50 dark:bg-[#1A1612]/50"
                  >
                    {faq.a}
                  </div>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
