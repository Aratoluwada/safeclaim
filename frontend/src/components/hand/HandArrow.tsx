import React from 'react';

interface HandArrowProps {
  className?: string;
  color?: string;
  direction?: 'down-right' | 'right' | 'up-right' | 'curve-down';
}

export const HandArrow: React.FC<HandArrowProps> = ({
  className = '',
  color = '#27358F',
  direction = 'down-right',
}) => {
  return (
    <svg
      aria-hidden="true"
      className={`inline-block overflow-visible ${className}`}
      width="48"
      height="36"
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {direction === 'down-right' && (
        <path
          d="M4 6C14 7 28 12 36 26M36 26L26 26M36 26L37 16"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {direction === 'right' && (
        <path
          d="M4 18C16 16 30 18 40 18M40 18L32 10M40 18L32 26"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {direction === 'curve-down' && (
        <path
          d="M8 4C12 18 20 28 38 28M38 28L30 22M38 28L30 33"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {direction === 'up-right' && (
        <path
          d="M6 30C12 24 24 16 38 8M38 8L28 7M38 8L39 18"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};
