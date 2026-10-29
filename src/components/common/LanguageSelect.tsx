/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LanguageCode } from '../../types/api';

interface LanguageSelectProps {
  currentLanguage: LanguageCode;
  onChange: (lang: LanguageCode) => void;
  variant?: 'compact' | 'toggle';
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  currentLanguage,
  onChange,
  variant = 'toggle',
}) => {
  if (variant === 'compact') {
    return (
      <div className="relative inline-flex items-center">
        <label htmlFor="language-select-compact" className="sr-only">
          Select language
        </label>
        <select
          id="language-select-compact"
          value={currentLanguage}
          onChange={(e) => onChange(e.target.value as LanguageCode)}
          className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus-ring cursor-pointer"
        >
          <option value="en">English (EN)</option>
          <option value="pcm">Naijá Pidgin (PCM)</option>
        </select>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex rounded-md p-0.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium"
    >
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`px-2.5 py-1 rounded-[4px] transition cursor-pointer min-h-[32px] sm:min-h-[28px] focus-ring ${
          currentLanguage === 'en'
            ? 'bg-white dark:bg-neutral-900 text-[#0A5C36] dark:text-emerald-400 font-semibold shadow-2xs border border-neutral-200 dark:border-neutral-700'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
        }`}
        aria-pressed={currentLanguage === 'en'}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => onChange('pcm')}
        className={`px-2.5 py-1 rounded-[4px] transition cursor-pointer min-h-[32px] sm:min-h-[28px] focus-ring ${
          currentLanguage === 'pcm'
            ? 'bg-white dark:bg-neutral-900 text-[#0A5C36] dark:text-emerald-400 font-semibold shadow-2xs border border-neutral-200 dark:border-neutral-700'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
        }`}
        aria-pressed={currentLanguage === 'pcm'}
      >
        Naijá Pidgin
      </button>
    </div>
  );
};
