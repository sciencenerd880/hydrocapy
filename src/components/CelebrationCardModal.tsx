'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Check, Copy } from 'lucide-react';

interface CelebrationCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMl: number;
  percentage: number;
  streakDays: number;
}

export const CelebrationCardModal: React.FC<CelebrationCardModalProps> = ({
  isOpen,
  onClose,
  currentMl,
  percentage,
  streakDays,
}) => {
  const [copied, setCopied] = React.useState(false);
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  if (!isOpen) return null;

  const handleShare = async () => {
    const text = `I drank ${currentMl.toLocaleString()}ml today (${percentage}% of goal) with HydroCapy! 🦫🍊`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'HydroCapy Daily Hydration',
          text,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to copy
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-xs bg-white rounded-[32px] p-6 shadow-2xl flex flex-col items-center text-center select-none"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Celebratory Postcard (Waterllama Screen 18 Style) */}
          <div className="w-full bg-gradient-to-b from-sky-50 to-amber-50/60 rounded-3xl p-5 border border-sky-100/80 mb-5 relative overflow-hidden">
            <span className="text-[11px] font-black uppercase tracking-widest text-sky-600 block mb-1">
              Celebration Card
            </span>
            <h3 className="text-xl font-black text-stone-900 tracking-tight uppercase leading-tight mb-3">
              MY FRESH<br />
              <span className="text-sky-500">{dayName}</span>
            </h3>

            {/* Capy Graphic */}
            <div className="w-28 h-28 mx-auto my-2 relative flex items-center justify-center">
              <span className="text-6xl animate-bounce">🦫</span>
              <span className="absolute -top-1 -right-1 text-2xl">🍊</span>
              <span className="absolute -bottom-1 -left-1 text-2xl">♨️</span>
            </div>

            <div className="mt-3 pt-3 border-t border-sky-200/40">
              <span className="text-2xl font-black text-stone-900 font-mono block">
                {currentMl.toLocaleString()} ml
              </span>
              <span className="text-xs font-bold text-stone-500">
                {percentage}% of Daily Goal • Day {streakDays} Streak 🔥
              </span>
            </div>
          </div>

          {/* Share Action Buttons */}
          <div className="w-full space-y-2">
            <button
              onClick={handleShare}
              className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-black text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Share My Fresh {dayName}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl text-stone-400 hover:text-stone-700 font-bold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
