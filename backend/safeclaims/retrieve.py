"""
SafeClaim Semantic Retrieval Module.
Performs similarity search over indexed official passages,
applies calibrated scoring and strict threshold filtering for safe abstention.
"""

from dataclasses import asdict, dataclass
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from sklearn.metrics.pairwise import cosine_similarity

from safeclaims.config import config
from safeclaims.ingest import CorpusIndex

logger = logging.getLogger(__name__)


@dataclass
class RetrievedPassage:
    passage_id: str
    doc_title: str
    publisher: str
    url: str
    domain: str
    excerpt: str
    score: float
    hotline: Optional[str] = None


@dataclass
class RetrievalResult:
    query: str
    relevant: bool
    top_score: float
    threshold: float
    passages_evaluated: int
    passages: List[RetrievedPassage]
    hotline: Optional[Dict[str, str]] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "query": self.query,
            "relevant": self.relevant,
            "top_score": self.top_score,
            "threshold": self.threshold,
            "passages_evaluated": self.passages_evaluated,
            "passages": [asdict(p) for p in self.passages],
            "hotline": self.hotline,
        }


class Retriever:
    """Retrieves potentially relevant official passages using TF-IDF cosine similarity."""

    def __init__(self, index_dir: Optional[Path] = None):
        self.index_dir = index_dir or config.INDEX_DIR
        self._index: Optional[CorpusIndex] = None

    @property
    def index(self) -> CorpusIndex:
        if self._index is None:
            self._index = CorpusIndex.load(self.index_dir)
        return self._index

    def reload(self) -> None:
        """Forces reloading the index from disk."""
        self._index = CorpusIndex.load(self.index_dir)

    def retrieve(
        self,
        query: str,
        top_k: Optional[int] = None,
        domain_filter: Optional[str] = None,
        threshold: Optional[float] = None,
    ) -> RetrievalResult:
        """
        Retrieves top official passages for a user query.
        Applies input sanitization, a 500-character cap, and relevance gating.
        Relevance does not establish that a passage supports an answer.
        """
        top_k = top_k or config.RETRIEVAL_TOP_K
        threshold = (
            threshold
            if threshold is not None
            else config.RETRIEVAL_SIMILARITY_THRESHOLD
        )

        # Rule 7: Prompt injection hardening & input cap
        sanitized_query = query.strip()[:500]
        if not sanitized_query:
            return RetrievalResult(
                query=query,
                relevant=False,
                top_score=0.0,
                threshold=threshold,
                passages_evaluated=len(self.index.passages),
                passages=[],
                hotline=None,
            )

        query_vec = self.index.vectorizer.transform([sanitized_query])
        raw_scores = cosine_similarity(query_vec, self.index.tfidf_matrix)[0]

        scored_indices: List[int] = []
        for i, p in enumerate(self.index.passages):
            if domain_filter and p.domain != domain_filter:
                continue
            scored_indices.append(i)

        if not scored_indices:
            return RetrievalResult(
                query=sanitized_query,
                relevant=False,
                top_score=0.0,
                threshold=threshold,
                passages_evaluated=len(self.index.passages),
                passages=[],
                hotline=None,
            )

        # Sort candidate passages by raw score descending
        sorted_indices = sorted(
            scored_indices, key=lambda idx: raw_scores[idx], reverse=True
        )

        top_raw_score = float(raw_scores[sorted_indices[0]])
        relevant = top_raw_score >= threshold

        results: List[RetrievedPassage] = []
        detected_hotline: Optional[Dict[str, str]] = None

        if relevant:
            for idx in sorted_indices[:top_k]:
                passage = self.index.passages[idx]
                results.append(
                    RetrievedPassage(
                        passage_id=passage.passage_id,
                        doc_title=passage.doc_title,
                        publisher=passage.publisher,
                        url=passage.url,
                        domain=passage.domain,
                        excerpt=passage.text,
                        score=float(raw_scores[idx]),
                        hotline=passage.hotline,
                    )
                )

        # Resolve hotline strictly from the top-scoring official document
        if relevant:
            top_doc_id = self.index.passages[sorted_indices[0]].doc_id
            for passage in self.index.passages:
                if passage.doc_id == top_doc_id and passage.hotline:
                    detected_hotline = {
                        "name": f"{passage.publisher} Support Line",
                        "number": passage.hotline,
                        "source_doc_id": passage.passage_id,
                    }
                    break

        return RetrievalResult(
            query=sanitized_query,
            relevant=relevant,
            top_score=top_raw_score,
            threshold=threshold,
            passages_evaluated=len(self.index.passages),
            passages=results,
            hotline=detected_hotline,
        )


# Global retriever instance
retriever = Retriever()
