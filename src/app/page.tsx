'use client';

import React, { useState } from 'react';
import { useHydration } from '../store/hydrationStore';
import { PoolFloatCanvas } from '../components/PoolFloatCanvas';
import { BentoDashboard } from '../components/BentoDashboard';
import { QuickLogBar } from '../components/QuickLogBar';
import { BeverageType } from '../types';
import { 
  Waves, 
  LayoutGrid, 
  Sparkles, 
  RotateCcw, 
  Settings2,
  Award
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
    pacingDeltaMl,
    expectedPacingMl,
  } = useHydration();

  const [activeTab, setActiveTab] = useState<'hybrid' | 'pool' | 'bento'>('hybrid');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogDrink = (type: BeverageType, amountMl?: number) => {
    addDrink(type, amountMl);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-sky-400 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-stone-500">Warming up the pool...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] pb-44">
      {/* Top App Header */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-lg border-b border-stone-200/60 px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-400 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-sky-500/20">
              🦫
            </div>
            <div>
              <h1 className="text-base font-extrabold text-stone-800 tracking-tight leading-none">
                HydroCapy
              </h1>
              <span className="text-[11px] font-semibold text-sky-700">
                {percentage}% Hydrated Today
              </span>
            </div>
          </div>

          {/* View Mode Switcher Pills */}
          <div className="flex items-center bg-stone-200/70 p-1 rounded-2xl text-xs font-semibold text-stone-600">
            <button
              onClick={() => setActiveTab('hybrid')}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                activeTab === 'hybrid'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'hover:text-stone-900'
              }`}
            >
              Hybrid
            </button>
            <button
              onClick={() => setActiveTab('pool')}
              className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all ${
                activeTab === 'pool'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'hover:text-stone-900'
              }`}
            >
              <Waves className="w-3.5 h-3.5 text-sky-600" />
              Pool
            </button>
            <button
              onClick={() => setActiveTab('bento')}
              className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all ${
                activeTab === 'bento'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-700" />
              Bento
            </button>
          </div>

          {/* Quick Settings Icon */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 rounded-2xl text-stone-500 hover:bg-stone-200/60 active:scale-95 transition-all"
            title="Settings"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Settings Drawer / Modal */}
      {isSettingsOpen && (
        <div className="max-w-xl mx-auto px-4 mt-3">
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-lg space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-sm">Hydration Goal Settings</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-xs font-bold text-sky-600"
              >
                Done
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-stone-500 mb-1">
                <span>Daily Target</span>
                <span className="font-bold text-stone-800">{goalMl} ml</span>
              </div>
              <input
                type="range"
                min="1200"
                max="4000"
                step="100"
                value={goalMl}
                onChange={(e) => setGoalMl(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <span className="text-xs text-stone-500">Reset Today's Log</span>
              <button
                onClick={() => {
                  if (confirm('Reset today’s hydration back to 0?')) {
                    resetToday();
                    setIsSettingsOpen(false);
                  }
                }}
                className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        
        {/* Milestone Celebration Banner */}
        {percentage >= 100 && (
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 p-4 rounded-3xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/30 flex items-center justify-center text-xl">
                🏆
              </div>
              <div>
                <div className="font-black text-sm">Goal Achieved! 100% Hydrated</div>
                <div className="text-xs font-medium text-amber-900/80">
                  Your capybara is chilling happily on the donut!
                </div>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-amber-200 animate-bounce" />
          </div>
        )}

        {/* Section 1: The Interactive Tilt Pool Float Canvas */}
        {(activeTab === 'hybrid' || activeTab === 'pool') && (
          <section className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-sky-500" />
                Live Float Pool
              </span>
              <span className="text-[11px] font-medium text-stone-400">
                Gyroscope / Touch Enabled
              </span>
            </div>

            <PoolFloatCanvas
              dailyProgressPct={percentage}
              isExpanded={activeTab === 'pool'}
            />
          </section>
        )}

        {/* Section 2: The Bento Habit Dashboard */}
        {(activeTab === 'hybrid' || activeTab === 'bento') && (
          <section className="space-y-2 pt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
                Bento Health Metrics
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                <Award className="w-3 h-3" />
                Streak: {streakDays}d
              </div>
            </div>

            <BentoDashboard
              currentMl={currentMl}
              goalMl={goalMl}
              percentage={percentage}
              pacingDeltaMl={pacingDeltaMl}
              expectedPacingMl={expectedPacingMl}
              streakDays={streakDays}
              logs={logs}
              onRemoveLog={removeLog}
              breakdown={breakdown}
            />
          </section>
        )}
      </div>

      {/* Section 3: Floating 1-Tap Quick Log Dock */}
      <QuickLogBar onLogDrink={handleLogDrink} />
    </main>
  );
}
