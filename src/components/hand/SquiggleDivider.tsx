import React from 'react';

interface SquiggleDividerProps {
  className?: string;
  color?: string;
}

export const SquiggleDivider: React.FC<SquiggleDividerProps> = ({
  className = '',
  color = '#D4C5B3',
}) => {
  return (
    <div className={`flex items-center justify-center my-6 overflow-hidden ${className}`}>
      <svg
        aria-hidden="true"
        className="w-48 h-4 max-w-full"
        viewBox="0 0 200 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 8C10 3 20 13 30 8C40 3 50 13 60 8C70 3 80 13 90 8C100 3 110 13 120 8C130 3 140 13 150 8C160 3 170 13 180 8C190 3 200 13 210 8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
