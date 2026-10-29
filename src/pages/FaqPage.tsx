/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
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
      a: 'SafeClaim provides first-class localization in Naijá Pidgin. You can toggle the language switch at the top of any page to view both interface prompts and generated grounded explanations written in natural Nigerian Pidgin phrasing.',
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
        title="Questions & Operating Principles"
        description="Learn how SafeClaim grounds citizen inquiries in verified gazettes, prevents model hallucinations, and flags critical institutional guidance gaps."
      />

      {/* Semantic list of FAQs */}
      <ul className="space-y-3 m-0 p-0 list-none">
        {faqs.map((faq, index) => {
          const isOpen = expandedId === index;
          return (
            <li key={index} className="m-0 p-0">
              <Card variant="default" padding="none" className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 transition cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 focus-ring min-h-[48px]"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-medium text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#0A5C36] dark:text-emerald-400 shrink-0" aria-hidden="true" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed border-t border-neutral-100 dark:border-neutral-800"
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
