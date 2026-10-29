"""
SafeClaim Configuration Module.
Loads environment variables and sets system-wide paths and thresholds.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Base paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
CORPUS_DIR = DATA_DIR / "corpus"
MANIFEST_PATH = DATA_DIR / "corpus_manifest.csv"
INDEX_DIR = DATA_DIR / "index"
PRECOMPUTED_CLUSTERS_PATH = DATA_DIR / "precomputed_clusters.json"
SYNTHETIC_MESSAGES_PATH = DATA_DIR / "messages_synthetic.jsonl"

# Load .env if present
load_dotenv(PROJECT_ROOT / ".env")


class Config:
    """Application configuration."""

    PROJECT_ROOT: Path = PROJECT_ROOT
    DATA_DIR: Path = DATA_DIR
    CORPUS_DIR: Path = CORPUS_DIR
    MANIFEST_PATH: Path = MANIFEST_PATH
    INDEX_DIR: Path = INDEX_DIR
    PRECOMPUTED_CLUSTERS_PATH: Path = PRECOMPUTED_CLUSTERS_PATH
    SYNTHETIC_MESSAGES_PATH: Path = SYNTHETIC_MESSAGES_PATH

    # LLM settings (Open-weight model served via OpenAI-compatible endpoint)
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "http://localhost:11434/v1")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "qwen2.5:7b-instruct")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "ollama")
    LLM_TIMEOUT: float = float(os.getenv("LLM_TIMEOUT", "60.0"))
    ADMIN_API_TOKEN: str = os.getenv("SAFECLAIM_ADMIN_TOKEN", "")
    WHATSAPP_WEBHOOK_TOKEN: str = os.getenv("SAFECLAIM_WEBHOOK_TOKEN", "")

    # Retrieval & Grounding Thresholds
    # Queries below this similarity threshold trigger abstention (NO_OFFICIAL_SOURCE_FOUND)
    RETRIEVAL_SIMILARITY_THRESHOLD: float = float(
        os.getenv("RETRIEVAL_SIMILARITY_THRESHOLD", "0.11")
    )
    RETRIEVAL_TOP_K: int = int(os.getenv("RETRIEVAL_TOP_K", "4"))

    # Clustering Thresholds
    # Max cosine distance to merge into an existing cluster centroid
    CLUSTERING_DISTANCE_THRESHOLD: float = float(
        os.getenv("CLUSTERING_DISTANCE_THRESHOLD", "0.25")
    )

    # API Server settings
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:3000,http://localhost:5173"
        ).split(",")
        if origin.strip()
    ]


config = Config()
