"""
SafeClaim Online Incremental Clustering Engine.
Maintains stable claim clusters, updates centroid vectors via running averages,
and aggregates rumour desk intelligence.
"""

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from safeclaims.claims import DomainType, ExtractedClaim, RawMessage, extract_claim_from_message
from safeclaims.config import config
from safeclaims.retrieve import retriever
from safeclaims.verdict import ClusterVerdict, determine_verdict

logger = logging.getLogger(__name__)


@dataclass
class ClaimCluster:
    cluster_id: str
    domain: DomainType
    representative_claim: str
    verdict: ClusterVerdict
    message_count: int
    growth_rate_24h: str
    languages_seen: List[str]
    first_seen: str
    last_seen: str
    sample_messages: List[str]
    is_guidance_gap: bool
    centroid: Optional[List[float]] = None
    is_synthetic: bool = False

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d["verdict"] = asdict(self.verdict)
        return d


class ClusterEngine:
    """Incremental clustering engine using TF-IDF centroid distance."""

    def __init__(self, distance_threshold: Optional[float] = None):
        self.distance_threshold = (
            distance_threshold
            if distance_threshold is not None
            else config.CLUSTERING_DISTANCE_THRESHOLD
        )
        self.clusters: List[ClaimCluster] = []
        self._centroids: List[np.ndarray] = []

    def get_cluster(self, cluster_id: str) -> Optional[ClaimCluster]:
        for c in self.clusters:
            if c.cluster_id == cluster_id:
                return c
        return None

    def add_message(self, message: RawMessage) -> ClaimCluster:
        """
        Incrementally assigns an incoming message (WhatsApp, X, web) to an existing cluster,
        or creates a new cluster if distance exceeds threshold.
        """
        extracted = extract_claim_from_message(message)
        vec = retriever.index.vectorizer.transform([extracted.normalized_claim]).toarray()[0]
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm

        now_iso = datetime.now(timezone.utc).isoformat()

        # Find closest cluster in the same domain
        best_idx: Optional[int] = None
        best_sim = -1.0

        for idx, cluster in enumerate(self.clusters):
            if cluster.is_synthetic or cluster.domain != extracted.domain:
                continue
            centroid = self._centroids[idx]
            sim = float(np.dot(vec, centroid))
            if sim > best_sim:
                best_sim = sim
                best_idx = idx

        # Cosine distance = 1 - cosine_similarity
        best_distance = 1.0 - best_sim if best_sim >= 0 else 1.0

        if best_idx is not None and best_distance <= self.distance_threshold:
            # Merge into existing cluster
            target = self.clusters[best_idx]
            old_count = target.message_count
            new_count = old_count + 1

            # Update running centroid: c_new = (c_old * n + vec) / (n + 1)
            updated_centroid = (self._centroids[best_idx] * old_count + vec) / new_count
            c_norm = np.linalg.norm(updated_centroid)
            if c_norm > 0:
                updated_centroid = updated_centroid / c_norm
            self._centroids[best_idx] = updated_centroid
            target.centroid = updated_centroid.tolist()

            target.message_count = new_count
            target.last_seen = now_iso
            if message.language not in target.languages_seen:
                target.languages_seen.append(message.language)

            return target

        # Otherwise create a new cluster
        domain_clusters = [c for c in self.clusters if c.domain == extracted.domain]
        new_id = f"cl_{extracted.domain}_{len(domain_clusters) + 1:02d}"

        verdict, is_guidance_gap = determine_verdict(extracted.normalized_claim, extracted.domain)

        new_cluster = ClaimCluster(
            cluster_id=new_id,
            domain=extracted.domain,
            representative_claim=extracted.normalized_claim,
            verdict=verdict,
            message_count=1,
            growth_rate_24h="not measured",
            languages_seen=[message.language],
            first_seen=now_iso,
            last_seen=now_iso,
            sample_messages=[],
            is_guidance_gap=is_guidance_gap,
            centroid=vec.tolist(),
            is_synthetic=False,
        )

        self.clusters.append(new_cluster)
        self._centroids.append(vec)
        return new_cluster

    def get_clusters(
        self,
        domain: Optional[str] = None,
        label: Optional[str] = None,
        guidance_gap_only: bool = False,
        search_query: Optional[str] = None,
    ) -> List[ClaimCluster]:
        """Returns filtered clusters."""
        results = [cluster for cluster in self.clusters if cluster.is_synthetic]
        if domain and domain != "all":
            results = [c for c in results if c.domain == domain]
        if label and label != "all":
            results = [c for c in results if c.verdict.label == label]
        if guidance_gap_only:
            results = [c for c in results if c.is_guidance_gap]
        if search_query:
            q = search_query.lower()
            results = [
                c for c in results
                if q in c.representative_claim.lower()
                or any(q in sm.lower() for sm in c.sample_messages)
            ]
        return results

    def get_stats(self) -> Dict[str, Any]:
        """Aggregates metrics for Rumour Desk overview cards."""
        demo_clusters = [cluster for cluster in self.clusters if cluster.is_synthetic]
        total_messages = sum(c.message_count for c in demo_clusters)
        total_clusters = len(demo_clusters)
        guidance_gaps = sum(1 for c in demo_clusters if c.is_guidance_gap)

        verdict_counts: Dict[str, int] = {
            "CONTRADICTED_BY_OFFICIAL_SOURCE": 0,
            "SUPPORTED_BY_OFFICIAL_SOURCE": 0,
            "NO_OFFICIAL_SOURCE_FOUND": 0,
            "NOT_VALIDATED": 0,
        }
        domain_counts: Dict[str, int] = {
            "outbreak": 0,
            "scam": 0,
            "benefit": 0,
            "election_procedure": 0,
            "other": 0,
        }

        for c in demo_clusters:
            label = c.verdict.label
            if label in verdict_counts:
                verdict_counts[label] += 1
            else:
                verdict_counts[label] = 1
            domain_counts[c.domain] = domain_counts.get(c.domain, 0) + c.message_count

        return {
            "total_messages_analyzed": total_messages,
            "total_clusters": total_clusters,
            "source_distribution": {
                "synthetic": total_messages,
                "submitted": 0,
            },
            "verdict_counts": verdict_counts,
            "guidance_gaps_count": guidance_gaps,
            "domains": domain_counts,
        }

    def load_precomputed(self, path: Path) -> int:
        """Loads precomputed claim clusters into the engine."""
        if not path.exists():
            return 0
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.clusters = []
        self._centroids = []

        for item in data:
            verdict_dict = item.get("verdict", {})
            verdict = ClusterVerdict(
                label=verdict_dict.get("label", "NO_OFFICIAL_SOURCE_FOUND"),
                short_explanation=verdict_dict.get("short_explanation", ""),
                suggested_reply=verdict_dict.get("suggested_reply"),
                evidence_passage_ids=verdict_dict.get("evidence_passage_ids", []),
                evidence_passages=verdict_dict.get("evidence_passages", []),
            )
            cluster = ClaimCluster(
                cluster_id=item["cluster_id"],
                domain=item["domain"],
                representative_claim=item["representative_claim"],
                verdict=verdict,
                message_count=item.get("message_count", 1),
                growth_rate_24h=item.get("growth_rate_24h", "+15%"),
                languages_seen=item.get("languages_seen", ["en"]),
                first_seen=item.get("first_seen", "2026-10-25T08:00:00Z"),
                last_seen=item.get("last_seen", "2026-10-28T14:00:00Z"),
                sample_messages=item.get("sample_messages", []),
                is_guidance_gap=item.get("is_guidance_gap", False),
            )
            cluster.is_synthetic = True
            self.clusters.append(cluster)

            # Recompute centroid vector from representative claim
            vec = retriever.index.vectorizer.transform([cluster.representative_claim]).toarray()[0]
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            self._centroids.append(vec)

        return len(self.clusters)


# Global singleton instance
cluster_engine = ClusterEngine()
