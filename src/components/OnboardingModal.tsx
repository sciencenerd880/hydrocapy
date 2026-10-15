'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MASCOTS } from '../store/hydrationStore';
import { MascotId } from '../types';
import { soundFx } from '../utils/soundEffects';
import { Sparkles, Check, ChevronRight, Droplet } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (mascot: MascotId, goalMl: number) => void;
  onLogFirstDrink?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onLogFirstDrink,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMascot, setSelectedMascot] = useState<MascotId>('capybara');
  const [targetGoal, setTargetGoal] = useState<number>(2200);
  const [hasLoggedFirstDrink, setHasLoggedFirstDrink] = useState(false);

  if (!isOpen) return null;

  const handleSelectMascot = (id: MascotId) => {
    soundFx.playChimeSound();
    setSelectedMascot(id);
  };

  const handleFirstDrink = () => {
    soundFx.playSplashSound();
    setHasLoggedFirstDrink(true);
    if (onLogFirstDrink) {
      onLogFirstDrink();
    }
  };

  const handleFinish = () => {
    soundFx.playChimeSound();
    onComplete(selectedMascot, targetGoal);
  };

  const mascotList: { id: MascotId; name: string; desc: string; emoji: string }[] = [
    {
      id: 'capybara',
      name: 'Chill Capy',
      desc: 'Zen master who loves warm onsens and floating yuzu.',
      emoji: '🦫',
    },
    {
      id: 'otter',
      name: 'Floaty Otter',
      desc: 'Playful river drifter who floats smoothly on the water.',
      emoji: '🦦',
    },
    {
      id: 'duckie',
      name: 'Bath Duckie',
      desc: 'Cozy yellow bath buddy who never lets you get thirsty.',
      emoji: '🐥',
    },
  ];

  const goalPresets = [1800, 2200, 2600, 3000];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-sm bg-[#FAF8F5] rounded-[36px] p-6 shadow-2xl flex flex-col items-center select-none"
        >
          {/* Step Indicator */}
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
              Step {step} of 3
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-2 h-2 rounded-full transition-all ${
                    s === step ? 'w-5 bg-sky-500' : 'bg-stone-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* STEP 1: Pick Mascot */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full text-center space-y-4"
            >
              <div>
                <h3 className="text-xl font-black text-stone-900 tracking-tight">
                  Choose Your Companion
                </h3>
                <p className="text-xs font-semibold text-stone-400 mt-0.5">
                  Your buddy will fill up as you drink!
                </p>
              </div>

              <div className="space-y-2.5 my-2">
                {mascotList.map((m) => {
                  const isSelected = selectedMascot === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleSelectMascot(m.id)}
                      className={`w-full p-3.5 rounded-3xl border-2 transition-all flex items-center gap-3.5 text-left ${
                        isSelected
                          ? 'border-sky-500 bg-white shadow-md ring-2 ring-sky-200'
                          : 'border-stone-200 bg-white/70 hover:bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-3xl flex-shrink-0">
                        {m.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-stone-900">{m.name}</h4>
                          {isSelected && <Check className="w-4 h-4 text-sky-600 stroke-[3]" />}
                        </div>
                        <p className="text-[11px] text-stone-500 font-medium leading-snug mt-0.5">
                          {m.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Set Daily Goal */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full text-center space-y-4"
            >
              <div>
                <h3 className="text-xl font-black text-stone-900 tracking-tight">
                  Daily Hydration Target
                </h3>
                <p className="text-xs font-semibold text-stone-400 mt-0.5">
                  How much water would you like to drink daily?
                </p>
              </div>

              {/* Big Goal Typography */}
              <div className="py-3">
                <span className="text-5xl font-black text-sky-600 font-mono tracking-tight block">
                  {targetGoal}
                </span>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1 block">
                  Milliliters Per Day
                </span>
              </div>

              {/* Slider */}
              <div className="px-2">
                <input
                  type="range"
                  min="1200"
                  max="4000"
                  step="100"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-1.5 my-2">
                {goalPresets.map((val) => (
                  <button
                    key={val}
                    onClick={() => setTargetGoal(val)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      targetGoal === val
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200'
                    }`}
                  >
                    {val / 1000}L
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="py-4 px-5 rounded-2xl bg-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-300"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <span>Lock In Target</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: First Sip */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full text-center space-y-4"
            >
              <div>
                <h3 className="text-xl font-black text-stone-900 tracking-tight">
                  Take Your First Sip!
                </h3>
                <p className="text-xs font-semibold text-stone-400 mt-0.5">
                  Try logging your first glass of water
                </p>
              </div>

              {/* Interactive Cup */}
              <div className="w-full bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col items-center">
                <div className="w-20 h-24 mb-2 flex items-center justify-center">
                  <span className="text-6xl animate-bounce">
                    {hasLoggedFirstDrink ? '💧' : MASCOTS[selectedMascot].emoji}
                  </span>
                </div>

                {!hasLoggedFirstDrink ? (
                  <button
                    onClick={handleFirstDrink}
                    className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 active:scale-95 transition-transform"
                  >
                    <Droplet className="w-4 h-4 fill-white" />
                    <span>Log +250ml Water</span>
                  </button>
                ) : (
                  <div className="w-full py-3 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Logged 250ml! Companion is happy!</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Start Hydration Journey</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
