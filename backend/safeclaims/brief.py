"""
SafeClaim Daily Intelligence Brief Generator.
Generates institutional markdown intelligence briefs for NCDC, FCCPC, and fact-checkers,
highlighting circulating claim velocity, guidance gaps, and counter-broadcast recommendations.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from safeclaims.cluster import ClaimCluster, cluster_engine


def generate_daily_brief(date_str: Optional[str] = None) -> Dict[str, Any]:
    """Compiles a Daily Intelligence Brief from active clusters."""
    now = datetime.now(timezone.utc)
    date_display = date_str or now.strftime("%Y-%m-%d")

    clusters = cluster_engine.clusters
    sorted_by_count = sorted(clusters, key=lambda c: c.message_count, reverse=True)

    top_clusters_data = [
        {
            "cluster_id": c.cluster_id,
            "domain": c.domain,
            "claim": c.representative_claim,
            "count": c.message_count,
            "verdict": c.verdict.label,
        }
        for c in sorted_by_count[:5]
    ]

    gaps = [c for c in clusters if c.is_guidance_gap]
    guidance_gaps_data = [
        {
            "cluster_id": g.cluster_id,
            "domain": g.domain,
            "claim": g.representative_claim,
            "count": g.message_count,
            "suggested_action": (
                f"Publish formal circular or social advisory addressing {g.domain} claims "
                f"regarding: '{g.representative_claim}'."
            ),
        }
        for g in gaps[:5]
    ]

    total_messages = sum(c.message_count for c in clusters)
    total_contradicted = sum(1 for c in clusters if c.verdict.label == "CONTRADICTED_BY_OFFICIAL_SOURCE")
    total_gaps = len(gaps)

    # Compile formatted Markdown document
    md_lines = [
        f"# SafeClaim Daily Intelligence Brief — {date_display}",
        "",
        "> **Notice:** This brief compiles circulating misinformation clusters, public health myths, and consumer fraud alerts tracked across Nigerian messaging channels (WhatsApp forwards, viral social posts, and citizen reports).",
        "",
        "## 1. Executive Summary",
        f"- **Total Messages Monitored:** {total_messages}",
        f"- **Active Misinformation Clusters:** {len(clusters)}",
        f"- **Refuted / Contradicted Rumours:** {total_contradicted}",
        f"- **Active Guidance Gaps (Urgent Agency Action Needed):** {total_gaps}",
        "",
        "## 2. High-Velocity Circulating Claims",
        "| Cluster ID | Domain | Verdict | Volume | Claim Summary |",
        "| :--- | :--- | :--- | :--- | :--- |",
    ]

    for c in sorted_by_count[:8]:
        verdict_badge = "🚨 Contradicted" if "CONTRADICTED" in c.verdict.label else ("✅ Supported" if "SUPPORTED" in c.verdict.label else "⚠️ Unverified")
        md_lines.append(
            f"| `{c.cluster_id}` | `{c.domain}` | {verdict_badge} | {c.message_count} | {c.representative_claim} |"
        )

    md_lines.extend([
        "",
        "## 3. Priority Guidance Gaps (Official Vacuum)",
        "The following claims are circulating with substantial velocity, but currently have **zero formal response** in published government gazettes:",
        "",
    ])

    if not guidance_gaps_data:
        md_lines.append("*(No active guidance gaps detected today. All monitored claims match existing official advisories.)*")
    else:
        for idx, gap in enumerate(guidance_gaps_data, 1):
            md_lines.extend([
                f"### {idx}. `{gap['cluster_id']}` ({gap['domain'].upper()})",
                f"- **Circulating Claim:** \"{gap['claim']}\"",
                f"- **Monitored Volume:** {gap['count']} reports",
                f"- **Recommended Agency Intervention:** {gap['suggested_action']}",
                "",
            ])

    md_lines.extend([
        "## 4. Broadcast-Ready Public Guidance (WhatsApp & Radio)",
        "For contradicted claims, field communicators and fact-checkers may immediately deploy the following pre-cleared counter-receipts:",
        "",
    ])

    for c in [c for c in clusters if c.verdict.suggested_reply][:3]:
        md_lines.extend([
            f"#### Regarding: *{c.representative_claim}*",
            "```text",
            c.verdict.suggested_reply or "",
            "```",
            "",
        ])

    markdown_text = "\n".join(md_lines)

    return {
        "date": date_display,
        "title": f"SafeClaim Daily Intelligence Brief ({date_display})",
        "summary": (
            f"Analyzed {total_messages} messages across {len(clusters)} clusters. "
            f"Detected {total_contradicted} contradicted claims and {total_gaps} guidance gaps."
        ),
        "top_clusters": top_clusters_data,
        "guidance_gaps": guidance_gaps_data,
        "markdown": markdown_text,
    }
