/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, AlertCircle, FileSearch } from 'lucide-react';
import { LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { Button } from '../ui/Button';

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

  // 4 canonical starter prompts required by spec
  const canonicalStarters = t.starters.slice(0, 4);

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="safeclaim-search-input" className="sr-only">
          {t.searchPlaceholder}
        </label>
        <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md p-1.5 focus-within:border-[#0A5C36] focus-within:ring-2 focus-within:ring-[#0A5C36]/20 transition-all shadow-2xs">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" aria-hidden="true" />
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
              className="w-full pl-9 pr-3 py-2.5 text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 bg-transparent focus:outline-none min-h-[44px]"
              aria-invalid={!!error}
              aria-describedby={error ? 'input-error-msg' : undefined}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            isLoading={isLoading}
            className="shrink-0 font-semibold px-5 min-h-[44px]"
          >
            <span>{t.askButton}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {error && (
          <div
            id="input-error-msg"
            role="alert"
            className="mt-2 text-xs font-medium text-red-700 dark:text-red-400 flex items-center gap-1.5 px-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Semantic list for starter prompts */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
          {t.starterPromptTitle}
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 m-0 p-0 list-none">
          {canonicalStarters.map((starter) => (
            <li key={starter.id} className="m-0 p-0">
              <button
                type="button"
                onClick={() => handleStarterClick(starter.query)}
                disabled={isLoading}
                className="w-full text-left p-2.5 rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition cursor-pointer text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2 focus-ring min-h-[44px]"
              >
                <FileSearch className="w-3.5 h-3.5 text-[#0A5C36] dark:text-emerald-400 mt-0.5 shrink-0" />
                <span className="leading-snug">{starter.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
