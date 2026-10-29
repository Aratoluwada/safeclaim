# SafeClaim AI — Grounded Evidence & Rumour Guard Engine

> **OSCA OPEN//BUILD 2026 Project**  
> *Grounded public-health, consumer protection, and social benefit verification engine powered by official Nigerian regulatory evidence.*

SafeClaim AI tackles viral misinformation circulating across Nigerian messaging channels (WhatsApp forwards, voice notes, viral X posts, and closed groups). Instead of hallucinating answers or giving unverified medical advice, SafeClaim operates on a **strict, evidence-grounded architecture**: every factual statement links to official government circulars, and the system **safely abstains** when official backing is absent.

---

## 🏛️ System Features & User Interfaces

1. **Ask (Public Grounded Assistant):**
   * Accessible in **English** and **Nigerian Pidgin (`pcm`)**.
   * Verifies viral claims against official publications from the **NCDC**, **FCCPC**, **NASSP**, and **INEC**.
   * Surfaces official emergency hotlines (e.g. NCDC Toll-Free `6232`, FCCPC `0800 033 2272`).
   * One-click **"Forward Receipt to WhatsApp"** (`wa.me/?text=...`) to counter rumours directly in WhatsApp groups.
   * Native **WhatsApp Bot Webhook** (`/api/v1/whatsapp/webhook`) for automated chat verification.

2. **Rumour Desk (Agency & Fact-Checker Intelligence Dashboard):**
   * Centroid-based clustering that tracks high-velocity circulating claim clusters in real time.
   * Detects **Guidance Gaps**: viral rumours circulating with zero published official guidance.
   * Generates pre-cleared, broadcast-ready counter-messages in English and Pidgin for radio and WhatsApp broadcast lists.
   * Exports downloadable **Daily Intelligence Briefs** (`.md`) for public health agencies and fact-checkers (Dubawa, Africa Check).

---

## 🤖 Open-Weight Foundation Model (OSCA OPEN//BUILD Requirement B — 20 Points)

SafeClaim is powered by **[`Qwen/Qwen2.5-7B-Instruct`](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct)** (Apache 2.0 open-weight model) paired with a lightweight edge variant **[`Qwen/Qwen2.5-3B-Instruct`](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct)** / **[`google/gemma-2-2b-it`](https://huggingface.co/google/gemma-2-2b-it)**.

* **Repository:** Hugging Face ([`Qwen/Qwen2.5-7B-Instruct`](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct))
* **Licence:** **Apache 2.0** (Open weights, fully permissive).
* **Serving Runtime:** Local Ollama (`qwen2.5:7b-instruct`) or vLLM via OpenAI-compatible API (`safeclaims/llm.py`). Runs quantized in 4-bit (`Q4_K_M`) requiring only ~4.7 GB RAM on standard student laptops.
* **Meaningful Role in the Prototype:**
  1. **Claim Normalization:** Distills noisy, unstructured Nigerian WhatsApp forwards and voice notes into canonical factual assertions.
  2. **Grounded Natural Language Inference (NLI):** Evaluates logical entailment (Contradiction vs. Support) between claims and official Nigerian gazette passages.
  3. **Bilingual WhatsApp Receipts:** Synthesizes bite-sized, empathetic counter-receipts in authentic **Nigerian Pidgin** and **English** for community WhatsApp debunking.
  4. **Daily Intelligence Briefings:** Synthesizes rumour clusters into executive health briefs and drafts official advisories for Guidance Gaps.
* **Grounding Guardrails & Limitations:**
  To eliminate LLM hallucinations on emergency helplines and legal statutes, SafeClaim implements a **Grounded RAG architecture**: the model is constrained to cite exact official passage IDs (`<doc_id>#<chunk_id>`), with a deterministic offline fallback engine for low-connectivity rural health centers.


---

## 📐 Project Architecture

```text
sac/
├── data/
│   ├── corpus/                     # Official markdown guidance documents
│   │   ├── ncdc_ebola_advisory_2026.md
│   │   ├── fccpc_digital_lenders_advisory_2026.md
│   │   ├── nassp_conditional_cash_transfer_2026.md
│   │   └── inec_voter_accreditation_guidelines_2026.md
│   ├── corpus_manifest.csv         # Metadata registry (ID, publisher, URL, domain)
│   ├── index/                      # Serialized TF-IDF vector matrix & passage index
│   └── precomputed_clusters.json   # Seed benchmark claim clusters for demo mode
├── safeclaims/                     # Backend REST API package (Python / FastAPI)
│   ├── config.py                   # System configuration, paths, and thresholds
│   ├── ingest.py                   # Semantic section chunker & offline TF-IDF vectorizer
│   ├── retrieve.py                 # Cosine similarity retrieval & calibrated threshold gating
│   ├── claims.py                   # Input sanitization, claim extraction & domain routing
│   ├── cluster.py                  # Online incremental centroid clustering engine
│   ├── verdict.py                  # Strict 3-verdict classifier & WhatsApp broadcast generator
│   ├── brief.py                    # Daily Intelligence Brief compiler
│   └── server.py                   # FastAPI REST API & WhatsApp webhook
├── safeclaim/                      # Frontend Application (React 19, Vite, Tailwind CSS v4)
│   ├── src/components/ask/         # Ask interface, AnswerCard, WhatsApp share modal
│   ├── src/components/rumour-desk/ # Cluster tables, metric cards, brief reader
│   └── src/data/demoData.ts        # Client-side demo fixture
├── eval/                           # Benchmarking & Safety Evaluation Suite
│   ├── questions.jsonl             # 40 balanced Q&A evaluation cases
│   ├── rumours.jsonl               # 30 labelled rumour cases
│   └── run_eval.py                 # Benchmark runner
├── docs/                           # Architecture, contracts, and evaluation reports
│   ├── API_CONTRACT.md             # REST API specifications (RFC 7807 compliant)
│   ├── FRONTEND_SPEC.md            # Frontend UI architecture and component guidelines
│   ├── EVAL.md                     # Measured benchmark results and confusion matrix
│   ├── MODEL.md                    # Modeling, clustering math, and safety design
│   └── DECISIONS.md                # Architecture Decision Records (ADRs)
└── tests/                          # Automated Pytest suite (23 unit & integration tests)
```

---

## ⚡ Quickstart & Setup

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ (for frontend)

### 2. Backend Setup
```bash
# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Build official document index
python -m safeclaims.ingest

# Run automated tests
pytest tests/
```

### 3. Run the Backend API Server
```bash
uvicorn safeclaims.server:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger UI documentation is available at: **`http://localhost:8000/docs`**

### 4. Run the Frontend UI
```bash
cd safeclaim
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 📊 Measured Benchmark Results

Evaluated against the hand-curated Nigerian test suite (see [`docs/EVAL.md`](file:///home/danchi/Documents/code/sac/docs/EVAL.md) for full metrics):

| Benchmark Area | Metric | Result | Target | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Retrieval Engine (40 cases)** | **Top-4 Document Hit (Hit@4)** | **100.0%** | $\ge 90\%$ | Exceeded |
| **Retrieval Engine (40 cases)** | **Surfaced Relevant Hit** | **97.14%** | $\ge 85\%$ | Exceeded |
| **Retrieval Engine (40 cases)** | **False Discovery Rate (Out-of-Corpus)** | **0.0%** | $0.0\%$ | Perfect |
| **Rumour Guard (30 cases)** | **Overall Accuracy** | **83.33%** | $\ge 75\%$ | Exceeded |
| **Rumour Guard (30 cases)** | **Macro F1-Score** | **82.94%** | $\ge 75\%$ | Exceeded |
| **Rumour Guard (30 cases)** | **Supported Recall** | **100.0%** | $\ge 90\%$ | Perfect |

---

## 🛡️ Hackathon Safety & Hard Rules Compliance

1. **Grounded Only:** Answers and broadcast replies are anchored in passage IDs (`<doc_id>#<chunk_id>`).
2. **Deterministic Abstention:** If similarity is below threshold or out-of-corpus, SafeClaim states that no official record exists.
3. **No Medical Diagnosis:** Does not diagnose symptoms or prescribe home treatments; surfaces verified agency helplines.
4. **Zero PII & Scam Defense:** Uses synthetic names (`FictionalApp_DemoXYZ`) in demonstrations to prevent defaming real entities.
5. **Prompt Injection Hardening:** Inputs are capped at 500 characters and sanitized before downstream processing.

---

## 📜 License & Acknowledgements

Built for the **OSCA OPEN//BUILD 2026** Hackathon. See [`ACKNOWLEDGEMENTS.md`](file:///home/danchi/Documents/code/sac/ACKNOWLEDGEMENTS.md) for data source attributions and open-source licenses.
