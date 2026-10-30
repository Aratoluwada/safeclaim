/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  | 'NO_OFFICIAL_SOURCE_FOUND'
  | 'NOT_VALIDATED';

export interface Citation {
  passage_id: string;
  doc_title: string;
  publisher: string;
  url: string;
  domain: DomainType;
  excerpt: string;
  verification_status?: 'verified' | 'unverified';
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
  verdict?: VerdictLabel;
  abstention_reason: string | null;
  answer: string;
  hotline_info: HotlineInfo | null;
  citations: Citation[];
  retrieval?: {
    top_score: number;
    threshold: number;
    passages_evaluated: number;
  };
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
  domains: Record<DomainType | string, number>;
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

export interface FilterParams {
  domain?: DomainType | 'all';
  label?: VerdictLabel | 'all';
  guidance_gap_only?: boolean;
  search_query?: string;
}
