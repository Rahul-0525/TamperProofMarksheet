import React from 'react';

interface LpuLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LpuLogo: React.FC<LpuLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const iconDimensions = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  return (
    <div className={`flex items-center space-x-3.5 ${className}`}>
      {/* Official LPU Crest Shield (Pristine Scalable Vector) */}
      <div
        className={`${iconDimensions} flex-shrink-0 relative group transition-transform duration-300 hover:scale-105`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Crest Outer Golden Gradient */}
            <linearGradient id="lpuGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Crest Inner Deep Field Gradient */}
            <linearGradient id="lpuShieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a352e" />
              <stop offset="100%" stopColor="#0e201b" />
            </linearGradient>

            {/* Flame Torch Radial Glow */}
            <radialGradient id="torchGlow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Outer Shield Border */}
          <path
            d="M50 4 L88 20 C88 56 68 84 50 96 C32 84 12 56 12 20 Z"
            fill="url(#lpuShieldBg)"
            stroke="url(#lpuGold)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Golden Inset Line */}
          <path
            d="M50 10 L82 24 C82 53 65 77 50 88 C35 77 18 53 18 24 Z"
            fill="none"
            stroke="url(#lpuGold)"
            strokeWidth="1.2"
            strokeOpacity="0.6"
          />

          {/* Sun / Torch Rays of Enlightenment */}
          <g opacity="0.85">
            <line x1="50" y1="20" x2="50" y2="14" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="43" y1="22" x2="39" y2="17" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="57" y1="22" x2="61" y2="17" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="38" y1="27" x2="33" y2="24" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="62" y1="27" x2="67" y2="24" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Academic Torch / Flame */}
          <path
            d="M50 20 C45 27 48 33 50 36 C52 33 55 27 50 20 Z"
            fill="url(#lpuGold)"
          />
          <circle cx="50" cy="27" r="4" fill="url(#torchGlow)" />

          {/* Open Knowledge Book */}
          <path
            d="M50 43 C43 39 34 40 28 42 L28 49 C34 47 43 46 50 50 C57 46 66 47 72 49 L72 42 C66 40 57 39 50 43 Z"
            fill="url(#lpuGold)"
            opacity="0.9"
          />
          <line x1="50" y1="43" x2="50" y2="50" stroke="#0e201b" strokeWidth="1" />

          {/* Stylized Bold LPU Monogram */}
          <text
            x="50"
            y="67"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="15"
            fontWeight="900"
            fontFamily="Outfit, sans-serif"
            letterSpacing="1.2"
          >
            LPU
          </text>

          {/* Estd. 2005 Ribbon Banner */}
          <rect x="33" y="72" width="34" height="6.5" rx="3.2" fill="#f59e0b" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="0.8" />
          <text
            x="50"
            y="77"
            textAnchor="middle"
            fill="#fbbf24"
            fontSize="5.2"
            fontWeight="800"
            fontFamily="JetBrains Mono, monospace"
            letterSpacing="0.8"
          >
            ESTD 2005
          </text>

          {/* 3 Golden Stars */}
          <g fill="#fbbf24" opacity="0.95">
            <polygon points="50,82 51,84.5 53.5,84.5 51.5,86 52.2,88.5 50,87 47.8,88.5 48.5,86 46.5,84.5 49,84.5" transform="scale(0.8) translate(12, 18)" />
            <polygon points="50,82 51,84.5 53.5,84.5 51.5,86 52.2,88.5 50,87 47.8,88.5 48.5,86 46.5,84.5 49,84.5" transform="scale(0.8) translate(-1, 18)" />
            <polygon points="50,82 51,84.5 53.5,84.5 51.5,86 52.2,88.5 50,87 47.8,88.5 48.5,86 46.5,84.5 49,84.5" transform="scale(0.8) translate(25, 18)" />
          </g>
        </svg>
      </div>

      {/* Official Typography Badge */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 leading-tight">
            <span className="font-display font-extrabold text-white text-sm sm:text-base tracking-tight">
              LOVELY PROFESSIONAL UNIVERSITY
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#fbbf24] tracking-wider uppercase font-mono mt-0.5">
            Transforming Education &bull; Transforming India
          </span>
          <span className="text-[9px] sm:text-[10px] text-pine-200/80 font-medium tracking-normal mt-0.5">
            NAAC A++ Accredited &bull; Division of Academic Affairs &bull; Office of Examinations
          </span>
        </div>
      )}
    </div>
  );
};
