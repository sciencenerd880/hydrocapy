'use client';

import React from 'react';
import { BEVERAGES } from '../store/hydrationStore';
import { BeverageType, DrinkLog } from '../types';
import { Droplet, Flame, Coffee, TrendingUp, CheckCircle2, Trash2 } from 'lucide-react';

interface BentoDashboardProps {
  currentMl: number;
  goalMl: number;
  percentage: number;
  pacingDeltaMl: number;
  expectedPacingMl?: number;
  streakDays: number;
  logs: DrinkLog[];
  onRemoveLog: (id: string) => void;
  breakdown: {
    type: BeverageType;
    amount: number;
    percentage: number;
    config: (typeof BEVERAGES)[BeverageType];
  }[];
}

export const BentoDashboard: React.FC<BentoDashboardProps> = ({
  currentMl,
  goalMl,
  percentage,
  pacingDeltaMl,
  expectedPacingMl = 1500,
  streakDays,
  logs,
  onRemoveLog,
  breakdown,
}) => {
  const totalCaffeine = logs.reduce((sum, item) => sum + (item.caffeineMg || 0), 0);

  // SVG Capybara liquid silhouette calculations
  const totalHeight = 125;
  const fillHeight = (Math.min(100, percentage) / 100) * totalHeight;
  const liquidTopY = 142 - fillHeight;

  // Pacing progress ratio (current vs target expected at this hour)
  const pacingRatio = expectedPacingMl > 0 
    ? Math.min(100, Math.round((currentMl / expectedPacingMl) * 100)) 
    : 100;

  // Authentic Capybara Profile Silhouette Path
  const capySilhouettePath = `
    M 28 142
    C 18 138, 14 112, 18 88
    C 22 72, 34 64, 52 60
    C 66 56, 76 48, 86 38
    C 88 30, 96 28, 100 34
    C 104 30, 112 30, 114 36
    C 118 42, 130 46, 140 54
    C 146 60, 148 70, 146 80
    C 142 86, 130 88, 122 88
    C 118 96, 120 114, 124 132
    C 126 140, 122 142, 114 142
    Z
  `;

  return (
    <div className="w-full space-y-4">
      {/* Top Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Card 1: Mascot Liquid Silhouette Card */}
        <div className="md:col-span-5 bg-white rounded-3xl p-5 shadow-sm border border-stone-200/70 flex flex-col items-center justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
            <span className="uppercase tracking-wider">Hydration Silhouette</span>
            <span className="text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full font-bold">
              {percentage}%
            </span>
          </div>

          {/* SVG Masked Liquid Silhouette */}
          <div className="relative w-44 h-40 my-2 flex items-center justify-center">
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full drop-shadow-sm"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <clipPath id="capyMask">
                  <path d={capySilhouettePath} />
                </clipPath>

                <linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Background Silhouette (Container Glass) */}
              <path
                d={capySilhouettePath}
                fill="#F8FAFC"
                stroke="#E2E8F0"
                strokeWidth="2.5"
              />

              {/* Liquid Inside the Silhouette */}
              <g clipPath="url(#capyMask)">
                <rect
                  x="0"
                  y={liquidTopY}
                  width="160"
                  height="160"
                  fill="#0284C7"
                  className="transition-all duration-700 ease-out"
                />

                {percentage > 0 && (
                  <path
                    d={`
                      M 0 ${liquidTopY}
                      Q 40 ${liquidTopY - 5}, 80 ${liquidTopY}
                      T 160 ${liquidTopY}
                      V 160 H 0 Z
                    `}
                    fill="#38BDF8"
                    opacity="0.8"
                    className="animate-wave-pulse"
                  />
                )}

                {breakdown.length > 1 && (
                  <rect
                    x="0"
                    y={liquidTopY + fillHeight * 0.45}
                    width="160"
                    height={fillHeight * 0.35}
                    fill={breakdown[1]?.config.color || '#F59E0B'}
                    opacity="0.9"
                  />
                )}
              </g>

              {/* Outline */}
              <path
                d={capySilhouettePath}
                fill="none"
                stroke="url(#glassShine)"
                strokeWidth="3"
              />
            </svg>
          </div>

          <div className="w-full text-center bg-stone-50 py-2.5 px-3 rounded-2xl border border-stone-100">
            <span className="text-2xl font-black text-stone-800 tracking-tight">
              {currentMl.toLocaleString()}
            </span>
            <span className="text-stone-400 font-medium text-xs ml-1">/ {goalMl.toLocaleString()} ml</span>
          </div>
        </div>

        {/* Card 2 & 3: Bento Stats Grid */}
        <div className="md:col-span-7 grid grid-cols-2 gap-4">
          
          {/* Pacing Delta Stat */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/70 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Circadian Pacing</span>
              <div className={`p-2 rounded-xl ${pacingDeltaMl >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className={`text-xl font-bold tracking-tight ${pacingDeltaMl >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {pacingDeltaMl >= 0 ? `+${pacingDeltaMl} ml` : `${pacingDeltaMl} ml`}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {pacingDeltaMl >= 0 ? 'Ahead of hourly target' : 'Behind recommended pace'}
              </p>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pacingDeltaMl >= 0 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                style={{ width: `${Math.min(100, Math.max(10, pacingRatio))}%` }}
              />
            </div>
          </div>

          {/* Daily Streak Stat */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/70 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Streak Record</span>
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <Flame className="w-4 h-4 fill-orange-500" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-xl font-bold text-stone-800 tracking-tight">
                {streakDays} Days
              </div>
              <p className="text-xs text-stone-400 mt-0.5">Top 8% consistent capys</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>5 days in a row</span>
            </div>
          </div>

          {/* Caffeine & Electrolytes Card */}
          <div className="col-span-2 bg-white rounded-3xl p-5 shadow-sm border border-stone-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-800">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Caffeine Load</div>
                <div className="text-lg font-bold text-stone-800">
                  {totalCaffeine} mg <span className="text-xs font-normal text-stone-400">/ 400 mg FDA max</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                totalCaffeine > 300 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {totalCaffeine > 300 ? 'High Caffeine' : 'Optimal Level'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Beverage Breakdown Stacked Progress */}
      {breakdown.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/70">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-3">
            <span className="uppercase tracking-wider">Beverage Distribution</span>
            <span>{logs.length} drinks logged</span>
          </div>

          <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
            {breakdown.map((item) => (
              <div
                key={item.type}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.config.color,
                }}
                className="h-full transition-all duration-500 hover:brightness-110"
                title={`${item.config.label}: ${item.amount} ml (${item.percentage}%)`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-stone-100">
            {breakdown.map((item) => (
              <div key={item.type} className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.config.color }}
                />
                <span>{item.config.label}</span>
                <span className="text-stone-400 font-mono">({item.amount}ml)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Log */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/70">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
          Today's Timeline
        </div>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-sm">
              No drinks logged yet today. Tap below to splash your first cup!
            </div>
          ) : (
            logs.map((log) => {
              const cfg = BEVERAGES[log.type];
              const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-stone-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cfg.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-stone-800">{cfg.label}</div>
                      <div className="text-xs text-stone-400">{timeStr}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-stone-700">+{log.amountMl} ml</span>
                    <button
                      onClick={() => onRemoveLog(log.id)}
                      className="text-stone-300 hover:text-red-500 p-1 rounded-lg transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
