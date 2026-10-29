# SafeClaim Frontend Architecture & Implementation Spec

**Target Tech Stack:** React 18+ (Next.js App Router OR Vite + React), TypeScript, Tailwind CSS, Lucide React (Icons).  
**Companion Backend Contract:** [`docs/API_CONTRACT.md`](file:///home/danchi/Documents/code/sac/docs/API_CONTRACT.md) (v1.1.0)

---

## 1. Product Vision & User Personas

SafeClaim has two distinct user interfaces:
1. **Ask (Public Grounded Chat):** For everyday Nigerians seeking direct answers to health outbreaks, loan app scams, and benefit schemes. Needs to feel clear, lightning-fast, and trustworthy, with Pidgin and English support.
2. **Rumour Desk (Agency & Fact-Checker Dashboard):** For the NCDC, FCCPC, fact-checking desks (e.g. Dubawa, Africa Check), and health NGOs. Analyzes circulating claims, tracks guidance gaps, and outputs broadcast-ready briefs.

---

## 2. Recommended Frontend Project Structure

```text
safeclaim-frontend/
├── public/
│   ├── favicon.ico
│   └── logos/
├── src/
│   ├── api/
│   │   ├── client.ts             # Typed fetch wrapper with RFC 7807 error handling
│   │   ├── ask.ts                # POST /api/v1/ask
│   │   └── rumours.ts            # GET & POST /api/v1/rumours/* (with polling support)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx        # Top nav with page tabs, language switcher, demo banner
│   │   │   ├── DisclaimerBanner.tsx # Mandatory official guidance disclaimer
│   │   │   ├── LanguageSelect.tsx# en / pcm dropdown (reflects verification status)
│   │   │   └── VerdictBadge.tsx  # Color-coded badge for 3 official verdict labels
│   │   ├── ask/
│   │   │   ├── QuestionInput.tsx # Search input + quick prompt chips (max 500 chars)
│   │   │   ├── GroundingScore.tsx# Visual badge showing top_score vs threshold
│   │   │   ├── AnswerCard.tsx    # Formatted answer text with inline citation tags
│   │   │   ├── HotlineAlert.tsx  # Prominent callout for emergency hotlines (e.g. 6232)
│   │   │   ├── SourceCard.tsx    # Expandable card showing official passage, doc title, URL
│   │   │   └── AbstentionCard.tsx# "Not found in indexed corpus" fallback card
│   │   └── rumour-desk/
│   │       ├── StatsOverview.tsx # Metrics: Total messages, Contradicted, Guidance Gaps
│   │       ├── FilterBar.tsx     # Domain filter + Verdict filter + Guidance Gap toggle
│   │       ├── ClusterTable.tsx  # Sortable table/grid of circulating claim clusters
│   │       ├── ClusterDrawer.tsx # Slide-over modal with raw messages, evidence & suggested reply
│   │       ├── RecomputeProgress.tsx # Progress bar for background re-clustering job
│   │       └── DailyBriefModal.tsx # Formatted Markdown reader + Download .md button
│   ├── types/
│   │   └── api.ts                # TypeScript interfaces (matching Backend schemas)
│   ├── pages/ (or app/)
│   │   ├── AskPage.tsx           # Route: / or /ask
│   │   └── RumourDeskPage.tsx    # Route: /desk or /rumours
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
└── package.json
```

---

## 3. TypeScript Type Definitions (`src/types/api.ts`)

```typescript
export type LanguageCode = 'en' | 'pcm';
export type VerificationStatus = 'pending_human_check' | 'verified' | 'failed_check';

export type DomainType = 
  | 'outbreak' 
  | 'scam' 
  | 'benefit' 
  | 'election_procedure' 
  | 'other';

export type VerdictLabel = 
  | 'CONTRADICTED_BY_OFFICIAL_SOURCE' 
  | 'SUPPORTED_BY_OFFICIAL_SOURCE' 
  | 'NO_OFFICIAL_SOURCE_FOUND';

export interface Citation {
  passage_id: string;
  doc_title: string;
  publisher: string;
  url: string;
  domain: DomainType;
  excerpt: string;
}

export interface HotlineInfo {
  name: string;
  number: string;
  alt_number?: string | null;
  source_doc_id: string;
}

export interface RetrievalMeta {
  top_score: number;
  threshold: number;
  passages_evaluated: number;
}

export interface AskResponse {
  question: string;
  language: LanguageCode;
  grounded: boolean;
  abstention_reason: string | null;
  retrieval: RetrievalMeta;
  answer: string;
  hotline_info: HotlineInfo | null;
  citations: Citation[];
}

export interface ClusterVerdict {
  label: VerdictLabel;
  short_explanation: string;
  suggested_reply: string | null;
  evidence_passage_ids?: string[];
  evidence_passages?: Citation[];
}

export interface ClaimCluster {
  cluster_id: string;
  domain: DomainType;
  representative_claim: string;
  verdict: ClusterVerdict;
  message_count: number;
  languages_seen: LanguageCode[];
  first_seen: string;
  last_seen: string;
  sample_messages: string[];
  is_guidance_gap: boolean;
}

export interface RumourStats {
  total_messages_analyzed: number;
  total_clusters: number;
  source_distribution: {
    synthetic: number;
    submitted: number;
  };
  verdict_counts: Record<VerdictLabel, number>;
  guidance_gaps_count: number;
  domains: Record<string, number>;
}

export interface DailyBrief {
  date: string;
  title: string;
  total_clusters: number;
  guidance_gaps: Array<{
    cluster_id: string;
    domain: DomainType;
    representative_claim: string;
    message_count: number;
    suggested_action: string;
  }>;
  markdown: string;
}

export interface RecomputeJobStatus {
  job_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress_pct?: number;
  stage?: string;
  duration_seconds?: number;
  total_clusters_generated?: number;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}
```

---

## 4. UI/UX Specifications by Page

### Page 1: Ask (Public Grounded Search / Chat)

#### Mandatory Banner (Top of page):
> **"SafeClaim answers strictly from official government sources and advisories. It is not medical or legal advice."**

#### UI Elements:
1. **Header & Language Selector:**
   - Dropdown showing English and Pidgin. Show a subtle badge next to Pidgin (`Pending human verification` if not yet confirmed by the team's language check).
2. **Search Input & Quick Starter Prompts:**
   - Text input capped at 500 characters.
   - Quick Starter Chips:
     - 🩺 *"What is the official advice if someone has high fever and bleeding?"*
     - 📱 *"How do I check if a loan app is registered by FCCPC?"*
     - 🏥 *"How to register for the National Health Insurance Authority?"*
     - 💧 *"Does drinking salt water prevent virus infection?"*
3. **Retrieval Confidence Badge (High Value for Judges):**
   - Renders a pill badge showing: `Retrieval Match: 0.84 (Threshold: 0.65) ✓ Grounded`
   - In abstention cases: `Retrieval Match: 0.42 (Threshold: 0.65) ⚠ Below Threshold`
4. **Answer Display:**
   - **Grounded State:**
     - Plain language response with clickable inline badges (`[ncdc#2]`).
     - **Hotline Callout:** Highlight emergency hotlines (e.g., NCDC Toll-Free 6232) loaded from the source document.
     - **Expandable Citations:** Source cards with Publisher, Document Title, URL, and exact quote excerpt.
   - **Abstention State:**
     - Clean card explaining: *"No official government source in our indexed corpus confirms or addresses this topic."* (Includes hotline citation if applicable).

---

### Page 2: Rumour Desk (Institutional Dashboard)

#### Mandatory Banner:
> **"Synthetic Demo Dataset Active — Prepared for OSCA OPEN//BUILD 2026."**

#### UI Elements:
1. **Top Metric Cards (KPI Bar):**
   - 📊 **Messages Analyzed:** e.g., `184`
   - ⚠️ **Contradicted by Guidance:** Red badge count
   - 🔍 **Guidance Gaps:** Amber badge count ("Viral claims with no official corpus document")
   - 📁 **Domain Breakdown:** Outbreak, Scam, Benefits
2. **Action Toolbar:**
   - **Domain & Verdict Filter dropdowns.**
   - **"Guidance Gaps Only" toggle switch.**
   - **"Load Demo Data" button:** Calls `POST /rumours/load-synthetic` which loads precomputed fixtures in `<50ms` (safe for stage presentation).
   - **"Trigger Live Recomputation" button:** Calls `POST /rumours/recompute`, returns `202 Accepted`, and displays a progress bar polling `GET /rumours/jobs/{job_id}`.
3. **Cluster Explorer Table / Grid:**
   - Columns: Size, Domain, Representative Claim, Verdict Badge.
   - **Verdict Badges:**
     - `CONTRADICTED_BY_OFFICIAL_SOURCE` -> **Red** ("Refuted by Official Source")
     - `SUPPORTED_BY_OFFICIAL_SOURCE` -> **Green** ("Matches Official Source")
     - `NO_OFFICIAL_SOURCE_FOUND` -> **Amber** ("Not Found in Indexed Corpus")
4. **Cluster Inspection Drawer (Slide-Over):**
   - Displays 3 authentic synthetic street messages in Pidgin/English.
   - Displays verified evidence quotes from the official corpus.
   - **Suggested Broadcast Response:** One-click copyable message for public release (only when official guidance exists).
5. **Daily Intelligence Brief Modal:**
   - Formatted Markdown viewer with top clusters and prioritized guidance gaps.
   - **"Download Brief (.md)"** button.

---

## 5. API Client Implementation Template (`src/api/client.ts`)

```typescript
import { AskResponse, ClaimCluster, DailyBrief, ProblemDetails, RecomputeJobStatus, RumourStats } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorJson: ProblemDetails = await res.json().catch(() => ({
      type: 'about:blank',
      title: 'Unknown Error',
      status: res.status,
      detail: res.statusText,
    }));
    throw errorJson;
  }
  return res.json();
}

export async function askQuestion(question: string, language: string = 'en'): Promise<AskResponse> {
  const res = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: question.slice(0, 500), language }),
  });
  return handleResponse<AskResponse>(res);
}

export async function getRumourStats(): Promise<RumourStats> {
  const res = await fetch(`${API_BASE_URL}/rumours/stats`);
  return handleResponse<RumourStats>(res);
}

export async function getClusters(params?: { domain?: string; label?: string; guidance_gap_only?: boolean }): Promise<{ clusters: ClaimCluster[] }> {
  const query = new URLSearchParams();
  if (params?.domain) query.set('domain', params.domain);
  if (params?.label) query.set('label', params.label);
  if (params?.guidance_gap_only) query.set('guidance_gap_only', 'true');

  const res = await fetch(`${API_BASE_URL}/rumours/clusters?${query.toString()}`);
  return handleResponse<{ clusters: ClaimCluster[] }>(res);
}

export async function loadSyntheticDemo(): Promise<{ status: string; load_time_seconds: number }> {
  const res = await fetch(`${API_BASE_URL}/rumours/load-synthetic`, { method: 'POST' });
  return handleResponse(res);
}

export async function triggerRecompute(): Promise<{ job_id: string; status: string; estimated_duration_seconds: number }> {
  const res = await fetch(`${API_BASE_URL}/rumours/recompute`, { method: 'POST' });
  return handleResponse(res);
}

export async function pollJobStatus(jobId: string): Promise<RecomputeJobStatus> {
  const res = await fetch(`${API_BASE_URL}/rumours/jobs/${jobId}`);
  return handleResponse<RecomputeJobStatus>(res);
}

export async function getDailyBrief(): Promise<DailyBrief> {
  const res = await fetch(`${API_BASE_URL}/rumours/brief`);
  return handleResponse<DailyBrief>(res);
}
```
