'use client';

import React, { useState } from 'react';
import { useHydration } from '../store/hydrationStore';
import { PoolFloatCanvas } from '../components/PoolFloatCanvas';
import { WaterllamaMascot } from '../components/WaterllamaMascot';
import { QuickLogBar } from '../components/QuickLogBar';
import { WardrobeModal } from '../components/WardrobeModal';
import { CelebrationConfetti } from '../components/CelebrationConfetti';
import { CelebrationCardModal } from '../components/CelebrationCardModal';
import { BeverageType } from '../types';
import { 
  Waves, 
  Sparkles, 
  RotateCcw, 
  Settings2,
  Flame
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
  } = useHydration();

  const [activeTab, setActiveTab] = useState<'mascot' | 'pool'>('mascot');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  const handleLogDrink = (type: BeverageType, amountMl?: number) => {
    addDrink(type, amountMl);
  };

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
      {/* Celebratory Falling Confetti when 100% Goal Reached (Photo 2 Screen 19 Style) */}
      <CelebrationConfetti isActive={percentage >= 100} />

      {/* 1. Minimalist Top Bar (Waterllama Style) */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xl px-5 py-3.5 border-b border-stone-200/40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦫</span>
            <h1 className="text-lg font-black text-stone-900 tracking-tight">
              HydroCapy
            </h1>
          </div>

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

          {/* Quick Streak & Settings */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsWardrobeOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100/80 hover:bg-orange-200 text-orange-800 text-xs font-black transition-colors"
              title="7-Day Streak & Wardrobe"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{streakDays}</span>
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
              <h3 className="font-extrabold text-stone-900 text-sm">Target Goal</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-xs font-bold text-stone-900"
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

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <span className="text-xs text-stone-400">Reset Today</span>
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
                Reset
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
      />

      {/* 4. Capybara Wardrobe & 7-Day Challenge Modal */}
      <WardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
        activeSkin={activeSkin}
        onSelectSkin={setActiveSkin}
        streakDays={streakDays}
      />

      {/* 5. Celebration Card Modal (Photo 2 Screen 18 Style) */}
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
