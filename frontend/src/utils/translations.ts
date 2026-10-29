/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageCode } from '../types/api';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  disclaimer: string;
  syntheticDemoBanner: string;
  navAsk: string;
  navRumourDesk: string;
  navDocs: string;
  searchPlaceholder: string;
  askButton: string;
  verifyingButton: string;
  starterPromptTitle: string;
  starters: Array<{
    id: string;
    icon: string;
    label: string;
    query: string;
  }>;
  groundedHeading: string;
  abstentionHeading: string;
  abstentionLead: string;
  citationsHeading: string;
  hotlineCalloutPrefix: string;
  hotlineCalloutAction: string;
  officialSourceTag: string;
  passageIdPrefix: string;
  askAnotherButton: string;
  emptyQuestionError: string;
  backendErrorPrefix: string;
  openSourceLink: string;
  navHome: string;
  navHowItWorks: string;
  navVerdicts: string;
  navFaq: string;
  homeHeroTitle: string;
  homeHeroLead: string;
  homeSearchAction: string;
  homeDeskTeaserTitle: string;
  homeDeskTeaserLead: string;
  homeViewDeskAction: string;
  shareVerdict: string;
  shareOnWhatsApp: string;
  copiedToClipboard: string;
  neighbourTagline: string;
  officialReceiptsBadge: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  en: {
    appName: 'SafeClaim AI',
    tagline: 'Understand the claim. Verify the facts.',
    disclaimer:
      'SafeClaim answers strictly from official government sources and advisories. It is not medical or legal advice.',
    syntheticDemoBanner:
      'Synthetic Demo Dataset Active — Prepared for OSCA OPEN//BUILD 2026.',
    navAsk: 'Ask SafeClaim',
    navRumourDesk: 'Rumour Desk',
    navDocs: 'API & Specs',
    searchPlaceholder:
      'Ask about Ebola alerts, loan app harassment, or health insurance...',
    askButton: 'Verify / Ask',
    verifyingButton: 'Verifying with official sources...',
    starterPromptTitle: 'Common queries to test:',
    starters: [
      {
        id: 'ebola',
        icon: 'stethoscope',
        label: 'Is Ebola confirmed in Lagos right now?',
        query: 'Is Ebola confirmed in Lagos right now?',
      },
      {
        id: 'loan',
        icon: 'smartphone',
        label: 'How can I check if a loan app is registered by FCCPC?',
        query: 'How can I check if a loan app is registered by FCCPC?',
      },
      {
        id: 'nhis',
        icon: 'shield-plus',
        label: 'How do I register for the National Health Insurance Scheme?',
        query: 'How do I register for the National Health Insurance Scheme?',
      },
      {
        id: 'salt',
        icon: 'droplets',
        label: 'Does drinking salt water prevent Ebola?',
        query: 'Does drinking salt water prevent Ebola?',
      },
      {
        id: 'grant',
        icon: 'gift',
        label: 'Is there a federal 50,000 grant on WhatsApp?',
        query: 'Is there a new federal government grant of N50,000 being distributed on WhatsApp via tinyurl link?',
      },
    ],
    groundedHeading: 'Retrieved Source Passages (Unverified)',
    abstentionHeading: 'No Official Source Found',
    abstentionLead:
      'No official government publication in our verified database addresses or confirms this claim.',
    citationsHeading: 'Indexed Source Passages & Excerpts',
    hotlineCalloutPrefix: 'Official Emergency Helpline',
    hotlineCalloutAction: 'Toll-free / WhatsApp direct verification',
    officialSourceTag: 'Indexed Source Document',
    passageIdPrefix: 'Passage ID',
    askAnotherButton: 'Ask Another Question',
    emptyQuestionError: 'Please enter a question or claim to verify.',
    backendErrorPrefix: 'Backend Service Notice',
    openSourceLink: 'Hackathon Architecture',
    navHome: 'Home',
    navHowItWorks: 'How It Works',
    navVerdicts: 'Verdicts',
    navFaq: 'FAQ',
    homeHeroTitle: 'Public Evidence Grounding for Circulating Rumours',
    homeHeroLead:
      'SafeClaim AI evaluates public-health alerts, digital loan app harassment, and government benefits using official Nigerian circulars and gazettes (NCDC, FCCPC, NHIA, FMOH, INEC). When no official source exists, it abstains explicitly.',
    homeSearchAction: 'Search & Verify',
    homeDeskTeaserTitle: 'Rumour Desk for Newsrooms & Agencies',
    homeDeskTeaserLead:
      'Institutional dashboard tracking circulating claim clusters, monitoring viral guidance gaps, and generating broadcast-ready intelligence briefs.',
    homeViewDeskAction: 'Open Rumour Desk',
    shareVerdict: 'Share Source Verification Card',
    shareOnWhatsApp: 'Forward Receipt to WhatsApp',
    copiedToClipboard: 'Verification text copied with receipts!',
    neighbourTagline: 'The trusted neighbour with the receipts',
    officialReceiptsBadge: 'Indexed Source Document',
  },

  pcm: {
    appName: 'SafeClaim AI',
    tagline: 'Understand di claim. Check di real fact.',
    disclaimer:
      'SafeClaim dey answer strictly from official government sources and advisories. Dis no be medical or legal advice.',
    syntheticDemoBanner:
      'Synthetic Demo Dataset Active — Prepared for OSCA OPEN//BUILD 2026.',
    navAsk: 'Ask SafeClaim',
    navRumourDesk: 'Rumour Desk',
    navDocs: 'API & Specs',
    searchPlaceholder:
      'Ask anything about Ebola alert, loan app wahala, or health insurance...',
    askButton: 'Verify / Ask',
    verifyingButton: 'We dey check official circular dem...',
    starterPromptTitle: 'Quick questions wey you fit check:',
    starters: [
      {
        id: 'ebola',
        icon: 'stethoscope',
        label: 'Ebola dey Lagos state right now true true?',
        query: 'Ebola dey Lagos state right now true true?',
      },
      {
        id: 'loan',
        icon: 'smartphone',
        label: 'How person fit know whether loan app dey registered with FCCPC?',
        query: 'How person fit know whether loan app dey registered with FCCPC?',
      },
      {
        id: 'nhis',
        icon: 'shield-plus',
        label: 'How person fit register for National Health Insurance?',
        query: 'How person fit register for National Health Insurance?',
      },
      {
        id: 'salt',
        icon: 'droplets',
        label: 'If person drink salt water, e go protect am from Ebola?',
        query: 'If person drink salt water, e go protect am from Ebola?',
      },
      {
        id: 'grant',
        icon: 'gift',
        label: 'FG 50,000 grant link wey dey WhatsApp na true?',
        query: 'Is there a new federal government grant of N50,000 being distributed on WhatsApp via tinyurl link?',
      },
    ],
    groundedHeading: 'Retrieved Source Passages (Unverified)',
    abstentionHeading: 'No Official Source Found',
    abstentionLead:
      'No official government publication in our verified database addresses or confirms this claim.',
    citationsHeading: 'Indexed Source Passages & Excerpts',
    hotlineCalloutPrefix: 'Official Emergency Helpline',
    hotlineCalloutAction: 'Free call / WhatsApp direct verification',
    officialSourceTag: 'Indexed Source Document',
    passageIdPrefix: 'Passage ID',
    askAnotherButton: 'Check Another Question',
    emptyQuestionError: 'Abeg enter di claim or question wey you wan verify.',
    backendErrorPrefix: 'Backend Service Notice',
    openSourceLink: 'Hackathon Architecture',
    navHome: 'Home',
    navHowItWorks: 'How E Dey Work',
    navVerdicts: 'Verdicts',
    navFaq: 'FAQ',
    homeHeroTitle: 'Evidence Grounding for Claims Wey Dey Spread',
    homeHeroLead:
      'SafeClaim AI dey match health alerts, loan app wahala, and government grant circulars with indexed publications (NCDC, FCCPC, NHIA, FMOH, INEC). If government never talk about am, di system dey tell you clearly say no official proof dey.',
    homeSearchAction: 'Search & Verify',
    homeDeskTeaserTitle: 'Rumour Desk for Fact-Checkers & Agencies',
    homeDeskTeaserLead:
      'Dashboard wey agencies dey use inspect circulating claim clusters, spot viral guidance gaps, and download ready-to-broadcast intelligence briefs.',
    homeViewDeskAction: 'Open Rumour Desk',
    shareVerdict: 'Share Source Search Card',
    shareOnWhatsApp: 'Forward Receipt Enter WhatsApp',
    copiedToClipboard: 'We don copy di verification text with source receipts!',
    neighbourTagline: 'Di trusted neighbour wey hold di source receipts',
    officialReceiptsBadge: 'Indexed Source Document',
  },
};
