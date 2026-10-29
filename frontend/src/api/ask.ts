/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEMO_ASK_RESPONSES, DEMO_ASK_RESPONSES_PCM, DEMO_HOTLINE_NCDC } from '../data/demoData';
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

  // DEMO MODE: Deterministic responses with explicit synthetic label
  // Simulate 350ms processing time to mimic grounded retrieval
  await new Promise((resolve) => setTimeout(resolve, 350));

  const lower = trimmed.toLowerCase();

  // Match against curated demo knowledge base
  if (lower.includes('ebola') && (lower.includes('lagos') || lower.includes('case') || lower.includes('outbreak') || lower.includes('true') || lower.includes('dey'))) {
    return language === 'pcm' ? DEMO_ASK_RESPONSES_PCM.ebola_lagos : DEMO_ASK_RESPONSES.ebola_lagos;
  }

  if (lower.includes('salt') || lower.includes('bath') || lower.includes('drink salt')) {
    return language === 'pcm' ? DEMO_ASK_RESPONSES_PCM.salt_water : DEMO_ASK_RESPONSES.salt_water;
  }

  if (lower.includes('loan') || lower.includes('fccpc') || lower.includes('lender') || lower.includes('defamation')) {
    return language === 'pcm' ? DEMO_ASK_RESPONSES_PCM.fccpc_loan_app : DEMO_ASK_RESPONSES.fccpc_loan_app;
  }

  if (lower.includes('insurance') || lower.includes('nhis') || lower.includes('nhia') || lower.includes('health scheme')) {
    return language === 'pcm' ? DEMO_ASK_RESPONSES_PCM.nhis_registration : DEMO_ASK_RESPONSES.nhis_registration;
  }

  if (lower.includes('grant') || lower.includes('50,000') || lower.includes('50000') || lower.includes('palliative') || lower.includes('tinyurl')) {
    return DEMO_ASK_RESPONSES.unverified_grant;
  }

  if (lower.includes('dogonyaro') || lower.includes('neem') || lower.includes('cholera') || lower.includes('guava')) {
    return DEMO_ASK_RESPONSES.cholera_dogonyaro;
  }

  // Fallback abstention state for queries not found in the verified repository
  return {
    question: trimmed,
    language,
    grounded: false,
    abstention_reason:
      'No official government publication in our verified database addresses or confirms this claim.',
    answer:
      language === 'pcm'
        ? 'SafeClaim Abstention Notice: We search our verified government records (NCDC, FCCPC, NHIA, FMOH) but we no see any official circular or document wey talk about this matter. Because government never talk about am no mean say na lie, but e mean say no official proof dey. Make you no share unverified rumor, and call NCDC for 6232 if na health emergency.'
        : 'SafeClaim Abstention Notice: No official government publication in our verified database addresses or confirms this claim. Absence of an official publication does not automatically prove falsity, but indicates an unverified claim lacking validated government evidence. Please avoid spreading unverified claims and consult relevant agency helplines.',
    hotline_info: DEMO_HOTLINE_NCDC,
    citations: [],
  };
}
