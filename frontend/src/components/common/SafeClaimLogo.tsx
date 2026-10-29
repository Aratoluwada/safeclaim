import React from 'react';

interface SafeClaimLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const SafeClaimLogo: React.FC<SafeClaimLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Physical postal stamp seal */}
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-lg bg-[#0A5C36] text-[#FAF4E8] shadow-sm transform -rotate-1 transition-transform hover:rotate-0 ${iconSizes[size]}`}
        title="SafeClaim Verified Official Seal"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
          aria-hidden="true"
        >
          {/* Perforated postal stamp edge */}
          <rect
            x="2"
            y="2"
            width="32"
            height="32"
            rx="4"
            stroke="#FAF4E8"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          {/* Official checkmark & receipts ribbon */}
          <path
            d="M10 18.5L15 23.5L26 12.5"
            stroke="#FAF4E8"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Nigeria seal star dot */}
          <circle cx="26" cy="24" r="1.5" fill="#FAF4E8" />
        </svg>
      </div>

      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-display font-bold tracking-tight text-[#1F1B16] dark:text-[#F4EEE4] ${textSizes[size]}`}
          >
            SafeClaim
          </span>
          <span className="text-[10px] font-mono font-bold tracking-widest text-accent uppercase px-1 py-0.5 rounded bg-accent-tint dark:bg-accent-tint">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium tracking-normal text-[#63584C] dark:text-[#A89E90] mt-0.5">
            The trusted neighbour with the receipts
          </span>
        )}
      </div>
    </div>
  );
};
