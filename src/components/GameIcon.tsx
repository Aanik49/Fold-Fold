import React from 'react';
import { SymbolType } from '../game/types';

interface GameIconProps {
  size?: number;
  className?: string;
}

export const GameIcon: React.FC<GameIconProps> = ({ size = 48, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Fold Fold Icon"
  >
    <rect x="18" y="18" width="98" height="98" rx="14" fill="#141414" />
    <path
      d="M12 24C12 17.3726 17.3726 12 24 12H78L110 44V98C110 104.627 104.627 110 98 110H24C17.3726 110 12 104.627 12 98V24Z"
      fill="#FAF8F5"
      stroke="#141414"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <line
      x1="61"
      y1="15"
      x2="61"
      y2="107"
      stroke="#141414"
      strokeWidth="2.5"
      strokeDasharray="5 5"
      opacity="0.4"
    />
    <line
      x1="15"
      y1="61"
      x2="107"
      y2="61"
      stroke="#141414"
      strokeWidth="2.5"
      strokeDasharray="5 5"
      opacity="0.4"
    />
    <path
      d="M78 12L110 44H86C81.5817 44 78 40.4183 78 36V12Z"
      fill="#1D3557"
      stroke="#141414"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <circle cx="38.5" cy="38.5" r="12.5" stroke="#F4A261" strokeWidth="6" opacity="0.55" />
    <circle cx="36.5" cy="36.5" r="12.5" stroke="#E63946" strokeWidth="6.5" />
    <path d="M27 75L46 94M46 75L27 94" stroke="#1D3557" strokeWidth="7" strokeLinecap="butt" />
    <path
      d="M84 73L97 96H71L84 73Z"
      fill="#F4A261"
      stroke="#141414"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const SymbolIconSvg: React.FC<{ type: SymbolType; size?: number }> = ({
  type,
  size = 24,
}) => {
  switch (type) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="17" cy="17" r="9" stroke="#F4A261" strokeWidth="4" opacity="0.5" />
          <circle cx="15.5" cy="15.5" r="9" stroke="#E63946" strokeWidth="4.5" />
        </svg>
      );
    case 'cross':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M9 9L25 25M25 9L9 25" stroke="#E63946" strokeWidth="4.5" opacity="0.28" />
          <path d="M7.5 7.5L23.5 23.5M23.5 7.5L7.5 23.5" stroke="#1D3557" strokeWidth="4.8" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M17.5 7L27.5 26H7.5L17.5 7Z" fill="#141414" opacity="0.2" />
          <path
            d="M16 5.5L26 24.5H6L16 5.5Z"
            fill="#F4A261"
            stroke="#141414"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <rect x="9" y="9" width="17" height="17" fill="#E63946" />
          <rect x="7" y="7" width="17" height="17" fill="#141414" />
        </svg>
      );
    case 'wild':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <path d="M16 4L22 10L16 16L10 10L16 4Z" fill="#E63946" />
          <path d="M28 16L22 22L16 16L22 10L28 16Z" fill="#1D3557" />
          <path d="M16 28L10 22L16 16L22 22L16 28Z" fill="#F4A261" />
          <path d="M4 16L10 10L16 16L10 22L4 16Z" fill="#1E6B5C" />
          <path d="M16 4L28 16L16 28L4 16L16 4Z" stroke="#141414" strokeWidth="2.2" />
          <circle cx="16" cy="16" r="2.8" fill="#FAF8F5" stroke="#141414" strokeWidth="1.8" />
        </svg>
      );
    case 'duplex_rb':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="12.5" stroke="#1D3557" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="15" cy="16.5" r="7" stroke="#E63946" strokeWidth="3.8" />
          <circle cx="24" cy="8" r="5" fill="#1D3557" stroke="#141414" strokeWidth="1.5" />
          <path d="M22 6L26 10M26 6L22 10" stroke="#FAF8F5" strokeWidth="1.6" />
        </svg>
      );
    case 'duplex_br':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="12.5" stroke="#E63946" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <path d="M10 11.5L20 21.5M20 11.5L10 21.5" stroke="#1D3557" strokeWidth="3.8" />
          <circle cx="24" cy="8" r="5" fill="#E63946" stroke="#141414" strokeWidth="1.5" />
          <circle cx="24" cy="8" r="2.1" stroke="#FAF8F5" strokeWidth="1.5" />
        </svg>
      );
  }
};
