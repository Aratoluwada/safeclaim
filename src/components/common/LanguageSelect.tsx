/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LanguageCode } from '../../types/api';
import { Globe } from 'lucide-react';

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
        <Globe className="w-4 h-4 text-slate-500 absolute left-2 pointer-events-none" />
        <select
          id="language-select-compact"
          value={currentLanguage}
          onChange={(e) => onChange(e.target.value as LanguageCode)}
          className="pl-8 pr-3 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
      className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-xs font-semibold shadow-inner"
    >
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
          currentLanguage === 'en'
            ? 'bg-white text-emerald-800 shadow-sm font-bold border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={currentLanguage === 'en'}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => onChange('pcm')}
        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
          currentLanguage === 'pcm'
            ? 'bg-white text-emerald-800 shadow-sm font-bold border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        aria-pressed={currentLanguage === 'pcm'}
      >
        Naijá Pidgin
      </button>
    </div>
  );
};
