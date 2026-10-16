'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BEVERAGES, MASCOTS } from '../store/hydrationStore';
import { BeverageType, DrinkLog, CapySkin, MascotId } from '../types';
import { soundFx } from '../utils/soundEffects';
import { Sparkles, Trash2, ChevronDown, PartyPopper, Trophy, Zap, Droplet } from 'lucide-react';

interface WaterllamaMascotProps {
  currentMl: number;
  goalMl: number;
  percentage: number;
  logs: DrinkLog[];
  onRemoveLog: (id: string) => void;
  breakdown: {
    type: BeverageType;
    amount: number;
    percentage: number;
    config: (typeof BEVERAGES)[BeverageType];
  }[];
  activeSkin?: CapySkin;
  activeMascot?: MascotId;
  onOpenCelebration?: () => void;
}

export const WaterllamaMascot: React.FC<WaterllamaMascotProps> = ({
  currentMl,
  goalMl,
  percentage,
  logs,
  onRemoveLog,
  breakdown,
  activeSkin = 'onsen',
  activeMascot = 'capybara',
  onOpenCelebration,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [isIllustrated, setIsIllustrated] = useState(false);
  const prevPercentageRef = useRef(percentage);

  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  // Intraday Gamification Milestones
  const milestones = [
    { pct: 25, label: '25%', name: 'First Sip', icon: '💧', targetMl: Math.round(goalMl * 0.25) },
    { pct: 50, label: '50%', name: 'Halfway', icon: '⚡', targetMl: Math.round(goalMl * 0.50) },
    { pct: 75, label: '75%', name: 'Zen Flow', icon: '✨', targetMl: Math.round(goalMl * 0.75) },
    { pct: 100, label: '100%', name: 'Goal Master', icon: '🏆', targetMl: goalMl },
  ];

  const nextMilestone = milestones.find((m) => currentMl < m.targetMl);
  const mlToNextMilestone = nextMilestone ? Math.max(0, nextMilestone.targetMl - currentMl) : 0;

  // Play celebratory chime when passing 100%
  useEffect(() => {
    if (prevPercentageRef.current < 100 && percentage >= 100) {
      soundFx.playChimeSound();
    }
    prevPercentageRef.current = percentage;
  }, [percentage]);

  // Dimensions (viewBox 0 0 280 260)
  const totalFillableHeight = 190;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const fillHeight = (clampedPct / 100) * totalFillableHeight;
  const liquidTopY = 230 - fillHeight;

  // 1. Capybara Silhouette (Sitting in Onsen)
  const capySilhouettePath = `
    M 50 230
    C 32 225, 22 185, 28 145
    C 35 118, 56 104, 88 98
    C 110 92, 128 78, 145 60
    C 150 48, 164 45, 172 54
    C 178 48, 192 48, 196 60
    C 204 70, 224 76, 242 90
    C 254 100, 256 116, 250 134
    C 244 142, 226 146, 212 146
    C 205 160, 207 188, 214 218
    C 218 228, 212 230, 198 230
    Z
  `;

  // 2. Floaty River Otter Silhouette (Floating playfully on back)
  const otterSilhouettePath = `
    M 60 215
    C 40 210, 32 180, 42 145
    C 52 115, 75 96, 105 86
    C 125 80, 142 68, 158 56
    C 166 48, 178 47, 184 55
    C 190 48, 200 51, 204 61
    C 212 73, 228 85, 240 103
    C 248 119, 245 139, 232 158
    C 218 175, 195 189, 172 199
    C 142 211, 102 218, 60 215
    Z
  `;

  // 3. Bath Duckie Silhouette (Cute rounded rubber duck)
  const duckieSilhouettePath = `
    M 50 200
    C 35 190, 30 160, 45 135
    C 55 120, 75 115, 100 120
    C 110 100, 125 70, 145 55
    C 160 45, 180 45, 195 55
    C 210 65, 218 80, 215 98
    C 230 95, 255 100, 258 108
    C 255 118, 232 120, 212 120
    C 218 135, 225 160, 220 185
    C 212 205, 185 215, 140 215
    C 95 215, 65 210, 50 200
    Z
  `;

  const activeSilhouettePath = 
    activeMascot === 'otter' 
      ? otterSilhouettePath 
      : activeMascot === 'duckie' 
      ? duckieSilhouettePath 
      : capySilhouettePath;

  // Stacked multi-beverage liquid layers
  let currentLayerBaseY = 230;
  const layers = breakdown.map((item) => {
    const layerH = (item.amount / goalMl) * totalFillableHeight;
    const layerY = Math.max(liquidTopY, currentLayerBaseY - layerH);
    const actualH = currentLayerBaseY - layerY;
    currentLayerBaseY = layerY;

    return {
      type: item.type,
      color: item.config.color,
      lightColor: item.config.lightColor,
      y: layerY,
      height: actualH,
    };
  });

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* 1. Dynamic Waterllama Header */}
      {percentage >= 100 ? (
        <div className="text-center my-1.5">
          <h2 className="text-3xl font-black text-sky-500 tracking-tight mb-1">
            Fresh {dayName}!
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 text-sky-800 text-xs font-black">
            <span>{currentMl.toLocaleString()}ml hydration • {percentage}% of your goal 💧</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          </div>
        </div>
      ) : (
        <div className="text-center my-1.5">
          <h2 className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-0.5">
            Daily Hydration
          </h2>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-5xl font-black text-stone-900 tracking-tight font-mono">
              {currentMl.toLocaleString()}
            </span>
            <span className="text-base font-bold text-stone-400">
              / {goalMl.toLocaleString()} ml
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-black mt-1">
            <span>Hydration • {percentage}% of goal 💧</span>
          </div>
        </div>
      )}

      {/* Intraday Gamification Milestone Track */}
      <div className="w-full max-w-xs mx-auto mt-2 mb-1 px-4">
        <div className="relative flex items-center justify-between">
          {/* Background Track Line */}
          <div className="absolute top-1/2 left-3 right-3 h-1 bg-stone-200/80 -translate-y-1/2 rounded-full -z-0" />
          
          {/* Active Colored Fill Line */}
          <div 
            className="absolute top-1/2 left-3 h-1 bg-gradient-to-r from-sky-400 via-amber-400 to-amber-500 -translate-y-1/2 rounded-full transition-all duration-500 -z-0 max-w-[calc(100%-1.5rem)]"
            style={{ width: `${Math.min(100, Math.max(0, (percentage / 100) * 100))}%` }}
          />

          {milestones.map((m) => {
            const isReached = percentage >= m.pct;
            const isCurrentTarget = nextMilestone?.pct === m.pct;

            return (
              <button
                key={m.pct}
                onClick={onOpenCelebration}
                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                title={`${m.name} (${m.pct}% - ${m.targetMl}ml)`}
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isReached
                      ? 'bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-xs shadow-sky-400/50 scale-105'
                      : isCurrentTarget
                      ? 'bg-white border-2 border-amber-400 text-stone-700 shadow-xs ring-4 ring-amber-100/60'
                      : 'bg-white border-2 border-stone-200 text-stone-400'
                  }`}
                >
                  <span>{m.icon}</span>
                </motion.div>
                <span className={`text-[10px] font-extrabold mt-1 tracking-tight ${
                  isReached ? 'text-sky-600' : isCurrentTarget ? 'text-amber-600 font-black' : 'text-stone-400'
                }`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Motivational Milestone Callout */}
        <div className="text-center mt-1">
          {percentage >= 100 ? (
            <span className="text-[11px] font-black text-amber-600 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-spin" />
              All 4 Daily Milestones Achieved!
            </span>
          ) : (
            <span className="text-[11px] font-bold text-stone-500">
              <strong className="text-stone-900 font-mono font-black">{mlToNextMilestone} ml</strong> to {nextMilestone?.name} {nextMilestone?.icon}
            </span>
          )}
        </div>
      </div>

      {/* 2. Hero Mascot Container with Tap to Toggle Illustration */}
      <div 
        onClick={() => setIsIllustrated(!isIllustrated)}
        className="relative w-80 h-76 sm:w-92 sm:h-84 my-1 flex items-center justify-center cursor-pointer group"
        title="Tap to toggle illustrated character mode"
      >
        {/* Animated Steam Wisps when hydration is high (>= 75%) */}
        {percentage >= 75 && (
          <div className="absolute top-2 inset-x-0 flex justify-center gap-8 pointer-events-none opacity-60">
            <motion.div
              animate={{ y: [-5, -25], opacity: [0, 0.8, 0], scale: [0.8, 1.2] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
              className="w-1.5 h-6 bg-stone-300 rounded-full blur-[1px]"
            />
            <motion.div
              animate={{ y: [-5, -28], opacity: [0, 0.9, 0], scale: [0.7, 1.3] }}
              transition={{ repeat: Infinity, duration: 2.8, delay: 0.7, ease: 'easeOut' }}
              className="w-2 h-7 bg-stone-300 rounded-full blur-[1px]"
            />
            <motion.div
              animate={{ y: [-5, -24], opacity: [0, 0.8, 0], scale: [0.8, 1.1] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 1.2, ease: 'easeOut' }}
              className="w-1.5 h-6 bg-stone-300 rounded-full blur-[1px]"
            />
          </div>
        )}

        <svg
          viewBox="0 0 280 260"
          className="w-full h-full drop-shadow-xl transition-transform group-hover:scale-[1.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="mascotHeroMask">
              <path d={activeSilhouettePath} />
            </clipPath>

            <linearGradient id="glassContourGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="defaultWaterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Mascot Fur Gradients */}
            <linearGradient id="capyFurGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B48259" />
              <stop offset="100%" stopColor="#8C5C38" />
            </linearGradient>

            <linearGradient id="otterFurGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9A7B56" />
              <stop offset="100%" stopColor="#6E5033" />
            </linearGradient>

            <linearGradient id="duckieBodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>

          {/* Mode 1: Full Illustrated Character (Screen 20 in Photo 2) */}
          {isIllustrated ? (
            <g clipPath="url(#mascotHeroMask)">
              {activeMascot === 'capybara' && (
                <>
                  <rect x="0" y="0" width="280" height="260" fill="url(#capyFurGrad)" />
                  <ellipse cx="230" cy="115" rx="35" ry="25" fill="#D2A679" />
                  <ellipse cx="120" cy="210" rx="75" ry="35" fill="#754826" opacity="0.4" />
                  <ellipse cx="205" cy="122" rx="9" ry="6" fill="#F87171" opacity="0.45" />
                </>
              )}
              {activeMascot === 'otter' && (
                <>
                  <rect x="0" y="0" width="280" height="260" fill="url(#otterFurGrad)" />
                  <ellipse cx="215" cy="105" rx="30" ry="22" fill="#E8D5C4" />
                  <ellipse cx="110" cy="195" rx="60" ry="30" fill="#E8D5C4" opacity="0.5" />
                  <ellipse cx="195" cy="110" rx="8" ry="5" fill="#F87171" opacity="0.4" />
                </>
              )}
              {activeMascot === 'duckie' && (
                <>
                  <rect x="0" y="0" width="280" height="260" fill="url(#duckieBodyGrad)" />
                  <ellipse cx="180" cy="170" rx="35" ry="20" fill="#CA8A04" opacity="0.3" />
                  <ellipse cx="170" cy="95" rx="8" ry="5" fill="#F87171" opacity="0.4" />
                </>
              )}
            </g>
          ) : (
            // Mode 2: Stratified Liquid Fill
            <>
              {/* Background Silhouette */}
              <path
                d={activeSilhouettePath}
                fill="#F4F4F5"
                stroke="#E4E4E7"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Liquid Contents Masked to Mascot Shape */}
              <g clipPath="url(#mascotHeroMask)">
                {layers.length === 0 && percentage > 0 && (
                  <rect
                    x="0"
                    y={liquidTopY}
                    width="280"
                    height="260"
                    fill="url(#defaultWaterGrad)"
                    className="transition-all duration-500 ease-out"
                  />
                )}

                {/* Multi-Beverage Layers */}
                {layers.map((layer, idx) => (
                  <rect
                    key={`${layer.type}-${idx}`}
                    x="0"
                    y={layer.y}
                    width="280"
                    height={layer.height}
                    fill={layer.color}
                    className="transition-all duration-500 ease-out"
                  />
                ))}

                {/* Wave Crest Meniscus */}
                {percentage > 0 && (
                  <path
                    d={`
                      M 0 ${liquidTopY}
                      Q 70 ${liquidTopY - 6}, 140 ${liquidTopY}
                      T 280 ${liquidTopY}
                      V 260 H 0 Z
                    `}
                    fill="#FFFFFF"
                    fillOpacity="0.25"
                    className="animate-wave-pulse"
                  />
                )}

                {/* Internal effervescent bubbles */}
                {percentage > 10 && (
                  <g fill="#FFFFFF" fillOpacity="0.45">
                    <circle cx="90" cy={liquidTopY + 30} r="3" />
                    <circle cx="160" cy={liquidTopY + 50} r="4" />
                    <circle cx="130" cy={liquidTopY + 80} r="2.5" />
                    <circle cx="200" cy={liquidTopY + 40} r="3.5" />
                  </g>
                )}

                {/* Floating Yuzu Citrus bobbing on liquid surface */}
                {percentage > 5 && (
                  <g
                    transform={`translate(115, ${Math.min(210, Math.max(65, liquidTopY - 10))})`}
                    className="transition-all duration-500"
                  >
                    <circle cx="0" cy="0" r="11" fill="#F59E0B" />
                    <circle cx="-3" cy="-3" r="3" fill="#FBBF24" />
                    <path d="M 0 -11 Q 4 -16 8 -13 Q 5 -10 0 -11" fill="#22C55E" />
                    <circle cx="0" cy="-11" r="1.5" fill="#15803D" />
                  </g>
                )}
              </g>

              {/* Outer Glass Highlight Contour */}
              <path
                d={activeSilhouettePath}
                fill="none"
                stroke="url(#glassContourGrad)"
                strokeWidth="4"
              />
            </>
          )}

          {/* Mascot Specific Facial Details */}
          {activeMascot === 'capybara' && (
            <>
              <path
                d="M 215 110 Q 222 116 229 110"
                stroke="#27272A"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 248 112 Q 252 116 250 122"
                stroke="#27272A"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 184 56 Q 188 64 186 70"
                stroke="#27272A"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {activeMascot === 'otter' && (
            <>
              {/* Otter cute closed eye */}
              <path
                d="M 205 92 Q 212 98 219 92"
                stroke="#27272A"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              {/* Cute nose */}
              <ellipse cx="236" cy="104" rx="4.5" ry="3.5" fill="#27272A" />
              {/* Whiskers */}
              <line x1="222" y1="108" x2="208" y2="114" stroke="#27272A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="222" y1="104" x2="206" y2="105" stroke="#27272A" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}

          {activeMascot === 'duckie' && (
            <>
              {/* Duckie round eye */}
              <ellipse cx="188" cy="85" rx="3.5" ry="4.5" fill="#18181B" />
              {/* Duck bill */}
              <path
                d="M 215 98 Q 258 96 254 110 Q 230 116 212 116 Z"
                fill="#EA580C"
                stroke="#C2410C"
                strokeWidth="1.5"
              />
            </>
          )}

          {/* Costumes & Accessories */}
          {activeSkin === 'onsen' && activeMascot === 'capybara' && (
            <g transform="translate(178, 40)">
              <rect x="-14" y="-8" width="28" height="10" rx="4" fill="#FFFFFF" stroke="#E4E4E7" strokeWidth="1.5" />
              <line x1="-10" y1="-3" x2="10" y2="-3" stroke="#CBD5E1" strokeWidth="1" />
              <circle cx="0" cy="-12" r="5" fill="#F59E0B" />
              <circle cx="1" cy="-15" r="1" fill="#22C55E" />
            </g>
          )}

          {activeSkin === 'farmer' && (
            <g transform="translate(178, 38)">
              <ellipse cx="0" cy="4" rx="28" ry="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
              <path d="M -14 4 Q -16 -16 0 -16 Q 16 -16 14 4 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
              <path d="M -13 0 Q 0 -4 13 0" stroke="#EF4444" strokeWidth="3" fill="none" />
            </g>
          )}

          {activeSkin === 'resort' && (
            <g transform="translate(220, 108)">
              <rect x="-12" y="-6" width="14" height="12" rx="3" fill="#18181B" stroke="#000000" strokeWidth="1.5" />
              <line x1="2" y1="-1" x2="8" y2="-1" stroke="#18181B" strokeWidth="2.5" />
              <line x1="-12" y1="-1" x2="-22" y2="-6" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-9" y1="-3" x2="-5" y2="3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          )}

          {activeSkin === 'duckie' && activeMascot !== 'duckie' && (
            <g transform="translate(178, 34)">
              <ellipse cx="0" cy="0" rx="9" ry="7" fill="#FACC15" />
              <circle cx="6" cy="-4" r="5" fill="#FDE047" />
              <circle cx="7" cy="-5" r="1" fill="#000000" />
              <polygon points="11,-4 16,-3 11,-1" fill="#EA580C" />
            </g>
          )}
        </svg>
      </div>

      {/* 3. "Celebrate Your Day" Pill Button */}
      {percentage >= 100 && onOpenCelebration && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={onOpenCelebration}
          className="mb-2 px-4 py-2 rounded-full bg-stone-900 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-stone-900/10 hover:bg-stone-800 transition-colors"
        >
          <PartyPopper className="w-4 h-4 text-amber-400" />
          <span>CELEBRATE YOUR DAY</span>
        </motion.button>
      )}

      {/* 4. Minimalist Beverage Distribution Dots */}
      {breakdown.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-1 px-4">
          {breakdown.map((item) => (
            <div key={item.type} className="flex items-center gap-1.5 text-xs text-stone-600 font-bold">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-xs"
                style={{ backgroundColor: item.config.color }}
              />
              <span>{item.config.label}</span>
              <span className="text-stone-400 font-mono text-[11px]">{item.amount}ml</span>
            </div>
          ))}
        </div>
      )}

      {/* 5. Collapsible History Dropdown */}
      <div className="w-full max-w-sm mt-3 px-2">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-stone-400 hover:text-stone-700 transition-colors"
        >
          <span>{showHistory ? 'Hide Intake History' : `Today's Log (${logs.length})`}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`} />
        </button>

        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="space-y-1.5 mt-2 max-h-48 overflow-y-auto pr-1"
          >
            {logs.map((log) => {
              const cfg = BEVERAGES[log.type];
              const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-100/70 text-xs"
                >
                  <div className="flex items-center gap-2 font-semibold text-stone-700">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span>{cfg.label}</span>
                    <span className="text-stone-400 font-normal">{timeStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-800 font-mono">+{log.amountMl} ml</span>
                    <button
                      onClick={() => onRemoveLog(log.id)}
                      className="text-stone-300 hover:text-red-500 p-0.5 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};
