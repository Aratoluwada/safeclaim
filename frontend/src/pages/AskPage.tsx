/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { AskResponse, LanguageCode } from '../types/api';
import { askQuestion } from '../api/ask';
import { TRANSLATIONS } from '../utils/translations';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { QuestionInput } from '../components/ask/QuestionInput';
import { AnswerCard } from '../components/ask/AnswerCard';
import { AbstentionCard } from '../components/ask/AbstentionCard';
import { ApiConfig } from '../api/client';
import { WobblyUnderline } from '../components/hand/WobblyUnderline';
import { HandArrow } from '../components/hand/HandArrow';
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
        {/* Warm Editorial Header */}
        {!response && !isLoading && (
          <header className="text-center sm:text-left space-y-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-accent-tint dark:bg-accent-tint text-accent font-mono font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === 'pcm' ? 'Source Search Demo' : 'Public Evidence Search'}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1F1B16] dark:text-[#F4EEE4] leading-tight">
              {language === 'pcm' ? (
                <>
                  Find source text.{' '}
                  <span className="relative inline-block">
                    Review the evidence.
                    <WobblyUnderline className="absolute -bottom-2 left-0 w-full" color="#0A5C36" />
                  </span>
                </>
              ) : (
                <>
                  Find source text.{' '}
                  <span className="relative inline-block">
                    Review the evidence.
                    <WobblyUnderline className="absolute -bottom-2 left-0 w-full" color="#0A5C36" />
                  </span>
                </>
              )}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <p className="text-base sm:text-lg text-[#63584C] dark:text-[#A89E90] font-body max-w-2xl leading-relaxed">
                {language === 'pcm'
                  ? 'Paste a question to search the local demo or connected source index. Results are not validated verdicts.'
                  : 'Search the local demo or connected source index. Retrieved passages are not validated verdicts.'}
              </p>
              <div className="hidden lg:flex items-center text-[#27358F] dark:text-[#AEB9FF] font-hand text-lg shrink-0">
                <span>Paste forward here</span>
                <HandArrow direction="curve-down" color="#27358F" className="ml-1 -mb-2" />
              </div>
            </div>
          </header>
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
            className="rounded-2xl border-2 border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] p-8 sm:p-10 text-center shadow-sm space-y-4 max-w-xl mx-auto"
          >
            <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-lg text-[#1F1B16] dark:text-[#F4EEE4]">
                {t.verifyingButton}
              </h3>
              <p className="text-xs sm:text-sm text-[#63584C] dark:text-[#A89E90] font-mono">
                Searching configured source text...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div
            role="alert"
            className="rounded-2xl border-2 border-[#FECACA] dark:border-[#7F1D1D] bg-[#FEF2F2] dark:bg-[#251515] p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-[#B91C1C] dark:text-[#F87171] shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1 text-xs">
                <h3 className="font-bold text-[#B91C1C] dark:text-[#FCA5A5] font-mono uppercase text-sm">
                  {t.backendErrorPrefix}
                </h3>
                <p className="font-mono text-[#B91C1C] dark:text-[#FCA5A5] bg-white dark:bg-[#1A1010] p-3 rounded-xl border border-red-200 dark:border-red-900">
                  {error}
                </p>
                <p className="text-[#63584C] dark:text-[#A89E90] font-body text-xs leading-relaxed">
                  Live Mode never silently substitutes synthetic answers. If your backend service is offline, configure the API endpoint or switch to Demo Mode.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
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
            citations={response.citations}
            isIllustrative={response.abstention_reason === 'DEMO_MODE_NOT_CONNECTED'}
            retrieval={response.retrieval}
          />
        )}
      </div>
    </div>
  );
};
