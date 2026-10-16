'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHydration, MASCOTS, BEVERAGES } from '../store/hydrationStore';
import { WaterllamaMascot } from '../components/WaterllamaMascot';
import { QuickLogBar } from '../components/QuickLogBar';
import { WardrobeModal } from '../components/WardrobeModal';
import { CalendarModal } from '../components/CalendarModal';
import { OnboardingModal } from '../components/OnboardingModal';
import { CelebrationConfetti } from '../components/CelebrationConfetti';
import { CelebrationCardModal } from '../components/CelebrationCardModal';
import { BeverageType } from '../types';
import { soundFx } from '../utils/soundEffects';
import { 
  Sparkles, 
  RotateCcw, 
  Settings2,
  Flame,
  Calendar as CalendarIcon,
  Compass,
  Trophy,
  Zap,
  Droplet,
  Undo2
} from 'lucide-react';

export default function HydroCapyApp() {
  const {
    isLoaded,
    goalMl,
    setGoalMl,
    logs,
    addDrink,
    removeLog,
    resetToday,
    currentMl,
    percentage,
    breakdown,
    streakDays,
    activeSkin,
    setActiveSkin,
    activeMascot,
    setActiveMascot,
    isOnboarded,
    completeOnboarding,
    resetOnboarding,
  } = useHydration();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [lastLoggedToast, setLastLoggedToast] = useState<{ id: string; label: string; amount: number } | null>(null);

  const prevPctRef = useRef(percentage);

  // Auto-open onboarding modal on first load if not onboarded yet
  useEffect(() => {
    if (isLoaded && !isOnboarded) {
      setIsOnboardingOpen(true);
    }
  }, [isLoaded, isOnboarded]);

  // Check intraday milestone crossings to celebrate gamification moments
  useEffect(() => {
    if (!isLoaded) return;
    const prev = prevPctRef.current;
    const curr = percentage;

    // Milestone thresholds: 25%, 50%, 75%, 100%
    if ((prev < 25 && curr >= 25) || (prev < 50 && curr >= 50) || (prev < 75 && curr >= 75)) {
      soundFx.playChimeSound();
    } else if (prev < 100 && curr >= 100) {
      soundFx.playChimeSound();
    }
    prevPctRef.current = curr;
  }, [percentage, isLoaded]);

  const handleLogDrink = (type: BeverageType, amountMl?: number) => {
    const config = BEVERAGES[type];
    const amount = amountMl || config.defaultAmount;
    addDrink(type, amountMl);

    // Show quick Undo toast
    const dummyId = Date.now().toString();
    setLastLoggedToast({ id: dummyId, label: config.label, amount });

    setTimeout(() => {
      setLastLoggedToast((prev) => (prev?.id === dummyId ? null : prev));
    }, 4500);
  };

  const handleUndoLastDrink = () => {
    if (logs.length > 0) {
      removeLog(logs[0].id);
      soundFx.playSplashSound();
      setLastLoggedToast(null);
    }
  };

  const currentMascot = MASCOTS[activeMascot] || MASCOTS.capybara;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-stone-800 border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  // Current milestone banner details
  const getMilestoneBanner = () => {
    if (percentage >= 100) {
      return {
        bg: 'from-amber-300 via-amber-400 to-amber-500 text-amber-950',
        icon: '🏆',
        title: 'Goal Reached! Tap to Share Celebration Card',
      };
    }
    if (percentage >= 75) {
      return {
        bg: 'from-amber-200 via-sky-200 to-sky-300 text-sky-950',
        icon: '✨',
        title: '75% Zen Flow Reached! Final stretch — Tap to celebrate',
      };
    }
    if (percentage >= 50) {
      return {
        bg: 'from-sky-200 via-sky-300 to-indigo-200 text-indigo-950',
        icon: '⚡',
        title: "50% Halfway Peak! You're halfway there — Tap to celebrate",
      };
    }
    if (percentage >= 25) {
      return {
        bg: 'from-sky-100 via-sky-200 to-amber-100 text-sky-900',
        icon: '💧',
        title: '25% Morning Dew! Great hydration momentum today',
      };
    }
    return null;
  };

  const milestoneBanner = getMilestoneBanner();

  return (
    <main className="min-h-screen bg-[#FAF8F5] pb-36 flex flex-col justify-between relative overflow-x-hidden">
      {/* Celebratory Falling Confetti when 100% Goal Reached (Waterllama Milestone Style) */}
      <CelebrationConfetti isActive={percentage >= 100} />

      {/* 1. Minimalist Top Bar (Waterllama Style) */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xl px-5 py-3.5 border-b border-stone-200/40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Active Mascot badge & App Title */}
          <button
            onClick={() => setIsWardrobeOpen(true)}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95"
            title="Switch Companion / Costumes"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {currentMascot.emoji}
            </span>
            <div className="flex flex-col">
              <h1 className="text-base font-black text-stone-900 tracking-tight leading-tight">
                {currentMascot.name}
              </h1>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Companion
              </span>
            </div>
          </button>

          {/* Top Actions: Streak Flame (opens Calendar), Calendar & Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100/80 hover:bg-orange-200 text-orange-800 text-xs font-black transition-colors"
              title="Daily Streak & Monthly Calendar"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{streakDays} Day Streak</span>
            </button>
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
              title="Calendar View"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200/50 transition-colors"
              title="Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal Sheet */}
      {isSettingsOpen && (
        <div className="max-w-md mx-auto px-4 w-full mb-2">
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 text-sm">Quick Settings</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-xs font-bold text-stone-900 hover:text-stone-600"
              >
                Close
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-stone-500 mb-1">
                <span>Daily Target</span>
                <span className="font-bold text-stone-900 font-mono">{goalMl} ml</span>
              </div>
              <input
                type="range"
                min="1200"
                max="4000"
                step="100"
                value={goalMl}
                onChange={(e) => setGoalMl(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
              />
            </div>

            {/* Quick Actions in Settings */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsWardrobeOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black transition-colors"
              >
                <span>{currentMascot.emoji}</span>
                <span>3 Companions</span>
              </button>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsCalendarOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 text-xs font-black transition-colors"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-orange-600" />
                <span>Streak Sheet</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  resetOnboarding();
                  setIsOnboardingOpen(true);
                }}
                className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-900"
              >
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                Replay Onboarding Tour
              </button>

              <button
                onClick={() => {
                  if (confirm('Reset today back to 0?')) {
                    resetToday();
                    setIsSettingsOpen(false);
                  }
                }}
                className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 p-1 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Today
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Hero Section — Core Intake Logging & Milestone Gamification */}
      <div className="max-w-md mx-auto px-4 w-full flex-1 flex flex-col justify-center">
        {/* Milestone Celebration Banner */}
        {milestoneBanner && (
          <button
            onClick={() => setIsCelebrationOpen(true)}
            className={`mb-2 bg-gradient-to-r ${milestoneBanner.bg} py-2.5 px-4 rounded-2xl shadow-xs flex items-center justify-between hover:brightness-105 transition-all text-left w-full`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{milestoneBanner.icon}</span>
              <div className="font-black text-xs">
                {milestoneBanner.title}
              </div>
            </div>
            <Sparkles className="w-4 h-4 opacity-75 animate-bounce" />
          </button>
        )}

        {/* Dedicated Companion Liquid Fill & Intraday Milestone Track */}
        <WaterllamaMascot
          currentMl={currentMl}
          goalMl={goalMl}
          percentage={percentage}
          logs={logs}
          onRemoveLog={removeLog}
          breakdown={breakdown}
          activeSkin={activeSkin}
          activeMascot={activeMascot}
          onOpenCelebration={() => setIsCelebrationOpen(true)}
        />
      </div>

      {/* Floating Quick Undo Toast */}
      {lastLoggedToast && (
        <div className="fixed bottom-28 z-40 inset-x-0 flex justify-center pointer-events-none px-4">
          <div className="pointer-events-auto bg-stone-900/95 text-white backdrop-blur-xl px-4 py-2.5 rounded-full shadow-xl flex items-center gap-3 text-xs font-bold border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <span>+{lastLoggedToast.amount}ml {lastLoggedToast.label} logged 💧</span>
            <button
              onClick={handleUndoLastDrink}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-300 font-black text-xs transition-colors"
            >
              <Undo2 className="w-3 h-3" />
              Undo
            </button>
          </div>
        </div>
      )}

      {/* 3. Floating Quick-Log Dock & Challenge Pill */}
      <QuickLogBar
        onLogDrink={handleLogDrink}
        onOpenWardrobe={() => setIsWardrobeOpen(true)}
        streakDays={streakDays}
        activeSkin={activeSkin}
        activeMascot={activeMascot}
      />

      {/* 4. Mascot Companions & Capybara Wardrobe Modal */}
      <WardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
        activeSkin={activeSkin}
        onSelectSkin={setActiveSkin}
        activeMascot={activeMascot}
        onSelectMascot={setActiveMascot}
        streakDays={streakDays}
      />

      {/* 5. Calendar & Streak Modal (Waterllama Mobbin Screens 4 & 5 Style) */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        streakDays={streakDays}
        currentMl={currentMl}
        goalMl={goalMl}
        percentage={percentage}
      />

      {/* 6. Onboarding Tour Modal (Waterllama 3-Step Setup) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(mascot, goal) => {
          completeOnboarding(mascot, goal);
          setIsOnboardingOpen(false);
        }}
        onLogFirstDrink={() => handleLogDrink('water', 250)}
      />

      {/* 7. Celebration Card Modal (Waterllama Share Card Style) */}
      <CelebrationCardModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        currentMl={currentMl}
        percentage={percentage}
        streakDays={streakDays}
        activeMascot={activeMascot}
      />
    </main>
  );
}
