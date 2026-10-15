'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BEVERAGES } from '../store/hydrationStore';
import { BeverageType } from '../types';
import { 
  WaterIcon, 
  TeaIcon, 
  CoffeeIcon, 
  JuiceIcon, 
  ElectrolyteIcon 
} from './DrinkIcons';
import { Plus, X, Sparkles } from 'lucide-react';

interface QuickLogBarProps {
  onLogDrink: (type: BeverageType, amountMl?: number) => void;
}

interface FlyingDroplet {
  id: number;
  startX: number;
  startY: number;
  color: string;
}

export const QuickLogBar: React.FC<QuickLogBarProps> = ({ onLogDrink }) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customType, setCustomType] = useState<BeverageType>('water');
  const [customAmount, setCustomAmount] = useState(250);
  const [flyingDroplets, setFlyingDroplets] = useState<FlyingDroplet[]>([]);

  const handleQuickTap = (type: BeverageType, e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Haptic feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(18);
      } catch (err) {
        // ignore
      }
    }

    // 2. Flying splash droplet micro-animation
    const rect = e.currentTarget.getBoundingClientRect();
    const dropletId = Date.now();
    const color = BEVERAGES[type].color;

    setFlyingDroplets((prev) => [
      ...prev,
      {
        id: dropletId,
        startX: rect.left + rect.width / 2,
        startY: rect.top,
        color,
      },
    ]);

    setTimeout(() => {
      setFlyingDroplets((prev) => prev.filter((d) => d.id !== dropletId));
    }, 700);

    onLogDrink(type);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogDrink(customType, customAmount);
    setIsCustomOpen(false);
  };

  const beverageButtons: { type: BeverageType; Icon: React.FC<{ size?: number }>; label: string; amount: number }[] = [
    { type: 'water', Icon: WaterIcon, label: 'Water', amount: 250 },
    { type: 'green_tea', Icon: TeaIcon, label: 'Tea', amount: 200 },
    { type: 'coffee', Icon: CoffeeIcon, label: 'Coffee', amount: 150 },
    { type: 'juice', Icon: JuiceIcon, label: 'Juice', amount: 250 },
    { type: 'electrolyte', Icon: ElectrolyteIcon, label: 'Hydrate', amount: 350 },
  ];

  return (
    <>
      {/* Flying Splash Droplet Particles */}
      <AnimatePresence>
        {flyingDroplets.map((droplet) => (
          <motion.div
            key={droplet.id}
            initial={{
              position: 'fixed',
              left: droplet.startX,
              top: droplet.startY,
              x: '-50%',
              y: 0,
              scale: 0.6,
              opacity: 1,
              zIndex: 9999,
            }}
            animate={{
              y: -220,
              scale: [0.6, 1.4, 0.2],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="pointer-events-none w-5 h-5 rounded-full"
            style={{
              backgroundColor: droplet.color,
              boxShadow: `0 0 16px ${droplet.color}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Minimalist Floating Bottom Dock */}
      <div className="fixed bottom-6 inset-x-0 z-40 px-4 pointer-events-none flex justify-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-sm pointer-events-auto bg-white/95 backdrop-blur-2xl border border-stone-200/80 rounded-full py-2 px-3 shadow-xl shadow-stone-200/60 flex items-center justify-between gap-1"
        >
          {beverageButtons.map(({ type, Icon, label, amount }) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.82, y: 2 }}
              whileHover={{ scale: 1.06 }}
              transition={{ type: 'spring', stiffness: 450, damping: 18 }}
              onClick={(e) => handleQuickTap(type, e)}
              className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl hover:bg-stone-50 active:bg-stone-100 transition-colors group relative"
            >
              <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
                <Icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-stone-700 tracking-tight mt-0.5">
                +{amount}
              </span>
            </motion.button>
          ))}

          {/* Plus Custom Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setIsCustomOpen(true)}
            className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-md flex-shrink-0 ml-1"
            title="Custom intake"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </motion.div>
      </div>

      {/* Minimalist Custom Intake Modal */}
      {isCustomOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-stone-100 relative"
          >
            <button
              onClick={() => setIsCustomOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-stone-900 tracking-tight mb-4">
              Log Drink
            </h3>

            <form onSubmit={handleCustomSubmit} className="space-y-5">
              {/* Beverage Selector with Bespoke SVGs */}
              <div className="grid grid-cols-3 gap-2">
                {beverageButtons.map(({ type, Icon, label }) => {
                  const isSelected = customType === type;
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setCustomType(type)}
                      className={`flex flex-col items-center py-2.5 px-2 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/80 shadow-sm'
                          : 'border-stone-200/80 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="mb-1">
                        <Icon size={26} />
                      </div>
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-sky-900' : 'text-stone-600'}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Volume Slider */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs font-semibold text-stone-500">Amount</span>
                  <span className="text-xl font-black text-stone-900 font-mono">
                    {customAmount} <span className="text-xs font-bold text-stone-400">ml</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 active:scale-98 transition-all shadow-lg shadow-stone-900/10"
              >
                Add {customAmount} ml
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};
