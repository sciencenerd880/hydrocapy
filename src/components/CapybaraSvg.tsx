'use client';

import React from 'react';

interface CapybaraSvgProps {
  className?: string;
  size?: number;
  hasSunglasses?: boolean;
  hasDrink?: boolean;
  hasYuzu?: boolean;
  mood?: 'happy' | 'zen' | 'sleepy' | 'cool';
}

export const CapybaraSvg: React.FC<CapybaraSvgProps> = ({
  className = '',
  size = 180,
  hasSunglasses = true,
  hasDrink = true,
  hasYuzu = false,
  mood = 'cool',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Soft shadow under float */}
        <radialGradient id="floatShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0369a1" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
        </radialGradient>

        {/* Donut ring gradient */}
        <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>

        {/* Float shine */}
        <linearGradient id="donutShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Capybara fur gradient */}
        <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D99B5C" />
          <stop offset="100%" stopColor="#B37435" />
        </linearGradient>
      </defs>

      {/* Ambient shadow in water */}
      <ellipse cx="100" cy="148" rx="72" ry="24" fill="url(#floatShadow)" />

      {/* BACK OF DONUT FLOAT */}
      <path
        d="M 38 125 C 38 90, 162 90, 162 125 C 162 145, 138 145, 100 145 C 62 145, 38 145, 38 125 Z"
        fill="#BE123C"
      />

      {/* CAPYBARA BODY */}
      <g id="capybara-character">
        {/* Rear paws / resting back */}
        <path
          d="M 68 110 C 60 90, 72 65, 100 65 C 128 65, 140 90, 132 110 C 125 125, 75 125, 68 110 Z"
          fill="url(#furGrad)"
        />

        {/* Cute rounded ears */}
        <path d="M 72 60 C 66 50, 78 45, 82 54 Z" fill="#8C531F" />
        <path d="M 128 60 C 134 50, 122 45, 118 54 Z" fill="#8C531F" />

        {/* Head and signature blunt capybara muzzle */}
        <rect x="74" y="52" width="52" height="48" rx="20" fill="url(#furGrad)" />
        
        {/* Darker muzzle snout */}
        <path
          d="M 82 74 C 82 66, 118 66, 118 74 C 118 88, 82 88, 82 74 Z"
          fill="#8C531F"
        />

        {/* Nostrils */}
        <ellipse cx="92" cy="78" rx="2.5" ry="3.5" fill="#42220A" />
        <ellipse cx="108" cy="78" rx="2.5" ry="3.5" fill="#42220A" />

        {/* Eyes (closed happy bliss or behind sunglasses) */}
        {!hasSunglasses && (
          <g stroke="#42220A" strokeWidth="2.5" strokeLinecap="round">
            <path d="M 78 68 Q 84 64 88 68" />
            <path d="M 112 68 Q 116 64 122 68" />
          </g>
        )}

        {/* Iconic Sunglasses */}
        {hasSunglasses && (
          <g id="sunglasses">
            {/* Bridge */}
            <path d="M 94 65 L 106 65" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
            {/* Left lens */}
            <rect x="72" y="60" width="24" height="15" rx="5" fill="#111827" />
            <path d="M 75 63 L 83 71" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
            {/* Right lens */}
            <rect x="104" y="60" width="24" height="15" rx="5" fill="#111827" />
            <path d="M 107 63 L 115 71" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* Front paws resting gently over the float */}
        <ellipse cx="76" cy="115" rx="10" ry="7" fill="#8C531F" />
        <ellipse cx="124" cy="115" rx="10" ry="7" fill="#8C531F" />

        {/* Optional Japanese Yuzu citrus on head */}
        {hasYuzu && (
          <g id="yuzu-orange">
            <ellipse cx="100" cy="46" rx="9" ry="8" fill="#F59E0B" />
            <path d="M 100 38 Q 104 35 106 37" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="102" cy="44" rx="2" ry="1.5" fill="#FEF08A" />
          </g>
        )}

        {/* Tropical drink held in paws */}
        {hasDrink && (
          <g id="tropical-drink" transform="translate(90, 96)">
            {/* Glass */}
            <path d="M 4 8 L 6 26 C 6 28 14 28 14 26 L 16 8 Z" fill="#FBBF24" />
            {/* Glass rim shine */}
            <ellipse cx="10" cy="8" rx="6" ry="2" fill="#FEF3C7" />
            {/* Straw */}
            <line x1="12" y1="2" x2="8" y2="18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            {/* Orange garnish slice */}
            <circle cx="5" cy="8" r="4.5" fill="#FB923C" />
            <circle cx="5" cy="8" r="3" fill="#FED7AA" />
          </g>
        )}
      </g>

      {/* FRONT OF INFLATABLE DONUT FLOAT */}
      <g id="donut-float-front">
        {/* Outer torus ring */}
        <path
          d="M 32 125 C 32 155, 60 170, 100 170 C 140 170, 168 155, 168 125 C 168 112, 148 108, 100 108 C 52 108, 32 112, 32 125 Z"
          fill="url(#donutGrad)"
        />

        {/* Glossy highlight shine */}
        <path
          d="M 44 125 C 44 116, 68 112, 100 112 C 132 112, 156 116, 156 125 C 156 121, 132 115, 100 115 C 68 115, 44 121, 44 125 Z"
          fill="url(#donutShine)"
        />

        {/* Sprinkles on donut */}
        <rect x="52" y="132" width="6" height="2.5" rx="1" fill="#FEF08A" transform="rotate(-15 52 132)" />
        <rect x="74" y="146" width="6" height="2.5" rx="1" fill="#67E8F9" transform="rotate(25 74 146)" />
        <rect x="98" y="152" width="6" height="2.5" rx="1" fill="#FDE047" transform="rotate(-8 98 152)" />
        <rect x="122" y="146" width="6" height="2.5" rx="1" fill="#A7F3D0" transform="rotate(30 122 146)" />
        <rect x="142" y="132" width="6" height="2.5" rx="1" fill="#FEF08A" transform="rotate(-20 142 132)" />
      </g>
    </svg>
  );
};
