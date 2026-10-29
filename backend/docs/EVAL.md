# SafeClaim System Evaluation & Benchmark Report

This document records measured evaluation metrics for SafeClaim's offline semantic retrieval engine and rumour verdict classification pipeline.

To run the complete evaluation suite:
```bash
PYTHONPATH=. python -m eval.run_eval
```

---

## 1. Semantic Retrieval Benchmark (`eval/questions.jsonl`)

Evaluated against **40 balanced Q&A test cases** spanning the four official Nigerian domains and out-of-corpus queries:
- 10 Health Outbreak queries (NCDC Ebola advisory)
- 10 Consumer Scam queries (FCCPC predatory loan apps & defamatory recovery)
- 10 Social Benefit queries (NASSP conditional cash transfer guidelines)
- 5 Election Procedure queries (INEC BVAS accreditation & voting hours)
- 5 Unsupported / Out-of-Corpus queries (Baking recipes, general geography, cryptocurrency arbitrage)

### Retrieval Metrics Table

| Metric | Result | Target Benchmark | Status |
| :--- | :---: | :---: | :---: |
| **Total Test Cases** | 40 | 40 | Complete |
| **Top-4 Document Hit Rate (Hit@4)** | **100.0%** (35/35) | $\ge 90\%$ | Exceeded |
| **Surfaced Relevant Hit Rate (Threshold Gated)** | **97.14%** (34/35) | $\ge 85\%$ | Exceeded |
| **Relevant False Negatives (Over-Abstention)** | **2.86%** (1/35) | $\le 15\%$ | Met |
| **Unsupported Retrieval Rate (False Positives)** | **0.0%** (0/5) | $0.0\%$ | Perfect |

### Analysis & Observations
1. **Zero False Positives:** Every out-of-corpus query cleanly scored below the similarity threshold (`top_score < 0.10`), triggering safe abstention without hallucinating connections.
2. **High Recall with Strict Abstention:** At raw cosine similarity threshold `0.10`, 34 out of 35 in-domain queries were retrieved and surfaced with authoritative citations and emergency helplines.

---

## 2. Rumour Verdict & Guidance Gap Benchmark (`eval/rumours.jsonl`)

Evaluated against **30 labelled rumours** collected from WhatsApp forwards, viral X posts, and citizen reports:
- 10 Contradicted by Official Source (`CONTRADICTED_BY_OFFICIAL_SOURCE`)
- 10 Supported by Official Source (`SUPPORTED_BY_OFFICIAL_SOURCE`)
- 10 No Official Source Found / Guidance Gaps (`NO_OFFICIAL_SOURCE_FOUND`)

### Overall Performance

| Metric | Measured Value |
| :--- | :---: |
| **Total Rumour Cases** | 30 |
| **Overall Classification Accuracy** | **83.33%** |
| **Macro F1-Score** | **82.94%** |

### Confusion Matrix

| True Label \ Predicted | CONTRADICTED | SUPPORTED | NO_OFFICIAL_SOURCE_FOUND | Total |
| :--- | :---: | :---: | :---: | :---: |
| **CONTRADICTED_BY_OFFICIAL_SOURCE** | **8** | 0 | 2 | 10 |
| **SUPPORTED_BY_OFFICIAL_SOURCE** | 0 | **10** | 0 | 10 |
| **NO_OFFICIAL_SOURCE_FOUND** | 1 | 2 | **7** | 10 |

### Per-Class Detailed Metrics

| Verdict Category | Precision | Recall | F1-Score | Support |
| :--- | :---: | :---: | :---: | :---: |
| **CONTRADICTED_BY_OFFICIAL_SOURCE** | 88.89% | 80.00% | **0.8421** | 10 |
| **SUPPORTED_BY_OFFICIAL_SOURCE** | 83.33% | 100.00% | **0.9091** | 10 |
| **NO_OFFICIAL_SOURCE_FOUND** (Guidance Gaps) | 77.78% | 70.00% | **0.7369** | 10 |

---

## 3. Key Findings

1. **Perfect Official Corroboration (100% Recall on Supported):**
   When official guidance directly supports a fact (e.g. NCDC hotline 6232, BVAS mandatory accreditation, FCCPC registration whitelists), SafeClaim correctly verifies it 100% of the time.
2. **Guidance Gap Sensitivity:**
   7 out of 10 unverified viral rumours (such as herbal guava remedies for Mpox or unverified NHIA biometric fees) were correctly flagged as guidance gaps for institutional alert.
3. **Safety Guarantee:**
   Zero confirmed official statements were mistakenly classified as contradicted, avoiding false alarmism.