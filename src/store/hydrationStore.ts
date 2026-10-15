'use client';

import { useState, useEffect } from 'react';
import { 
  BeverageConfig, 
  BeverageType, 
  DrinkLog, 
  CapySkin, 
  SkinConfig, 
  MascotId, 
  MascotConfig 
} from '../types';

export const MASCOTS: Record<MascotId, MascotConfig> = {
  capybara: {
    id: 'capybara',
    name: 'Chill Capy',
    species: 'Capybara',
    tagline: 'Zen king of warm onsen hot springs',
    emoji: '🦫',
    badge: 'HERO',
  },
  otter: {
    id: 'otter',
    name: 'Floaty Otter',
    species: 'Sea Otter',
    tagline: 'Drifting on cool river ripples',
    emoji: '🦦',
    badge: 'CHILL',
  },
  duckie: {
    id: 'duckie',
    name: 'Bath Duckie',
    species: 'Rubber Duck',
    tagline: 'Faithful yellow bathwater buddy',
    emoji: '🐥',
    badge: 'COZY',
  },
};

export const BEVERAGES: Record<BeverageType, BeverageConfig> = {
  water: {
    type: 'water',
    label: 'Water',
    icon: '💧',
    color: '#0284C7', // Sky blue
    lightColor: '#BAE6FD',
    hydrationFactor: 1.0,
    defaultAmount: 250,
  },
  green_tea: {
    type: 'green_tea',
    label: 'Green Tea',
    icon: '🍵',
    color: '#059669', // Emerald
    lightColor: '#A7F3D0',
    hydrationFactor: 0.95,
    defaultAmount: 200,
  },
  coffee: {
    type: 'coffee',
    label: 'Coffee',
    icon: '☕',
    color: '#92400E', // Amber brown
    lightColor: '#FDE68A',
    hydrationFactor: 0.8,
    defaultAmount: 150,
  },
  juice: {
    type: 'juice',
    label: 'Fresh Juice',
    icon: '🧃',
    color: '#EA580C', // Orange
    lightColor: '#FED7AA',
    hydrationFactor: 0.85,
    defaultAmount: 250,
  },
  electrolyte: {
    type: 'electrolyte',
    label: 'Electrolyte',
    icon: '⚡',
    color: '#06B6D4', // Cyan
    lightColor: '#CFFAFE',
    hydrationFactor: 1.1,
    defaultAmount: 350,
  },
  soda: {
    type: 'soda',
    label: 'Sparkling',
    icon: '🫧',
    color: '#6366F1', // Indigo
    lightColor: '#E0E7FF',
    hydrationFactor: 0.7,
    defaultAmount: 330,
  },
};

export const CAPY_SKINS: Record<CapySkin, SkinConfig> = {
  onsen: {
    id: 'onsen',
    name: 'Onsen Chill Capy',
    subtitle: 'Classic hot spring relaxation with floating yuzu',
    emoji: '♨️',
    badge: 'HERO',
    unlocked: true,
  },
  farmer: {
    id: 'farmer',
    name: 'Straw Hat Farmer',
    subtitle: 'Harvesting fresh morning dew in the fields',
    emoji: '🌾',
    badge: 'STREAK',
    unlocked: true,
  },
  resort: {
    id: 'resort',
    name: 'Resort Shades Capy',
    subtitle: 'Chilling poolside with retro shades',
    emoji: '🕶️',
    badge: 'CHALLENGE',
    unlocked: true,
  },
  duckie: {
    id: 'duckie',
    name: 'Rubber Duckie Buddy',
    subtitle: 'Floating companionship in warm bubbles',
    emoji: '🐥',
    badge: 'MASTER',
    unlocked: true,
  },
};

const DEFAULT_GOAL = 2200; // ml

export function useHydration() {
  const [goalMl, setGoalMl] = useState<number>(DEFAULT_GOAL);
  const [logs, setLogs] = useState<DrinkLog[]>([]);
  const [streakDays, setStreakDays] = useState<number>(5);
  const [activeSkin, setActiveSkin] = useState<CapySkin>('onsen');
  const [activeMascot, setActiveMascot] = useState<MascotId>('capybara');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on client
  useEffect(() => {
    try {
      const savedGoal = localStorage.getItem('hydrocapy_goal');
      const savedLogs = localStorage.getItem('hydrocapy_logs');
      const savedStreak = localStorage.getItem('hydrocapy_streak');
      const savedSkin = localStorage.getItem('hydrocapy_skin') as CapySkin | null;
      const savedMascot = localStorage.getItem('hydrocapy_mascot') as MascotId | null;
      const savedOnboarded = localStorage.getItem('hydrocapy_onboarded');

      if (savedGoal) setGoalMl(Number(savedGoal));
      if (savedSkin && CAPY_SKINS[savedSkin]) setActiveSkin(savedSkin);
      if (savedMascot && MASCOTS[savedMascot]) setActiveMascot(savedMascot);
      if (savedOnboarded !== null) {
        setIsOnboarded(savedOnboarded === 'true');
      } else {
        // First-time visitor: trigger onboarding
        setIsOnboarded(false);
      }
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      } else {
        // Initial mock logs for a realistic day
        const mockLogs: DrinkLog[] = [
          { id: '1', type: 'water', amountMl: 300, timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
          { id: '2', type: 'coffee', amountMl: 150, timestamp: new Date(Date.now() - 3.5 * 3600000).toISOString(), caffeineMg: 80 },
          { id: '3', type: 'water', amountMl: 250, timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
          { id: '4', type: 'green_tea', amountMl: 200, timestamp: new Date(Date.now() - 40 * 60000).toISOString(), caffeineMg: 30 },
        ];
        setLogs(mockLogs);
      }
      if (savedStreak) setStreakDays(Number(savedStreak));
    } catch (e) {
      console.warn('Storage access unavailable', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('hydrocapy_goal', goalMl.toString());
      localStorage.setItem('hydrocapy_logs', JSON.stringify(logs));
      localStorage.setItem('hydrocapy_streak', streakDays.toString());
      localStorage.setItem('hydrocapy_skin', activeSkin);
      localStorage.setItem('hydrocapy_mascot', activeMascot);
      localStorage.setItem('hydrocapy_onboarded', isOnboarded.toString());
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [goalMl, logs, streakDays, activeSkin, activeMascot, isOnboarded, isLoaded]);

  const completeOnboarding = (mascot?: MascotId, goal?: number) => {
    if (mascot) setActiveMascot(mascot);
    if (goal) setGoalMl(goal);
    setIsOnboarded(true);
    try {
      localStorage.setItem('hydrocapy_onboarded', 'true');
    } catch (e) {
      // ignore
    }
  };

  const resetOnboarding = () => {
    setIsOnboarded(false);
    try {
      localStorage.setItem('hydrocapy_onboarded', 'false');
    } catch (e) {
      // ignore
    }
  };

  const addDrink = (type: BeverageType, amountMl?: number) => {
    const config = BEVERAGES[type];
    const amount = amountMl || config.defaultAmount;
    const newLog: DrinkLog = {
      id: Date.now().toString(),
      type,
      amountMl: amount,
      timestamp: new Date().toISOString(),
      caffeineMg: type === 'coffee' ? 80 : type === 'green_tea' ? 30 : 0,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const removeLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const resetToday = () => {
    setLogs([]);
  };

  // Total effective hydration considering hydration factors
  const currentMl = logs.reduce((sum, item) => sum + item.amountMl, 0);
  const percentage = Math.min(100, Math.round((currentMl / goalMl) * 100));

  // Breakdown by beverage type
  const breakdown = Object.keys(BEVERAGES).map((key) => {
    const type = key as BeverageType;
    const amount = logs.filter((l) => l.type === type).reduce((sum, l) => sum + l.amountMl, 0);
    return {
      type,
      amount,
      percentage: currentMl > 0 ? Math.round((amount / currentMl) * 100) : 0,
      config: BEVERAGES[type],
    };
  }).filter((item) => item.amount > 0);

  // Hourly pacing delta: Compare against linear expected intake between 8am and 10pm (14 active hours)
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const activeHoursElapsed = Math.max(0, Math.min(14, currentHour - 8));
  const expectedPacingMl = Math.round((activeHoursElapsed / 14) * goalMl);
  const pacingDeltaMl = currentMl - expectedPacingMl;

  return {
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
    pacingDeltaMl,
    expectedPacingMl,
  };
}
