/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AskResponse, LanguageCode } from '../types/api';
import { ApiError, getApiConfig } from './client';

export async function askQuestion(
  question: string,
  language: LanguageCode = 'en'
): Promise<AskResponse> {
  const trimmed = question.trim();
  if (!trimmed) {
    throw new Error('Question cannot be empty');
  }

  const { mode, baseUrl } = getApiConfig();

  // LIVE MODE: Call configured backend directly
  if (mode === 'live') {
    try {
      const res = await fetch(`${baseUrl}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ question: trimmed, language }),
      });

      if (!res.ok) {
        let errDetails = res.statusText;
        try {
          const json = await res.json();
          errDetails = json.message || json.detail || JSON.stringify(json);
        } catch {
          // ignore parsing error
        }
        throw new ApiError(`Live Backend Error (${res.status}): ${errDetails}`, res.status);
      }

      const data: AskResponse = await res.json();
      return data;
    } catch (err: unknown) {
      if (err instanceof ApiError) throw err;
      const msg = err instanceof Error ? err.message : 'Unknown network error';
      throw new ApiError(
        `Failed to reach backend at ${baseUrl}. Ensure backend server is running or switch to Demo Mode. Error: ${msg}`,
        undefined,
        true
      );
    }
  }

  // Demo mode explains the interface only; it does not fabricate source-backed answers.
  await new Promise((resolve) => setTimeout(resolve, 350));
  return {
    question: trimmed,
    language,
    grounded: false,
    abstention_reason: 'DEMO_MODE_NOT_CONNECTED',
    answer: language === 'pcm'
      ? 'Dis na interface demo only. E no check official sources or verify this claim. Switch to Live Mode after connecting a backend.'
      : 'Demo Mode is an interface preview only. It does not search official sources or verify this claim. Connect a backend in Live Mode for source retrieval.',
    hotline_info: null,
    citations: [],
  };
}
