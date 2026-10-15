'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationConfettiProps {
  isActive: boolean;
}

const CONFETTI_COLORS = [
  '#38BDF8', // Sky blue
  '#A3E635', // Lime / Matcha
  '#FB923C', // Citrus orange
  '#F472B6', // Blossom pink
  '#FBBF24', // Yuzu yellow
  '#C084FC', // Lavender
  '#2DD4BF', // Turquoise
];

export const CelebrationConfetti: React.FC<CelebrationConfettiProps> = ({ isActive }) => {
  const pieces = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // 0 - 100% viewport width
      delay: Math.random() * 2.5,
      duration: 3 + Math.random() * 2.5,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      isCircle: i % 4 === 0,
    }));
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {pieces.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              position: 'absolute',
              left: `${p.x}%`,
              top: '-5%',
              opacity: 1,
              rotate: p.rotation,
              scale: 0.8,
            }}
            animate={{
              top: '105%',
              rotate: p.rotation + 540,
              x: [0, (p.id % 2 === 0 ? 30 : -30), 0],
              opacity: [1, 1, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              width: p.size,
              height: p.isCircle ? p.size : p.size * 1.6,
              borderRadius: p.isCircle ? '9999px' : '2px',
              backgroundColor: p.color,
              boxShadow: `0 2px 6px ${p.color}40`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
