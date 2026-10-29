import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export const RefutedIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`overflow-visible select-none ${className}`}
    aria-hidden="true"
  >
    {/* Base document sheet */}
    <rect x="25" y="20" width="70" height="85" rx="6" fill="#FDFBF7" stroke="#D4C5B3" strokeWidth="2" />
    <path d="M35 36H75M35 48H85M35 60H65M35 72H80" stroke="#E8DFD5" strokeWidth="2.5" strokeLinecap="round" />
    {/* Red ink cross stamp */}
    <g transform="rotate(-6 60 65)">
      <rect x="22" y="46" width="76" height="36" rx="4" fill="#FEF2F2" stroke="#B91C1C" strokeWidth="3" />
      <path d="M38 56L82 72M82 56L38 72" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" />
      <text x="60" y="88" fill="#B91C1C" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
        CONTRADICTED
      </text>
    </g>
  </svg>
);

export const VerifiedIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`overflow-visible select-none ${className}`}
    aria-hidden="true"
  >
    {/* Base document sheet */}
    <rect x="25" y="20" width="70" height="85" rx="6" fill="#FDFBF7" stroke="#BBD8C3" strokeWidth="2" />
    <path d="M35 36H75M35 48H85M35 60H65M35 72H80" stroke="#E3ECE5" strokeWidth="2.5" strokeLinecap="round" />
    {/* Green wax seal / stamp */}
    <circle cx="60" cy="62" r="24" fill="#F0FDF4" stroke="#15803D" strokeWidth="3" />
    <circle cx="60" cy="62" r="20" stroke="#15803D" strokeWidth="1" strokeDasharray="3 3" />
    <path d="M49 62L56 69L71 54" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="60" y="98" fill="#0A5C36" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      OFFICIAL RECORD
    </text>
  </svg>
);

export const GuidanceGapIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`overflow-visible select-none ${className}`}
    aria-hidden="true"
  >
    {/* Open dossier folder */}
    <path
      d="M20 38C20 34 23 31 27 31H45L53 39H93C97 39 100 42 100 46V88C100 92 97 95 93 95H27C23 95 20 92 20 88V38Z"
      fill="#FFFBEB"
      stroke="#B45309"
      strokeWidth="2.5"
    />
    {/* Amber warning alert inside */}
    <circle cx="60" cy="66" r="16" fill="#FEF3C7" stroke="#B45309" strokeWidth="2" />
    <path d="M60 56V68" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="60" cy="74" r="1.5" fill="#B45309" />
    <text x="60" y="106" fill="#B45309" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      ZERO OFFICIAL GUIDANCE
    </text>
  </svg>
);

export const HotlineIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`overflow-visible select-none ${className}`}
    aria-hidden="true"
  >
    {/* Circular badge background */}
    <circle cx="60" cy="60" r="44" fill="#FAF4E8" stroke="#0A5C36" strokeWidth="2" strokeDasharray="4 4" />
    {/* Phone receiver */}
    <path
      d="M44 42C44 42 46 40 49 43L53 48C55 51 54 53 52 55L50 57C50 57 52 64 59 71C66 78 73 80 73 80L75 78C77 76 79 75 82 77L87 81C90 84 88 86 88 86C86 90 79 92 72 90C63 87 52 79 43 70C34 61 26 50 23 41C21 34 23 27 27 25C27 25 31 23 35 25"
      transform="translate(10, 2) scale(0.85)"
      fill="#0A5C36"
    />
    <path d="M72 38C76 42 78 46 78 52M80 30C86 36 90 43 90 52" stroke="#0A5C36" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const EmptyIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`overflow-visible select-none ${className}`}
    aria-hidden="true"
  >
    {/* Desk notebook and cup */}
    <rect x="25" y="35" width="70" height="60" rx="4" fill="#FDFBF7" stroke="#D4C5B3" strokeWidth="2" />
    <line x1="35" y1="35" x2="35" y2="95" stroke="#E8DFD5" strokeWidth="1.5" />
    <line x1="42" y1="48" x2="85" y2="48" stroke="#E8DFD5" strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="58" x2="75" y2="58" stroke="#E8DFD5" strokeWidth="2" strokeLinecap="round" />
    <line x1="42" y1="68" x2="80" y2="68" stroke="#E8DFD5" strokeWidth="2" strokeLinecap="round" />
    {/* Pencil */}
    <path d="M85 30L95 40L65 70L55 70L55 60L85 30Z" fill="#24306E" />
    <path d="M55 70L58 64L61 67L55 70Z" fill="#FAF4E8" />
  </svg>
);

export const ErrorIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`overflow-visible select-none ${className}`}
    aria-hidden="true"
  >
    <circle cx="60" cy="60" r="42" fill="#FEF2F2" stroke="#B91C1C" strokeWidth="2.5" />
    <path d="M42 42L78 78M78 42L42 78" stroke="#B91C1C" strokeWidth="3.5" strokeLinecap="round" />
    <rect x="36" y="86" width="48" height="12" rx="2" fill="#B91C1C" />
    <text x="60" y="95" fill="white" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      SERVICE ERROR
    </text>
  </svg>
);

export const NotFoundIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 120,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`overflow-visible select-none ${className}`}
    aria-hidden="true"
  >
    {/* Document with torn corner */}
    <path
      d="M30 20H72L90 38V96C90 99.3 87.3 102 84 102H30C26.7 102 24 99.3 24 96V26C24 22.7 26.7 20 30 20Z"
      fill="#FDFBF7"
      stroke="#D4C5B3"
      strokeWidth="2.5"
    />
    <path d="M72 20V38H90" stroke="#D4C5B3" strokeWidth="2" />
    <text x="57" y="68" fill="#1F1B16" fontSize="24" fontWeight="bold" fontFamily="serif" textAnchor="middle">
      404
    </text>
    <text x="57" y="82" fill="#8E8273" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      ARCHIVE NOT FOUND
    </text>
  </svg>
);
