/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClaimCluster, DailyBrief, RumourStats } from '../types/api';

export function generateDailyBriefMarkdown(
  stats: RumourStats,
  clusters: ClaimCluster[],
  dateStr = new Date().toISOString().split('T')[0]
): string {
  const topClusters = [...clusters]
    .sort((a, b) => b.message_count - a.message_count)
    .slice(0, 4);

  const guidanceGaps = clusters.filter((c) => c.is_guidance_gap);

  let md = `# SafeClaim Institutional Intelligence Brief\n`;
  md += `**Date:** ${dateStr}  \n`;
  md += `**Dataset:** ${stats.total_messages_analyzed} circulating messages analyzed across ${stats.total_clusters} claim clusters  \n`;
  md += `**Target Agencies:** NCDC, FCCPC, NHIA, and Fact-Checking Desks (Dubawa, Africa Check, FactCheckHub)\n\n`;
  md += `---\n\n`;

  md += `## 1. Executive Summary\n`;
  md += `SafeClaim automated intelligence monitoring tracked ${stats.total_messages_analyzed} message signals. `;
  md += `Of these, **${stats.verdict_counts.CONTRADICTED_BY_OFFICIAL_SOURCE || 0} clusters** have been conclusively refuted by official public advisories, `;
  md += `**${stats.verdict_counts.SUPPORTED_BY_OFFICIAL_SOURCE || 0} cluster** matches established regulatory standards, `;
  md += `and **${guidanceGaps.length} critical guidance gaps** require urgent institutional clarification.\n\n`;

  md += `## 2. High-Volume Circulating Rumour Clusters\n\n`;
  for (const c of topClusters) {
    const verdictLabel =
      c.verdict.label === 'CONTRADICTED_BY_OFFICIAL_SOURCE'
        ? 'REFUTED BY OFFICIAL SOURCE'
        : c.verdict.label === 'SUPPORTED_BY_OFFICIAL_SOURCE'
        ? 'MATCHES OFFICIAL GUIDANCE'
        : 'GUIDANCE GAP (NO OFFICIAL SOURCE)';

    md += `### [${c.domain.toUpperCase()}] ${c.representative_claim}\n`;
    md += `- **Volume:** ${c.message_count} messages (${c.growth_rate_24h || '+0%'} in 24h)\n`;
    md += `- **Verdict:** \`${c.verdict.label}\` (${verdictLabel})\n`;
    md += `- **Summary:** ${c.verdict.short_explanation}\n`;
    if (c.verdict.suggested_reply) {
      md += `- **Suggested Broadcast Response:**\n  > "${c.verdict.suggested_reply}"\n`;
    }
    md += `\n`;
  }

  md += `## 3. High-Priority Guidance Gaps (Action Required)\n\n`;
  if (guidanceGaps.length === 0) {
    md += `*No active guidance gaps detected at this time.*\n\n`;
  } else {
    for (let i = 0; i < guidanceGaps.length; i++) {
      const g = guidanceGaps[i];
      md += `### ${i + 1}. ${g.representative_claim}\n`;
      md += `- **Cluster ID:** \`${g.cluster_id}\`\n`;
      md += `- **Domain:** ${g.domain}\n`;
      md += `- **Message Volume:** ${g.message_count} messages\n`;
      md += `- **Sample Citizen Query:** "${g.sample_messages[0] || 'N/A'}"\n`;
      md += `- **Recommended Agency Action:** Immediate agency press release and risk communication bulletin recommended to counter community spread.\n\n`;
    }
  }

  md += `---\n`;
  md += `*SafeClaim AI — Understand the claim. Verify the facts.*  \n`;
  md += `*Official Source Knowledge Base: NCDC, FCCPC, NHIA, FMOH, INEC.*  \n`;

  return md;
}

export function downloadMarkdownFile(content: string, filename = 'safeclaim_daily_brief.md') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
