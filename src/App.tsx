/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { BackendModeModal } from './components/common/BackendModeModal';
import { AskPage } from './pages/AskPage';
import { RumourDeskPage } from './pages/RumourDeskPage';
import { ApiConfig, getApiConfig } from './api/client';
import { LanguageCode } from './types/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'ask' | 'rumour-desk'>('ask');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [apiConfig, setApiConfig] = useState<ApiConfig>(getApiConfig());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync with browser URL / hash
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      if (hash.includes('desk') || hash.includes('rumour') || pathname.includes('desk') || pathname.includes('rumour')) {
        setCurrentTab('rumour-desk');
      } else {
        setCurrentTab('ask');
      }
    };

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    // Listen to config events
    const handleConfigChange = (e: Event) => {
      const customEvent = e as CustomEvent<ApiConfig>;
      if (customEvent.detail) {
        setApiConfig(customEvent.detail);
      }
    };
    window.addEventListener('safeclaim_config_changed', handleConfigChange);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('safeclaim_config_changed', handleConfigChange);
    };
  }, []);

  const handleTabChange = (tab: 'ask' | 'rumour-desk') => {
    setCurrentTab(tab);
    window.location.hash = tab === 'rumour-desk' ? '#desk' : '#ask';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        language={language}
        onLanguageChange={setLanguage}
        apiConfig={apiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Primary Page Router */}
      <div className="flex-1">
        {currentTab === 'ask' ? (
          <AskPage
            language={language}
            apiConfig={apiConfig}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onSwitchToDesk={() => handleTabChange('rumour-desk')}
          />
        ) : (
          <RumourDeskPage
            language={language}
            apiConfig={apiConfig}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            &copy; 2026 SafeClaim AI &bull; Built for open-weight intelligence & evidence grounding in Nigeria.
          </p>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <button
              onClick={() => handleTabChange('ask')}
              className="hover:text-emerald-800 cursor-pointer"
            >
              Public Ask
            </button>
            <span>&bull;</span>
            <button
              onClick={() => handleTabChange('rumour-desk')}
              className="hover:text-emerald-800 cursor-pointer"
            >
              Rumour Desk
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-emerald-800 cursor-pointer"
            >
              API Config ({apiConfig.mode})
            </button>
          </div>
        </div>
      </footer>

      {/* Backend / Model Configuration Modal */}
      <BackendModeModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigUpdated={setApiConfig}
      />
    </div>
  );
}
