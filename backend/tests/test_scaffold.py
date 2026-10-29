"""
Smoke test for SafeClaim configuration and LLM module.
"""

from safeclaims.config import config
from safeclaims.llm import LLMClient


def test_config_defaults():
    assert config.RETRIEVAL_SIMILARITY_THRESHOLD == 0.11
    assert config.RETRIEVAL_TOP_K == 4
    assert config.CLUSTERING_DISTANCE_THRESHOLD == 0.25
    assert "http://localhost:3000" in config.CORS_ORIGINS


def test_llm_client_initialization():
    client = LLMClient()
    assert client.base_url.startswith("http")
    assert client.model is not None
