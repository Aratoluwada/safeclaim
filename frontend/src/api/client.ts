/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ApiConfig {
  mode: 'demo' | 'live';
  baseUrl: string;
}

const STORAGE_KEY_MODE = 'safeclaim_mode';
const STORAGE_KEY_BASE_URL = 'safeclaim_api_base_url';

export function normalizeApiUrl(rawUrl: string): string {
  let url = (rawUrl || '').trim().replace(/\/+$/, '');
  if (!url) return 'http://localhost:8000/api/v1';
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  if (!url.endsWith('/api/v1')) {
    url = `${url}/api/v1`;
  }
  return url;
}

export const DEFAULT_API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL)
    ? normalizeApiUrl(import.meta.env.VITE_API_BASE_URL)
    : 'http://localhost:8000/api/v1';

export function getApiConfig(): ApiConfig {
  if (typeof window === 'undefined') {
    return { mode: 'demo', baseUrl: DEFAULT_API_BASE_URL };
  }
  const savedMode = (localStorage.getItem(STORAGE_KEY_MODE) as 'demo' | 'live') || 'demo';
  const savedUrl = localStorage.getItem(STORAGE_KEY_BASE_URL) || DEFAULT_API_BASE_URL;
  return {
    mode: savedMode,
    baseUrl: normalizeApiUrl(savedUrl),
  };
}

export function saveApiConfig(config: Partial<ApiConfig>): ApiConfig {
  const current = getApiConfig();
  const updated: ApiConfig = {
    mode: config.mode ?? current.mode,
    baseUrl: (config.baseUrl ?? current.baseUrl).replace(/\/$/, ''),
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_MODE, updated.mode);
    localStorage.setItem(STORAGE_KEY_BASE_URL, updated.baseUrl);
    window.dispatchEvent(new CustomEvent('safeclaim_config_changed', { detail: updated }));
  }
  return updated;
}

export class ApiError extends Error {
  status?: number;
  isBackendOffline?: boolean;

  constructor(message: string, status?: number, isBackendOffline = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isBackendOffline = isBackendOffline;
  }
}

export async function checkBackendHealth(baseUrl: string): Promise<{ ok: boolean; message: string; latencyMs?: number }> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/rumours/stats`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - start);

    if (res.ok) {
      return { ok: true, message: `Backend online (${latencyMs}ms)`, latencyMs };
    } else {
      return { ok: false, message: `Backend responded with HTTP ${res.status}: ${res.statusText}`, latencyMs };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Connection refused';
    return { ok: false, message: `Cannot connect to ${baseUrl}: ${message}` };
  }
}
