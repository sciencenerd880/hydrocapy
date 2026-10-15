'use client';

import React, { useState, useEffect } from 'react';
import { useHydration, MASCOTS } from '../store/hydrationStore';
import { PoolFloatCanvas } from '../components/PoolFloatCanvas';
import { WaterllamaMascot } from '../components/WaterllamaMascot';
import { QuickLogBar } from '../components/QuickLogBar';
import { WardrobeModal } from '../components/WardrobeModal';
import { CalendarModal } from '../components/CalendarModal';
import { OnboardingModal } from '../components/OnboardingModal';
import { CelebrationConfetti } from '../components/CelebrationConfetti';
import { CelebrationCardModal } from '../components/CelebrationCardModal';
import { BeverageType } from '../types';
import { 
  Waves, 
  Sparkles, 
  RotateCcw, 
  Settings2,
  Flame,
  Calendar as CalendarIcon,
  Sparkle,
  Compass
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

  const [activeTab, setActiveTab] = useState<'mascot' | 'pool'>('mascot');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Auto-open onboarding modal on first load if not onboarded yet
  useEffect(() => {
    if (isLoaded && !isOnboarded) {
      setIsOnboardingOpen(true);
    }
  }, [isLoaded, isOnboarded]);

  const handleLogDrink = (type: BeverageType, amountMl?: number) => {
    addDrink(type, amountMl);
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
              <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                Companion
              </span>
            </div>
          </button>

          {/* Clean Mode Switcher: Mascot vs Pool */}
          <div className="flex items-center bg-stone-200/60 p-1 rounded-full text-xs font-bold text-stone-600">
            <button
              onClick={() => setActiveTab('mascot')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'mascot'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'hover:text-stone-900'
              }`}
            >
              Mascot
            </button>
            <button
              onClick={() => setActiveTab('pool')}
              className={`px-3 py-1 rounded-full flex items-center gap-1 transition-all ${
                activeTab === 'pool'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'hover:text-stone-900'
              }`}
            >
              <Waves className="w-3.5 h-3.5 text-sky-600" />
              Pool
            </button>
          </div>

          {/* Top Actions: Streak Flame (opens Calendar), Calendar & Settings */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100/80 hover:bg-orange-200 text-orange-800 text-xs font-black transition-colors"
              title="Daily Streak & Monthly Calendar"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{streakDays}</span>
            </button>
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 transition-colors"
              title="Calendar View"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 transition-colors"
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

      {/* 2. Main Hero Section */}
      <div className="max-w-md mx-auto px-4 w-full flex-1 flex flex-col justify-center">
        {/* Milestone Celebration Banner */}
        {percentage >= 100 && (
          <button
            onClick={() => setIsCelebrationOpen(true)}
            className="mb-2 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-amber-950 py-2.5 px-4 rounded-2xl shadow-sm flex items-center justify-between hover:brightness-105 transition-all text-left w-full"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <div className="font-black text-xs">
                Goal Reached! Tap to Share Celebration Card
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-900 animate-bounce" />
          </button>
        )}

        {/* Tab 1: Waterllama Style Mascot Liquid Fill */}
        {activeTab === 'mascot' && (
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
        )}

        {/* Tab 2: 60FPS Fluid Physics Swimming Pool */}
        {activeTab === 'pool' && (
          <div className="w-full space-y-2 py-2">
            <PoolFloatCanvas
              dailyProgressPct={percentage}
              isExpanded={true}
            />
          </div>
        )}
      </div>

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
      />
    </main>
  );
}
