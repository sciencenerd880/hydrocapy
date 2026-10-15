'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BEVERAGES } from '../store/hydrationStore';
import { BeverageType } from '../types';
import { soundFx } from '../utils/soundEffects';
import { X, Minus, Plus } from 'lucide-react';

export type VesselType = 'glass' | 'mug' | 'bottle' | 'flask';

interface VesselPreset {
  id: VesselType;
  label: string;
  defaultMl: number;
}

const VESSEL_PRESETS: VesselPreset[] = [
  { id: 'glass', label: 'Glass', defaultMl: 250 },
  { id: 'mug', label: 'Mug', defaultMl: 330 },
  { id: 'bottle', label: 'Bottle', defaultMl: 500 },
  { id: 'flask', label: 'Flask', defaultMl: 750 },
];

interface VesselModalProps {
  isOpen: boolean;
  onClose: () => void;
  beverageType: BeverageType;
  onConfirmLog: (type: BeverageType, amountMl: number) => void;
}

export const VesselModal: React.FC<VesselModalProps> = ({
  isOpen,
  onClose,
  beverageType,
  onConfirmLog,
}) => {
  const config = BEVERAGES[beverageType];
  const [selectedVessel, setSelectedVessel] = useState<VesselType>('glass');
  const [amountMl, setAmountMl] = useState<number>(config.defaultAmount || 250);

  // Sync default amount when beverage changes
  React.useEffect(() => {
    setAmountMl(config.defaultAmount || 250);
  }, [beverageType, config.defaultAmount]);

  if (!isOpen) return null;

  const handleSelectVessel = (vessel: VesselPreset) => {
    setSelectedVessel(vessel.id);
    setAmountMl(vessel.defaultMl);
  };

  const adjustAmount = (delta: number) => {
    setAmountMl((prev) => Math.max(50, Math.min(2000, prev + delta)));
  };

  const handleConfirm = () => {
    soundFx.playSplashSound();
    onConfirmLog(beverageType, amountMl);
    onClose();
  };

  // Liquid percentage in vessel (capped at 1000ml for visualization)
  const maxCapacity = selectedVessel === 'flask' ? 1200 : selectedVessel === 'bottle' ? 800 : 400;
  const fillPct = Math.min(100, Math.max(15, (amountMl / maxCapacity) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-md p-0 sm:p-4">
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-sm bg-white rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl flex flex-col items-center select-none"
        >
          {/* Top Grab Handle on Mobile */}
          <div className="w-12 h-1.5 bg-stone-200 rounded-full mb-4 sm:hidden" />

          {/* Header Row: Drink Pill & Close Button */}
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="font-extrabold text-stone-900 text-sm tracking-tight">
                {config.label}
              </span>
              <span className="text-[11px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                {Math.round(config.hydrationFactor * 100)}% Hydration
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Centered Realistic Vessel Vector SVG (Waterllama Style) */}
          <div className="relative w-48 h-56 my-2 flex items-center justify-center">
            <svg
              viewBox="0 0 160 200"
              className="w-full h-full drop-shadow-md"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="vesselClip">
                  {selectedVessel === 'glass' && (
                    <path d="M 28 20 L 40 185 Q 42 195 55 195 L 105 195 Q 118 195 120 185 L 132 20 Z" />
                  )}
                  {selectedVessel === 'mug' && (
                    <path d="M 30 40 L 32 175 Q 34 190 50 190 L 110 190 Q 126 190 128 175 L 130 40 Z" />
                  )}
                  {selectedVessel === 'bottle' && (
                    <path d="M 68 15 L 68 35 Q 50 45 42 65 L 40 180 Q 42 195 55 195 L 105 195 Q 118 195 120 180 L 118 65 Q 110 45 92 35 L 92 15 Z" />
                  )}
                  {selectedVessel === 'flask' && (
                    <path d="M 45 25 L 45 180 Q 45 195 58 195 L 102 195 Q 115 195 115 180 L 115 25 Z" />
                  )}
                </clipPath>

                <linearGradient id="vesselLiquidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.lightColor || '#7DD3FC'} />
                  <stop offset="100%" stopColor={config.color} />
                </linearGradient>

                <linearGradient id="vesselGlassShine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* Mug Handle (if mug) */}
              {selectedVessel === 'mug' && (
                <path
                  d="M 125 65 Q 155 70 155 110 Q 155 150 124 155"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              )}

              {/* Vessel Background Body */}
              {selectedVessel === 'glass' && (
                <path
                  d="M 28 20 L 40 185 Q 42 195 55 195 L 105 195 Q 118 195 120 185 L 132 20 Z"
                  fill="#F8FAFC"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                />
              )}
              {selectedVessel === 'mug' && (
                <path
                  d="M 30 40 L 32 175 Q 34 190 50 190 L 110 190 Q 126 190 128 175 L 130 40 Z"
                  fill="#F8FAFC"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                />
              )}
              {selectedVessel === 'bottle' && (
                <path
                  d="M 68 15 L 68 35 Q 50 45 42 65 L 40 180 Q 42 195 55 195 L 105 195 Q 118 195 120 180 L 118 65 Q 110 45 92 35 L 92 15 Z"
                  fill="#F8FAFC"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                />
              )}
              {selectedVessel === 'flask' && (
                <path
                  d="M 45 25 L 45 180 Q 45 195 58 195 L 102 195 Q 115 195 115 180 L 115 25 Z"
                  fill="#F8FAFC"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                />
              )}

              {/* Masked Liquid Fill Level */}
              <g clipPath="url(#vesselClip)">
                <rect
                  x="0"
                  y={195 - (fillPct / 100) * 175}
                  width="160"
                  height="200"
                  fill="url(#vesselLiquidGrad)"
                  className="transition-all duration-300 ease-out"
                />
                {/* Surface Meniscus / Wave */}
                <ellipse
                  cx="80"
                  cy={195 - (fillPct / 100) * 175}
                  rx="48"
                  ry="5"
                  fill="#FFFFFF"
                  fillOpacity="0.45"
                />
                {/* Gentle bubbles */}
                <circle cx="65" cy={195 - (fillPct / 100) * 175 + 30} r="2.5" fill="#FFFFFF" fillOpacity="0.5" />
                <circle cx="95" cy={195 - (fillPct / 100) * 175 + 50} r="3" fill="#FFFFFF" fillOpacity="0.5" />
              </g>

              {/* Glass Reflection Highlight */}
              <g clipPath="url(#vesselClip)">
                <rect x="0" y="0" width="160" height="200" fill="url(#vesselGlassShine)" />
              </g>
            </svg>
          </div>

          {/* Volume Typography & Step Adjuster (Screen 2 / 8 style) */}
          <div className="flex items-center justify-center gap-4 my-2">
            <button
              onClick={() => adjustAmount(-50)}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-black flex items-center justify-center transition-all active:scale-90"
            >
              <Minus className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-stone-900 tracking-tight font-mono">
                {amountMl}
              </span>
              <span className="text-lg font-bold text-stone-400">ml</span>
            </div>

            <button
              onClick={() => adjustAmount(50)}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-black flex items-center justify-center transition-all active:scale-90"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Vessel Preset Segmented Picker */}
          <div className="w-full flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl my-3">
            {VESSEL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectVessel(preset)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedVessel === preset.id
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Signature Waterllama CTA Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleConfirm}
            className="w-full py-4 mt-2 rounded-2xl text-white font-black text-base shadow-lg transition-transform flex items-center justify-center gap-2"
            style={{
              backgroundColor: config.color,
              boxShadow: `0 8px 24px ${config.color}40`,
            }}
          >
            <span>+ {amountMl} ml {config.label.toUpperCase()}</span>
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
