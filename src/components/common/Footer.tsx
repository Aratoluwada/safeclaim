/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { SafeClaimLogo } from './SafeClaimLogo';
import { AdireStrip } from '../hand/AdireStrip';

interface FooterProps {
  language: LanguageCode;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenSettings }) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="mt-auto">
      <AdireStrip theme="green" />

      <div className="border-t border-[#E8DFD5] dark:border-[#3D352C] bg-[#F5EFEB] dark:bg-[#1A1612] text-[#63584C] dark:text-[#A89E90] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-3.5 md:col-span-1">
              <SafeClaimLogo size="sm" showTagline={true} />
              <p className="text-xs leading-relaxed text-[#63584C] dark:text-[#A89E90]">
                {t.tagline}
              </p>
              <div className="font-mono text-[11px] text-[#8E8273] dark:text-[#7A7165] space-y-1">
                <div>OSCA OPEN//BUILD 2026</div>
                <div>Yoruba Tone Marks: Ẹ káàbọ̀!</div>
              </div>
            </div>

            {/* Column 1: Public Desk */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#1F1B16] dark:text-[#EDE7DF] mb-3">
                Public Assistant
              </h3>
              <ul className="space-y-2.5 m-0 p-0 list-none">
                <li>
                  <NavLink to="/" className="hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium">
                    {t.navHome}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/ask" className="hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium">
                    {t.navAsk}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/verdicts" className="hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium">
                    {t.navVerdicts}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/how-it-works" className="hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium">
                    {t.navHowItWorks}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/faq" className="hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium">
                    {t.navFaq}
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Column 2: Institutional */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#1F1B16] dark:text-[#EDE7DF] mb-3">
                Institutional Rumour Desk
              </h3>
              <ul className="space-y-2.5 m-0 p-0 list-none">
                <li>
                  <NavLink to="/desk" className="hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium">
                    Rumour Desk Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="hover:text-[#0A5C36] dark:hover:text-[#34D399] transition cursor-pointer text-left font-mono font-medium"
                  >
                    Configure API &amp; Model
                  </button>
                </li>
                <li>
                  <a
                    href="/public/assets/aistudio/FRONTEND_SPEC__1__0384ef55.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium"
                  >
                    <span>Backend Contract</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Approved Sources */}
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#1F1B16] dark:text-[#EDE7DF] mb-3">
                Approved Civic Portals
              </h3>
              <ul className="space-y-2.5 m-0 p-0 list-none">
                <li>
                  <a
                    href="https://ncdc.gov.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium"
                  >
                    <span>NCDC Public Advisories (6232)</span>
                    <ExternalLink className="w-3 h-3 text-[#8E8273]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://fccpc.gov.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium"
                  >
                    <span>FCCPC Delisted Loan Apps</span>
                    <ExternalLink className="w-3 h-3 text-[#8E8273]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://nhia.gov.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium"
                  >
                    <span>NHIA Health Guidelines</span>
                    <ExternalLink className="w-3 h-3 text-[#8E8273]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://inecnigeria.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#0A5C36] dark:hover:text-[#34D399] transition font-medium"
                  >
                    <span>INEC Electoral Procedures</span>
                    <ExternalLink className="w-3 h-3 text-[#8E8273]" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#E8DFD5] dark:border-[#3D352C] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#8E8273] dark:text-[#7A7165] text-[11px] font-mono">
            <p>&copy; 2026 SafeClaim AI. Grounded civic evidence architecture for Nigeria.</p>
            <p>Strict official source citations required. When no official publication exists, we abstain.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
