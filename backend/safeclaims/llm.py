"""
SafeClaim LLM Module.
Provides a clean, uniform interface to any OpenAI-compatible endpoint serving open-weight models.
Supports local Ollama, vLLM, or hosted inference providers (Groq, Together, OpenRouter).
"""

import json
from typing import Any, Dict, List, Optional
import httpx

from safeclaims.config import config


class LLMError(Exception):
    """Base exception for LLM provider errors."""
    pass


class LLMClient:
    """Synchronous and asynchronous client for OpenAI-compatible chat endpoints."""

    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        api_key: Optional[str] = None,
        timeout: Optional[float] = None,
    ):
        self.base_url = (base_url or config.LLM_BASE_URL).rstrip("/")
        self.model = model or config.LLM_MODEL
        self.api_key = api_key or config.LLM_API_KEY
        self.timeout = timeout or config.LLM_TIMEOUT

    def _get_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    def chat_complete(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.1,
        max_tokens: int = 1000,
        response_format: Optional[Dict[str, str]] = None,
    ) -> str:
        """
        Calls the /chat/completions endpoint synchronously.
        temperature=0.1 ensures strict, deterministic adherence to context.
        """
        url = f"{self.base_url}/chat/completions"
        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if response_format:
            payload["response_format"] = response_format

        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.post(url, headers=self._get_headers(), json=payload)
                if response.status_code != 200:
                    raise LLMError(
                        f"LLM endpoint returned status {response.status_code}: {response.text}"
                    )
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except httpx.ConnectError as e:
            raise LLMError(
                f"Could not connect to LLM endpoint at {self.base_url}. "
                "Ensure Ollama or your inference server is running."
            ) from e
        except Exception as e:
            raise LLMError(f"LLM generation failed: {str(e)}") from e

    def chat_complete_json(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.1,
        max_tokens: int = 1000,
    ) -> Dict[str, Any]:
        """
        Calls the model and parses the output as JSON.
        Handles cases where models wrap JSON in markdown code fences.
        """
        raw_text = self.chat_complete(
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            response_format={"type": "json_object"},
        )
        cleaned = raw_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[len("```json"):].strip()
        if cleaned.startswith("```"):
            cleaned = cleaned[len("```"):].strip()
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3].strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            raise LLMError(
                f"Failed to parse LLM response as JSON. Raw output was: {raw_text}"
            ) from e

    def check_health(self) -> Dict[str, Any]:
        """
        Checks if the LLM service is reachable.
        """
        url = f"{self.base_url}/models"
        try:
            with httpx.Client(timeout=5.0) as client:
                response = client.get(url, headers=self._get_headers())
                if response.status_code == 200:
                    return {
                        "status": "connected",
                        "base_url": self.base_url,
                        "model": self.model,
                    }
                return {
                    "status": "error",
                    "http_status": response.status_code,
                    "detail": response.text,
                }
        except Exception as e:
            return {
                "status": "unreachable",
                "base_url": self.base_url,
                "error": str(e),
            }


# Global singleton instance
llm_client = LLMClient()


# -------------------------------------------------------------
# Meaningful Open-Weight Model Workflows (Qwen 2.5 7B Instruct)
# -------------------------------------------------------------

def normalize_claim_with_llm(raw_text: str) -> Dict[str, Any]:
    """
    Uses Qwen 2.5 7B Instruct to extract a clean factual proposition and domain
    from noisy WhatsApp forwards, voice note transcripts, or social posts.
    """
    system_prompt = (
        "You are an AI fact-checking assistant for SafeClaim Nigeria. "
        "Your task is to analyze incoming citizen messages (which may contain slang, WhatsApp forwarding artifacts, "
        "or Nigerian Pidgin) and extract the core factual claim being asserted.\n"
        "Output ONLY a valid JSON object with keys:\n"
        "- claim: A clear, objective 1-2 sentence statement of the factual claim.\n"
        "- domain: One of ['outbreak', 'scam', 'benefit', 'election_procedure', 'other'].\n"
        "- urgency: One of ['low', 'medium', 'high', 'critical'].\n"
        "Never add commentary or markdown codeblocks outside JSON."
    )
    user_prompt = f"<user_message>{raw_text[:500]}</user_message>"
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    return llm_client.chat_complete_json(messages, temperature=0.1)


def verify_claim_with_llm(
    claim_text: str,
    domain: str,
    evidence_passages: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Uses Qwen 2.5 7B Instruct for Natural Language Inference (NLI) against official circulars.
    Evaluates whether official evidence CONTRADICTS, SUPPORTS, or does not address the claim.
    """
    evidence_context = "\n\n".join(
        f"[{p.get('passage_id', 'doc')}] ({p.get('publisher', 'Official Agency')} - {p.get('doc_title', '')}):\n"
        f"{p.get('excerpt', p.get('text', ''))}"
        for p in evidence_passages
    )

    system_prompt = (
        "You are SafeClaim's grounded fact-checking verification engine. "
        "You evaluate circulating public claims strictly against provided official government circulars.\n"
        "RULES:\n"
        "1. If official evidence explicitly refutes the claim, verdict is CONTRADICTED_BY_OFFICIAL_SOURCE.\n"
        "2. If official evidence directly confirms the claim, verdict is SUPPORTED_BY_OFFICIAL_SOURCE.\n"
        "3. If evidence does not mention or confirm the claim, verdict is NO_OFFICIAL_SOURCE_FOUND.\n"
        "4. You must provide a concise explanation citing the exact passage.\n"
        "Output ONLY JSON with keys: verdict, explanation, cited_passage_ids."
    )
    user_prompt = (
        f"CLAIM TO VERIFY: \"{claim_text}\"\n"
        f"DOMAIN: {domain}\n\n"
        f"OFFICIAL EVIDENCE CHUNKS:\n{evidence_context}"
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    return llm_client.chat_complete_json(messages, temperature=0.1)


def generate_pidgin_receipt_with_llm(
    claim_text: str,
    verdict: str,
    evidence_summary: str,
    hotline: str = "6232",
) -> str:
    """
    Uses Qwen 2.5 7B Instruct to generate a culturally-adapted WhatsApp debunk receipt
    in authentic, empathetic Nigerian Pidgin that citizens can forward directly.
    """
    system_prompt = (
        "You are a helpful, trusted Nigerian community health and consumer advocate on WhatsApp. "
        "Translate the following fact-check finding into authentic, easy-to-read Nigerian Pidgin. "
        "Keep it under 300 characters, use emojis appropriately, and include the official helpline. "
        "Do not be rude or condescending."
    )
    user_prompt = (
        f"Claim: {claim_text}\n"
        f"Verdict: {verdict}\n"
        f"Evidence: {evidence_summary}\n"
        f"Helpline: {hotline}"
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    return llm_client.chat_complete(messages, temperature=0.3, max_tokens=200)

