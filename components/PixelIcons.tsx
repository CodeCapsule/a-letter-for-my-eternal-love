import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const PixelHeart: React.FC<IconProps> = ({ size = 24, className = "" }) => {
  // Use silhouette for buttons/locked state (white/gray text)
  const isSilhouette = className.includes('text-white') || className.includes('text-gray') || className.includes('text-slate');

  if (isSilhouette) {
     return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h4v4H4zM16 4h4v4h-4zM2 8h4v4H2zM8 8h8v4H8zM18 8h4v4h-4zM2 12h4v4H2zM18 12h4v4h-4zM4 16h4v4H4zM16 16h4v4h-4zM6 20h4v4H6zM14 20h4v4h-4zM10 24h4v-4h-4z" />
      </svg>
    );
  }

  // Multi-colored "Sparkle Heart" matching the reference
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* 1. Black Border */}
      <path fill="#000" d="M4 4h4v2H4z M16 4h4v2h-4z M2 6h2v4H2z M8 6h2v2H8z M14 6h2v2h-4z M20 6h2v4h-2z M2 10h2v4H2z M20 10h2v4h-2z M4 14h2v2H4z M18 14h2v2h-2z M6 16h2v2H6z M16 16h2v2h-2z M8 18h2v2H8z M14 18h2v2h-2z M10 20h4v2h-4z" />
      
      {/* 2. Red Fill */}
      <path fill="#ef4444" d="M4 6h4v2H4z M16 6h4v2h-4z M4 8h16v6H4z M6 14h12v2H6z M8 16h8v2H8z M10 18h4v2h-4z" />
      
      {/* 3. Dark Red Shading (Lower edge) */}
      <path fill="#be123c" d="M10 18h4v2h-4z M8 16h8v2H8z M18 10h2v4h-2z" />
      
      {/* 4. White Highlight (Top edge) */}
      <path fill="#fff" opacity="0.4" d="M5 6h2v2H5z M17 6h2v2h-2z" />

      {/* 5. Yellow Sparkles (matching the emoji reference) */}
      <g fill="#facc15">
        {/* Top Right Sparkle */}
        <path d="M18 6h1v1h-1z M17 7h3v1h-3z M18 8h1v1h-1z" />
        {/* Bottom Left Sparkle */}
        <path d="M6 16h1v1H6z M5 17h3v1H5z M6 18h1v1H6z" />
      </g>
      
      {/* Sparkle Glow (White core) */}
      <rect x="18" y="7" width="1" height="1" fill="#fff" />
      <rect x="6" y="17" width="1" height="1" fill="#fff" />
    </svg>
  );
};

export const PixelFolder: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 5h6l2 2h10v12H3V5z" fill="#eab308" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round" />
    <path d="M2 10h20l-1 11H3L2 10z" fill="#facc15" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const PixelImage: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" fill="#38bdf8" stroke="currentColor" strokeWidth="2" />
    <path d="M6 6h2v2H6z" fill="#facc15" />
    <path d="M2 16l4-4 6 6 4-4 6 6v2H2v-6z" fill="#4ade80" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const PixelVideo: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" fill="#38bdf8" stroke="currentColor" strokeWidth="2" />
    <rect x="2" y="4" width="20" height="4" fill="#0ea5e9" stroke="currentColor" strokeWidth="2" />
    <path d="M10 10l6 4-6 4V10z" fill="white" />
    <path d="M4 2h2v2H4zM8 2h2v2H8zM12 2h2v2H12zM16 2h2v2H16zM20 2h2v2H20z" fill="currentColor" />
    <path d="M4 20h2v2H4zM8 20h2v2H8zM12 20h2v2H12zM16 20h2v2H16zM20 20h2v2H20z" fill="currentColor" />
  </svg>
);

export const PixelGamepad: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8h20v10H2V8z" fill="#e5e7eb" stroke="currentColor" strokeWidth="2" />
    <path d="M5 12h2v2H5zM7 10h2v2H7zM7 14h2v2H7zM9 12h2v2H9z" fill="#374151" />
    <path d="M16 12h2v2h-2zM19 10h2v2h-2z" fill="#ef4444" />
  </svg>
);

export const PixelEnvelope: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4h20v16H2V4z" fill="#fbbf24" stroke="currentColor" strokeWidth="2" />
    <path d="M2 4l10 8 10-8" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M2 20l8-6M22 20l-8-6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const PixelFile: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2h10l6 6v14H4V2z" fill="#f3f4f6" stroke="currentColor" strokeWidth="2" />
    <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M8 10h8M8 14h8M8 18h6" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const PixelCamera: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8h20v12H2V8z" fill="#38bdf8" stroke="currentColor" strokeWidth="2" />
    <path d="M8 4h8v4H8V4z" fill="#38bdf8" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="14" r="4" fill="#f3f4f6" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="14" r="2" fill="#374151" />
    <rect x="18" y="10" width="2" height="2" fill="#facc15" />
  </svg>
);

export const PixelArrowLeft: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 12h12v-2H8zM8 10V6l-6 6 6 6v-4z" />
  </svg>
);

export const PixelArrowRight: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M16 12H4v-2h12zM16 10V6l6 6-6 6v-4z" />
  </svg>
);

export const PixelClose: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" fill="#ef4444" stroke="currentColor" strokeWidth="2" />
    <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="3" />
  </svg>
);

export const PixelTrophy: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16v6c0 4-3 6-8 6s-8-2-8-6V4z" fill="#facc15" stroke="currentColor" strokeWidth="2" />
    <path d="M2 6h2v4H2zm18 0h2v4h-2z" fill="#fbbf24" stroke="currentColor" strokeWidth="2" />
    <path d="M12 16v4M8 20h8" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const PixelLock: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 10h12v12H6V10z" fill="#fbbf24" stroke="currentColor" strokeWidth="2" />
    <path d="M9 10V6a3 3 0 1 1 6 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="11" y="14" width="2" height="4" fill="black" />
  </svg>
);

export const PixelUnlock: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 10h12v12H6V10z" fill="#4ade80" stroke="currentColor" strokeWidth="2" />
    <path d="M15 10V6a3 3 0 1 0-6 0" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="11" y="14" width="2" height="4" fill="black" />
  </svg>
);

export const PixelPlay: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" fill="#f97316" stroke="currentColor" strokeWidth="2" />
    <path d="M10 8l6 4-6 4V8z" fill="white" />
  </svg>
);

export const PixelCheck: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" fill="#22c55e" stroke="currentColor" strokeWidth="2" />
    <path d="M7 12l4 4 6-6" fill="none" stroke="white" strokeWidth="3" />
  </svg>
);