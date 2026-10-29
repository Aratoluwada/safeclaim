/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AskResponse, ClaimCluster, DailyBrief, RumourStats } from '../types/api';

export const DEMO_HOTLINE_NCDC = {
  name: 'Nigeria Centre for Disease Control (NCDC)',
  number: '6232',
  alt_number: '+234 809 955 5577',
  source_doc_id: 'ncdc-emergency-guidelines-2025',
};

export const DEMO_HOTLINE_FCCPC = {
  name: 'Federal Competition and Consumer Protection Commission (FCCPC)',
  number: '0805 888 8881',
  alt_number: '0805 888 8882',
  source_doc_id: 'fccpc-consumer-helpline-2024',
};

// Curated demo answers grounded strictly in realistic verified government circulars and public health releases
export const DEMO_ASK_RESPONSES: Record<string, AskResponse> = {
  ebola_lagos: {
    question: 'Is Ebola confirmed in Lagos right now?',
    language: 'en',
    grounded: true,
    abstention_reason: null,
    answer:
      'No. The Nigeria Centre for Disease Control and Prevention (NCDC) confirms there is NO active Ebola Virus Disease outbreak in Lagos State or anywhere in the Federal Republic of Nigeria [ncdc#1]. Heightened surveillance protocols remain active at the Murtala Muhammed International Airport and seaports as standard preventive biosecurity [ncdc#2]. The general public is advised to rely solely on formal bulletins issued through official NCDC channels [ncdc#3].',
    hotline_info: DEMO_HOTLINE_NCDC,
    citations: [
      {
        verification_status: 'unverified',
        passage_id: 'ncdc#1',
        doc_title: 'Public Health Advisory on Viral Haemorrhagic Fevers in Nigeria',
        publisher: 'Nigeria Centre for Disease Control and Prevention (NCDC)',
        url: 'https://ncdc.gov.ng/news/advisories/vhf-status-update',
        domain: 'outbreak',
        excerpt:
          'The Nigeria Centre for Disease Control and Prevention reassures the public that as of current epidemiology surveillance, Nigeria has recorded zero confirmed cases of Ebola Virus Disease. Speculative alerts circulating on messaging platforms regarding cases in Lagos are unsubstantiated.',
      },
      {
        verification_status: 'unverified',
        passage_id: 'ncdc#2',
        doc_title: 'Point of Entry Biosecurity & Port Health Services Protocol',
        publisher: 'Federal Ministry of Health and Social Welfare',
        url: 'https://health.gov.ng/protocols/port-health-surveillance',
        domain: 'outbreak',
        excerpt:
          'Routine thermal screening and passenger health declaration monitoring are continuously enforced across all international transit terminals including Lagos and Abuja.',
      },
      {
        verification_status: 'unverified',
        passage_id: 'ncdc#3',
        doc_title: 'Factsheet on Infectious Disease Rumours and Verification',
        publisher: 'NCDC Risk Communication Division',
        url: 'https://ncdc.gov.ng/factsheets/ebola-myths-facts',
        domain: 'outbreak',
        excerpt:
          'Citizens must refrain from forwarding unverified voice notes or WhatsApp broadcasts that induce panic. Official outbreak declarations are published exclusively on ncdc.gov.ng.',
      },
    ],
  },

  salt_water: {
    question: 'Does drinking salt water prevent Ebola?',
    language: 'en',
    grounded: true,
    abstention_reason: null,
    answer:
      'No. Drinking or bathing with concentrated salt water does NOT prevent, cure, or protect against Ebola Virus Disease [ncdc#salt1]. In fact, excessive intake of salt water is hazardous and can cause severe hypernatremia, acute renal distress, heart complications, and death [ncdc#salt2]. Scientific and medical evidence unequivocally refutes this dangerous myth [who#salt3].',
    hotline_info: DEMO_HOTLINE_NCDC,
    citations: [
      {
        verification_status: 'unverified',
        passage_id: 'ncdc#salt1',
        doc_title: 'Warning on Harmful Domestic Concoctions for Viral Haemorrhagic Fevers',
        publisher: 'Nigeria Centre for Disease Control (NCDC)',
        url: 'https://ncdc.gov.ng/advisories/salt-water-myth-warning',
        domain: 'outbreak',
        excerpt:
          'Drinking salt water or bathing in hot saltwater mixtures provides zero antiviral protection against Ebola or any filovirus. Several individuals suffered severe medical emergencies in 2014 from this unscientific practice.',
      },
      {
        verification_status: 'unverified',
        passage_id: 'ncdc#salt2',
        doc_title: 'Clinical Guidance on Acute Salt Toxicity and Hypernatremia',
        publisher: 'Federal Ministry of Health',
        url: 'https://health.gov.ng/clinical-bulletins/electrolyte-toxicity',
        domain: 'outbreak',
        excerpt:
          'Ingesting high-salinity water causes hyperosmolar cell dehydration, blood pressure spikes, and irreversible kidney injury. It is strongly discouraged under all circumstances.',
      },
      {
        verification_status: 'unverified',
        passage_id: 'who#salt3',
        doc_title: 'Ebola Virus Disease Mythbusters & Essential Facts',
        publisher: 'World Health Organization (WHO AFRO / Nigeria Office)',
        url: 'https://who.int/emergencies/disease-outbreak-news/ebola-nigeria',
        domain: 'outbreak',
        excerpt:
          'Ebola transmission is interrupted through infection control, avoidance of bodily fluids, and safe clinical treatment. Salt remedies are medically unfounded.',
      },
    ],
  },

  fccpc_loan_app: {
    question: 'How can I check if a loan app is registered by FCCPC?',
    language: 'en',
    grounded: true,
    abstention_reason: null,
    answer:
      'To verify whether a digital money lender is registered and authorized in Nigeria, consult the official Limited Interim Regulatory/Registration Framework register published directly on the Federal Competition and Consumer Protection Commission (FCCPC) portal [fccpc#1]. Borrowers must check whether both the parent operating entity and the commercial app name appear on the approved list [fccpc#2]. Unregistered lenders violate consumer data protection and risk app store delisting and criminal prosecution [fccpc#3].',
    hotline_info: DEMO_HOTLINE_FCCPC,
    citations: [
      {
        verification_status: 'unverified',
        passage_id: 'fccpc#1',
        doc_title: 'Status of Approved and Delisted Digital Lending Applications in Nigeria',
        publisher: 'Federal Competition and Consumer Protection Commission (FCCPC)',
        url: 'https://fccpc.gov.ng/digital-lending-approvals',
        domain: 'scam',
        excerpt:
          'The FCCPC maintains a dynamic public register of conditionally approved, fully approved, and delisted digital money lenders (DMLs). Only registered entities have demonstrated compliance with the Joint Regulatory and Enforcement Task Force guidelines.',
      },
      {
        verification_status: 'unverified',
        passage_id: 'fccpc#2',
        doc_title: 'Consumer Guide on Identifying Predatory Loan Platforms',
        publisher: 'FCCPC Joint Regulatory Task Force',
        url: 'https://fccpc.gov.ng/guidelines/digital-money-lending',
        domain: 'scam',
        excerpt:
          'Consumers are advised to inspect both the corporate entity name and the Android/iOS app package name on the official whitelist before providing personal details or consenting to contact-list access.',
      },
      {
        verification_status: 'unverified',
        passage_id: 'fccpc#3',
        doc_title: 'Directives on Defamation and Illegal Debt Collection Practices',
        publisher: 'FCCPC & Nigeria Data Protection Commission (NDPC)',
        url: 'https://fccpc.gov.ng/enforcement/debt-collection-rules',
        domain: 'scam',
        excerpt:
          'Harassment of contacts, shaming messages, and unauthorized dissemination of borrower images are criminal breaches under the FCCPA 2018 and Nigeria Data Protection Act 2023.',
      },
    ],
  },

  nhis_registration: {
    question: 'How do I register for the National Health Insurance Scheme?',
    language: 'en',
    grounded: true,
    abstention_reason: null,
    answer:
      'Under the National Health Insurance Authority (NHIA) Act 2022, health insurance is mandatory for all residents in Nigeria [nhia#1]. Formal sector employees (civil servants and organized private sector) are registered directly through their employer IPPIS/HR contributions [nhia#2]. Informal sector individuals, artisans, and self-employed citizens can enroll through their respective State Social Health Insurance Agencies (SSHIA) or directly into the NHIA Group, Individual and Family Social Health Insurance Programme (GIFSHIP) online or at designated state offices [nhia#3].',
    hotline_info: {
      name: 'National Health Insurance Authority (NHIA) Help Desk',
      number: '0800 467 8726',
      alt_number: '09 460 3000',
      source_doc_id: 'nhia-citizen-enrollment-handbook-2024',
    },
    citations: [
      {
        verification_status: 'unverified',
        passage_id: 'nhia#1',
        doc_title: 'NHIA Operational Guidelines and Mandate Implementation',
        publisher: 'National Health Insurance Authority (NHIA)',
        url: 'https://nhia.gov.ng/guidelines/mandatory-health-insurance',
        domain: 'benefit',
        excerpt:
          'Section 13 of the NHIA Act provides that health insurance coverage is mandatory for every person resident in Nigeria, ensuring financial risk protection against catastrophic healthcare expenditure.',
      },
      {
        verification_status: 'unverified',
        passage_id: 'nhia#2',
        doc_title: 'Formal Sector Social Health Insurance Programme Framework',
        publisher: 'NHIA Directorate of Standards and Quality',
        url: 'https://nhia.gov.ng/programmes/formal-sector',
        domain: 'benefit',
        excerpt:
          'Federal and participating state civil service employees are integrated via designated Health Maintenance Organisations (HMOs) upon submission of official employment records and primary healthcare provider selection.',
      },
      {
        verification_status: 'unverified',
        passage_id: 'nhia#3',
        doc_title: 'GIFSHIP Citizen Enrollment Manual for Informal Sector and Families',
        publisher: 'NHIA Department of ICT and Enrollment',
        url: 'https://nhia.gov.ng/programmes/gifship',
        domain: 'benefit',
        excerpt:
          'The Group, Individual and Family Social Health Insurance Programme (GIFSHIP) allows private individuals and diaspora sponsors to register dependents through the NHIA e-portal or accredited state branch offices.',
      },
    ],
  },

  unverified_grant: {
    question: 'Is there a new federal government grant of N50,000 being distributed on WhatsApp via tinyurl link?',
    language: 'en',
    grounded: false,
    abstention_reason:
      'No official government publication in our verified database addresses or confirms this claim. Official federal social safety programs do not distribute relief funds through unvetted third-party URL shorteners or WhatsApp chains.',
    answer:
      'SafeClaim Abstention Notice: We found NO official government record, press circular, or gazetted advisory from the Federal Ministry of Humanitarian Affairs, Presidency, or Bank of Industry authorizing a grant distribution via WhatsApp links or third-party domain shorteners. This pattern matches standard phishing scams designed to harvest Bank Verification Numbers (BVN) and personal identity records. Do not click suspicious links.',
    hotline_info: DEMO_HOTLINE_FCCPC,
    citations: [],
  },

  cholera_dogonyaro: {
    question: 'Does boiling neem leaves (dogonyaro) cure cholera within 2 hours?',
    language: 'en',
    grounded: false,
    abstention_reason:
      'No official health publication or clinical trial in the verified NCDC / Federal Ministry of Health database supports this claim.',
    answer:
      'SafeClaim Abstention Notice: No official health advisory validates neem leaf (dogonyaro) concoctions as a proven cure for Vibrio cholerae. Delaying medical care for unverified home mixtures during acute watery diarrhea is life-threatening. Official NCDC clinical guidelines mandate immediate oral rehydration therapy (ORS) and urgent transport to an accredited health facility.',
    hotline_info: DEMO_HOTLINE_NCDC,
    citations: [],
  },
};

// Pidgin translations of the quick answers
export const DEMO_ASK_RESPONSES_PCM: Record<string, AskResponse> = {
  ebola_lagos: {
    question: 'Ebola dey Lagos state right now true true?',
    language: 'pcm',
    grounded: true,
    abstention_reason: null,
    answer:
      'No o! Nigeria Centre for Disease Control (NCDC) don make am clear say NO EBOLA dey inside Lagos or any part of Nigeria as we dey talk so [ncdc#1]. Health people dey port and Murtala Muhammed airport dey check people temperature normal normal to protect everybody [ncdc#2]. Make nobody listen to false voice note or panic message wey dey fly for WhatsApp [ncdc#3].',
    hotline_info: DEMO_HOTLINE_NCDC,
    citations: DEMO_ASK_RESPONSES.ebola_lagos.citations,
  },
  salt_water: {
    question: 'If person drink salt water, e go protect am from Ebola?',
    language: 'pcm',
    grounded: true,
    abstention_reason: null,
    answer:
      'Rara! Make you no drink or bath salt water at all at all! NCDC and doctor dem don warn say salt water NO DEY cure or prevent Ebola [ncdc#salt1]. If person drink concentrated salt water, e fit spoil kidneys, shoot blood pressure high well well, or even kill person quick [ncdc#salt2]. Na dangerous lie from back in 2014 [who#salt3].',
    hotline_info: DEMO_HOTLINE_NCDC,
    citations: DEMO_ASK_RESPONSES.salt_water.citations,
  },
  fccpc_loan_app: {
    question: 'How person fit know whether loan app dey registered with FCCPC?',
    language: 'pcm',
    grounded: true,
    abstention_reason: null,
    answer:
      'To check whether loan app get legit license, enter official website of Federal Competition and Consumer Protection Commission (fccpc.gov.ng) [fccpc#1]. Check di official list wey get approved digital lenders to see whether di app name and di company name dey inside [fccpc#2]. If loan app no dey di list, na illegal lender wey fit threaten your contacts and do illegal deductions [fccpc#3].',
    hotline_info: DEMO_HOTLINE_FCCPC,
    citations: DEMO_ASK_RESPONSES.fccpc_loan_app.citations,
  },
  nhis_registration: {
    question: 'How person fit register for National Health Insurance?',
    language: 'pcm',
    grounded: true,
    abstention_reason: null,
    answer:
      'Under di new NHIA law, health insurance na compulsory thing for every person wey dey stay Nigeria [nhia#1]. If you be civil servant or you dey work for company, your employer go register you direct through HMO [nhia#2]. If you be trader, artisan, or student, you fit register yourself under GIFSHIP plan for state NHIA office or State Health Scheme for your state [nhia#3].',
    hotline_info: DEMO_ASK_RESPONSES.nhis_registration.hotline_info,
    citations: DEMO_ASK_RESPONSES.nhis_registration.citations,
  },
};

// Deterministic circulating claim clusters for the Rumour Desk
export const DEMO_CLAIM_CLUSTERS: ClaimCluster[] = [
  {
    cluster_id: 'cluster-ob-01',
    domain: 'outbreak',
    representative_claim: 'Viral voice note claims multiple Ebola fatalities admitted secretly in Lagos general hospitals.',
    verdict: {
      label: 'CONTRADICTED_BY_OFFICIAL_SOURCE',
      short_explanation: 'NCDC epidemiological surveillance reports zero confirmed Ebola cases nationwide. Lagos State Ministry of Health refuted the viral audio as fabricated.',
      suggested_reply:
        'PUBLIC HEALTH VERIFICATION: The Nigeria Centre for Disease Control (NCDC) and Lagos State Ministry of Health confirm NO Ebola cases in Lagos or Nigeria. Do not forward unverified voice notes. Call toll-free 6232 for medical verification.',
      evidence_passage_ids: ['ncdc#1', 'ncdc#3'],
      evidence_passages: [
        {
          verification_status: 'unverified',
        passage_id: 'ncdc#1',
          doc_title: 'Public Health Advisory on Viral Haemorrhagic Fevers in Nigeria',
          publisher: 'NCDC',
          url: 'https://ncdc.gov.ng/news/advisories/vhf-status-update',
          domain: 'outbreak',
          excerpt: 'Nigeria has recorded zero confirmed cases of Ebola Virus Disease. Speculative alerts circulating on messaging platforms regarding cases in Lagos are unsubstantiated.',
        },
      ],
    },
    message_count: 76,
    growth_rate_24h: '+48%',
    languages_seen: ['en', 'pcm'],
    first_seen: '2026-10-26T08:15:00Z',
    last_seen: '2026-10-28T19:40:00Z',
    sample_messages: [
      'Pls warn your people in Ikeja, they just brought 4 people bleeding to general hospital Ebola has entered Lagos again o!',
      'Abeg make una avoid hospitals in Yaba, my friend nurse talk say Ebola people dey inside emergency ward now now.',
      'Forward as received: Ebola virus confirmed in Lagos Mainland, government is hiding it drink bitter leaf now.',
    ],
    is_guidance_gap: false,
  },
  {
    cluster_id: 'cluster-scam-02',
    domain: 'scam',
    representative_claim: 'Viral WhatsApp link promises N50,000 Federal Palliative Relief disbursement after BVN entry.',
    verdict: {
      label: 'CONTRADICTED_BY_OFFICIAL_SOURCE',
      short_explanation: 'Federal Ministry of Humanitarian Affairs disclaims unofficial blog links and tinyurls. Federal government never requests BVN or debit card PINs via messaging apps.',
      suggested_reply:
        'CYBERSAFETY WARNING: The Federal Government is NOT disbursing N50,000 grants through WhatsApp broadcast links. Do not provide your BVN or bank security credentials. Verify government initiatives exclusively via official .gov.ng portals.',
      evidence_passage_ids: ['fccpc#scam1'],
      evidence_passages: [
        {
          verification_status: 'unverified',
        passage_id: 'fccpc#scam1',
          doc_title: 'Notice on Fraudulent Palliative and Grant Distribution Web Portals',
          publisher: 'Federal Competition & Consumer Protection Commission (FCCPC)',
          url: 'https://fccpc.gov.ng/notices/scam-palliative-alert',
          domain: 'scam',
          excerpt: 'Criminal syndicates are circulating cloned websites mimicking federal poverty alleviation programs. Official federal programs never utilize free domain extensions (.xyz, .top) or message-forwarding schemes.',
        },
      ],
    },
    message_count: 104,
    growth_rate_24h: '+62%',
    languages_seen: ['en', 'pcm'],
    first_seen: '2026-10-25T11:00:00Z',
    last_seen: '2026-10-28T20:10:00Z',
    sample_messages: [
      'FG 50K Easter/Ramadan grant application is open! Click tinyurl.com/fg-relief-2026 to claim yours in 5 mins.',
      'I just received my 50,000 naira from Federal Ministry palliative link! Share to 5 groups to activate your code.',
      'Hurry now, FG palliative fund is closing by midnight today. Register your BVN here to get alert.',
    ],
    is_guidance_gap: false,
  },
  {
    cluster_id: 'cluster-scam-03',
    domain: 'scam',
    representative_claim: 'Unregistered loan apps threaten to freeze bank accounts and blast contact lists with defamatory images.',
    verdict: {
      label: 'SUPPORTED_BY_OFFICIAL_SOURCE',
      short_explanation: 'FCCPC regulations prohibit predatory harassment and unauthorized contact scraping. Regulators have instructed Google Play and banks to blacklist non-compliant loan operators.',
      suggested_reply:
        'CONSUMER RIGHTS ALERT: Under FCCPC regulations, loan operators are strictly prohibited from messaging your contacts or publishing defamatory images. Report predatory lenders to lenderstaskforce@fccpc.gov.ng or call 0805 888 8881.',
      evidence_passage_ids: ['fccpc#2', 'fccpc#3'],
      evidence_passages: [
        {
          verification_status: 'unverified',
        passage_id: 'fccpc#3',
          doc_title: 'Directives on Defamation and Illegal Debt Collection Practices',
          publisher: 'FCCPC',
          url: 'https://fccpc.gov.ng/enforcement/debt-collection-rules',
          domain: 'scam',
          excerpt: 'Harassment of contacts, shaming messages, and unauthorized dissemination of borrower images are criminal breaches under the FCCPA 2018 and Nigeria Data Protection Act 2023.',
        },
      ],
    },
    message_count: 53,
    growth_rate_24h: '+18%',
    languages_seen: ['en', 'pcm'],
    first_seen: '2026-10-24T14:20:00Z',
    last_seen: '2026-10-28T18:30:00Z',
    sample_messages: [
      'This loan app called QuickNaira sent my picture to my church group calling me a criminal debtor, is this legal?',
      'One loan company agent is threatening that EFCC will freeze my BVN tomorrow morning because of 12,000 loan.',
      'How do I report these fake loan sharks who keep calling my mother and boss at night?',
    ],
    is_guidance_gap: false,
  },
  {
    cluster_id: 'cluster-ob-04',
    domain: 'outbreak',
    representative_claim: 'Claims that drinking hot boiled guava leaves and ginger immediately cleanses suspected Mpox sores within 24 hours.',
    verdict: {
      label: 'NO_OFFICIAL_SOURCE_FOUND',
      short_explanation: 'No scientific advisory or NCDC clinical guide supports herbal guava decoctions for Mpox viral clearance. Urgent need for NCDC public advisory.',
      suggested_reply:
        'PUBLIC HEALTH NOTICE: There is NO scientific evidence that boiled guava leaf tea cures Mpox. Self-medicating unverified mixtures can aggravate lesions and delay clinical care. Visit the nearest accredited healthcare facility.',
      evidence_passage_ids: [],
      evidence_passages: [],
    },
    message_count: 43,
    growth_rate_24h: '+74%',
    languages_seen: ['en', 'pcm'],
    first_seen: '2026-10-27T04:10:00Z',
    last_seen: '2026-10-28T21:15:00Z',
    sample_messages: [
      'My auntie in Delta said if you boil guava leaves with garlic and ginger, you will not get that monkeypox rash.',
      'Forget hospital medicine for mpox, just boil fresh dogonyaro and guava leaf, wash morning and night.',
      'Is it true that taking strong guava tea cures mpox blisters in two days? People are buying all guava trees in market.',
    ],
    is_guidance_gap: true, // GUIDANCE GAP: Viral, zero official refutation publication
  },
  {
    cluster_id: 'cluster-ben-05',
    domain: 'benefit',
    representative_claim: 'Unverified circular claims all federal and state pensioners must surrender old NHIA cards for paid biometric verification.',
    verdict: {
      label: 'NO_OFFICIAL_SOURCE_FOUND',
      short_explanation: 'No public bulletin from NHIA announces card recall or biometric re-validation fee. Guidance gap requires formal NHIA press release.',
      suggested_reply:
        'ADVISORY ON NHIA CARDS: The National Health Insurance Authority has NOT issued any directive mandating card surrender or payment for biometric updates. Beware of unauthorized extortion at local branch offices.',
      evidence_passage_ids: [],
      evidence_passages: [],
    },
    message_count: 31,
    growth_rate_24h: '+35%',
    languages_seen: ['en'],
    first_seen: '2026-10-26T17:00:00Z',
    last_seen: '2026-10-28T16:45:00Z',
    sample_messages: [
      'Attention all pensioners: NHIS cards expire next week and you must pay N2,500 at the liaison office for new biometrics.',
      'Is NHIA calling back cards? People are queueing up in Kaduna saying old cards will stop working for hospital.',
      'Heard that pensioners who don’t do new biometric scan by Friday will lose their health insurance cover.',
    ],
    is_guidance_gap: true, // GUIDANCE GAP
  },
  {
    cluster_id: 'cluster-elec-06',
    domain: 'election_procedure',
    representative_claim: 'Broadcast claims INEC has extended Continuous Voter Registration (CVR) only for selected southern states.',
    verdict: {
      label: 'CONTRADICTED_BY_OFFICIAL_SOURCE',
      short_explanation: 'INEC regulations stipulate that electoral timeline alterations apply strictly nationwide pursuant to the Electoral Act 2022. INEC has made no regional extension.',
      suggested_reply:
        'INEC FACT-CHECK: The Independent National Electoral Commission (INEC) confirms that voter registration schedules are established nationally and not granted on a selective regional basis. Verify electoral calendars at inecnigeria.org.',
      evidence_passage_ids: ['inec#cvr1'],
      evidence_passages: [
        {
          verification_status: 'unverified',
        passage_id: 'inec#cvr1',
          doc_title: 'Regulations and Guidelines for Voter Registration and PVC Collection',
          publisher: 'Independent National Electoral Commission (INEC)',
          url: 'https://inecnigeria.org/voter-education/regulations-cvr',
          domain: 'election_procedure',
          excerpt: 'In compliance with Section 10 of the Electoral Act 2022, all revisions to voter registration schedules are enacted uniformly throughout the 36 States of the Federation and the FCT.',
        },
      ],
    },
    message_count: 19,
    growth_rate_24h: '-12%',
    languages_seen: ['en', 'pcm'],
    first_seen: '2026-10-23T09:30:00Z',
    last_seen: '2026-10-27T12:00:00Z',
    sample_messages: [
      'Breaking: INEC extends voter registration by 3 months in South-South and South-East only due to flood disruptions.',
      'Check if your state is among the 8 states where INEC approved extension of PVC collection.',
      'INEC southern extension announced on radio this morning, go to your LGA immediately.',
    ],
    is_guidance_gap: false,
  },
];

export const DEMO_RUMOUR_STATS: RumourStats = {
  total_messages_analyzed: 326,
  total_clusters: 6,
  source_distribution: {
    synthetic: 284,
    submitted: 42,
  },
  verdict_counts: {
    CONTRADICTED_BY_OFFICIAL_SOURCE: 3,
    SUPPORTED_BY_OFFICIAL_SOURCE: 1,
    NO_OFFICIAL_SOURCE_FOUND: 2,
    NOT_VALIDATED: 0,
  },
  guidance_gaps_count: 2,
  domains: {
    outbreak: 119,
    scam: 157,
    benefit: 31,
    election_procedure: 19,
    other: 0,
  },
};

export const DEMO_DAILY_BRIEF: DailyBrief = {
  date: '2026-10-28',
  title: 'SafeClaim Institutional Intelligence Brief — Circulating Public Claims & Guidance Gaps',
  summary:
    'Across 326 analyzed public messages over the past 72 hours, high-velocity financial phishing schemes mimicking federal palliative disbursement accounted for the largest volume (48.1%). Public-health misinformation regarding unverified Ebola outbreaks in Lagos was effectively countered by official NCDC advisories, but a high-risk guidance gap has emerged regarding unverified guava-leaf herbal treatments for Mpox (+74% 24h growth). Institutional communication from the NCDC and NHIA is urgently recommended.',
  top_clusters: [
    {
      cluster_id: 'cluster-scam-02',
      domain: 'scam',
      claim: 'Viral WhatsApp link promises N50,000 Federal Palliative Relief disbursement after BVN entry.',
      count: 104,
      verdict: 'CONTRADICTED_BY_OFFICIAL_SOURCE',
    },
    {
      cluster_id: 'cluster-ob-01',
      domain: 'outbreak',
      claim: 'Viral voice note claims multiple Ebola fatalities admitted secretly in Lagos general hospitals.',
      count: 76,
      verdict: 'CONTRADICTED_BY_OFFICIAL_SOURCE',
    },
    {
      cluster_id: 'cluster-scam-03',
      domain: 'scam',
      claim: 'Unregistered loan apps threaten to freeze bank accounts and blast contact lists with defamatory images.',
      count: 53,
      verdict: 'SUPPORTED_BY_OFFICIAL_SOURCE',
    },
    {
      cluster_id: 'cluster-ob-04',
      domain: 'outbreak',
      claim: 'Claims that drinking hot boiled guava leaves immediately cleanses suspected Mpox sores within 24 hours.',
      count: 43,
      verdict: 'NO_OFFICIAL_SOURCE_FOUND',
    },
  ],
  guidance_gaps: [
    {
      cluster_id: 'cluster-ob-04',
      domain: 'outbreak',
      claim: 'Claims that drinking hot boiled guava leaves immediately cleanses suspected Mpox sores within 24 hours.',
      count: 43,
      suggested_action:
        'NCDC Risk Communication Division should publish a concise "Mpox Herbal Remedies Factsheet" warning against delayed medical intervention and clarifying that herbal concoctions do not neutralize viral infection.',
    },
    {
      cluster_id: 'cluster-ben-05',
      domain: 'benefit',
      claim: 'Unverified circular claims all federal and state pensioners must surrender old NHIA cards for paid biometric verification.',
      count: 31,
      suggested_action:
        'National Health Insurance Authority (NHIA) should issue a brief public circular clarifying that no fee-based card surrender is active and providing the official 0800-467-8726 helpline.',
    },
  ],
  markdown: `# SafeClaim Institutional Intelligence Brief
**Date:** 2026-10-28  
**Dataset:** 326 messages analyzed across 6 active claim clusters  
**Prepared for:** NCDC, FCCPC, NHIA, and Accredited Fact-Checking Desks (Dubawa, Africa Check, FactCheckHub)

---

## 1. Executive Summary
Over the past 72 hours, SafeClaim intelligence monitored 326 circulating claims across public-health, digital finance, social welfare, and election procedure domains.

- **48.1% of circulating volume** involves predatory financial scams and phishing links harvesting citizen BVN credentials.
- **NCDC viral haemorrhagic fever guidance** successfully contradicted false Ebola voice notes in Lagos.
- **2 Critical Guidance Gaps** have been identified where viral rumours are escalating in the absence of targeted official rebuttals.

---

## 2. Top Circulating Rumour Clusters

### [CRITICAL] 🚨 Federal Palliative N50,000 Scam (104 msgs, +62% 24h)
- **Domain:** Scam / Consumer Protection
- **Verdict:** \`CONTRADICTED_BY_OFFICIAL_SOURCE\`
- **Details:** Phishing links disguised as federal Easter/Ramadan relief packages requesting BVN and OTPs.
- **Action Taken:** FCCPC notice deployed; banks advised to flag referenced fraudulent account numbers.

### [HIGH] ⚠️ Fabricated Ebola Outbreak Voice Notes (76 msgs, +48% 24h)
- **Domain:** Public Health / Outbreak
- **Verdict:** \`CONTRADICTED_BY_OFFICIAL_SOURCE\`
- **Details:** Voice messages claiming Lagos general hospitals are secretly managing Ebola casualties.
- **Official Guidance:** NCDC Advisory confirms zero confirmed cases in Nigeria; port surveillance standard.

### [MEDIUM] 🛡️ Unregistered Digital Loan Predators (53 msgs, +18% 24h)
- **Domain:** Scam / Financial Enforcement
- **Verdict:** \`SUPPORTED_BY_OFFICIAL_SOURCE\`
- **Details:** Consumers experiencing unlawful contact-list harassment and debt-shaming defamation.
- **Official Guidance:** FCCPC enforces mandatory registration and directs complaints to lenderstaskforce@fccpc.gov.ng.

---

## 3. High-Priority Guidance Gaps (Action Required)

### 1. Guava Leaf Concoctions for Mpox Blisters (43 msgs, +74% 24h)
- **Cluster ID:** \`cluster-ob-04\`
- **Risk Assessment:** High. Patients risk secondary bacterial infections and community transmission by delaying clinical triage.
- **Recommended Agency Action:** NCDC Risk Communication Division should issue a brief graphic card and Pidgin bulletin clarifying that herbal guava mixtures do not cure Mpox.

### 2. Fake NHIA Card Biometric Surrender Scheme (31 msgs, +35% 24h)
- **Cluster ID:** \`cluster-ben-05\`
- **Risk Assessment:** Medium. Financial extortion targeting elderly pensioners.
- **Recommended Agency Action:** NHIA Directorate should release an official disclaimer on nhia.gov.ng and push SMS notices to registered HMOs confirming that biometric updates are free and card surrender is unauthorized.

---
*Generated deterministically by SafeClaim Institutional Rumour Intelligence Engine.*
`,
};
