# SafeClaim Frontend Architecture & Implementation Spec

**Target Tech Stack:** React 18+ (Next.js App Router OR Vite + React), TypeScript, Tailwind CSS, Lucide React (Icons).  
**Companion Backend Contract:** [`docs/API_CONTRACT.md`](file:///home/danchi/Documents/code/sac/docs/API_CONTRACT.md)

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
│   │   ├── client.ts             # Typed fetch/axios wrapper pointing to NEXT_PUBLIC_API_URL
│   │   ├── ask.ts                # POST /api/v1/ask
│   │   └── rumours.ts            # GET /api/v1/rumours/*
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx        # Top nav with page tabs, language switcher, demo banner
│   │   │   ├── DisclaimerBanner.tsx # Mandatory official guidance disclaimer
│   │   │   ├── LanguageSelect.tsx# en / pcm dropdown
│   │   │   └── VerdictBadge.tsx  # Color-coded badge for 3 official verdict labels
│   │   ├── ask/
│   │   │   ├── QuestionInput.tsx # Search input + quick prompt chips
│   │   │   ├── AnswerCard.tsx    # Formatted answer text with inline citation tags
│   │   │   ├── HotlineAlert.tsx  # Prominent callout for emergency hotlines (e.g. 6232)
│   │   │   ├── SourceCard.tsx    # Expandable card showing official passage, doc title, URL
│   │   │   └── AbstentionCard.tsx# Polite "No official source found" fallback card
│   │   └── rumour-desk/
│   │       ├── StatsOverview.tsx # Metrics: Total messages, Contradicted, Guidance Gaps
│   │       ├── FilterBar.tsx     # Domain filter + Verdict filter + Guidance Gap toggle
│   │       ├── ClusterTable.tsx  # Sortable table/grid of circulating claim clusters
│   │       ├── ClusterDrawer.tsx # Slide-over modal with raw messages, evidence & suggested reply
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
  alt_number?: string;
  source_doc_id: string;
}

export interface AskResponse {
  question: string;
  language: LanguageCode;
  grounded: boolean;
  abstention_reason: string | null;
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
  growth_rate_24h?: string;
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
  summary: string;
  top_clusters: Array<{
    cluster_id: string;
    domain: DomainType;
    claim: string;
    count: number;
    verdict: VerdictLabel;
  }>;
  guidance_gaps: Array<{
    cluster_id: string;
    domain: DomainType;
    claim: string;
    count: number;
    suggested_action: string;
  }>;
  markdown: string;
}
```

---

## 4. UI/UX Specifications by Page

### Page 1: Ask (Public Grounded Search / Chat)

#### Mandatory Banner (Top of page):
> **"SafeClaim answers strictly from official government sources and advisories. It is not medical or legal advice."**

#### UI Elements:
1. **Header & Language Selector:**
   - Toggle between **English** and **Naijá Pidgin**.
   - When Pidgin is selected, placeholder and helper text should adopt natural Nigerian Pidgin (e.g., *"Ask anything about Ebola alert, loan app wahala, or health insurance..."*).

2. **Search Input & Quick Starter Prompts:**
   - Large search bar with "Verify / Ask" button.
   - Quick Starter Chips:
     - 🩺 *"Is Ebola confirmed in Lagos right now?"*
     - 📱 *"How can I check if a loan app is registered by FCCPC?"*
     - 🏥 *"How do I register for the National Health Insurance Scheme?"*
     - 💧 *"Does drinking salt water prevent Ebola?"*

3. **Response Card:**
   - **Grounded State (Green Tag: "Verified Official Guidance"):**
     - Display model answer. Every factual claim is followed by a clickable badge citation (e.g. `[ncdc#2]`).
     - **Hotline Callout (if present):**
       - Render a high-visibility card: 🚨 **Official Hotline**: Call NCDC Toll-Free on **`6232`** or WhatsApp `08099555577`.
     - **Sources Drawer / Accordion:**
       - Card for each citation containing:
         - Publisher tag (e.g., *Nigeria Centre for Disease Control (NCDC)*)
         - Document Title (clickable link to official gov URL)
         - Exact quoted excerpt from official passage
         - Passage ID tag (`#doc_id#chunk_num`)
   - **Abstention State (Amber Tag: "No Official Source Found"):**
     - Clear explanation: *"No official government publication in our verified database addresses or confirms this claim."*
     - Link to official portals (e.g., NCDC portal, FCCPC portal).
     - Direct emergency hotline reminder.

---

### Page 2: Rumour Desk (Institutional Dashboard)

#### Mandatory Banner:
> **"Synthetic Demo Dataset Active — Prepared for OSCA OPEN//BUILD 2026."**

#### UI Elements:
1. **Top Metric Cards (KPI Bar):**
   - 📊 **Messages Analyzed:** e.g., `184` (Synthetic demo)
   - ⚠️ **Contradicted Rumours:** Count with red accent
   - 🔍 **Guidance Gaps:** Count with amber alert accent ("Viral rumours with zero official guidance")
   - 📁 **Active Domains:** Outbreak, Scam, Benefits breakdown

2. **Action Toolbar:**
   - **Filter by Domain:** All | Outbreak | Scams | Benefits | Election Procedure
   - **Filter by Verdict:** All | Contradicted | Supported | No Official Source
   - **Toggle: "Show Only Guidance Gaps"** (Essential for agencies to prioritize press releases)
   - **Button: "Generate Daily Brief"** (Opens modal with markdown intelligence report)
   - **Button: "Reload Synthetic Demo"** (Re-triggers backend pipeline)

3. **Cluster Table / Cards:**
   - Columns / Card details:
     - **Volume & Velocity:** e.g., `32 msgs (+45% 24h)`
     - **Domain:** Outbreak / Scam / Benefit
     - **Representative Claim:** Clear, neutral single-sentence summary
     - **Verdict Badge:**
       - `CONTRADICTED_BY_OFFICIAL_SOURCE` -> **Red** ("Refuted by NCDC/FCCPC")
       - `SUPPORTED_BY_OFFICIAL_SOURCE` -> **Green** ("Matches Guidance")
       - `NO_OFFICIAL_SOURCE_FOUND` -> **Amber** ("Guidance Gap / Unverified")
     - **Action:** "Inspect Cluster" button.

4. **Cluster Inspection Drawer (Slide-Over):**
   - Shows:
     - Full representative claim
     - First detected vs Latest detected timestamps
     - Languages detected (`English`, `Pidgin`)
     - **3 Sample Messages:** Show actual synthetic quotes so fact-checkers see the exact street phrasing
     - **Official Evidence Passages:** Official quotes contradicting or confirming the rumour
     - **Suggested Broadcast Response:** One-click copyable message written in plain Nigerian English / Pidgin for social media release

5. **Daily Brief Reader & Exporter:**
   - Formatted Markdown modal displaying:
     - Top trending misinformation clusters
     - Critical guidance gaps with **Suggested Agency Actions**
   - **"Download Brief (.md)"** button triggering `/api/v1/rumours/brief/download`.

---

## 5. API Client Implementation Template (`src/api/client.ts`)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function askQuestion(question: string, language: string = 'en') {
  const res = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language }),
  });
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
}

export async function getRumourStats() {
  const res = await fetch(`${API_BASE_URL}/rumours/stats`);
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
}

export async function getClusters(params?: { domain?: string; label?: string; guidance_gap_only?: boolean }) {
  const query = new URLSearchParams();
  if (params?.domain) query.set('domain', params.domain);
  if (params?.label) query.set('label', params.label);
  if (params?.guidance_gap_only) query.set('guidance_gap_only', 'true');

  const res = await fetch(`${API_BASE_URL}/rumours/clusters?${query.toString()}`);
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
}

export async function getDailyBrief() {
  const res = await fetch(`${API_BASE_URL}/rumours/brief`);
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
}

export function getDailyBriefDownloadUrl() {
  return `${API_BASE_URL}/rumours/brief/download`;
}
```

---

## 6. Design System & Styling Guidelines

1. **Color Palette:**
   - **Primary:** Forest Green (`#0A5C36` or Emerald-800) – reflects Nigerian public service authority, health, and trust.
   - **Contradicted / Danger:** Carmine Red (`#DC2626` / Red-600) – immediate warning for harmful misinformation.
   - **Supported / Safe:** Emerald Green (`#16A34A` / Green-600) – confirmed official guidance.
   - **Guidance Gap / Caution:** Amber / Ochre (`#D97706` / Amber-600) – highlights unaddressed rumours.
   - **Backgrounds:** Clean slate/neutral light mode with subtle card borders (`#F8FAFC` / Slate-50) or sleek dark mode.

2. **Typography:**
   - Font: Inter, Plus Jakarta Sans, or Outfit via Google Fonts.
   - High legibility, clear hierarchy between official quotes and user claims.

3. **Accessibility:**
   - Visible focus rings for keyboard navigation.
   - High contrast ratios (WCAG AA).
   - Clear ARIA labels for citation expanders and modal drawers.
