"""
SafeClaim Document Ingestion and Indexing Module.
Parses official markdown documents, assigns strict passage IDs,
and builds an offline-first vector index for semantic retrieval.
"""

import csv
import json
import logging
import pickle
import re
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

from safeclaims.config import config

logger = logging.getLogger(__name__)


@dataclass
class Passage:
    passage_id: str
    doc_id: str
    doc_title: str
    publisher: str
    url: str
    domain: str
    date_retrieved: str
    section_title: str
    text: str
    hotline: Optional[str] = None


def extract_hotline(text: str) -> Optional[str]:
    """Extracts official emergency hotline numbers if mentioned in text."""
    patterns = [
        r"(?:Toll-Free Call Centre Line|Toll-Free Line|Hotline|Whistleblower Line|Citizens' Contact Centre.*?Toll-Free Hotline|Toll-Free)\s*[:\-]\s*([^\n\r,\;(]+)",
        r"\b(0700-CALL-INEC\s*(?:\([0-9\s]+\))?)\b",
        r"\b(0800\s*\d{3}\s*\d{4})\b",
        r"\b(0700\s*\d{3}\s*\d{4})\b",
        r"\b(6232)\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            extracted = match.group(1).strip()
            # Clean up trailing notes
            if len(extracted) >= 4:
                return extracted.strip()
    return None


def parse_markdown_document(
    file_path: Path, metadata: Dict[str, str]
) -> List[Passage]:
    """
    Parses an official markdown document into discrete semantic passages.
    Each passage is identified by <doc_id>#<chunk_id>.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Corpus file not found: {file_path}")

    content = file_path.read_text(encoding="utf-8")

    # Split document by markdown headings (### or ##)
    section_pattern = re.compile(r"^(#{2,3})\s+(.+)$", re.MULTILINE)
    matches = list(section_pattern.finditer(content))

    passages: List[Passage] = []

    if not matches:
        # Fallback if no subheadings: treat full text as single passage
        clean_text = content.strip()
        passages.append(
            Passage(
                passage_id=f"{metadata['id']}#1",
                doc_id=metadata["id"],
                doc_title=metadata["title"],
                publisher=metadata["publisher"],
                url=metadata["url"],
                domain=metadata["domain"],
                date_retrieved=metadata["date_retrieved"],
                section_title="General Guidance",
                text=clean_text,
                hotline=extract_hotline(clean_text),
            )
        )
        return passages

    for idx, match in enumerate(matches):
        section_title = match.group(2).strip()
        start_pos = match.end()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(content)

        section_body = content[start_pos:end_pos].strip()
        if not section_body:
            continue

        # Clean markdown artifacts while keeping key text
        passage_id = f"{metadata['id']}#{idx + 1}"
        full_passage_text = f"{section_title}\n{section_body}"

        passages.append(
            Passage(
                passage_id=passage_id,
                doc_id=metadata["id"],
                doc_title=metadata["title"],
                publisher=metadata["publisher"],
                url=metadata["url"],
                domain=metadata["domain"],
                date_retrieved=metadata["date_retrieved"],
                section_title=section_title,
                text=full_passage_text,
                hotline=extract_hotline(section_body),
            )
        )

    return passages


class CorpusIndex:
    """Stores indexed passages and TF-IDF matrix for semantic similarity search."""

    def __init__(
        self,
        vectorizer: TfidfVectorizer,
        tfidf_matrix: np.ndarray,
        passages: List[Passage],
    ):
        self.vectorizer = vectorizer
        self.tfidf_matrix = tfidf_matrix
        self.passages = passages
        self._passage_map = {p.passage_id: p for p in passages}

    def get_passage(self, passage_id: str) -> Optional[Passage]:
        return self._passage_map.get(passage_id)

    def save(self, index_dir: Path) -> None:
        index_dir.mkdir(parents=True, exist_ok=True)
        with open(index_dir / "vectorizer.pkl", "wb") as f:
            pickle.dump(self.vectorizer, f)
        np.save(index_dir / "tfidf_matrix.npy", self.tfidf_matrix)
        with open(index_dir / "passages.json", "w", encoding="utf-8") as f:
            json.dump([asdict(p) for p in self.passages], f, indent=2)

    @classmethod
    def load(cls, index_dir: Path) -> "CorpusIndex":
        if not (index_dir / "passages.json").exists():
            raise FileNotFoundError(f"Index not found in {index_dir}. Run ingest first.")
        with open(index_dir / "vectorizer.pkl", "rb") as f:
            vectorizer = pickle.load(f)
        tfidf_matrix = np.load(index_dir / "tfidf_matrix.npy")
        with open(index_dir / "passages.json", "r", encoding="utf-8") as f:
            raw_passages = json.load(f)
            passages = [Passage(**p) for p in raw_passages]
        return cls(vectorizer=vectorizer, tfidf_matrix=tfidf_matrix, passages=passages)


def build_index(
    manifest_path: Optional[Path] = None,
    corpus_dir: Optional[Path] = None,
    index_dir: Optional[Path] = None,
) -> CorpusIndex:
    """Builds and serializes the corpus index from manifest and markdown documents."""
    manifest_path = manifest_path or config.MANIFEST_PATH
    corpus_dir = corpus_dir or config.CORPUS_DIR
    index_dir = index_dir or config.INDEX_DIR

    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest not found: {manifest_path}")

    # Read manifest
    documents_meta: List[Dict[str, str]] = []
    with open(manifest_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("id"):
                documents_meta.append(row)

    all_passages: List[Passage] = []
    for meta in documents_meta:
        doc_file = corpus_dir / f"{meta['id']}.md"
        passages = parse_markdown_document(doc_file, meta)
        all_passages.extend(passages)

    if not all_passages:
        raise ValueError("No passages extracted from corpus.")

    # Train TF-IDF vectorizer (unigrams + bigrams, sublinear tf scaling)
    corpus_texts = [p.text for p in all_passages]
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        stop_words="english",
        lowercase=True,
    )
    tfidf_matrix = vectorizer.fit_transform(corpus_texts).toarray()

    index = CorpusIndex(
        vectorizer=vectorizer, tfidf_matrix=tfidf_matrix, passages=all_passages
    )
    index.save(index_dir)
    return index


if __name__ == "__main__":
    print("Building SafeClaim index...")
    idx = build_index()
    print(f"Successfully indexed {len(idx.passages)} passages into {config.INDEX_DIR}")
