/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Activity,
  Zap,
} from 'lucide-react';
import { ApiConfig, checkBackendHealth, getApiConfig, saveApiConfig } from '../../api/client';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface BackendModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: (config: ApiConfig) => void;
}

export const BackendModeModal: React.FC<BackendModeModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const [config, setConfig] = useState<ApiConfig>(getApiConfig());
  const shouldReduceMotion = useReducedMotion();
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'checking' | 'success' | 'error';
    message?: string;
    latencyMs?: number;
  }>({ status: 'idle' });

  useEffect(() => {
    if (isOpen) {
      setConfig(getApiConfig());
      setTestResult({ status: 'idle' });
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setTestResult({ status: 'checking' });
    const res = await checkBackendHealth(config.baseUrl);
    if (res.ok) {
      setTestResult({ status: 'success', message: res.message, latencyMs: res.latencyMs });
    } else {
      setTestResult({ status: 'error', message: res.message });
    }
  };

  const handleSave = () => {
    const updated = saveApiConfig(config);
    onConfigUpdated(updated);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="backend-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-2xs"
            onClick={onClose}
          />

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="relative z-10 bg-[#FBF7F0] dark:bg-[#1A1612] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#D4C5B3] dark:border-[#3D352C]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8DFD5] dark:border-[#2D261F] bg-[#F5EFEB] dark:bg-[#201C17]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-tint dark:bg-accent-tint text-accent flex items-center justify-center border border-accent-border shadow-2xs">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="backend-modal-title" className="font-display text-base font-bold text-[#1F1B16] dark:text-[#F4EEE4]">
                    Operating Mode &amp; API Configuration
                  </h2>
                  <p className="text-xs text-[#63584C] dark:text-[#A89E90] font-mono">
                    SafeClaim Environment Settings
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer p-1.5 rounded-lg text-[#63584C] hover:text-[#1F1B16] dark:text-[#A89E90] dark:hover:text-[#F4EEE4] transition hover:bg-[#E8DFD5]/50 dark:hover:bg-[#2D261F]/50 focus-ring"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Mode Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#63584C] dark:text-[#A89E90] font-bold mb-2.5">
                  Select Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, mode: 'demo' })}
                    className={`cursor-pointer p-4 rounded-xl border-2 text-left transition focus-ring ${
                      config.mode === 'demo'
                        ? 'border-accent bg-accent-tint/60 dark:bg-accent-tint/60 shadow-xs'
                        : 'border-[#D4C5B3] dark:border-[#3D352C] hover:border-[#8E8273] bg-white dark:bg-[#201C17]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="font-display font-bold text-sm text-[#1F1B16] dark:text-[#F4EEE4]">Demo Mode</span>
                      </div>
                      {config.mode === 'demo' && (
                        <Badge variant="brand" size="sm">Active</Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#63584C] dark:text-[#A89E90] font-body leading-relaxed">
                      Deterministic benchmark data (6 clusters, 326 messages, verified NCDC/FCCPC circulars). No backend needed.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, mode: 'live' })}
                    className={`cursor-pointer p-4 rounded-xl border-2 text-left transition focus-ring ${
                      config.mode === 'live'
                        ? 'border-accent bg-accent-tint/60 dark:bg-accent-tint/60 shadow-xs'
                        : 'border-[#D4C5B3] dark:border-[#3D352C] hover:border-[#8E8273] bg-white dark:bg-[#201C17]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-accent" />
                        <span className="font-display font-bold text-sm text-[#1F1B16] dark:text-[#F4EEE4]">Live Mode</span>
                      </div>
                      {config.mode === 'live' && (
                        <Badge variant="brand" size="sm">Active</Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#63584C] dark:text-[#A89E90] font-body leading-relaxed">
                      Connects to FastAPI/Express microservice. Live Mode strictly fails on error without silent demo fallback.
                    </p>
                  </button>
                </div>
              </div>

              {/* Endpoint input */}
              <div className="space-y-2">
                <label htmlFor="api-base-url" className="block text-xs font-mono uppercase tracking-wider text-[#63584C] dark:text-[#A89E90] font-bold">
                  API Base URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="api-base-url"
                    type="url"
                    value={config.baseUrl}
                    onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                    placeholder="http://localhost:8000/api/v1"
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] font-mono text-[#1F1B16] dark:text-[#F4EEE4] focus-ring"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={testResult.status === 'checking'}
                    className="font-bold shrink-0"
                  >
                    {testResult.status === 'checking' ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>

                {testResult.status === 'success' && (
                  <div className="p-3 rounded-xl bg-[#F0FDF4] dark:bg-accent-tint border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{testResult.message} ({testResult.latencyMs}ms)</span>
                  </div>
                )}
                {testResult.status === 'error' && (
                  <div className="p-3 rounded-xl bg-[#FEF2F2] dark:bg-[#251515] border border-red-300 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 font-mono">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              {/* Admin Token input */}
              <div className="space-y-2">
                <label htmlFor="admin-token" className="block text-xs font-mono uppercase tracking-wider text-[#63584C] dark:text-[#A89E90] font-bold">
                  Admin API Token (Optional)
                </label>
                <input
                  id="admin-token"
                  type="password"
                  value={config.adminToken || ''}
                  onChange={(e) => setConfig({ ...config, adminToken: e.target.value })}
                  placeholder="X-SafeClaim-Admin-Token (for protected reload/submit)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#201C17] font-mono text-[#1F1B16] dark:text-[#F4EEE4] focus-ring"
                />
                <p className="text-[11px] text-[#8E8273] font-mono">
                  Matches SAFECLAIM_ADMIN_TOKEN in your backend environment. Required to reload live synthetic clusters or submit claims.
                </p>
              </div>

              {/* Architecture note */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#201C17] border border-[#D4C5B3] dark:border-[#3D352C] text-xs space-y-1.5 text-[#63584C] dark:text-[#A89E90] shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-[#1F1B16] dark:text-[#F4EEE4] font-mono">
                  <Cpu className="w-4 h-4 text-accent" />
                  <span>Model &amp; Retrieval Grounding Contract</span>
                </div>
                <p className="font-body leading-relaxed">
                  Targeting open-weight Mistral-7B-Instruct / Gemma-2-9B-IT over scraped NCDC, FCCPC, NHIA, FMOH, and INEC gazettes. Strict cosine similarity gating triggers formal abstention.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#E8DFD5] dark:border-[#2D261F] bg-[#F5EFEB] dark:bg-[#201C17] flex items-center justify-between">
              <span className="text-xs text-[#63584C] dark:text-[#A89E90] font-mono">
                Mode: <strong className="text-[#1F1B16] dark:text-[#F4EEE4] capitalize">{config.mode}</strong>
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave} className="font-bold">
                  Save Settings
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
