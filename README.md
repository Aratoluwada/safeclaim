# SafeClaim AI — Understand the Claim. Verify the Facts.

> **Grounded public-health, consumer protection, and social benefit verification engine powered by official Nigerian evidence and open-weight intelligence.**

SafeClaim AI provides two connected interfaces:
1. **Ask (Public Grounded Assistant):** A public question-and-answer interface in standard English and Nigerian Pidgin (`pcm`). Users query viral health rumours, predatory digital loan apps, and federal relief grants. The system returns answers strictly grounded in official gazettes (NCDC, FCCPC, NHIA, FMOH, INEC), provides passage citations, and abstains when adequate official evidence is absent.
2. **Rumour Desk (Institutional Dashboard):** An intelligence console for public health analysts, agency communication desks (NCDC, FCCPC), and accredited fact-checkers (Dubawa, Africa Check). Tracks circulating claim clusters, highlights **Guidance Gaps** (viral rumours with zero published official guidance), inspects street phrasing, and produces broadcast-ready daily briefs.

---

## 1. Problem & Context

In Nigeria, viral misinformation regarding public-health emergencies (e.g. Ebola, Mpox, Cholera outbreaks), predatory digital lenders (defamatory contact shaming, illicit data harvesting), and fake federal palliative grants spreads rapidly through WhatsApp voice notes, closed groups, and social media.

Traditional LLMs hallucinate plausible-sounding medical advice or unverified official policies. SafeClaim AI enforces a **strict evidence-grounded architecture**:
- Answers cite specific official passage IDs (e.g. `ncdc#1`, `fccpc#1`).
- Factual claims link directly to authoritative government circulars.
- When no verified government publication exists, the model **abstains** explicitly (`NO_OFFICIAL_SOURCE_FOUND`), refusing to extrapolate or invent confirmation.
- Emergency helplines (such as NCDC Toll-Free `6232` or WhatsApp `+234 809 955 5577`) are surfaced only when verified by official documentation.

---

## 2. Key Architecture & File Structure

```text
/
├── index.html                     # HTML5 entry with synced SEO meta, Plus Jakarta Sans & Inter
├── metadata.json                  # AI Studio applet manifest
├── package.json                   # React 19, Tailwind v4, Lucide React, Express, TSX
├── src/
│   ├── types/
│   │   └── api.ts                 # TypeScript schemas matching API_CONTRACT.md
│   ├── data/
│   │   └── demoData.ts            # Deterministic Nigerian public health & consumer dataset
│   ├── api/
│   │   ├── client.ts              # Typed API client, localStorage config, health checker
│   │   ├── ask.ts                 # askQuestion() supporting Demo & Live modes
│   │   └── rumours.ts             # getRumourStats, getClusters, getDailyBrief, reloadSyntheticDemo
│   ├── utils/
│   │   ├── translations.ts        # English ('en') & Nigerian Pidgin ('pcm') localization
│   │   ├── briefGenerator.ts      # Markdown daily brief compiler & file download utility
│   │   └── briefGenerator.test.ts # Fast-feedback unit tests via node:test & tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx         # Responsive navbar, tab router, language switcher
│   │   │   ├── DisclaimerBanner.tsx # Mandatory official disclaimer banner
│   │   │   ├── SyntheticBanner.tsx  # Rumour Desk synthetic testbed notice & reload button
│   │   │   ├── LanguageSelect.tsx # Accessible en / pcm switcher
│   │   │   ├── VerdictBadge.tsx   # Color-coded badge for 3 official verdict labels
│   │   │   └── BackendModeModal.tsx # Live API settings & open-weight model info
│   │   ├── ask/
│   │   │   ├── QuestionInput.tsx  # Search input & quick starter chips
│   │   │   ├── AnswerCard.tsx     # Answer text with inline clickable [citation] tags
│   │   │   ├── HotlineAlert.tsx   # Verified agency helpline card
│   │   │   ├── SourceCard.tsx     # Expandable accordion with quoted official excerpt
│   │   │   └── AbstentionCard.tsx # Polite fallback for unverified rumours
│   │   └── rumour-desk/
│   │       ├── StatsOverview.tsx  # KPI metric cards (Messages, Contradicted, Gaps, Domains)
│   │       ├── FilterBar.tsx      # Domain & verdict filters, guidance gap toggle, search
│   │       ├── ClusterTable.tsx   # Responsive cluster table & mobile card view
│   │       ├── ClusterDrawer.tsx  # Slide-over inspection drawer with street quotes & suggested reply
│   │       └── DailyBriefModal.tsx# Formatted Markdown brief reader & .md file downloader
│   ├── pages/
│   │   ├── AskPage.tsx            # Public verification interface
│   │   └── RumourDeskPage.tsx     # Institutional intelligence dashboard
│   ├── App.tsx                    # Main app shell & router
│   ├── main.tsx                   # React root entry
│   └── index.css                  # Tailwind CSS v4 directives
```

---

## 3. Demo Mode vs. Live Mode

SafeClaim AI provides two explicit, user-switchable operating modes:

### Demo Mode (Active by default)
- Operates entirely client-side without requiring a running backend container.
- Uses curated, deterministic benchmark data for realistic Nigerian claims:
  - **Outbreak:** Ebola rumour in Lagos (Refuted by NCDC advisory), Salt water concoctions (Dangerous myth refutation).
  - **Scams:** Predatory loan apps (FCCPC registered lender whitelist), Fake N50k WhatsApp palliative grant (Phishing vector).
  - **Benefits:** NHIA mandatory registration guidelines.
  - **Guidance Gaps:** Unverified guava leaf concoctions for Mpox rashes (+74% 24h velocity, zero official advice).
- Clearly labelled with synthetic warning banners.
- Provides functional filtering, cluster inspection, language toggling, and brief exporting.

### Live Mode
- Connects to a companion backend server (e.g. `http://localhost:8000/api/v1` or configured `VITE_API_BASE_URL`).
- Sends actual HTTP requests to:
  - `POST /api/v1/ask`
  - `GET /api/v1/rumours/stats`
  - `GET /api/v1/rumours/clusters`
  - `GET /api/v1/rumours/brief`
  - `GET /api/v1/rumours/brief/download`
- **Integrity Rule:** If the backend is unreachable or returns an error, SafeClaim displays a clear diagnostic error and never silently falls back to synthetic data pretending to be live.

---

## 4. Open-Weight Model & Grounding Strategy

The application is architected to interface with an open-weight model deployed by the backend teammate:
- **Selected Model Candidates:** Mistral-7B-Instruct-v0.3 or Gemma-2-9B-IT (quantized 4-bit / 8-bit via vLLM or Hugging Face Text Generation Inference).
- **Selection Rationale:** Permissive open-source licensing (Apache 2.0 / Gemma Open Terms), strong instruction-following for structured JSON extraction, and high context-window capacity for injecting official government passages.
- **Retrieval Grounding:** Scraped corpus of gazettes and circulars from NCDC (`ncdc.gov.ng`), FCCPC (`fccpc.gov.ng`), NHIA (`nhia.gov.ng`), and INEC (`inecnigeria.org`).
- **Abstention Threshold:** Cosine similarity gate < 0.72 triggers prompt-level abstention (`NO_OFFICIAL_SOURCE_FOUND`), ensuring model never hallucinates official government policy.

---

## 5. Official Verdict Labels

The UI strictly adheres to the 3 official verdict labels:
1. `CONTRADICTED_BY_OFFICIAL_SOURCE` (Carmine Red): The claim is refuted by official advisories.
2. `SUPPORTED_BY_OFFICIAL_SOURCE` (Emerald Green): The claim matches official published regulations or gazettes.
3. `NO_OFFICIAL_SOURCE_FOUND` (Amber): No official source exists in the verified database. (Treated as a Guidance Gap when message volume is viral).

---

## 6. Testing & Quality Assurance

SafeClaim includes automated unit tests for pure logic:
```bash
# Run unit tests using tsx and node:test runner
npx --yes tsx --test src/utils/briefGenerator.test.ts
```

To compile and verify TypeScript types:
```bash
npm run lint
npm run build
```

---

## 7. Outstanding Integration Items for Backend Teammate

1. **CORS:** Ensure the backend at `http://localhost:8000` allows CORS requests from the frontend origin (`http://localhost:3000`).
2. **Streaming Support (Optional):** If token streaming is supported on `POST /ask`, provide SSE (Server-Sent Events) endpoint.
3. **Cluster Embedding Threshold:** Confirm distance metric used for grouping citizen queries into claim clusters.
