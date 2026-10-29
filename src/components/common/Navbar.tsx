/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
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
import { SafeClaimLogo } from './SafeClaimLogo';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

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
  const shouldReduceMotion = useReducedMotion();
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

  const isHomeActive = location.pathname === '/' || location.pathname === '/overview';
  const isAskActive = location.pathname === '/ask';
  const isDeskActive = location.pathname === '/desk' || location.pathname === '/rumours';

  const navItems = [
    { to: '/', label: t.navHome, isActive: isHomeActive },
    { to: '/ask', label: t.navAsk, isActive: isAskActive },
    { to: '/desk', label: t.navRumourDesk, isActive: isDeskActive },
    { to: '/how-it-works', label: t.navHowItWorks, isActive: location.pathname === '/how-it-works' },
    { to: '/verdicts', label: t.navVerdicts, isActive: location.pathname === '/verdicts' },
    { to: '/faq', label: t.navFaq, isActive: location.pathname === '/faq' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF7F0]/95 dark:bg-[#171410]/95 backdrop-blur-xs border-b border-[#E8DFD5] dark:border-[#3D352C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Postal Mark */}
          <div className="flex items-center gap-8">
            <NavLink
              to="/"
              className="flex items-center group focus-ring rounded-lg py-1"
              aria-label="SafeClaim AI Homepage"
            >
              <SafeClaimLogo size="md" />
            </NavLink>

            {/* Desktop Navigation Links List */}
            <nav className="hidden lg:block" aria-label="Main Navigation">
              <ul className="flex items-center space-x-1 m-0 p-0 list-none">
                {navItems.map((item) => (
                  <li key={item.to} className="m-0 p-0">
                    <NavLink
                      to={item.to}
                      className={() =>
                        `inline-flex items-center px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors focus-ring ${
                          item.isActive
                            ? 'text-accent bg-accent-tint dark:bg-accent-tint shadow-2xs'
                            : 'text-[#63584C] dark:text-[#A89E90] hover:text-[#1F1B16] dark:hover:text-[#F4EEE4] hover:bg-[#F5EFEB] dark:hover:bg-[#25201A]'
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
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSelect currentLanguage={language} onChange={onLanguageChange} />

            {/* Operating Mode Indicator */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] text-[#1F1B16] dark:text-[#F4EEE4] hover:bg-[#F5EFEB] dark:hover:bg-[#2A241F] transition cursor-pointer focus-ring shadow-2xs"
              title="Configure API Mode & Model"
            >
              <Radio
                className={`w-3.5 h-3.5 ${
                  apiConfig.mode === 'live' ? 'text-emerald-600 animate-pulse' : 'text-[#8E8273]'
                }`}
              />
              <span className="capitalize">{apiConfig.mode} Mode</span>
              <Settings2 className="w-3.5 h-3.5 text-[#8E8273] ml-0.5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="cursor-pointer p-2 rounded-xl text-[#63584C] dark:text-[#A89E90] hover:text-[#1F1B16] dark:hover:text-[#F4EEE4] hover:bg-[#F5EFEB] dark:hover:bg-[#25201A] border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] transition focus-ring shadow-2xs"
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
              className="p-2 rounded-xl text-[#63584C] dark:text-[#A89E90] hover:bg-[#F5EFEB] dark:hover:bg-[#25201A]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer p-2 rounded-xl text-[#1F1B16] dark:text-[#F4EEE4] hover:bg-[#F5EFEB] dark:hover:bg-[#25201A] border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] focus-ring"
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
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            ref={menuRef}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="overflow-hidden lg:hidden border-t border-[#E8DFD5] dark:border-[#3D352C] bg-[#FBF7F0] dark:bg-[#171410] px-4 pt-4 pb-6 space-y-4 shadow-xl"
          >
            <nav aria-label="Mobile Navigation">
              <ul className="space-y-1.5 m-0 p-0 list-none">
                {navItems.map((item) => (
                  <li key={item.to} className="m-0 p-0">
                    <NavLink
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={() =>
                        `block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                          item.isActive
                            ? 'bg-accent-tint dark:bg-accent-tint text-accent'
                            : 'text-[#1F1B16] dark:text-[#F4EEE4] hover:bg-[#F5EFEB] dark:hover:bg-[#25201A]'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="pt-3 border-t border-[#E8DFD5] dark:border-[#3D352C] flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#63584C] dark:text-[#A89E90]">Language:</span>
              <LanguageSelect currentLanguage={language} onChange={onLanguageChange} />
            </div>

            <div className="pt-2 border-t border-[#E8DFD5] dark:border-[#3D352C] flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#63584C] dark:text-[#A89E90]">Operating Mode:</span>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className="text-xs font-mono font-bold text-accent underline flex items-center gap-1.5"
              >
                <span className="capitalize">{apiConfig.mode} Mode</span>
                <Settings2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
