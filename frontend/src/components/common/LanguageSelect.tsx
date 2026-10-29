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
          className="px-3 py-1.5 text-xs font-bold rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] text-[#1F1B16] dark:text-[#F4EEE4] focus-ring cursor-pointer"
        >
          <option value="en">English (EN)</option>
          <option value="pcm">Naija Pidgin (PCM)</option>
        </select>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex rounded-xl p-1 bg-[#F5EFEB] dark:bg-[#201C17] border border-[#D4C5B3] dark:border-[#3D352C] text-xs font-bold shadow-2xs"
    >
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`px-3 py-1 rounded-lg transition-all cursor-pointer min-h-[32px] sm:min-h-[28px] focus-ring ${
          currentLanguage === 'en'
            ? 'bg-white dark:bg-[#2A241E] text-accent font-bold shadow-2xs border border-[#D4C5B3] dark:border-[#3D352C]'
            : 'text-[#63584C] dark:text-[#A89E90] hover:text-[#1F1B16] dark:hover:text-[#F4EEE4]'
        }`}
        aria-pressed={currentLanguage === 'en'}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => onChange('pcm')}
        className={`px-3 py-1 rounded-lg transition-all cursor-pointer min-h-[32px] sm:min-h-[28px] focus-ring ${
          currentLanguage === 'pcm'
            ? 'bg-white dark:bg-[#2A241E] text-accent font-bold shadow-2xs border border-[#D4C5B3] dark:border-[#3D352C]'
            : 'text-[#63584C] dark:text-[#A89E90] hover:text-[#1F1B16] dark:hover:text-[#F4EEE4]'
        }`}
        aria-pressed={currentLanguage === 'pcm'}
      >
        Naija Pidgin
      </button>
    </div>
  );
};
