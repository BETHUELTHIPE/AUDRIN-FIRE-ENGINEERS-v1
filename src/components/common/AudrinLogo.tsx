import React from 'react';
import { useAudrinStore } from '../../services/store';

export interface AudrinLogoProps {
  variant?: 'full' | 'icon' | 'badge' | 'stacked';
  themeMode?: 'auto' | 'dark' | 'light';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AudrinLogo: React.FC<AudrinLogoProps> = ({
  variant = 'full',
  themeMode = 'auto',
  size = 'md',
  showTagline = false,
  className = '',
  onClick
}) => {
  const store = useAudrinStore();
  const currentTheme = store.getTheme();

  // Determine if we should render dark-mode contrast colors (crisp white for the letter 'A' and 'AUDRIN')
  // or official daylight corporate colors (Deep Navy #07193F for 'A' and 'AUDRIN')
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && currentTheme === 'dark');

  const primaryColor = isDark ? '#FFFFFF' : '#07193F';
  const detectorBg = isDark ? '#151518' : '#FFFFFF';
  const detectorStroke = isDark ? '#FFFFFF' : '#07193F';
  const redColor = '#E5252A';

  // Size scalers
  const sizeMap = {
    xs: { h: 'h-6', iconW: 24, textH: 'text-sm' },
    sm: { h: 'h-8', iconW: 32, textH: 'text-base' },
    md: { h: 'h-11', iconW: 44, textH: 'text-xl' },
    lg: { h: 'h-14', iconW: 56, textH: 'text-2xl' },
    xl: { h: 'h-20', iconW: 80, textH: 'text-4xl' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Render SVG Emblem
  const renderEmblem = (w: number = currentSize.iconW) => (
    <svg 
      viewBox="0 0 200 200" 
      width={w} 
      height={w} 
      className="shrink-0 transition-transform duration-200"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Red Alarm Signal Sound Waves (Left) */}
      <path 
        d="M 52 58 C 30 78, 30 122, 52 142" 
        stroke={redColor} 
        strokeWidth="13" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M 32 40 C 0 74, 0 126, 32 160" 
        stroke={redColor} 
        strokeWidth="13" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Red Alarm Signal Sound Waves (Right) */}
      <path 
        d="M 148 58 C 170 78, 170 122, 148 142" 
        stroke={redColor} 
        strokeWidth="13" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M 168 40 C 200 74, 200 126, 168 160" 
        stroke={redColor} 
        strokeWidth="13" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Navy/White Letter 'A' Frame */}
      <path 
        d="M 86 28 L 114 28 L 174 168 L 138 168 L 123 132 L 77 132 L 62 168 L 26 168 Z M 100 56 L 85 96 L 115 96 Z" 
        fill={primaryColor} 
        fillRule="evenodd" 
      />

      {/* Smoke Detector Head Base */}
      <path 
        d="M 64 122 C 64 102, 136 102, 136 122 L 128 152 C 128 164, 72 164, 72 152 Z" 
        fill={detectorBg} 
        stroke={detectorStroke} 
        strokeWidth="7" 
        strokeLinejoin="round"
      />
      
      {/* Detector Upper Collar */}
      <path 
        d="M 67 122 C 67 110, 133 110, 133 122" 
        stroke={detectorStroke} 
        strokeWidth="6" 
      />

      {/* Detector Chamber Slits */}
      <line x1="100" y1="126" x2="100" y2="144" stroke={detectorStroke} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="91" y1="127" x2="91" y2="143" stroke={detectorStroke} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="109" y1="127" x2="109" y2="143" stroke={detectorStroke} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="82" y1="129" x2="83" y2="141" stroke={detectorStroke} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="118" y1="129" x2="117" y2="141" stroke={detectorStroke} strokeWidth="4.5" strokeLinecap="round" />

      {/* Center Alarm Sensor / Red LED Dot */}
      <circle cx="100" cy="151" r="5.5" fill={redColor} />
    </svg>
  );

  // If badge variant is chosen (e.g. pristine white card container displaying true corporate colors)
  if (variant === 'badge') {
    return (
      <div 
        onClick={onClick}
        className={`inline-flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-md border border-slate-200/80 ${onClick ? 'cursor-pointer hover:shadow-lg transition' : ''} ${className}`}
      >
        {/* Full vector SVG in true corporate navy and red */}
        <div className="h-10 w-auto flex items-center">
          <img 
            src="/audrin-logo.svg" 
            alt="Audrin Fire Engineers Logo" 
            className="h-10 w-auto object-contain" 
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  // If icon-only variant is requested
  if (variant === 'icon') {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="Audrin Fire Engineers"
      >
        {renderEmblem()}
      </div>
    );
  }

  // Full Wordmark + Emblem (Default)
  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      aria-label="Audrin Fire Engineers"
    >
      {renderEmblem()}

      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center">
          <span 
            className="font-extrabold uppercase tracking-tight"
            style={{ 
              color: primaryColor,
              fontSize: size === 'xs' ? '14px' : size === 'sm' ? '18px' : size === 'lg' ? '28px' : size === 'xl' ? '38px' : '22px',
              fontFamily: "system-ui, -apple-system, 'Montserrat', 'Inter', 'Arial Black', sans-serif"
            }}
          >
            AUDRIN
          </span>
        </div>
        <div className="flex items-center mt-0.5">
          <span 
            className="font-bold uppercase tracking-[3.2px] text-[#E5252A]"
            style={{ 
              fontSize: size === 'xs' ? '7px' : size === 'sm' ? '8.5px' : size === 'lg' ? '12px' : size === 'xl' ? '15px' : '9.5px',
              fontFamily: "system-ui, -apple-system, 'Montserrat', 'Inter', sans-serif"
            }}
          >
            FIRE ENGINEERS
          </span>
        </div>
        {showTagline && (
          <span className="text-[9px] text-[#C1A461] uppercase tracking-[1.5px] font-semibold mt-1 hidden sm:block">
            Early Detection. Clear Warning. Safer Buildings.
          </span>
        )}
      </div>
    </div>
  );
};
