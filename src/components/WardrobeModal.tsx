'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CAPY_SKINS } from '../store/hydrationStore';
import { CapySkin } from '../types';
import { soundFx } from '../utils/soundEffects';
import { X, Check, Sparkles, Award } from 'lucide-react';

interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSkin: CapySkin;
  onSelectSkin: (skin: CapySkin) => void;
  streakDays: number;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen,
  onClose,
  activeSkin,
  onSelectSkin,
  streakDays,
}) => {
  if (!isOpen) return null;

  const handleEquip = (skinId: CapySkin) => {
    soundFx.playChimeSound();
    onSelectSkin(skinId);
  };

  const challengeDays = [1, 2, 3, 4, 5, 6, 7];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-md p-0 sm:p-4">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-sm bg-[#FAF8F5] rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl flex flex-col select-none max-h-[90vh] overflow-y-auto"
        >
          {/* Top Grab Handle */}
          <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-4 sm:hidden" />

          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦫</span>
              <div>
                <h3 className="text-base font-black text-stone-900 tracking-tight">
                  Capy Wardrobe
                </h3>
                <p className="text-[11px] font-bold text-stone-400">
                  Hot Spring Club & Costumes
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 7-Day Onsen Hydration Challenge Banner */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-4 shadow-lg mb-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">♨️</span>
                <span className="text-xs font-black uppercase tracking-wider">
                  7-Day Onsen Challenge
                </span>
              </div>
              <span className="text-[11px] font-bold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                Day {Math.min(7, streakDays)} of 7
              </span>
            </div>

            <p className="text-[12px] text-amber-100 font-medium mb-3">
              Maintain daily hydration to keep the onsen warm and earn mythical capybara friends!
            </p>

            {/* 7 Days Progress Track */}
            <div className="flex items-center justify-between gap-1">
              {challengeDays.map((d) => {
                const isCompleted = d <= streakDays;
                const isCurrent = d === streakDays;
                return (
                  <div key={d} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-transform ${
                        isCompleted
                          ? 'bg-white text-orange-600 shadow-sm'
                          : isCurrent
                          ? 'bg-amber-300 text-amber-950 ring-2 ring-white animate-pulse'
                          : 'bg-white/20 text-white/70'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : d}
                    </div>
                    <span className="text-[9px] font-bold text-white/80">D{d}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skins Collection (Inspired by Screen Char 2) */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-black text-stone-800 uppercase tracking-wider">
                Select Outfit
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                4 Unlocked
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(CAPY_SKINS) as CapySkin[]).map((skinId) => {
                const skin = CAPY_SKINS[skinId];
                const isEquipped = activeSkin === skinId;

                return (
                  <motion.button
                    key={skinId}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEquip(skinId)}
                    className={`relative p-3.5 rounded-3xl border-2 text-left transition-all flex flex-col justify-between ${
                      isEquipped
                        ? 'border-amber-500 bg-white shadow-md ring-2 ring-amber-400/30'
                        : 'border-stone-200/90 bg-white/70 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-2xl">{skin.emoji}</span>
                      {isEquipped ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" />
                          EQUIPPED
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-stone-400 uppercase">
                          {skin.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-stone-900 tracking-tight leading-tight mb-0.5">
                        {skin.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium line-clamp-2 leading-relaxed">
                        {skin.subtitle}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400 font-semibold px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              100% Free • No In-App Purchases
            </span>
            <button
              onClick={onClose}
              className="text-stone-700 font-black hover:text-stone-900"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
