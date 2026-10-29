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
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

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

  if (!isOpen) return null;

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="backend-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none"
    >
      <div className="bg-white dark:bg-neutral-900 rounded-md max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-neutral-300 dark:border-neutral-700">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#EBF4EF] dark:bg-[#0D2D1E] text-[#0A5C36] dark:text-emerald-400 flex items-center justify-center border border-[#C2DEC9] dark:border-[#1F4A33]">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 id="backend-modal-title" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Operating Mode & API Configuration
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                SafeClaim Environment Settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition cursor-pointer focus-ring"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
              Select Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: 'demo' })}
                className={`p-3.5 rounded-md border text-left transition cursor-pointer focus-ring ${
                  config.mode === 'demo'
                    ? 'border-[#0A5C36] bg-[#EBF4EF]/40 dark:bg-[#0D2D1E]/40 ring-1 ring-[#0A5C36]'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 bg-white dark:bg-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#0A5C36] dark:text-emerald-400" />
                    <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Demo Mode</span>
                  </div>
                  {config.mode === 'demo' && (
                    <Badge variant="brand" size="sm">Active</Badge>
                  )}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Deterministic benchmark data (6 clusters, 326 messages, verified NCDC/FCCPC circulars). No backend needed.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: 'live' })}
                className={`p-3.5 rounded-md border text-left transition cursor-pointer focus-ring ${
                  config.mode === 'live'
                    ? 'border-[#0A5C36] bg-[#EBF4EF]/40 dark:bg-[#0D2D1E]/40 ring-1 ring-[#0A5C36]'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 bg-white dark:bg-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#0A5C36] dark:text-emerald-400" />
                    <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Live Mode</span>
                  </div>
                  {config.mode === 'live' && (
                    <Badge variant="brand" size="sm">Active</Badge>
                  )}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Connects to FastAPI/Express microservice. Live Mode strictly fails on error without silent demo fallback.
                </p>
              </button>
            </div>
          </div>

          {/* Endpoint input */}
          <div className="space-y-2">
            <label htmlFor="api-base-url" className="block text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              API Base URL
            </label>
            <div className="flex gap-2">
              <input
                id="api-base-url"
                type="url"
                value={config.baseUrl}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                placeholder="http://localhost:8000/api/v1"
                className="flex-1 px-3 py-2 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 font-mono text-neutral-900 dark:text-neutral-100 focus-ring"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleTestConnection}
                disabled={testResult.status === 'checking'}
              >
                {testResult.status === 'checking' ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>

            {testResult.status === 'success' && (
              <div className="p-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testResult.message}</span>
              </div>
            )}
            {testResult.status === 'error' && (
              <div className="p-2.5 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Architecture note */}
          <div className="p-3.5 rounded-md bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
              <Cpu className="w-3.5 h-3.5 text-[#0A5C36] dark:text-emerald-400" />
              <span>Model & Retrieval Grounding Contract</span>
            </div>
            <p>
              Targeting Mistral-7B-Instruct / Gemma-2-9B-IT over scraped NCDC, FCCPC, NHIA, FMOH, and INEC gazettes. Strict cosine similarity gating triggers formal abstention.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/40 flex items-center justify-between">
          <span className="text-xs text-neutral-500 font-mono">
            Mode: <strong className="text-neutral-800 dark:text-neutral-200 capitalize">{config.mode}</strong>
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
