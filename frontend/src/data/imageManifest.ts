export interface SafeClaimImage {
  id: string;
  title: string;
  description: string;
  alt: {
    en: string;
    pcm: string;
  };
  src: string;
  webpSrc?: string;
  fallbackSvg?: string;
  aspectRatio: string;
  credit: string;
  tags: string[];
}

export const safeClaimImages: Record<string, SafeClaimImage> = {
  heroNeighbour: {
    id: 'heroNeighbour',
    title: 'Community Information Sharing in Lagos',
    description: 'A community elder and young professional reviewing public advisories together in a warm Lagos outdoor setting.',
    alt: {
      en: 'Two neighbours reviewing a printed government circular together at a table in Lagos.',
      pcm: 'Two neighbours dey look paper government notice together for Lagos.',
    },
    src: '/images/hero-neighbour.svg',
    webpSrc: '/images/hero-neighbour.svg',
    aspectRatio: '16/10',
    credit: 'SafeClaim Civic Archives / Public Domain',
    tags: ['neighbour', 'community', 'receipts', 'civic'],
  },
  officialArchive: {
    id: 'officialArchive',
    title: 'Federal Government Gazette & Circulars Archive',
    description: 'Stamped paper circulars and official gazettes neatly catalogued with reference stamps.',
    alt: {
      en: 'Organized stack of official Nigerian government gazettes with red and green verification stamps.',
      pcm: 'Stack of government gazette paper wey get official verification stamps.',
    },
    src: '/images/official-archive.svg',
    webpSrc: '/images/official-archive.svg',
    aspectRatio: '4/3',
    credit: 'Federal Ministry Archives / Civic Repository',
    tags: ['receipts', 'gazette', 'evidence', 'archive'],
  },
  newsroomDesk: {
    id: 'newsroomDesk',
    title: 'Newsroom Fact-Checking & Rumour Desk',
    description: 'Journalists and public health responders analyzing incoming WhatsApp forwarded claims.',
    alt: {
      en: 'Fact-checking desk monitor displaying verification clusters and guidance gap notifications.',
      pcm: 'Fact-checking table screen wey dey show rumour cluster and guidance gap alerts.',
    },
    src: '/images/newsroom-desk.svg',
    webpSrc: '/images/newsroom-desk.svg',
    aspectRatio: '16/9',
    credit: 'Newsroom Intelligence Consortium',
    tags: ['newsroom', 'journalism', 'intelligence', 'monitoring'],
  },
  communityHotline: {
    id: 'communityHotline',
    title: 'Direct Toll-Free Community Verification',
    description: 'Citizens calling the NCDC 6232 public health emergency line for immediate verification.',
    alt: {
      en: 'Toll-free verification phone hotline poster with NCDC 6232 number.',
      pcm: 'Toll-free verification poster wey show NCDC 6232 number clearly.',
    },
    src: '/images/community-hotline.svg',
    webpSrc: '/images/community-hotline.svg',
    aspectRatio: '1/1',
    credit: 'Public Health Service Nigeria',
    tags: ['hotline', 'ncdc', 'emergency', 'phone'],
  },
};
