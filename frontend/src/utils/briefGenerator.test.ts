/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDailyBriefMarkdown } from './briefGenerator';
import { DEMO_CLAIM_CLUSTERS, DEMO_RUMOUR_STATS } from '../data/demoData';

test('generateDailyBriefMarkdown produces structured markdown with all required sections', () => {
  const md = generateDailyBriefMarkdown(DEMO_RUMOUR_STATS, DEMO_CLAIM_CLUSTERS, '2026-10-28');

  assert.ok(md.includes('# SafeClaim Institutional Intelligence Brief'), 'Contains main heading');
  assert.ok(md.includes('**Date:** 2026-10-28'), 'Contains date');
  assert.ok(md.includes('## 1. Executive Summary'), 'Contains executive summary section');
  assert.ok(md.includes('## 2. High-Volume Circulating Rumour Clusters'), 'Contains top clusters section');
  assert.ok(md.includes('## 3. High-Priority Guidance Gaps'), 'Contains guidance gaps section');
  assert.ok(md.includes('CONTRADICTED_BY_OFFICIAL_SOURCE'), 'Includes contradicted verdict tags');
  assert.ok(md.includes('cluster-ob-04'), 'Identifies Mpox guidance gap cluster');
});

test('clusters filtering and statistics calculations are deterministic', () => {
  const gaps = DEMO_CLAIM_CLUSTERS.filter((c) => c.is_guidance_gap);
  assert.equal(gaps.length, 2, 'Exactly 2 guidance gaps in baseline synthetic demo');

  const contradicted = DEMO_CLAIM_CLUSTERS.filter(
    (c) => c.verdict.label === 'CONTRADICTED_BY_OFFICIAL_SOURCE'
  );
  assert.equal(contradicted.length, 3, 'Exactly 3 contradicted clusters in baseline demo');
});
