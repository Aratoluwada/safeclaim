import React from 'react';

interface AdireStripProps {
  className?: string;
  theme?: 'green' | 'indigo' | 'warm';
}

export const AdireStrip: React.FC<AdireStripProps> = ({
  className = '',
  theme = 'green',
}) => {
  const getColors = () => {
    switch (theme) {
      case 'indigo':
        return {
          bg: '#EEF1FA',
          stroke: '#24306E',
          fill: '#24306E',
          accent: '#7D8FC6',
        };
      case 'warm':
        return {
          bg: '#F5EFEB',
          stroke: '#8E8273',
          fill: '#D4C5B3',
          accent: '#A89E90',
        };
      case 'green':
      default:
        return {
          bg: '#EBF4EF',
          stroke: '#0A5C36',
          fill: '#0A5C36',
          accent: '#4B8E6A',
        };
    }
  };

  const c = getColors();

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`w-full h-3 overflow-hidden select-none border-y border-stone-200/60 dark:border-stone-800/60 ${className}`}
      style={{ backgroundColor: c.bg }}
    >
      <svg
        className="w-full h-full opacity-70"
        viewBox="0 0 400 12"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id={`adire-${theme}`} width="40" height="12" patternUnits="userSpaceOnUse">
          {/* Diamond motif */}
          <polygon points="10,6 20,1 30,6 20,11" stroke={c.stroke} strokeWidth="1" fill="none" />
          {/* Center seed */}
          <circle cx="20" cy="6" r="1.5" fill={c.fill} />
          {/* Chevron diagonals */}
          <line x1="0" y1="1" x2="10" y2="11" stroke={c.stroke} strokeWidth="0.8" />
          <line x1="10" y1="1" x2="0" y2="11" stroke={c.stroke} strokeWidth="0.8" />
          <line x1="30" y1="1" x2="40" y2="11" stroke={c.stroke} strokeWidth="0.8" />
          <line x1="40" y1="1" x2="30" y2="11" stroke={c.stroke} strokeWidth="0.8" />
          {/* Border microdots */}
          <circle cx="5" cy="6" r="0.8" fill={c.accent} />
          <circle cx="35" cy="6" r="0.8" fill={c.accent} />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#adire-${theme})`} />
      </svg>
    </div>
  );
};
