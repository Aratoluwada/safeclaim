/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  BookOpen,
  Sparkles,
  PhoneCall,
  Search,
  ExternalLink,
  Info,
} from 'lucide-react';
import { AskResponse, LanguageCode } from '../types/api';
import { askQuestion } from '../api/ask';
import { TRANSLATIONS } from '../utils/translations';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { QuestionInput } from '../components/ask/QuestionInput';
import { AnswerCard } from '../components/ask/AnswerCard';
import { AbstentionCard } from '../components/ask/AbstentionCard';
import { ApiConfig } from '../api/client';

interface AskPageProps {
  language: LanguageCode;
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
  onSwitchToDesk: () => void;
}

export const AskPage: React.FC<AskPageProps> = ({
  language,
  apiConfig,
  onOpenSettings,
  onSwitchToDesk,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState('');

  const t = TRANSLATIONS[language];

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
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Mandatory Official Guidance Disclaimer */}
      <DisclaimerBanner language={language} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Hero Section */}
        {!response && !isLoading && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Federal & State Official Evidence Grounding</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {language === 'pcm' ? (
                <>
                  Understand di claim. <br />
                  <span className="text-emerald-800">Check di real fact.</span>
                </>
              ) : (
                <>
                  Understand the claim. <br />
                  <span className="text-emerald-800">Verify the facts.</span>
                </>
              )}
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
              {language === 'pcm'
                ? 'Check whether public health alerts, loan app harassment, or government grant announcements get official backing from NCDC, FCCPC, and NHIA circulars.'
                : 'Evaluate public-health rumours, suspicious loan applications, and federal benefit announcements using direct citations from approved official publications.'}
            </p>
          </div>
        )}

        {/* Search Input Section */}
        {!response && (
          <section aria-label="Question submission" className="max-w-3xl mx-auto w-full">
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
            className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-lg space-y-4 max-w-2xl mx-auto"
          >
            <div className="relative w-14 h-14 mx-auto">
              <div className="w-14 h-14 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin" />
              <ShieldAlert className="w-6 h-6 text-emerald-800 absolute inset-0 m-auto" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t.verifyingButton}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Searching verified NCDC advisories, FCCPC registers, and NHIA official gazettes...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div
            role="alert"
            className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 sm:p-8 space-y-4 text-left shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-red-900">
                  {t.backendErrorPrefix}
                </h3>
                <p className="text-sm text-red-800 leading-relaxed font-mono bg-white/60 p-3 rounded-lg border border-red-200">
                  {error}
                </p>
                <div className="text-xs text-red-700 space-y-1">
                  <p>
                    &bull; If your backend is offline, you can switch back to <strong>Demo Mode</strong> in settings.
                  </p>
                  <p>
                    &bull; SafeClaim adheres strictly to the rule: <em>failed live calls never silently fabricate synthetic answers</em>.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleAsk(submittedQuery)}
                className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-900 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                Retry Query
              </button>
              <button
                type="button"
                onClick={onOpenSettings}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs border border-slate-300 transition cursor-pointer"
              >
                Configure Backend / Switch Mode
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Successful Grounded Answer Card */}
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

        {/* Bottom Feature Card: Institutional Link */}
        {!response && !isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                Institutional Access
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Are you a fact-checker or public health agency?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Access the SafeClaim Rumour Desk to analyze viral claim clusters, inspect street quotes, and generate intelligence briefs.
              </p>
            </div>

            <button
              type="button"
              onClick={onSwitchToDesk}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer shrink-0"
            >
              <span>Open Rumour Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
