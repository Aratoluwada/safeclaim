# SafeClaim Architecture Decision Records (ADRs)

This document records the key architectural choices, trade-offs, and compliance rationales made during the development of SafeClaim AI.

---

### ADR-001: Offline-First Hybrid Retrieval over Heavy Dense GPU Embeddings

* **Context:** SafeClaim is built for public health crises, consumer fraud, and election procedures in Nigeria, where infrastructure constraints, offline deployability, and zero cloud vendor lock-in are essential.
* **Decision:** Implement an offline-first TF-IDF vector space model with n-grams and calibrated cosine scoring using `scikit-learn` and `numpy`.
* **Rationale:**
  1. Dense neural embedding models (e.g., `bge-m3`, `openai-text-embedding-3`) require continuous GPU VRAM or paid cloud APIs with rate limits and network latency.
  2. TF-IDF indexes in milliseconds, runs 100% offline on any standard CPU, and perfectly preserves exact critical strings (toll-free hotline `6232`, legal statutes, phone numbers).
  3. Calibrated score mapping allows the system to satisfy the standard `0.65` threshold contract transparently.
* **Status:** Accepted.

---

### ADR-002: Strict 3-Label Verdict Taxonomy over Percentage Credibility Scores

* **Context:** Many fact-checking tools output ambiguous confidence percentages (e.g. *"73% True"*). In public health and law, ambiguity leads to dangerous self-medication or confusion.
* **Decision:** Restrict all verdicts to exactly three mutually exclusive labels:
  - `CONTRADICTED_BY_OFFICIAL_SOURCE`
  - `SUPPORTED_BY_OFFICIAL_SOURCE`
  - `NO_OFFICIAL_SOURCE_FOUND`
* **Rationale:**
  1. Prevents models from expressing false certainty about unindexed facts.
  2. The `NO_OFFICIAL_SOURCE_FOUND` verdict clearly states that no guidance exists in the official corpus without implying guilt or validity, effectively highlighting **Guidance Gaps**.
* **Status:** Accepted.

---

### ADR-003: WhatsApp Receipts (`wa.me/?text=...`) and Native Webhook

* **Context:** In Nigeria, the overwhelming majority of viral misinformation originates and circulates in closed WhatsApp groups (family, church, trade associations) rather than public web forums.
* **Decision:**
  1. Build a one-click WhatsApp receipt generator (`https://wa.me/?text=...`) directly into the frontend modal, producing bold, emoji-tagged, citation-backed counter-receipts.
  2. Implement an incoming webhook endpoint (`POST /api/v1/whatsapp/webhook`) in FastAPI that can receive messages from Twilio or Meta WhatsApp Cloud API and return formatted verification cards.
* **Rationale:** Brings authoritative official receipts directly to the medium where the rumour is circulating, empowering citizens to debunk claims with receipts in seconds.
* **Status:** Accepted.

---

### ADR-004: Precomputed Demo Fixtures with Explicit Synthetic Tagging

* **Context:** SafeClaim requires demonstrating claim clustering across hundreds of messages, but live scraping of real social posts risks leaking Personally Identifiable Information (PII) or defaming real lending businesses.
* **Decision:** Maintain a curated, deterministic benchmark fixture in `data/precomputed_clusters.json`, with synthetic messages explicitly flagged with `source_type: "synthetic"` and fictionalized app names.
* **Rationale:**
  1. Guarantees instantaneous boot times during evaluations and demonstrations without waiting for background clustering inference.
  2. Complies with Hackathon Hard Rule 6 (Zero PII, no defamation of real entities).
* **Status:** Accepted.

---

### ADR-005: Decoupled Architecture (Backend in `safeclaims/`, Frontend in `safeclaim/`)

* **Context:** The frontend teammate requires a self-contained React applet that can run independently in Demo Mode while seamlessly connecting to the FastAPI server in Live Mode.
* **Decision:** Maintain the Python backend package in `safeclaims/` and the React frontend in `safeclaim/`, sharing typed API contracts via `API_CONTRACT.md`.
* **Rationale:** Enables independent development, testing, and deployment of both client and server components without dependency entanglement.
* **Status:** Accepted.
