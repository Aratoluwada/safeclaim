import React from 'react';

interface HandCircleProps {
  className?: string;
  color?: string;
  children: React.ReactNode;
}

export const HandCircle: React.FC<HandCircleProps> = ({
  className = '',
  color = '#0A5C36',
  children,
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        className="absolute -inset-x-2 -inset-y-1.5 w-[calc(100%+1rem)] h-[calc(100%+0.75rem)] pointer-events-none overflow-visible"
        viewBox="0 0 100 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M6 25C5 12 24 4 52 4C80 4 95 12 94 26C93 39 74 46 48 46C22 46 4 38 7 24"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="260"
          strokeDashoffset="0"
        />
      </svg>
    </span>
  );
};
