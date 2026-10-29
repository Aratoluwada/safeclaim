/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, AlertCircle, FileSearch, ClipboardPaste } from 'lucide-react';
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

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setQuery(text);
        setError(null);
      }
    } catch {
      // Permission or unsupported
    }
  };

  // 4 canonical starter prompts required by spec
  const canonicalStarters = t.starters.slice(0, 4);

  return (
    <div className="w-full space-y-5">
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="safeclaim-search-input" className="sr-only">
          {t.searchPlaceholder}
        </label>

        {/* Multi-line friendly search box styled like a warm civic dispatch pad */}
        <div className="relative rounded-2xl bg-white dark:bg-[#201C17] border-2 border-[#D4C5B3] dark:border-[#3D352C] focus-within:border-[#0A5C36] dark:focus-within:border-[#34D399] transition-all p-3 sm:p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Search className="w-5 h-5 text-[#8E8273] mt-1 shrink-0" aria-hidden="true" />
            <textarea
              id="safeclaim-search-input"
              rows={3}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
              placeholder={
                language === 'pcm'
                  ? 'Paste di rumour, WhatsApp broadcast, or type your question here...'
                  : 'Paste the forwarded message, rumour, or question to verify...'
              }
              className="w-full text-base sm:text-lg font-body text-[#1F1B16] dark:text-[#EDE7DF] placeholder:text-[#8E8273]/80 bg-transparent focus:outline-none resize-none leading-relaxed"
              aria-invalid={!!error}
              aria-describedby={error ? 'input-error-msg' : undefined}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-[#E8DFD5] dark:border-[#2D261F]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg text-[#63584C] dark:text-[#A89E90] hover:text-[#1F1B16] dark:hover:text-[#EDE7DF] hover:bg-[#F5EFEB] dark:hover:bg-[#2A241F] transition"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-[#0A5C36] dark:text-[#34D399]" />
                <span>{language === 'pcm' ? 'Paste message' : 'Paste from clipboard'}</span>
              </button>
              <span className="hidden sm:inline text-[11px] font-mono text-[#8E8273]">
                (Ctrl+Enter to send)
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              isLoading={isLoading}
              className="font-bold text-sm px-6 min-h-[44px]"
            >
              <span>{t.askButton}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {error && (
          <div
            id="input-error-msg"
            role="alert"
            className="mt-2 text-xs font-semibold text-[#B91C1C] dark:text-[#F87171] flex items-center gap-1.5 px-1"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Semantic list for starter prompts */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#63584C] dark:text-[#A89E90]">
            {t.starterPromptTitle}
          </span>
          <span className="font-hand text-base text-[#24306E] dark:text-[#8BA0E8] transform -rotate-1">
            {language === 'pcm' ? 'Click any one to check am' : 'Or try one of these rumours'}
          </span>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 m-0 p-0 list-none">
          {canonicalStarters.map((starter) => (
            <li key={starter.id} className="m-0 p-0">
              <button
                type="button"
                onClick={() => handleStarterClick(starter.query)}
                disabled={isLoading}
                className="cursor-pointer w-full text-left p-3.5 rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] hover:border-[#0A5C36] dark:hover:border-[#34D399] bg-white dark:bg-[#201C17] hover:bg-[#FBF7F0] dark:hover:bg-[#25201A] transition text-sm text-[#1F1B16] dark:text-[#EDE7DF] flex items-start gap-2.5 focus-ring min-h-[48px] shadow-2xs group"
              >
                <FileSearch className="w-4 h-4 text-[#0A5C36] dark:text-[#34D399] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-medium leading-snug">{starter.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
