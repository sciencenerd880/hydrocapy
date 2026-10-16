'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BEVERAGES } from '../store/hydrationStore';
import { BeverageType, CapySkin, MascotId } from '../types';
import { MASCOTS } from '../store/hydrationStore';
import { 
  WaterIcon, 
  TeaIcon, 
  CoffeeIcon, 
  JuiceIcon, 
  ElectrolyteIcon 
} from './DrinkIcons';
import { VesselModal } from './VesselModal';
import { Plus, Sparkles, ChevronRight } from 'lucide-react';

interface QuickLogBarProps {
  onLogDrink: (type: BeverageType, amountMl?: number) => void;
  onOpenWardrobe: () => void;
  streakDays: number;
  activeSkin: CapySkin;
  activeMascot?: MascotId;
}

interface FlyingDroplet {
  id: number;
  startX: number;
  startY: number;
  color: string;
}

export const QuickLogBar: React.FC<QuickLogBarProps> = ({
  onLogDrink,
  onOpenWardrobe,
  streakDays,
  activeSkin,
  activeMascot = 'capybara',
}) => {
  const [selectedDrinkForVessel, setSelectedDrinkForVessel] = useState<BeverageType | null>(null);
  const [flyingDroplets, setFlyingDroplets] = useState<FlyingDroplet[]>([]);

  const handleOpenVesselModal = (type: BeverageType) => {
    setSelectedDrinkForVessel(type);
  };

  const handleConfirmVesselLog = (type: BeverageType, amountMl: number) => {
    // Trigger flying splash animation
    const dropletId = Date.now();
    const color = BEVERAGES[type].color;

    if (typeof window !== 'undefined') {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight - 80;

      setFlyingDroplets((prev) => [
        ...prev,
        {
          id: dropletId,
          startX: centerX,
          startY: centerY,
          color,
        },
      ]);

      setTimeout(() => {
        setFlyingDroplets((prev) => prev.filter((d) => d.id !== dropletId));
      }, 700);
    }

    onLogDrink(type, amountMl);
  };

  const handleLogDroplet = (type: BeverageType, amountMl: number) => {
    handleConfirmVesselLog(type, amountMl);
  };

  const beverageButtons: { type: BeverageType; Icon: React.FC<{ size?: number }>; label: string; amount: number }[] = [
    { type: 'water', Icon: WaterIcon, label: 'Water', amount: 250 },
    { type: 'green_tea', Icon: TeaIcon, label: 'Tea', amount: 200 },
    { type: 'coffee', Icon: CoffeeIcon, label: 'Coffee', amount: 150 },
    { type: 'juice', Icon: JuiceIcon, label: 'Juice', amount: 250 },
    { type: 'electrolyte', Icon: ElectrolyteIcon, label: 'Hydrate', amount: 350 },
  ];

  const avatarEmoji = MASCOTS[activeMascot]?.emoji || '🦫';

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
              y: -240,
              scale: [0.6, 1.5, 0.2],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="pointer-events-none w-6 h-6 rounded-full"
            style={{
              backgroundColor: droplet.color,
              boxShadow: `0 0 18px ${droplet.color}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Floating Bottom Section (Challenge Banner + Dock) */}
      <div className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none flex flex-col items-center gap-2">
        {/* 1. 7-Day Onsen Challenge Banner (Waterllama Screen 11 Style) */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={onOpenWardrobe}
          className="pointer-events-auto bg-[#E8F5E9]/90 backdrop-blur-md border border-emerald-200/80 rounded-full px-4 py-1.5 shadow-sm flex items-center justify-between gap-3 text-emerald-950 transition-all hover:bg-[#E8F5E9]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🍊</span>
            <span className="text-xs font-black tracking-tight">
              7-Day Onsen Streak • Day {Math.min(7, streakDays)} of 7
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
            <span>Wardrobe</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </motion.button>

        {/* 2. Floating Tactile Dock */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-sm pointer-events-auto bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-full py-2 px-3 shadow-xl shadow-stone-200/60 flex items-center justify-between gap-1"
        >
          {/* Avatar Profile Button (Waterllama Mascot Dock Icon) */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.08 }}
            onClick={onOpenWardrobe}
            className="w-10 h-10 rounded-full bg-amber-100/90 border border-amber-300 flex items-center justify-center text-lg flex-shrink-0 shadow-xs hover:bg-amber-200 transition-colors mr-0.5"
            title="Capy Wardrobe & Skins"
          >
            <span>{avatarEmoji}</span>
          </motion.button>

          {/* Beverage Quick Log Buttons (1-Tap Fast Log) */}
          {beverageButtons.map(({ type, Icon, label, amount }) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.84, y: 1 }}
              whileHover={{ scale: 1.06 }}
              transition={{ type: 'spring', stiffness: 450, damping: 18 }}
              onClick={() => handleLogDroplet(type, amount)}
              className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl hover:bg-stone-50 active:bg-stone-100 transition-colors group relative"
              title={`Quick log +${amount}ml ${label}`}
            >
              <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
                <Icon size={24} />
              </div>
              <span className="text-[10px] font-black text-stone-700 tracking-tight mt-0.5">
                +{amount}
              </span>
            </motion.button>
          ))}

          {/* Plus / Vessel Quick Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => handleOpenVesselModal('water')}
            className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-md flex-shrink-0 ml-0.5"
            title="Select Vessel & Log"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </motion.button>
        </motion.div>
      </div>

      {/* Tactile Vessel Selector Modal */}
      {selectedDrinkForVessel && (
        <VesselModal
          isOpen={true}
          onClose={() => setSelectedDrinkForVessel(null)}
          beverageType={selectedDrinkForVessel}
          onConfirmLog={handleConfirmVesselLog}
        />
      )}
    </>
  );
};
