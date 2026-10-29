/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { AskResponse, LanguageCode } from '../types/api';
import { askQuestion } from '../api/ask';
import { TRANSLATIONS } from '../utils/translations';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { QuestionInput } from '../components/ask/QuestionInput';
import { AnswerCard } from '../components/ask/AnswerCard';
import { AbstentionCard } from '../components/ask/AbstentionCard';
import { ApiConfig } from '../api/client';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';

interface AskPageProps {
  language: LanguageCode;
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
}

export const AskPage: React.FC<AskPageProps> = ({
  language,
  apiConfig,
  onOpenSettings,
}) => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState('');

  const t = TRANSLATIONS[language];

  // Auto-run if query param present
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q.trim() && q !== submittedQuery) {
      handleAsk(q.trim());
    }
  }, [searchParams]);

  // Set document title
  useEffect(() => {
    document.title = `Ask SafeClaim — ${t.tagline}`;
  }, [t.tagline]);

  const handleAsk = async (questionText: string) => {
    setIsLoading(true);
    setError(null);
    setSubmittedQuery(questionText);

    try {
      const res = await askQuestion(questionText, language);
      setResponse(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(msg);
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResponse(null);
    setError(null);
    setSubmittedQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Mandatory Official Guidance Disclaimer */}
      <DisclaimerBanner language={language} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Page Header */}
        {!response && !isLoading && (
          <PageHeader
            eyebrow="Public Grounded Verification"
            title={language === 'pcm' ? 'Understand di claim. Check di real fact.' : 'Understand the claim. Verify the facts.'}
            description={
              language === 'pcm'
                ? 'Check whether public health alerts, loan app wahala, or government grant announcements get official backing from NCDC, FCCPC, and NHIA circulars.'
                : 'Evaluate public-health rumours, suspicious loan applications, and federal benefit announcements using direct citations from approved official publications.'
            }
          />
        )}

        {/* Search Input Section */}
        {!response && (
          <section aria-label="Question submission" className="w-full">
            <QuestionInput
              onSubmit={handleAsk}
              isLoading={isLoading}
              language={language}
              initialValue={submittedQuery}
            />
          </section>
        )}

        {/* Loading State */}
        {isLoading && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 text-center shadow-2xs space-y-3 max-w-xl mx-auto"
          >
            <div className="w-8 h-8 border-2 border-[#0A5C36] dark:border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {t.verifyingButton}
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Matching against official NCDC, FCCPC, NHIA, and FMOH gazettes...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div
            role="alert"
            className="rounded-md border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-5 space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1 text-xs">
                <h3 className="font-semibold text-red-900 dark:text-red-200 font-mono uppercase">
                  {t.backendErrorPrefix}
                </h3>
                <p className="font-mono text-red-800 dark:text-red-300 bg-white dark:bg-neutral-900 p-2.5 rounded border border-red-200 dark:border-red-800">
                  {error}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Live Mode never silently substitutes synthetic answers. If your backend is offline, configure the API endpoint or switch to Demo Mode.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <Button variant="primary" size="sm" onClick={() => handleAsk(submittedQuery)}>
                Retry Query
              </Button>
              <Button variant="secondary" size="sm" onClick={onOpenSettings}>
                Configure Backend
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Grounded Answer Card */}
        {response && response.grounded && !isLoading && (
          <AnswerCard
            response={response}
            language={language}
            onAskAnother={handleReset}
          />
        )}

        {/* Abstention Card (When no official source found) */}
        {response && !response.grounded && !isLoading && (
          <AbstentionCard
            question={response.question}
            abstentionReason={response.abstention_reason}
            explanation={response.answer}
            hotlineInfo={response.hotline_info}
            language={language}
            onAskAnother={handleReset}
          />
        )}
      </div>
    </div>
  );
};
