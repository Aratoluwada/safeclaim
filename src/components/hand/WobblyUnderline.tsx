import React from 'react';

interface WobblyUnderlineProps {
  className?: string;
  color?: string;
  width?: number | string;
}

export const WobblyUnderline: React.FC<WobblyUnderlineProps> = ({
  className = '',
  color = '#0A5C36',
  width = '100%',
}) => {
  return (
    <svg
      aria-hidden="true"
      className={`inline-block overflow-visible ${className}`}
      width={width}
      height="12"
      viewBox="0 0 120 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2 7.5C18 3.5 35 10 52 6C68 2.5 86 9.5 102 5.5C108 4 114 6 118 7"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
