'use client';

import React, { useState } from 'react';
import { BEVERAGES } from '../store/hydrationStore';
import { BeverageType } from '../types';
import { Plus, X } from 'lucide-react';

interface QuickLogBarProps {
  onLogDrink: (type: BeverageType, amountMl?: number) => void;
}

export const QuickLogBar: React.FC<QuickLogBarProps> = ({ onLogDrink }) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customType, setCustomType] = useState<BeverageType>('water');
  const [customAmount, setCustomAmount] = useState(300);

  const handleQuickTap = (type: BeverageType) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(18);
      } catch (e) {
        // ignore
      }
    }
    onLogDrink(type);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogDrink(customType, customAmount);
    setIsCustomOpen(false);
  };

  const beverageList: BeverageType[] = ['water', 'green_tea', 'coffee', 'juice', 'electrolyte'];

  return (
    <>
      {/* Floating Bottom Dock Bar */}
      <div className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none flex justify-center">
        <div className="w-full max-w-md pointer-events-auto bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-2.5 shadow-2xl flex items-center justify-between gap-2">
          {beverageList.map((type) => {
            const item = BEVERAGES[type];
            return (
              <button
                key={type}
                onClick={() => handleQuickTap(type)}
                className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl hover:bg-stone-100 active:scale-90 transition-all duration-150 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-[11px] font-bold text-stone-700 mt-1 whitespace-nowrap">
                  +{item.defaultAmount}
                </span>
                <span className="text-[9px] text-stone-400 font-medium">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}

          {/* Plus Custom Button */}
          <button
            onClick={() => setIsCustomOpen(true)}
            className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center hover:bg-sky-500 active:scale-95 transition-all shadow-md flex-shrink-0"
            title="Custom volume"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Custom Amount Modal */}
      {isCustomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-stone-100 relative">
            <button
              onClick={() => setIsCustomOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-800 mb-4">Log Custom Beverage</h3>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
                  Select Drink Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(BEVERAGES).map((key) => {
                    const b = BEVERAGES[key as BeverageType];
                    const isSelected = customType === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setCustomType(key as BeverageType)}
                        className={`flex flex-col items-center p-2.5 rounded-2xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-sm'
                            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span className="text-xl mb-1">{b.icon}</span>
                        <span>{b.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Volume Amount
                  </label>
                  <span className="text-sm font-bold text-sky-700">{customAmount} ml</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>50 ml</span>
                  <span>500 ml</span>
                  <span>1,000 ml</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-sky-600 text-white font-bold text-sm hover:bg-sky-500 active:scale-98 transition-all shadow-md shadow-sky-600/20"
              >
                Splash +{customAmount} ml into Pool
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
