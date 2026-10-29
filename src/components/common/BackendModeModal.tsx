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
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ApiConfig, checkBackendHealth, getApiConfig, saveApiConfig } from '../../api/client';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 id="backend-modal-title" className="text-base font-bold text-slate-900">
                Backend Architecture & Operating Mode
              </h2>
              <p className="text-xs text-slate-500">
                Configure live API integration or deterministic synthetic testbed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Select Operating Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: 'demo' })}
                className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                  config.mode === 'demo'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-sm text-slate-900">Demo Mode</span>
                  </div>
                  {config.mode === 'demo' && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deterministic, zero-latency sample dataset with 6 clusters, 326 synthetic messages, and grounded official NCDC/FCCPC/NHIA citations. Works without backend deployment.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: 'live' })}
                className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                  config.mode === 'live'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-sm text-slate-900">Live API Mode</span>
                  </div>
                  {config.mode === 'live' && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connects to companion FastAPI / Express microservice exposing <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">/api/v1</code> contract with real RAG retrieval and open-weight model inference.
                </p>
              </button>
            </div>
          </div>

          {/* Backend URL input */}
          <div className="space-y-2">
            <label htmlFor="api-base-url" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              API Base URL
            </label>
            <div className="flex gap-2">
              <input
                id="api-base-url"
                type="url"
                value={config.baseUrl}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                placeholder="http://localhost:8000/api/v1"
                className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono text-slate-800"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testResult.status === 'checking'}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer disabled:opacity-50 shrink-0"
              >
                {testResult.status === 'checking' ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Configured endpoint for <code className="font-mono">POST /ask</code>, <code className="font-mono">GET /rumours/clusters</code>, and <code className="font-mono">GET /rumours/brief</code>.
            </p>

            {/* Test result status */}
            {testResult.status === 'success' && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testResult.message}</span>
              </div>
            )}
            {testResult.status === 'error' && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Open-Weight AI Architecture Details */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wide">
              <Cpu className="w-4 h-4 text-emerald-700" />
              <span>Hackathon AI Architecture & Contract</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Planned Model:</strong> Mistral-7B-Instruct-v0.3 / Gemma-2-9B-IT (Open-Weight Apache 2.0 / Gemma Terms) quantized via vLLM or Hugging Face TGI.
              </p>
              <p>
                <strong>Grounding Strategy:</strong> Dense vector embeddings over scraped official Nigerian gazettes (<code className="font-mono text-[11px]">ncdc.gov.ng</code>, <code className="font-mono text-[11px]">fccpc.gov.ng</code>, <code className="font-mono text-[11px]">nhia.gov.ng</code>).
              </p>
              <p>
                <strong>Strict Abstention Policy:</strong> When retrieved passage similarity is below cosine threshold 0.72, the model generates an explicit abstention notice with verified agency emergency contact numbers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Current mode: <strong className="text-slate-800 capitalize">{config.mode}</strong>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm transition cursor-pointer"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
