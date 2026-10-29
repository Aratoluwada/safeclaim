/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Moon,
  Sun,
  Menu,
  X,
  Radio,
  Settings2,
} from 'lucide-react';
import { LanguageCode } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { LanguageSelect } from './LanguageSelect';
import { ApiConfig } from '../../api/client';
import { setTheme } from '../../utils/theme';

interface NavbarProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  apiConfig,
  onOpenSettings,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const t = TRANSLATIONS[language];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { to: '/', label: t.navHome },
    { to: '/ask', label: t.navAsk },
    { to: '/desk', label: t.navRumourDesk },
    { to: '/how-it-works', label: t.navHowItWorks },
    { to: '/verdicts', label: t.navVerdicts },
    { to: '/faq', label: t.navFaq },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Civic Seal */}
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className="flex items-center gap-2 group focus-ring rounded-md py-1"
              aria-label="SafeClaim AI Homepage"
            >
              <div className="w-7 h-7 rounded-[4px] bg-[#0A5C36] text-white flex items-center justify-center font-serif font-bold text-sm">
                S
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-50">
                  SafeClaim
                </span>
                <span className="font-mono text-[10px] uppercase font-semibold text-neutral-500 dark:text-neutral-400">
                  Desk
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation Links List */}
            <nav className="hidden lg:block" aria-label="Main Navigation">
              <ul className="flex items-center space-x-1 m-0 p-0 list-none">
                {navItems.map((item) => (
                  <li key={item.to} className="m-0 p-0">
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus-ring ${
                          isActive
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-[#0A5C36] dark:text-emerald-400 font-semibold border-b-2 border-[#0A5C36] dark:border-emerald-400'
                            : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher */}
            <LanguageSelect currentLanguage={language} onChange={onLanguageChange} />

            {/* Operating Mode Indicator */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition cursor-pointer focus-ring"
              title="Configure API Mode & Model"
            >
              <Radio
                className={`w-3 h-3 ${
                  apiConfig.mode === 'live' ? 'text-emerald-600 animate-pulse' : 'text-neutral-400'
                }`}
              />
              <span className="capitalize">{apiConfig.mode} Mode</span>
              <Settings2 className="w-3 h-3 text-neutral-400 ml-0.5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition cursor-pointer focus-ring"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile hamburger & controls */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-ring"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Menu with Trap and semantic list */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          ref={menuRef}
          className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-3 pb-5 space-y-4 shadow-lg"
        >
          <nav aria-label="Mobile Navigation">
            <ul className="space-y-1 m-0 p-0 list-none">
              {navItems.map((item) => (
                <li key={item.to} className="m-0 p-0">
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive
                          ? 'bg-[#EBF4EF] dark:bg-[#0D2D1E] text-[#0A5C36] dark:text-emerald-400 font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-500">Language:</span>
            <LanguageSelect currentLanguage={language} onChange={onLanguageChange} />
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-500">Operating Mode:</span>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="text-xs font-mono font-medium text-[#0A5C36] dark:text-emerald-400 underline flex items-center gap-1"
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
