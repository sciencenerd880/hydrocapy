'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Sparkles, Trophy, Calendar as CalendarIcon, Check } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  currentMl: number;
  goalMl: number;
  percentage: number;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  streakDays,
  currentMl,
  goalMl,
  percentage,
}) => {
  if (!isOpen) return null;

  const now = new Date();
  const monthName = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();
  const currentDay = now.getDate();

  // Generate calendar days for October (31 days)
  const totalDaysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
  const firstDayWeekday = new Date(year, now.getMonth(), 1).getDay(); // 0 is Sun
  const startOffset = (firstDayWeekday + 6) % 7; // Convert to Mon start (0 is Mon)

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Calculate mock completion: past streakDays up to currentDay were completed
  const isDayCompleted = (d: number) => {
    if (d > currentDay) return false;
    if (d === currentDay) return percentage >= 100;
    // Mock: recent streakDays are completed, plus random earlier successful days
    return d >= currentDay - streakDays || (d % 3 !== 0 && d < currentDay);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-sm bg-[#FAF8F5] rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl flex flex-col select-none max-h-[90vh] overflow-y-auto"
        >
          {/* Top Grab Handle */}
          <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-3 sm:hidden" />

          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Flame className="w-4 h-4 fill-orange-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900 tracking-tight">
                  Hydration Calendar
                </h3>
                <p className="text-[11px] font-bold text-stone-400">
                  {monthName} {year}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Concentric Circular Streak Dial (Waterllama Screen 4 & 5 Style) */}
          <div className="w-full bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm flex flex-col items-center my-1 relative">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Outer Ring: Monthly streak background */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#F3F4F6"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Outer Ring: Streak Progress */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#F97316"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="314"
                  strokeDashoffset={314 - (Math.min(7, streakDays) / 7) * 314}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />

                {/* Inner Ring: Today's Hydration background */}
                <circle
                  cx="60"
                  cy="60"
                  r="38"
                  stroke="#F3F4F6"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Inner Ring: Today's Progress */}
                <circle
                  cx="60"
                  cy="60"
                  r="38"
                  stroke="#0284C7"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="238"
                  strokeDashoffset={238 - (Math.min(100, percentage) / 100) * 238}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>

              {/* Center Typography (Waterllama Screen 4 Style) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-stone-900 font-mono tracking-tight leading-none">
                  {percentage}%
                </span>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-0.5">
                  TODAY
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>{streakDays} Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                <span>{currentMl} / {goalMl} ml</span>
              </div>
            </div>
          </div>

          {/* Minimalist Month Calendar Grid (Photo 1 Screen 4 Style) */}
          <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-sm mt-3">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {daysOfWeek.map((day, idx) => (
                <span key={idx} className="text-[11px] font-black text-stone-400">
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Day Bubbles */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {/* Empty leading offset days */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="w-8 h-8" />
              ))}

              {/* Month Days */}
              {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const completed = isDayCompleted(dayNum);
                const isToday = dayNum === currentDay;

                return (
                  <div
                    key={dayNum}
                    className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all relative ${
                      isToday
                        ? completed
                          ? 'bg-sky-600 text-white ring-2 ring-sky-300 shadow-sm'
                          : 'bg-stone-900 text-white'
                        : completed
                        ? 'bg-sky-100 text-sky-800'
                        : dayNum < currentDay
                        ? 'text-stone-400 hover:bg-stone-50'
                        : 'text-stone-300'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {completed && !isToday && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-sky-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Consistency Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="bg-white rounded-2xl p-2.5 border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Total</span>
              <span className="text-sm font-black text-stone-900 font-mono">38.4 L</span>
            </div>
            <div className="bg-white rounded-2xl p-2.5 border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Daily Avg</span>
              <span className="text-sm font-black text-stone-900 font-mono">2,320 ml</span>
            </div>
            <div className="bg-white rounded-2xl p-2.5 border border-stone-200/70">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Hit Rate</span>
              <span className="text-sm font-black text-emerald-600 font-mono">87%</span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
          >
            Close Calendar
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
