/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  LayoutDashboard,
  Settings2,
  Menu,
  X,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { LanguageSelect } from './LanguageSelect';
import { ApiConfig } from '../../api/client';

interface NavbarProps {
  currentTab: 'ask' | 'rumour-desk';
  onSelectTab: (tab: 'ask' | 'rumour-desk') => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  apiConfig,
  onOpenSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                onSelectTab('ask');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                    Safe<span className="text-emerald-800">Claim</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {t.tagline}
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              <button
                type="button"
                onClick={() => onSelectTab('ask')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  currentTab === 'ask'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-current={currentTab === 'ask' ? 'page' : undefined}
              >
                <Search className="w-4 h-4 text-emerald-700" />
                <span>{t.navAsk}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('rumour-desk')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  currentTab === 'rumour-desk'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-current={currentTab === 'rumour-desk' ? 'page' : undefined}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                <span>{t.navRumourDesk}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Desk
                </span>
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSelect currentLanguage={language} onChange={onLanguageChange} />

            {/* Operating Mode Indicator & Trigger */}
            <button
              type="button"
              onClick={onOpenSettings}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                apiConfig.mode === 'live'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Configure API Mode and Model Settings"
            >
              <Radio
                className={`w-3.5 h-3.5 ${
                  apiConfig.mode === 'live' ? 'text-emerald-600 animate-pulse' : 'text-slate-500'
                }`}
              />
              <span className="capitalize">{apiConfig.mode} Mode</span>
              <Settings2 className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Settings"
            >
              <Settings2 className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="space-y-1">
            <button
              onClick={() => {
                onSelectTab('ask');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-left ${
                currentTab === 'ask'
                  ? 'bg-emerald-50 text-emerald-900'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-700" />
              <span>{t.navAsk}</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('rumour-desk');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-left ${
                currentTab === 'rumour-desk'
                  ? 'bg-emerald-50 text-emerald-900'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                <span>{t.navRumourDesk}</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                Institutional
              </span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Language:</span>
            <LanguageSelect currentLanguage={language} onChange={onLanguageChange} />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Mode:</span>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="text-xs font-bold text-emerald-800 underline flex items-center gap-1"
            >
              <span className="capitalize">{apiConfig.mode} Mode</span>
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
