/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { ExternalLink, Shield } from 'lucide-react';
import { LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';

interface FooterProps {
  language: LanguageCode;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenSettings }) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[4px] bg-[#0A5C36] text-white flex items-center justify-center font-serif font-bold text-xs">
                S
              </div>
              <span className="font-serif font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
                SafeClaim AI
              </span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              {t.tagline}
            </p>
            <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
              OSCA OPEN//BUILD 2026
            </p>
          </div>

          {/* Group 1: Public Desk */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Public Assistant
            </h3>
            <ul className="space-y-2 m-0 p-0 list-none">
              <li>
                <NavLink to="/ask" className="hover:text-[#0A5C36] dark:hover:text-emerald-400 transition">
                  {t.navAsk}
                </NavLink>
              </li>
              <li>
                <NavLink to="/verdicts" className="hover:text-[#0A5C36] dark:hover:text-emerald-400 transition">
                  {t.navVerdicts}
                </NavLink>
              </li>
              <li>
                <NavLink to="/how-it-works" className="hover:text-[#0A5C36] dark:hover:text-emerald-400 transition">
                  {t.navHowItWorks}
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className="hover:text-[#0A5C36] dark:hover:text-emerald-400 transition">
                  {t.navFaq}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Group 2: Institutional */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Institutional Intelligence
            </h3>
            <ul className="space-y-2 m-0 p-0 list-none">
              <li>
                <NavLink to="/desk" className="hover:text-[#0A5C36] dark:hover:text-emerald-400 transition">
                  Rumour Desk Dashboard
                </NavLink>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="hover:text-[#0A5C36] dark:hover:text-emerald-400 transition cursor-pointer text-left font-mono"
                >
                  API Configuration
                </button>
              </li>
              <li>
                <a
                  href="/public/assets/aistudio/FRONTEND_SPEC__1__0384ef55.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#0A5C36] dark:hover:text-emerald-400 transition"
                >
                  <span>Backend Contract</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Group 3: Verified Sources */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Approved Sources
            </h3>
            <ul className="space-y-2 m-0 p-0 list-none">
              <li>
                <a
                  href="https://ncdc.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#0A5C36] dark:hover:text-emerald-400 transition"
                >
                  <span>NCDC Health Advisories</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://fccpc.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#0A5C36] dark:hover:text-emerald-400 transition"
                >
                  <span>FCCPC Lending Register</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://nhia.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#0A5C36] dark:hover:text-emerald-400 transition"
                >
                  <span>NHIA Guidelines</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://inecnigeria.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#0A5C36] dark:hover:text-emerald-400 transition"
                >
                  <span>INEC Electoral Directives</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px] font-mono">
          <p>&copy; 2026 SafeClaim AI. Grounded evidence architecture for Nigeria.</p>
          <p>Answers are not medical or legal advice. Strict official source citations required.</p>
        </div>
      </div>
    </footer>
  );
};
