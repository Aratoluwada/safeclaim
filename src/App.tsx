/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Outlet,
} from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { BackendModeModal } from './components/common/BackendModeModal';
import { HomePage } from './pages/HomePage';
import { AskPage } from './pages/AskPage';
import { RumourDeskPage } from './pages/RumourDeskPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { VerdictsPage } from './pages/VerdictsPage';
import { FaqPage } from './pages/FaqPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ApiConfig, getApiConfig } from './api/client';
import { LanguageCode } from './types/api';
import { initTheme, setTheme } from './utils/theme';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HashRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('ask')) {
        navigate('/ask', { replace: true });
      } else if (hash.includes('desk') || hash.includes('rumour')) {
        navigate('/desk', { replace: true });
      } else if (hash.includes('overview') || hash.includes('home')) {
        navigate('/', { replace: true });
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [navigate]);
  return null;
}

function AnimatedOutlet() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

function Layout({
  language,
  setLanguage,
  apiConfig,
  setApiConfig,
  isSettingsOpen,
  setIsSettingsOpen,
  isDark,
  setIsDark,
}: {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  apiConfig: ApiConfig;
  setApiConfig: (cfg: ApiConfig) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}) {
  const handleToggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    setTheme(next);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-[#0A5C36] selection:text-white">
      {/* Skip to Content for WCAG keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-white dark:focus:bg-neutral-900 focus:text-neutral-900 dark:focus:text-neutral-100 focus:border-2 focus:border-[#0A5C36] focus:rounded-md focus:shadow-lg focus:font-mono focus:text-xs"
      >
        Skip to main content
      </a>

      {/* Sticky Newsroom Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        apiConfig={apiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 py-6 sm:py-8">
        <AnimatedOutlet />
      </main>

      {/* Grouped Link List Footer */}
      <Footer
        language={language}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Backend & Model Settings Dialog */}
      <BackendModeModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigUpdated={setApiConfig}
      />
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [apiConfig, setApiConfig] = useState<ApiConfig>(getApiConfig());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(initTheme());

    const handleConfigChange = (e: Event) => {
      const customEvent = e as CustomEvent<ApiConfig>;
      if (customEvent.detail) {
        setApiConfig(customEvent.detail);
      }
    };
    window.addEventListener('safeclaim_config_changed', handleConfigChange);
    return () => window.removeEventListener('safeclaim_config_changed', handleConfigChange);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <HashRedirect />
      <Routes>
        <Route
          element={
            <Layout
              language={language}
              setLanguage={setLanguage}
              apiConfig={apiConfig}
              setApiConfig={setApiConfig}
              isSettingsOpen={isSettingsOpen}
              setIsSettingsOpen={setIsSettingsOpen}
              isDark={isDark}
              setIsDark={setIsDark}
            />
          }
        >
          {/* Default landing page is the Homepage */}
          <Route index element={<HomePage language={language} />} />
          <Route path="overview" element={<HomePage language={language} />} />
          <Route
            path="ask"
            element={
              <AskPage
                language={language}
                apiConfig={apiConfig}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            }
          />
          <Route
            path="desk"
            element={
              <RumourDeskPage
                language={language}
                apiConfig={apiConfig}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            }
          />
          <Route
            path="rumours"
            element={
              <RumourDeskPage
                language={language}
                apiConfig={apiConfig}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            }
          />
          <Route
            path="how-it-works"
            element={<HowItWorksPage language={language} />}
          />
          <Route
            path="verdicts"
            element={<VerdictsPage language={language} />}
          />
          <Route path="faq" element={<FaqPage language={language} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
