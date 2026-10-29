/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Smartphone,
  ShieldPlus,
  Droplets,
  Gift,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  language: LanguageCode;
  initialValue?: string;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({
  onSubmit,
  isLoading,
  language,
  initialValue = '',
}) => {
  const [query, setQuery] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError(t.emptyQuestionError);
      return;
    }
    setError(null);
    onSubmit(trimmed);
  };

  const handleStarterClick = (promptQuery: string) => {
    setQuery(promptQuery);
    setError(null);
    onSubmit(promptQuery);
  };

  const getStarterIcon = (iconName: string) => {
    switch (iconName) {
      case 'stethoscope':
        return <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />;
      case 'smartphone':
        return <Smartphone className="w-3.5 h-3.5 text-blue-700" />;
      case 'shield-plus':
        return <ShieldPlus className="w-3.5 h-3.5 text-purple-700" />;
      case 'droplets':
        return <Droplets className="w-3.5 h-3.5 text-amber-700" />;
      case 'gift':
        return <Gift className="w-3.5 h-3.5 text-rose-700" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-700" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="safeclaim-search-input" className="sr-only">
          {t.searchPlaceholder}
        </label>
        <div className="relative flex items-center rounded-2xl bg-white shadow-lg border-2 border-slate-200 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/20 transition-all">
          <div className="pl-4 sm:pl-5 text-slate-400">
            <Search className="w-6 h-6 text-emerald-800" aria-hidden="true" />
          </div>

          <input
            id="safeclaim-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError(null);
            }}
            disabled={isLoading}
            placeholder={t.searchPlaceholder}
            className="w-full py-4 sm:py-5 px-3 sm:px-4 text-base sm:text-lg text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            aria-invalid={!!error}
            aria-describedby={error ? 'input-error-msg' : undefined}
          />

          <div className="pr-3">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Verifying...</span>
                </>
              ) : (
                <>
                  <span>{t.askButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            id="input-error-msg"
            role="alert"
            className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1.5 px-2"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Quick Starter Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.starterPromptTitle}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {t.starters.map((starter) => (
            <button
              key={starter.id}
              type="button"
              onClick={() => handleStarterClick(starter.query)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-950 text-xs sm:text-sm font-medium border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {getStarterIcon(starter.icon)}
              <span>{starter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
