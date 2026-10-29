"""
SafeClaim Claim Extraction and Ingestion Module.
Sanitizes raw incoming messages (WhatsApp forwards, X posts, web submissions),
extracts core factual assertions, and tags domain taxonomy.
"""

from dataclasses import asdict, dataclass
import re
from typing import Any, Dict, List, Literal, Optional

DomainType = Literal["outbreak", "scam", "benefit", "election_procedure", "other"]
SourceType = Literal["whatsapp_forward", "x_post", "web_submission", "synthetic"]


@dataclass
class RawMessage:
    message_id: str
    raw_text: str
    source_type: SourceType
    language: str
    timestamp: str


@dataclass
class ExtractedClaim:
    claim_id: str
    message_id: str
    normalized_claim: str
    domain: DomainType
    source_type: SourceType
    language: str
    raw_excerpt: str


def sanitize_input_text(text: str) -> str:
    """Hard Rule 7: Sanitizes input and caps length at 500 characters."""
    cleaned = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned[:500]


def classify_domain(text: str) -> DomainType:
    """Heuristic keyword domain classifier for rapid offline routing."""
    lower = text.lower()

    if any(k in lower for k in ["ebola", "virus", "outbreak", "symptom", "fever", "bleeding", "vomit", "ncdc", "doctor", "hospital", "bath"]):
        return "outbreak"
    if any(k in lower for k in ["loan", "borrow", "debt", "lender", "defam", "contacts", "interest", "fccpc", "apk", "repay"]):
        return "scam"
    if any(k in lower for k in ["grant", "palliative", "cash transfer", "welfare", "bvn", "nin", "nassp", "50,000", "50000", "register"]):
        return "benefit"
    if any(k in lower for k in ["vote", "voting", "election", "bvas", "pvc", "ballot", "inec", "polling", "accreditation"]):
        return "election_procedure"

    return "other"


def extract_claim_from_message(
    message: RawMessage,
) -> ExtractedClaim:
    """
    Extracts normalized core claim from a raw message.
    Strips noise like WhatsApp forwarding headers or tweet hashtags.
    """
    sanitized = sanitize_input_text(message.raw_text)

    # Clean typical WhatsApp forward artifacts
    cleaned = re.sub(r"^\[.*?\]\s*", "", sanitized)
    cleaned = re.sub(r"^(?:Forwarded|FWD|URGENT|BREAKING NEWS|ALERT):\s*", "", cleaned, flags=re.IGNORECASE)

    # Remove URL shorteners or query params from representative claim text
    cleaned_no_url = re.sub(r"https?://\S+", "[link]", cleaned).strip()

    domain = classify_domain(cleaned)

    return ExtractedClaim(
        claim_id=f"clm_{message.message_id}",
        message_id=message.message_id,
        normalized_claim=cleaned_no_url if cleaned_no_url else sanitized,
        domain=domain,
        source_type=message.source_type,
        language=message.language,
        raw_excerpt=sanitized[:180],
    )
