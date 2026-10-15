'use client';

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// 1. Water: Glossy Droplet with Refraction Shine
export const WaterIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="waterDropGrad" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    {/* Droplet Body */}
    <path
      d="M16 4C16 4 7 15.2 7 20.5C7 25.1944 11.0294 29 16 29C20.9706 29 25 25.1944 25 20.5C25 15.2 16 4 16 4Z"
      fill="url(#waterDropGrad)"
    />
    {/* Specular Highlight */}
    <path
      d="M12 18C12 15 13.5 12 15 10"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    <circle cx="12" cy="22" r="1.5" fill="#FFFFFF" fillOpacity="0.6" />
  </svg>
);

// 2. Green Tea: Japanese Matcha Bowl with Steam
export const TeaIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="teaGrad" x1="16" y1="12" x2="16" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Steam lines */}
    <path
      d="M12 7C11.5 5.5 12.5 4.5 13 4"
      stroke="#10B981"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    <path
      d="M19 8C18.5 6 19.5 5 20 4.5"
      stroke="#10B981"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    {/* Teacup Ceramic Bowl */}
    <path
      d="M5 12C5 12 6 23 16 23C26 23 27 12 27 12H5Z"
      fill="url(#teaGrad)"
    />
    {/* Saucer / Coaster */}
    <path
      d="M8 26C11 27.5 21 27.5 24 26"
      stroke="#047857"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Inner Tea Surface Highlight */}
    <ellipse cx="16" cy="12" rx="10" ry="2.5" fill="#6EE7B7" />
  </svg>
);

// 3. Coffee: Cozy Ceramic Mug with Latte Heart
export const CoffeeIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="coffeeGrad" x1="14" y1="11" x2="14" y2="27" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
    {/* Handle */}
    <path
      d="M22 14C25.5 14 27 16 27 18.5C27 21 25.5 23 22 23"
      stroke="#92400E"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Mug Body */}
    <rect x="5" y="11" width="18" height="15" rx="5" fill="url(#coffeeGrad)" />
    {/* Coffee Top Oval */}
    <ellipse cx="14" cy="11" rx="8" ry="2.5" fill="#451A03" />
    {/* Crema / Foam Heart */}
    <path
      d="M14 11C13.5 10 12 10.5 12.5 11.5L14 12.5L15.5 11.5C16 10.5 14.5 10 14 11Z"
      fill="#FEF3C7"
    />
    {/* Mug Reflection */}
    <path
      d="M8 15V22"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.4"
    />
  </svg>
);

// 4. Fresh Juice: Glass with Straw & Citrus Accent
export const JuiceIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="juiceGrad" x1="16" y1="12" x2="16" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    {/* Straw */}
    <path
      d="M20 4L16 14"
      stroke="#EF4444"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M20 4L23 5"
      stroke="#EF4444"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Glass Cup */}
    <path
      d="M8 12L10 26C10.2 27.2 11.2 28 12.5 28H19.5C20.8 28 21.8 27.2 22 26L24 12H8Z"
      fill="url(#juiceGrad)"
    />
    {/* Citrus Slice on Rim */}
    <circle cx="9" cy="12" r="4.5" fill="#FBBF24" />
    <circle cx="9" cy="12" r="3" fill="#FEF08A" />
    {/* Liquid Surface */}
    <ellipse cx="16" cy="12" rx="7.5" ry="2" fill="#FDBA74" />
  </svg>
);

// 5. Electrolyte: Sports Hydro Flask
export const ElectrolyteIcon: React.FC<IconProps> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="electroGrad" x1="16" y1="8" x2="16" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    {/* Cap / Spout */}
    <rect x="13" y="4" width="6" height="4" rx="2" fill="#0E7490" />
    {/* Bottle Body */}
    <rect x="9" y="8" width="14" height="20" rx="5" fill="url(#electroGrad)" />
    {/* Energy Lightning Badge */}
    <path
      d="M17 12L13 18H16L15 24L19 17H16L17 12Z"
      fill="#FDE047"
    />
  </svg>
);
