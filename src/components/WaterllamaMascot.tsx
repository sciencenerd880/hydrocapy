'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BEVERAGES } from '../store/hydrationStore';
import { BeverageType, DrinkLog } from '../types';
import { Sparkles, Trash2, ChevronDown } from 'lucide-react';

interface WaterllamaMascotProps {
  currentMl: number;
  goalMl: number;
  percentage: number;
  logs: DrinkLog[];
  onRemoveLog: (id: string) => void;
  breakdown: {
    type: BeverageType;
    amount: number;
    percentage: number;
    config: (typeof BEVERAGES)[BeverageType];
  }[];
}

export const WaterllamaMascot: React.FC<WaterllamaMascotProps> = ({
  currentMl,
  goalMl,
  percentage,
  logs,
  onRemoveLog,
  breakdown,
}) => {
  const [showHistory, setShowHistory] = React.useState(false);

  // Height of Capybara container is 240px. Liquid fills from bottom (y=210) to top (y=30)
  const totalFillableHeight = 180;
  const fillHeight = (Math.min(100, percentage) / 100) * totalFillableHeight;
  const liquidTopY = 210 - fillHeight;

  // Capybara Side-Profile Silhouette Vector Path (High-Craft Scaled to 240x240)
  const capySilhouettePath = `
    M 42 210
    C 28 205, 20 168, 26 132
    C 32 108, 50 96, 78 90
    C 98 84, 114 72, 128 56
    C 132 44, 144 42, 150 50
    C 156 44, 168 44, 172 54
    C 178 62, 196 68, 210 80
    C 220 90, 222 104, 218 120
    C 212 128, 196 132, 184 132
    C 178 144, 180 170, 186 198
    C 190 208, 184 210, 172 210
    Z
  `;

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* 1. Ultra-clean Waterllama Header */}
      <div className="text-center my-3">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
          Daily Hydration
        </h2>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl font-black text-stone-900 tracking-tight font-mono">
            {currentMl.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-stone-400">
            / {goalMl.toLocaleString()} ml
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-extrabold mt-1.5">
          <span>{percentage}% of goal</span>
          {percentage >= 100 && <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
        </div>
      </div>

      {/* 2. Hero Capybara Liquid Mascot (Large, Centered, Waterllama Style) */}
      <div className="relative w-72 h-72 my-2 flex items-center justify-center">
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full drop-shadow-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* The Capybara Clip Mask */}
            <clipPath id="waterllamaCapyMask">
              <path d={capySilhouettePath} />
            </clipPath>

            {/* Subtle frosted glass reflection */}
            <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>

            {/* Water Wave Gradient */}
            <linearGradient id="waterWaveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          {/* Background Empty Silhouette Container */}
          <path
            d={capySilhouettePath}
            fill="#F5F5F4"
            stroke="#E7E5E4"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Liquid Contents Masked to Capybara Shape */}
          <g clipPath="url(#waterllamaCapyMask)">
            {/* Animated Liquid Base */}
            <rect
              x="0"
              y={liquidTopY}
              width="240"
              height="240"
              fill="url(#waterWaveGrad)"
              className="transition-all duration-700 ease-out"
            />

            {/* Wave Crest Slosh Animation */}
            {percentage > 0 && (
              <path
                d={`
                  M 0 ${liquidTopY}
                  Q 60 ${liquidTopY - 7}, 120 ${liquidTopY}
                  T 240 ${liquidTopY}
                  V 240 H 0 Z
                `}
                fill="#7DD3FC"
                opacity="0.8"
                className="animate-wave-pulse"
              />
            )}

            {/* Stacked Secondary Beverages (Tea / Coffee / Juice) */}
            {breakdown.length > 1 && (
              <rect
                x="0"
                y={liquidTopY + fillHeight * 0.45}
                width="240"
                height={fillHeight * 0.4}
                fill={breakdown[1]?.config.color || '#F59E0B'}
                opacity="0.9"
                className="transition-all duration-700"
              />
            )}

            {/* Subtle Floating Bubbles inside liquid */}
            {percentage > 15 && (
              <g fill="#FFFFFF" fillOpacity="0.5">
                <circle cx="80" cy={liquidTopY + 35} r="2.5" />
                <circle cx="140" cy={liquidTopY + 55} r="3.5" />
                <circle cx="110" cy={liquidTopY + 85} r="2" />
                <circle cx="170" cy={liquidTopY + 40} r="3" />
              </g>
            )}
          </g>

          {/* Outer Glass Highlight Contour */}
          <path
            d={capySilhouettePath}
            fill="none"
            stroke="url(#glassReflection)"
            strokeWidth="4"
          />

          {/* Capybara Eye & Nose Details (Clean Minimalist Aesthetics) */}
          <ellipse cx="188" cy="100" rx="3" ry="4.5" fill="#292524" />
          <path
            d="M 160 84 Q 166 78 172 84"
            stroke="#292524"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 3. Minimalist Beverage Distribution Dots (No wordy cards!) */}
      {breakdown.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-1 px-4">
          {breakdown.map((item) => (
            <div key={item.type} className="flex items-center gap-1.5 text-xs text-stone-600 font-semibold">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-xs"
                style={{ backgroundColor: item.config.color }}
              />
              <span>{item.config.label}</span>
              <span className="text-stone-400 font-mono text-[11px]">{item.amount}ml</span>
            </div>
          ))}
        </div>
      )}

      {/* 4. Collapsible History Dropdown (Clean, Unobtrusive) */}
      <div className="w-full max-w-sm mt-4 px-2">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-stone-400 hover:text-stone-700 transition-colors"
        >
          <span>{showHistory ? 'Hide Intake History' : `Today's Log (${logs.length})`}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`} />
        </button>

        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-1"
          >
            {logs.map((log) => {
              const cfg = BEVERAGES[log.type];
              const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-100/70 text-xs"
                >
                  <div className="flex items-center gap-2 font-semibold text-stone-700">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span>{cfg.label}</span>
                    <span className="text-stone-400 font-normal">{timeStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-800 font-mono">+{log.amountMl} ml</span>
                    <button
                      onClick={() => onRemoveLog(log.id)}
                      className="text-stone-300 hover:text-red-500 p-0.5 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};
